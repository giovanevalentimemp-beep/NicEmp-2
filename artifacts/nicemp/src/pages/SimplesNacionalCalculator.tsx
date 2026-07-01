import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Building2, TrendingUp, DollarSign, Tag,
  ChevronDown, RotateCcw, ArrowRight, Receipt, AlertCircle, Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { calcularSimplesComFaixas, LIMITE_MAXIMO_RBT12 } from "@/lib/simples-nacional/engine";
import { loadToolSettings } from "@/lib/tool-settings";
import { ESTADOS_BR, FAIXA_LABELS, ANEXO_DESC } from "@/lib/simples-nacional";
import type { Anexo, ResultadoSimples } from "@/lib/simples-nacional/types";
import { formatBRL, formatPct, maskCurrency, parseCurrency } from "@/utils/format";

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-flex">
      <Info size={12} color="#9CA3AF" className="cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 text-xs rounded-xl px-3 py-2 leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{ background: "#111827", color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", whiteSpace: "normal" }}>
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: "#111827" }} />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl py-3 px-4 text-sm border outline-none focus:ring-2 transition-shadow appearance-none"
        style={{ borderColor: "#E5E7EB", color: "#111827", background: "white", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function CurrencyField({ label, value, onChange, error, tooltip }: { label: string; value: string; onChange: (v: string) => void; error?: string; tooltip?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "#374151" }}>
        {label} {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#6B7280" }}>R$</span>
        <input
          value={value}
          onChange={(e) => onChange(maskCurrency(e.target.value))}
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm border outline-none focus:ring-2 transition-shadow"
          style={{ borderColor: error ? "#EF4444" : "#E5E7EB", color: "#111827", background: "white" }}
          placeholder="0,00"
          inputMode="numeric"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const faqs = [
  { q: "O que é o Simples Nacional?", a: "O Simples Nacional é um regime tributário diferenciado para micro e pequenas empresas, que unifica o pagamento de vários tributos em uma única guia chamada DAS (Documento de Arrecadação do Simples Nacional)." },
  { q: "O que é alíquota efetiva?", a: "A alíquota efetiva é o percentual real de imposto calculado com base na fórmula oficial: (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12. Ela é sempre menor que a alíquota nominal da faixa." },
  { q: "O que é RBT12?", a: "RBT12 é a Receita Bruta Total dos últimos 12 meses. É usado para enquadrar a empresa na faixa correta do Simples Nacional e calcular a alíquota efetiva." },
  { q: "Qual é o limite do Simples Nacional?", a: `O limite anual é R$ ${LIMITE_MAXIMO_RBT12.toLocaleString("pt-BR")}. Empresas que ultrapassam esse valor não podem mais optar pelo Simples Nacional.` },
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

const ANEXO_OPTIONS: { value: Anexo; label: string }[] = [
  { value: "I",   label: "Anexo I — Comércio" },
  { value: "II",  label: "Anexo II — Indústria" },
  { value: "III", label: "Anexo III — Serviços (academia, lab, viagens...)" },
  { value: "IV",  label: "Anexo IV — Serviços (construção, limpeza...)" },
  { value: "V",   label: "Anexo V — Serviços (consultoria, publicidade...)" },
];

const ESTADO_OPTIONS = ESTADOS_BR.map((s) => ({ value: s, label: s }));

function StepByStep({ rbt12, receitaMes, faixaIndex, result, anexo }: {
  rbt12: number; receitaMes: number; faixaIndex: number; result: ResultadoSimples; anexo: Anexo;
}) {
  const steps = [
    { label: "Faixa encontrada", value: `${FAIXA_LABELS[faixaIndex]} · ${ANEXO_DESC[anexo]}` },
    { label: "RBT12 (base)", value: `R$ ${formatBRL(rbt12)}` },
    { label: "Alíquota nominal da faixa", value: formatPct(result.aliquotaNominal) },
    { label: "Parcela a deduzir", value: `R$ ${formatBRL(result.parcelaADeduzir)}` },
    {
      label: "Fórmula aplicada",
      value: `(${formatBRL(rbt12)} × ${formatPct(result.aliquotaNominal)} − ${formatBRL(result.parcelaADeduzir)}) ÷ ${formatBRL(rbt12)}`,
    },
    { label: "Alíquota efetiva", value: formatPct(result.aliquotaEfetiva), highlight: true },
    {
      label: "DAS do mês",
      value: `R$ ${formatBRL(receitaMes)} × ${formatPct(result.aliquotaEfetiva)} = R$ ${formatBRL(result.valorDAS)}`,
      highlight: true,
    },
  ];

  return (
    <div className="mt-6 rounded-2xl p-5" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
      <h3 className="font-semibold text-sm mb-3" style={{ color: "#166534" }}>Passo a passo do cálculo</h3>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step.highlight ? "#16A34A" : "#D1FAE5", color: step.highlight ? "white" : "#15803D" }}>
              {i + 1}
            </span>
            <div>
              <span className="text-xs" style={{ color: "#4B5563" }}>{step.label}: </span>
              <span className={`text-xs font-semibold ${step.highlight ? "text-green-700" : ""}`} style={{ color: step.highlight ? "#16A34A" : "#111827" }}>
                {step.value}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SimplesNacionalCalculator() {
  const toolSettings = useMemo(() => loadToolSettings(), []);

  const [rbt12Input, setRbt12Input]         = useState("");
  const [receitaMesInput, setReceitaMesInput] = useState("");
  const [anexo, setAnexo]                   = useState<Anexo>("I");
  const [estado, setEstado]                 = useState("SP");
  const [result, setResult]                 = useState<ResultadoSimples | null>(null);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);

  useEffect(() => {
    const rbt12 = parseCurrency(rbt12Input);
    const receitaMes = parseCurrency(receitaMesInput);
    if (!rbt12Input || !receitaMesInput) { setResult(null); setErrorMsg(null); return; }

    const faixas = toolSettings.simplesAnexos[anexo] ?? [];
    const calc = calcularSimplesComFaixas(rbt12, receitaMes, faixas);
    if (calc.ok) { setResult(calc.result); setErrorMsg(null); }
    else { setResult(null); setErrorMsg(calc.error); }
  }, [rbt12Input, receitaMesInput, anexo, toolSettings]);

  function handleClear() { setRbt12Input(""); setReceitaMesInput(""); setResult(null); setErrorMsg(null); }

  const rbt12 = parseCurrency(rbt12Input);
  const receitaMes = parseCurrency(receitaMesInput);

  const pieData = result
    ? [
        { name: "Receita líquida", value: result.receitaLiquida, color: "#16A34A" },
        { name: "DAS", value: result.valorDAS, color: "#0F172A" },
      ]
    : [{ name: "Aguardando", value: 1, color: "#E5E7EB" }];

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{ background: "#FAFAFA", paddingTop: 92 }}>
        <div className="mx-auto" style={{ maxWidth: 1280, padding: "0 32px 80px" }}>
          <div className="py-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-normal mb-3" style={{ color: "#16A34A" }}>Tributário</p>
            <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#111827", letterSpacing: "-0.03em" }}>Calculadora Simples Nacional</h1>
            <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>Calcule o DAS e a alíquota efetiva do Simples Nacional pelos Anexos I a V. Todos os valores usam as tabelas configuradas pelo administrador.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[440px_1fr] mb-12">
            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 className="font-semibold text-lg mb-5" style={{ color: "#111827" }}>Dados da empresa</h2>
              <div className="space-y-4">
                <SelectField label="Estado" value={estado} onChange={setEstado} options={ESTADO_OPTIONS} />
                <SelectField label="Anexo (atividade)" value={anexo} onChange={(v) => setAnexo(v as Anexo)} options={ANEXO_OPTIONS} />
                <CurrencyField
                  label="RBT12 (últimos 12 meses)"
                  value={rbt12Input}
                  onChange={setRbt12Input}
                  tooltip="Receita Bruta Total acumulada nos últimos 12 meses. Determina a faixa e a alíquota efetiva."
                />
                <CurrencyField
                  label="Receita bruta do mês"
                  value={receitaMesInput}
                  onChange={setReceitaMesInput}
                  tooltip="Valor total das vendas e serviços faturados no mês atual, sobre o qual o DAS será calculado."
                />
              </div>
              <button onClick={handleClear} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                <RotateCcw size={14} /> Limpar
              </button>
              {errorMsg && (
                <div className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm" style={{ background: "#FEF2F2", color: "#991B1B" }}>
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {errorMsg}
                </div>
              )}

              {result && (
                <StepByStep
                  rbt12={rbt12}
                  receitaMes={receitaMes}
                  faixaIndex={result.faixaIndex}
                  result={result}
                  anexo={anexo}
                />
              )}
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 className="font-semibold text-lg mb-6" style={{ color: "#111827" }}>Resultado</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Alíquota efetiva", value: result ? formatPct(result.aliquotaEfetiva) : "—", color: "#16A34A", size: "2xl" },
                  { label: "DAS a recolher", value: result ? `R$ ${formatBRL(result.valorDAS)}` : "—", color: "#111827", size: "xl" },
                  { label: "Alíquota nominal", value: result ? formatPct(result.aliquotaNominal) : "—", color: "#6B7280", size: "base" },
                  { label: "Receita líquida", value: result ? `R$ ${formatBRL(result.receitaLiquida)}` : "—", color: "#16A34A", size: "base" },
                  { label: "Parcela a deduzir", value: result ? `R$ ${formatBRL(result.parcelaADeduzir)}` : "—", color: "#6B7280", size: "base" },
                  { label: "Imposto por R$ 1.000", value: result ? `R$ ${formatBRL(result.impostosPorMil)}` : "—", color: "#111827", size: "base" },
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

              {result && (
                <div className="mt-2 text-center">
                  <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>
                    {FAIXA_LABELS[result.faixaIndex]} · {ANEXO_DESC[anexo]}
                  </span>
                </div>
              )}

              {!result && !errorMsg && (
                <div className="mt-4 text-center text-sm" style={{ color: "#9CA3AF" }}>
                  Preencha os campos ao lado para ver o resultado em tempo real.
                </div>
              )}
            </div>
          </div>

          <section className="mb-12">
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Perguntas frequentes</h2>
            <FaqList />
          </section>

          <section>
            <h2 className="font-semibold text-2xl mb-6" style={{ color: "#111827" }}>Ferramentas relacionadas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "ROI", route: "/roi", icon: <TrendingUp size={18} color="#16A34A" />, bg: "#DCFCE7" },
                { label: "Markup", route: "/markup", icon: <Tag size={18} color="#2563EB" />, bg: "#DBEAFE" },
                { label: "Capital de Giro", route: "/capital-de-giro", icon: <DollarSign size={18} color="#D97706" />, bg: "#FEF3C7" },
                { label: "Dashboard", route: "/gerencie", icon: <Receipt size={18} color="#7C3AED" />, bg: "#EDE9FE" },
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
