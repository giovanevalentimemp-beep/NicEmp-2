import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loadPosts, loadCategories, type Post } from "@/lib/cms-storage";
import { apiFetchPosts, apiFetchCategories } from "@/lib/cms-api";

export function LearnPage() {
  const [allPosts, setAllPosts] = useState<Post[]>(() => loadPosts());
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    apiFetchPosts().then(setAllPosts).catch(() => {});
    apiFetchCategories().then(setCategories).catch(() => {});
  }, []);

  const publishedPosts = allPosts.filter((p) => p.status === "Publicado");

  const filtered = publishedPosts.filter((post) => {
    const matchCat = !activeCategory || post.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q)) ||
      post.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <AppLayout>
      <PageContainer className="pb-20">
        <PageHeader
          eyebrow="Aprenda"
          title="Conteúdos para empreendedores"
          description="Artigos, guias e análises para quem quer crescer com inteligência financeira."
        />

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-12 pl-11"
              placeholder="Pesquisar artigos, tags ou categorias..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors border ${
                activeCategory === null
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors border ${
                  activeCategory === category
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <p className="text-slate-400 text-sm">
              {publishedPosts.length === 0
                ? "Nenhum artigo publicado ainda."
                : "Nenhum artigo encontrado com esses filtros."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setActiveCategory(null); }}
                className="mt-2 text-sm text-green-600 font-medium hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link key={post.id} href={`/aprenda/${post.slug}`}>
                <Card className="rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                  {post.coverImage && (
                    <div className="h-44 overflow-hidden rounded-t-xl">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <Badge className="mb-4 rounded-md">{post.category}</Badge>
                    <h2 className="text-xl font-bold text-slate-950 leading-snug">{post.title}</h2>
                    {post.subtitle && (
                      <p className="mt-2 text-sm font-medium text-slate-500">{post.subtitle}</p>
                    )}
                    {post.excerpt && (
                      <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                      <span>{post.readingTime}</span>
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        Ler artigo →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </AppLayout>
  );
}
