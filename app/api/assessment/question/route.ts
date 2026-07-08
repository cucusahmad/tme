import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

import { verifyToken } from "@/lib/jwt";

import {
  success,
  failed,
} from "@/lib/response";

import { serialize } from "@/lib/serializer";

import {
  getCurrentAssessment,
  getNextQuestion,
  getProgress,
} from "@/services/assessment.service";

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
        "Lengkapi biodata terlebih dahulu.",
        400
      );
    }

    const assessment =
      await getCurrentAssessment(
        biodata.biodata_id
      );

    if (!assessment) {
      return failed(
        "Assessment belum dimulai.",
        400
      );
    }

    const question =
      await getNextQuestion(
        assessment.assessment_id,
        biodata.profession_id!
      );

    const progress =
      await getProgress(
        assessment.assessment_id,
        biodata.profession_id!
      );

    return success(
      serialize({
        assessment,
        progress,
        question,
      }),
      "Berhasil."
    );
  } catch (error: any) {
    console.error(error);

    return failed(
      error.message,
      500
    );
  }
}