import type { PricingPackage } from "./types";

export const adminPricingMocks: PricingPackage[] = [
  {
    key: "bolsa-a",
    name: "Bolsa A",
    tagline: "Ideal para empresas que inician en licenciamiento musical.",
    priceCop: 90_000_000,
    credits: 300,
    validityMonths: 14,
    pricePerCreditCop: 300_000,
    features: [
      "Acceso completo al catálogo Licénciame",
      "Soporte estándar por correo",
      "Reportes mensuales de uso",
      "Hasta 10 usuarios empresa",
    ],
  },
  {
    key: "bolsa-b",
    name: "Bolsa B",
    tagline: "Para marcas con producción de contenido frecuente.",
    priceCop: 166_000_000,
    credits: 600,
    validityMonths: 14,
    pricePerCreditCop: 276_667,
    highlighted: true,
    badge: "Más vendida",
    features: [
      "Todo lo de Bolsa A",
      "Soporte prioritario",
      "Reportes semanales",
      "Hasta 25 usuarios empresa",
      "Curaduría sugerida por industria",
    ],
  },
  {
    key: "bolsa-c",
    name: "Bolsa C",
    tagline: "Para grupos empresariales y campañas continuas.",
    priceCop: 266_000_000,
    credits: 1000,
    validityMonths: 18,
    pricePerCreditCop: 266_000,
    features: [
      "Todo lo de Bolsa B",
      "Account manager dedicado",
      "Reportes en tiempo real",
      "Usuarios empresa ilimitados",
      "Vigencia extendida 18 meses",
    ],
  },
];
