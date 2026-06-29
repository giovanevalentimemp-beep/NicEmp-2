import { Redirect } from "wouter";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 pt-32 text-center text-slate-500">Carregando...</div>;
  }

  if (!user) return <Redirect to={routes.login} />;
  if (!profile?.cpf) return <Redirect to={routes.completeCpf} />;
  if (adminOnly && !isAdmin) return <Redirect to={routes.manage} />;

  return <>{children}</>;
}
