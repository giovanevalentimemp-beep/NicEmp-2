import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

export function ProfilePage() {
  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          eyebrow="Perfil"
          title="Meu Perfil"
          description="Gerencie suas informações pessoais."
        />

        <Card>
          <CardContent className="p-6">
            <p>Página de perfil em construção.</p>
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}