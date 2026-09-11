import { NextRequest } from "next/server";

import { getBiodata, saveBiodata } from "@/services/biodata.service";

import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";
import { verifyToken } from "@/lib/jwt";
import { BiodataSchema } from "@/validations/biodata";

function getUserId(request: NextRequest): bigint {
  const token =
    request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = verifyToken(token);

  return BigInt(payload.user_id);
}

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

export async function GET(
  request: NextRequest
) {
  try {
    const userId = getUserId(request);

    const biodata =
      await getBiodata(userId);

    return success(
      serialize(biodata),
      "Berhasil mengambil biodata."
    );
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error && error.message === "UNAUTHORIZED"
    ) {
      return failed(
        "Unauthorized",
        401
      );
    }

    return failed(
      "Terjadi kesalahan server.",
      500
    );
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

export async function PUT(
  request: NextRequest
) {
  try {
    const userId = getUserId(request);

    let body = await request.json();
    const parsed = BiodataSchema.safeParse(body);
    if (!parsed.success) return failed("Data biodata tidak valid.", 400);
    // Strip unrelated fields and nested Prisma operations before saving profile data.
    body = parsed.data;
    if (body.tanggal_lahir) {
  body.tanggal_lahir = new Date(
    `${body.tanggal_lahir}T00:00:00.000Z`
  );
}

    body.education_level_id =
      body.education_level_id != null
        ? BigInt(body.education_level_id)
        : null;

    body.profession_id =
      body.profession_id != null
        ? BigInt(body.profession_id)
        : null;

    const biodata = await saveBiodata(
      userId,
      body
    );

    return success(
      serialize(biodata),
      "Biodata berhasil disimpan."
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return failed("Unauthorized", 401);
    }

    return failed(
      "Gagal menyimpan biodata.",
      500
    );
  }
}
