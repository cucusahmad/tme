import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DashboardCard({
  children,
}: Props) {
  return (
    <div
      className="
      rounded-3xl

      border

      border-emerald-500/20

      bg-white/5

      p-8

      backdrop-blur-xl

      transition

      hover:border-emerald-400
    "
    >
      {children}
    </div>
  );
}