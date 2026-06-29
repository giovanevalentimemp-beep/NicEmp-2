import { useEffect } from "react";
import { TOOLS_DOMAIN, buildUrl } from "@/constants/domains";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  schema: Record<string, unknown>;
}

export function Seo({ title, description, path, schema }: SeoProps) {
  useEffect(() => {
    const canonicalUrl = buildUrl(TOOLS_DOMAIN, path);
    document.title = title;

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", "website", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setCanonical(canonicalUrl);
    setSchema({ ...schema, url: canonicalUrl });

    return () => {
      document.querySelector("#page-schema")?.remove();
    };
  }, [description, path, schema, title]);

  return null;
}

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(href: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
}

function setSchema(schema: Record<string, unknown>) {
  document.querySelector("#page-schema")?.remove();

  const script = document.createElement("script");
  script.id = "page-schema";
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}
