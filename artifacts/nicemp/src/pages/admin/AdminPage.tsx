import { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft, Building2, Calculator, ChevronDown, ChevronRight,
  DollarSign, FileText, Plus, RotateCcw,
  Save, Settings, ShieldCheck, Tags, TrendingUp, Users,
  X, Trash2, Pencil, Eye, Clock, CheckCircle2,
  Calendar, Wallet, Newspaper, BarChart2,
} from "lucide-react";
import { AppLayout, PageContainer, PageHeader } from "@/components/ds/AppLayout";
import { MetricCard } from "@/components/ds/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import {
  loadToolSettings, saveToolSettings, resetToolSettings,
  type ToolSettings, type MarkupExample, type RoiExample,
} from "@/lib/tool-settings";
import type { Faixa } from "@/lib/simples-nacional/types";
import {
  loadPosts, savePost, deletePost as localDeletePost, newPost, slugify,
  loadCategories, addCategory, removeCategory,
  type Post, type PostStatus,
} from "@/lib/cms-storage";
import {
  apiFetchPosts, apiSavePost, apiDeletePost,
  apiFetchCategories, apiAddCategory, apiDeleteCategory,
  apiFetchAnalytics, type Analytics,
} from "@/lib/cms-api";

// ─── Tool config helpers ──────────────────────────────────────────────────────

const FAIXA_LABEL = (i: number) =>
  ["1ª faixa", "2ª faixa", "3ª faixa", "4ª faixa", "5ª faixa", "6ª faixa"][i] ?? `Faixa ${i + 1}`;

const ANEXO_NAMES: Record<string, string> = {
  I: "Anexo I — Comércio",
  II: "Anexo II — Indústria",
  III: "Anexo III — Serviços (academia, lab, viagens...)",
  IV: "Anexo IV — Serviços (construção, limpeza...)",
  V: "Anexo V — Serviços (consultoria, publicidade...)",
};

function SaveBar({ onSave, onReset, saved }: { onSave: () => void; onReset: () => void; saved: boolean }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <p className="text-sm text-slate-500">Alterações ficam salvas localmente no navegador.</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Restaurar padrões
        </Button>
        <Button size="sm" onClick={onSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>
          <Save className="h-4 w-4" /> {saved ? "Salvo!" : "Salvar configurações"}
        </Button>
      </div>
    </div>
  );
}

