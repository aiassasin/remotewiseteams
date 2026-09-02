import type { ContractLanguage } from "@/lib/contracts/i18n";
import { translate } from "@/lib/i18n";

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

const NAV_KEYS: Record<NavKey, `nav.${NavKey}`> = {
  overview: "nav.overview",
  freelancers: "nav.freelancers",
  contracts: "nav.contracts",
  invoices: "nav.invoices",
  payouts: "nav.payouts",
  standups: "nav.standups",
  help: "nav.help",
  settings: "nav.settings",
  signOut: "nav.signOut",
};

export function chromeNav(lang: ContractLanguage) {
  return {
    overview: translate(lang, NAV_KEYS.overview),
    freelancers: translate(lang, NAV_KEYS.freelancers),
    contracts: translate(lang, NAV_KEYS.contracts),
    invoices: translate(lang, NAV_KEYS.invoices),
    payouts: translate(lang, NAV_KEYS.payouts),
    standups: translate(lang, NAV_KEYS.standups),
    help: translate(lang, NAV_KEYS.help),
    settings: translate(lang, NAV_KEYS.settings),
    signOut: translate(lang, NAV_KEYS.signOut),
  };
}
