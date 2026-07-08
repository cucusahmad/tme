import { z } from "zod";

export const BiodataSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),

  jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih"),

  tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),

  tanggal_lahir: z.string().nullable().optional(),

  alamat: z.string().nullable().optional(),

  kabupaten_kota: z.string().nullable().optional(),

  provinsi: z.string().nullable().optional(),

  no_hp: z.string().nullable().optional(),

  email: z
    .string()
    .email("Format email tidak valid")
    .nullable()
    .optional()
    .or(z.literal("")),

  education_level_id: z
    .number()
    .nullable()
    .optional(),

  jurusan: z.string().nullable().optional(),

  status_pekerjaan: z
    .string()
    .nullable()
    .optional(),

  profession_id: z
    .number()
    .nullable()
    .optional(),

  instansi: z.string().nullable().optional(),

  unit_kerja: z.string().nullable().optional(),

  jabatan: z.string().nullable().optional(),

  lama_pengalaman_kerja: z
    .number()
    .nullable()
    .optional(),

  foto: z.string().nullable().optional(),
});

export type BiodataInput = z.infer<
  typeof BiodataSchema
>;