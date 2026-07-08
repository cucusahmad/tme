import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-screen min-h-[850px] overflow-hidden"
    >
      <HeroBackground />

      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050816]/90 via-[#050816]/60 to-transparent" />

      {/* Content */}
  <div
  className="
    relative
    z-20

    mx-auto

    flex

    h-full

    w-full

    max-w-[1400px]

    items-center

    px-8

  pt-10
lg:pt-12
"
>
        <div className="grid w-full items-center gap-20 lg:grid-cols-[52%_48%]">
          <HeroContent />

          {/* Robot menjadi background */}
          <div />
        </div>
      </div>
    </section>
  );
}