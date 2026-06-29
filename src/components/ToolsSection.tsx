import { ArrowRight, TrendingUp, Tag, Building2, ArrowUpDown, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { routes } from "@/constants/routes";

const tools = [
  {
    icon: <TrendingUp size={22} color="#16A34A" />,
    bg: "#DCFCE7",
    title: "ROI",
    desc: "Calcule o retorno sobre investimento do seu negócio.",
    route: routes.roi,
  },
  {
    icon: <Tag size={22} color="#2563EB" />,
    bg: "#DBEAFE",
    title: "Markup",
    desc: "Descubra o preço ideal de venda dos seus produtos.",
    route: routes.markup,
  },
  {
    icon: <Building2 size={22} color="#D97706" />,
    bg: "#FEF3C7",
    title: "Impostos",
    desc: "Simule impostos e tributos de forma simples.",
    route: routes.simplesNacional,
  },
  {
    icon: <ArrowUpDown size={22} color="#7C3AED" />,
    bg: "#EDE9FE",
    title: "MEI x Simples",
    desc: "Descubra o melhor regime tributário para você.",
    route: routes.academy,
  },
  {
    icon: <Globe size={22} color="#0891B2" />,
    bg: "#CFFAFE",
    title: "Importação",
    desc: "Calcule custos e impostos na importação.",
    route: routes.academy,
  },
  {
    icon: <Users size={22} color="#DB2777" />,
    bg: "#FCE7F3",
    title: "RH & DP",
    desc: "Calcule trabalhistas e folha de pagamento.",
    route: routes.manage,
  },
];

export function ToolsSection() {
  return (
    <section className="py-20" style={{ background: "#FAFAFA" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-semibold text-2xl" style={{ color: "#111827" }}>
            Ferramentas mais utilizadas
          </h2>
          <Link
            href="/roi"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#16A34A" }}
            data-testid="link-ver-todas"
          >
            Ver todas as ferramentas <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 flex flex-col"
              style={{
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              data-testid={`tool-card-${tool.title}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                style={{ background: tool.bg }}
              >
                {tool.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1.5" style={{ color: "#111827" }}>
                {tool.title}
              </h3>
              <p className="text-xs leading-relaxed flex-1" style={{ color: "#6B7280" }}>
                {tool.desc}
              </p>
              {tool.route.startsWith("http") ? (
                <a
                  href={tool.route}
                  className="mt-4 flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ color: "#16A34A" }}
                  data-testid={`tool-link-${tool.title}`}
                >
                  Usar ferramenta <ArrowRight size={11} />
                </a>
              ) : (
                <Link
                  href={tool.route}
                  className="mt-4 flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                  style={{ color: "#16A34A" }}
                  data-testid={`tool-link-${tool.title}`}
                >
                  Usar ferramenta <ArrowRight size={11} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
