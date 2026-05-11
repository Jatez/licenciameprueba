export const pricingStrings = {
  page: {
    title: "Paquetes y precios",
    subtitle:
      "Definición de packs de créditos, vigencias, descuentos y promociones para empresas cliente.",
    customCta: "Crear paquete personalizado",
  },
  badge: {
    bestSeller: "Más vendida",
    custom: "Hecho a medida",
  },
  card: {
    creditsLabel: "créditos",
    perCreditLabel: "por crédito",
    validityLabel: (m: number) => `${m} meses de vigencia`,
    editCta: "Editar paquete",
    pricePerCredit: "Precio por crédito",
  },
  edit: {
    title: "Editar paquete",
    description: "Cambia precio, créditos o vigencia. Las nuevas compras usarán esta configuración.",
    fields: {
      name: "Nombre",
      tagline: "Tagline",
      priceCop: "Precio (COP)",
      credits: "Créditos",
      validityMonths: "Vigencia (meses)",
    },
    cancel: "Cancelar",
    submit: "Guardar cambios",
    submitting: "Guardando…",
    successToast: "Paquete actualizado (demo).",
  },
  custom: {
    title: "Crear paquete personalizado",
    description:
      "Define un paquete a medida para una empresa específica. No reemplaza las bolsas estándar.",
    fields: {
      companyName: "Empresa",
      companyPlaceholder: "Nombre de la empresa cliente",
      credits: "Créditos",
      priceCop: "Precio (COP)",
      validityMonths: "Vigencia (meses)",
      notes: "Notas internas",
      notesPlaceholder: "Condiciones, descuentos o cláusulas especiales.",
    },
    cancel: "Cancelar",
    submit: "Crear paquete",
    submitting: "Creando…",
    successToast: "Paquete personalizado creado (demo).",
  },
} as const;
