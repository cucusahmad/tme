export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#071426]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero/background.webp')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(39,113,148,.28),transparent_28%),radial-gradient(circle_at_20%_72%,rgba(180,141,56,.13),transparent_26%),linear-gradient(120deg,rgba(7,20,38,.94)_0%,rgba(11,32,56,.78)_55%,rgba(7,23,40,.86)_100%)]" />
      <div className="talent-grid absolute inset-0 opacity-30" />
    </div>
  );
}
