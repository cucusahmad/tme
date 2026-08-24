import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

import {
  getCurrentAssessment,
  saveOptionAnswer,
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

    if (!biodata.profession_id) {
      return failed("Pilih profesi terlebih dahulu.", 400);
    }

    const questionId = String(body.question_id ?? "");
    const optionId = Number(body.option_id);

    if (!/^\d+$/.test(questionId) || !Number.isInteger(optionId)) {
      return failed("Jawaban tidak valid.", 400);
    }

    const answer =
      await saveOptionAnswer(
        assessment.assessment_id,
        biodata.profession_id,
        BigInt(questionId),
        optionId
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
