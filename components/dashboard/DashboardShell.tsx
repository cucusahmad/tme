"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

export default function DashboardShell({
  children,
  isSupervisor,
}: Readonly<{
  children: React.ReactNode;
  isSupervisor: boolean;
}>) {
  const [openSidebar, setOpenSidebar] =
    useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard/admin")) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(4,120,87,0.08),transparent_28%),radial-gradient(circle_at_35%_85%,rgba(245,158,11,0.06),transparent_25%)]" />

      {/* Sidebar Desktop */}

      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">

        <Sidebar isSupervisor={isSupervisor} />

      </div>

      {/* Sidebar Mobile */}

      <MobileSidebar
        isSupervisor={isSupervisor}
        open={openSidebar}
        onClose={() =>
          setOpenSidebar(false)
        }
      />

      {/* Content */}

      <div className="relative lg:ml-72">

        <Navbar
          onOpenSidebar={() =>
            setOpenSidebar(true)
          }
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {children}

        </main>

      </div>

    </div>
  );
}
