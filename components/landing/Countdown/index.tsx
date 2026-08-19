"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-07-14T08:00:00+07:00").getTime();

function CountdownBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[95px] flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-black/25 px-6 py-5 shadow-[0_0_25px_rgba(0,168,255,.08)] backdrop-blur-xl">
      <h2 className="text-4xl font-bold text-cyan-300">{value}</h2>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();

      const distance = TARGET_DATE - now;

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

  return (
  <div className="w-full text-center">

    <p className="mb-6 text-sm uppercase tracking-[0.35em] text-cyan-300">
      Competition Starts In
    </p>

    <div className="flex flex-wrap justify-center gap-6">

      <CountdownBox value={timeLeft.days} label="Days" />

      <CountdownBox value={timeLeft.hours} label="Hours" />

      <CountdownBox value={timeLeft.minutes} label="Minutes" />

      <CountdownBox value={timeLeft.seconds} label="Seconds" />

    </div>

  </div>
);
}
