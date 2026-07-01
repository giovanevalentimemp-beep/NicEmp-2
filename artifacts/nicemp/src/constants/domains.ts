export const MAIN_DOMAIN =
  import.meta.env.VITE_MAIN_DOMAIN ?? "https://www.nicemp.com";

export const TOOLS_DOMAIN =
  import.meta.env.VITE_TOOLS_DOMAIN ?? "https://ferramentas.nicemp.com";

export const APP_DOMAIN =
  import.meta.env.VITE_APP_DOMAIN ?? "https://app.nicemp.com";

export const ACADEMY_DOMAIN =
  import.meta.env.VITE_ACADEMY_DOMAIN ?? "https://academy.nicemp.com";

export const API_DOMAIN =
  import.meta.env.VITE_API_DOMAIN ?? "https://api.nicemp.com";

export function buildUrl(domain: string, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${domain}${normalizedPath}`;
}
