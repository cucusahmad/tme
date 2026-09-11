"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireMember } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export type MembershipActionState = { success: boolean; message: string };
const idSchema = z.string().regex(/^[1-9]\d*$/).transform(BigInt).refine(id => id <= BigInt("9223372036854775807"));

function refresh() {
  revalidatePath("/dashboard", "layout");
}

async function activeMember(tx: Prisma.TransactionClient, userId: bigint) {
  const user = await tx.users.findUnique({ where: { user_id: userId }, include: { organization: true } });
  if (!user?.is_active || user.role !== "USER") throw new Error("Akun tidak aktif.");
  return user;
}

export async function requestOrganization(_state: MembershipActionState, form: FormData): Promise<MembershipActionState> {
  const session = await requireMember();
  const id = idSchema.safeParse(form.get("organizationId"));
  if (!id.success) return { success: false, message: "Pilih organisasi yang valid." };
  try {
    const result = await prisma.$transaction(async tx => {
      const user = await activeMember(tx, session.user_id);
      const organization = await tx.organization.findUnique({ where: { organization_id: id.data } });
      if (!organization?.is_active) return { success: false, message: "Organisasi tidak tersedia." };
      if (user.organization_id === id.data) return { success: false, message: "Anda sudah menjadi anggota organisasi ini." };
      const pending = await tx.organization_join_request.findUnique({ where: { user_id: user.user_id } });
      if (pending?.status === "PENDING") return { success: false, message: "Masih ada permintaan menunggu persetujuan. Batalkan terlebih dahulu untuk memilih organisasi lain." };
      await tx.organization_join_request.upsert({
        where: { user_id: user.user_id },
        create: { user_id: user.user_id, organization_id: id.data, created_at: new Date() },
        update: { organization_id: id.data, status: "PENDING", created_at: new Date(), reviewed_at: null, reviewed_by: null },
      });
      return { success: true, message: "Permintaan dikirim. Tunggu persetujuan supervisor organisasi." };
    }, { isolationLevel: "Serializable" });
    if (result.success) refresh();
    return result;
  } catch {
    return { success: false, message: "Permintaan gagal dikirim. Muat ulang halaman dan coba lagi." };
  }
}

export async function cancelOrganizationRequest(_state: MembershipActionState, form: FormData): Promise<MembershipActionState> {
  const session = await requireMember();
  const id = idSchema.safeParse(form.get("requestId"));
  const requestedAt = z.iso.datetime().safeParse(form.get("requestedAt"));
  if (!id.success || !requestedAt.success) return { success: false, message: "Permintaan tidak valid." };
  try {
    const result = await prisma.organization_join_request.updateMany({
      where: { request_id: id.data, user_id: session.user_id, status: "PENDING", created_at: new Date(requestedAt.data) },
      data: { status: "CANCELLED", reviewed_at: new Date() },
    });
    refresh();
    return { success: result.count > 0, message: result.count ? "Permintaan dibatalkan." : "Permintaan sudah diproses. Muat ulang halaman." };
  } catch {
    return { success: false, message: "Gagal membatalkan permintaan. Coba lagi." };
  }
}

export async function selectMyMentor(_state: MembershipActionState, form: FormData): Promise<MembershipActionState> {
  const session = await requireMember();
  const rawId = form.get("mentorId");
  const id = rawId === "" ? null : idSchema.safeParse(rawId);
  if (id && !id.success) return { success: false, message: "Mentor tidak valid." };
  try {
    const result = await prisma.$transaction(async tx => {
      const user = await activeMember(tx, session.user_id);
      if (!user.organization_id || !user.organization?.is_active) return { success: false, message: "Keanggotaan organisasi harus disetujui terlebih dahulu." };
      if (id?.success) {
        const mentor = await tx.users.findUnique({ where: { user_id: id.data } });
        if (!mentor?.is_active || mentor.role !== "USER" || mentor.user_id === user.user_id || mentor.organization_id !== user.organization_id) {
          return { success: false, message: "Pilih anggota aktif lain dalam organisasi Anda sebagai mentor." };
        }
      }
      await tx.users.update({ where: { user_id: user.user_id }, data: { mentor_id: id?.success ? id.data : null, updated_at: new Date() } });
      return { success: true, message: "Mentor berhasil disimpan." };
    }, { isolationLevel: "Serializable" });
    if (result.success) refresh();
    return result;
  } catch {
    return { success: false, message: "Mentor gagal disimpan. Muat ulang halaman dan coba lagi." };
  }
}

export async function reviewOrganizationRequest(_state: MembershipActionState, form: FormData): Promise<MembershipActionState> {
  const session = await requireMember();
  const id = idSchema.safeParse(form.get("requestId"));
  const requestedAt = z.iso.datetime().safeParse(form.get("requestedAt"));
  const decision = form.get("decision");
  if (!id.success || !requestedAt.success || (decision !== "APPROVED" && decision !== "REJECTED")) return { success: false, message: "Permintaan atau keputusan tidak valid." };
  try {
    const result = await prisma.$transaction(async tx => {
      const supervisor = await activeMember(tx, session.user_id);
      if (supervisor.organization_role !== "SUPERVISOR" || !supervisor.organization_id || !supervisor.organization?.is_active) {
        return { success: false, message: "Hanya supervisor organisasi yang dapat memproses permintaan." };
      }
      const request = await tx.organization_join_request.findUnique({ where: { request_id: id.data } });
      if (!request || request.status !== "PENDING" || request.created_at.toISOString() !== requestedAt.data || request.organization_id !== supervisor.organization_id || request.user_id === supervisor.user_id) {
        return { success: false, message: "Permintaan tidak tersedia atau sudah diproses." };
      }
      if (decision === "APPROVED") {
        const applicant = await activeMember(tx, request.user_id);
        if (applicant.organization_id !== request.organization_id) {
          await tx.users.updateMany({ where: { mentor_id: applicant.user_id }, data: { mentor_id: null, updated_at: new Date() } });
          await tx.users.update({
            where: { user_id: applicant.user_id },
            data: { organization_id: request.organization_id, organization_role: "MEMBER", mentor_id: null, updated_at: new Date() },
          });
        }
      }
      await tx.organization_join_request.update({ where: { request_id: request.request_id }, data: { status: decision, reviewed_by: supervisor.user_id, reviewed_at: new Date() } });
      return { success: true, message: decision === "APPROVED" ? "Permintaan disetujui. Pengguna sudah menjadi anggota organisasi." : "Permintaan ditolak." };
    }, { isolationLevel: "Serializable" });
    if (result.success) refresh();
    return result;
  } catch {
    return { success: false, message: "Permintaan gagal diproses. Muat ulang halaman dan coba lagi." };
  }
}
