import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Tag, BarChart2, DollarSign, FileText, Building2,
  ChevronDown, Calculator, ArrowRight, RotateCcw, ChevronRight, Percent, Coins, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MAIN_DOMAIN, TOOLS_DOMAIN, buildUrl } from "@/constants/domains";
import { formatBRL, maskCurrency, parseCurrency } from "@/utils/format";

// ── Helpers ──────────────────────────────────────────────────────────────────

// ── Badge ─────────────────────────────────────────────────────────────────────

function RoiBadge({ roi }: { roi: number | null }) {
  if (roi === null) return null;
  let label = "", bg = "", color = "";
  if (roi >= 50)       { label = "Excelente"; bg = "#DCFCE7"; color = "#16A34A"; }
  else if (roi >= 20)  { label = "Bom";       bg = "#DBEAFE"; color = "#2563EB"; }
  else if (roi > 0)    { label = "Baixo";     bg = "#FEF3C7"; color = "#D97706"; }
  else                 { label = "Prejuízo";  bg = "#FEE2E2"; color = "#DC2626"; }
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

// ── FAQ Accordion (single-open) ───────────────────────────────────────────────

const faqs = [
  {
    q: "O que é ROI?",
    a: "ROI (Return on Investment) é uma métrica financeira que mede o retorno obtido em relação ao investimento feito. Ele indica se um investimento foi lucrativo ou não.",
  },
  {
    q: "O que é um bom ROI?",
    a: "Um ROI acima de 20% geralmente é considerado bom. ROI acima de 50% é excelente. Porém, o valor ideal varia de acordo com o setor, prazo e risco do investimento.",
  },
  {
    q: "O ROI pode ser negativo?",
    a: "Sim. Um ROI negativo indica prejuízo — o retorno obtido foi menor do que o investimento inicial. Isso é um sinal de alerta para revisar a estratégia.",
  },
  {
    q: "Por que calcular o ROI?",
    a: "Calcular o ROI permite comparar diferentes investimentos, justificar decisões financeiras, identificar o que está gerando resultados e eliminar o que está dando prejuízo.",
  },
];

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: 720 }}>
      {faqs.map((faq, i) => (
        <div
          key={faq.q}
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{ border: "1px solid #E5E7EB" }}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
          data-testid={`faq-item-${i}`}
        >
          <div
            className="flex items-center justify-between px-6 py-4 bg-white"
            style={{ userSelect: "none" }}
          >
            <span className="font-medium text-sm" style={{ color: "#111827" }}>{faq.q}</span>
            <ChevronDown
              size={16}
              style={{
                color: "#6B7280",
                transition: "transform 0.2s",
                transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink: 0,
              }}
            />
          </div>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="px-6 pb-4 text-sm leading-relaxed"
                  style={{ color: "#6B7280", background: "#FAFAFA", borderTop: "1px solid #F3F4F6" }}
                >
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Related tools map ─────────────────────────────────────────────────────────

const relatedTools = [
  { label: "Markup",          route: "/markup",          icon: <Tag size={18} color="#2563EB" />,  bg: "#DBEAFE" },
  { label: "Margem de Lucro", route: "/margem-de-lucro", icon: <Percent size={18} color="#16A34A" />, bg: "#DCFCE7" },
  { label: "Capital de Giro", route: "/capital-de-giro", icon: <DollarSign size={18} color="#D97706" />, bg: "#FEF3C7" },
  { label: "DRE",             route: "/dre",             icon: <FileText size={18} color="#7C3AED" />, bg: "#EDE9FE" },
  { label: "Impostos",        route: "/impostos",        icon: <Building2 size={18} color="#0891B2" />, bg: "#CFFAFE" },
];

// ── ROI calculation logic (pure) ──────────────────────────────────────────────

function calcROI(investStr: string, retornoStr: string) {
  const invest = parseCurrency(investStr);
  const retorno = parseCurrency(retornoStr);
  const errs: { invest?: string; retorno?: string } = {};
  if (!investStr || invest <= 0) errs.invest = "Informe um valor de investimento válido (maior que zero).";
  if (!retornoStr || retorno < 0) errs.retorno = "Informe um retorno válido (não negativo).";
  if (Object.keys(errs).length) return { errs, result: null };
  return {
    errs: {},
    result: {
      roi: ((retorno - invest) / invest) * 100,
      lucro: retorno - invest,
      invest,
      retorno,
    },
  };
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ROICalculator() {
  const [investInput, setInvestInput]   = useState("");
  const [returnInput, setReturnInput]   = useState("");
  const [result, setResult]             = useState<{ roi: number; lucro: number; invest: number; retorno: number } | null>(null);
  const [errors, setErrors]             = useState<{ invest?: string; retorno?: string }>({});
  // Track whether "Calcular ROI" was ever clicked (so we only show errors after explicit attempt)
  const hasAttempted = useRef(false);

  // Re-run calculation in real time whenever either field changes (if user already attempted once)
  useEffect(() => {
    if (!investInput && !returnInput) return;
    const { errs, result: r } = calcROI(investInput, returnInput);
    if (hasAttempted.current) setErrors(errs);
    if (r) {
      setErrors({});
      setResult(r);
    } else if (hasAttempted.current) {
      setResult(null);
    }
  }, [investInput, returnInput]);

  function handleCalculate() {
    hasAttempted.current = true;
    const { errs, result: r } = calcROI(investInput, returnInput);
    setErrors(errs);
    setResult(r);
  }

  function handleClear() {
    hasAttempted.current = false;
    setInvestInput("");
    setReturnInput("");
    setResult(null);
    setErrors({});
  }

  function applyExample(invest: number, retorno: number) {
    const investStr  = formatBRL(invest);
    const retornoStr = formatBRL(retorno);
    hasAttempted.current = true;
    setInvestInput(investStr);
    setReturnInput(retornoStr);
    // Force immediate calculation — state updates are batched so we call calcROI directly
    const { errs, result: r } = calcROI(investStr, retornoStr);
    setErrors(errs);
    setResult(r);
  }

  const roi      = result?.roi ?? null;
  const roiColor = roi === null ? "#6B7280" : roi > 0 ? "#16A34A" : roi < 0 ? "#DC2626" : "#6B7280";

  const pieData = result
    ? [
        { name: "Investimento", value: result.invest,           color: "#0F172A" },
        { name: "Lucro",        value: Math.max(result.lucro, 0), color: "#16A34A" },
      ].filter((d) => d.value > 0)
    : [{ name: "Aguardando", value: 1, color: "#E5E7EB" }];

  return (
    <>
      <MetaTags />
      <Header />

      <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
        <div className="mx-auto" style={{ maxWidth: 1280, padding: "96px 32px 80px" }}>

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color: "#6B7280" }}>
            <a
              href={MAIN_DOMAIN}
              className="hover:underline"
              style={{ color: "#16A34A" }}
              data-testid="breadcrumb-inicio"
            >
              Início
            </a>
            <ChevronRight size={12} />
            <a
              href="/"
              className="hover:underline"
              style={{ color: "#6B7280" }}
              data-testid="breadcrumb-ferramentas"
            >
              Ferramentas
            </a>
            <ChevronRight size={12} />
            <span>Financeiro</span>
            <ChevronRight size={12} />
            <span style={{ color: "#111827", fontWeight: 500 }}>Calculadora ROI</span>
          </nav>

          {/* ── Hero ── */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#DCFCE7" }}>
                <TrendingUp size={20} color="#16A34A" />
              </div>
              <h1 className="font-bold text-3xl" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                Calculadora de ROI Online
              </h1>
            </div>
            <p className="text-base" style={{ color: "#6B7280", maxWidth: 580 }}>
              Calcule o retorno sobre investimento de forma simples e descubra se um investimento realmente vale a pena.
            </p>
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">

            {/* Calculator card */}
            <div
              className="lg:col-span-2 bg-white rounded-2xl p-7 flex flex-col"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              data-testid="calculator-card"
            >
              <h2 className="font-semibold text-lg mb-6" style={{ color: "#111827" }}>Calcule agora</h2>

              {/* Investment */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                  Investimento Inicial (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#9CA3AF" }}>R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    value={investInput}
                    onChange={(e) => setInvestInput(maskCurrency(e.target.value))}
                    className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border outline-none focus:ring-2 transition-shadow"
                    style={{ borderColor: errors.invest ? "#DC2626" : "#E5E7EB", color: "#111827", "--tw-ring-color": "#16A34A40" } as React.CSSProperties}
                    data-testid="input-investimento"
                  />
                </div>
                {errors.invest && <p className="text-xs mt-1" style={{ color: "#DC2626" }}>{errors.invest}</p>}
              </div>

              {/* Return */}
              <div className="mb-7">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                  Retorno Obtido (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#9CA3AF" }}>R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    value={returnInput}
                    onChange={(e) => setReturnInput(maskCurrency(e.target.value))}
                    className="w-full rounded-xl pl-9 pr-4 py-3 text-sm border outline-none focus:ring-2 transition-shadow"
                    style={{ borderColor: errors.retorno ? "#DC2626" : "#E5E7EB", color: "#111827", "--tw-ring-color": "#16A34A40" } as React.CSSProperties}
                    data-testid="input-retorno"
                  />
                </div>
                {errors.retorno && <p className="text-xs mt-1" style={{ color: "#DC2626" }}>{errors.retorno}</p>}
              </div>

              {/* Formula */}
              <div
                className="rounded-xl px-4 py-3 mb-7 text-xs leading-relaxed"
                style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#6B7280" }}
              >
                <span className="font-semibold" style={{ color: "#111827" }}>Fórmula: </span>
                ROI (%) = ((Retorno − Investimento) ÷ Investimento) × 100
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleCalculate}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#16A34A", color: "white" }}
                  data-testid="btn-calcular"
                >
                  <Calculator size={15} />
                  Calcular ROI
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm border transition-colors hover:bg-gray-50"
                  style={{ color: "#6B7280", borderColor: "#E5E7EB" }}
                  data-testid="btn-limpar"
                >
                  <RotateCcw size={14} />
                  Limpar
                </button>
              </div>
            </div>

            {/* Results card */}
            <div
              className="lg:col-span-3 bg-white rounded-2xl p-7 flex flex-col"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              data-testid="results-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg" style={{ color: "#111827" }}>Resultado</h2>
                {result && <RoiBadge roi={result.roi} />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                {/* Metrics */}
                <div className="flex flex-col gap-4">
                  {/* ROI big number */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: roi !== null && roi >= 0 ? "#DCFCE7" : roi !== null ? "#FEE2E2" : "#F8FAFC",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>ROI</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={roi?.toFixed(2) ?? "empty"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-end gap-2"
                      >
                        <span className="font-bold" style={{ fontSize: 40, color: roiColor, lineHeight: 1 }}>
                          {roi !== null
                            ? `${roi >= 0 ? "+" : ""}${roi.toFixed(2).replace(".", ",")}`
                            : "—"}
                        </span>
                        {roi !== null && (
                          <span className="font-semibold text-lg mb-1" style={{ color: roiColor }}>%</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center gap-1 mt-1">
                      {roi !== null && roi > 0  && <TrendingUp   size={13} color="#16A34A" />}
                      {roi !== null && roi < 0  && <TrendingDown size={13} color="#DC2626" />}
                      {roi !== null && roi === 0 && <Minus        size={13} color="#6B7280" />}
                      <span className="text-xs" style={{ color: roiColor }}>
                        {roi !== null
                          ? roi > 0 ? "Retorno positivo" : roi < 0 ? "Retorno negativo" : "Neutro"
                          : "Aguardando cálculo"}
                      </span>
                    </div>
                  </div>

                  {/* Detail rows */}
                  {[
                    {
                      label: "Lucro Líquido",
                      value: result ? `R$ ${formatBRL(result.lucro)}` : "—",
                      accent: result && result.lucro >= 0 ? "#16A34A" : "#DC2626",
                    },
                    {
                      label: "Investimento Inicial",
                      value: result ? `R$ ${formatBRL(result.invest)}` : "—",
                      accent: "#0F172A",
                    },
                    {
                      label: "Retorno Obtido",
                      value: result ? `R$ ${formatBRL(result.retorno)}` : "—",
                      accent: "#2563EB",
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ border: "1px solid #F3F4F6", background: "#FAFAFA" }}
                    >
                      <span className="text-sm" style={{ color: "#6B7280" }}>{m.label}</span>
                      <span className="font-semibold text-sm" style={{ color: m.accent }}>{m.value}</span>
                    </div>
                  ))}

                  {/* Retorno por R$1 investido */}
                  {(() => {
                    const retornoPorReal = result ? result.retorno / result.invest : null;
                    const isPositive     = retornoPorReal !== null && retornoPorReal > 1;
                    return (
                      <div
                        className="rounded-xl px-4 py-3"
                        style={{
                          border: `1px solid ${isPositive ? "#BBF7D0" : "#F3F4F6"}`,
                          background: isPositive ? "#F0FDF4" : "#FAFAFA",
                        }}
                        data-testid="card-retorno-por-real"
                      >
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Coins size={14} color={isPositive ? "#16A34A" : "#9CA3AF"} />
                            <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
                              Retorno por R$1 investido
                            </span>
                            {/* Tooltip */}
                            <div className="relative group">
                              <Info size={12} color="#9CA3AF" className="cursor-help" />
                              <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 text-xs rounded-xl px-3 py-2 leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                style={{
                                  background: "#111827",
                                  color: "white",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                  whiteSpace: "normal",
                                }}
                              >
                                Quanto a empresa recebeu em retorno para cada R$1 investido.
                                <div
                                  className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                                  style={{ borderTopColor: "#111827" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Value */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={retornoPorReal?.toFixed(4) ?? "empty"}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                          >
                            {retornoPorReal !== null ? (
                              <>
                                <span
                                  className="font-bold"
                                  style={{ fontSize: 22, color: isPositive ? "#16A34A" : "#DC2626", lineHeight: 1.2 }}
                                >
                                  R$ {formatBRL(retornoPorReal)}
                                </span>
                                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>
                                  Para cada{" "}
                                  <span className="font-semibold" style={{ color: "#111827" }}>R$&nbsp;1,00</span>{" "}
                                  investido, o retorno foi de{" "}
                                  <span className="font-semibold" style={{ color: isPositive ? "#16A34A" : "#DC2626" }}>
                                    R$&nbsp;{formatBRL(retornoPorReal)}
                                  </span>.
                                </p>
                              </>
                            ) : (
                              <span className="font-bold text-xl" style={{ color: "#9CA3AF" }}>—</span>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </div>

                {/* Donut chart */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium mb-3 self-start" style={{ color: "#6B7280" }}>
                    Distribuição do Retorno
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        dataKey="value"
                        strokeWidth={0}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [`R$ ${formatBRL(v)}`, ""]}
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 mt-1">
                    {pieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-xs" style={{ color: "#6B7280" }}>{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── What is ROI ── */}
          <section className="mb-12" data-testid="section-what-is-roi">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>O que é ROI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Percent size={20} color="#16A34A" />, bg: "#DCFCE7",
                  title: "O que significa",
                  desc: "ROI (Return on Investment) é uma métrica que mede o percentual de retorno obtido em relação ao capital investido em qualquer tipo de negócio ou projeto.",
                },
                {
                  icon: <Calculator size={20} color="#2563EB" />, bg: "#DBEAFE",
                  title: "Como é calculado",
                  desc: "A fórmula é simples: ROI (%) = ((Retorno − Investimento) ÷ Investimento) × 100. Um ROI de 50% significa que para cada R$1 investido, você obteve R$0,50 de lucro.",
                },
                {
                  icon: <BarChart2 size={20} color="#7C3AED" />, bg: "#EDE9FE",
                  title: "Por que é importante",
                  desc: "O ROI é uma das métricas mais usadas para comparar investimentos, justificar estratégias e identificar o que realmente está gerando valor para o negócio.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-white rounded-2xl p-6"
                  style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: c.bg }}>
                    {c.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "#111827" }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Examples ── */}
          <section className="mb-12" data-testid="section-examples">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Exemplos práticos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: "Marketing", invest: 1000,  retorno: 1500,  roi: 50, icon: <TrendingUp size={18} color="#16A34A" />, bg: "#DCFCE7" },
                { title: "Estoque",   invest: 5000,  retorno: 7500,  roi: 50, icon: <Building2  size={18} color="#2563EB" />, bg: "#DBEAFE" },
                { title: "Máquinas",  invest: 20000, retorno: 26000, roi: 30, icon: <BarChart2   size={18} color="#7C3AED" />, bg: "#EDE9FE" },
              ].map((ex) => (
                <div
                  key={ex.title}
                  className="bg-white rounded-2xl p-5"
                  style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  data-testid={`example-${ex.title}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ex.bg }}>
                      {ex.icon}
                    </div>
                    <span className="font-semibold" style={{ color: "#111827" }}>{ex.title}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Investimento", value: `R$ ${formatBRL(ex.invest)}`  },
                      { label: "Retorno",       value: `R$ ${formatBRL(ex.retorno)}` },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span style={{ color: "#6B7280" }}>{row.label}</span>
                        <span className="font-medium" style={{ color: "#111827" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                    <span className="text-sm font-medium" style={{ color: "#6B7280" }}>ROI</span>
                    <span className="font-bold text-xl" style={{ color: "#16A34A" }}>+{ex.roi}%</span>
                  </div>
                  <button
                    onClick={() => applyExample(ex.invest, ex.retorno)}
                    className="mt-3 w-full text-xs font-medium py-2 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ color: "#6B7280", borderColor: "#E5E7EB" }}
                    data-testid={`btn-usar-exemplo-${ex.title}`}
                  >
                    Usar este exemplo
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-12" data-testid="section-faq">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>
              Perguntas frequentes
            </h2>
            <FaqList />
          </section>

          {/* ── Related tools ── */}
          <section data-testid="section-related-tools">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>
              Ferramentas relacionadas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {relatedTools.map((t) => (
                <Link
                  key={t.label}
                  href={t.route}
                  className="bg-white rounded-2xl p-4 flex flex-col items-start gap-3 transition-shadow hover:shadow-md"
                  style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                  data-testid={`related-tool-${t.label}`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: t.bg }}>
                    {t.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: "#111827" }}>{t.label}</div>
                    <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#16A34A" }}>
                      Usar ferramenta <ArrowRight size={10} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}

// ── SEO ───────────────────────────────────────────────────────────────────────

function MetaTags() {
  useEffect(() => {
    document.title = "Calculadora de ROI Online Grátis | Nicemp";
    const setMeta = (name: string, content: string, prop = false) => {
      const selector = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        prop ? el.setAttribute("property", name) : el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("description", "Calcule o ROI do seu investimento de forma rápida e gratuita. Descubra o retorno sobre investimento e tome melhores decisões financeiras.");
    setMeta("og:title",       "Calculadora de ROI Online Grátis | Nicemp", true);
    setMeta("og:description", "Calcule o ROI do seu investimento de forma rápida e gratuita.", true);
    setMeta("og:url",         buildUrl(TOOLS_DOMAIN, "/roi"), true);
    setMeta("og:type",        "website", true);
    const existing = document.querySelector("#schema-roi");
    if (!existing) {
      const script = document.createElement("script");
      script.id   = "schema-roi";
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de ROI Online",
        url: buildUrl(TOOLS_DOMAIN, "/roi"),
        description: "Calcule o retorno sobre investimento de forma simples.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      });
      document.head.appendChild(script);
    }
    return () => { document.querySelector("#schema-roi")?.remove(); };
  }, []);
  return null;
}
