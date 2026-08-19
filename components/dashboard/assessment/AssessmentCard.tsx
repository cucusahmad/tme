"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ProgressBar from "@/components/dashboard/assessment/ProgressBar";
import QuestionCard from "./QuestionCard";
import ScaleSelector from "./ScaleSelector";

export default function AssessmentCard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // State untuk loading saat klik tombol finish
  const [question, setQuestion] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [, setAssessment] = useState<any>(null);
  const [startError, setStartError] = useState<string | null>(null);

  async function loadQuestion() {
    try {
      const res = await api.get("/assessment/question");

      setAssessment(res.data.data.assessment);
      setQuestion(res.data.data.question);
      setProgress(res.data.data.progress);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function startAssessment() {
      try {
        const profileResponse = await api.get("/profile");
        const profile = profileResponse.data.data;

        if (!profile) {
          setStartError("Lengkapi biodata terlebih dahulu sebelum memulai assessment.");
          return;
        }

        if (!profile.profession_id) {
          setStartError("Pilih profesi pada biodata terlebih dahulu sebelum memulai assessment.");
          return;
        }

        await api.post("/assessment/start");
        await loadQuestion();
      } catch (error) {
        console.error(error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : null;

        setStartError(message || "Gagal memulai assessment.");
      } finally {
        setLoading(false);
      }
    }

    void startAssessment();
  }, []);

  async function handleAnswer(value: number) {
    try {
      // 1. Simpan jawaban ke database
      await api.post("/assessment/answer", {
        question_id: question.question_id,
        answer_value: value,
      });

      // 2. Ambil soal berikutnya & perbarui progres terbaru
      const res = await api.get("/assessment/question");

      setAssessment(res.data.data.assessment);
      setQuestion(res.data.data.question);
      setProgress(res.data.data.progress);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan jawaban.");
    }
  }

  async function finishAssessment() {
    setSubmitting(true);
    try {
      await api.post("/assessment/finish");
      toast.success("Assessment selesai.");
      router.push("/dashboard/result");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Gagal menyelesaikan assessment.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow text-center font-medium text-slate-600">
        Memuat Assessment...
      </div>
    );
  }

  if (startError) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800">
          Assessment Belum Dapat Dimulai
        </h2>
        <p className="mt-3 text-slate-500">{startError}</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/profile")}
          className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          Lengkapi Biodata
        </button>
      </div>
    );
  }

  // TAMPILAN JIKA PERTANYAAN SUDAH HABIS
  if (!question) {
    // Validasi apakah jawaban terkumpul sudah pas 100%
    const isCompleted =
      progress?.percentage === 100 ||
      (progress?.current === progress?.total && progress?.total > 0);

    return (
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800">
          Assessment Selesai Dijawab
        </h2>
        <p className="mt-2 text-slate-500">
          Anda telah merespons {progress?.current} dari {progress?.total} pertanyaan.
        </p>

        <div className="mt-6 border-t border-slate-100 pt-6">
          {isCompleted ? (
            <div className="space-y-4">
              <p className="text-sm text-green-600 font-medium">
                🎉 Progres pengerjaan Anda telah mencapai 100%. Silakan klik tombol di bawah untuk mengalkulasi hasil penilaian Anda.
              </p>
              <button
                onClick={finishAssessment}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md transition duration-200"
              >
                {submitting ? "Memproses Hasil..." : "Kirim & Lihat Hasil Assessment"}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-amber-600 font-semibold">
                ⚠️ Progres pengerjaan belum 100% (Baru {progress?.percentage ?? 0}%).
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Beberapa jawaban terakhir Anda mungkin sedang dalam antrean sinkronisasi database. Mohon tunggu beberapa saat atau muat ulang halaman jika progress tidak berubah.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TAMPILAN UTAMA PERTANYAAN ASSESSMENT
  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl space-y-6">
      <ProgressBar
        current={progress?.current ?? 0}
        total={progress?.total ?? 0}
        percentage={progress?.percentage ?? 0}
      />

      <QuestionCard question={question} />

      <ScaleSelector onSelect={handleAnswer} />
    </div>
  );
}
