export default function HeroBackground() {
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#faf7ee]">
 <div className="absolute -right-32 top-20 h-[600px] w-[600px] rounded-full bg-emerald-100/60 blur-3xl" />
 <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />
 </div>;
}
