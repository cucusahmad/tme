"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Bell,
  Menu,
  UserCircle2,
} from "lucide-react";

import api from "@/lib/api";

interface Props {
  onOpenSidebar?: () => void;
}

export default function Navbar({
  onOpenSidebar,
}: Props) {
  const pathname = usePathname();

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get(
        "/user/profile"
      );

      setProfile(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  const title = useMemo(() => {
    if (pathname === "/dashboard")
      return "Dashboard";

    if (
      pathname.startsWith(
        "/dashboard/profile"
      )
    )
      return "Biodata";

    if (
      pathname.startsWith(
        "/dashboard/assessment"
      )
    )
      return "Assessment";

    if (
      pathname.startsWith(
        "/dashboard/result"
      )
    )
      return "Hasil Assessment";

    if (
      pathname.startsWith(
        "/dashboard/profession"
      )
    )
      return "Profesi";

    if (
      pathname.startsWith(
        "/dashboard/roadmap"
      )
    )
      return "Roadmap Karier";

    if (
      pathname.startsWith(
        "/dashboard/settings"
      )
    )
      return "Pengaturan";

    return "Dashboard";
  }, [pathname]);

  const initials = useMemo(() => {
    if (!profile?.nama_lengkap)
      return "U";

    return profile.nama_lengkap
      .split(" ")
      .map(
        (item: string) => item[0]
      )
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [profile]);

  return (
    <header
      className="
      sticky
      top-0
      z-30
      flex
      h-20
      items-center
      justify-between
      border-b
      border-slate-200
      bg-white/80
      px-6
      backdrop-blur-xl
      lg:px-8
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-4">

        <button
          onClick={onOpenSidebar}
          className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="text-slate-700" />
        </button>

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="text-sm text-slate-500">
            Selamat datang kembali 👋
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5">

        <button
          className="
          relative
          rounded-xl
          p-2
          transition
          hover:bg-slate-100
          "
        >

          <Bell className="text-slate-700" />

          <span
            className="
            absolute
            right-2
            top-2
            h-2
            w-2
            rounded-full
            bg-red-500
            "
          />

        </button>

        <div
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-3
          py-2
          shadow-sm
          "
        >

          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            font-bold
            text-white
            "
          >

            {profile
              ? initials
              : <UserCircle2 size={24} />}

          </div>

          <div className="hidden sm:block">

            <h3 className="text-sm font-semibold text-slate-900">

              {profile?.nama_lengkap ??
                "Pengguna"}

            </h3>

            <p className="text-xs text-slate-500">

              {profile?.email ??
                "Talent Match User"}

            </p>

          </div>

        </div>

      </div>

    </header>
  );
}