import type { ContractLanguage } from "@/lib/contracts/i18n";

type NavKey =
  | "overview"
  | "freelancers"
  | "contracts"
  | "invoices"
  | "payouts"
  | "standups"
  | "help"
  | "settings"
  | "signOut";

const NAV: Record<ContractLanguage, Record<NavKey, string>> = {
  en: {
    overview: "Overview",
    freelancers: "Freelancers",
    contracts: "Contracts",
    invoices: "Invoices",
    payouts: "Payouts",
    standups: "Standups",
    help: "Help & Support",
    settings: "Settings",
    signOut: "Sign out",
  },
  fi: {
    overview: "Yhteenveto",
    freelancers: "Freelancerit",
    contracts: "Sopimukset",
    invoices: "Laskut",
    payouts: "Maksut",
    standups: "Standupit",
    help: "Tuki",
    settings: "Asetukset",
    signOut: "Kirjaudu ulos",
  },
  de: {
    overview: "Übersicht",
    freelancers: "Freelancer",
    contracts: "Verträge",
    invoices: "Rechnungen",
    payouts: "Auszahlungen",
    standups: "Standups",
    help: "Hilfe & Support",
    settings: "Einstellungen",
    signOut: "Abmelden",
  },
  fr: {
    overview: "Aperçu",
    freelancers: "Freelances",
    contracts: "Contrats",
    invoices: "Factures",
    payouts: "Paiements",
    standups: "Standups",
    help: "Aide",
    settings: "Paramètres",
    signOut: "Se déconnecter",
  },
  es: {
    overview: "Resumen",
    freelancers: "Freelances",
    contracts: "Contratos",
    invoices: "Facturas",
    payouts: "Pagos",
    standups: "Standups",
    help: "Ayuda",
    settings: "Ajustes",
    signOut: "Cerrar sesión",
  },
};

export function chromeNav(lang: ContractLanguage) {
  return NAV[lang] ?? NAV.en;
}
