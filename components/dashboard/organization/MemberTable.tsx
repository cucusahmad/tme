export type OrganizationMember = {
  user_id: bigint;
  email: string;
  is_active: boolean | null;
  organization_role: string;
  biodata: { nama_lengkap: string | null } | null;
  mentor?: { email: string; biodata: { nama_lengkap: string | null } | null } | null;
};

export default function MemberTable({ members }: { members: OrganizationMember[] }) {
  return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr>
      <th className="px-5 py-4">Anggota</th><th className="px-5 py-4">Peran</th><th className="px-5 py-4">Mentor</th><th className="px-5 py-4">Status akun</th>
    </tr></thead><tbody className="divide-y divide-slate-100">{members.map(member => <tr key={member.user_id.toString()}>
      <td className="px-5 py-4"><p className="font-semibold text-slate-900">{member.biodata?.nama_lengkap || member.email}</p><p className="text-slate-500">{member.email}</p></td>
      <td className="px-5 py-4 text-slate-700">{member.organization_role === "SUPERVISOR" ? "Supervisor" : "Anggota"}</td>
      <td className="px-5 py-4 text-slate-700">{member.mentor?.biodata?.nama_lengkap || member.mentor?.email || "Belum dipilih"}</td>
      <td className="px-5 py-4 text-slate-700">{member.is_active ? "Aktif" : "Nonaktif"}</td>
    </tr>)}{!members.length && <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-500">Belum ada anggota.</td></tr>}</tbody></table>
  </div>;
}