function AnexoEditor({ anexo, faixas, onChange }: { anexo: string; faixas: Faixa[]; onChange: (f: Faixa[]) => void }) {
  const [open, setOpen] = useState(false);
  const update = (idx: number, field: keyof Faixa, raw: string) => {
    const next = faixas.map((f, i) => {
      if (i !== idx) return f;
      if (raw === "Infinity") return { ...f, [field]: Infinity };
      const val = parseFloat(raw.replace(",", "."));
      return { ...f, [field]: Number.isFinite(val) ? val : f[field] };
    });
    onChange(next);
  };
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium text-sm text-slate-800">{ANEXO_NAMES[anexo]}</span>
        {open ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Faixa</TableHead>
                <TableHead>Receita Inicial (R$)</TableHead>
                <TableHead>Limite RBT12 (R$)</TableHead>
                <TableHead>Alíquota Nominal</TableHead>
                <TableHead>Parcela a Deduzir (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faixas.map((faixa, i) => {
                const prevLimit = i === 0 ? 0 : faixas[i - 1].limiteRbt12;
                return (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium text-slate-600">{FAIXA_LABEL(i)}</TableCell>
                    <TableCell className="text-xs text-slate-400">{prevLimit === Infinity ? "—" : `R$ ${prevLimit.toLocaleString("pt-BR")}`}</TableCell>
                    <TableCell><Input className="h-8 w-36 text-xs" defaultValue={faixa.limiteRbt12 === Infinity ? "Infinity" : String(faixa.limiteRbt12)} onBlur={(e) => update(i, "limiteRbt12", e.target.value)} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input className="h-8 w-24 text-xs" defaultValue={(faixa.aliquotaNominal * 100).toFixed(2)} onBlur={(e) => { const pct = parseFloat(e.target.value.replace(",", ".")); if (Number.isFinite(pct)) onChange(faixas.map((f, j) => j === i ? { ...f, aliquotaNominal: pct / 100 } : f)); }} />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                    </TableCell>
                    <TableCell><Input className="h-8 w-32 text-xs" defaultValue={String(faixa.parcelaADeduzir)} onBlur={(e) => update(i, "parcelaADeduzir", e.target.value)} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function SimplesConfig({ settings, onChange }: { settings: ToolSettings; onChange: (s: ToolSettings) => void }) {
  const updateAnexo = (anexo: string, faixas: Faixa[]) =>
    onChange({ ...settings, simplesAnexos: { ...settings.simplesAnexos, [anexo]: faixas } });
  return (
    <div className="space-y-3 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Tabelas de Faixas — Simples Nacional</h3>
        <p className="text-sm text-slate-500 mt-1">Edite limites, alíquotas (em %) e parcelas a deduzir de cada faixa.</p>
      </div>
      <div className="space-y-2">
        {["I", "II", "III", "IV", "V"].map((a) => (
          <AnexoEditor key={a} anexo={a} faixas={settings.simplesAnexos[a] ?? []} onChange={(f) => updateAnexo(a, f)} />
        ))}
      </div>
    </div>
  );
}

function MarkupConfig({ settings, onChange }: { settings: ToolSettings; onChange: (s: ToolSettings) => void }) {
  const ms = settings.markupSettings;
  const exs = settings.markupExamples;
  const updateSetting = (key: keyof typeof ms, val: string) => {
    const num = parseFloat(val.replace(",", "."));
    onChange({ ...settings, markupSettings: { ...ms, [key]: Number.isFinite(num) ? num : ms[key] } });
  };
  const updateExample = (i: number, field: keyof MarkupExample, val: string) => {
    const next = exs.map((ex, j) => j !== i ? ex : { ...ex, [field]: field === "titulo" ? val : parseFloat(val.replace(",", ".")) || 0 });
    onChange({ ...settings, markupExamples: next });
  };
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Parâmetros padrão</h3>
        <div className="grid grid-cols-3 gap-4 mt-3">
          {[{ label: "Margem padrão (%)", key: "margemPadrao" as const, val: ms.margemPadrao }, { label: "Despesas padrão (%)", key: "despesasPadrao" as const, val: ms.despesasPadrao }, { label: "Casas decimais", key: "decimais" as const, val: ms.decimais }].map(({ label, key, val }) => (
            <div key={key}><label className="block text-xs font-medium text-slate-600 mb-1">{label}</label><Input className="h-8 text-sm" defaultValue={String(val)} onBlur={(e) => updateSetting(key, e.target.value)} /></div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Exemplos por setor</h3>
          <Button variant="outline" size="sm" onClick={() => onChange({ ...settings, markupExamples: [...exs, { titulo: "Novo setor", custo: 100, despesas: 20, margem: 25 }] })}><Plus className="h-4 w-4" /> Adicionar</Button>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Custo (R$)</TableHead><TableHead>Despesas (%)</TableHead><TableHead>Margem (%)</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
          <TableBody>
            {exs.map((ex, i) => (
              <TableRow key={i}>
                <TableCell><Input className="h-8 text-xs" defaultValue={ex.titulo} onBlur={(e) => updateExample(i, "titulo", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 w-24 text-xs" defaultValue={String(ex.custo)} onBlur={(e) => updateExample(i, "custo", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 w-20 text-xs" defaultValue={String(ex.despesas)} onBlur={(e) => updateExample(i, "despesas", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 w-20 text-xs" defaultValue={String(ex.margem)} onBlur={(e) => updateExample(i, "margem", e.target.value)} /></TableCell>
                <TableCell><button type="button" onClick={() => onChange({ ...settings, markupExamples: exs.filter((_, j) => j !== i) })} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RoiConfig({ settings, onChange }: { settings: ToolSettings; onChange: (s: ToolSettings) => void }) {
  const rs = settings.roiSettings;
  const exs = settings.roiExamples;
  const updateSetting = (key: keyof typeof rs, val: string | boolean) => onChange({ ...settings, roiSettings: { ...rs, [key]: val } });
  const updateExample = (i: number, field: keyof RoiExample, val: string) => {
    const next = exs.map((ex, j) => j !== i ? ex : { ...ex, [field]: field === "titulo" ? val : parseFloat(val.replace(",", ".")) || 0 });
    onChange({ ...settings, roiExamples: next });
  };
  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Parâmetros e exibição</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-xs font-medium text-slate-600 mb-1">Casas decimais</label><Input className="h-8 text-sm" defaultValue={String(rs.decimais)} onBlur={(e) => onChange({ ...settings, roiSettings: { ...rs, decimais: parseInt(e.target.value) || 2 } })} /></div>
        </div>
        <div className="space-y-2">
          {([["exibirROIPct", "Exibir ROI %"], ["exibirLucro", "Exibir Lucro / Prejuízo"], ["exibirMultiplo", "Exibir Múltiplo do investimento"]] as [keyof typeof rs, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={rs[key] as boolean} onChange={(e) => updateSetting(key, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-green-600" />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Exemplos práticos</h3>
          <Button variant="outline" size="sm" onClick={() => onChange({ ...settings, roiExamples: [...exs, { titulo: "Novo exemplo", invest: 1000, retorno: 1500 }] })}><Plus className="h-4 w-4" /> Adicionar</Button>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Investimento (R$)</TableHead><TableHead>Retorno (R$)</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
          <TableBody>
            {exs.map((ex, i) => (
              <TableRow key={i}>
                <TableCell><Input className="h-8 text-xs" defaultValue={ex.titulo} onBlur={(e) => updateExample(i, "titulo", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 w-28 text-xs" defaultValue={String(ex.invest)} onBlur={(e) => updateExample(i, "invest", e.target.value)} /></TableCell>
                <TableCell><Input className="h-8 w-28 text-xs" defaultValue={String(ex.retorno)} onBlur={(e) => updateExample(i, "retorno", e.target.value)} /></TableCell>
                <TableCell><button type="button" onClick={() => onChange({ ...settings, roiExamples: exs.filter((_, j) => j !== i) })} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

type ToolKey = "simples" | "markup" | "roi" | null;

interface ToolCardDef {
  key: ToolKey;
  icon: React.ReactNode;
  title: string;
  description: string;
  configured: boolean;
}

const TOOL_CARDS: ToolCardDef[] = [
  { key: "simples", icon: <Building2 className="h-5 w-5 text-green-700" />, title: "Simples Nacional", description: "Tabelas de faixas, alíquotas e parcelas a deduzir dos Anexos I a V.", configured: true },
  { key: "markup",  icon: <Calculator className="h-5 w-5 text-blue-600" />, title: "Calculadora de Markup", description: "Parâmetros padrão, casas decimais e exemplos por setor.", configured: true },
  { key: "roi",     icon: <TrendingUp className="h-5 w-5 text-purple-600" />, title: "Calculadora de ROI", description: "Opções de exibição, casas decimais e exemplos práticos.", configured: true },
  { key: null, icon: <FileText className="h-5 w-5 text-slate-400" />, title: "DRE", description: "Configurações do Demonstrativo de Resultados.", configured: false },
  { key: null, icon: <Wallet className="h-5 w-5 text-slate-400" />, title: "Capital de Giro", description: "Parâmetros e taxas para a calculadora de capital de giro.", configured: false },
  { key: null, icon: <DollarSign className="h-5 w-5 text-slate-400" />, title: "Fluxo de Caixa", description: "Parâmetros do fluxo de caixa e projeções.", configured: false },
];

const TOOL_TITLE: Record<string, string> = { simples: "Simples Nacional", markup: "Markup", roi: "ROI" };

function ToolConfigPanel({ toolKey, settings, onChange }: { toolKey: Exclude<ToolKey, null>; settings: ToolSettings; onChange: (s: ToolSettings) => void }) {
  if (toolKey === "simples") return <SimplesConfig settings={settings} onChange={onChange} />;
  if (toolKey === "markup")  return <MarkupConfig  settings={settings} onChange={onChange} />;
  if (toolKey === "roi")     return <RoiConfig     settings={settings} onChange={onChange} />;
  return null;
}

// ─── Analytics panel ──────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  const fmtDate = (iso: string) => {
    const [, , d] = iso.split("-");
    return d;
  };
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group" title={`${d.date}: ${d.views} leituras`}>
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${Math.max(4, (d.views / max) * 52)}px`,
              background: d.views === 0 ? "#F1F5F9" : "#16A34A",
              opacity: d.views === 0 ? 0.4 : 1,
            }}
          />
          <span className="text-[10px] text-slate-400 leading-none">{fmtDate(d.date)}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel({ analytics, onRefresh }: { analytics: Analytics | null; onRefresh: () => void }) {
  if (!analytics) {
    return (
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-6 flex items-center gap-3 text-sm text-slate-400">
          <BarChart2 size={16} /> Carregando analytics...
        </CardContent>
      </Card>
    );
  }

  const maxViews = Math.max(...analytics.topPosts.map((p) => p.views), 1);

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart2 size={18} /> Analytics de Leitura
        </CardTitle>
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          Atualizar
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Leituras hoje", value: analytics.viewsToday, color: "#0EA5E9" },
            { label: "Últimos 7 dias", value: analytics.viewsLast7Days, color: "#8B5CF6" },
            { label: "Total histórico", value: analytics.totalViews, color: "#16A34A" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold" style={{ color }}>{value.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Leituras por dia (7 dias)</p>
          <MiniBarChart data={analytics.viewsByDay} />
        </div>

        {analytics.topPosts.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Artigos mais lidos</p>
            <div className="space-y-3">
              {analytics.topPosts.map((post, idx) => (
                <div key={post.postId} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-300 shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <a
                        href={`/aprenda/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-800 hover:text-green-600 transition-colors truncate"
                      >
                        {post.title}
                      </a>
                      <span className="text-xs font-semibold text-slate-600 ml-2 shrink-0">
                        {post.views} {post.views === 1 ? "leitura" : "leituras"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(post.views / maxViews) * 100}%`,
                          background: idx === 0 ? "#16A34A" : idx === 1 ? "#0EA5E9" : "#8B5CF6",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.topPosts.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            Nenhuma leitura registrada ainda. As leituras são contabilizadas quando visitantes acessam um artigo.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Category Manager ─────────────────────────────────────────────────────────

function CategoryManager({ categories, onAdd, onRemove }: {
  categories: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}) {
  const [newName, setNewName] = useState("");

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onAdd(trimmed);
    setNewName("");
  }

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2"><Tags size={18} /> Categorias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            className="h-9"
            placeholder="Nome da nova categoria..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Nenhuma categoria criada.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700">
                {cat}
                <button
                  type="button"
                  onClick={() => { if (confirm(`Remover categoria "${cat}"?`)) onRemove(cat); }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── CMS ──────────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PostStatus, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  Publicado: { bg: "#DCFCE7", color: "#15803D", label: "Publicado", icon: <CheckCircle2 size={12} /> },
  Agendado:  { bg: "#DBEAFE", color: "#1D4ED8", label: "Agendado",  icon: <Clock size={12} /> },
  Rascunho:  { bg: "#F1F5F9", color: "#475569", label: "Rascunho",  icon: <FileText size={12} /> },
};

function StatusBadge({ status }: { status: PostStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      {s.icon} {s.label}
    </span>
  );
}

function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

interface PostEditorProps {
  initial: Post | null;
  categories: string[];
  onSaved: (posts: Post[]) => void;
  onCancel: () => void;
  onAddCategory: (name: string) => void;
}

function PostEditor({ initial, categories, onSaved, onCancel, onAddCategory }: PostEditorProps) {
  const isNew = !initial?.id || initial.id === "";
  const [post, setPost] = useState<Post>(initial ?? newPost());
  const [notice, setNotice] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(post.scheduledAt ? post.scheduledAt.slice(0, 16) : "");
  const [newCatName, setNewCatName] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);

  const set = (field: keyof Post, value: string) =>
    setPost((p) => ({ ...p, [field]: value }));

  const handleTitleChange = (v: string) => {
    setPost((p) => ({
      ...p,
      title: v,
      slug: p.slug === "" || p.slug === slugify(p.title) ? slugify(v) : p.slug,
      metaTitle: p.metaTitle === "" || p.metaTitle === p.title ? v : p.metaTitle,
    }));
  };

  function validate(): string | null {
    if (!post.title.trim()) return "Título é obrigatório.";
    if (!post.slug.trim()) return "Slug é obrigatório.";
    if (!post.content.trim()) return "Conteúdo é obrigatório.";
    return null;
  }

  async function doSave(status: PostStatus, scheduledAt?: string) {
    const err = validate();
    if (err) { setNotice({ type: "err", msg: err }); return; }
    const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.round(wordCount / 200))} min`;
    const toSave: Post = {
      ...post, status, readingTime,
      scheduledAt: scheduledAt ?? (status === "Agendado" ? post.scheduledAt : ""),
      publishedAt: status === "Publicado" ? (post.publishedAt || new Date().toISOString()) : post.publishedAt,
    };
    const updatedLocal = savePost(toSave);
    setPost(toSave);
    try { await apiSavePost(toSave); } catch { /* localStorage is fallback */ }
    setNotice({ type: "ok", msg: status === "Publicado" ? "Artigo publicado!" : status === "Agendado" ? "Artigo agendado!" : "Rascunho salvo!" });
    setTimeout(() => setNotice(null), 3000);
    onSaved(updatedLocal);
  }

  function handleScheduleConfirm() {
    if (!scheduleDate) { setNotice({ type: "err", msg: "Selecione uma data e hora para agendar." }); return; }
    setScheduleModal(false);
    doSave("Agendado", new Date(scheduleDate).toISOString());
  }

  function handleAddCategory() {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    set("category", trimmed);
    setNewCatName("");
    setShowNewCat(false);
  }

  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const approxReadTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} /> Artigos
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-900">{isNew ? "Novo artigo" : post.title || "Sem título"}</span>
          <StatusBadge status={post.status} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => doSave("Rascunho")} className="text-slate-600">
            <Save className="h-4 w-4" /> Salvar rascunho
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            if (!post.slug) { setNotice({ type: "err", msg: "Adicione um título/slug antes de pré-visualizar." }); return; }
            savePost({ ...post, updatedAt: new Date().toISOString() });
            window.open(`/aprenda/${post.slug}?preview=1`, "_blank");
          }}>
            <Eye className="h-4 w-4" /> Pré-visualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setScheduleModal(true)}>
            <Calendar className="h-4 w-4" /> Agendar
          </Button>
          <Button size="sm" onClick={() => doSave("Publicado")} className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4" /> Publicar
          </Button>
        </div>
      </div>

      {notice && (
        <div className={`mx-6 mt-4 rounded-xl px-4 py-3 text-sm font-medium ${notice.type === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {notice.msg}
        </div>
      )}

      <div className="flex gap-6 p-6 flex-1">
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <FormField label="Título" required>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xl font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-green-400/40 transition-shadow placeholder:font-normal placeholder:text-slate-400"
              placeholder="Título do artigo..."
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </FormField>

          <FormField label="Subtítulo / Lead">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-green-400/40 transition-shadow placeholder:text-slate-400"
              placeholder="Uma frase que resume o artigo..."
              value={post.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </FormField>

          <FormField label="Conteúdo" required>
            <div className="rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-green-400/40 transition-shadow">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2">
                <span className="text-xs font-medium text-slate-500">Markdown</span>
                <span className="ml-auto text-xs text-slate-400">{wordCount} palavras · ~{approxReadTime} min de leitura</span>
              </div>
              <textarea
                className="w-full resize-none px-4 py-4 text-sm leading-relaxed text-slate-800 bg-white outline-none font-mono"
                style={{ minHeight: 420 }}
                placeholder={`## Subtítulo\n\nEscreva o conteúdo em Markdown.\n\nUse **negrito**, *itálico*, [links](url) e listas.\n\nPara imagens no texto:\n![descrição da imagem](https://url-da-imagem.com)\n\nPara múltiplas imagens, adicione uma por linha.`}
                value={post.content}
                onChange={(e) => set("content", e.target.value)}
                spellCheck
              />
            </div>
          </FormField>

          <FormField label="Imagem de capa (URL)" hint="Recomendado: 1200×630 px (proporção 16:9). Máx. 2 MB. Cole a URL pública da imagem. Para imagens adicionais dentro do texto, use: ![descrição](url)">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400/40 transition-shadow placeholder:text-slate-400"
              placeholder="https://..."
              value={post.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
            />
            {post.coverImage && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-50">
                <img src={post.coverImage} alt="Capa" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </FormField>

          <FormField label="Vídeo YouTube (URL ou ID)" hint="Aparece ao final do artigo.">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400/40 transition-shadow placeholder:text-slate-400"
              placeholder="https://youtube.com/watch?v=... ou apenas o ID"
              value={post.videoYoutube}
              onChange={(e) => set("videoYoutube", e.target.value)}
            />
          </FormField>
        </div>

        <div className="w-72 shrink-0 flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Publicação</h3>

            <FormField label="Categoria">
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-green-400/40 appearance-none bg-white"
                value={post.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Selecionar...</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {showNewCat ? (
                <div className="flex gap-1.5 mt-1">
                  <input className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-green-400/40" placeholder="Nova categoria..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} autoFocus />
                  <button type="button" onClick={handleAddCategory} className="px-2 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">OK</button>
                  <button type="button" onClick={() => { setShowNewCat(false); setNewCatName(""); }} className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-700"><X size={12} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowNewCat(true)} className="text-xs text-green-600 hover:underline text-left">+ Nova categoria</button>
              )}
            </FormField>

            <FormField label="Slug">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 font-mono outline-none focus:ring-2 focus:ring-green-400/40" placeholder="slug-do-artigo" value={post.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
            </FormField>

            <FormField label="Tags (separadas por vírgula)">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400/40 placeholder:text-slate-400" placeholder="roi, indicadores, finanças" value={post.tags.join(", ")} onChange={(e) => setPost((p) => ({ ...p, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))} />
            </FormField>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">SEO</h3>
            <FormField label="Meta title">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400/40 placeholder:text-slate-400" placeholder="Título para Google..." value={post.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
              <span className="text-xs text-slate-400 text-right">{post.metaTitle.length}/60</span>
            </FormField>
            <FormField label="Meta description">
              <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-green-400/40 placeholder:text-slate-400" rows={3} placeholder="Descrição para Google..." value={post.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
              <span className="text-xs text-slate-400 text-right">{post.metaDescription.length}/160</span>
            </FormField>
            <FormField label="Resumo (excerpt)">
              <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-green-400/40 placeholder:text-slate-400" rows={2} placeholder="Trecho exibido nas listagens..." value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
            </FormField>
          </div>

          {post.scheduledAt && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 flex items-center gap-2">
              <Clock size={14} /> Agendado para {new Date(post.scheduledAt).toLocaleString("pt-BR")}
            </div>
          )}
          {post.publishedAt && post.status === "Publicado" && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 size={14} /> Publicado em {new Date(post.publishedAt).toLocaleString("pt-BR")}
            </div>
          )}
        </div>
      </div>

      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Calendar size={16} /> Agendar publicação</h3>
            <p className="text-sm text-slate-500">Selecione a data e hora em que o artigo será publicado automaticamente.</p>
            <input type="datetime-local" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400/40" value={scheduleDate} min={new Date().toISOString().slice(0, 16)} onChange={(e) => setScheduleDate(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setScheduleModal(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleScheduleConfirm} className="bg-blue-600 hover:bg-blue-700">Confirmar agendamento</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Post list ────────────────────────────────────────────────────────────────

function PostList({ posts, viewCounts, onNew, onEdit, onDelete }: {
  posts: Post[];
  viewCounts: Map<string, number>;
  onNew: () => void;
  onEdit: (p: Post) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<PostStatus | "Todos">("Todos");
  const filtered = filter === "Todos" ? posts : posts.filter((p) => p.status === filter);
  const counts = {
    Todos: posts.length,
    Publicado: posts.filter((p) => p.status === "Publicado").length,
    Agendado: posts.filter((p) => p.status === "Agendado").length,
    Rascunho: posts.filter((p) => p.status === "Rascunho").length,
  };

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2"><Newspaper size={18} /> Artigos</CardTitle>
        <Button size="sm" onClick={onNew}><Plus className="h-4 w-4" /> Novo artigo</Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 mb-4 border-b border-slate-100">
          {(["Todos", "Publicado", "Agendado", "Rascunho"] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setFilter(tab)} className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${filter === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}>
              {tab} <span className="ml-1 opacity-60">({counts[tab]})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Nenhum artigo {filter !== "Todos" ? `com status "${filter}"` : ""} encontrado.<br />
            <button type="button" onClick={onNew} className="mt-2 text-green-600 font-medium hover:underline">Criar o primeiro</button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="w-28">Categoria</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-28 text-right">Leituras</TableHead>
                <TableHead className="w-36">Data</TableHead>
                <TableHead className="w-20 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => {
                const views = viewCounts.get(post.id) ?? 0;
                return (
                  <TableRow key={post.id} className="group">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{post.title || <span className="italic text-slate-400">Sem título</span>}</p>
                        {post.subtitle && <p className="text-xs text-slate-400 truncate max-w-xs">{post.subtitle}</p>}
                        {post.slug && <p className="text-xs text-slate-300 font-mono">/{post.slug}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{post.category || "—"}</TableCell>
                    <TableCell><StatusBadge status={post.status} /></TableCell>
                    <TableCell className="text-right">
                      {views > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <Eye size={11} className="text-slate-400" /> {views.toLocaleString("pt-BR")}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {post.status === "Publicado" && post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("pt-BR")
                        : post.status === "Agendado" && post.scheduledAt
                        ? new Date(post.scheduledAt).toLocaleDateString("pt-BR")
                        : new Date(post.updatedAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <button type="button" onClick={() => onEdit(post)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => { if (confirm(`Excluir "${post.title || "este artigo"}"?`)) onDelete(post.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type AdminView = { section: "home" } | { section: "tool"; tool: Exclude<ToolKey, null> } | { section: "cms-edit"; post: Post };

export function AdminPage() {
  const { signOut, localAdmin } = useAuth();
  const [settings, setSettings]     = useState<ToolSettings>(loadToolSettings);
  const [posts, setPosts]           = useState<Post[]>(() => loadPosts());
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [analytics, setAnalytics]   = useState<Analytics | null>(null);
  const [saved, setSaved]           = useState(false);
  const [view, setView]             = useState<AdminView>({ section: "home" });

  const loadAnalytics = useCallback(() => {
    apiFetchAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  useEffect(() => {
    apiFetchPosts().then(setPosts).catch(() => {});
    apiFetchCategories().then(setCategories).catch(() => {});
    loadAnalytics();
  }, [loadAnalytics]);

  const handleSaveSettings = useCallback(() => {
    saveToolSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [settings]);

  const handleResetSettings = useCallback(() => {
    setSettings(resetToolSettings());
  }, []);

  function handleDeletePost(id: string) {
    const updated = localDeletePost(id);
    setPosts(updated);
    apiDeletePost(id).catch(() => {});
  }

  function handleAddCategory(name: string) {
    const updated = addCategory(name);
    setCategories(updated);
    apiAddCategory(name).catch(() => {});
  }

  function handleRemoveCategory(name: string) {
    const updated = removeCategory(name);
    setCategories(updated);
    apiDeleteCategory(name).catch(() => {});
  }

  // Build view counts map from analytics
  const viewCounts = new Map<string, number>(
    (analytics?.topPosts ?? []).map((p) => [p.postId, p.views])
  );

  const pubCount   = posts.filter((p) => p.status === "Publicado").length;
  const draftCount = posts.filter((p) => p.status === "Rascunho").length;

  return (
    <AppLayout>
      <PageContainer className="pb-20">
        <div className="flex items-center justify-between">
          <PageHeader eyebrow="Admin" title="Painel administrativo" description="Gerencie ferramentas, artigos e configurações da plataforma." />
          {localAdmin && <Button variant="outline" size="sm" onClick={signOut} className="shrink-0">Sair</Button>}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Artigos publicados" value={String(pubCount)} helper={`${draftCount} rascunho${draftCount !== 1 ? "s" : ""}`} icon={Newspaper} />
          <MetricCard label="Leituras hoje" value={String(analytics?.viewsToday ?? "—")} helper="Artigos acessados" icon={Eye} />
          <MetricCard label="Leituras (7 dias)" value={String(analytics?.viewsLast7Days ?? "—")} helper="Últimos 7 dias" icon={BarChart2} />
          <MetricCard label="Total de leituras" value={String(analytics?.totalViews ?? "—")} helper="Histórico completo" icon={TrendingUp} />
        </div>

        <div className="mt-10 space-y-6">

          {view.section === "home" && (
            <>
              <AnalyticsPanel analytics={analytics} onRefresh={loadAnalytics} />

              <h2 className="text-lg font-bold text-slate-900">Ferramentas</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {TOOL_CARDS.map((tool) => (
                  <Card key={tool.title} className={`rounded-xl border-slate-200 shadow-sm transition-shadow ${tool.configured ? "hover:shadow-md cursor-pointer" : "opacity-60"}`} onClick={() => tool.key && setView({ section: "tool", tool: tool.key })}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">{tool.icon}</div>
                        {tool.configured ? <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Configurável</span> : <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Em breve</span>}
                      </div>
                      <h3 className="mt-3 font-semibold text-slate-900">{tool.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{tool.description}</p>
                      {tool.configured && <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-700"><Settings size={12} /> Configurar</div>}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <CategoryManager categories={categories} onAdd={handleAddCategory} onRemove={handleRemoveCategory} />

              <PostList
                posts={posts}
                viewCounts={viewCounts}
                onNew={() => setView({ section: "cms-edit", post: newPost() })}
                onEdit={(p) => setView({ section: "cms-edit", post: p })}
                onDelete={handleDeletePost}
              />
            </>
          )}

          {view.section === "tool" && (
            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 bg-white">
                <button type="button" onClick={() => setView({ section: "home" })} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  <ArrowLeft size={16} /> Início
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-semibold text-slate-900">{TOOL_TITLE[view.tool]}</span>
              </div>
              <SaveBar onSave={handleSaveSettings} onReset={handleResetSettings} saved={saved} />
              <ToolConfigPanel toolKey={view.tool} settings={settings} onChange={setSettings} />
            </Card>
          )}

          {view.section === "cms-edit" && (
            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
              <PostEditor
                initial={view.post}
                categories={categories}
                onSaved={(updated) => { setPosts(updated); }}
                onCancel={() => setView({ section: "home" })}
                onAddCategory={handleAddCategory}
              />
            </Card>
          )}
        </div>
      </PageContainer>
    </AppLayout>
  );
}
