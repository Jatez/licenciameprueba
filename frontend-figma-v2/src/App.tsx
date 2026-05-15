import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import DesignSystem from "./features/design-system";
import NotFound from "./pages/NotFound.tsx";
import { AppLayout } from "./shared/components/layout";
import { ProtectedRoute } from "./modules/auth/components/ProtectedRoute";
import { RoleGuard } from "./modules/auth/components/RoleGuard";

const Dashboard03 = lazy(() => import("./modules/packages/pages/Dashboard03Page"));
const Register = lazy(() => import("./modules/auth/pages/RegisterPage"));
const VerifyEmail = lazy(() => import("./modules/auth/pages/VerifyEmailPage"));
const InternalNotificationsSystem = lazy(() => import("./pages/InternalNotificationsSystem"));

const Landing = lazy(() => import("./pages/Landing"));
const Catalog = lazy(() => import("./modules/tracks/pages/CatalogPage"));
const TrackDetail = lazy(() => import("./modules/tracks/pages/TrackDetailPage"));
const LicensingNew = lazy(() => import("./modules/packages/pages/LicensingNewPage"));
const Licenses = lazy(() => import("./modules/packages/pages/LicensesPage"));
const LicenseDetail = lazy(() => import("./modules/packages/pages/LicenseDetailPage"));
const Monitoring = lazy(() => import("./modules/monitoring/pages/MonitoringPage"));
const Packages = lazy(() => import("./modules/packages/pages/PackagesPage"));
const PurchaseHistory = lazy(() => import("./modules/packages/pages/PurchaseHistoryPage"));
const PurchaseDetail = lazy(() => import("./modules/packages/pages/PurchaseDetailPage"));
const Social = lazy(() => import("./modules/social/pages/SocialPage"));
const Notifications = lazy(() => import("./modules/packages/pages/NotificationsPage"));
const Activity = lazy(() => import("./modules/packages/pages/ActivityPage"));
const ActivityHistory = lazy(() => import("./modules/packages/pages/ActivityHistoryPage"));
const PaymentResult = lazy(() => import("./modules/packages/components/PaymentResult"));
const MetricsOverview = lazy(() => import("./modules/monitoring/pages/MetricsOverviewPage"));
const MetricsPublicationDetail = lazy(() => import("./modules/monitoring/pages/MetricsPublicationDetailPage"));
const MetricsReportsHistory = lazy(() => import("./modules/monitoring/pages/MetricsReportsHistoryPage"));
const MatchTracksHub = lazy(() => import("./modules/monitoring/pages/MatchTracksHubPage"));
const MatchTracksSpotify = lazy(() => import("./modules/monitoring/pages/MatchTracksSpotifyPage"));
const MatchTracksSocial = lazy(() => import("./modules/monitoring/pages/MatchTracksSocialPage"));
const MatchTracksResults = lazy(() => import("./modules/monitoring/pages/MatchTracksResultsPage"));
const Login = lazy(() => import("./modules/auth/pages/LoginPage"));
const ForgotPassword = lazy(() => import("./modules/auth/pages/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("./modules/auth/pages/ResetPasswordPage"));
const Mfa = lazy(() => import("./modules/auth/pages/MfaPage"));
const AuthSuccess = lazy(() => import("./modules/auth/pages/AuthSuccessPage"));
const AccountLocked = lazy(() => import("./modules/auth/pages/AccountLockedPage"));
const SessionExpired = lazy(() => import("./modules/auth/pages/SessionExpiredPage"));
const AdminDashboard = lazy(() => import("./modules/admin/pages/AdminDashboardPage"));
const AdminCatalog = lazy(() => import("./modules/admin/pages/AdminCatalogPage"));
const AdminCompanies = lazy(() => import("./modules/admin/pages/AdminCompaniesPage"));
const AdminPricing = lazy(() => import("./modules/admin/pages/AdminPricingPage"));
const AdminLicenses = lazy(() => import("./modules/admin/pages/AdminLicensesPage"));
const AdminBilling = lazy(() => import("./modules/admin/pages/AdminBillingPage"));
const SettingsPage = lazy(() => import("./modules/settings/pages/SettingsPage"));
const AdminAudit = lazy(() => import("./modules/admin/pages/AdminAuditPage"));
const AdminAccess = lazy(() => import("./modules/admin/pages/AdminAccessPage"));
const AdminLayout = lazy(() =>
  import("./modules/admin").then((m) => ({ default: m.AdminLayout })),
);
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // No reintentar en errores 4xx (404, 401, 403, 422)
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

const lazyRoute = (node: React.ReactNode) => <Suspense fallback={null}>{node}</Suspense>;

// Shorthand for role-restricted routes — redirects to dashboard if denied
const roleRoute = (allow: string[], node: React.ReactNode) => (
  <RoleGuard allow={allow as never[]} fallback={<Navigate to="/dashboard03" replace />}>
    {node}
  </RoleGuard>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={lazyRoute(<Landing />)} />
          <Route path="/login" element={lazyRoute(<Login />)} />
          <Route path="/forgot-password" element={lazyRoute(<ForgotPassword />)} />
          <Route path="/reset-password" element={lazyRoute(<ResetPassword />)} />
          <Route path="/mfa" element={lazyRoute(<Mfa />)} />
          <Route path="/auth-success" element={lazyRoute(<AuthSuccess />)} />
          <Route path="/account-locked" element={lazyRoute(<AccountLocked />)} />
          <Route path="/session-expired" element={lazyRoute(<SessionExpired />)} />
          <Route path="/register" element={lazyRoute(<Register />)} />
          <Route path="/verify-email" element={lazyRoute(<VerifyEmail />)} />
          <Route path="/privacy" element={lazyRoute(<PrivacyPolicy />)} />
          <Route path="/terms" element={lazyRoute(<TermsOfService />)} />
          {/* Internal hidden route — no sidebar entry. Access only by typing the URL. */}
          <Route path="/_internal/sistema-notificaciones" element={lazyRoute(<InternalNotificationsSystem />)} />

          {/* Admin section (super_admin only — protected by MockAccessGuard inside AdminLayout) */}
          <Route path="/admin" element={lazyRoute(<AdminLayout />)}>
            <Route index element={lazyRoute(<AdminDashboard />)} />
            <Route path="catalog" element={lazyRoute(<AdminCatalog />)} />
            <Route path="companies" element={lazyRoute(<AdminCompanies />)} />
            <Route path="pricing" element={lazyRoute(<AdminPricing />)} />
            <Route path="licenses" element={lazyRoute(<AdminLicenses />)} />
            <Route path="billing" element={lazyRoute(<AdminBilling />)} />
            <Route path="audit" element={lazyRoute(<AdminAudit />)} />
            <Route path="access" element={lazyRoute(<AdminAccess />)} />
          </Route>

          {/* Design system — company_admin only */}
          <Route
            path="/design-system"
            element={
              <ProtectedRoute>
                {roleRoute(["company_admin"], <DesignSystem />)}
              </ProtectedRoute>
            }
          />

          {/* All main app routes — require authentication; AppLayout renders sidebar + outlet */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* All roles */}
            <Route path="/dashboard03" element={lazyRoute(<Dashboard03 />)} />
            <Route path="/catalog" element={lazyRoute(<Catalog />)} />
            <Route path="/catalog/track/:id" element={lazyRoute(<TrackDetail />)} />
            <Route path="/licensing/new" element={lazyRoute(<LicensingNew />)} />
            <Route path="/licenses" element={lazyRoute(<Licenses />)} />
            <Route path="/licenses/:id" element={lazyRoute(<LicenseDetail />)} />
            <Route path="/notifications" element={lazyRoute(<Notifications />)} />
            <Route path="/activity" element={lazyRoute(<Activity />)} />
            <Route path="/activity-history" element={lazyRoute(<ActivityHistory />)} />
            <Route path="/settings" element={lazyRoute(<SettingsPage />)} />

            {/* company_admin, manager, creator */}
            <Route path="/monitoring" element={roleRoute(["company_admin", "manager", "creator"], lazyRoute(<Monitoring />))} />
            <Route path="/social" element={roleRoute(["company_admin", "manager", "creator"], lazyRoute(<Social />))} />

            {/* company_admin, manager */}
            <Route path="/packages" element={roleRoute(["company_admin", "manager"], lazyRoute(<Packages />))} />
            <Route path="/packages/history" element={roleRoute(["company_admin", "manager"], lazyRoute(<PurchaseHistory />))} />
            <Route path="/packages/history/:id" element={roleRoute(["company_admin", "manager"], lazyRoute(<PurchaseDetail />))} />
            <Route path="/match-tracks" element={roleRoute(["company_admin", "manager"], lazyRoute(<MatchTracksHub />))} />
            <Route path="/match-tracks/spotify" element={roleRoute(["company_admin", "manager"], lazyRoute(<MatchTracksSpotify />))} />
            <Route path="/match-tracks/social" element={roleRoute(["company_admin", "manager"], lazyRoute(<MatchTracksSocial />))} />
            <Route path="/match-tracks/results" element={roleRoute(["company_admin", "manager"], lazyRoute(<MatchTracksResults />))} />

            {/* company_admin, manager, auditor */}
            <Route path="/metricas" element={roleRoute(["company_admin", "manager", "auditor"], lazyRoute(<MetricsOverview />))} />
            <Route path="/metricas/publicaciones/:id" element={roleRoute(["company_admin", "manager", "auditor"], lazyRoute(<MetricsPublicationDetail />))} />
            <Route path="/metricas/reportes" element={roleRoute(["company_admin", "manager", "auditor"], lazyRoute(<MetricsReportsHistory />))} />
          </Route>

          <Route path="/metrics" element={<Navigate to="/metricas" replace />} />

          {/* Wompi payment result — public route (no auth required, Wompi redirects here) */}
          <Route path="/payment/result" element={<Suspense fallback={null}><PaymentResult /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
