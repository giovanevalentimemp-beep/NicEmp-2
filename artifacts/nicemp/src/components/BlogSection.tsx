import { ArrowRight, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { loadPosts } from "@/lib/cms-storage";

export function BlogSection() {
  const allPosts = loadPosts();
  const published = allPosts.filter((p) => p.status === "Publicado");
  const featured = published[0];
  const recent = published.slice(1, 4);

  const PLACEHOLDER_COLORS = ["#DBEAFE", "#DCFCE7", "#EDE9FE"];

  return (
    <section className="py-20" style={{ background: "#FAFAFA" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-semibold text-2xl" style={{ color: "#111827" }}>
            Aprenda e evolua sempre
          </h2>
          <a
            href="/aprenda"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#16A34A" }}
            data-testid="link-ir-blog"
          >
            Ir para o blog <ArrowRight size={14} />
          </a>
        </div>

        {published.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
            Nenhum artigo publicado ainda.{" "}
            <a href="/admin" className="text-green-600 font-medium hover:underline">Criar artigo no admin</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover / placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {featured?.coverImage ? (
                <img src={featured.coverImage} alt={featured.title} className="w-full object-cover" style={{ height: 200 }} />
              ) : (
                <div
                  className="w-full flex items-center justify-center"
                  style={{ height: 200, background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)" }}
                >
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M40 10 L46 30 L64 30 L50 43 L56 62 L40 50 L24 62 L30 43 L16 30 L34 30 Z" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="40" cy="20" r="10" fill="white" opacity="0.9" />
                    <rect x="35" y="28" width="10" height="22" rx="3" fill="white" opacity="0.8" />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Featured article */}
            {featured && (
              <motion.a
                href={`/aprenda/${featured.slug}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow"
                style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                data-testid="featured-article"
              >
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-4 self-start"
                  style={{ background: "#FEF3C7", color: "#D97706", letterSpacing: "0.06em" }}
                >
                  DESTAQUE
                </span>
                <h3 className="font-semibold text-lg mb-3 leading-snug flex-1" style={{ color: "#111827" }}>
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs" style={{ color: "#9CA3AF" }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(featured.publishedAt || featured.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  {featured.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featured.readingTime}
                    </span>
                  )}
                </div>
              </motion.a>
            )}

            {/* Recent small articles */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col gap-3"
            >
              {recent.length > 0 ? recent.map((post, idx) => (
                <a
                  key={post.id}
                  href={`/aprenda/${post.slug}`}
                  className="bg-white rounded-xl p-4 flex gap-3 transition-shadow hover:shadow-md"
                  style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-16 h-14 rounded-lg flex-shrink-0 overflow-hidden"
                    style={{ background: post.coverImage ? undefined : PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length] }}
                  >
                    {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug mb-1.5 line-clamp-2" style={{ color: "#111827" }}>
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "#9CA3AF" }}>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(post.publishedAt || post.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                      {post.readingTime && (
                        <span className="flex items-center gap-1"><Clock size={10} />{post.readingTime}</span>
                      )}
                    </div>
                  </div>
                </a>
              )) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400 text-center">
                  Publique mais artigos para vê-los aqui.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
