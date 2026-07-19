"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthState = "checking" | "allowed" | "denied";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<AuthState>(pathname === "/login" ? "allowed" : "checking");

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      if (pathname === "/login") {
        setState("allowed");
        return;
      }

      setState("checking");
      const { data: userResult, error: userError } = await supabase.auth.getUser();
      if (cancelled) return;

      if (userError || !userResult.user) {
        setState("denied");
        router.replace("/login");
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userResult.user.id);

      if (cancelled) return;

      if (rolesError || !roles?.some((row) => row.role === "admin")) {
        await supabase.auth.signOut();
        setState("denied");
        router.replace("/login");
        return;
      }

      setState("allowed");
    }

    void checkAccess();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void checkAccess();
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (state !== "allowed") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#05070D] p-6 text-white">
        <div className="rounded-lg border border-[#2A3142] bg-[#111521] p-5 text-sm font-bold text-[#A7B0C0]">
          Verification de l'acces admin...
        </div>
      </main>
    );
  }

  return children;
}
