import { prisma } from "@/lib/prisma";

export async function getCurrentAssessment(
  biodataId: bigint
) {
  return prisma.assessment.findFirst({
    where: {
      biodata_id: biodataId,
      status: "DRAFT",
      assessment_type: "SELF",
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

  const questions = await prisma.question.findMany({
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
      question_option: true,
    },
  });

  if (questions.length === 0) {
    return null;
  }

  const question = questions[Math.floor(Math.random() * questions.length)];

  return {
    ...question,
    question_option: shuffle(question.question_option),
  };
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
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
    current: Math.min(answered + 1, totalQuestion),
  };
}

export async function saveOptionAnswer(
  assessmentId: bigint,
  professionId: bigint,
  questionId: bigint,
  optionId: number
) {
  const option = await prisma.question_option.findFirst({
    where: {
      option_id: optionId,
      question_id: questionId,
      question: {
        dimension: {
          profession_id: professionId,
        },
      },
    },
  });

  if (!option) {
    throw new Error("INVALID_QUESTION_OPTION");
  }

  const answerValue = Number(option.weight);

  if (!Number.isInteger(answerValue) || answerValue < 0 || answerValue > 5) {
    throw new Error("INVALID_QUESTION_OPTION_WEIGHT");
  }

  return saveAnswer(
    assessmentId,
    questionId,
    option.option_id,
    answerValue
  );
}


export async function saveAnswer(
  assessmentId: bigint,
  questionId: bigint,
  questionOptionId: number,
  weight: number
) {
  return prisma.answer.upsert({
    where: {
      assessment_id_question_id: {
        assessment_id: assessmentId,
        question_id: questionId,
      },
    },

    update: {
      question_option_id: questionOptionId,
      answer_value: weight,
      weight,
    },

    create: {
      assessment_id: assessmentId,
      question_id: questionId,
      question_option_id: questionOptionId,
      answer_value: weight,
      weight,
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
