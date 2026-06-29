import { Redirect } from "wouter";
import { Chrome } from "lucide-react";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/constants/routes";
import { isSupabaseConfigured } from "@/config/env";
import { useAuth } from "@/hooks/use-auth";
import { signInWithGoogle } from "@/services/auth/auth-service";

export function LoginPage() {
  const { user, profile } = useAuth();

  if (user && profile?.cpf) return <Redirect to={routes.manage} />;
  if (user && !profile?.cpf) return <Redirect to={routes.completeCpf} />;

  const handleGoogle = async () => {
    await signInWithGoogle(`${window.location.origin}${routes.authCallback}`);
  };

  return (
    <AppLayout>
      <PageContainer className="max-w-3xl pb-20">
        <PageHeader
          eyebrow="Acesso NICEMP"
          title="Entre para gerenciar sua empresa"
          description="Use sua conta Google para acessar o painel, salvar dados financeiros e publicar conteudos."
        />
        <Card className="rounded-lg border-slate-200 shadow-sm">
          <CardContent className="space-y-5 p-6">
            {!isSupabaseConfigured ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para habilitar o login.
              </div>
            ) : null}
            <Button className="w-full" size="lg" onClick={handleGoogle} disabled={!isSupabaseConfigured}>
              <Chrome className="h-4 w-4" />
              Entrar com Google
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
