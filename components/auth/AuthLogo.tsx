import Image from "next/image";
import Link from "next/link";

export default function AuthLogo() {
  return (
    <Link href="/" className="mx-auto flex w-fit items-center justify-center gap-3 rounded-xl">
      <Image src="/images/logo-talent-match-mark.svg" alt="" width={48} height={48} className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
      <span className="flex flex-col">
        <span className="text-sm font-black tracking-tight text-emerald-950 sm:text-lg">Talent Match Ecosystem</span>
        <span className="text-xs font-medium text-slate-600">Kenali Potensi, Temukan Profesi</span>
      </span>
    </Link>
  );
}
