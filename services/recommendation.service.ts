import { prisma } from "@/lib/prisma";

export async function getRecommendation(
  biodataId: bigint
) {
  return prisma.assessment_ai_recommendation.findUnique({
    where: {
      biodata_id: biodataId,
    },
  });
}