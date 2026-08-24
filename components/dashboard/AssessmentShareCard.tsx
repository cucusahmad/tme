"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import api from "@/lib/api";

export default function AssessmentShareCard() {
  const [shareUrl, setShareUrl] = useState("");
  const [completed, setCompleted] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    api.post("/assessment/share")
      .then((response) => {
        setShareUrl(response.data.data.shareUrl);
        setCompleted(response.data.data.completed);
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message ?? "QR penilaian belum dapat dibuat.");
      });
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({
        title: "Penilaian SIPETA POLRI",
        text: "Bantu nilai kompetensi saya melalui assessment singkat ini.",
        url: shareUrl,
      });
      return;
    }
    await copyLink();
  }

  return (
    <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm sm:p-7" aria-labelledby="share-assessment-title">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <QrCode size={15} /> Penilaian 360°
          </span>
          <h2 id="share-assessment-title" className="mt-4 text-xl font-bold text-slate-900">Minta orang lain menilai Anda</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Bagikan QR atau tautan ini kepada rekan, atasan, teman, atau keluarga. Mereka dapat mengisi assessment tanpa login.
          </p>
          {shareUrl && (
            <>
              <p className="mt-4 text-sm font-semibold text-emerald-700">{completed} penilaian eksternal telah selesai</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                  {copied ? <Check size={17} /> : <Copy size={17} />} {copied ? "Tersalin" : "Salin tautan"}
                </button>
                <button type="button" onClick={shareLink} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
                  <Share2 size={17} /> Bagikan
                </button>
              </div>
            </>
          )}
          {error && <p className="mt-4 text-sm font-medium text-amber-700">{error}</p>}
        </div>

        <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {shareUrl ? <QRCodeSVG value={shareUrl} size={176} level="M" marginSize={1} /> : <div className="h-40 w-40 animate-pulse rounded-xl bg-slate-100" />}
        </div>
      </div>
    </section>
  );
}
