import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white" style={{ paddingTop: 92 }}>
        <div className="mx-auto" style={{ maxWidth: 760, padding: "48px 32px 80px" }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ letterSpacing: "-0.03em" }}>
            Política de Privacidade
          </h1>
          <p className="text-sm text-slate-400 mb-10">Última atualização: julho de 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Quem somos</h2>
              <p>
                A <strong>Nicemp</strong> é uma plataforma de ferramentas financeiras, tributárias e de gestão voltada para empreendedores brasileiros. Estamos comprometidos com a proteção dos seus dados pessoais em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Dados que coletamos</h2>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Dados de cadastro:</strong> nome, e-mail e CPF fornecidos no momento do registro.</li>
                <li><strong>Dados de uso:</strong> páginas visitadas, ferramentas utilizadas e tempo de sessão, coletados de forma agregada para melhorar a plataforma.</li>
                <li><strong>Dados de autenticação:</strong> informações de login via Google OAuth gerenciadas pelo Supabase.</li>
                <li><strong>Cookies técnicos:</strong> necessários para o funcionamento correto do site (autenticação e preferências).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Finalidade do tratamento</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Fornecer acesso às ferramentas e funcionalidades da plataforma.</li>
                <li>Personalizar a experiência do usuário.</li>
                <li>Enviar comunicações relevantes (quando autorizado).</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Base legal</h2>
              <p>
                O tratamento dos seus dados é realizado com base no <strong>consentimento</strong> (art. 7º, I da LGPD), na <strong>execução de contrato</strong> (art. 7º, V) e no <strong>legítimo interesse</strong> da Nicemp (art. 7º, IX), sempre respeitando os seus direitos como titular.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Compartilhamento de dados</h2>
              <p>
                Não vendemos seus dados pessoais. Podemos compartilhá-los somente com:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Prestadores de serviço tecnológico (ex: Supabase) que atuam como operadores sob nosso controle.</li>
                <li>Autoridades competentes, quando exigido por lei.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Seus direitos</h2>
              <p>Conforme a LGPD, você tem direito a:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Confirmar a existência de tratamento de dados.</li>
                <li>Acessar, corrigir ou excluir seus dados.</li>
                <li>Revogar o consentimento a qualquer momento.</li>
                <li>Portabilidade dos dados.</li>
                <li>Reclamação perante a ANPD.</li>
              </ul>
              <p className="mt-3">Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@nicemp.com" className="text-green-600 hover:underline">privacidade@nicemp.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Cookies</h2>
              <p>
                Utilizamos cookies estritamente necessários para o funcionamento da plataforma e, quando consentido, cookies analíticos para entender como os usuários interagem com o site. Você pode gerenciar suas preferências de cookies a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">8. Segurança</h2>
              <p>
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">9. Alterações nesta política</h2>
              <p>
                Esta política pode ser atualizada periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou aviso na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contato</h2>
              <p>
                <strong>Controlador:</strong> Nicemp Ferramentas<br />
                <strong>E-mail do Encarregado (DPO):</strong> <a href="mailto:privacidade@nicemp.com" className="text-green-600 hover:underline">privacidade@nicemp.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
