"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "../../lib/supabase";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setError("root", { message: error.message });
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    if (rolesError || !roles?.some((row) => row.role === "admin")) {
      await supabase.auth.signOut();
      setError("root", { message: "Ce compte n'a pas le role administrateur." });
      return;
    }

    router.push("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#05070D] p-6 text-white">
      <form
        className="grid w-full max-w-sm gap-4 rounded-lg border border-[#2A3142] bg-[#111521] p-6"
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <h1 className="text-2xl font-black">Connexion admin</h1>
        <input
          className="rounded-lg bg-[#05070D] px-4 py-3"
          placeholder="Email"
          {...register("email")}
        />
        <input
          className="rounded-lg bg-[#05070D] px-4 py-3"
          placeholder="Mot de passe"
          type="password"
          {...register("password")}
        />
        {formState.errors.root ? (
          <p className="text-sm text-[#FB7185]">{formState.errors.root.message}</p>
        ) : null}
        <button
          className="rounded-lg bg-[#38BDF8] px-4 py-3 font-black text-[#05070D]"
          type="submit"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
