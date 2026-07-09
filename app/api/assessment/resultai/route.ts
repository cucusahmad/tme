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

    const biodata = await prisma.biodata.findUnique({
      where: { user_id: userId },
    });

    if (!biodata) return failed("Biodata tidak ditemukan.", 400);

    // 1. Ambil data dimensi
    const rawDimensions = await prisma.assessment_dimension_result.findMany({
      where: { assessment: { biodata_id: biodata.biodata_id } },
      include: { dimension: true },
    });

    // 2. Ambil data ranking
    const rawRanking = await prisma.assessment_result.findMany({
      where: { assessment: { biodata_id: biodata.biodata_id } },
      include: { profession_unit: true },
    });
    
    if (rawDimensions.length === 0) {
      return success({ top_profession_units: [], dimensions: [] }, "Data kosong.");
    }

    /*
    |--------------------------------------------------------------------------
    | PROSES DATA DIMENSI (Hanya field yang diminta)
    |--------------------------------------------------------------------------
    */
    const aggregatedDimensionsMap = rawDimensions.reduce((acc, item) => {
      const dimId = item.dimension_id.toString();
      if (!acc[dimId]) {
        acc[dimId] = {
          dimension_name: item.dimension.dimension_name,
          scoreTotal: item.score ? Number(item.score) : 0,
          percentageTotal: item.percentage ? Number(item.percentage) : 0,
          count: 1,
        };
      } else {
        acc[dimId].scoreTotal += item.score ? Number(item.score) : 0;
        acc[dimId].percentageTotal += item.percentage ? Number(item.percentage) : 0;
        acc[dimId].count += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    const dimensions = Object.values(aggregatedDimensionsMap).map((item) => ({
      dimension_name: item.dimension_name,
      average_score: Number((item.scoreTotal / item.count).toFixed(2)),
      average_percentage: Number((item.percentageTotal / item.count).toFixed(2)),
    }));

    /*
    |--------------------------------------------------------------------------
    | PROSES DATA PROFESSION UNIT (Hanya 3 Tertinggi & Field yang diminta)
    |--------------------------------------------------------------------------
    */
    const aggregatedRankingMap = rawRanking.reduce((acc, item) => {
      const profUnitId = item.profession_unit_id.toString();
      if (!acc[profUnitId]) {
        acc[profUnitId] = {
          unit_name: item.profession_unit.unit_name,
          percentageTotal: item.percentage ? Number(item.percentage) : 0,
          count: 1,
        };
      } else {
        acc[profUnitId].percentageTotal += item.percentage ? Number(item.percentage) : 0;
        acc[profUnitId].count += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    const ranking = Object.values(aggregatedRankingMap).map((item) => ({
      unit_name: item.unit_name,
      percentage: Number((item.percentageTotal / item.count).toFixed(2)),
    }));

    // Urutkan dari persentase tertinggi dan ambil 3 besar
    ranking.sort((a, b) => b.percentage - a.percentage);
    const topProfessionUnits = ranking.slice(0, 3);

    // Kirim response final sesuai format yang diminta
    return success({
      top_profession_units: topProfessionUnits,
      dimensions: dimensions
    });

  } catch (error: any) {
    console.error("❌ ERROR:", error);
    return failed(error.message || "Terjadi kesalahan internal.", 500);
  }
}