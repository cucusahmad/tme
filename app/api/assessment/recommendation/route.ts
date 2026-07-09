import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

import { verifyToken } from "@/lib/jwt";
import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

import { getRecommendation } from "@/services/recommendation.service";

function getUserId(request: NextRequest): bigint {

  const token =
    request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = verifyToken(token);

  return BigInt(payload.user_id);

}

export async function GET(
  request: NextRequest
) {
  try {

    const userId =
      getUserId(request);

    const biodata =
      await prisma.biodata.findUnique({

        where: {

          user_id: userId,

        },

      });

    if (!biodata) {

      return failed(
        "Biodata tidak ditemukan.",
        400
      );

    }

    const recommendation =
      await getRecommendation(
        biodata.biodata_id
      );

    return success(
      serialize(recommendation),
      "Berhasil mengambil rekomendasi AI."
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