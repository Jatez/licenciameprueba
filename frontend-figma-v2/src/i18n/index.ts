import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esCommon from "../../locales/es/common.json";
import esDesignSystem from "../../locales/es/design-system.json";

void i18n.use(initReactI18next).init({
  resources: {
    es: {
      common: esCommon,
      designSystem: esDesignSystem,
    },
  },
  lng: "es",
  fallbackLng: "es",
  defaultNS: "common",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
