"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export function LogoutButton() {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <button
      className="rounded-lg border border-[#2A3142] px-3 py-2 text-sm font-black text-[#A7B0C0] hover:bg-[#171C2A] hover:text-white"
      onClick={() => {
        void signOut();
      }}
      type="button"
    >
      Deconnexion
    </button>
  );
}
