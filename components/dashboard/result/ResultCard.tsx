"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import RecommendationCard from "./RecommendationCard";
import RankingTable from "./RankingTable";
import DimensionChart from "./DimensionChart";

export default function ResultCard() {

  const [loading, setLoading] =
    useState(true);

  const [recommendation, setRecommendation] =
    useState<any>(null);

  const [ranking, setRanking] =
    useState<any[]>([]);

  const [dimensions, setDimensions] =
    useState<any[]>([]);

  useEffect(() => {
    async function loadResult() {
      try {

      const res =
        await api.get(
          "/assessment/result"
        );

      setRecommendation(
        res.data.data.recommendation
      );

      setRanking(
        res.data.data.ranking
      );

      setDimensions(
        res.data.data.dimensions
      );

    } catch (error) {

      console.error(error);

      } finally {
        setLoading(false);
      }
    }

    void loadResult();
  }, []);

  if (loading) {

    return (

      <div className="rounded-3xl bg-white p-10 shadow">

        Memuat hasil assessment...

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <RecommendationCard
        recommendation={recommendation}
      />

      <RankingTable
        ranking={ranking}
      />

      <DimensionChart
        dimensions={dimensions}
      />

    </div>

  );

}
