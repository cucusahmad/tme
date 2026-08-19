"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "@/lib/api";

import GenerateCard from "./GenerateCard";
import RecommendationContent from "./RecommendationContent";

export default function RecommendationPage() {

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [recommendation, setRecommendation] =
    useState<any>(null);

  async function loadRecommendation() {
    try {

      const res =
        await api.get(
          "/assessment/recommendation"
        );

      setRecommendation(
        res.data.data
      );

    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    let active = true;

    api.get("/assessment/recommendation")
      .then((res) => {
        if (active) setRecommendation(res.data.data);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function generateAI() {

    try {

      setGenerating(true);

      await api.post(
        "/assessment/generate-rec"
      );

      toast.success(
        "AI Recommendation berhasil dibuat."
      );

      await loadRecommendation();

    } catch (e: any) {

      toast.error(
        e?.response?.data?.message ??
          "Generate gagal."
      );

    } finally {

      setGenerating(false);

    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Memuat...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">

      {!recommendation ? (

        <GenerateCard
          loading={generating}
          onGenerate={generateAI}
        />

      ) : (

        <RecommendationContent
          recommendation={recommendation}
        />

      )}

    </div>
  );
}
