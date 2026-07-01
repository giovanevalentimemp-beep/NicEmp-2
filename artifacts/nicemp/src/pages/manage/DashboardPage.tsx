import { BarChart3, Building2, Download, FileSpreadsheet, LineChart, Wallet } from "lucide-react";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { MetricCard } from "@/components/ds/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cashflowRows, companies, dreRows, indicators } from "@/data/finance";
import { formatBRL } from "@/utils/format";

export function DashboardPage() {
  return (
    <AppLayout>
      <PageContainer className="pb-20">
        <PageHeader
          eyebrow="Gerencie"
          title="Dashboard executivo"
          description="Multiempresa com DRE, fluxo de caixa, indicadores, filtros e dados isolados por empresa."
          actions={
            <>
              <Select defaultValue={companies[0].id}>
                <SelectTrigger className="w-56 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Wallet} label="Receita" value="R$ 125.000" helper="+12% vs periodo anterior" />
          <MetricCard icon={FileSpreadsheet} label="Despesas" value="R$ 73.000" helper="58,4% da receita" />
          <MetricCard icon={BarChart3} label="Lucro" value="R$ 52.000" helper="Resultado liquido" />
          <MetricCard icon={LineChart} label="Margem" value="41,6%" helper="Margem liquida" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-lg border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>DRE</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Descricao</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dreRows.map((row) => (
                    <TableRow key={`${row.group}-${row.description}`}>
                      <TableCell>{row.group}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell className="text-right">{formatBRL(row.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Indicadores</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {indicators.map((indicator) => (
                <div key={indicator.label} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm text-slate-500">{indicator.label}</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">{indicator.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 rounded-lg border-slate-200 shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Fluxo de Caixa</CardTitle>
            <Button variant="outline" size="sm">
              <Building2 className="h-4 w-4" />
              Centro de custo
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Centro de custo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashflowRows.map((row) => (
                  <TableRow key={`${row.type}-${row.category}`}>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.costCenter}</TableCell>
                    <TableCell className="text-right">{formatBRL(row.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
