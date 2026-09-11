"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export type OrganizationActionState = { success: boolean; message: string };
const idSchema = z.string().regex(/^[1-9]\d*$/).transform(BigInt).refine(id => id <= BigInt("9223372036854775807"));
const organizationSchema = z.object({
  name: z.string().trim().min(1, "Nama organisasi wajib diisi.").max(150),
  description: z.string().trim().max(2000),
});

function refresh() {
  revalidatePath("/dashboard/admin/organizations");
  revalidatePath("/dashboard/admin/users");
}

export async function saveOrganization(_state: OrganizationActionState, form: FormData): Promise<OrganizationActionState> {
  await requireAdmin();
  const parsed = organizationSchema.safeParse({ name: form.get("name"), description: form.get("description") });
  const rawId = form.get("organizationId");
  const id = rawId ? idSchema.safeParse(rawId) : null;
  if (!parsed.success || (id && !id.success)) return { success: false, message: "Isi nama organisasi (maksimal 150 karakter) dan deskripsi maksimal 2000 karakter." };
  try {
    const data = { name: parsed.data.name, description: parsed.data.description || null };
    if (id?.success) await prisma.organization.update({ where: { organization_id: id.data }, data });
    else await prisma.organization.create({ data });
    refresh();
    return { success: true, message: "Organisasi berhasil disimpan." };
  } catch {
    return { success: false, message: "Organisasi gagal disimpan. Muat ulang halaman dan coba lagi." };
  }
}

export async function assignUserOrganization(_state: OrganizationActionState, form: FormData): Promise<OrganizationActionState> {
  await requireAdmin();
  const userId = idSchema.safeParse(form.get("userId"));
  const organizationId = form.get("organizationId") === "" ? null : idSchema.safeParse(form.get("organizationId"));
  if (!userId.success || (organizationId && !organizationId.success)) return { success: false, message: "Pengguna atau organisasi tidak valid." };
  try {
    const result = await prisma.$transaction(async tx => {
      if (organizationId?.success) {
        const organization = await tx.organization.findUnique({ where: { organization_id: organizationId.data } });
        if (!organization || !organization.is_active) return { success: false, message: "Organisasi tidak ditemukan atau tidak aktif." };
      }
      const user = await tx.users.findUnique({ where: { user_id: userId.data } });
      if (!user || user.role !== "USER") return { success: false, message: "Pengguna tidak ditemukan." };
      const nextOrganizationId = organizationId?.success ? organizationId.data : null;
      const changed = user.organization_id !== nextOrganizationId;
      if (changed) await tx.users.updateMany({ where: { mentor_id: userId.data }, data: { mentor_id: null, updated_at: new Date() } });
      const updated = await tx.users.updateMany({
        where: { user_id: userId.data, role: "USER" },
        data: { organization_id: nextOrganizationId, ...(changed ? { organization_role: "MEMBER" as const, mentor_id: null } : {}), updated_at: new Date() },
      });
      return updated.count ? { success: true, message: "Organisasi pengguna berhasil disimpan." } : { success: false, message: "Pengguna tidak ditemukan." };
    }, { isolationLevel: "Serializable" });
    if (result.success) refresh();
    return result;
  } catch {
    return { success: false, message: "Perubahan gagal disimpan. Muat ulang halaman dan coba lagi." };
  }
}

export async function assignUserMentor(_state: OrganizationActionState, form: FormData): Promise<OrganizationActionState> {
  await requireAdmin();
  const userId = idSchema.safeParse(form.get("userId"));
  const mentorId = form.get("mentorId") === "" ? null : idSchema.safeParse(form.get("mentorId"));
  if (!userId.success || (mentorId && !mentorId.success)) return { success: false, message: "Pengguna atau mentor tidak valid." };
  try {
    const result = await prisma.$transaction(async tx => {
      const user = await tx.users.findUnique({ where: { user_id: userId.data } });
      if (!user || user.role !== "USER") return { success: false, message: "Pengguna tidak ditemukan." };
      if (mentorId?.success) {
        const mentor = await tx.users.findUnique({ where: { user_id: mentorId.data } });
        if (!user.organization_id || !mentor || mentor.role !== "USER" || mentor.user_id === user.user_id || mentor.organization_id !== user.organization_id) {
          return { success: false, message: "Mentor harus pengguna lain dalam organisasi yang sama. Simpan organisasi terlebih dahulu." };
        }
      }
      await tx.users.update({ where: { user_id: user.user_id }, data: { mentor_id: mentorId?.success ? mentorId.data : null, updated_at: new Date() } });
      return { success: true, message: "Mentor berhasil disimpan." };
    }, { isolationLevel: "Serializable" });
    if (result.success) refresh();
    return result;
  } catch {
    return { success: false, message: "Mentor gagal disimpan. Muat ulang halaman dan coba lagi." };
  }
}

export async function saveSupervisors(_state: OrganizationActionState, form: FormData): Promise<OrganizationActionState> {
  await requireAdmin();
  const organizationId = idSchema.safeParse(form.get("organizationId"));
  const supervisorIds = z.array(idSchema).safeParse(form.getAll("supervisorIds"));
  if (!organizationId.success || !supervisorIds.success) return { success: false, message: "Organisasi atau supervisor tidak valid." };
  try {
    const result = await prisma.$transaction(async tx => {
      const organization = await tx.organization.findUnique({ where: { organization_id: organizationId.data } });
      if (!organization) return { success: false, message: "Organisasi tidak ditemukan." };
      const ids = [...new Set(supervisorIds.data)];
      const count = await tx.users.count({ where: { user_id: { in: ids }, role: "USER", organization_id: organizationId.data } });
      if (count !== ids.length) return { success: false, message: "Supervisor harus anggota organisasi ini. Muat ulang halaman." };
      await tx.users.updateMany({ where: { organization_id: organizationId.data, organization_role: "SUPERVISOR" }, data: { organization_role: "MEMBER", updated_at: new Date() } });
      await tx.users.updateMany({ where: { organization_id: organizationId.data, user_id: { in: ids }, role: "USER" }, data: { organization_role: "SUPERVISOR", updated_at: new Date() } });
      return { success: true, message: "Supervisor berhasil disimpan." };
    }, { isolationLevel: "Serializable" });
    if (result.success) refresh();
    return result;
  } catch {
    return { success: false, message: "Supervisor gagal disimpan. Muat ulang halaman dan coba lagi." };
  }
}
