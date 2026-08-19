import Image from "next/image";

export default function AuthLogo() {
  return (
    <div className="flex justify-center">
      <div
        className="flex h-20 w-44 items-center justify-center rounded-2xl bg-white px-4 shadow-sm ring-1 ring-slate-200"
      >
        <Image
          src="/images/logo-ubl.png"
          width={256}
          height={153}
          alt="Universitas Bandar Lampung"
          className="h-auto w-full object-contain"
          preload
        />
      </div>
    </div>
  );
}
