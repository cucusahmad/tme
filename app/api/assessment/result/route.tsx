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

    // 2. Ambil data dimensi berdasarkan biodata_id ini
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
        created_at: "desc"
      }
    });

    // 3. Ambil data ranking berdasarkan biodata_id ini
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
    
    if (rawDimensions.length === 0) {
      return success({ recommendation: null, ranking: [], dimensions: [] }, "Data di database kosong.");
    }

    /*
    |--------------------------------------------------------------------------
    | AGREGASI & DISTINCT DIMENSIONS (MENGHITUNG RATA-RATA & MENGHAPUS DUPLIKAT)
    |--------------------------------------------------------------------------
    */
    const aggregatedDimensionsMap = rawDimensions.reduce((acc, item) => {
      const dimId = item.dimension_id.toString();

      if (!acc[dimId]) {
        acc[dimId] = {
          assessment_dimension_id: item.assessment_dimension_id.toString(),
          assessment_id: item.assessment_id.toString(),
          dimension_id: dimId,
          scoreTotal: item.score ? Number(item.score) : 0,
          percentageTotal: item.percentage ? Number(item.percentage) : 0,
          count: 1,
          created_at: item.created_at,
          dimension: {
            dimension_id: item.dimension.dimension_id.toString(),
            profession_id: item.dimension.profession_id.toString(),
            dimension_name: item.dimension.dimension_name,
            order_no: item.dimension.order_no,
          },
        };
      } else {
        acc[dimId].scoreTotal += item.score ? Number(item.score) : 0;
        acc[dimId].percentageTotal += item.percentage ? Number(item.percentage) : 0;
        acc[dimId].count += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    const dimensions = Object.values(aggregatedDimensionsMap).map((item) => {
      const { scoreTotal, percentageTotal, count, ...rest } = item;
      return {
        ...rest,
        score: scoreTotal / count,
        percentage: percentageTotal / count,
      };
    });


    /*
    |--------------------------------------------------------------------------
    | AGREGASI & DISTINCT RANKING (PROSES UTAMA PERBAIKAN)
    |--------------------------------------------------------------------------
    */
    const aggregatedRankingMap = rawRanking.reduce((acc, item) => {
      const profUnitId = item.profession_unit_id.toString();

      if (!acc[profUnitId]) {
        acc[profUnitId] = {
          assessment_result_id: item.assessment_result_id.toString(),
          assessment_id: item.assessment_id.toString(),
          profession_unit_id: profUnitId,
          percentageTotal: item.percentage ? Number(item.percentage) : 0,
          count: 1,
          created_at: item.created_at,
          profession_unit: {
            profession_unit_id: item.profession_unit.profession_unit_id.toString(),
            profession_id: item.profession_unit.profession_id.toString(),
            unit_name: item.profession_unit.unit_name,
          },
        };
      } else {
        acc[profUnitId].percentageTotal += item.percentage ? Number(item.percentage) : 0;
        acc[profUnitId].count += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    // 1. Ubah menjadi Array sekaligus hitung rata-rata persentasenya
    let ranking = Object.values(aggregatedRankingMap).map((item) => {
      const { percentageTotal, count, ...rest } = item;
      return {
        ...rest,
        percentage: Number((percentageTotal / count).toFixed(2)), // Batasi 2 desimal
      };
    });

    // 2. URUTKAN: Dari nilai percentage tertinggi ke terendah (descending)
    ranking.sort((a, b) => b.percentage - a.percentage);

    // 3. RE-INDEX RANK_ORDER: Buat nomor peringkat baru berurutan dari 1 agar tidak duplikat
    ranking = ranking.map((item, index) => {
      const currentRank = index + 1;
      return {
        ...item,
        rank_order: currentRank,
        is_recommended: currentRank === 1, // Otomatis peringkat #1 menjadi Direkomendasikan
      };
    });

    // Ambil item rekomendasi teratas (peringkat 1 hasil rata-rata terbaru)
    const recommendation = ranking.find((item) => item.is_recommended === true) || null;

    return success(
      {
        recommendation,
        ranking,
        dimensions,
      },
      "Berhasil mengambil hasil assessment unik dengan nilai rata-rata terurut."
    );

  } catch (error: any) {
    console.error("❌ ERROR CRITICAL ROUTE:", error);
    return failed(error.message || "Terjadi kesalahan internal.", 500);
  }
}