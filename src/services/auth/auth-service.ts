import { getSupabaseClient } from "@/services/supabase/client";

export async function signInWithEmail(email: string, password: string) {
  return getSupabaseClient().auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return getSupabaseClient().auth.signUp({ email, password });
}

export async function signInWithGoogle(redirectTo?: string) {
  return getSupabaseClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}

export async function signOut() {
  return getSupabaseClient().auth.signOut();
}
