import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talent Match Ecosystem | Temukan Profesi yang Sesuai",
  description:
    "Platform pencocokan potensi dan kompetensi individu dengan profesi yang sesuai, dilengkapi asesmen dan rekomendasi pengembangan karier.",
  keywords: ["Talent Match Ecosystem", "pemetaan talenta", "kecocokan profesi", "pengembangan karier"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
