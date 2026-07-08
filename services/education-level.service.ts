import { prisma } from "@/lib/prisma";

export async function getEducationLevels() {
  return prisma.education_level.findMany({
    orderBy: {
      education_name: "asc",
    },
  });
}

export async function getEducationLevel(
  id: bigint
) {
  return prisma.education_level.findUnique({
    where: {
      education_level_id: id,
    },
  });
}