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
  include: {
    education_level: true,
    profession: true,
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
  profile: {
    education_level:
      biodata.education_level?.education_name ?? "",

    major:
      biodata.jurusan ?? "",

    work_unit:
      biodata.unit_kerja ?? "",

    position:
      biodata.jabatan ?? "",

    work_experience:
      biodata.lama_pengalaman_kerja ?? 0,
  },

  top_profession_units: ranking
    .slice(0, 3)
    .map((item) => ({
      profession_unit: item.profession_unit.unit_name,
      percentage: Number(item.percentage),
    })),

  dimensions: dimensions.map((item) => ({
    dimension: item.dimension.dimension_name,
    score: Number(item.score),
    percentage: Number(item.percentage),
  })),
};

    /*
    |--------------------------------------------------------------------------
    | Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
Anda adalah AI Career Consultant yang bertugas memberikan rekomendasi pengembangan karier secara personal berdasarkan profil pengguna dan hasil assessment.

Gunakan seluruh informasi yang diberikan. Jangan mengabaikan informasi profil pengguna.

Profil pengguna terdiri dari:
- Pendidikan terakhir
- Jurusan
- Unit kerja
- Jabatan
- Lama pengalaman kerja

Data pengguna:

${JSON.stringify(assessmentData, null, 2)}

====================================================
ATURAN ANALISIS
====================================================

Seluruh rekomendasi HARUS mempertimbangkan:

1. Pendidikan terakhir
2. Jurusan
3. Unit kerja
4. Jabatan
5. Lama pengalaman kerja
6. Hasil assessment
7. Dimensi kompetensi

Roadmap karier harus realistis dan berkelanjutan.

Apabila pengguna sudah memiliki pengalaman kerja yang cukup atau memiliki jabatan struktural, maka roadmap harus lebih banyak mengarah pada peningkatan kompetensi kepemimpinan, manajemen, pengambilan keputusan, komunikasi, dan pengembangan organisasi.

====================================================
ATURAN PEMILIHAN PROGRAM STUDI UBL
====================================================

Rekomendasi kelima pada recommended_learning_place WAJIB berupa Program Studi Universitas Bandar Lampung (UBL).

Pilihan Program Studi Universitas Bandar Lampung adalah:

Fakultas Teknik
- Teknik Sipil (S1)
- Teknik Mesin (S1)
- Arsitektur (S1)

Fakultas Hukum
- Ilmu Hukum (S1)

Fakultas Keguruan dan Ilmu Pendidikan
- Pendidikan Bahasa Inggris (S1)

Fakultas Ilmu Komputer
- Informatika (S1)
- Sistem Informasi (S1)

Fakultas Ilmu Sosial dan Ilmu Politik
- Ilmu Komunikasi (S1)
- Ilmu Administrasi Negara (S1)
- Ilmu Administrasi Bisnis (S1)

Fakultas Ekonomi dan Bisnis
- Akuntansi (S1)
- Manajemen (S1)

Program Pascasarjana
- Magister Ilmu Administrasi (S2)
- Magister Ilmu Hukum (S2)
- Magister Manajemen (S2)
- Magister Teknik Sipil (S2)

====================================================
ATURAN PENDIDIKAN
====================================================

1. Jika pendidikan terakhir adalah SMA/SMK/Diploma maka rekomendasikan Program Sarjana (S1).

2. Jika pendidikan terakhir adalah Sarjana (S1), maka JANGAN PERNAH merekomendasikan Program Sarjana (S1).

3. Jika pendidikan terakhir adalah Sarjana (S1), maka WAJIB memilih salah satu Program Pascasarjana Universitas Bandar Lampung berikut:
- Magister Manajemen
- Magister Ilmu Administrasi
- Magister Ilmu Hukum
- Magister Teknik Sipil

4. Pemilihan Program Pascasarjana harus mempertimbangkan:
- jurusan sebelumnya
- jabatan
- unit kerja
- pengalaman kerja
- hasil assessment
- dimensi kompetensi

5. Jangan memilih program studi secara acak.

====================================================
PANDUAN PEMILIHAN PROGRAM STUDI
====================================================

Magister Manajemen cocok apabila:
- Leadership tinggi
- Decision Making tinggi
- Manajerial tinggi
- Supervisor
- Manager
- Kepala Bagian
- Kepala Unit
- Project Manager

Magister Ilmu Administrasi cocok apabila:
- ASN
- Pemerintahan
- Administrasi
- Organisasi
- Tata Kelola
- Pelayanan Publik
- Administrasi Perkantoran

Magister Ilmu Hukum cocok apabila:
- Bidang hukum
- Legal
- Kepatuhan
- Regulasi
- Pengawasan
- Audit Hukum

Magister Teknik Sipil cocok apabila:
- Teknik Sipil
- Engineering
- Infrastruktur
- Konstruksi
- Perencanaan Teknik

====================================================
KONSISTENSI PENDIDIKAN
====================================================

Usahakan rekomendasi tetap selaras dengan latar belakang pendidikan pengguna.

Contoh:

S1 Informatika
→ Magister Manajemen (jika assessment menunjukkan potensi manajerial)
→ Magister Ilmu Administrasi (jika bekerja di pemerintahan)

S1 Teknik Sipil
→ Magister Teknik Sipil

S1 Hukum
→ Magister Ilmu Hukum

S1 Manajemen
→ Magister Manajemen

S1 Administrasi Negara
→ Magister Ilmu Administrasi

====================================================
REKOMENDASI LEARNING PLATFORM
====================================================

Bagian recommended_learning_place HARUS berisi tepat 5 rekomendasi.

Empat rekomendasi pertama HARUS berupa platform pembelajaran online.

Platform yang diprioritaskan:

1. PediLearn (WAJIB menjadi rekomendasi pertama)
2. Coursera
3. Udemy
4. edX

AI boleh mengganti Coursera, Udemy, atau edX dengan platform lain yang lebih sesuai apabila diperlukan.

Setiap platform harus memiliki alasan yang spesifik berdasarkan profil pengguna dan hasil assessment.

====================================================
FORMAT OUTPUT
====================================================

Jawaban HARUS berupa JSON VALID.

Jangan menggunakan markdown.

Jangan menggunakan \`\`\`.

Seluruh field WAJIB terisi.

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
      "title":"Fondasi Kompetensi",
      "focus":"",
      "target":"",
      "skills":[],
      "knowledge":[],
      "activities":[]
    },
    {
      "year":2,
      "title":"Penguatan Kompetensi",
      "focus":"",
      "target":"",
      "skills":[],
      "knowledge":[],
      "activities":[]
    },
    {
      "year":3,
      "title":"Pengembangan Profesional",
      "focus":"",
      "target":"",
      "skills":[],
      "knowledge":[],
      "activities":[]
    },
    {
      "year":4,
      "title":"Kesiapan Karier",
      "focus":"",
      "target":"",
      "skills":[],
      "knowledge":[],
      "activities":[]
    },
    {
      "year":5,
      "title":"Profesional Unggul",
      "focus":"",
      "target":"",
      "skills":[],
      "knowledge":[],
      "activities":[]
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
      "name":"PediLearn",
      "type":"Online Learning Platform",
      "category":"Online",
      "url":"https://pedilearn.com",
      "reason":""
    },
    {
      "name":"",
      "type":"Online Learning Platform",
      "category":"Online",
      "url":"",
      "reason":""
    },
    {
      "name":"",
      "type":"Online Learning Platform",
      "category":"Online",
      "url":"",
      "reason":""
    },
    {
      "name":"",
      "type":"Online Learning Platform",
      "category":"Online",
      "url":"",
      "reason":""
    },
    {
      "name":"Universitas Bandar Lampung",
      "type":"University",
      "category":"University",
      "faculty":"",
      "study_program":"",
      "degree":"",
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
    } catch {
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
