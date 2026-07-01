import { useState, useEffect, useRef, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Tag, TrendingUp, BarChart2, DollarSign, FileText, Building2,
  ChevronDown, ArrowRight, RotateCcw, ShoppingBag, Utensils, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatBRL, maskCurrency, maskPercent, parseCurrency, parsePercent } from "@/utils/format";
import { loadToolSettings } from "@/lib/tool-settings";

interface MarkupResult {
  precoVenda: number;
  multiplicador: number;
  lucroEsperado: number;
  custo: number;
  despesas: number;
  margem: number;
  custoPorReal: number;
}

function calcMarkup(custoStr: string, despesasStr: string, margemStr: string): { errs: Record<string, string>; result: MarkupResult | null } {
  const custo = parseCurrency(custoStr);
  const despesas = parsePercent(despesasStr);
  const margem = parsePercent(margemStr);
  const errs: Record<string, string> = {};
  if (!custoStr || custo <= 0) errs.custo = "Informe um custo válido (maior que zero).";
  if (!despesasStr || despesas < 0) errs.despesas = "Informe um valor de despesas válido.";
  if (!margemStr || margem <= 0) errs.margem = "Informe uma margem de lucro válida (maior que zero).";
  if ((despesas + margem) >= 100) errs.margem = "A soma de despesas e margem não pode atingir ou ultrapassar 100%.";
  if (Object.keys(errs).length) return { errs, result: null };
  const multiplicador = 100 / (100 - despesas - margem);
  const precoVenda = custo * multiplicador;
  const lucroEsperado = precoVenda - custo - (precoVenda * despesas / 100);
  const custoPorReal = precoVenda / custo;
  return { errs: {}, result: { precoVenda, multiplicador, lucroEsperado, custo, despesas, margem, custoPorReal } };
}

function MarkupBadge({ mult }: { mult: number | null }) {
  if (mult === null) return null;
  let label = "", bg = "", color = "";
  if (mult >= 3) { label = "Excelente"; bg = "#DCFCE7"; color = "#16A34A"; }
  else if (mult >= 2) { label = "Bom"; bg = "#DBEAFE"; color = "#2563EB"; }
  else if (mult >= 1.5) { label = "Razoável"; bg = "#FEF3C7"; color = "#D97706"; }
  else { label = "Baixo"; bg = "#FEE2E2"; color = "#DC2626"; }
  return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style={{ background: bg, color }}>{label}</span>;
}

const faqs = [
  { q: "O que é Markup?", a: "Markup é um índice multiplicador aplicado sobre o custo de um produto para definir o preço de venda. Ele garante que o negócio cubra todas as despesas e ainda gere lucro." },
  { q: "O que é um bom Markup?", a: "Depende do setor. No varejo, um markup entre 2x e 3x é comum. Em serviços, pode ser maior. O importante é que o preço final cubra custos, despesas e gere a margem desejada." },
  { q: "Qual a diferença entre Markup e Margem?", a: "A margem é calculada sobre o preço de venda, enquanto o markup é calculado sobre o custo. Um markup de 2x não equivale a uma margem de 50% — a margem real depende das despesas envolvidas." },
  { q: "Por que usar o Markup?", a: "O markup simplifica a precificação: basta multiplicar o custo pelo índice e você já tem o preço de venda correto, considerando todas as despesas e a margem de lucro desejada." },
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

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  Varejo: <ShoppingBag size={18} color="#16A34A" />,
  Alimentação: <Utensils size={18} color="#2563EB" />,
  Serviços: <Briefcase size={18} color="#7C3AED" />,
};
const SECTOR_BG: Record<string, string> = {
  Varejo: "#DCFCE7", Alimentação: "#DBEAFE", Serviços: "#EDE9FE",
};
const DEFAULT_ICON = <Tag size={18} color="#6B7280" />;
const DEFAULT_BG = "#F3F4F6";

