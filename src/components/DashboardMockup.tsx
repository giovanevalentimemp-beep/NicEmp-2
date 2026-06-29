import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Home, LayoutDashboard, FileText, TrendingUp, Wrench, BarChart2, Target, Settings } from "lucide-react";

const revenueData = [
  { m: "Jan", v: 22 }, { m: "Fev", v: 30 }, { m: "Mar", v: 28 },
  { m: "Abr", v: 35 }, { m: "Mai", v: 32 }, { m: "Jun", v: 48 },
];

const pieData = [
  { name: "Marketing", value: 35, color: "#16A34A" },
  { name: "Operação", value: 25, color: "#2563EB" },
  { name: "Produto", value: 20, color: "#7C3AED" },
  { name: "Financeiro", value: 10, color: "#D97706" },
  { name: "Outros", value: 10, color: "#E5E7EB" },
];

const navItems = [
  { icon: <Home size={13} />, label: "Início" },
  { icon: <LayoutDashboard size={13} />, label: "Dashboard", active: true },
  { icon: <FileText size={13} />, label: "DRE" },
  { icon: <TrendingUp size={13} />, label: "Fluxo de Caixa" },
  { icon: <Wrench size={13} />, label: "Ferramentas" },
  { icon: <BarChart2 size={13} />, label: "Relatórios" },
  { icon: <Target size={13} />, label: "Metas" },
  { icon: <Settings size={13} />, label: "Configurações" },
];

const topCards = [
  { label: "Receita Total", value: "R$ 48.250,00", change: "+13,9% vs mês anterior", up: true },
  { label: "Lucro Líquido", value: "R$ 12.580,00", change: "+6,2% vs mês anterior", up: true },
  { label: "Despesas", value: "R$ 23.450,00", change: "-3,1% vs mês anterior", up: false },
  { label: "Margem de lucro", value: "26,08%", change: "+2,4% vs mês anterior", up: true },
];

export function DashboardMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
        border: "1px solid #E5E7EB",
        background: "#fff",
        maxWidth: 580,
        marginLeft: "auto",
      }}
    >
      <div className="flex" style={{ height: 420 }}>
        {/* Sidebar */}
        <div
          className="flex flex-col py-3 flex-shrink-0"
          style={{ width: 130, background: "#0F172A", gap: 2 }}
        >
          <div className="flex items-center gap-1.5 px-3 pb-2 mb-1">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="white" />
              <path d="M7 9L14 6L21 9V14C21 18.4 17.5 21.8 14 23C10.5 21.8 7 18.4 7 14V9Z" fill="#0F172A" />
            </svg>
            <span className="text-white font-bold text-xs">nicemp</span>
          </div>

          {navItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer"
              style={{
                background: item.active ? "rgba(255,255,255,0.1)" : "transparent",
                color: item.active ? "white" : "rgba(255,255,255,0.55)",
                fontSize: 11,
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F8FAFC" }}>
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 bg-white"
            style={{ borderBottom: "1px solid #E5E7EB" }}
          >
            <span className="font-semibold text-xs" style={{ color: "#111827" }}>
              Resumo do seu negócio
            </span>
            <span className="text-xs" style={{ color: "#6B7280" }}>Este mês</span>
          </div>

          {/* Metric cards row */}
          <div className="grid grid-cols-4 gap-0 flex-shrink-0" style={{ borderBottom: "1px solid #E5E7EB" }}>
            {topCards.map((c) => (
              <div key={c.label} className="px-3 py-2.5 bg-white" style={{ borderRight: "1px solid #E5E7EB" }}>
                <div className="text-xs mb-0.5" style={{ color: "#6B7280", fontSize: 9 }}>{c.label}</div>
                <div className="font-bold" style={{ color: "#111827", fontSize: 10, lineHeight: 1.3 }}>{c.value}</div>
                <div className="text-xs" style={{ color: c.up ? "#16A34A" : "#EF4444", fontSize: 8 }}>
                  {c.up ? "▲" : "▼"} {c.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Line chart */}
            <div className="flex-1 px-3 pt-2 pb-1">
              <div className="text-xs font-semibold mb-1" style={{ color: "#111827", fontSize: 9 }}>
                Evolução da Receita
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{ fontSize: 8, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, border: "1px solid #E5E7EB" }}
                    formatter={(v: number) => [`R$ ${v}k`, "Receita"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#16A34A"
                    strokeWidth={1.5}
                    fill="url(#grad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut chart */}
            <div className="flex-shrink-0 px-3 pt-2 pb-1" style={{ width: 130 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#111827", fontSize: 9 }}>
                Despesas por categoria
              </div>
              <PieChart width={110} height={80}>
                <Pie
                  data={pieData}
                  cx={55}
                  cy={40}
                  innerRadius={25}
                  outerRadius={38}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="mt-1 space-y-0.5">
                {pieData.slice(0, 3).map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                      <span style={{ fontSize: 7, color: "#6B7280" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 7, color: "#111827", fontWeight: 600 }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
