import { prisma } from "@/lib/prisma";

export async function getBiodata(userId: bigint) {
  return prisma.biodata.findFirst({
    where: {
      user_id: userId,
    },
    include: {
      profession: true,
      education_level: true,
    },
  });
}

export async function saveBiodata(
  userId: bigint,
  data: {
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: Date | null;
    alamat: string;
    kabupaten_kota: string;
    provinsi: string;
    no_hp: string;
    email: string;
    education_level_id: bigint | null;
    jurusan: string;
    status_pekerjaan: string;
    profession_id: bigint | null;
    instansi: string;
    unit_kerja: string;
    jabatan: string;
    lama_pengalaman_kerja: number | null;
    foto: string | null;
  }
) {
  const biodata = await prisma.biodata.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (biodata) {
    return prisma.biodata.update({
      where: {
        biodata_id: biodata.biodata_id,
      },
      data: {
        ...data,
      },
    });
  }

  return prisma.biodata.create({
    data: {
      user_id: userId,
      ...data,
    },
  });
}