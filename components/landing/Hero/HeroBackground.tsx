export default function HeroBackground() {
  return (
    <div
      className="
        fixed
        inset-0
        -z-50
        bg-cover
        bg-center
        bg-no-repeat
        bg-fixed
      "
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(255,255,255,.92) 0%,
            rgba(255,255,255,.78) 28%,
            rgba(255,255,255,.50) 45%,
            rgba(255,255,255,.15) 65%,
            rgba(255,255,255,.40) 100%
          ),
          linear-gradient(
            to top,
            rgba(248,250,252,.90) 0%,
            rgba(248,250,252,.25) 35%,
            transparent 60%
          ),
          url('/images/hero/background.webp')
        `,
      }}
    >
      {/* Glow Kiri */}
      <div className="absolute left-[-220px] top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-cyan-300/35 blur-[180px]" />

      {/* Glow Kanan */}
      <div className="absolute right-[-220px] top-24 h-[600px] w-[600px] rounded-full bg-blue-400/30 blur-[180px]" />

      {/* Glow Tengah */}
      <div className="absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-sky-300/20 blur-[140px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,233,.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,.10) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Efek Cahaya */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 30%, rgba(34,211,238,.20), transparent 35%),
            radial-gradient(circle at 80% 25%, rgba(59,130,246,.18), transparent 35%),
            radial-gradient(circle at 60% 80%, rgba(125,211,252,.15), transparent 40%)
          `,
        }}
      />
    </div>
  );
}