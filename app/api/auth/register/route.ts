import { NextRequest } from "next/server";

import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

import { RegisterSchema } from "@/validations/auth";

import { registerAccount } from "@/services/auth.service";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const data =
      RegisterSchema.parse(body);

    const account =
      await registerAccount(data);

    return success(
      serialize(account),
      "Register berhasil"
    );
  } catch (error: any) {
    console.error(error);

    if (error.name === "ZodError") {
      return failed(
        error.errors[0].message,
        400
      );
    }

    if (
      error.message === "EMAIL_EXISTS"
    ) {
      return failed(
        "Email sudah digunakan.",
        400
      );
    }

    return failed(
      "Terjadi kesalahan server.",
      500
    );
  }
}