import { AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { routes } from "@/constants/routes";

export function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-28">
        <section
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center"
          style={{ border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "#FEE2E2" }}>
            <AlertCircle size={22} color="#DC2626" />
          </div>
          <h1 className="mb-3 text-2xl font-bold" style={{ color: "#111827" }}>
            Página não encontrada
          </h1>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
            O endereço acessado não está disponível. Volte para as ferramentas e continue sua análise.
          </p>
          <a
            href={routes.toolsHome}
            className="inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#16A34A", color: "white" }}
          >
            Ver ferramentas
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
