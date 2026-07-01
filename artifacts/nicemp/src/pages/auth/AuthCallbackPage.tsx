import { useEffect } from "react";
import { useLocation } from "wouter";
import { AppLayout, PageContainer } from "@/components/ds/AppLayout";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

export function AuthCallbackPage() {
  const [, setLocation] = useLocation();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    setLocation(profile?.cpf ? routes.manage : routes.completeCpf);
  }, [loading, profile?.cpf, setLocation]);

  return (
    <AppLayout>
      <PageContainer className="pb-20 text-center text-slate-500">Finalizando login...</PageContainer>
    </AppLayout>
  );
}
