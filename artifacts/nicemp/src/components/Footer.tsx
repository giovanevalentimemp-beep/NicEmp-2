import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { routes } from "@/constants/routes";

const columns = [
  {
    title: "Ferramentas",
    links: [
      { label: "Todas as ferramentas", href: routes.toolsHome },
      { label: "Financeiro", href: routes.roi },
      { label: "Tributário", href: routes.simplesNacional },
      { label: "Trabalhistas", href: routes.academy },
      { label: "Importação", href: routes.academy },
    ],
  },
  {
    title: "Gerencie",
    links: [
      { label: "DRE", href: routes.manage },
      { label: "Fluxo de Caixa", href: routes.manage },
      { label: "Dashboard", href: routes.manage },
      { label: "Metas", href: routes.manage },
      { label: "Relatórios", href: routes.manage },
    ],
  },
  {
    title: "Aprenda",
    links: [
      { label: "Blog", href: routes.academy },
      { label: "Guias", href: routes.academy },
      { label: "Planilhas", href: routes.academy },
      { label: "Podcasts", href: routes.academy },
      { label: "Cursos", href: routes.academy },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "Contabilidade", href: routes.solutions },
      { label: "Certificado Digital", href: routes.solutions },
      { label: "Crédito", href: routes.solutions },
      { label: "Consultoria", href: routes.solutions },
      { label: "Parceiros", href: routes.solutions },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: routes.about },
      { label: "Contato", href: routes.about },
      { label: "Trabalhe conosco", href: routes.about },
      { label: "Política de Privacidade", href: routes.privacy },
      { label: "Termos de Uso", href: routes.terms },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: routes.home, icon: Instagram },
  { label: "YouTube", href: routes.home, icon: Youtube },
  { label: "LinkedIn", href: routes.home, icon: Linkedin },
  { label: "Facebook", href: routes.home, icon: Facebook },
];

export function Footer() {
  return (
    <footer style={{ background: "#0F172A" }}>
      <div className="mx-auto pt-16 pb-10" style={{ maxWidth: 1280, padding: "64px 32px 40px" }}>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="white" />
                <path d="M7 9L14 6L21 9V14C21 18.4 17.5 21.8 14 23C10.5 21.8 7 18.4 7 14V9Z" fill="#0F172A" />
              </svg>
              <span className="font-bold text-lg text-white">nicemp</span>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              Plataforma de ferramentas e conteúdo para quem quer empreender e fazer seu negócio crescer.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                  data-testid={`social-icon-${label.toLowerCase()}`}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4 text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 text-center text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
        >
          © 2026 Nicemp. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
