"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";

export default function LogoutButton({ collapsed = false, onLogout }: { collapsed?: boolean; onLogout?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally { onLogout?.(); router.replace("/auth/login"); router.refresh(); }
  }
  return <button onClick={logout} disabled={loading} title={collapsed ? "Keluar" : undefined} className={`flex w-full items-center rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60 ${collapsed ? "justify-center" : "gap-3"}`}>{loading ? <LoaderCircle className="animate-spin" size={19} /> : <LogOut size={19} />}{!collapsed && <span>{loading ? "Mengakhiri sesi..." : "Keluar"}</span>}</button>;
}
