# Licénciame — API Contract (v2)

> Source of truth for the future backend. Frontend already consumes these
> shapes against mocks (`src/api/mocks/`). When backend is ready, only
> `src/api/http.ts` interceptors and the body of each `endpoints/*.ts`
> change — types and consumer code stay identical.
>
> Base URL: `/api/v2`
> Auth: `Authorization: Bearer <accessToken>` on every request except
> `auth/*` and `health`.
> Errors: every non-2xx returns `ApiError { code, message, field? }`.

Type names below match `src/shared/types/index.ts` and `src/api/types.ts`.

---

## Auth (`src/api/endpoints/auth.ts`)

| Method | Path                           | Request                       | Response                       |
|--------|--------------------------------|-------------------------------|--------------------------------|
| POST   | `/auth/register`               | `RegisterRequest`             | `RegisterResponse`             |
| POST   | `/auth/verify-email`           | `VerifyEmailRequest`          | `VerifyEmailResponse`          |
| POST   | `/auth/resend-verification`    | `ResendVerificationRequest`   | `ResendVerificationResponse`   |
| GET    | `/auth/me`                     | —                             | `User`                         |
| POST   | `/auth/onboarding/complete`    | `CompleteOnboardingRequest`   | `CompleteOnboardingResponse`   |
| POST   | `/auth/onboarding/skip`        | —                             | `SkipOnboardingResponse`       |
| GET    | `/auth/onboarding/steps`       | —                             | `OnboardingStep[]`             |

## Catalog / Tracks (`src/api/endpoints/catalog.ts`)

| Method | Path                              | Request                | Response                |
|--------|-----------------------------------|------------------------|-------------------------|
| GET    | `/catalog/tracks`                 | `CatalogPageRequest` (qs) | `CatalogPageResponse` |
| GET    | `/catalog/tracks/:id`             | —                      | `TrackDetailResponse`   |
| GET    | `/catalog/tracks/:id/similar`     | —                      | `TrackSummary[]`        |
| POST   | `/catalog/tracks/:id/favorite`    | `ToggleFavoriteRequest`| `ToggleFavoriteResponse`|

## Licensing (`src/api/endpoints/licensing.ts`)

| Method | Path                              | Request                       | Response                        |
|--------|-----------------------------------|-------------------------------|---------------------------------|
| GET    | `/licensing/usage-types`          | —                             | `UsageTypeCatalog`              |
| GET    | `/licensing/terms`                | —                             | `LicensingTermsResponse`        |
| POST   | `/licensing/validate`             | `LicensingValidationRequest`  | `LicensingValidationResponse`   |
| POST   | `/licensing/issue`                | `IssueLicenseRequest`         | `IssueLicenseResponse`          |
| GET    | `/licenses`                       | `ListLicensesRequest` (qs)    | `ListLicensesResponse`          |
| GET    | `/licenses/:id`                   | —                             | `License`                       |
| POST   | `/licenses/:id/cancel`            | `CancelLicenseRequest`        | `CancelLicenseResponse`         |

## Packages / Wallet / Billing (`src/api/endpoints/packages.ts`, `billing.ts`)

| Method | Path                              | Request                       | Response                        |
|--------|-----------------------------------|-------------------------------|---------------------------------|
| GET    | `/packages`                       | —                             | `CreditPackage[]`               |
| GET    | `/wallet/summary`                 | —                             | `WalletSummary`                 |
| GET    | `/wallet/bags`                    | —                             | `CreditBag[]`                   |
| POST   | `/quotes`                         | `CreateQuoteRequest`          | `Quote`                         |
| POST   | `/purchases`                      | `CreatePurchaseRequest`       | `Purchase`                      |
| GET    | `/purchases`                      | `PurchaseHistoryFilters` (qs) | `PaginatedResponse<Purchase>`   |
| GET    | `/purchases/:id`                  | —                             | `Purchase`                      |
| GET    | `/billing/profile`                | —                             | `BillingProfile`                |
| PUT    | `/billing/profile`                | `BillingProfile`              | `BillingProfile`                |

## Dashboard (`src/api/endpoints/dashboard.ts`, `dashboardV2.ts`)

