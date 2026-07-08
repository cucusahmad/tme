"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  UserRound,
  ClipboardList,
  Briefcase,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Brain,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Biodata",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "Assessment",
    href: "/dashboard/assessment",
    icon: ClipboardList,
  },
  {
    title: "Hasil Assessment",
    href: "/dashboard/result",
    icon: BarChart3,
  },
  {
    title: "Profesi",
    href: "/dashboard/profession",
    icon: Briefcase,
  },
  {
    title: "Roadmap Karier",
    href: "/dashboard/roadmap",
    icon: Target,
  },
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function MobileSidebar({
  open,
  onClose,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition lg:hidden ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden

        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">

              <Brain
                className="text-white"
                size={24}
              />

            </div>

            <div>

              <h1 className="text-lg font-bold text-slate-900">
                Talent Match
              </h1>

              <p className="text-xs text-slate-500">
                Career Dashboard
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X className="text-slate-700" />
          </button>

        </div>

        {/* Menu */}

        <nav className="mt-6 space-y-2 px-4">

          {menus.map((menu) => {

            const Icon = menu.icon;

            const active =
              pathname === menu.href;

            return (

              <Link
                key={menu.href}
                href={menu.href}
                onClick={onClose}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 font-medium transition

                ${
                  active
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >

                <Icon size={20} />

                <span>{menu.title}</span>

              </Link>

            );

          })}

        </nav>

        {/* Footer */}

        <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 p-5">

          <button
            className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-red-500
            py-4
            font-semibold
            text-white
            transition
            hover:bg-red-600
            "
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}