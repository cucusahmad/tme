import { NextRequest } from "next/server";
import { ZodError } from "zod";

import { comparePassword, hashPassword } from "@/lib/bcrypt";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { failed, success } from "@/lib/response";
import { ChangePasswordSchema } from "@/validations/change-password";

function getUserId(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  try {
    return BigInt(verifyToken(token).user_id);
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const data = ChangePasswordSchema.parse(await request.json());
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: { password: true, is_active: true },
    });

    if (!user || !user.is_active) return failed("Sesi tidak valid.", 401);

    const passwordMatches = await comparePassword(data.currentPassword, user.password);
    if (!passwordMatches) return failed("Password saat ini tidak sesuai.", 400);

    await prisma.users.update({
      where: { user_id: userId },
      data: { password: await hashPassword(data.newPassword), updated_at: new Date() },
    });

    return success(null, "Password berhasil diubah.");
  } catch (error) {
    if (error instanceof ZodError) {
      return failed(error.issues[0]?.message ?? "Data password tidak valid.", 400);
    }
    if (error instanceof SyntaxError) return failed("Data permintaan tidak valid.", 400);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return failed("Unauthorized", 401);
    }

    console.error("Change password error:", error);
    return failed("Terjadi kesalahan server.", 500);
  }
}
