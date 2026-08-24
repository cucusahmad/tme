import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIPETA POLRI | Sistem Informasi Pemetaan Talenta Polri",
  description:
    "Sistem informasi pemetaan kompetensi dan potensi personel Polri untuk mendukung pengembangan karier serta penempatan yang tepat.",
  keywords: ["SIPETA POLRI", "pemetaan talenta", "kompetensi Polri", "SDM Polri"],
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
