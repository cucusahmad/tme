import Link from "next/link";

const menus = [
  {
    title: "Competition",
    href: "/dashboard/competition",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
  },
  {
    title: "My Team",
    href: "/dashboard/team",
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
  },
];

export default function QuickAction() {
  return (
    <div>

      <h2 className="mb-6 text-2xl font-bold text-white">
        Quick Action
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        {menus.map((menu) => (

          <Link
            key={menu.title}
            href={menu.href}
            className="rounded-2xl border border-cyan-500/20 bg-white/5 p-8 transition hover:border-cyan-400 hover:bg-white/10"
          >
            <h3 className="text-lg font-semibold text-white">
              {menu.title}
            </h3>
          </Link>

        ))}

      </div>

    </div>
  );
}