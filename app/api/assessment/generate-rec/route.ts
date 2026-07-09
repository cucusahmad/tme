import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    /*
    |--------------------------------------------------------------------------
    | User Login
    |--------------------------------------------------------------------------
    */

    const userId = getUserId(request);

    const biodata = await prisma.biodata.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!biodata) {
      return NextResponse.json(
        {
          success: false,
          message: "Biodata tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Ambil Ranking
    |--------------------------------------------------------------------------
    */

    const ranking =
      await prisma.assessment_result.findMany({
        where: {
          assessment: {
            biodata_id: biodata.biodata_id,
          },
        },
        include: {
          profession_unit: true,
        },
        orderBy: {
          percentage: "desc",
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Ambil Dimensi
    |--------------------------------------------------------------------------
    */

    const dimensions =
      await prisma.assessment_dimension_result.findMany({
        where: {
          assessment: {
            biodata_id: biodata.biodata_id,
          },
        },
        include: {
          dimension: true,
        },
      });

    if (
      ranking.length === 0 ||
      dimensions.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hasil assessment belum tersedia.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Data Assessment
    |--------------------------------------------------------------------------
    */

    const assessmentData = {
      top_profession_units: ranking
        .slice(0, 3)
        .map((item) => ({
          profession_unit:
            item.profession_unit.unit_name,

          percentage: Number(
            item.percentage
          ),
        })),

      dimensions: dimensions.map(
        (item) => ({
          dimension:
            item.dimension.dimension_name,

          score: Number(item.score),

          percentage: Number(
            item.percentage
          ),
        })
      ),
    };

    /*
    |--------------------------------------------------------------------------
    | Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `

Anda adalah AI Career Consultant.

Analisis data assessment berikut.

${JSON.stringify(
      assessmentData,
      null,
      2
    )}

Jawaban HARUS berupa JSON VALID.

Jangan menggunakan markdown.

Jangan menggunakan \`\`\`.

Format JSON:

{
"top_5_development_priorities":[
{
"title":"",
"description":"",
"reason":""
}
],

"development_recommendation":{
"summary":"",
"recommendations":[]
},

"individual_career_roadmap":[
{
"year":1,
"focus":"",
"target":""
}
],

"individual_development_plan":[
{
"activity":"",
"timeline":"",
"indicator":""
}
],

"recommended_learning_path":[
{
"title":"",
"description":""
}
],

"recommended_learning_place":[
{
"name":"",
"type":"",
"reason":""
}
],

"personal_commitment":{
"title":"",
"statement":""
}
}

`;
    /*
    |--------------------------------------------------------------------------
    | Generate AI
    |--------------------------------------------------------------------------
    */

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      temperature: 0.5,

      messages: [
        {
          role: "system",
          content:
            "Anda adalah AI Career Consultant. Balas HANYA JSON VALID tanpa markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiContent =
      response.choices[0].message.content?.trim();

    if (!aiContent) {
      throw new Error(
        "OpenAI tidak mengembalikan response."
      );
    }

    let aiResult: any;

    try {
      aiResult = JSON.parse(aiContent);
    } catch (e) {
      console.error("===== RESPONSE OPENAI =====");
      console.error(aiContent);

      throw new Error(
        "Response OpenAI bukan JSON valid."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Simpan Recommendation
    |--------------------------------------------------------------------------
    */

    const recommendation =
      await prisma.assessment_ai_recommendation.upsert({
        where: {
          biodata_id:
            biodata.biodata_id,
        },

        update: {
          top_5_development_priorities:
            aiResult
              .top_5_development_priorities ??
            [],

          development_recommendation:
            aiResult
              .development_recommendation ??
            {},

          individual_career_roadmap:
            aiResult
              .individual_career_roadmap ??
            [],

          individual_development_plan:
            aiResult
              .individual_development_plan ??
            [],

          recommended_learning_path:
            aiResult
              .recommended_learning_path ??
            [],

          recommended_learning_place:
            aiResult
              .recommended_learning_place ??
            [],

          personal_commitment:
            aiResult
              .personal_commitment ??
            {},
        },

        create: {
          biodata_id:
            biodata.biodata_id,

          top_5_development_priorities:
            aiResult
              .top_5_development_priorities ??
            [],

          development_recommendation:
            aiResult
              .development_recommendation ??
            {},

          individual_career_roadmap:
            aiResult
              .individual_career_roadmap ??
            [],

          individual_development_plan:
            aiResult
              .individual_development_plan ??
            [],

          recommended_learning_path:
            aiResult
              .recommended_learning_path ??
            [],

          recommended_learning_place:
            aiResult
              .recommended_learning_place ??
            [],

          personal_commitment:
            aiResult
              .personal_commitment ??
            {},
        },
      });

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,

      message:
        "AI Recommendation berhasil dibuat.",

      data: {
        ai_recommendation_id:
          recommendation.ai_recommendation_id.toString(),

        biodata_id:
          recommendation.biodata_id.toString(),
      },
    });
  } catch (error: any) {
    console.error(
      "===== GENERATE AI ERROR ====="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error.message ??
          "Terjadi kesalahan.",

        stack:
          process.env.NODE_ENV ===
          "development"
            ? error.stack
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}