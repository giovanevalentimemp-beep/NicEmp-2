import { Rocket, TrendingUp, Target, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: <Rocket size={28} color="#16A34A" />,
    iconBg: "#DCFCE7",
    title: "Iniciando",
    sub: "Dê os primeiros passos com segurança",
    items: ["Abrir empresa", "MEI x Simples", "Capital de giro", "Precificação"],
    linkColor: "#16A34A",
  },
  {
    icon: <TrendingUp size={28} color="#2563EB" />,
    iconBg: "#DBEAFE",
    title: "Vendendo",
    sub: "Aumente suas vendas e margem",
    items: ["Markup e Margem de Lucro", "ROI", "Cálculo de Impostos", "Simulador de Importação"],
    linkColor: "#2563EB",
  },
  {
    icon: <Target size={28} color="#7C3AED" />,
    iconBg: "#EDE9FE",
    title: "Crescendo",
    sub: "Gestão completa para escalar",
    items: ["DRE Completo", "Fluxo de Caixa", "Indicadores", "Dashboard"],
    linkColor: "#7C3AED",
  },
];

export function SolutionsSection() {
  return (
    <section className="py-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <h2
          className="font-semibold text-2xl text-center mb-10"
          style={{ color: "#111827" }}
          data-testid="solutions-title"
        >
          Soluções para cada momento do seu negócio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                background: "white",
              }}
              data-testid={`solution-card-${s.title}`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: s.iconBg }}
              >
                {s.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1" style={{ color: "#111827" }}>
                {s.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{s.sub}</p>
              <ul className="space-y-2 flex-1 mb-5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#374151" }}>
                    <span style={{ color: s.linkColor }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="flex items-center gap-1 text-sm font-medium mt-auto transition-opacity hover:opacity-80"
                style={{ color: s.linkColor }}
              >
                Ver ferramentas <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
