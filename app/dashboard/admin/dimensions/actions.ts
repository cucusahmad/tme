"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export type DimensionActionState = {
  success: boolean;
  message: string;
};

const dimensionSchema = z.object({
  professionId: z.coerce.bigint({ error: "Profesi wajib dipilih." }).positive("Profesi wajib dipilih."),
  dimensionName: z.string().trim().min(1, "Nama dimensi wajib diisi.").max(100, "Nama dimensi maksimal 100 karakter."),
  orderNo: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().int("Urutan harus berupa bilangan bulat.").min(0, "Urutan tidak boleh negatif.").optional(),
  ),
});

const idSchema = z.coerce.bigint().positive();

function errorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
    return "Dimensi masih digunakan oleh data lain sehingga tidak dapat dihapus.";
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}

export async function createDimension(
  _previousState: DimensionActionState,
  formData: FormData,
): Promise<DimensionActionState> {
  await requireAdmin();
  const parsed = dimensionSchema.safeParse({
    professionId: formData.get("professionId"),
    dimensionName: formData.get("dimensionName"),
    orderNo: formData.get("orderNo"),
  });

  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };

  try {
    await prisma.dimension.create({
      data: {
        profession_id: parsed.data.professionId,
        dimension_name: parsed.data.dimensionName,
        order_no: parsed.data.orderNo,
      },
    });
    revalidatePath("/dashboard/admin/dimensions");
    return { success: true, message: "Dimensi berhasil ditambahkan." };
  } catch (error) {
    console.error(error);
    return { success: false, message: errorMessage(error) };
  }
}

export async function updateDimension(
  _previousState: DimensionActionState,
  formData: FormData,
): Promise<DimensionActionState> {
  await requireAdmin();
  const id = idSchema.safeParse(formData.get("dimensionId"));
  const parsed = dimensionSchema.safeParse({
    professionId: formData.get("professionId"),
    dimensionName: formData.get("dimensionName"),
    orderNo: formData.get("orderNo"),
  });

  if (!id.success || !parsed.success) {
    return { success: false, message: parsed.error?.issues[0]?.message ?? "Dimensi tidak valid." };
  }

  try {
    await prisma.dimension.update({
      where: { dimension_id: id.data },
      data: {
        profession_id: parsed.data.professionId,
        dimension_name: parsed.data.dimensionName,
        order_no: parsed.data.orderNo,
      },
    });
    revalidatePath("/dashboard/admin/dimensions");
    return { success: true, message: "Dimensi berhasil diperbarui." };
  } catch (error) {
    console.error(error);
    return { success: false, message: errorMessage(error) };
  }
}

export async function deleteDimension(
  _previousState: DimensionActionState,
  formData: FormData,
): Promise<DimensionActionState> {
  await requireAdmin();
  const id = idSchema.safeParse(formData.get("dimensionId"));
  if (!id.success) return { success: false, message: "Dimensi tidak valid." };

  try {
    const dimension = await prisma.dimension.findUnique({
      where: { dimension_id: id.data },
      select: {
        _count: { select: { question: true, profession_unit_dimension: true, assessment_dimension_result: true } },
      },
    });
    if (!dimension) return { success: false, message: "Dimensi tidak ditemukan." };
    const usage = dimension._count.question + dimension._count.profession_unit_dimension + dimension._count.assessment_dimension_result;
    if (usage > 0) return { success: false, message: `Dimensi masih dipakai oleh ${usage} data terkait dan tidak dapat dihapus.` };

    await prisma.dimension.delete({ where: { dimension_id: id.data } });
    revalidatePath("/dashboard/admin/dimensions");
    return { success: true, message: "Dimensi berhasil dihapus." };
  } catch (error) {
    console.error(error);
    return { success: false, message: errorMessage(error) };
  }
}
