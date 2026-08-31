import Image from "next/image";

export default function AuthLogo() {
  return (
    <div className="flex justify-center text-center">
      <div className="rounded-2xl bg-white px-6 py-3 shadow-sm ring-1 ring-slate-200">
        <Image src="/images/logo-sipeta.png" alt="SIPETA POLRI" width={220} height={220} priority className="h-auto w-44" />
      </div>
    </div>
  );
}
