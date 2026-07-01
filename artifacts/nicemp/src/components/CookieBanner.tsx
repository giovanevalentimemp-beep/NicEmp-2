import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Link } from "wouter";

const STORAGE_KEY = "nicemp_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <div
        className="mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 px-6"
        style={{ maxWidth: 1280 }}
      >
        <Cookie size={20} className="shrink-0 mt-0.5 sm:mt-0" style={{ color: "#22C55E" }} />

        <p className="flex-1 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          Usamos cookies essenciais para o funcionamento da plataforma e, com seu consentimento, cookies analíticos para melhorar sua experiência — em conformidade com a{" "}
          <strong style={{ color: "rgba(255,255,255,0.9)" }}>LGPD (Lei nº 13.709/2018)</strong>.{" "}
          <Link href="/politica-de-privacidade" className="underline hover:opacity-80" style={{ color: "#22C55E" }}>
            Saiba mais
          </Link>
          .
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reject}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.5)", background: "transparent" }}
          >
            Rejeitar
          </button>
          <button
            onClick={accept}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#16A34A", color: "#fff" }}
          >
            Aceitar todos
          </button>
          <button
            onClick={reject}
            aria-label="Fechar"
            className="ml-1 p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
