import { NextRequest, NextResponse } from "next/server";

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
    });

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
