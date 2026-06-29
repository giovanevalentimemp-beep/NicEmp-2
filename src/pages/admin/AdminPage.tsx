import { Image, Newspaper, ShieldCheck, Tags, Users, Video } from "lucide-react";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { MetricCard } from "@/components/ds/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categories, posts } from "@/data/cms";

const modules = [
  { title: "Usuarios", icon: Users, description: "Permissoes, CPF e administradores." },
  { title: "Artigos", icon: Newspaper, description: "CMS Aprenda com status editorial." },
  { title: "Categorias", icon: Tags, description: "Organizacao de conteudo." },
  { title: "Videos", icon: Video, description: "Links do YouTube e galerias." },
  { title: "Midia", icon: Image, description: "Supabase Storage por pasta." },
  { title: "Empresas", icon: ShieldCheck, description: "Dados isolados por empresa." },
];

export function AdminPage() {
  return (
    <AppLayout>
      <PageContainer className="pb-20">
        <PageHeader
          eyebrow="Admin"
          title="Painel administrativo"
          description="Area protegida para gerenciar usuarios, artigos, categorias, videos, midia, empresas e indicadores."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Usuarios" value="1" helper="CPF obrigatorio" icon={Users} />
          <MetricCard label="Artigos" value={String(posts.length)} helper="Rascunho, publicado e agendado" icon={Newspaper} />
          <MetricCard label="Categorias" value={String(categories.length)} helper="CMS Aprenda" icon={Tags} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.title} className="rounded-lg border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <module.icon className="h-6 w-6 text-green-700" />
                <h2 className="mt-4 text-lg font-bold text-slate-950">{module.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 rounded-lg border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Editor de posts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <Input placeholder="Titulo" />
            <Input placeholder="Subtitulo" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Slug amigavel" />
            <Input placeholder="Meta title" />
            <Input placeholder="Meta description" />
            <Input placeholder="Tags separadas por virgula" />
            <Input placeholder="Video YouTube" />
            <div className="lg:col-span-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Campo de conteudo rico preparado para texto, links, tabelas, listas, galeria e imagem de capa.
            </div>
            <div className="lg:col-span-2 flex flex-wrap gap-3">
              <Button>Salvar rascunho</Button>
              <Button variant="outline">Agendar</Button>
              <Button variant="outline">Publicar</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 rounded-lg border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SEO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.slug}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>{post.metaTitle}</TableCell>
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
