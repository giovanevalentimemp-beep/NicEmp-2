import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Tag, TrendingUp, BarChart2, DollarSign, FileText, Building2,
  ChevronDown, Calculator, ArrowRight, RotateCcw, ChevronRight,
  Percent, Coins, Info, ShoppingBag, Utensils, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MAIN_DOMAIN, TOOLS_DOMAIN, buildUrl } from "@/constants/domains";
import { formatBRL, maskCurrency, maskPercent, parseCurrency, parsePercent } from "@/utils/format";

// ── Helpers ──────────────────────────────────────────────────────────────────

// ── Markup calculation (pure) ─────────────────────────────────────────────────

interface MarkupResult {
  precoVenda:  number;
  multiplicador: number;
  lucroEsperado: number;
  custo: number;
  despesas: number;
  margem: number;
  custoPorReal: number;
}

function calcMarkup(
  custoStr: string,
  despesasStr: string,
  margemStr: string
): { errs: Record<string, string>; result: MarkupResult | null } {
  const custo    = parseCurrency(custoStr);
  const despesas = parsePercent(despesasStr);
  const margem   = parsePercent(margemStr);
  const errs: Record<string, string> = {};

  if (!custoStr   || custo    <= 0)  errs.custo    = "Informe um custo válido (maior que zero).";
  if (!despesasStr || despesas < 0)  errs.despesas = "Informe um valor de despesas válido.";
  if (!margemStr  || margem   <= 0)  errs.margem   = "Informe uma margem de lucro válida (maior que zero).";
  if ((despesas + margem) >= 100)    errs.margem   = "A soma de despesas e margem não pode atingir ou ultrapassar 100%.";

  if (Object.keys(errs).length) return { errs, result: null };

  const multiplicador  = 100 / (100 - despesas - margem);
  const precoVenda     = custo * multiplicador;
  const lucroEsperado  = precoVenda - custo - (precoVenda * despesas / 100);
  const custoPorReal   = precoVenda / custo;

  return { errs: {}, result: { precoVenda, multiplicador, lucroEsperado, custo, despesas, margem, custoPorReal } };
}

// ── Markup badge ─────────────────────────────────────────────────────────────

