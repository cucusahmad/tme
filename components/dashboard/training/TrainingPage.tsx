"use client";

import { useMemo, useState } from "react";

import HeroSection from "./HeroSection";
import CategoryFilter from "./CategoryFilter";
import FeaturedTraining from "./FeaturedTraining";
import TrainingGrid from "./TrainingGrid";

import {
  trainings,
  categories,
} from "@/data/training";

export default function TrainingPage() {
  const [keyword, setKeyword] =
    useState("");

  const [category, setCategory] =
    useState("Semua");

  const featured = useMemo(() => {
    return trainings.filter(
      (item) => item.featured
    );
  }, []);

  const filtered = useMemo(() => {
    return trainings.filter((item) => {
      const matchCategory =
        category === "Semua"
          ? true
          : item.category === category;

      const matchKeyword =
        item.title
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        item.provider
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          );

      return (
        matchCategory &&
        matchKeyword
      );
    });
  }, [keyword, category]);

  return (
    <div className="space-y-10">

      {/* Hero */}

      <HeroSection
        keyword={keyword}
        onSearch={setKeyword}
      />

      {/* Featured */}

      <FeaturedTraining
        trainings={featured}
      />

      {/* Category */}

      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={setCategory}
      />

      {/* Grid */}

      <TrainingGrid
        trainings={filtered}
      />

    </div>
  );
}