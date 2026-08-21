import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { failed, success } from "@/lib/response";
import { serialize } from "@/lib/serializer";
import { getNextQuestion, getProgress, saveAnswer } from "@/services/assessment.service";
import { calculateDimensionResult, calculateProfessionResult } from "@/services/assessment-result.service";

async function getOwner(token: string) {
  return prisma.biodata.findUnique({
    where: { assessment_share_token: token },
    include: { profession: true },
  });
}

async function getSession(shareToken: string, sessionToken: string) {
  return prisma.assessment.findFirst({
    where: {
      public_session_token: sessionToken,
      assessment_type: "EXTERNAL",
      biodata: { assessment_share_token: shareToken },
    },
    include: { biodata: true },
  });
}

export async function GET(_request: Request, context: RouteContext<"/api/public-assessment/[token]">) {
  const { token } = await context.params;
  const owner = await getOwner(token);
  if (!owner) return failed("Tautan penilaian tidak valid.", 404);

  return success({
    ownerName: owner.nama_lengkap ?? "pemilik profil",
    profession: owner.profession?.profession_name ?? null,
  });
}

export async function POST(request: Request, context: RouteContext<"/api/public-assessment/[token]">) {
  try {
    const { token } = await context.params;
    const owner = await getOwner(token);
    if (!owner || !owner.profession_id) return failed("Tautan penilaian tidak valid.", 404);

    const body = await request.json();
    const evaluatorName = String(body.evaluator_name ?? "").trim();
    const relationship = String(body.evaluator_relationship ?? "").trim();
    if (evaluatorName.length < 2 || evaluatorName.length > 120) return failed("Nama penilai harus diisi.", 400);
    if (relationship.length < 2 || relationship.length > 80) return failed("Hubungan dengan pemilik profil harus diisi.", 400);

    const assessment = await prisma.assessment.create({
      data: {
        biodata_id: owner.biodata_id,
        status: "DRAFT",
        started_at: new Date(),
        assessment_type: "EXTERNAL",
        evaluator_name: evaluatorName,
        evaluator_relationship: relationship,
        public_session_token: randomBytes(24).toString("hex"),
      },
    });

    return success(serialize({ sessionToken: assessment.public_session_token }), "Penilaian dimulai.");
  } catch {
    return failed("Gagal memulai penilaian.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext<"/api/public-assessment/[token]">) {
  try {
    const { token } = await context.params;
    const body = await request.json();
    const sessionToken = String(body.session_token ?? "");
    const session = await getSession(token, sessionToken);
    if (!session || !session.biodata.profession_id) return failed("Sesi penilaian tidak valid.", 401);
    if (session.status !== "DRAFT") return failed("Penilaian ini sudah selesai.", 409);

    if (body.action === "answer") {
      const questionId = String(body.question_id ?? "");
      const answerValue = Number(body.answer_value);
      if (!/^\d+$/.test(questionId) || !Number.isInteger(answerValue) || answerValue < 1 || answerValue > 5) {
        return failed("Jawaban tidak valid.", 400);
      }

      const question = await prisma.question.findFirst({
        where: {
          question_id: BigInt(questionId),
          dimension: { profession_id: session.biodata.profession_id },
        },
      });
      if (!question) return failed("Pertanyaan tidak valid.", 400);
      await saveAnswer(session.assessment_id, question.question_id, answerValue);
    }

    if (body.action === "finish") {
      const progress = await getProgress(session.assessment_id, session.biodata.profession_id);
      if (progress.total === 0 || progress.answered !== progress.total) return failed("Semua pertanyaan harus dijawab.", 400);
      await calculateDimensionResult(session.assessment_id);
      await calculateProfessionResult(session.assessment_id);
      await prisma.assessment.update({
        where: { assessment_id: session.assessment_id },
        data: { status: "COMPLETED", completed_at: new Date() },
      });
      return success({ completed: true }, "Penilaian berhasil dikirim.");
    }

    if (body.action !== "question" && body.action !== "answer") {
      return failed("Aksi penilaian tidak valid.", 400);
    }

    const question = await getNextQuestion(session.assessment_id, session.biodata.profession_id);
    const progress = await getProgress(session.assessment_id, session.biodata.profession_id);
    return success(serialize({ question, progress }), "Berhasil.");
  } catch {
    return failed("Gagal memproses penilaian.", 500);
  }
}
