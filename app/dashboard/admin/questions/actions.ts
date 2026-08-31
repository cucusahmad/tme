"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export type QuestionActionState = { success: boolean; message: string };

const questionSchema = z.object({
  dimensionId: z.coerce.bigint({ error: "Dimensi wajib dipilih." }).positive("Dimensi wajib dipilih."),
  questionText: z.string().trim().min(1, "Pertanyaan wajib diisi."),
  questionOrder: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().int("Urutan harus berupa bilangan bulat.").min(0, "Urutan tidak boleh negatif.").optional(),
  ),
});

const optionSchema = z.object({
  questionId: z.coerce.bigint().positive("Pertanyaan tidak valid."),
  optionText: z.string().trim().min(1, "Teks opsi wajib diisi."),
  optionOrder: z.coerce.number().int("Urutan opsi harus berupa bilangan bulat.").min(0, "Urutan opsi tidak boleh negatif."),
  weight: z.coerce.number().int().refine((value) => [0, 1, 2].includes(value), "Weight hanya boleh 0, 1, atau 2."),
});

const questionIdSchema = z.coerce.bigint().positive();
const optionIdSchema = z.coerce.number().int().positive();
const path = "/dashboard/admin/questions";

function messageFromError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "Urutan opsi tersebut sudah digunakan pada pertanyaan ini.";
    if (error.code === "P2003") return "Data masih digunakan sehingga tidak dapat dihapus.";
    if (error.code === "P2025") return "Data tidak ditemukan.";
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}

export async function createQuestion(_state: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  await requireAdmin();
  const parsed = questionSchema.safeParse({ dimensionId: formData.get("dimensionId"), questionText: formData.get("questionText"), questionOrder: formData.get("questionOrder") });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  try {
    await prisma.question.create({ data: { dimension_id: parsed.data.dimensionId, question: parsed.data.questionText, question_order: parsed.data.questionOrder } });
    revalidatePath(path);
    return { success: true, message: "Pertanyaan berhasil ditambahkan." };
  } catch (error) { console.error(error); return { success: false, message: messageFromError(error) }; }
}

export async function updateQuestion(_state: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  await requireAdmin();
  const id = questionIdSchema.safeParse(formData.get("questionId"));
  const parsed = questionSchema.safeParse({ dimensionId: formData.get("dimensionId"), questionText: formData.get("questionText"), questionOrder: formData.get("questionOrder") });
  if (!id.success || !parsed.success) return { success: false, message: parsed.error?.issues[0]?.message ?? "Pertanyaan tidak valid." };
  try {
    await prisma.question.update({ where: { question_id: id.data }, data: { dimension_id: parsed.data.dimensionId, question: parsed.data.questionText, question_order: parsed.data.questionOrder, updated_at: new Date() } });
    revalidatePath(path);
    return { success: true, message: "Pertanyaan berhasil diperbarui." };
  } catch (error) { console.error(error); return { success: false, message: messageFromError(error) }; }
}

export async function deleteQuestion(_state: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  await requireAdmin();
  const id = questionIdSchema.safeParse(formData.get("questionId"));
  if (!id.success) return { success: false, message: "Pertanyaan tidak valid." };
  try {
    const item = await prisma.question.findUnique({ where: { question_id: id.data }, select: { _count: { select: { answer: true } } } });
    if (!item) return { success: false, message: "Pertanyaan tidak ditemukan." };
    if (item._count.answer) return { success: false, message: `Pertanyaan sudah memiliki ${item._count.answer} jawaban dan tidak dapat dihapus.` };
    await prisma.question.delete({ where: { question_id: id.data } });
    revalidatePath(path);
    return { success: true, message: "Pertanyaan dan seluruh opsinya berhasil dihapus." };
  } catch (error) { console.error(error); return { success: false, message: messageFromError(error) }; }
}

export async function createQuestionOption(_state: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  await requireAdmin();
  const parsed = optionSchema.safeParse({ questionId: formData.get("questionId"), optionText: formData.get("optionText"), optionOrder: formData.get("optionOrder"), weight: formData.get("weight") });
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Opsi tidak valid." };
  try {
    await prisma.question_option.create({ data: { question_id: parsed.data.questionId, option_text: parsed.data.optionText, option_order: parsed.data.optionOrder, weight: parsed.data.weight } });
    revalidatePath(path);
    return { success: true, message: "Opsi jawaban berhasil ditambahkan." };
  } catch (error) { console.error(error); return { success: false, message: messageFromError(error) }; }
}

export async function updateQuestionOption(_state: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  await requireAdmin();
  const id = optionIdSchema.safeParse(formData.get("optionId"));
  const parsed = optionSchema.safeParse({ questionId: formData.get("questionId"), optionText: formData.get("optionText"), optionOrder: formData.get("optionOrder"), weight: formData.get("weight") });
  if (!id.success || !parsed.success) return { success: false, message: parsed.error?.issues[0]?.message ?? "Opsi tidak valid." };
  try {
    await prisma.question_option.update({ where: { option_id: id.data }, data: { question_id: parsed.data.questionId, option_text: parsed.data.optionText, option_order: parsed.data.optionOrder, weight: parsed.data.weight, updated_at: new Date() } });
    revalidatePath(path);
    return { success: true, message: "Opsi jawaban berhasil diperbarui." };
  } catch (error) { console.error(error); return { success: false, message: messageFromError(error) }; }
}

export async function deleteQuestionOption(_state: QuestionActionState, formData: FormData): Promise<QuestionActionState> {
  await requireAdmin();
  const id = optionIdSchema.safeParse(formData.get("optionId"));
  if (!id.success) return { success: false, message: "Opsi tidak valid." };
  try {
    const item = await prisma.question_option.findUnique({ where: { option_id: id.data }, select: { _count: { select: { answer: true } } } });
    if (!item) return { success: false, message: "Opsi tidak ditemukan." };
    if (item._count.answer) return { success: false, message: `Opsi sudah dipilih pada ${item._count.answer} jawaban dan tidak dapat dihapus.` };
    await prisma.question_option.delete({ where: { option_id: id.data } });
    revalidatePath(path);
    return { success: true, message: "Opsi jawaban berhasil dihapus." };
  } catch (error) { console.error(error); return { success: false, message: messageFromError(error) }; }
}
