"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface Props {
  href: string;
  icon: LucideIcon;
  title: string;
  collapsed?: boolean;
}

export default function SidebarItem({
  href,
  icon: Icon,
  title,
  collapsed,
}: Props) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    (href !== "/dashboard" &&
      pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx(
        `
        group
        flex
        items-center
        gap-4
        rounded-2xl
        px-4
        py-3.5
        transition-all
        duration-300
        `,
        active
          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
          : "text-slate-700 hover:bg-slate-100 hover:text-cyan-600"
      )}
    >
      <Icon
        size={20}
        className={clsx(
          "transition",
          active
            ? "text-white"
            : "text-slate-500 group-hover:text-cyan-600"
        )}
      />

      {!collapsed && (
        <span className="font-medium whitespace-nowrap">
          {title}
        </span>
      )}
    </Link>
  );
}