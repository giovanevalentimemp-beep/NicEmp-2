import { ArrowRight, Users, Shield, DollarSign, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: <Users size={22} color="#2563EB" />,
    iconBg: "#DBEAFE",
    title: "Contabilidade",
    desc: "Nossos parceiros cuidam da contabilidade do seu negócio.",
  },
  {
    icon: <Shield size={22} color="#2563EB" />,
    iconBg: "#DBEAFE",
    title: "Certificado Digital",
    desc: "Emita seu certificado digital com condições especiais.",
  },
  {
    icon: <DollarSign size={22} color="#2563EB" />,
    iconBg: "#DBEAFE",
    title: "Crédito Empresarial",
    desc: "Encontre as melhores opções de crédito para crescer.",
  },
  {
    icon: <MessageCircle size={22} color="#2563EB" />,
    iconBg: "#DBEAFE",
    title: "Consultoria",
    desc: "Receba orientação especializada para crescer com segurança.",
  },
];

export function BusinessSolutionsSection() {
  return (
    <section className="py-20" style={{ background: "#FAFAFA" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <h2
          className="font-semibold text-2xl mb-8"
          style={{ color: "#111827" }}
          data-testid="business-solutions-title"
        >
          Soluções para o seu negócio
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 flex flex-col"
              style={{
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              data-testid={`business-card-${s.title}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: s.iconBg }}
              >
                {s.icon}
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#111827" }}>
                {s.title}
              </h3>
              <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#6B7280" }}>
                {s.desc}
              </p>
              <a
                href="#"
                className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
                style={{ color: "#16A34A" }}
              >
                Conhecer <ArrowRight size={11} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
