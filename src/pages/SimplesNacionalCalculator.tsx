import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Building2, TrendingUp, FileText, DollarSign, Tag, Percent,
  ChevronDown, ChevronRight, RotateCcw, ArrowRight,
  Receipt, Info, ShoppingBag, Utensils, Briefcase, AlertCircle,
  Calculator,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MAIN_DOMAIN, TOOLS_DOMAIN, buildUrl } from "@/constants/domains";
import {
  calcularSimples,
  ESTADOS_BR,
  FAIXA_LABELS,
  ANEXO_DESC,
  type Anexo,
  type EstadoBR,
  type ResultadoSimples,
} from "@/lib/simples-nacional";
import { formatBRL, formatPct, maskCurrency, parseCurrency } from "@/utils/format";

// ── Formatting helpers ────────────────────────────────────────────────────────

// ── Tooltip ───────────────────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-flex">
      <Info size={12} color="#9CA3AF" className="cursor-help" />
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 text-xs rounded-xl px-3 py-2 leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{
          background: "#111827",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          whiteSpace: "normal",
        }}
      >
        {text}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
          style={{ borderTopColor: "#111827" }}
        />
      </div>
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────

function SelectField({
  label,
  value,
  onChange,
  options,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  testId: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl py-3 px-4 text-sm border outline-none focus:ring-2 transition-shadow appearance-none"
        style={{
          borderColor: "#E5E7EB",
          color: "#111827",
          background: "white",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 36,
          "--tw-ring-color": "#16A34A40",
        } as React.CSSProperties}
        data-testid={testId}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Currency input ────────────────────────────────────────────────────────────

function CurrencyField({
  label,
  value,
  onChange,
  onBlur,
  testId,
  tooltip,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  testId: string;
  tooltip?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="block text-sm font-medium" style={{ color: "#374151" }}>
          {label}
        </label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
          style={{ color: "#9CA3AF" }}
        >
          R$
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0,00"
          value={value}
          onChange={(e) => onChange(maskCurrency(e.target.value))}
          onBlur={onBlur}
          className="w-full rounded-xl py-3 text-sm border outline-none focus:ring-2 transition-shadow"
          style={{
            paddingLeft: 36,
            borderColor: "#E5E7EB",
            color: "#111827",
            "--tw-ring-color": "#16A34A40",
          } as React.CSSProperties}
          data-testid={testId}
        />
      </div>
    </div>
  );
}

// ── Metric row ────────────────────────────────────────────────────────────────

function MetricRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ border: "1px solid #F3F4F6", background: "#FAFAFA" }}
    >
      <span className="text-sm" style={{ color: "#6B7280" }}>
        {label}
      </span>
      <span className="font-semibold text-sm" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "O que é o Simples Nacional?",
    a: "O Simples Nacional é um regime tributário simplificado destinado a Microempresas (ME) e Empresas de Pequeno Porte (EPP) com receita bruta anual de até R$ 4,8 milhões. Ele unifica o recolhimento de vários impostos em uma única guia mensal chamada DAS.",
  },
  {
    q: "Como o DAS é calculado?",
    a: "Primeiro calcula-se a Alíquota Efetiva: ((RBT12 × Alíquota Nominal) − Parcela a Deduzir) ÷ RBT12. Depois: DAS = Receita Bruta do Mês × Alíquota Efetiva. O RBT12 determina em qual faixa a empresa está.",
  },
  {
    q: "O que é a alíquota efetiva?",
    a: "A alíquota efetiva é o percentual real pago sobre o faturamento do mês. Ela é sempre menor ou igual à alíquota nominal da faixa, pois o cálculo desconta a parcela a deduzir definida em lei — por isso a progressividade é suavizada.",
  },
  {
    q: "O que é o Anexo I?",
    a: "O Anexo I abrange atividades de Comércio (revenda de mercadorias). As alíquotas variam de 4% (1ª faixa) a 19% (6ª faixa) conforme o RBT12, com parcelas a deduzir que reduzem a alíquota efetiva.",
  },
  {
    q: "O que é o Anexo III?",
    a: "O Anexo III é destinado a prestadores de serviços como academias, agências de viagens, laboratórios e escritórios de contabilidade. As alíquotas variam de 6% a 33% e em geral são mais favoráveis que o Anexo V para atividades equivalentes.",
  },
  {
    q: "Posso mudar de anexo?",
    a: "O enquadramento no anexo correto é obrigação legal e depende da atividade econômica (CNAE) da empresa. A mudança de anexo só ocorre se houver alteração real da atividade principal. Consulte um contador para validar o enquadramento adequado.",
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
            <span className="font-medium text-sm" style={{ color: "#111827" }}>
              {faq.q}
            </span>
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
                  style={{
                    color: "#6B7280",
                    background: "#FAFAFA",
                    borderTop: "1px solid #F3F4F6",
                  }}
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
  { label: "Markup",          route: "/markup",          icon: <Tag        size={18} color="#2563EB" />, bg: "#DBEAFE" },
  { label: "ROI",             route: "/roi",             icon: <TrendingUp size={18} color="#16A34A" />, bg: "#DCFCE7" },
  { label: "Capital de Giro", route: "/capital-de-giro", icon: <DollarSign size={18} color="#D97706" />, bg: "#FEF3C7" },
  { label: "Margem de Lucro", route: "/margem-de-lucro", icon: <Percent    size={18} color="#16A34A" />, bg: "#DCFCE7" },
  { label: "DRE",             route: "/dre",             icon: <FileText   size={18} color="#7C3AED" />, bg: "#EDE9FE" },
];

