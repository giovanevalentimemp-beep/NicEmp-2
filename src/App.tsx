import { DashboardPage } from "@/pages/manage/DashboardPage";
import LearnPage from "@/pages/LearnPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ToolsSection } from "@/components/ToolsSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { BlogSection } from "@/components/BlogSection";
import { PremiumSection } from "@/components/PremiumSection";
import { BusinessSolutionsSection } from "@/components/BusinessSolutionsSection";
import { Footer } from "@/components/Footer";
import { ROICalculator } from "@/pages/ROICalculator";
import { MarkupCalculator } from "@/pages/MarkupCalculator";
import { SimplesNacionalCalculator } from "@/pages/SimplesNacionalCalculator";
import { ToolsHome } from "@/pages/ToolsHome";
import { NotFound } from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { AdminPage } from "@/pages/admin/AdminPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage";
import { CompleteCpfPage } from "@/pages/auth/CompleteCpfPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ProfilePage } from "@/pages/manage/ProfilePage";
import { CompaniesPage } from "@/pages/manage/CompaniesPage";

const queryClient = new QueryClient();

function DrePage() {
  return <div>DRE</div>;
}

function CashflowPage() {
  return <div>Fluxo de Caixa</div>;
}

function IndicatorsPage() {
  return <div>Indicadores</div>;
}



function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <main>
        <HeroSection />
        <ToolsSection />
        <SolutionsSection />
        <BlogSection />
        <PremiumSection />
        <BusinessSolutionsSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/entrar" component={LoginPage} />
          <Route path="/criar-conta" component={LoginPage} />
          <Route path="/auth/callback" component={AuthCallbackPage} />
          <Route path="/completar-cpf" component={CompleteCpfPage} />
          <Route path="/admin">
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          </Route>
          <Route path="/gerencie">
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </Route>
          <Route path="/gerencie/dre">
            <ProtectedRoute>
               <DrePage />
            </ProtectedRoute>
          </Route>
          <Route path="/gerencie/fluxo-de-caixa">
            <ProtectedRoute>
              <CashflowPage />
            </ProtectedRoute>
          </Route>
          <Route path="/gerencie/indicadores">
            <ProtectedRoute>
              <IndicatorsPage />
            </ProtectedRoute>
          </Route>
          <Route path="/gerencie/perfil">
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </Route>

          <Route path="/gerencie/empresas">
            <ProtectedRoute>
              <CompaniesPage />
            </ProtectedRoute>
          </Route>  
          <Route path="/aprenda/:slug" component={ArticlePage} />
          <Route path="/aprenda" component={LearnPage} />
          <Route path="/roi" component={ROICalculator} />
          <Route path="/markup" component={MarkupCalculator} />
          <Route path="/impostos/simples-nacional" component={SimplesNacionalCalculator} />
          <Route path="/ferramentas" component={ToolsHome} />
          <Route path="/" component={LandingPage} />
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
