import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" style={{ paddingTop: 92 }}>
        <div className="mx-auto" style={{ maxWidth: 760, padding: "48px 32px 80px" }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ letterSpacing: "-0.03em" }}>
            Termos de Uso
          </h1>
          <p className="text-sm text-slate-400 mb-10">Última atualização: julho de 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Aceitação dos termos</h2>
              <p>
                Ao acessar ou utilizar a plataforma <strong>Nicemp</strong>, você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Descrição do serviço</h2>
              <p>
                A Nicemp oferece ferramentas gratuitas e pagas de gestão financeira, tributária e empresarial para empreendedores brasileiros, incluindo calculadoras de ROI, Markup, Simples Nacional, e um painel de gestão executiva.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Cadastro e conta</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Você deve fornecer informações verdadeiras e atualizadas no cadastro.</li>
                <li>É responsável pela segurança da sua senha e conta.</li>
                <li>Notifique-nos imediatamente sobre qualquer uso não autorizado.</li>
                <li>Uma conta por pessoa; não é permitido compartilhar credenciais.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Uso permitido</h2>
              <p>Você pode usar a Nicemp para:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Realizar cálculos financeiros e tributários para uso próprio ou empresarial.</li>
                <li>Gerenciar informações financeiras do seu negócio.</li>
                <li>Acessar conteúdos educativos disponíveis na plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Uso proibido</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Usar a plataforma para fins ilegais ou não autorizados.</li>
                <li>Tentar acessar áreas restritas sem autorização.</li>
                <li>Reproduzir, distribuir ou criar obras derivadas sem autorização expressa.</li>
                <li>Realizar engenharia reversa ou scraping automatizado.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Precisão das informações</h2>
              <p>
                As ferramentas e calculadoras da Nicemp são disponibilizadas para fins informativos e educacionais. Os resultados não constituem assessoria fiscal, contábil ou jurídica. Consulte sempre um profissional habilitado antes de tomar decisões financeiras ou tributárias.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Propriedade intelectual</h2>
              <p>
                Todo o conteúdo da plataforma — incluindo textos, imagens, marcas, logos e software — é propriedade da Nicemp ou de seus licenciadores e está protegido pelas leis de propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">8. Limitação de responsabilidade</h2>
              <p>
                A Nicemp não se responsabiliza por decisões tomadas com base nas informações disponibilizadas na plataforma. O serviço é fornecido "como está", sem garantias de disponibilidade ininterrupta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">9. Encerramento de conta</h2>
              <p>
                Você pode encerrar sua conta a qualquer momento. A Nicemp pode suspender ou encerrar contas que violem estes Termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">10. Alterações nos termos</h2>
              <p>
                Podemos atualizar estes Termos periodicamente. O uso continuado da plataforma após as alterações implica aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">11. Lei aplicável</h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. O foro da comarca de São Paulo é eleito para dirimir quaisquer controvérsias.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">12. Contato</h2>
              <p>
                Dúvidas sobre estes Termos: <a href="mailto:contato@nicemp.com" className="text-green-600 hover:underline">contato@nicemp.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
