"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [openSidebar, setOpenSidebar] =
    useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard/admin")) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar Desktop */}

      <div className="fixed left-0 top-0 hidden h-screen lg:block">

        <Sidebar />

      </div>

      {/* Sidebar Mobile */}

      <MobileSidebar
        open={openSidebar}
        onClose={() =>
          setOpenSidebar(false)
        }
      />

      {/* Content */}

      <div className="lg:ml-72">

        <Navbar
          onOpenSidebar={() =>
            setOpenSidebar(true)
          }
        />

        <main className="p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>
  );
}
