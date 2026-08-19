import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

import { startAssessment } from "@/services/assessment.service";

function getUserId(
  request: NextRequest
): bigint {

  const token =
    request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload =
    verifyToken(token);

  return BigInt(payload.user_id);

}

export async function POST(
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
        "Lengkapi biodata terlebih dahulu.",
        400
      );

    }

    if (!biodata.profession_id) {
      return failed(
        "Pilih profesi pada biodata terlebih dahulu.",
        400
      );
    }

    const assessment =
      await startAssessment(
        biodata.biodata_id
      );

    return success(
      serialize(
        assessment
      ),
      "Assessment dimulai."
    );

  } catch (error: any) {

    console.error(error);

    return failed(
      error.message,
      500
    );

  }
}
