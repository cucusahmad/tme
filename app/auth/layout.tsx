import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero/background.webp')",
      }}
    >
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* Static gradients avoid large offscreen blur surfaces. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,.15),transparent_50%)]" />

      {/* Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </main>
  );
}
