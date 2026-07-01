import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { loadPosts, getPostBySlug, type Post } from "@/lib/cms-storage";
import { apiFetchPosts, apiRecordView } from "@/lib/cms-api";
import { renderMarkdown } from "@/lib/markdown";
import { Calendar, Clock, ArrowLeft, Eye } from "lucide-react";

export function ArticlePage() {
  const [, params] = useRoute("/aprenda/:slug");
  const slug = params?.slug ?? "";
  const isPreview = new URLSearchParams(window.location.search).has("preview");

  const [post, setPost] = useState<Post | undefined>(() => {
    const p = getPostBySlug(slug);
    return isPreview ? p : (p?.status === "Publicado" ? p : undefined);
  });
  const [related, setRelated] = useState<Post[]>(() => {
    const all = loadPosts();
    const p = getPostBySlug(slug);
    return p
      ? all.filter((x) => x.status === "Publicado" && x.category === p.category && x.id !== p.id).slice(0, 3)
      : [];
  });

  useEffect(() => {
    apiFetchPosts()
      .then((posts) => {
        const found = posts.find((p) => p.slug === slug);
        const resolved = isPreview ? found : (found?.status === "Publicado" ? found : undefined);
        setPost(resolved);
        if (resolved) {
          setRelated(
            posts.filter((p) => p.status === "Publicado" && p.category === resolved.category && p.id !== resolved.id).slice(0, 3)
          );
          // Track view once per session (skip for preview)
          if (!isPreview) {
            const sessionKey = `nicemp_viewed_${resolved.id}`;
            if (!sessionStorage.getItem(sessionKey)) {
              sessionStorage.setItem(sessionKey, "1");
              apiRecordView(resolved.id).catch(() => {});
            }
          }
        }
      })
      .catch(() => {});
  }, [slug, isPreview]);

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ paddingTop: 92, background: "#FAFAFA" }}>
          <div className="text-center">
            <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Artigo não encontrado</h1>
            <p className="text-slate-500 mb-6">Este artigo não existe ou ainda não foi publicado.</p>
            <Link href="/aprenda" className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:underline">
              <ArrowLeft size={16} /> Ver todos os artigos
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const htmlContent = renderMarkdown(post.content);

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ paddingTop: 92, background: "#FAFAFA" }}>
        {isPreview && (
          <div className="sticky top-[72px] z-40 bg-amber-50 border-b border-amber-200 px-6 py-2 text-center text-sm font-medium text-amber-700 flex items-center justify-center gap-2">
            <Eye size={14} /> Modo pré-visualização — este artigo ainda não está publicado
          </div>
        )}

        <div className="mx-auto" style={{ maxWidth: 760, padding: "48px 32px 80px" }}>
          <Link href="/aprenda" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
            <ArrowLeft size={15} /> Voltar ao blog
          </Link>

          {post.coverImage && (
            <div className="mb-8 rounded-2xl overflow-hidden" style={{ maxHeight: 420 }}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

          <Badge className="mb-4 rounded-md">{post.category}</Badge>
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#111827", letterSpacing: "-0.03em" }}>
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-xl text-slate-500 mb-6 leading-relaxed">{post.subtitle}</p>
          )}

          <div className="flex items-center gap-5 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-200">
            {(post.publishedAt || post.updatedAt) && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.publishedAt || post.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "long", year: "numeric"
                })}
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {post.readingTime}
              </span>
            )}
            {post.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {htmlContent ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{ color: "#374151", lineHeight: 1.8, fontSize: "1.0625rem" }}
            />
          ) : (
            <p className="text-slate-400 italic">Conteúdo em breve.</p>
          )}

          {post.videoYoutube && (
            <div className="mt-10">
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYoutubeId(post.videoYoutube)}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={post.title}
                />
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-950 mb-5">Artigos relacionados</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/aprenda/${item.slug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow block"
                  >
                    <Badge className="mb-2 rounded-md text-xs">{item.category}</Badge>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</p>
                    {item.excerpt && <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{item.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : url;
}