// ── Example presets ───────────────────────────────────────────────────────────

const examples = [
  {
    title: "Comércio",
    icon: <ShoppingBag size={18} color="#2563EB" />,
    bg: "#DBEAFE",
    estado: "SP" as EstadoBR,
    atividade: "Comércio",
    anexo: "I" as Anexo,
    faturamento12m: 250_000,
    receitaMes: 20_000,
  },
  {
    title: "Serviços",
    icon: <Utensils size={18} color="#D97706" />,
    bg: "#FEF3C7",
    estado: "PR" as EstadoBR,
    atividade: "Serviços",
    anexo: "III" as Anexo,
    faturamento12m: 500_000,
    receitaMes: 40_000,
  },
  {
    title: "Indústria",
    icon: <Briefcase size={18} color="#7C3AED" />,
    bg: "#EDE9FE",
    estado: "MG" as EstadoBR,
    atividade: "Indústria",
    anexo: "II" as Anexo,
    faturamento12m: 1_000_000,
    receitaMes: 80_000,
  },
];

// ── Main component ────────────────────────────────────────────────────────────

export function SimplesNacionalCalculator() {
  const [estado,      setEstado]      = useState<EstadoBR>("SP");
  const [atividade,   setAtividade]   = useState("Comércio");
  const [anexo,       setAnexo]       = useState<Anexo>("I");
  const [fat12mInput, setFat12mInput] = useState("");
  const [recMesInput, setRecMesInput] = useState("");
  // touched: show errors only after user has interacted with the currency inputs
  const [touched, setTouched]         = useState(false);
  const [result,  setResult]          = useState<ResultadoSimples | null>(null);
  const [error,   setError]           = useState<string | null>(null);

  // ── Real-time engine ──────────────────────────────────────────────────────
  useEffect(() => {
    // Nothing entered yet → keep blank slate
    if (!fat12mInput && !recMesInput) {
      setResult(null);
      setError(null);
      return;
    }

    const rbt12  = parseCurrency(fat12mInput);
    const recMes = parseCurrency(recMesInput);
    const calc   = calcularSimples(rbt12, recMes, anexo);

    if (calc.ok) {
      setResult(calc.result);
      setError(null);
    } else {
      setResult(null);
      // Only surface validation errors once the user has provided at least one value
      if (touched) setError(calc.error);
    }
  }, [fat12mInput, recMesInput, anexo, touched]);

  function handleClear() {
    setFat12mInput("");
    setRecMesInput("");
    setResult(null);
    setError(null);
    setTouched(false);
  }

  function applyExample(ex: typeof examples[0]) {
    const fat12mStr = formatBRL(ex.faturamento12m);
    const recMesStr = formatBRL(ex.receitaMes);
    setEstado(ex.estado);
    setAtividade(ex.atividade);
    setAnexo(ex.anexo);
    setFat12mInput(fat12mStr);
    setRecMesInput(recMesStr);
    setTouched(true);
    // Immediately compute so the result appears without waiting for useEffect
    const calc = calcularSimples(ex.faturamento12m, ex.receitaMes, ex.anexo);
    if (calc.ok) { setResult(calc.result); setError(null); }
    else         { setResult(null); setError(calc.error); }
  }

  const pieData = result
    ? [
        { name: "Receita Líquida", value: result.receitaLiquida, color: "#0F172A" },
        { name: "Impostos (DAS)",  value: result.valorDAS,       color: "#16A34A" },
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
            <a href="/" className="hover:underline" style={{ color: "#6B7280" }}>
              Ferramentas
            </a>
            <ChevronRight size={12} />
            <Link
              href="/impostos"
              className="hover:underline"
              style={{ color: "#6B7280" }}
              data-testid="breadcrumb-impostos"
            >
              Impostos
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: "#111827", fontWeight: 500 }}>Simples Nacional</span>
          </nav>

          {/* ── Hero ── */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#DCFCE7" }}
              >
                <Receipt size={20} color="#16A34A" />
              </div>
              <h1
                className="font-bold text-3xl"
                style={{ color: "#111827", letterSpacing: "-0.02em" }}
              >
                Calculadora Simples Nacional
              </h1>
            </div>
            <p className="text-base" style={{ color: "#6B7280", maxWidth: 600 }}>
              Calcule a alíquota efetiva e estime o valor do DAS do Simples Nacional.
            </p>
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">

            {/* ── Calculator card ── */}
            <div
              className="lg:col-span-2 bg-white rounded-2xl p-7 flex flex-col"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              data-testid="calculator-card"
            >
              <h2 className="font-semibold text-lg mb-6" style={{ color: "#111827" }}>
                Calcule agora
              </h2>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <SelectField
                    label="Estado"
                    value={estado}
                    onChange={(v) => setEstado(v as EstadoBR)}
                    options={ESTADOS_BR.map((e) => ({ value: e, label: e }))}
                    testId="select-estado"
                  />
                  <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                    O cálculo federal do DAS é igual para todos os estados. O campo é coletado para funcionalidades futuras.
                  </p>
                </div>
                <SelectField
                  label="Tipo de atividade"
                  value={atividade}
                  onChange={setAtividade}
                  options={[
                    { value: "Comércio",  label: "Comércio"  },
                    { value: "Indústria", label: "Indústria" },
                    { value: "Serviços",  label: "Serviços"  },
                  ]}
                  testId="select-atividade"
                />
                <SelectField
                  label="Anexo do Simples Nacional"
                  value={anexo}
                  onChange={(v) => setAnexo(v as Anexo)}
                  options={(["I", "II", "III", "IV", "V"] as Anexo[]).map((a) => ({
                    value: a,
                    label: `Anexo ${a} — ${ANEXO_DESC[a]}`,
                  }))}
                  testId="select-anexo"
                />
                <CurrencyField
                  label="Faturamento acumulado dos últimos 12 meses"
                  value={fat12mInput}
                  onChange={(v) => { setFat12mInput(v); if (v) setTouched(true); }}
                  onBlur={() => setTouched(true)}
                  testId="input-fat12m"
                  tooltip="RBT12: soma das receitas dos últimos 12 meses. Determina em qual faixa tributária a empresa se enquadra."
                />
                <CurrencyField
                  label="Receita bruta do mês atual"
                  value={recMesInput}
                  onChange={(v) => { setRecMesInput(v); if (v) setTouched(true); }}
                  onBlur={() => setTouched(true)}
                  testId="input-rec-mes"
                  tooltip="Valor total faturado no mês para o qual você deseja calcular o DAS."
                />
              </div>

              {/* Formula hint */}
              <div
                className="rounded-xl px-4 py-3 mb-4 text-xs leading-relaxed"
                style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", color: "#6B7280" }}
              >
                <span className="font-semibold" style={{ color: "#111827" }}>Fórmula: </span>
                Alíq. Efetiva = ((RBT12 × Alíq. Nominal) − Parcela Deduzir) ÷ RBT12
              </div>

              {/* Error banner */}
              {error && (
                <div
                  className="flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-xs"
                  style={{ background: "#FEE2E2", border: "1px solid #FECACA", color: "#DC2626" }}
                  data-testid="error-banner"
                >
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Limpar */}
              <div className="mt-auto">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition-colors hover:bg-gray-50"
                  style={{ color: "#6B7280", borderColor: "#E5E7EB" }}
                  data-testid="btn-limpar"
                >
                  <RotateCcw size={14} />
                  Limpar campos
                </button>
              </div>
            </div>

            {/* ── Results card ── */}
            <div
              className="lg:col-span-3 bg-white rounded-2xl p-7 flex flex-col"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              data-testid="results-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg" style={{ color: "#111827" }}>
                  Resultado
                </h2>
                {result && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "#DCFCE7", color: "#16A34A" }}
                  >
                    Faixa {result.faixaIndex + 1} — {FAIXA_LABELS[result.faixaIndex]}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                {/* Left: metrics */}
                <div className="flex flex-col gap-3">

                  {/* Alíquota efetiva — hero number */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: result ? "#DCFCE7" : "#F8FAFC",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
                        Alíquota Efetiva
                      </span>
                      <InfoTooltip text="Percentual real pago sobre a receita do mês, após aplicar a parcela a deduzir. Sempre menor ou igual à alíquota nominal." />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={result?.aliquotaEfetiva?.toFixed(8) ?? "empty"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span
                          className="font-bold"
                          style={{
                            fontSize: 40,
                            color: result ? "#16A34A" : "#9CA3AF",
                            lineHeight: 1,
                          }}
                        >
                          {result ? formatPct(result.aliquotaEfetiva) : "—"}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                      {result
                        ? `Alíquota nominal: ${formatPct(result.aliquotaNominal)} · Dedução: R$ ${formatBRL(result.parcelaADeduzir)}`
                        : "Preencha os campos para calcular"}
                    </p>
                  </div>

                  {/* Metric rows */}
                  <MetricRow
                    label="Valor Estimado do DAS"
                    value={result ? `R$ ${formatBRL(result.valorDAS)}` : "—"}
                    accent="#16A34A"
                  />
                  <MetricRow
                    label="Receita Líquida (após DAS)"
                    value={result ? `R$ ${formatBRL(result.receitaLiquida)}` : "—"}
                    accent="#0F172A"
                  />
                  <MetricRow
                    label="Alíquota Nominal"
                    value={result ? formatPct(result.aliquotaNominal) : "—"}
                    accent="#6B7280"
                  />
                  <MetricRow
                    label="Parcela a Deduzir"
                    value={result ? `R$ ${formatBRL(result.parcelaADeduzir)}` : "—"}
                    accent="#6B7280"
                  />

                  {/* Interpretation card */}
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      border: `1px solid ${result ? "#BBF7D0" : "#F3F4F6"}`,
                      background: result ? "#F0FDF4" : "#FAFAFA",
                    }}
                    data-testid="card-por-mil"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Receipt size={14} color={result ? "#16A34A" : "#9CA3AF"} />
                      <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
                        Imposto por R$1.000 faturados
                      </span>
                      <InfoTooltip text="Quanto da sua receita vai para impostos a cada R$1.000 faturados neste mês." />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={result?.impostosPorMil?.toFixed(6) ?? "empty"}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                      >
                        {result ? (
                          <>
                            <span
                              className="font-bold"
                              style={{ fontSize: 22, color: "#16A34A", lineHeight: 1.2 }}
                            >
                              R$ {formatBRL(result.impostosPorMil)}
                            </span>
                            <p
                              className="text-xs mt-1 leading-relaxed"
                              style={{ color: "#6B7280" }}
                            >
                              Para cada{" "}
                              <span className="font-semibold" style={{ color: "#111827" }}>
                                R$&nbsp;1.000,00
                              </span>{" "}
                              faturados, aproximadamente{" "}
                              <span className="font-semibold" style={{ color: "#16A34A" }}>
                                R$&nbsp;{formatBRL(result.impostosPorMil)}
                              </span>{" "}
                              serão destinados aos impostos.
                            </p>
                          </>
                        ) : (
                          <span className="font-bold text-xl" style={{ color: "#9CA3AF" }}>—</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: donut */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="text-xs font-medium mb-3 self-start"
                    style={{ color: "#6B7280" }}
                  >
                    Distribuição da Receita
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
                        contentStyle={{
                          fontSize: 11,
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 justify-center">
                    {pieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-xs" style={{ color: "#6B7280" }}>
                          {d.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Examples ── */}
          <section className="mb-12" data-testid="section-examples">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>
              Exemplos de simulação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {examples.map((ex) => {
                const exCalc = calcularSimples(ex.faturamento12m, ex.receitaMes, ex.anexo);
                const exResult = exCalc.ok ? exCalc.result : null;
                return (
                  <div
                    key={ex.title}
                    className="bg-white rounded-2xl p-5"
                    style={{
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                    data-testid={`example-${ex.title}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: ex.bg }}
                      >
                        {ex.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "#111827" }}>
                          {ex.title}
                        </div>
                        <div className="text-xs" style={{ color: "#9CA3AF" }}>
                          {ex.estado} · Anexo {ex.anexo}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Faturamento 12m", value: `R$ ${formatBRL(ex.faturamento12m)}` },
                        { label: "Receita do mês",  value: `R$ ${formatBRL(ex.receitaMes)}`     },
                        { label: "Alíq. Efetiva",   value: exResult ? formatPct(exResult.aliquotaEfetiva) : "—" },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-sm">
                          <span style={{ color: "#6B7280" }}>{row.label}</span>
                          <span className="font-medium" style={{ color: "#111827" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex items-center justify-between pt-3 border-t mb-3"
                      style={{ borderColor: "#F3F4F6" }}
                    >
                      <span className="text-sm font-medium" style={{ color: "#6B7280" }}>
                        Valor do DAS
                      </span>
                      <span className="font-bold text-lg" style={{ color: "#16A34A" }}>
                        {exResult ? `R$ ${formatBRL(exResult.valorDAS)}` : "—"}
                      </span>
                    </div>
                    <button
                      onClick={() => applyExample(ex)}
                      className="w-full text-xs font-medium py-2 rounded-lg border transition-colors hover:bg-gray-50"
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

          {/* ── How it works ── */}
          <section className="mb-12" data-testid="section-how-it-works">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>
              Como funciona o Simples Nacional?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: <Building2  size={20} color="#16A34A" />, bg: "#DCFCE7",
                  title: "O que é",
                  desc: "Regime tributário simplificado para ME e EPP com faturamento anual até R$ 4,8 milhões. Unifica impostos federais, estaduais e municipais em um único boleto mensal (DAS).",
                },
                {
                  icon: <Calculator size={20} color="#2563EB" />, bg: "#DBEAFE",
                  title: "Como calcular",
                  desc: "Alíquota Efetiva = ((RBT12 × Alíq. Nominal) − Parcela Deduzir) ÷ RBT12. Em seguida: DAS = Receita do Mês × Alíquota Efetiva.",
                },
                {
                  icon: <TrendingUp size={20} color="#D97706" />, bg: "#FEF3C7",
                  title: "Nominal vs. Efetiva",
                  desc: "A alíquota nominal é a da tabela para sua faixa. A efetiva é o percentual real pago — sempre menor graças à parcela a deduzir prevista em lei.",
                },
                {
                  icon: <Receipt    size={20} color="#7C3AED" />, bg: "#EDE9FE",
                  title: "Quem pode aderir",
                  desc: "Microempresas (até R$ 360k/ano) e Empresas de Pequeno Porte (até R$ 4,8M/ano). Algumas atividades são vedadas — consulte sempre um contador.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-white rounded-2xl p-6"
                  style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: c.bg }}
                  >
                    {c.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "#111827" }}>
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {c.desc}
                  </p>
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
                  style={{
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  data-testid={`related-tool-${t.label}`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: t.bg }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: "#111827" }}>
                      {t.label}
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs mt-0.5"
                      style={{ color: "#16A34A" }}
                    >
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
    document.title = "Calculadora Simples Nacional Online | Nicemp";
    const setMeta = (name: string, content: string, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        prop ? el.setAttribute("property", name) : el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("description", "Calcule a alíquota efetiva e o valor estimado do DAS utilizando a calculadora gratuita da Nicemp.");
    setMeta("og:title",       "Calculadora Simples Nacional Online | Nicemp", true);
    setMeta("og:description", "Calcule a alíquota efetiva e o DAS do Simples Nacional de forma rápida e gratuita.",    true);
    setMeta("og:url",         buildUrl(TOOLS_DOMAIN, "/impostos/simples-nacional"),                              true);
    setMeta("og:type",        "website",                                                                               true);
    const existing = document.querySelector("#schema-simples");
    if (!existing) {
      const script  = document.createElement("script");
      script.id     = "schema-simples";
      script.type   = "application/ld+json";
      script.text   = JSON.stringify({
        "@context": "https://schema.org",
        "@type":    "WebApplication",
        name:       "Calculadora Simples Nacional Online",
        url:        buildUrl(TOOLS_DOMAIN, "/impostos/simples-nacional"),
        description:"Calcule a alíquota efetiva e o valor estimado do DAS do Simples Nacional.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      });
      document.head.appendChild(script);
    }
    return () => { document.querySelector("#schema-simples")?.remove(); };
  }, []);
  return null;
}
