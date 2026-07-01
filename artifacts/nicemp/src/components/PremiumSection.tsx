import { BarChart2, LayoutDashboard, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";

const premiumCards = [
  {
    icon: <BarChart2 size={24} color="#16A34A" />,
    iconBg: "#DCFCE7",
    title: "DRE Completo",
    desc: "Tenha controle total das finanças do seu negócio com relatórios detalhados.",
    price: "R$ 19,90",
  },
  {
    icon: <LayoutDashboard size={24} color="#2563EB" />,
    iconBg: "#DBEAFE",
    title: "Dashboard Avançado",
    desc: "Visualize indicadores, metas e resultados em tempo real.",
    price: "R$ 19,90",
  },
  {
    icon: <Building2 size={24} color="#7C3AED" />,
    iconBg: "#EDE9FE",
    title: "Multiempresas",
    desc: "Gerencie várias empresas em uma única conta de forma prática.",
    price: "R$ 29,90",
  },
  {
    icon: <Users size={24} color="#D97706" />,
    iconBg: "#FEF3C7",
    title: "Planos para Contadores",
    desc: "Solução completa para escritórios contábeis e consultores.",
    price: "R$ 49,90",
  },
];

export function PremiumSection() {
  return (
    <section className="py-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <h2
          className="font-semibold text-2xl mb-8"
          style={{ color: "#111827" }}
          data-testid="premium-title"
        >
          Recursos Premium
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {premiumCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 flex flex-col"
              style={{
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              data-testid={`premium-card-${card.title}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: card.iconBg }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
                    {card.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#6B7280" }}>
                {card.desc}
              </p>
              <div
                className="pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid #F3F4F6" }}
              >
                <div>
                  <span className="text-xs" style={{ color: "#6B7280" }}>A partir de </span>
                  <span className="font-bold text-sm" style={{ color: "#111827" }}>{card.price}</span>
                  <span className="text-xs" style={{ color: "#6B7280" }}>/mês</span>
                </div>
                <a
                  href="#"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                  style={{ color: "#111827", borderColor: "#E5E7EB" }}
                  data-testid={`btn-ver-planos-${card.title}`}
                >
                  Ver planos
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