| Method | Path                              | Request                       | Response                        |
|--------|-----------------------------------|-------------------------------|---------------------------------|
| GET    | `/dashboard`                      | —                             | `DashboardData`                 |
| GET    | `/dashboard/v2`                   | `{ period: PeriodPreset }`    | `DashboardDataV2`               |

## Social Accounts (`src/api/endpoints/social.ts`)

| Method | Path                              | Request                       | Response                        |
|--------|-----------------------------------|-------------------------------|---------------------------------|
| GET    | `/social/accounts`                | —                             | `SocialAccount[]`               |
| POST   | `/social/connect`                 | `ConnectAccountRequest`       | `SocialAccount`                 |
| POST   | `/social/accounts/:id/reconnect`  | —                             | `SocialAccount`                 |
| DELETE | `/social/accounts/:id`            | —                             | `{ success: true }`             |
| POST   | `/social/accounts/:id/primary`    | —                             | `SocialAccount`                 |

## Monitoring / Tracking (`src/api/endpoints/tracking.ts`)

| Method | Path                              | Request                       | Response                        |
|--------|-----------------------------------|-------------------------------|---------------------------------|
| GET    | `/monitoring/posts`               | `DetectedPostsRequest` (qs)   | `PaginatedResponse<DetectedPost>` + aggregates |
| GET    | `/monitoring/posts/:id`           | —                             | `DetectedPost`                  |
| POST   | `/monitoring/posts/manual-link`   | `ManualLinkRequest`           | `ManualLinkResponse`            |
| POST   | `/monitoring/posts/:id/unlink`    | `UnlinkPostRequest`           | `UnlinkPostResponse`            |
| GET    | `/monitoring/sync-status`         | —                             | `TrackingSyncStatus`            |
| POST   | `/monitoring/sync`                | `{ platform: SocialPlatform }`| `TrackingSyncStatus`            |

## Activity (`src/api/endpoints/activity.ts`)

| Method | Path                  | Request                | Response                      |
|--------|-----------------------|------------------------|-------------------------------|
| GET    | `/activity`           | `ActivityListParams`   | `ActivityListResponse`        |
| GET    | `/activity/actors`    | —                      | `{ user_id, user_name }[]`    |

## Metrics (`src/modules/monitoring/metrics`)

| Method | Path                              | Request                | Response                        |
|--------|-----------------------------------|------------------------|---------------------------------|
| GET    | `/metrics/overview`               | `MetricsFilter` (qs)   | `MetricsOverview`               |
| GET    | `/metrics/publications`           | `MetricsFilter`+page   | `PaginatedResponse<PublicationMetric>` |
| GET    | `/metrics/publications/:id`       | —                      | `PublicationMetric`             |
| GET    | `/metrics/top-tracks`             | `MetricsFilter`+limit  | `MetricsTopTrack[]`             |
| GET    | `/metrics/credits-by-type`        | `MetricsFilter`        | `CreditsByUseType[]`            |
| POST   | `/metrics/reports`                | `ReportConfig`         | `ReportJob`                     |
| GET    | `/metrics/reports/:id`            | —                      | `ReportJob`                     |

---

## Conventions

- **IDs**: server-generated UUIDs (string). Client-generated IDs for
  optimistic updates are prefixed `tmp_`.
- **Timestamps**: ISO-8601 strings (`2026-05-05T10:30:00.000Z`).
- **Money**: integer COP (no decimals). Field suffix `Cop`.
- **Credits**: integer.
- **Pagination**: every list endpoint accepts `page` (1-based) and
  `pageSize` (25 | 50 | 100) and returns `PaginatedResponse<T>`.
- **Filters**: passed as JSON-encoded query strings for arrays/objects;
  scalar filters as plain query params.
- **Errors**: HTTP status drives high-level handling; `ApiError.code`
  drives field-level UX. See `AuthErrorCode`, `CatalogErrorCode`,
  `LicensingErrorCode`, `CancellationErrorCode` in `src/api/types.ts`.

## Migration steps for the backend team

1. Implement endpoints above. Match request/response shapes exactly.
2. Replace `mockDelay()` calls in `src/api/endpoints/*.ts` with
   `http.<method>(...)` from `src/api/http.ts`.
3. Delete `src/api/mocks/`.
4. No component/hook should need changes — they consume typed endpoints
   via React Query hooks (`['packages']`, `['monitoring-posts', filters]`,
   etc.). Query keys are kebab-case arrays.
