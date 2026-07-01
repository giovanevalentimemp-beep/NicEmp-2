import { useState } from "react";
import { Redirect, useLocation } from "wouter";
import { Chrome } from "lucide-react";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { isSupabaseConfigured } from "@/config/env";
import { useAuth } from "@/hooks/use-auth";
import { signInWithGoogle, signInWithEmail } from "@/services/auth/auth-service";
import { tryLocalLogin } from "@/services/auth/local-auth";

export function LoginPage() {
  const { user, profile, localAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  if (localAdmin) return <Redirect to={routes.admin} />;
  if (user && profile?.cpf) return <Redirect to={routes.manage} />;
  if (user && !profile?.cpf) return <Redirect to={routes.completeCpf} />;

  const handleGoogle = async () => {
    await signInWithGoogle(`${window.location.origin}${routes.authCallback}`);
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const localOk = tryLocalLogin(email, password);
      if (localOk) {
        window.location.href = routes.admin;
        return;
      }

      if (!isSupabaseConfigured) {
        setError("Credenciais inválidas.");
        return;
      }

      const { error: authError } = await signInWithEmail(email, password);
      if (authError) setError("Email ou senha incorretos.");
    } catch {
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageContainer className="max-w-3xl pb-20">
        <PageHeader
          eyebrow="Acesso NICEMP"
          title="Entre para gerenciar sua empresa"
          description="Use sua conta Google ou email/senha para acessar o painel."
        />
        <Card className="rounded-lg border-slate-200 shadow-sm">
          <CardContent className="space-y-5 p-6">
            {!isSupabaseConfigured ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Login com Google indisponível. Use email e senha para entrar.
              </div>
            ) : null}

            <Button
              className="w-full"
              size="lg"
              onClick={handleGoogle}
              disabled={!isSupabaseConfigured}
            >
              <Chrome className="h-4 w-4" />
              Entrar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">ou</span>
              </div>
            </div>

            {!showEmail ? (
              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => setShowEmail(true)}
              >
                Entrar com email e senha
              </button>
            ) : (
              <form onSubmit={handleEmail} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
