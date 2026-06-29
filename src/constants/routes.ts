import {
ACADEMY_DOMAIN,
APP_DOMAIN,
MAIN_DOMAIN,
TOOLS_DOMAIN,
buildUrl,
} from "@/constants/domains";

export const routes = {
home: "/",

toolsHome: "/ferramentas",

login: "/entrar",

signUp: "/criar-conta",

authCallback: "/auth/callback",

completeCpf: "/completar-cpf",

academy: "/aprenda",

academyArticle: "/aprenda/:slug",

manage: "/gerencie",

manageDre: "/gerencie/dre",

manageCashflow: "/gerencie/fluxo-de-caixa",

manageIndicators: "/gerencie/indicadores",

admin: "/admin",

solutions: buildUrl(MAIN_DOMAIN, "/solucoes"),

plans: buildUrl(MAIN_DOMAIN, "/planos"),

about: buildUrl(MAIN_DOMAIN, "/sobre"),

privacy: buildUrl(
MAIN_DOMAIN,
"/politica-de-privacidade"
),

terms: buildUrl(
MAIN_DOMAIN,
"/termos-de-uso"
),

roi: "/roi",

markup: "/markup",

simplesNacional:
"/impostos/simples-nacional",
} as const;
