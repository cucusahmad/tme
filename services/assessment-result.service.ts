import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| Hitung Nilai Setiap Dimension
|--------------------------------------------------------------------------
*/

export async function calculateDimensionResult(
  assessmentId: bigint
) {
  /*
  |--------------------------------------------------------------------------
  | Ambil seluruh jawaban beserta dimension
  |--------------------------------------------------------------------------
  */

  const answers = await prisma.answer.findMany({
    where: {
      assessment_id: assessmentId,
    },
    include: {
      question: true,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Hapus hasil lama
  |--------------------------------------------------------------------------
  */

  await prisma.assessment_dimension_result.deleteMany({
    where: {
      assessment_id: assessmentId,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Kelompokkan berdasarkan dimension
  |--------------------------------------------------------------------------
  */

  const dimensions = new Map<
    bigint,
    {
      totalScore: number;
      totalQuestion: number;
    }
  >();

  for (const item of answers) {
    const dimensionId = item.question.dimension_id;

    if (!dimensions.has(dimensionId)) {
      dimensions.set(dimensionId, {
        totalScore: 0,
        totalQuestion: 0,
      });
    }

    const current = dimensions.get(dimensionId)!;

    current.totalScore += item.answer_value;
    current.totalQuestion += 1;
  }

  /*
  |--------------------------------------------------------------------------
  | Simpan hasil setiap dimension
  |--------------------------------------------------------------------------
  */

  for (const [dimensionId, value] of dimensions) {
  const score = value.totalScore;

  const maxScore = value.totalQuestion * 5;

  const percentage =
    maxScore === 0
      ? 0
      : Number(
          ((score / maxScore) * 100).toFixed(2)
        );

  await prisma.assessment_dimension_result.create({
    data: {
      assessment_id: assessmentId,

      dimension_id: dimensionId,

      score: new Prisma.Decimal(score),

      percentage: new Prisma.Decimal(
        percentage
      ),
    },
  });
}

  /*
  |--------------------------------------------------------------------------
  | Kembalikan hasil
  |--------------------------------------------------------------------------
  */

  return prisma.assessment_dimension_result.findMany({
    where: {
      assessment_id: assessmentId,
    },
    include: {
      dimension: true,
    },
    orderBy: {
      dimension_id: "asc",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Hitung Hasil Talent Match
|--------------------------------------------------------------------------
*/

export async function calculateProfessionResult(
  assessmentId: bigint
) {
  /*
  |--------------------------------------------------------------------------
  | Ambil Assessment
  |--------------------------------------------------------------------------
  */

  const assessment = await prisma.assessment.findUnique({
    where: {
      assessment_id: assessmentId,
    },
    include: {
      biodata: true,
    },
  });

  if (!assessment) {
    throw new Error("ASSESSMENT_NOT_FOUND");
  }

  if (!assessment.biodata.profession_id) {
    throw new Error("PROFESSION_NOT_SELECTED");
  }

  /*
  |--------------------------------------------------------------------------
  | Ambil seluruh hasil dimension
  |--------------------------------------------------------------------------
  */

  const dimensionResults =
    await prisma.assessment_dimension_result.findMany({
      where: {
        assessment_id: assessmentId,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Ambil seluruh profession unit
  |--------------------------------------------------------------------------
  */

  const professionUnits =
    await prisma.profession_unit.findMany({
      where: {
        profession_id:
          assessment.biodata.profession_id,
      },
      include: {
        profession_unit_dimension: true,
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Hapus hasil lama
  |--------------------------------------------------------------------------
  */

  await prisma.assessment_result.deleteMany({
    where: {
      assessment_id: assessmentId,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Hitung seluruh profession unit
  |--------------------------------------------------------------------------
  */

  const ranking: {
    profession_unit_id: bigint;
    percentage: number;
  }[] = [];

  for (const unit of professionUnits) {
    let totalWeight = 0;
    let totalScore = 0;

    for (const weight of unit.profession_unit_dimension) {
      const result = dimensionResults.find(
        (item) =>
          item.dimension_id ===
          weight.dimension_id
      );

      if (!result) continue;

      const bobot = Number(weight.weight);

      totalWeight += bobot;

      totalScore +=
        Number(result.percentage) * bobot;
    }

    const percentage =
      totalWeight === 0
        ? 0
        : Number(
            (totalScore / totalWeight).toFixed(2)
          );

    ranking.push({
      profession_unit_id:
        unit.profession_unit_id,
      percentage,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Ranking
  |--------------------------------------------------------------------------
  */

  ranking.sort(
    (a, b) =>
      b.percentage - a.percentage
  );

  /*
  |--------------------------------------------------------------------------
  | Simpan ke assessment_result
  |--------------------------------------------------------------------------
  */

 
for (let i = 0; i < ranking.length; i++) {
  await prisma.assessment_result.create({
    data: {
      assessment_id: assessmentId,

      profession_unit_id:
        ranking[i].profession_unit_id,

      percentage: new Prisma.Decimal(
        ranking[i].percentage
      ),

      rank_order: i + 1,

      is_recommended: i === 0,
    },
  });
}

  return prisma.assessment_result.findMany({
    where: {
      assessment_id: assessmentId,
    },
    orderBy: {
      rank_order: "asc",
    },
  });
}
/*
|--------------------------------------------------------------------------
| Ambil Seluruh Hasil Assessment (Sudah Diperbaiki)
|--------------------------------------------------------------------------
*/
export async function getAssessmentResult(assessmentId: bigint) {
  const results = await prisma.assessment_result.findMany({
    where: {
      assessment_id: assessmentId,
    },
    include: {
      profession_unit: true,
    },
    orderBy: {
      rank_order: "asc",
    },
  });

  // Konversi tipe Decimal menjadi number biasa Javascript agar bisa di-render Chart/UI
  return results.map((item) => ({
    ...item,
    percentage: Number(item.percentage),
  }));
}

/*
|--------------------------------------------------------------------------
| Ambil Rekomendasi Terbaik (Sudah Diperbaiki)
|--------------------------------------------------------------------------
*/
export async function getBestRecommendation(assessmentId: bigint) {
  const recommendation = await prisma.assessment_result.findFirst({
    where: {
      assessment_id: assessmentId,
      is_recommended: true,
    },
    include: {
      profession_unit: true,
    },
  });

  if (!recommendation) return null;

  return {
    ...recommendation,
    percentage: Number(recommendation.percentage),
  };
}

/*
|--------------------------------------------------------------------------
| Ambil Nilai Setiap Dimension (Sudah Diperbaiki - KUNCI UTAMA UNTUK RADAR CHART)
|--------------------------------------------------------------------------
*/
export async function getDimensionResult(assessmentId: bigint) {
  const dimensionResults = await prisma.assessment_dimension_result.findMany({
    where: { assessment_id: assessmentId },
    include: { dimension: true },
    orderBy: { dimension_id: "asc" },
  });

  return dimensionResults.map((item) => ({
    ...item,
    score: Number(item.score),
    percentage: Number(item.percentage),
  }));
}