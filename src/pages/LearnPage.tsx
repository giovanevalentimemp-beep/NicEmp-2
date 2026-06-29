import { Search } from "lucide-react";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categories, posts } from "@/data/cms";

export default function LearnPage() {
  const publishedPosts = posts.filter((post) => post.status === "Publicado");

  return (
    <AppLayout>
      <PageContainer className="pb-20">
        <PageHeader
          eyebrow="Aprenda"
          title="Conteudos para empreendedores"
          description="Artigos, categorias, busca, SEO e estrutura pronta para comentarios futuros."
        />

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="h-12 pl-11" placeholder="Pesquisar artigos, tags ou categorias..." type="search" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="rounded-md px-3 py-2">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <Card key={post.slug} className="rounded-lg border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <Badge className="mb-4 rounded-md">{post.category}</Badge>
                <h2 className="text-xl font-bold text-slate-950">{post.title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">{post.subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                  <span>{post.readingTime}</span>
                  <Button asChild variant="link" className="px-0">
                    <a href={`/aprenda/${post.slug}`}>Ler artigo</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-950">Comentarios</h2>
          <p className="mt-2 text-sm text-slate-500">
            Estrutura preparada para comentarios moderados vinculados a posts e usuarios autenticados.
          </p>
        </section>
      </PageContainer>
    </AppLayout>
  );
}
