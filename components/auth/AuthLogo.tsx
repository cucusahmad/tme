import { Bot } from "lucide-react";

export default function AuthLogo() {
  return (
    <div className="flex justify-center">

      <div
        className="
        flex

        h-20

        w-20

        items-center

        justify-center

        rounded-full

        bg-gradient-to-br

        from-cyan-500

        to-blue-600

        shadow-[0_0_50px_rgba(0,168,255,.35)]
      "
      >
        <Bot
          size={40}
          className="text-white"
        />
      </div>

    </div>
  );
}