import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/services/auth/auth-service";
import { useEffect, useState } from "react";
import { routes } from "@/constants/routes";
import logoIcon from "@assets/image_1782828858926.png";
import logoWordmark from "@assets/image_1782828891724.png";

export function Header() {
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Início", href: routes.home },
    { label: "Ferramentas", href: routes.toolsHome },
    ...(user ? [{ label: "Painel", href: routes.manage }] : []),
    { label: "Aprenda", href: routes.academy },
    { label: "Soluções", href: routes.solutions },
    { label: "Planos", href: routes.plans },
    { label: "Sobre", href: routes.about },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}
      style={{ height: 72, borderBottom: "1px solid #E5E7EB" }}
    >
      <div className="mx-auto flex h-full items-center justify-between" style={{ maxWidth: 1280, padding: "0 32px" }}>
        <a className="flex flex-shrink-0 items-center gap-2.5" data-testid="logo" href={routes.home}>
          <img src={logoIcon} alt="Nicemp logo" className="h-9 w-9 object-contain" />
          <img src={logoWordmark} alt="NICEMP" className="h-6 object-contain" style={{ maxWidth: 120 }} />
        </a>

        <nav className="hidden items-center gap-6 md:flex" data-testid="main-nav">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative pb-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <a
                href={routes.login}
                className="hidden rounded-xl border px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-gray-50 sm:inline-flex"
                style={{ borderColor: "#E5E7EB" }}
              >
                Entrar
              </a>
              <a
                href={routes.signUp}
                className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#16A34A" }}
              >
                Criar conta grátis
              </a>
            </>
          ) : (
            <>
              <div className="hidden text-right md:block">
                <div className="text-sm font-semibold text-slate-900">
                  {profile?.nome || user?.email?.split("@")[0] || "Usuário"}
                </div>
                <div className="text-xs text-slate-500">
                  {profile?.email || user?.email}
                </div>
              </div>
              <a href="/gerencie/empresas" className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">Empresas</a>
              <a href="/gerencie/perfil" className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">Perfil</a>
              <button
                onClick={async () => { await signOut(); window.location.href = "/"; }}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
