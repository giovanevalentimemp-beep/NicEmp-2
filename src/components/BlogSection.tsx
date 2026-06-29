import { ArrowRight, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const smallArticles = [
  {
    title: "MEI ou Simples Nacional: qual o melhor para o seu negócio?",
    date: "10 Mai 2026",
    reading: "8 min de leitura",
    imgColor: "#DBEAFE",
  },
  {
    title: "Como precificar seus produtos e aumentar seu lucro",
    date: "08 Mai 2026",
    reading: "5 min de leitura",
    imgColor: "#DCFCE7",
  },
  {
    title: "Importação da China: guia completo para iniciantes",
    date: "05 Mai 2026",
    reading: "9 min de leitura",
    imgColor: "#EDE9FE",
  },
];

export function BlogSection() {
  return (
    <section className="py-20" style={{ background: "#FAFAFA" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-semibold text-2xl" style={{ color: "#111827" }}>
            Aprenda e evolua sempre
          </h2>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#16A34A" }}
            data-testid="link-ir-blog"
          >
            Ir para o blog <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Big image card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <div
              className="w-full flex items-center justify-center"
              style={{ height: 200, background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)" }}
            >
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <ellipse cx="40" cy="55" rx="18" ry="6" fill="rgba(255,255,255,0.15)" />
                <path d="M40 10 L46 30 L64 30 L50 43 L56 62 L40 50 L24 62 L30 43 L16 30 L34 30 Z" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="40" cy="20" r="10" fill="white" opacity="0.9" />
                <rect x="35" y="28" width="10" height="22" rx="3" fill="white" opacity="0.8" />
                <path d="M28 40 Q32 55 40 60 Q48 55 52 40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                <ellipse cx="40" cy="60" rx="8" ry="4" fill="rgba(255,200,100,0.6)" />
              </svg>
            </div>
          </motion.div>

          {/* Middle: Featured article */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 flex flex-col"
            style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            data-testid="featured-article"
          >
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-4 self-start"
              style={{ background: "#FEF3C7", color: "#D97706", letterSpacing: "0.06em" }}
            >
              DESTAQUE
            </span>
            <h3 className="font-semibold text-lg mb-3 leading-snug" style={{ color: "#111827" }}>
              Como abrir um negócio em 2026: passo a passo completo
            </h3>
            <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "#6B7280" }}>
              Guia completo para você tirar sua ideia do papel e abrir seu negócio de forma legal e estratégica.
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "#9CA3AF" }}>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                12 Mai 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                8 min de leitura
              </span>
            </div>
          </motion.div>

          {/* Right: Small articles */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {smallArticles.map((article) => (
              <a
                key={article.title}
                href="#"
                className="bg-white rounded-xl p-4 flex gap-3 transition-shadow hover:shadow-md"
                style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                data-testid={`article-${article.title.slice(0, 20)}`}
              >
                <div
                  className="w-16 h-14 rounded-lg flex-shrink-0"
                  style={{ background: article.imgColor }}
                />
                <div>
                  <p className="text-sm font-medium leading-snug mb-1.5" style={{ color: "#111827" }}>
                    {article.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "#9CA3AF" }}>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {article.reading}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
