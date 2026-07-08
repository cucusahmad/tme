import { prisma } from "@/lib/prisma";

export async function getProfessions() {
  return prisma.profession.findMany({
    orderBy: {
      profession_name: "asc",
    },
  });
}

export async function getProfession(
  professionId: bigint
) {
  return prisma.profession.findUnique({
    where: {
      profession_id: professionId,
    },
    include: {
      dimension: {
        orderBy: {
          order_no: "asc",
        },
      },
      profession_unit: {
        orderBy: {
          unit_name: "asc",
        },
      },
    },
  });
}