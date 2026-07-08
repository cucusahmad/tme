"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2026-07-14T08:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();

      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      const seconds = Math.floor(
        (distance % (1000 * 60)) /
          1000
      );

      setTimeLeft({
        days: String(days).padStart(3, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Box = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center

      rounded-2xl

      border

      border-cyan-500/20

      bg-black/25

      px-6

      py-5

      backdrop-blur-xl

      shadow-[0_0_25px_rgba(0,168,255,.08)]

      min-w-[95px]
    "
    >
      <h2 className="text-4xl font-bold text-cyan-300">
        {value}
      </h2>

      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    </div>
  );

  return (
  <div className="w-full text-center">

    <p className="mb-6 text-sm uppercase tracking-[0.35em] text-cyan-300">
      Competition Starts In
    </p>

    <div className="flex flex-wrap justify-center gap-6">

      <Box value={timeLeft.days} label="Days" />

      <Box value={timeLeft.hours} label="Hours" />

      <Box value={timeLeft.minutes} label="Minutes" />

      <Box value={timeLeft.seconds} label="Seconds" />

    </div>

  </div>
);
}