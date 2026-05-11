import type {
  ApiError,
  AuthTokens,
  Company,
  OnboardingStep,
  User,
} from "../types";

// ─── Companies ───────────────────────────────────────────────────────────────

export const mockCompanyDualtee: Company = {
  id: "co_01HXYZDUALTEE",
  name: "Marketing Dualtee SAS",
  countryCode: "CO",
  createdAt: "2025-04-15T14:32:00.000Z",
};

// ─── Users ───────────────────────────────────────────────────────────────────

const baseUser = {
  id: "usr_01HXYZADMIN001",
  email: "andrea@dualtee.co",
  fullName: "Andrea Restrepo",
  role: "company_admin" as const,
  companyId: mockCompanyDualtee.id,
  createdAt: "2025-04-15T14:32:00.000Z",
};

/** Just registered, email not yet confirmed, onboarding not started. */
export const mockUserAdmin: User = {
  ...baseUser,
  emailVerified: false,
  onboardingCurrentStep: 0,
  onboardingCompleted: false,
  onboardingSkipped: false,
};

/** Email confirmed, onboarding not started. */
export const mockUserVerified: User = {
  ...baseUser,
  emailVerified: true,
  onboardingCurrentStep: 0,
  onboardingCompleted: false,
  onboardingSkipped: false,
};

/** Halfway through onboarding. */
export const mockUserOnboardingMid: User = {
  ...baseUser,
  emailVerified: true,
  onboardingCurrentStep: 2,
  onboardingCompleted: false,
  onboardingSkipped: false,
};

/** Onboarding completed. */
export const mockUserOnboardingDone: User = {
  ...baseUser,
  emailVerified: true,
  onboardingCurrentStep: 4,
  onboardingCompleted: true,
  onboardingSkipped: false,
};

/** Onboarding skipped (still step 4 but flagged as skipped). */
export const mockUserOnboardingSkipped: User = {
  ...baseUser,
  emailVerified: true,
  onboardingCurrentStep: 4,
  onboardingCompleted: false,
  onboardingSkipped: true,
};

// ─── Tokens ──────────────────────────────────────────────────────────────────

export const mockTokensPair: AuthTokens = {
  accessToken: "mock.access.eyJ1c3IiOiJ1c3JfMDFIWFlaQURNSU4wMDEifQ",
  refreshToken: "mock.refresh.eyJ1c3IiOiJ1c3JfMDFIWFlaQURNSU4wMDEifQ",
};

// ─── Onboarding steps ────────────────────────────────────────────────────────

export const mockOnboardingSteps: OnboardingStep[] = [
  {
    id: "explore-catalog",
    order: 1,
    titleKey: "onboarding.steps.explore-catalog.title",
    descriptionKey: "onboarding.steps.explore-catalog.description",
    ctaRouteOnFinish: "/catalog",
  },
  {
    id: "buy-credits",
    order: 2,
    titleKey: "onboarding.steps.buy-credits.title",
    descriptionKey: "onboarding.steps.buy-credits.description",
    ctaRouteOnFinish: "/wallet/credits",
  },
  {
    id: "connect-social",
    order: 3,
    titleKey: "onboarding.steps.connect-social.title",
    descriptionKey: "onboarding.steps.connect-social.description",
    ctaRouteOnFinish: "/integrations/social",
  },
];

// ─── Error helpers ───────────────────────────────────────────────────────────

export const errEmailExists = (): ApiError => ({
  code: "EMAIL_ALREADY_EXISTS",
  message: "Este email ya está registrado.",
  field: "email",
});

export const errPasswordTooShort = (): ApiError => ({
  code: "PASSWORD_TOO_SHORT",
  message: "La contraseña debe tener al menos 8 caracteres.",
  field: "password",
});

export const errInvalidCountry = (): ApiError => ({
  code: "INVALID_COUNTRY_CODE",
  message: "Código de país inválido.",
  field: "countryCode",
});

export const errInvalidEmail = (): ApiError => ({
  code: "INVALID_EMAIL",
  message: "Email inválido.",
  field: "email",
});

export const errTermsNotAccepted = (): ApiError => ({
  code: "TERMS_NOT_ACCEPTED",
  message: "Debes aceptar los términos.",
  field: "acceptedTerms",
});

export const errTokenExpired = (): ApiError => ({
  code: "VERIFICATION_TOKEN_EXPIRED",
  message: "El enlace de verificación expiró.",
});

export const errTokenInvalid = (): ApiError => ({
  code: "VERIFICATION_TOKEN_INVALID",
  message: "El enlace de verificación es inválido.",
});

export const errAlreadyVerified = (): ApiError => ({
  code: "EMAIL_ALREADY_VERIFIED",
  message: "Este email ya estaba verificado.",
});

export const errCooldown = (): ApiError => ({
  code: "RESEND_COOLDOWN_ACTIVE",
  message: "Espera unos segundos antes de reenviar.",
});

// ─── Special trigger constants used by the mock endpoints ────────────────────

export const MOCK_TRIGGERS = {
  emailAlreadyTaken: "taken@dualtee.co",
  resendCooldown: "cooldown@dualtee.co",
  invalidCountry: "XX",
  tokens: {
    valid: "MOCK_VALID_TOKEN",
    expired: "MOCK_EXPIRED_TOKEN",
    invalid: "MOCK_INVALID_TOKEN",
    alreadyVerified: "MOCK_ALREADY_VERIFIED",
  },
} as const;
