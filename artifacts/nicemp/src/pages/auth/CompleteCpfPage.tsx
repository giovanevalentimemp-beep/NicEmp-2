import { FormEvent, useState } from "react";
import { Redirect, useLocation } from "wouter";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import { formatCpf, isValidCpf } from "@/lib/cpf";
import { useAuth } from "@/hooks/use-auth";
import { saveUserCpf } from "@/services/profiles/profile-service";

export function CompleteCpfPage() {
  const [, setLocation] = useLocation();
  const { user, profile, refreshProfile, loading } = useAuth();
  const [cpf, setCpf] = useState(profile?.cpf ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!loading && !user) return <Redirect to={routes.login} />;
  if (!loading && profile?.cpf) return <Redirect to={routes.manage} />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!user) return;
    if (!isValidCpf(cpf)) {
      setError("Informe um CPF valido.");
      return;
    }

    try {
      setSaving(true);
      const result = await saveUserCpf(user.id, cpf);
      if (result.error) throw result.error;
      await refreshProfile();
      setLocation(routes.manage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar o CPF.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <PageContainer className="max-w-3xl pb-20">
        <PageHeader
          eyebrow="Primeiro acesso"
          title="Confirme seu CPF"
          description="O CPF e obrigatorio e unico para evitar multiplos cadastros da mesma pessoa."
        />
        <Card className="rounded-lg border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="cpf">
                  CPF
                </label>
                <Input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(event) => setCpf(formatCpf(event.target.value))}
                  required
                />
                {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar e continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
