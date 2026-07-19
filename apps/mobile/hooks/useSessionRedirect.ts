import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type SessionTarget = "/home" | "/sign-in" | null;

export function useSessionRedirect() {
  const [target, setTarget] = useState<SessionTarget>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        setTarget(data.session ? "/home" : "/sign-in");
      }
    }

    void resolveSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setTarget(session ? "/home" : "/sign-in");
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  return target;
}
