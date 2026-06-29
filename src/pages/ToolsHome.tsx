import { Calculator, Receipt, Search, TrendingUp, Wallet } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ToolCard } from "@/components/ToolCard";

const groups = [
  {
    title: "Mais utilizadas",
    description: "As ferramentas mais acessadas pelos empreendedores.",
    tools: [
      { title: "ROI", description: "Retorno sobre investimento.", href: "/roi", icon: TrendingUp, popular: true },
      { title: "Markup", description: "Precificacao de produtos.", href: "/markup", icon: Calculator, popular: true },
      { title: "Simples Nacional", description: "Calculo do DAS e aliquota efetiva.", href: "/impostos/simples-nacional", icon: Receipt, popular: true },
      { title: "Capital de Giro", description: "Capital necessario para operar.", href: "/capital-de-giro", icon: Wallet, popular: true },
    ],
  },
  {
    title: "Financeiro",
    description: "Ferramentas para analise financeira, precificacao e gestao.",
    tools: [
      { title: "ROI", description: "Retorno sobre investimento.", href: "/roi" },
      { title: "Markup", description: "Precificacao de produtos.", href: "/markup" },
      { title: "Capital de Giro", description: "Capital necessario para operar.", href: "/capital-de-giro" },
      { title: "Margem de Lucro", description: "Margem bruta e liquida.", href: "/margem-de-lucro", comingSoon: true },
      { title: "Fluxo de Caixa", description: "Controle financeiro do negocio.", href: "/fluxo-de-caixa", comingSoon: true },
      { title: "Ponto de Equilibrio", description: "Break-even da empresa.", href: "/ponto-de-equilibrio", comingSoon: true },
    ],
  },
  {
    title: "Gestao",
    description: "Ferramentas para analise e tomada de decisao.",
    tools: [
      { title: "DRE Simplificado", description: "Demonstrativo de Resultado do Exercicio.", href: "/dre", comingSoon: true },
      { title: "DRE Completo", description: "Analise financeira avancada.", href: "/dre-completo", comingSoon: true },
      { title: "Dashboard Financeiro", description: "Indicadores financeiros da empresa.", href: "/dashboard", comingSoon: true },
    ],
  },
];

export function ToolsHome() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-36">
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-8">
            <div className="max-w-3xl">
              <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
                Ferramentas para fazer seu negocio crescer.
              </h1>
              <p className="mb-10 text-xl leading-relaxed text-slate-500">
                Ferramentas gratuitas para gestao financeira, impostos, RH e planejamento empresarial.
              </p>
              <div className="relative max-w-2xl">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Pesquise uma ferramenta..."
                  className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </div>
        </section>

        {groups.map((group, index) => (
          <section key={group.title} className={index % 2 ? "bg-white py-20" : "pb-20"}>
            <div className="mx-auto max-w-7xl px-8">
              <h2 className="mb-3 text-3xl font-bold text-slate-900">{group.title}</h2>
              <p className="mb-8 text-slate-500">{group.description}</p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <ToolCard key={`${group.title}-${tool.title}`} {...tool} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="pb-28">
          <div className="mx-auto max-w-7xl px-8">
            <div className="rounded-[32px] bg-slate-900 px-12 py-16 text-center">
              <h2 className="mb-5 text-4xl font-bold text-white">Estamos apenas comecando.</h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
                A NICEMP esta construindo um ecossistema completo de ferramentas, conteudo e solucoes.
              </p>
              <div className="inline-flex rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white">
                Mais de 50 ferramentas em desenvolvimento
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
