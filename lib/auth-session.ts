import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function requireActiveUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/auth/login");
  let userId: bigint;
  try {
    userId = BigInt(verifyToken(token).user_id);
  } catch {
    redirect("/auth/login");
  }
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true, email: true, role: true, is_active: true,
      organization_id: true, organization_role: true, mentor_id: true,
      organization: { select: { name: true, is_active: true } },
    },
  });
  if (!user?.is_active) redirect("/auth/login");
  return user;
}

export async function requireMember() {
  const user = await requireActiveUser();
  if (user.role !== "USER") redirect("/dashboard/admin");
  return user;
}

export async function requireSupervisor() {
  const user = await requireMember();
  if (!user.organization_id || user.organization_role !== "SUPERVISOR" || !user.organization?.is_active) {
    redirect("/dashboard/organization");
  }
  return { ...user, organization_id: user.organization_id };
}

export async function requireAdmin() {
  const token = (await cookies()).get("token")?.value;

  if (!token) redirect("/auth/login");

  let payload: ReturnType<typeof verifyToken>;

  try {
    payload = verifyToken(token);
  } catch {
    redirect("/auth/login");
  }

  let userId: bigint;

  try {
    userId = BigInt(payload.user_id);
  } catch {
    redirect("/auth/login");
  }

  const admin = await prisma.users.findUnique({
    where: { user_id: userId },
    select: { user_id: true, email: true, role: true, is_active: true },
  });

  if (!admin || !admin.is_active) {
    redirect("/auth/login");
  }

  if (admin.role.trim().toUpperCase() !== "ADMIN") redirect("/dashboard");

  return admin;
}
