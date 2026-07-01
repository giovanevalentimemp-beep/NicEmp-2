import type { User } from "@supabase/supabase-js";
import { formatCpf, isValidCpf } from "@/lib/cpf";
import { getSupabaseClient } from "@/services/supabase/client";

export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  nome: string;
  cpf: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export async function getProfile(userId: string) {
  return getSupabaseClient()
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();
}

export async function ensureUserProfile(user: User) {
  const email = user.email ?? "";
  const nome =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    email.split("@")[0] ??
    "Usuario NICEMP";
  const avatar_url = (user.user_metadata?.avatar_url as string | undefined) ?? null;

  return getSupabaseClient()
    .from("users")
    .upsert(
      {
        id: user.id,
        email,
        nome,
        avatar_url,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("*")
    .single<Profile>();
}

export async function saveUserCpf(userId: string, cpf: string) {
  if (!isValidCpf(cpf)) {
    throw new Error("CPF invalido.");
  }

  const formattedCpf = formatCpf(cpf);
  return getSupabaseClient()
    .from("users")
    .update({ cpf: formattedCpf, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("*")
    .single<Profile>();
}
