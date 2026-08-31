import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

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
