"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  ClipboardList,
  Briefcase,
  BarChart3,
  Target,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Brain,
} from "lucide-react";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        ${collapsed ? "w-24" : "w-72"}
        transition-all
        duration-300
        border-r
        border-slate-200
        bg-white/80
        backdrop-blur-xl
        shadow-xl
      `}
    >
      <div className="flex h-full flex-col">

        {/* Logo */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">

              <Brain
                className="text-white"
                size={24}
              />

            </div>

            {!collapsed && (

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Talent Match
                </h2>

                <p className="text-xs text-slate-500">
                  Career Dashboard
                </p>

              </div>

            )}

          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            {collapsed ? (
              <ChevronRight className="text-slate-700" />
            ) : (
              <ChevronLeft className="text-slate-700" />
            )}
          </button>

        </div>

        {/* Menu */}

        <nav className="flex-1 space-y-2 p-4">

              <SidebarItem
          href="/dashboard"
          icon={LayoutDashboard}
          title="Dashboard"
          collapsed={collapsed}
        />

          <SidebarItem
            href="/dashboard/profile"
            icon={UserRound}
            title="Biodata"
            collapsed={collapsed}
          />

          <SidebarItem
            href="/dashboard/assessment"
            icon={ClipboardList}
            title="Assessment"
            collapsed={collapsed}
          />

          <SidebarItem
            href="/dashboard/result"
            icon={BarChart3}
            title="Hasil Assessment"
            collapsed={collapsed}
          />

          <SidebarItem
            href="/dashboard/recommendation"
            icon={Briefcase}
            title="Rekomendasi"
            collapsed={collapsed}
          />

          <SidebarItem
            href="/dashboard/roadmap"
            icon={Target}
            title="Roadmap Karier"
            collapsed={collapsed}
          />

        </nav>

        {/* Bottom */}

        <div className="space-y-2 border-t border-slate-200 p-4">

          <SidebarItem
            href="/dashboard/settings"
            icon={Settings}
            title="Pengaturan"
            collapsed={collapsed}
          />

          <SidebarItem
            href="/"
            icon={LogOut}
            title="Logout"
            collapsed={collapsed}
          />

        </div>

      </div>

    </aside>
  );
}