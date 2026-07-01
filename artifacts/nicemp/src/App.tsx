import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { HeroSection } from "@/components/HeroSection";
import { ToolsSection } from "@/components/ToolsSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { BlogSection } from "@/components/BlogSection";
import { PremiumSection } from "@/components/PremiumSection";
import { BusinessSolutionsSection } from "@/components/BusinessSolutionsSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { LoginPage } from "@/pages/auth/LoginPage";
import { AuthCallbackPage } from "@/pages/auth/AuthCallbackPage";
import { CompleteCpfPage } from "@/pages/auth/CompleteCpfPage";
import { DashboardPage } from "@/pages/manage/DashboardPage";
import { ProfilePage } from "@/pages/manage/ProfilePage";
import { CompaniesPage } from "@/pages/manage/CompaniesPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { ROICalculator } from "@/pages/ROICalculator";
import { MarkupCalculator } from "@/pages/MarkupCalculator";
import { SimplesNacionalCalculator } from "@/pages/SimplesNacionalCalculator";
import { ToolsHome } from "@/pages/ToolsHome";
import { LearnPage } from "@/pages/LearnPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { NotFound } from "@/pages/not-found";

const queryClient = new QueryClient();

function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ToolsSection />
      <SolutionsSection />
      <BlogSection />
      <PremiumSection />
      <BusinessSolutionsSection />
      <Footer />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/entrar" component={LoginPage} />
      <Route path="/criar-conta" component={LoginPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/completar-cpf" component={CompleteCpfPage} />

      <Route path="/ferramentas" component={ToolsHome} />
      <Route path="/roi" component={ROICalculator} />
      <Route path="/markup" component={MarkupCalculator} />
      <Route path="/impostos/simples-nacional" component={SimplesNacionalCalculator} />

      <Route path="/aprenda">
        <LearnPage />
      </Route>
      <Route path="/aprenda/:slug">
        <ArticlePage />
      </Route>

      <Route path="/gerencie">
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      </Route>
      <Route path="/gerencie/perfil">
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      </Route>
      <Route path="/gerencie/empresas">
        <ProtectedRoute><CompaniesPage /></ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
