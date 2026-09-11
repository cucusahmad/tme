import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#faf7ee] px-4 py-8 sm:px-6 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(209,250,229,.65),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(254,243,199,.4),transparent_50%)]" />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
