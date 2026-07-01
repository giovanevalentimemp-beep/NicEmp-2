import { useRoute, Link } from "wouter";
import { AppLayout, PageContainer } from "@/components/ds/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { loadPosts, getPostBySlug } from "@/lib/cms-storage";
import { renderMarkdown } from "@/lib/markdown";
import { Calendar, Clock, ArrowLeft, Eye } from "lucide-react";

export function ArticlePage() {
  const [, params] = useRoute("/aprenda/:slug");
  const slug = params?.slug ?? "";

  const isPreview = new URLSearchParams(window.location.search).has("preview");

  const post = isPreview
    ? getPostBySlug(slug)
    : getPostBySlug(slug) && getPostBySlug(slug)!.status === "Publicado"
      ? getPostBySlug(slug)
      : undefined;

  const allPosts = loadPosts();
  const related = post
    ? allPosts.filter((p) => p.status === "Publicado" && p.category === post.category && p.id !== post.id).slice(0, 3)
    : [];

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
          {/* Back */}
          <Link href="/aprenda" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
            <ArrowLeft size={15} /> Voltar ao blog
          </Link>

          {/* Cover */}
          {post.coverImage && (
            <div className="mb-8 rounded-2xl overflow-hidden" style={{ maxHeight: 360 }}>
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Header */}
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

          {/* Content */}
          {htmlContent ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                color: "#374151",
                lineHeight: 1.8,
                fontSize: "1.0625rem",
              }}
            />
          ) : (
            <p className="text-slate-400 italic">Conteúdo em breve.</p>
          )}

          {/* Video */}
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

          {/* Related */}
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
