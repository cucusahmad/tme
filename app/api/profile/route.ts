import { NextRequest } from "next/server";

import { getBiodata, saveBiodata } from "@/services/biodata.service";

import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";
import { verifyToken } from "@/lib/jwt";

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
  } catch (error: any) {
    console.error(error);

    if (
      error.message === "UNAUTHORIZED"
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

    const body = await request.json();
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
  } catch (error: any) {
    console.error(error);

    if (error.message === "UNAUTHORIZED") {
      return failed("Unauthorized", 401);
    }

    return failed(
      error.message,
      500
    );
  }
}