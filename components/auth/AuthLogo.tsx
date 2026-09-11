import Image from "next/image";

export default function AuthLogo() {
  return (
    <div className="flex justify-center text-center">
      <div className="rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-slate-200">
        <Image src="/images/logo-talent-match.svg" alt="Talent Match Ecosystem" width={240} height={150} preload className="h-auto w-44" />
      </div>
    </div>
  );
}
