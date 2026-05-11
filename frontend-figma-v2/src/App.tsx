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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={lazyRoute(<Landing />)} />
          <Route path="/login" element={lazyRoute(<Login />)} />
          <Route path="/forgot-password" element={lazyRoute(<ForgotPassword />)} />
          <Route path="/reset-password" element={lazyRoute(<ResetPassword />)} />
          <Route path="/mfa" element={lazyRoute(<Mfa />)} />
          <Route path="/auth-success" element={lazyRoute(<AuthSuccess />)} />
          <Route path="/account-locked" element={lazyRoute(<AccountLocked />)} />
          <Route path="/session-expired" element={lazyRoute(<SessionExpired />)} />
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
          <Route path="/register" element={lazyRoute(<Register />)} />
          <Route path="/verify-email" element={lazyRoute(<VerifyEmail />)} />
          
          <Route path="/design-system" element={<DesignSystem />} />
          {/* Internal hidden route — no sidebar entry. Access only by typing the URL. */}
          <Route path="/_internal/sistema-notificaciones" element={lazyRoute(<InternalNotificationsSystem />)} />
          <Route path="/dashboard03" element={<AppLayout />}>
            <Route index element={lazyRoute(<Dashboard03 />)} />
          </Route>
          <Route path="/catalog" element={<AppLayout />}>
            <Route index element={lazyRoute(<Catalog />)} />
            <Route path="track/:id" element={lazyRoute(<TrackDetail />)} />
          </Route>
          <Route path="/licensing/new" element={<AppLayout />}>
            <Route index element={lazyRoute(<LicensingNew />)} />
          </Route>
          <Route path="/licenses" element={<AppLayout />}>
            <Route index element={lazyRoute(<Licenses />)} />
            <Route path=":id" element={lazyRoute(<LicenseDetail />)} />
          </Route>
          <Route path="/monitoring" element={<AppLayout />}>
            <Route index element={lazyRoute(<Monitoring />)} />
          </Route>
          <Route path="/packages" element={<AppLayout />}>
            <Route index element={lazyRoute(<Packages />)} />
            <Route path="history" element={lazyRoute(<PurchaseHistory />)} />
            <Route path="history/:id" element={lazyRoute(<PurchaseDetail />)} />
          </Route>
          <Route path="/social" element={<AppLayout />}>
            <Route index element={lazyRoute(<Social />)} />
          </Route>
          <Route path="/notifications" element={<AppLayout />}>
            <Route index element={lazyRoute(<Notifications />)} />
          </Route>
          <Route path="/activity" element={<AppLayout />}>
            <Route index element={lazyRoute(<Activity />)} />
          </Route>
          <Route path="/activity-history" element={<AppLayout />}>
            <Route index element={lazyRoute(<ActivityHistory />)} />
          </Route>
          <Route path="/match-tracks" element={<AppLayout />}>
            <Route index element={lazyRoute(<MatchTracksHub />)} />
            <Route path="spotify" element={lazyRoute(<MatchTracksSpotify />)} />
            <Route path="social" element={lazyRoute(<MatchTracksSocial />)} />
            <Route path="results" element={lazyRoute(<MatchTracksResults />)} />
          </Route>
          <Route path="/metricas" element={<AppLayout />}>
            <Route index element={lazyRoute(<MetricsOverview />)} />
            <Route path="publicaciones/:id" element={lazyRoute(<MetricsPublicationDetail />)} />
            <Route path="reportes" element={lazyRoute(<MetricsReportsHistory />)} />
          </Route>
          <Route path="/settings" element={<AppLayout />}>
            <Route index element={lazyRoute(<SettingsPage />)} />
          </Route>
          <Route path="/metrics" element={<Navigate to="/metricas" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
