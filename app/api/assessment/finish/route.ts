import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";
import { getCurrentAssessment } from "@/services/assessment.service";
import {
  calculateDimensionResult,
  calculateProfessionResult,
} from "@/services/assessment-result.service";

function getUserId(request: NextRequest): bigint {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  const payload = verifyToken(token);
  return BigInt(payload.user_id);
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);

    const biodata = await prisma.biodata.findUnique({
      where: { user_id: userId },
    });

    if (!biodata) {
      return failed("Lengkapi biodata terlebih dahulu.", 400);
    }

    // Pastikan profession_id sudah diisi oleh user sebelum finish
    if (!biodata.profession_id) {
      return failed("Anda belum memilih profesi target di biodata Anda.", 400);
    }

    const assessment = await getCurrentAssessment(biodata.biodata_id);

    if (!assessment) {
      return failed("Assessment aktif tidak ditemukan.", 400);
    }

    /*
    |--------------------------------------------------------------------------
    | Hitung Nilai Dimensi & Talent Match
    |--------------------------------------------------------------------------
    | Pengecekan (totalAnswer < totalQuestion) dihilangkan karena validasi 
    | progress sudah ditangani di sisi Client (Frontend) via Tombol Konfirmasi.
    */
    await calculateDimensionResult(assessment.assessment_id);
    await calculateProfessionResult(assessment.assessment_id);

    /*
    |--------------------------------------------------------------------------
    | Update Status Assessment
    |--------------------------------------------------------------------------
    */
    const completed = await prisma.assessment.update({
      where: { assessment_id: assessment.assessment_id },
      data: {
        status: "COMPLETED",
        completed_at: new Date(),
      },
    });

    return success(
      serialize(completed),
      "Assessment berhasil diselesaikan."
    );

  } catch (error: any) {
    console.error("❌ ERROR PADA API FINISH:", error);

    if (error.message === "UNAUTHORIZED") {
      return failed("Unauthorized", 401);
    }
    
    if (error.message === "PROFESSION_NOT_SELECTED") {
      return failed("Profesi belum dipilih pada biodata.", 400);
    }

    return failed(error.message || "Terjadi kesalahan internal server.", 500);
  }
}