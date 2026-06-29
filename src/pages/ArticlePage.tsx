import { useRoute } from "wouter";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { posts } from "@/data/cms";
import { NotFound } from "@/pages/not-found";

export function ArticlePage() {
  const [, params] = useRoute("/aprenda/:slug");
  const post = posts.find((item) => item.slug === params?.slug && item.status === "Publicado");

  if (!post) return <NotFound />;

  const related = posts.filter((item) => item.category === post.category && item.slug !== post.slug).slice(0, 3);

  return (
    <AppLayout>
      <PageContainer className="max-w-4xl pb-20">
        <PageHeader eyebrow={post.category} title={post.title} description={post.subtitle} />
        <article className="prose prose-slate max-w-none rounded-lg border border-slate-200 bg-white p-8">
          <p>{post.excerpt}</p>
          <h2>Resumo executivo</h2>
          <p>
            Este artigo usa a estrutura de CMS da NICEMP: slug amigavel, meta title, meta description, tags,
            categoria, status editorial e area preparada para conteudo rico.
          </p>
          <ul>
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </article>
        <Card className="mt-8 rounded-lg border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-950">Artigos relacionados</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {related.length ? (
                related.map((item) => <Badge key={item.slug}>{item.title}</Badge>)
              ) : (
                <span className="text-sm text-slate-500">Nenhum relacionado publicado.</span>
              )}
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
