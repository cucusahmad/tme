import { Boxes } from "lucide-react";

import DimensionManager from "@/components/admin/DimensionManager";
import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function AdminDimensionsPage() {
  await requireAdmin();
  const [dimensions, professions] = await Promise.all([
    prisma.dimension.findMany({
      orderBy: [{ profession: { profession_name: "asc" } }, { order_no: "asc" }, { dimension_name: "asc" }],
      select: {
        dimension_id: true,
        dimension_name: true,
        order_no: true,
        profession_id: true,
        profession: { select: { profession_name: true } },
        _count: { select: { question: true, profession_unit_dimension: true, assessment_dimension_result: true } },
      },
    }),
    prisma.profession.findMany({ orderBy: { profession_name: "asc" }, select: { profession_id: true, profession_name: true } }),
  ]);

  return <div className="space-y-6">
    <div className="flex items-center gap-4"><div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-lg shadow-emerald-100"><Boxes size={26}/></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Data Master</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Manajemen Dimensi</h1><p className="mt-1 text-sm text-slate-500">Tambah, lihat, ubah, dan hapus dimensi assessment.</p></div></div>
    <DimensionManager
      professions={professions.map(item => ({ id: item.profession_id.toString(), name: item.profession_name }))}
      dimensions={dimensions.map(item => ({ id: item.dimension_id.toString(), name: item.dimension_name, orderNo: item.order_no, professionId: item.profession_id.toString(), professionName: item.profession.profession_name, questionCount: item._count.question, usageCount: item._count.question + item._count.profession_unit_dimension + item._count.assessment_dimension_result }))}
    />
  </div>;
}
