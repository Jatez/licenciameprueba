export const authStrings = {
  register: {
    title: "Crea tu cuenta de empresa",
    subtitle: "Empieza a licenciar música de forma legal y trazable",
    fields: {
      companyName: { label: "Nombre de la empresa", placeholder: "" },
      countryCode: { label: "País", placeholder: "Selecciona un país" },
      fullName: { label: "Tu nombre completo", placeholder: "" },
      email: { label: "Email corporativo", placeholder: "nombre@empresa.com" },
      role: {
        label: "Tu rol en la empresa",
        placeholder: "Selecciona un rol",
        options: {
          company_admin: "Administrador de empresa",
          manager: "Manager",
          creator: "Creador de contenido",
          auditor: "Auditor",
        },
      },
      password: {
        label: "Contraseña",
        placeholder: "",
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
        requirements: "Mínimo 8 caracteres, con mayúscula, minúscula y número.",
      },
      acceptedTerms: {
        label: "Acepto los Términos y Condiciones y la Política de Privacidad",
        linkTerms: "Términos y Condiciones",
        linkPrivacy: "Política de Privacidad",
      },
    },
    submit: "Crear cuenta",
    submitting: "Creando cuenta…",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    login: "Inicia sesión",
    toast: {
      success: {
        title: "Cuenta creada",
        description: "Te enviamos un email para verificar tu cuenta.",
      },
      emailExistsAction: "Recuperar contraseña",
    },
    errors: {
      EMAIL_ALREADY_EXISTS: "Este email ya está registrado. ¿Quieres recuperar tu contraseña?",
      PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres",
      PASSWORD_WEAK: "Debe incluir mayúscula, minúscula y número",
      INVALID_COUNTRY_CODE: "Selecciona un país válido",
      INVALID_EMAIL: "Ingresa un email válido",
      TERMS_NOT_ACCEPTED: "Debes aceptar los Términos y Condiciones para continuar",
      NETWORK_ERROR: "No pudimos procesar tu registro. Intenta de nuevo.",
      COMPANY_NAME_TOO_SHORT: "El nombre de la empresa debe tener al menos 2 caracteres",
      FULL_NAME_TOO_SHORT: "Tu nombre debe tener al menos 2 caracteres",
      ROLE_REQUIRED: "Selecciona un rol",
    },
    warnings: {
      nonCorporateEmail:
        "Te recomendamos usar tu email corporativo para una experiencia mejor",
    },
    branding: {
      headline: "Licencia música sin riesgos legales para tu marca.",
      subtitle:
        "Únete a las marcas que ya licencian música de forma trazable y profesional.",
      bullets: {
        catalog: "Catálogo de 15.000+ tracks licenciables",
        legal: "Trazabilidad legal de cada uso",
        metrics: "Reportes y métricas de tus campañas",
      },
      socialProof: "Para equipos de marketing y agencias",
      logoAlt: "Licénciame",
    },
  },
  verifyEmail: {
    waiting: {
      title: "Revisa tu correo",
      description:
        "Enviamos un enlace de verificación a {email}. Haz clic en el enlace para activar tu cuenta.",
      descriptionFallback:
        "Enviamos un enlace de verificación a tu email. Haz clic en el enlace para activar tu cuenta.",
      notReceived: "¿No te llegó? Revisa tu carpeta de spam.",
      resend: "Reenviar email",
      resending: "Reenviando…",
      resendCooldown: "Podrás reenviar en {seconds}s",
      resentToast: "Email reenviado",
    },
    loading: { title: "Verificando tu email…" },
    success: {
      title: "¡Email verificado!",
      description: "Tu cuenta está activa. Vamos a configurarla juntos.",
      cta: "Continuar",
    },
    expired: {
      title: "El enlace expiró",
      description: "Los enlaces de verificación duran 24 horas. Solicita uno nuevo.",
      cta: "Enviar nuevo enlace",
    },
    alreadyVerified: {
      title: "Tu email ya está verificado",
      description: "Puedes iniciar sesión con tu cuenta.",
      cta: "Ir al login",
    },
    errorGeneric: {
      title: "No pudimos verificar tu email",
      description: "Algo salió mal. Intenta de nuevo en unos segundos.",
      cta: "Reintentar",
    },
    devTools: {
      label: "Modo demo · sin backend",
      simulateValid: "🛠 Simular confirmación de email",
      simulateExpired: "🛠 Simular token expirado",
    },
  },
  landing: {
    title: "Licencia música de forma legal y trazable",
    subtitle:
      "La plataforma B2B para que tu marca use música con licencia, sin riesgos legales.",
    ctaPrimary: "Crear cuenta",
    ctaSecondary: "Iniciar sesión",
  },

  // ──────────────────────────────────────────────────────────────────────────
  // F-02 · Login, MFA, password recovery, edge cases
  // ──────────────────────────────────────────────────────────────────────────

  login: {
    title: "Accede a Licénciame",
    subtitle:
      "Gestiona licencias, créditos y música aprobada para tus contenidos desde una sola plataforma.",
    fields: {
      email: { label: "Email corporativo", placeholder: "empresa@licenciame.com" },
      password: { label: "Contraseña", placeholder: "Ingresa tu contraseña" },
      remember: { label: "Mantener sesión iniciada" },
    },
    forgot: "¿Olvidaste tu contraseña?",
    submit: "Iniciar sesión",
    submitting: "Verificando…",
    noAccount: "¿No tienes cuenta?",
    register: "Crear cuenta",
    trust: "Acceso seguro para empresas que licencian música con control y trazabilidad.",
    errors: {
      INVALID_CREDENTIALS:
        "No pudimos verificar tus datos. Revisa la información e inténtalo de nuevo.",
      ACCOUNT_DISABLED:
        "Tu cuenta está temporalmente desactivada. Contacta al administrador de tu organización.",
      ACCOUNT_LOCKED:
        "Demasiados intentos fallidos. Tu cuenta quedó bloqueada por 15 minutos.",
      INVALID_EMAIL: "Ingresa un email válido",
      PASSWORD_REQUIRED: "Ingresa tu contraseña",
    },
    branding: {
      headline: "Licencia música con control, trazabilidad y velocidad.",
      subtitle:
        "Una plataforma única para gestionar tus licencias musicales, créditos y reportes.",
      bullets: {
        secure: "Acceso seguro con verificación en dos pasos",
        traceable: "Cada licencia, trazable y auditable",
        fast: "Aprobación y descarga en segundos",
      },
    },
  },

  demoSwitcher: {
    title: "Modo demo",
    description: "Accesos rápidos para probar el flujo sin credenciales reales.",
    company: "Entrar como User Empresa",
    admin: "Entrar como Super Admin",
    badge: "Demo",
  },

  mfa: {
    title: "Verificación en dos pasos",
    subtitle: "Para proteger tu cuenta, ingresa el código que enviamos a tu correo.",
    sentTo: "Código enviado a {email}",
    codeLabel: "Código de 6 dígitos",
    submit: "Verificar código",
    submitting: "Verificando…",
    resend: "Reenviar código",
    resendCooldown: "Podrás reenviar en {seconds}s",
    resendToast: "Te enviamos un nuevo código",
    backToLogin: "Volver a iniciar sesión",
    errors: {
      INVALID_CODE: "El código no es correcto. Intenta nuevamente.",
      CODE_EXPIRED: "El código expiró. Solicita uno nuevo.",
      TOO_MANY_ATTEMPTS:
        "Demasiados intentos. Por seguridad, tu cuenta quedó bloqueada temporalmente.",
      INCOMPLETE: "Ingresa los 6 dígitos del código.",
    },
  },

  forgotPassword: {
    title: "Recupera tu acceso",
    subtitle: "Te enviaremos un enlace seguro para crear una nueva contraseña.",
    fields: {
      email: { label: "Email corporativo", placeholder: "empresa@licenciame.com" },
    },
    submit: "Enviar enlace",
    submitting: "Enviando…",
    backToLogin: "Volver a iniciar sesión",
    success: {
      title: "Revisa tu correo",
      description:
        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      demoLink: "Continuar a reset de contraseña (demo)",
    },
  },

  resetPassword: {
    title: "Crea una nueva contraseña",
    subtitle: "Elige una contraseña segura para proteger tu cuenta.",
    fields: {
      newPassword: { label: "Nueva contraseña", placeholder: "" },
      confirmPassword: { label: "Confirmar nueva contraseña", placeholder: "" },
    },
    requirements: {
      length: "Al menos 8 caracteres",
      uppercase: "Una letra mayúscula",
      number: "Un número",
      match: "Las contraseñas coinciden",
    },
    submit: "Actualizar contraseña",
    submitting: "Actualizando…",
    success: {
      title: "Contraseña actualizada",
      description: "Tu contraseña fue actualizada correctamente.",
      cta: "Volver a iniciar sesión",
    },
    errors: {
      MISMATCH: "Las contraseñas no coinciden",
      WEAK: "La contraseña no cumple los requisitos",
    },
  },

  authSuccess: {
    title: "Iniciando sesión…",
    subtitle: "Te llevamos a tu espacio en Licénciame.",
  },

  accountLocked: {
    title: "Cuenta bloqueada temporalmente",
    description:
      "Detectamos demasiados intentos. Por seguridad, tu cuenta quedó bloqueada por 15 minutos.",
    cta: "Volver al login",
    help: "Si crees que es un error, contacta al administrador de tu organización.",
  },

  sessionExpired: {
    title: "Tu sesión expiró por seguridad",
    description: "Guarda tu progreso antes de volver a iniciar sesión.",
    primary: "Volver a iniciar sesión",
    secondary: "Cerrar",
  },

  autoLogout: {
    title: "Tu sesión está por expirar",
    description:
      "Por seguridad cerraremos tu sesión si no detectamos actividad en los próximos minutos.",
    keep: "Mantener sesión",
    close: "Cerrar sesión",
  },

  adminPlaceholder: {
    title: "Panel administrativo",
    subtitle: "Espacio reservado para Super Admin · UI pendiente",
    note: "Demo: aquí vivirá la administración de empresas, planes, usuarios y auditoría.",
  },
} as const;