function MarkupBadge({ mult }: { mult: number | null }) {
  if (mult === null) return null;
  let label = "", bg = "", color = "";
  if (mult >= 3)       { label = "Excelente"; bg = "#DCFCE7"; color = "#16A34A"; }
  else if (mult >= 2)  { label = "Bom";       bg = "#DBEAFE"; color = "#2563EB"; }
  else if (mult >= 1.5){ label = "Razoável";  bg = "#FEF3C7"; color = "#D97706"; }
  else                 { label = "Baixo";     bg = "#FEE2E2"; color = "#DC2626"; }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

// ── FAQ Accordion (single-open) ───────────────────────────────────────────────

const faqs = [
  {
    q: "O que é Markup?",
    a: "Markup é um índice multiplicador aplicado sobre o custo de um produto para definir o preço de venda. Ele garante que o negócio cubra todas as despesas e ainda gere lucro.",
  },
  {
    q: "O que é um bom Markup?",
    a: "Depende do setor. No varejo, um markup entre 2x e 3x é comum. Em serviços, pode ser maior. O importante é que o preço final cubra custos, despesas e gere a margem desejada.",
  },
  {
    q: "Qual a diferença entre Markup e Margem?",
    a: "A margem é calculada sobre o preço de venda, enquanto o markup é calculado sobre o custo. Um markup de 2x não equivale a uma margem de 50% — a margem real depende das despesas envolvidas.",
  },
  {
    q: "Por que usar o Markup?",
    a: "O markup simplifica a precificação: basta multiplicar o custo pelo índice e você já tem o preço de venda correto, considerando todas as despesas e a margem de lucro desejada.",
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
          <div className="flex items-center justify-between px-6 py-4 bg-white" style={{ userSelect: "none" }}>
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

// ── Related tools ─────────────────────────────────────────────────────────────

const relatedTools = [
  { label: "ROI",             route: "/roi",             icon: <TrendingUp size={18} color="#16A34A" />, bg: "#DCFCE7" },
  { label: "Margem de Lucro", route: "/margem-de-lucro", icon: <Percent    size={18} color="#16A34A" />, bg: "#DCFCE7" },
  { label: "Capital de Giro", route: "/capital-de-giro", icon: <DollarSign size={18} color="#D97706" />, bg: "#FEF3C7" },
  { label: "Impostos",        route: "/impostos",        icon: <Building2  size={18} color="#0891B2" />, bg: "#CFFAFE" },
  { label: "DRE",             route: "/dre",             icon: <FileText   size={18} color="#7C3AED" />, bg: "#EDE9FE" },
];

// ── Examples ──────────────────────────────────────────────────────────────────

const examples = [
  { title: "Loja de Roupas",        custo: 100,  despesas: 20, margem: 30, icon: <ShoppingBag size={18} color="#2563EB" />, bg: "#DBEAFE" },
  { title: "Restaurante",           custo: 50,   despesas: 15, margem: 35, icon: <Utensils   size={18} color="#D97706" />, bg: "#FEF3C7" },
  { title: "Prestador de Serviços", custo: 500,  despesas: 10, margem: 40, icon: <Briefcase  size={18} color="#7C3AED" />, bg: "#EDE9FE" },
];

// ── Tooltip helper ────────────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group">
      <Info size={12} color="#9CA3AF" className="cursor-help" />
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 text-xs rounded-xl px-3 py-2 leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
        style={{ background: "#111827", color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", whiteSpace: "normal" }}
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: "#111827" }} />
      </div>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, prefix, suffix, placeholder, error, testId,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; placeholder: string; error?: string; testId: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#9CA3AF" }}>{prefix}</span>
        )}
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl py-3 text-sm border outline-none focus:ring-2 transition-shadow"
          style={{
            paddingLeft:  prefix ? 36 : 16,
            paddingRight: suffix ? 36 : 16,
            borderColor: error ? "#DC2626" : "#E5E7EB",
            color: "#111827",
            "--tw-ring-color": "#16A34A40",
          } as React.CSSProperties}
          data-testid={testId}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#9CA3AF" }}>{suffix}</span>
        )}
      </div>
      {error && <p className="text-xs mt-1" style={{ color: "#DC2626" }}>{error}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MarkupCalculator() {
  const [custoInput,    setCustoInput]    = useState("");
  const [despesasInput, setDespesasInput] = useState("");
  const [margemInput,   setMargemInput]   = useState("");
  const [result,  setResult]  = useState<MarkupResult | null>(null);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const hasAttempted = useRef(false);

  // Real-time recalculation
  useEffect(() => {
    if (!custoInput && !despesasInput && !margemInput) return;
    const { errs, result: r } = calcMarkup(custoInput, despesasInput, margemInput);
    if (hasAttempted.current) setErrors(errs);
    if (r) { setErrors({}); setResult(r); }
    else if (hasAttempted.current) setResult(null);
  }, [custoInput, despesasInput, margemInput]);

  function handleCalculate() {
    hasAttempted.current = true;
    const { errs, result: r } = calcMarkup(custoInput, despesasInput, margemInput);
    setErrors(errs);
    setResult(r);
  }

  function handleClear() {
    hasAttempted.current = false;
    setCustoInput(""); setDespesasInput(""); setMargemInput("");
    setResult(null);   setErrors({});
  }

  function applyExample(custo: number, despesas: number, margem: number) {
    const cStr = formatBRL(custo);
    const dStr = String(despesas);
    const mStr = String(margem);
    hasAttempted.current = true;
    setCustoInput(cStr); setDespesasInput(dStr); setMargemInput(mStr);
    const { errs, result: r } = calcMarkup(cStr, dStr, mStr);
    setErrors(errs); setResult(r);
  }

  const mult      = result?.multiplicador ?? null;
  const multColor = mult === null ? "#6B7280" : mult >= 2 ? "#16A34A" : mult >= 1.5 ? "#D97706" : "#DC2626";

  const pieData = result
    ? [
        { name: "Custo",     value: result.custo,                              color: "#0F172A" },
        { name: "Despesas",  value: result.precoVenda * result.despesas / 100, color: "#E5E7EB" },
        { name: "Lucro",     value: Math.max(result.lucroEsperado, 0),         color: "#16A34A" },
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
            <a href={MAIN_DOMAIN} className="hover:underline" style={{ color: "#16A34A" }} data-testid="breadcrumb-inicio">
              Início
            </a>
            <ChevronRight size={12} />
            <a href="/" className="hover:underline" style={{ color: "#6B7280" }} data-testid="breadcrumb-ferramentas">
              Ferramentas
            </a>
            <ChevronRight size={12} />
            <span>Financeiro</span>
            <ChevronRight size={12} />
            <span style={{ color: "#111827", fontWeight: 500 }}>Calculadora de Markup</span>
          </nav>

          {/* ── Hero ── */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#DBEAFE" }}>
                <Tag size={20} color="#2563EB" />
              </div>
              <h1 className="font-bold text-3xl" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                Calculadora de Markup Online
              </h1>
            </div>
            <p className="text-base" style={{ color: "#6B7280", maxWidth: 580 }}>
              Descubra o preço ideal de venda dos seus produtos e mantenha sua margem de lucro saudável.
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

              <div className="flex flex-col gap-5 mb-7">
                <Field
                  label="Custo do Produto (R$)"
                  value={custoInput}
                  onChange={(v) => setCustoInput(maskCurrency(v))}
                  prefix="R$"
                  placeholder="0,00"
                  error={errors.custo}
                  testId="input-custo"
                />
                <Field
                  label="Despesas (%)"
                  value={despesasInput}
                  onChange={(v) => setDespesasInput(maskPercent(v))}
                  suffix="%"
                  placeholder="0"
                  error={errors.despesas}
                  testId="input-despesas"
                />
                <Field
                  label="Margem de Lucro Desejada (%)"
                  value={margemInput}
                  onChange={(v) => setMargemInput(maskPercent(v))}
                  suffix="%"
                  placeholder="0"
                  error={errors.margem}
                  testId="input-margem"
                />
              </div>

              {/* Formula */}
              <div
                className="rounded-xl px-4 py-3 mb-7 text-xs leading-relaxed"
                style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#6B7280" }}
              >
                <span className="font-semibold" style={{ color: "#111827" }}>Fórmula: </span>
                Markup = 100 ÷ (100 − Despesas − Margem) &nbsp;|&nbsp; Preço = Custo × Markup
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleCalculate}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#2563EB", color: "white" }}
                  data-testid="btn-calcular"
                >
                  <Calculator size={15} />
                  Calcular Markup
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
                {result && <MarkupBadge mult={result.multiplicador} />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                {/* Left: metrics */}
                <div className="flex flex-col gap-3">

                  {/* Markup big number */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: mult !== null && mult >= 1.5 ? "#DBEAFE" : mult !== null ? "#FEE2E2" : "#F8FAFC",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Markup Multiplicador</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mult?.toFixed(4) ?? "empty"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-end gap-1"
                      >
                        <span className="font-bold" style={{ fontSize: 40, color: multColor, lineHeight: 1 }}>
                          {mult !== null ? mult.toFixed(2).replace(".", ",") : "—"}
                        </span>
                        {mult !== null && (
                          <span className="font-semibold text-lg mb-1" style={{ color: multColor }}>x</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                      {mult !== null
                        ? `Multiplique o custo por ${mult.toFixed(2).replace(".", ",")} para obter o preço ideal.`
                        : "Aguardando cálculo"}
                    </p>
                  </div>

                  {/* Metric rows */}
                  {[
                    { label: "Preço de Venda",   value: result ? `R$ ${formatBRL(result.precoVenda)}`   : "—", accent: "#2563EB" },
                    { label: "Lucro Esperado",    value: result ? `R$ ${formatBRL(result.lucroEsperado)}` : "—", accent: result && result.lucroEsperado >= 0 ? "#16A34A" : "#DC2626" },
                    { label: "Custo do Produto",  value: result ? `R$ ${formatBRL(result.custo)}`       : "—", accent: "#0F172A" },
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

                  {/* Interpretation card: preço por R$1 de custo */}
                  {(() => {
                    const custoPorReal = result?.custoPorReal ?? null;
                    const isGood = custoPorReal !== null && custoPorReal > 1;
                    return (
                      <div
                        className="rounded-xl px-4 py-3"
                        style={{
                          border: `1px solid ${isGood ? "#BFDBFE" : "#F3F4F6"}`,
                          background: isGood ? "#EFF6FF" : "#FAFAFA",
                        }}
                        data-testid="card-custo-por-real"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <Coins size={14} color={isGood ? "#2563EB" : "#9CA3AF"} />
                          <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
                            Preço por R$1 de custo
                          </span>
                          <InfoTooltip text="Mostra quanto deve ser cobrado para cada R$1 de custo." />
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={custoPorReal?.toFixed(4) ?? "empty"}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                          >
                            {custoPorReal !== null ? (
                              <>
                                <span className="font-bold" style={{ fontSize: 22, color: isGood ? "#2563EB" : "#DC2626", lineHeight: 1.2 }}>
                                  R$ {formatBRL(custoPorReal)}
                                </span>
                                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>
                                  Para cada{" "}
                                  <span className="font-semibold" style={{ color: "#111827" }}>R$&nbsp;1,00</span>{" "}
                                  de custo, o preço ideal de venda é{" "}
                                  <span className="font-semibold" style={{ color: isGood ? "#2563EB" : "#DC2626" }}>
                                    R$&nbsp;{formatBRL(custoPorReal)}
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

                {/* Right: donut chart */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-xs font-medium mb-3 self-start" style={{ color: "#6B7280" }}>
                    Composição do Preço de Venda
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
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 justify-center">
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

          {/* ── What is Markup ── */}
          <section className="mb-12" data-testid="section-what-is-markup">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>O que é Markup?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Tag size={20} color="#2563EB" />, bg: "#DBEAFE",
                  title: "O que significa",
                  desc: "Markup é um índice multiplicador aplicado sobre o custo do produto para calcular o preço de venda. Ele garante que o negócio cubra despesas e gere o lucro desejado.",
                },
                {
                  icon: <Calculator size={20} color="#16A34A" />, bg: "#DCFCE7",
                  title: "Como é calculado",
                  desc: "Markup = 100 ÷ (100 − Despesas − Margem de Lucro). Em seguida, multiplique o custo por esse índice para obter o preço de venda ideal.",
                },
                {
                  icon: <BarChart2 size={20} color="#7C3AED" />, bg: "#EDE9FE",
                  title: "Por que é importante",
                  desc: "Sem um markup correto, muitas empresas vendem sem lucro real. O markup garante que todas as despesas estejam embutidas no preço e que o lucro seja real.",
                },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
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
              {examples.map((ex) => {
                const { result: exResult } = calcMarkup(formatBRL(ex.custo), String(ex.despesas), String(ex.margem));
                return (
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
                        { label: "Custo",    value: `R$ ${formatBRL(ex.custo)}`    },
                        { label: "Despesas", value: `${ex.despesas}%`              },
                        { label: "Margem",   value: `${ex.margem}%`               },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-sm">
                          <span style={{ color: "#6B7280" }}>{row.label}</span>
                          <span className="font-medium" style={{ color: "#111827" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                      <span className="text-sm font-medium" style={{ color: "#6B7280" }}>Preço de Venda</span>
                      <span className="font-bold text-lg" style={{ color: "#2563EB" }}>
                        {exResult ? `R$ ${formatBRL(exResult.precoVenda)}` : "—"}
                      </span>
                    </div>
                    <button
                      onClick={() => applyExample(ex.custo, ex.despesas, ex.margem)}
                      className="mt-3 w-full text-xs font-medium py-2 rounded-lg border transition-colors hover:bg-gray-50"
                      style={{ color: "#6B7280", borderColor: "#E5E7EB" }}
                      data-testid={`btn-usar-exemplo-${ex.title}`}
                    >
                      Usar este exemplo
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-12" data-testid="section-faq">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Perguntas frequentes</h2>
            <FaqList />
          </section>

          {/* ── Related tools ── */}
          <section data-testid="section-related-tools">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Ferramentas relacionadas</h2>
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
    document.title = "Calculadora de Markup Online Grátis | Nicemp";
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
    setMeta("description", "Calcule o preço ideal de venda dos seus produtos utilizando a calculadora de Markup gratuita da Nicemp.");
    setMeta("og:title",       "Calculadora de Markup Online Grátis | Nicemp", true);
    setMeta("og:description", "Calcule o preço ideal de venda dos seus produtos com a calculadora de Markup da Nicemp.", true);
    setMeta("og:url",         buildUrl(TOOLS_DOMAIN, "/markup"), true);
    setMeta("og:type",        "website", true);
    const existing = document.querySelector("#schema-markup");
    if (!existing) {
      const script = document.createElement("script");
      script.id   = "schema-markup";
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Markup Online",
        url: buildUrl(TOOLS_DOMAIN, "/markup"),
        description: "Calcule o preço ideal de venda dos seus produtos.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      });
      document.head.appendChild(script);
    }
    return () => { document.querySelector("#schema-markup")?.remove(); };
  }, []);
  return null;
}
