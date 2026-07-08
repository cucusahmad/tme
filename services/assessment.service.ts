import { prisma } from "@/lib/prisma";

export async function getCurrentAssessment(
  biodataId: bigint
) {
  return prisma.assessment.findFirst({
    where: {
      biodata_id: biodataId,
      status: "DRAFT",
    },
    orderBy: {
      assessment_id: "desc",
    },
  });
}

export async function startAssessment(
  biodataId: bigint
) {
  const current =
    await getCurrentAssessment(
      biodataId
    );

  if (current) {
    return current;
  }

  return prisma.assessment.create({
    data: {
      biodata_id: biodataId,
      status: "DRAFT",
      started_at: new Date(),
    },
  });
}

export async function getNextQuestion(
  assessmentId: bigint,
  professionId: bigint
) {
  const answered = await prisma.answer.findMany({
    where: {
      assessment_id: assessmentId,
    },
    select: {
      question_id: true,
    },
  });

  const answeredIds = answered.map(
    (item) => item.question_id
  );

  return prisma.question.findFirst({
    where: {
      dimension: {
        profession_id: professionId,
      },

      NOT: {
        question_id: {
          in: answeredIds,
        },
      },
    },

    include: {
      dimension: true,
    },

    orderBy: [
      {
        dimension: {
          order_no: "asc",
        },
      },
      {
        question_order: "asc",
      },
    ],
  });
}

export async function getProgress(
  assessmentId: bigint,
  professionId: bigint
) {
  const totalQuestion =
    await prisma.question.count({
      where: {
        dimension: {
          profession_id: professionId,
        },
      },
    });

  const answered =
    await prisma.answer.count({
      where: {
        assessment_id: assessmentId,
      },
    });

  return {
    total: totalQuestion,
    answered,
    percentage:
      totalQuestion === 0
        ? 0
        : Math.round(
            (answered / totalQuestion) * 100
          ),
    current: answered + 1,
  };
}


export async function saveAnswer(
  assessmentId: bigint,
  questionId: bigint,
  answerValue: number
) {
  return prisma.answer.upsert({
    where: {
      assessment_id_question_id: {
        assessment_id: assessmentId,
        question_id: questionId,
      },
    },

    update: {
      answer_value: answerValue,
    },

    create: {
      assessment_id: assessmentId,
      question_id: questionId,
      answer_value: answerValue,
    },
  });
}

export async function calculateDimensionResult(
  assessmentId: bigint
) {

  const assessment =
    await prisma.assessment.findUnique({

      where: {
        assessment_id: assessmentId,
      },

      include: {

        answer: {

          include: {

            question: true,

          },

        },

      },

    });

  if (!assessment) {
    throw new Error(
      "ASSESSMENT_NOT_FOUND"
    );
  }

  const grouped =
    new Map<
      bigint,
      {
        total: number;
        count: number;
      }
    >();

  for (const answer of assessment.answer) {

    const dimensionId =
      answer.question.dimension_id;

    if (!grouped.has(dimensionId)) {

      grouped.set(
        dimensionId,
        {
          total: 0,
          count: 0,
        }
      );

    }

    const current =
      grouped.get(dimensionId)!;

    current.total +=
      answer.answer_value;

    current.count++;

  }

  await prisma.assessment_dimension_result.deleteMany({

    where: {
      assessment_id: assessmentId,
    },

  });

  for (const [dimensionId, value] of grouped) {

    const score =
      value.total;

    const percentage =
      (
        score /
        (value.count * 5)
      ) *
      100;

    await prisma.assessment_dimension_result.create({

      data: {

        assessment_id:
          assessmentId,

        dimension_id:
          dimensionId,

        score,

        percentage,

      },

    });

  }

}

export async function calculateProfessionResult(
  assessmentId: bigint
) {

  const dimensions =
    await prisma.assessment_dimension_result.findMany({

      where: {
        assessment_id: assessmentId,
      },

    });

  const assessment =
    await prisma.assessment.findUnique({

      where: {
        assessment_id: assessmentId,
      },

      include: {

        biodata: true,

      },

    });

  if (!assessment) {
    throw new Error(
      "ASSESSMENT_NOT_FOUND"
    );
  }

  const units =
    await prisma.profession_unit.findMany({

      where: {

        profession_id:
          assessment.biodata.profession_id!,

      },

      include: {

        profession_unit_dimension: true,

      },

    });

  await prisma.assessment_result.deleteMany({

    where: {
      assessment_id: assessmentId,
    },

  });

  const ranking = [];

  for (const unit of units) {

    let totalWeight = 0;

    let totalScore = 0;

    for (const item of unit.profession_unit_dimension) {

      const dimension =
        dimensions.find(

          (x) =>
            x.dimension_id ===
            item.dimension_id

        );

      if (!dimension)
        continue;

      totalWeight +=
        Number(item.weight);

      totalScore +=
        Number(
          dimension.percentage
        ) *
        Number(item.weight);

    }

    const percentage =
      totalWeight === 0
        ? 0
        : totalScore /
          totalWeight;

    ranking.push({

      profession_unit_id:
        unit.profession_unit_id,

      percentage,

    });

  }

  ranking.sort(
    (a, b) =>
      b.percentage -
      a.percentage
  );

  for (
    let i = 0;
    i < ranking.length;
    i++
  ) {

 await prisma.assessment_result.create({
  data: {
    assessment_id: assessmentId,

    profession_unit_id:
      ranking[i].profession_unit_id,

    percentage:
      ranking[i].percentage,

    rank_order: i + 1,

    is_recommended: i === 0,
  },
});
  }

}