function InputField({ label, value, onChange, testId, error, prefix, suffix, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; testId: string;
  error?: string; prefix?: string; suffix?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#6B7280" }}>{prefix}</span>}
        <input
          value={value}
          onChange={(e) => onChange(prefix ? maskCurrency(e.target.value) : maskPercent(e.target.value))}
          className="w-full rounded-xl py-3 text-sm border outline-none focus:ring-2 transition-shadow"
          style={{ paddingLeft: prefix ? 40 : 16, paddingRight: suffix ? 36 : 16, borderColor: error ? "#EF4444" : "#E5E7EB", color: "#111827", background: "white" }}
          placeholder={placeholder ?? "0,00"}
          inputMode="numeric"
          data-testid={testId}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#6B7280" }}>{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function MarkupCalculator() {
  const toolSettings = useMemo(() => loadToolSettings(), []);
  const { markupExamples } = toolSettings;

  const [custoInput, setCustoInput] = useState("");
  const [despesasInput, setDespesasInput] = useState("");
  const [margemInput, setMargemInput] = useState("");
  const [result, setResult] = useState<MarkupResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasAttempted = useRef(false);

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
    setErrors(errs); setResult(r);
  }

  function handleClear() {
    hasAttempted.current = false;
    setCustoInput(""); setDespesasInput(""); setMargemInput(""); setResult(null); setErrors({});
  }

  function applyExample(custo: number, despesas: number, margem: number) {
    const cs = formatBRL(custo); const ds = String(despesas); const ms = String(margem);
    hasAttempted.current = true;
    setCustoInput(cs); setDespesasInput(ds); setMargemInput(ms);
    const { errs, result: r } = calcMarkup(cs, ds, ms);
    setErrors(errs); setResult(r);
  }

  const mult = result?.multiplicador ?? null;
  const pieData = result
    ? [
        { name: "Custo", value: result.custo, color: "#0F172A" },
        { name: "Despesas", value: result.precoVenda * result.despesas / 100, color: "#E5E7EB" },
        { name: "Lucro", value: result.lucroEsperado, color: "#16A34A" },
      ].filter((d) => d.value > 0)
    : [{ name: "Aguardando", value: 1, color: "#E5E7EB" }];

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "#FAFAFA", paddingTop: 92 }}>
        <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px 80px" }}>
          <div className="py-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal mb-3" style={{ color: "#16A34A" }}>Financeiro</p>
            <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#111827", letterSpacing: "-0.03em" }}>Calculadora de Markup</h1>
            <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>Descubra o preço ideal de venda dos seus produtos e maximize seu lucro.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[400px_1fr] mb-12">
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 className="font-semibold text-lg mb-5" style={{ color: "#111827" }}>Dados do produto</h2>
              <div className="space-y-4">
                <InputField label="Custo do produto" value={custoInput} onChange={setCustoInput} testId="input-custo" prefix="R$" error={errors.custo} />
                <InputField label="Despesas (%)" value={despesasInput} onChange={setDespesasInput} testId="input-despesas" suffix="%" placeholder="0,00" error={errors.despesas} />
                <InputField label="Margem de lucro (%)" value={margemInput} onChange={setMargemInput} testId="input-margem" suffix="%" placeholder="0,00" error={errors.margem} />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleCalculate} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "#16A34A" }} data-testid="btn-calcular">Calcular Markup</button>
                <button onClick={handleClear} className="p-3 rounded-xl border transition-colors hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }} data-testid="btn-limpar"><RotateCcw size={16} color="#6B7280" /></button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg" style={{ color: "#111827" }}>Resultado</h2>
                <MarkupBadge mult={mult} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Preço de Venda", value: result ? `R$ ${formatBRL(result.precoVenda)}` : "—", color: "#16A34A", size: "2xl" },
                  { label: "Markup", value: mult !== null ? `${mult.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x` : "—", color: "#111827", size: "xl" },
                  { label: "Lucro esperado", value: result ? `R$ ${formatBRL(result.lucroEsperado)}` : "—", color: "#16A34A", size: "base" },
                  { label: "Custo por real vendido", value: mult ? `R$ ${(1 / mult).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—", color: "#111827", size: "base" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl p-4" style={{ background: "#F9FAFB" }}>
                    <div className="text-xs mb-1" style={{ color: "#6B7280" }}>{m.label}</div>
                    <div className={`font-bold text-${m.size}`} style={{ color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`R$ ${formatBRL(v)}`, ""]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Exemplos por setor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {markupExamples.map((ex, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: SECTOR_BG[ex.titulo] ?? DEFAULT_BG }}>
                      {SECTOR_ICONS[ex.titulo] ?? DEFAULT_ICON}
                    </div>
                    <span className="font-semibold" style={{ color: "#111827" }}>{ex.titulo}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Custo", value: `R$ ${formatBRL(ex.custo)}` },
                      { label: "Despesas", value: `${ex.despesas}%` },
                      { label: "Margem", value: `${ex.margem}%` },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span style={{ color: "#6B7280" }}>{row.label}</span>
                        <span className="font-medium" style={{ color: "#111827" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => applyExample(ex.custo, ex.despesas, ex.margem)} className="mt-2 w-full text-xs font-medium py-2 rounded-lg border transition-colors hover:bg-gray-50" style={{ color: "#6B7280", borderColor: "#E5E7EB" }}>Usar este exemplo</button>
                </div>
              ))}
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
                { label: "ROI", route: "/roi", icon: <TrendingUp size={18} color="#16A34A" />, bg: "#DCFCE7" },
                { label: "Impostos", route: "/impostos/simples-nacional", icon: <Building2 size={18} color="#2563EB" />, bg: "#DBEAFE" },
                { label: "Capital de Giro", route: "/capital-de-giro", icon: <DollarSign size={18} color="#D97706" />, bg: "#FEF3C7" },
                { label: "DRE", route: "/dre", icon: <FileText size={18} color="#7C3AED" />, bg: "#EDE9FE" },
                { label: "Dashboard", route: "/gerencie", icon: <BarChart2 size={18} color="#0891B2" />, bg: "#CFFAFE" },
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
