"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface Props { href: string; icon: LucideIcon; title: string; collapsed?: boolean; }
export default function SidebarItem({ href, icon: Icon, title, collapsed }: Props) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && href !== "/dashboard/organization" && pathname.startsWith(href));
  return <Link href={href} title={collapsed ? title : undefined} className={clsx("group relative flex h-12 items-center rounded-xl text-sm font-semibold transition-all duration-200", collapsed ? "justify-center px-2" : "gap-3 px-3", active ? "bg-white/[0.11] text-white shadow-inner shadow-white/5" : "text-emerald-100/75 hover:bg-white/[0.06] hover:text-white")}>
    {active && <span className="absolute left-0 h-6 w-1 rounded-r-full bg-amber-400" />}
    <span className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition", active ? "bg-amber-400 text-[#064e3b]" : "text-emerald-100/75 group-hover:text-amber-300")}><Icon size={18} /></span>
    {!collapsed && <span className="whitespace-nowrap">{title}</span>}
  </Link>;
}
