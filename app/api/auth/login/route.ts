import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { LoginSchema } from "@/validations/auth-login";
import { loginAccount } from "@/services/auth.service";
import { serialize } from "@/lib/serializer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = LoginSchema.parse(body);

    const result = await loginAccount(data);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: serialize(result.user),
      redirectTo: result.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard",
    });

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0]?.message ?? "Data login tidak valid",
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "INVALID_CREDENTIAL") {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "ACCOUNT_DISABLED") {
      return NextResponse.json(
        {
          success: false,
          message: "Akun tidak aktif. Hubungi administrator.",
        },
        { status: 403 }
      );
    }

    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat login",
      },
      {
        status: 500,
      }
    );
  }
}
