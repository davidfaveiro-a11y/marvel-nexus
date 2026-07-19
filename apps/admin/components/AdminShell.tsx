import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/invitations", label: "Invitations" },
  { href: "/catalog", label: "Catalogue" },
  { href: "/rarities", label: "Raretes" },
  { href: "/settings", label: "Parametres" },
  { href: "/players", label: "Joueurs" },
  { href: "/audit", label: "Audit" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05070D] text-[#F5F7FA]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#2A3142] bg-[#0B0F19] p-6 md:block">
        <div className="text-xl font-black">Marvel Nexus</div>
        <nav className="mt-10 grid gap-2">
          {nav.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#A7B0C0] hover:bg-[#171C2A] hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <LogoutButton />
        </div>
      </aside>
      <header className="flex items-center justify-between border-b border-[#2A3142] bg-[#0B0F19] px-5 py-4 md:hidden">
        <div className="text-lg font-black">Marvel Nexus</div>
        <LogoutButton />
      </header>
      <main className="md:pl-64">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
