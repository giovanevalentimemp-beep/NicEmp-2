import { motion } from "framer-motion";
import { Play, TrendingUp, Users, Wrench } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";
import { routes } from "@/constants/routes";

const stats = [
  { icon: <TrendingUp size={20} color="#16A34A" />, bg: "#DCFCE7", value: "120.000+", label: "Cálculos realizados" },
  { icon: <Users size={20} color="#2563EB" />, bg: "#DBEAFE", value: "25.000+", label: "Negócios usando" },
  { icon: <Wrench size={20} color="#D97706" />, bg: "#FEF3C7", value: "50+", label: "Ferramentas gratuitas" },
];

export function HeroSection() {
  return (
    <section className="pt-28 pb-20" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(2.4rem, 4vw, 3.2rem)", color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.15 }}
              data-testid="hero-headline"
            >
              Ferramentas para quem{" "}
              <span style={{ color: "#16A34A" }}>constrói</span>{" "}
              seu futuro.
            </h1>
            <p className="text-base mb-8 leading-relaxed" style={{ color: "#6B7280", maxWidth: 440 }}>
              Tudo que você precisa para calcular, gerenciar e fazer seu negócio crescer. 100% online e gratuito para começar.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href={routes.signUp}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: "#16A34A", color: "white" }}
                data-testid="btn-comecar-agora"
              >
                Começar agora — é grátis
              </a>
              <a
                href={routes.academy}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-colors hover:bg-gray-50"
                style={{ color: "#111827", borderColor: "#E5E7EB" }}
                data-testid="btn-ver-como-funciona"
              >
                <Play size={15} fill="#111827" />
                Ver como funciona
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3" data-testid={`stat-${s.label}`}>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: s.bg }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-bold text-base" style={{ color: "#111827", lineHeight: 1.2 }}>{s.value}</div>
                    <div className="text-xs" style={{ color: "#6B7280" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:block"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
