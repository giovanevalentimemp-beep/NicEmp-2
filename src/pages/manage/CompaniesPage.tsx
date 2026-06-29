import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Card, CardContent } from "@/components/ui/card";

export function CompaniesPage() {
  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          eyebrow="Empresas"
          title="Minhas Empresas"
          description="Gerencie as empresas vinculadas à sua conta."
        />

        <Card>
          <CardContent className="p-6">
            <p>Nenhuma empresa cadastrada.</p>
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}