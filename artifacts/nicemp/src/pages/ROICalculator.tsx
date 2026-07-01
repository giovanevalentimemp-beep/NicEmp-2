import { useState, useEffect, useRef, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  TrendingUp, Tag, BarChart2, DollarSign, FileText, Building2,
  ChevronDown, ArrowRight, RotateCcw, Percent, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatBRL, maskCurrency, parseCurrency } from "@/utils/format";
import { loadToolSettings } from "@/lib/tool-settings";

function RoiBadge({ roi }: { roi: number | null }) {
  if (roi === null) return null;
  let label = "", bg = "", color = "";
  if (roi >= 50) { label = "Excelente"; bg = "#DCFCE7"; color = "#16A34A"; }
  else if (roi >= 20) { label = "Bom"; bg = "#DBEAFE"; color = "#2563EB"; }
  else if (roi > 0) { label = "Baixo"; bg = "#FEF3C7"; color = "#D97706"; }
  else { label = "Prejuízo"; bg = "#FEE2E2"; color = "#DC2626"; }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

const faqs = [
  { q: "O que é ROI?", a: "ROI (Return on Investment) é uma métrica financeira que mede o retorno obtido em relação ao investimento feito. Ele indica se um investimento foi lucrativo ou não." },
  { q: "O que é um bom ROI?", a: "Um ROI acima de 20% geralmente é considerado bom. ROI acima de 50% é excelente. Porém, o valor ideal varia de acordo com o setor, prazo e risco do investimento." },
  { q: "O ROI pode ser negativo?", a: "Sim. Um ROI negativo indica prejuízo — o retorno obtido foi menor do que o investimento inicial. Isso é um sinal de alerta para revisar a estratégia." },
  { q: "Por que calcular o ROI?", a: "Calcular o ROI permite comparar diferentes investimentos, justificar decisões financeiras, identificar o que está gerando resultados e eliminar o que está dando prejuízo." },
];

function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: 720 }}>
      {faqs.map((faq, i) => (
        <div key={faq.q} className="rounded-2xl overflow-hidden cursor-pointer" style={{ border: "1px solid #E5E7EB" }} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
          <div className="flex items-center justify-between px-6 py-4 bg-white" style={{ userSelect: "none" }}>
            <span className="font-medium text-sm" style={{ color: "#111827" }}>{faq.q}</span>
            <ChevronDown size={16} style={{ color: "#6B7280", transition: "transform 0.2s", transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
          </div>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
                <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "#6B7280", background: "#FAFAFA", borderTop: "1px solid #F3F4F6" }}>{faq.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function calcROI(investStr: string, retornoStr: string) {
  const invest = parseCurrency(investStr);
  const retorno = parseCurrency(retornoStr);
  const errs: { invest?: string; retorno?: string } = {};
  if (!investStr || invest <= 0) errs.invest = "Informe um valor de investimento válido (maior que zero).";
  if (!retornoStr || retorno < 0) errs.retorno = "Informe um retorno válido (não negativo).";
  if (Object.keys(errs).length) return { errs, result: null };
  return { errs: {}, result: { roi: ((retorno - invest) / invest) * 100, lucro: retorno - invest, invest, retorno, multiplo: retorno / invest } };
}

const EXAMPLE_ICONS: React.ReactNode[] = [
  <TrendingUp size={18} color="#16A34A" />,
  <Building2 size={18} color="#2563EB" />,
  <BarChart2 size={18} color="#7C3AED" />,
  <DollarSign size={18} color="#D97706" />,
];
const EXAMPLE_BGS = ["#DCFCE7", "#DBEAFE", "#EDE9FE", "#FEF3C7"];

function CurrencyField({ label, value, onChange, testId, error }: {
  label: string; value: string; onChange: (v: string) => void; testId: string; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#6B7280" }}>R$</span>
        <input
          value={value}
          onChange={(e) => onChange(maskCurrency(e.target.value))}
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm border outline-none focus:ring-2 transition-shadow"
          style={{ borderColor: error ? "#EF4444" : "#E5E7EB", color: "#111827", background: "white" }}
          placeholder="0,00"
          inputMode="numeric"
          data-testid={testId}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function ROICalculator() {
  const toolSettings = useMemo(() => loadToolSettings(), []);
  const { roiExamples, roiSettings } = toolSettings;

  const [investInput, setInvestInput] = useState("");
  const [returnInput, setReturnInput]   = useState("");
  const [result, setResult] = useState<{ roi: number; lucro: number; invest: number; retorno: number; multiplo: number } | null>(null);
  const [errors, setErrors] = useState<{ invest?: string; retorno?: string }>({});
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!investInput && !returnInput) return;
    const { errs, result: r } = calcROI(investInput, returnInput);
    if (hasAttempted.current) setErrors(errs);
    if (r) { setErrors({}); setResult(r); }
    else if (hasAttempted.current) setResult(null);
  }, [investInput, returnInput]);

  function handleCalculate() {
    hasAttempted.current = true;
    const { errs, result: r } = calcROI(investInput, returnInput);
    setErrors(errs); setResult(r);
  }

  function handleClear() {
    hasAttempted.current = false;
    setInvestInput(""); setReturnInput(""); setResult(null); setErrors({});
  }

  function applyExample(invest: number, retorno: number) {
    const investStr = formatBRL(invest); const retornoStr = formatBRL(retorno);
    hasAttempted.current = true;
    setInvestInput(investStr); setReturnInput(retornoStr);
    const { errs, result: r } = calcROI(investStr, retornoStr);
    setErrors(errs); setResult(r);
  }

  const roi = result?.roi ?? null;
  const roiColor = roi === null ? "#6B7280" : roi > 0 ? "#16A34A" : roi < 0 ? "#DC2626" : "#6B7280";
  const pieData = result
    ? [{ name: "Investimento", value: result.invest, color: "#0F172A" }, { name: "Lucro", value: Math.max(result.lucro, 0), color: "#16A34A" }].filter((d) => d.value > 0)
    : [{ name: "Aguardando", value: 1, color: "#E5E7EB" }];

  const resultMetrics = [
    roiSettings.exibirROIPct && {
      label: "ROI",
      value: roi !== null ? `${roi >= 0 ? "+" : ""}${roi.toFixed(roiSettings.decimais).replace(".", ",")}%` : "—",
      color: roiColor, size: "2xl",
    },
    roiSettings.exibirLucro && {
      label: "Lucro / Prejuízo",
      value: result ? `R$ ${formatBRL(result.lucro)}` : "—",
      color: result?.lucro !== undefined ? (result.lucro >= 0 ? "#16A34A" : "#DC2626") : "#6B7280", size: "xl",
    },
    {
      label: "Investimento",
      value: result ? `R$ ${formatBRL(result.invest)}` : "—",
      color: "#111827", size: "base",
    },
    {
      label: "Retorno total",
      value: result ? `R$ ${formatBRL(result.retorno)}` : "—",
      color: "#111827", size: "base",
    },
    roiSettings.exibirMultiplo && {
      label: "Múltiplo",
      value: result ? `${result.multiplo.toFixed(roiSettings.decimais).replace(".", ",")}x` : "—",
      color: "#6B7280", size: "base",
    },
  ].filter(Boolean) as { label: string; value: string; color: string; size: string }[];

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "#FAFAFA", paddingTop: 92 }}>
        <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px 80px" }}>
          <div className="py-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal mb-3" style={{ color: "#16A34A" }}>Financeiro</p>
            <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#111827", letterSpacing: "-0.03em" }}>Calculadora de ROI</h1>
            <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>Calcule o retorno sobre investimento do seu negócio de forma rápida e gratuita.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[400px_1fr] mb-12">
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 className="font-semibold text-lg mb-5" style={{ color: "#111827" }}>Dados do investimento</h2>
              <div className="space-y-4">
                <CurrencyField label="Valor investido" value={investInput} onChange={setInvestInput} testId="input-investimento" error={errors.invest} />
                <CurrencyField label="Retorno obtido" value={returnInput} onChange={setReturnInput} testId="input-retorno" error={errors.retorno} />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleCalculate} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "#16A34A" }} data-testid="btn-calcular">Calcular ROI</button>
                <button onClick={handleClear} className="p-3 rounded-xl border transition-colors hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }} data-testid="btn-limpar"><RotateCcw size={16} color="#6B7280" /></button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg" style={{ color: "#111827" }}>Resultado</h2>
                <RoiBadge roi={roi} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {resultMetrics.map((m) => (
                  <div key={m.label} className="rounded-xl p-4" style={{ background: "#F9FAFB" }}>
                    <div className="text-xs mb-1" style={{ color: "#6B7280" }}>{m.label}</div>
                    <div className={`font-bold text-${m.size}`} style={{ color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`R$ ${formatBRL(v)}`, ""]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>O que é ROI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: <Percent size={20} color="#16A34A" />, bg: "#DCFCE7", title: "O que significa", desc: "ROI (Return on Investment) é uma métrica que mede o percentual de retorno obtido em relação ao capital investido em qualquer tipo de negócio ou projeto." },
                { icon: <Info size={20} color="#2563EB" />, bg: "#DBEAFE", title: "Como é calculado", desc: "A fórmula é simples: ROI (%) = ((Retorno − Investimento) ÷ Investimento) × 100. Um ROI de 50% significa que para cada R$1 investido, você obteve R$0,50 de lucro." },
                { icon: <BarChart2 size={20} color="#7C3AED" />, bg: "#EDE9FE", title: "Por que é importante", desc: "O ROI é uma das métricas mais usadas para comparar investimentos, justificar estratégias e identificar o que realmente está gerando valor para o negócio." },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: c.bg }}>{c.icon}</div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "#111827" }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Exemplos práticos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {roiExamples.map((ex, idx) => {
                const roiEx = ((ex.retorno - ex.invest) / ex.invest) * 100;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: EXAMPLE_BGS[idx % EXAMPLE_BGS.length] }}>
                        {EXAMPLE_ICONS[idx % EXAMPLE_ICONS.length]}
                      </div>
                      <span className="font-semibold" style={{ color: "#111827" }}>{ex.titulo}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Investimento", value: `R$ ${formatBRL(ex.invest)}` },
                        { label: "Retorno", value: `R$ ${formatBRL(ex.retorno)}` },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-sm">
                          <span style={{ color: "#6B7280" }}>{row.label}</span>
                          <span className="font-medium" style={{ color: "#111827" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                      <span className="text-sm font-medium" style={{ color: "#6B7280" }}>ROI</span>
                      <span className="font-bold text-xl" style={{ color: roiEx >= 0 ? "#16A34A" : "#DC2626" }}>
                        {roiEx >= 0 ? "+" : ""}{roiEx.toFixed(roiSettings.decimais).replace(".", ",")}%
                      </span>
                    </div>
                    <button onClick={() => applyExample(ex.invest, ex.retorno)} className="mt-3 w-full text-xs font-medium py-2 rounded-lg border transition-colors hover:bg-gray-50" style={{ color: "#6B7280", borderColor: "#E5E7EB" }}>
                      Usar este exemplo
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Perguntas frequentes</h2>
            <FaqList />
          </section>

          <section>
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Ferramentas relacionadas</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Markup", route: "/markup", icon: <Tag size={18} color="#2563EB" />, bg: "#DBEAFE" },
                { label: "Margem de Lucro", route: "/margem-de-lucro", icon: <Percent size={18} color="#16A34A" />, bg: "#DCFCE7" },
                { label: "Capital de Giro", route: "/capital-de-giro", icon: <DollarSign size={18} color="#D97706" />, bg: "#FEF3C7" },
                { label: "DRE", route: "/dre", icon: <FileText size={18} color="#7C3AED" />, bg: "#EDE9FE" },
                { label: "Impostos", route: "/impostos/simples-nacional", icon: <Building2 size={18} color="#0891B2" />, bg: "#CFFAFE" },
              ].map((t) => (
                <Link key={t.label} href={t.route} className="bg-white rounded-2xl p-4 flex flex-col items-start gap-3 transition-shadow hover:shadow-md" style={{ border: "1px solid #E5E7EB" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: t.bg }}>{t.icon}</div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: "#111827" }}>{t.label}</div>
                    <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#16A34A" }}>Usar ferramenta <ArrowRight size={10} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
