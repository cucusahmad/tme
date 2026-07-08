export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { success, failed } from "@/lib/response";

function getUserId(request: NextRequest): bigint {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  const payload = verifyToken(token);
  return BigInt(payload.user_id);
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);

    // 1. Ambil biodata user
    const biodata = await prisma.biodata.findUnique({
      where: { user_id: userId },
    });

    if (!biodata) return failed("Biodata tidak ditemukan.", 400);

    // 2. Ambil AMAN: Cari langsung data dimensi berdasarkan assessment terbaru milik biodata_id ini
    const rawDimensions = await prisma.assessment_dimension_result.findMany({
      where: {
        assessment: {
          biodata_id: biodata.biodata_id
        }
      },
      include: {
        dimension: true,
      },
      orderBy: {
        created_at: "desc" // Mengambil data yang paling baru diisi
      }
    });

    // 3. Ambil AMAN: Cari data ranking berdasarkan biodata_id ini
    const rawRanking = await prisma.assessment_result.findMany({
      where: {
        assessment: {
          biodata_id: biodata.biodata_id
        }
      },
      include: {
        profession_unit: true,
      },
      orderBy: {
        rank_order: "asc",
      },
    });

    // Jika setelah di-bypass ternyata database pusat Anda memang kosong melompong
    if (rawDimensions.length === 0) {
      return success({ recommendation: null, ranking: [], dimensions: [] }, "Data di database kosong.");
    }

    /*
    |--------------------------------------------------------------------------
    | PARSING DATA MENJADI STRING & NUMBER (ANTI-LOSS DATA)
    |--------------------------------------------------------------------------
    */
    const dimensions = rawDimensions.map((item) => ({
      assessment_dimension_id: item.assessment_dimension_id.toString(),
      assessment_id: item.assessment_id.toString(),
      dimension_id: item.dimension_id.toString(),
      score: item.score ? Number(item.score) : 0,
      percentage: item.percentage ? Number(item.percentage) : 0,
      created_at: item.created_at,
      dimension: {
        dimension_id: item.dimension.dimension_id.toString(),
        profession_id: item.dimension.profession_id.toString(),
        dimension_name: item.dimension.dimension_name,
        order_no: item.dimension.order_no,
      },
    }));

    const ranking = rawRanking.map((item) => ({
      assessment_result_id: item.assessment_result_id.toString(),
      assessment_id: item.assessment_id.toString(),
      profession_unit_id: item.profession_unit_id.toString(),
      percentage: item.percentage ? Number(item.percentage) : 0,
      rank_order: item.rank_order,
      is_recommended: item.is_recommended,
      created_at: item.created_at,
      profession_unit: {
        profession_unit_id: item.profession_unit.profession_unit_id.toString(),
        profession_id: item.profession_unit.profession_id.toString(),
        unit_name: item.profession_unit.unit_name,
      },
    }));

    const recommendation = ranking.find((item) => item.is_recommended === true) || null;

    return success(
      {
        recommendation,
        ranking,
        dimensions,
      },
      "Berhasil mengambil hasil assessment lewat jalur bypass."
    );

  } catch (error: any) {
    console.error("❌ ERROR CRITICAL ROUTE:", error);
    return failed(error.message || "Terjadi kesalahan internal.", 500);
  }
}