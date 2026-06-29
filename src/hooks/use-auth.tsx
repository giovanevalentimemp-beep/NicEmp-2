import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/env";
import { getSupabaseClient, supabase } from "@/services/supabase/client";
import { ensureUserProfile, getProfile, type Profile } from "@/services/profiles/profile-service";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = async (user: User | null) => {
    if (!user || !isSupabaseConfigured) {
      setProfile(null);
      return;
    }

    const ensured = await ensureUserProfile(user);
    if (ensured.error) throw ensured.error;
    setProfile(ensured.data);
  };

  const refreshProfile = async () => {
    if (!session?.user || !isSupabaseConfigured) return;
    const result = await getProfile(session.user.id);
    if (result.error) throw result.error;
    setProfile(result.data);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    getSupabaseClient()
      .auth.getSession()
      .then(async ({ data }) => {
        setSession(data.session);
        await loadProfile(data.session?.user ?? null);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      loadProfile(nextSession?.user ?? null).catch(() => setProfile(null));
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      loading,
      isAdmin: profile?.role === "admin",
      refreshProfile,
    }),
    [loading, profile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
