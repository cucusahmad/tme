import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

import {
  getCurrentAssessment,
  saveAnswer,
} from "@/services/assessment.service";

function getUserId(request: NextRequest): bigint {
  const token =
    request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = verifyToken(token);

  return BigInt(payload.user_id);
}

export async function POST(
  request: NextRequest
) {
  try {

    const userId =
      getUserId(request);

    const body =
      await request.json();

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

    const answer =
      await saveAnswer(
        assessment.assessment_id,
        BigInt(body.question_id),
        Number(body.answer_value)
      );

    return success(
      serialize(answer),
      "Jawaban berhasil disimpan."
    );

  } catch (error: any) {

    console.error(error);

    return failed(
      error.message,
      500
    );

  }
}