"use client";

import { useActionState, useState } from "react";
import { assignUserOrganization } from "@/app/dashboard/admin/organizations/actions";

export default function UserOrganizationForm({ userId, organizationId, organizations }: {
  userId: string;
  organizationId: string;
  organizations: { id: string; name: string; active: boolean }[];
}) {
  const [selectedId, setSelectedId] = useState(organizationId);
  const [state, action, pending] = useActionState(assignUserOrganization, { success: false, message: "" });
  return <form action={action} className="min-w-52 space-y-2">
    <input type="hidden" name="userId" value={userId} />
    <fieldset disabled={pending} className="space-y-2 disabled:opacity-60">
      <label className="block text-xs text-slate-500">Organisasi<select name="organizationId" value={selectedId} onChange={event => setSelectedId(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900">
        <option value="">Belum ada organisasi</option>
        {organizations.map(item => <option key={item.id} value={item.id} disabled={!item.active}>{item.name}{!item.active ? " (Nonaktif)" : ""}</option>)}
      </select></label>
      <button className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700 hover:bg-cyan-100">{pending ? "Menyimpan..." : "Simpan organisasi"}</button>
    </fieldset>
    <p role="status" className={`max-w-64 text-xs ${state.success ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>
  </form>;
}
