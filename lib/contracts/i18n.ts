export const CONTRACT_LANGUAGES = ["en", "fi", "de", "fr", "es"] as const;
export type ContractLanguage = (typeof CONTRACT_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<ContractLanguage, string> = {
  en: "English",
  fi: "Suomi",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export type TemplateId = "nda" | "msa" | "sow" | "ica" | "blank";

export const TEMPLATE_IDS: TemplateId[] = ["nda", "msa", "sow", "ica", "blank"];

export const TEMPLATE_ICONS: Record<TemplateId, "nda" | "msa" | "sow" | "ica" | "scratch"> = {
  nda: "nda",
  msa: "msa",
  sow: "sow",
  ica: "ica",
  blank: "scratch",
};

export const CLAUSE_IDS = [
  "confidentiality",
  "ip",
  "nonsolicit",
  "gdpr",
  "late_payment",
] as const;
export type ClauseId = (typeof CLAUSE_IDS)[number];

type LangMap<T> = Record<ContractLanguage, T>;

function pick<T>(map: LangMap<T>, lang: ContractLanguage): T {
  return map[lang] ?? map.en;
}

export function detectAppLanguage(): ContractLanguage {
  if (typeof navigator === "undefined") return "en";
  const code = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (code === "fi" || code === "de" || code === "fr" || code === "es") return code;
  return "en";
}

export type UiCopy = {
  details: string;
  parties: string;
  company: string;
  companyAddress: string;
  companyId: string;
  freelancer: string;
  noFreelancers: string;
  inviteFirst: string;
  settings: string;
  title: string;
  governingLaw: string;
  governingLawHelp: string;
  startDate: string;
  startDateHelp: string;
  lastSignature: string;
  signatureDeadline: string;
  signatureDeadlineHelp: string;
  language: string;
  clauses: string;
  variables: string;
  preview: string;
  continue: string;
  fillToPreview: string;
  closePreview: string;
  typeHelp: string;
  disclaimer: string;
  customScope: string;
};

export const UI_COPY: LangMap<UiCopy> = {
  en: {
    details: "Contract details",
    parties: "Parties",
    company: "Company name",
    companyAddress: "Company address",
    companyId: "Company ID (Y-tunnus)",
    freelancer: "Freelancer",
    noFreelancers: "No freelancers yet — invite one first",
    inviteFirst: "Invite freelancer",
    settings: "Contract settings",
    title: "Contract title",
    governingLaw: "Governing law",
    governingLawHelp: "The country whose laws apply to this contract.",
    startDate: "Start date",
    startDateHelp: "When this contract becomes active.",
    lastSignature: "Date of last signature",
    signatureDeadline: "Signature deadline",
    signatureDeadlineHelp: "If not signed by this date, the request is cancelled automatically.",
    language: "Contract language",
    clauses: "Clause library",
    variables: "Project details",
    preview: "Preview contract",
    continue: "Continue to review",
    fillToPreview: "Fill any field to preview the final document.",
    closePreview: "Close preview",
    typeHelp: "Choose the agreement that matches the work.",
    disclaimer: "This template is informational, not legal advice.",
    customScope: "What this agreement covers",
  },
  fi: {
    details: "Sopimuksen tiedot",
    parties: "Osapuolet",
    company: "Yrityksen nimi",
    companyAddress: "Yrityksen osoite",
    companyId: "Y-tunnus",
    freelancer: "Freelancer",
    noFreelancers: "Ei freelancereita vielä — kutsu ensin yksi",
    inviteFirst: "Kutsu freelancer",
    settings: "Sopimusasetukset",
    title: "Sopimuksen otsikko",
    governingLaw: "Sovellettava laki",
    governingLawHelp: "Maan lait, joita tähän sopimukseen sovelletaan.",
    startDate: "Alkamispäivä",
    startDateHelp: "Milloin tämä sopimus astuu voimaan.",
    lastSignature: "Viimeisen allekirjoituksen päivä",
    signatureDeadline: "Allekirjoituksen määräaika",
    signatureDeadlineHelp: "Jos sopimusta ei allekirjoiteta tähän päivään mennessä, pyyntö perutaan automaattisesti.",
    language: "Sopimuksen kieli",
    clauses: "Ehtokirjasto",
    variables: "Hankkeen tiedot",
    preview: "Esikatsele sopimus",
    continue: "Jatka tarkistukseen",
    fillToPreview: "Täytä mikä tahansa kenttä nähdäksesi valmiin asiakirjan.",
    closePreview: "Sulje esikatselu",
    typeHelp: "Valitse työtä vastaava sopimus.",
    disclaimer: "Tämä malli on informatiivinen, ei oikeudellista neuvontaa.",
    customScope: "Mitä tämä sopimus kattaa",
  },
  de: {
    details: "Vertragsdetails",
    parties: "Parteien",
    company: "Firmenname",
    companyAddress: "Firmenadresse",
    companyId: "Unternehmens-ID (Y-tunnus)",
    freelancer: "Freelancer",
    noFreelancers: "Noch keine Freelancer — zuerst eine Person einladen",
    inviteFirst: "Freelancer einladen",
    settings: "Vertragseinstellungen",
    title: "Vertragstitel",
    governingLaw: "Anwendbares Recht",
    governingLawHelp: "Das Land, dessen Recht für diesen Vertrag gilt.",
    startDate: "Startdatum",
    startDateHelp: "Wann dieser Vertrag wirksam wird.",
    lastSignature: "Datum der letzten Unterschrift",
    signatureDeadline: "Unterschriftsfrist",
    signatureDeadlineHelp: "Wird bis zu diesem Datum nicht unterschrieben, wird die Anfrage automatisch storniert.",
    language: "Vertragssprache",
    clauses: "Klauselbibliothek",
    variables: "Projektdetails",
    preview: "Vertrag vorschauen",
    continue: "Weiter zur Prüfung",
    fillToPreview: "Füllen Sie ein Feld aus, um das fertige Dokument zu sehen.",
    closePreview: "Vorschau schließen",
    typeHelp: "Wählen Sie die Vereinbarung, die zur Arbeit passt.",
    disclaimer: "Diese Vorlage dient der Information und ist keine Rechtsberatung.",
    customScope: "Was diese Vereinbarung abdeckt",
  },
  fr: {
    details: "Détails du contrat",
    parties: "Parties",
    company: "Nom de l’entreprise",
    companyAddress: "Adresse de l’entreprise",
    companyId: "Identifiant (Y-tunnus)",
    freelancer: "Freelance",
    noFreelancers: "Aucun freelance pour le moment — invitez-en un d’abord",
    inviteFirst: "Inviter un freelance",
    settings: "Paramètres du contrat",
    title: "Titre du contrat",
    governingLaw: "Droit applicable",
    governingLawHelp: "Le pays dont les lois s’appliquent à ce contrat.",
    startDate: "Date de début",
    startDateHelp: "Quand ce contrat prend effet.",
    lastSignature: "Date de la dernière signature",
    signatureDeadline: "Date limite de signature",
    signatureDeadlineHelp: "S’il n’est pas signé à cette date, la demande est annulée automatiquement.",
    language: "Langue du contrat",
    clauses: "Bibliothèque de clauses",
    variables: "Détails du projet",
    preview: "Prévisualiser le contrat",
    continue: "Continuer vers la relecture",
    fillToPreview: "Remplissez un champ pour voir le document final.",
    closePreview: "Fermer l’aperçu",
    typeHelp: "Choisissez l’accord qui correspond au travail.",
    disclaimer: "Ce modèle est informatif et ne constitue pas un conseil juridique.",
    customScope: "Ce que couvre cet accord",
  },
  es: {
    details: "Datos del contrato",
    parties: "Partes",
    company: "Nombre de la empresa",
    companyAddress: "Dirección de la empresa",
    companyId: "ID de empresa (Y-tunnus)",
    freelancer: "Freelance",
    noFreelancers: "Aún no hay freelances — invita a uno primero",
    inviteFirst: "Invitar freelance",
    settings: "Ajustes del contrato",
    title: "Título del contrato",
    governingLaw: "Ley aplicable",
    governingLawHelp: "El país cuyas leyes rigen este contrato.",
    startDate: "Fecha de inicio",
    startDateHelp: "Cuándo entra en vigor este contrato.",
    lastSignature: "Fecha de la última firma",
    signatureDeadline: "Plazo de firma",
    signatureDeadlineHelp: "Si no se firma en esta fecha, la solicitud se cancela automáticamente.",
    language: "Idioma del contrato",
    clauses: "Biblioteca de cláusulas",
    variables: "Datos del proyecto",
    preview: "Previsualizar contrato",
    continue: "Continuar a revisión",
    fillToPreview: "Rellena cualquier campo para ver el documento final.",
    closePreview: "Cerrar vista previa",
    typeHelp: "Elige el acuerdo que encaja con el trabajo.",
    disclaimer: "Esta plantilla es informativa, no es asesoramiento legal.",
    customScope: "Qué cubre este acuerdo",
  },
};

export type ClauseCopy = { title: string; explanation: string; clause: string };

export const CLAUSE_COPY: Record<ClauseId, LangMap<ClauseCopy>> = {
  confidentiality: {
    en: {
      title: "Confidentiality period",
      explanation: "Secrets stay secret for 2 years after the contract ends.",
      clause:
        "Each party keeps the other party’s non-public information confidential for two (2) years after this contract ends, and uses it only to perform the work. This does not cover information that is public, independently developed, or required to be disclosed by law.",
    },
    fi: {
      title: "Salassapitoaika",
      explanation: "Salaisuudet pysyvät salassa 2 vuotta sopimuksen päättymisen jälkeen.",
      clause:
        "Kumpikin osapuoli pitää toisen osapuolen ei-julkiset tiedot luottamuksellisina kahden (2) vuoden ajan tämän sopimuksen päättymisestä ja käyttää niitä vain työn tekemiseen. Tämä ei koske tietoja, jotka ovat julkisia, itsenäisesti kehitettyjä tai jotka laki velvoittaa paljastamaan.",
    },
    de: {
      title: "Vertraulichkeitsfrist",
      explanation: "Geheimnisse bleiben 2 Jahre nach Vertragsende geheim.",
      clause:
        "Jede Partei hält nicht-öffentliche Informationen der anderen Partei für zwei (2) Jahre nach Vertragsende vertraulich und nutzt sie nur zur Leistungserbringung. Ausgenommen sind öffentliche, unabhängig entwickelte oder gesetzlich offenzulegende Informationen.",
    },
    fr: {
      title: "Durée de confidentialité",
      explanation: "Les secrets restent secrets 2 ans après la fin du contrat.",
      clause:
        "Chaque partie conserve confidentielles les informations non publiques de l’autre pendant deux (2) ans après la fin de ce contrat, et ne les utilise que pour exécuter le travail. Sont exclues les informations publiques, développées indépendamment, ou dont la loi impose la divulgation.",
    },
    es: {
      title: "Periodo de confidencialidad",
      explanation: "Los secretos siguen siéndolo 2 años después de que termine el contrato.",
      clause:
        "Cada parte mantiene confidencial la información no pública de la otra durante dos (2) años tras el fin de este contrato, y solo la usa para realizar el trabajo. No cubre información pública, desarrollada de forma independiente o cuya revelación exija la ley.",
    },
  },
  ip: {
    en: {
      title: "IP ownership on payment",
      explanation: "Intellectual property transfers to the client when the invoice is paid.",
      clause:
        "Intellectual property in the deliverables transfers to the Company when the related invoice is paid in full. Until then, the Freelancer keeps the rights needed to complete the work. Pre-existing tools and know-how stay with the Freelancer; the Company receives a licence to use them with the deliverables.",
    },
    fi: {
      title: "IP-oikeudet maksun yhteydessä",
      explanation: "Immateriaalioikeudet siirtyvät asiakkaalle, kun lasku on maksettu.",
      clause:
        "Toimitusten immateriaalioikeudet siirtyvät Yritykselle, kun niihin liittyvä lasku on maksettu kokonaan. Siihen asti Freelancerilla säilyvät työn loppuun saattamiseen tarvittavat oikeudet. Aiemmat työkalut ja tietotaito jäävät Freelancerille; Yritys saa lisenssin käyttää niitä toimitusten yhteydessä.",
    },
    de: {
      title: "IP-Rechte bei Zahlung",
      explanation: "Geistiges Eigentum geht auf den Kunden über, wenn die Rechnung bezahlt ist.",
      clause:
        "Die Rechte an den Liefergegenständen gehen auf das Unternehmen über, sobald die zugehörige Rechnung vollständig bezahlt ist. Bis dahin behält der Freelancer die zur Fertigstellung nötigen Rechte. Vorbestehende Werkzeuge und Know-how bleiben beim Freelancer; das Unternehmen erhält eine Lizenz zur Nutzung mit den Liefergegenständen.",
    },
    fr: {
      title: "Propriété intellectuelle au paiement",
      explanation: "La propriété intellectuelle est transférée au client lorsque la facture est payée.",
      clause:
        "La propriété intellectuelle des livrables est transférée à l’Entreprise lorsque la facture correspondante est payée intégralement. Jusque-là, le Freelance conserve les droits nécessaires pour terminer le travail. Les outils et savoir-faire préexistants restent au Freelance ; l’Entreprise reçoit une licence pour les utiliser avec les livrables.",
    },
    es: {
      title: "Propiedad intelectual al pagar",
      explanation: "La propiedad intelectual pasa al cliente cuando se paga la factura.",
      clause:
        "La propiedad intelectual de los entregables pasa a la Empresa cuando se paga por completo la factura relacionada. Hasta entonces, el Freelance conserva los derechos necesarios para terminar el trabajo. Las herramientas y el saber hacer previos siguen siendo del Freelance; la Empresa recibe una licencia para usarlos con los entregables.",
    },
  },
  nonsolicit: {
    en: {
      title: "Non-solicitation (12 months)",
      explanation: "Neither side poaches the other’s people for 12 months.",
      clause:
        "For twelve (12) months after this contract ends, neither party solicits the other party’s employees or contractors who worked on this engagement, except through a general public job posting.",
    },
    fi: {
      title: "Houkuttelukielto (12 kk)",
      explanation: "Kumpikaan ei houkuttele toisen ihmisiä 12 kuukauteen.",
      clause:
        "Kahdentoista (12) kuukauden ajan tämän sopimuksen päättymisestä kumpikaan osapuoli ei houkuttele toisen työntekijöitä tai urakoitsijoita, jotka osallistuivat tähän toimeksiantoon, paitsi yleisen avoimen haun kautta.",
    },
    de: {
      title: "Abwerbeverbot (12 Monate)",
      explanation: "Keine Seite wirbt 12 Monate lang Mitarbeiter der anderen ab.",
      clause:
        "Zwölf (12) Monate nach Vertragsende wirbt keine Partei Mitarbeiter oder Auftragnehmer der anderen Partei ab, die an diesem Auftrag mitgewirkt haben, außer über eine allgemeine öffentliche Stellenanzeige.",
    },
    fr: {
      title: "Non-sollicitation (12 mois)",
      explanation: "Aucune partie ne débauche les personnes de l’autre pendant 12 mois.",
      clause:
        "Pendant douze (12) mois après la fin de ce contrat, aucune partie ne sollicite les salariés ou prestataires de l’autre qui ont travaillé sur cette mission, sauf via une offre d’emploi publique générale.",
    },
    es: {
      title: "No captación (12 meses)",
      explanation: "Ninguna parte ficha a la gente de la otra durante 12 meses.",
      clause:
        "Durante doce (12) meses tras el fin de este contrato, ninguna parte solicita a empleados o contratistas de la otra que hayan trabajado en este encargo, salvo mediante una oferta de empleo pública general.",
    },
  },
  gdpr: {
    en: {
      title: "GDPR / data protection",
      explanation: "Personal data is handled under the GDPR.",
      clause:
        "If a party processes personal data for the other, it follows Regulation (EU) 2016/679 (GDPR) and applicable Finnish data-protection law. Personal data is used only to perform this contract, kept secure, and deleted or returned when it is no longer needed, unless the law requires a longer keep.",
    },
    fi: {
      title: "GDPR / tietosuoja",
      explanation: "Henkilötietoja käsitellään GDPR:n mukaan.",
      clause:
        "Jos osapuoli käsittelee toisen henkilötietoja, se noudattaa asetusta (EU) 2016/679 (GDPR) ja Suomen tietosuojalainsäädäntöä. Henkilötietoja käytetään vain tämän sopimuksen täyttämiseen, ne pidetään turvassa ja poistetaan tai palautetaan, kun niitä ei enää tarvita, jollei laki vaadi pidempää säilytystä.",
    },
    de: {
      title: "DSGVO / Datenschutz",
      explanation: "Personenbezogene Daten werden nach der DSGVO verarbeitet.",
      clause:
        "Verarbeitet eine Partei personenbezogene Daten für die andere, gilt die Verordnung (EU) 2016/679 (DSGVO) sowie das anwendbare finnische Datenschutzrecht. Daten werden nur zur Vertragserfüllung genutzt, geschützt und gelöscht oder zurückgegeben, wenn sie nicht mehr nötig sind, sofern das Gesetz keine längere Speicherung verlangt.",
    },
    fr: {
      title: "RGPD / protection des données",
      explanation: "Les données personnelles sont traitées selon le RGPD.",
      clause:
        "Si une partie traite des données personnelles pour l’autre, elle applique le règlement (UE) 2016/679 (RGPD) et le droit finlandais applicable. Les données ne servent qu’à exécuter ce contrat, sont protégées, puis effacées ou restituées lorsqu’elles ne sont plus nécessaires, sauf obligation légale de conservation plus longue.",
    },
    es: {
      title: "RGPD / protección de datos",
      explanation: "Los datos personales se tratan conforme al RGPD.",
      clause:
        "Si una parte trata datos personales de la otra, aplica el Reglamento (UE) 2016/679 (RGPD) y la normativa finlandesa aplicable. Los datos solo se usan para cumplir este contrato, se protegen y se eliminan o devuelven cuando ya no hagan falta, salvo que la ley exija conservarlos más tiempo.",
    },
  },
  late_payment: {
    en: {
      title: "Late payment interest",
      explanation: "Late invoices follow the Finnish Interest Act / EU Late Payment Directive.",
      clause:
        "If an undisputed invoice is paid late, interest accrues under the Finnish Interest Act (Korkolaki 633/1982) and, where it applies, Directive 2011/7/EU on late payment in commercial transactions.",
    },
    fi: {
      title: "Viivästyskorko",
      explanation: "Myöhässä maksetut laskut noudattavat korkolakia / EU:n viivästysdirektiiviä.",
      clause:
        "Jos riidaton lasku maksetaan myöhässä, viivästyskorkoa peritään korkolain (633/1982) ja tarvittaessa direktiivin 2011/7/EU mukaisesti.",
    },
    de: {
      title: "Verzugszinsen",
      explanation: "Verspätete Rechnungen folgen dem finnischen Zinsgesetz / der EU-Zahlungsverzugsrichtlinie.",
      clause:
        "Wird eine unbestrittene Rechnung verspätet bezahlt, fallen Zinsen nach dem finnischen Zinsgesetz (Korkolaki 633/1982) und, soweit anwendbar, der Richtlinie 2011/7/EU an.",
    },
    fr: {
      title: "Intérêts de retard",
      explanation: "Les factures en retard suivent la loi finlandaise sur les intérêts / la directive européenne.",
      clause:
        "Si une facture non contestée est payée en retard, des intérêts courent selon la loi finlandaise sur les intérêts (Korkolaki 633/1982) et, le cas échéant, la directive 2011/7/UE.",
    },
    es: {
      title: "Interés de demora",
      explanation: "Las facturas atrasadas siguen la ley finlandesa de intereses / la Directiva de morosidad de la UE.",
      clause:
        "Si una factura no impugnada se paga tarde, se devengan intereses conforme a la Ley finlandesa de intereses (Korkolaki 633/1982) y, cuando proceda, la Directiva 2011/7/UE.",
    },
  },
};

export type TypeCopy = { name: string; oneLiner: string };

export const TYPE_COPY: Record<TemplateId, LangMap<TypeCopy>> = {
  nda: {
    en: { name: "NDA", oneLiner: "Keep shared information confidential." },
    fi: { name: "NDA", oneLiner: "Pidä jaetut tiedot luottamuksellisina." },
    de: { name: "NDA", oneLiner: "Geteilte Informationen vertraulich halten." },
    fr: { name: "NDA", oneLiner: "Garder confidentielles les informations partagées." },
    es: { name: "NDA", oneLiner: "Mantén confidencial la información compartida." },
  },
  msa: {
    en: { name: "MSA", oneLiner: "The ongoing relationship, pay, and how you end it." },
    fi: { name: "MSA", oneLiner: "Jatkuva yhteistyö, maksu ja sopimuksen päättäminen." },
    de: { name: "MSA", oneLiner: "Laufende Zusammenarbeit, Zahlung und Beendigung." },
    fr: { name: "MSA", oneLiner: "La relation continue, le paiement et la fin du contrat." },
    es: { name: "MSA", oneLiner: "La relación continua, el pago y cómo terminarla." },
  },
  sow: {
    en: { name: "SOW", oneLiner: "This project: what, when, and for how much." },
    fi: { name: "SOW", oneLiner: "Tämä hanke: mitä, milloin ja millä hinnalla." },
    de: { name: "SOW", oneLiner: "Dieses Projekt: was, wann und wofür." },
    fr: { name: "SOW", oneLiner: "Ce projet : quoi, quand, et pour quel montant." },
    es: { name: "SOW", oneLiner: "Este proyecto: qué, cuándo y por cuánto." },
  },
  ica: {
    en: { name: "Independent Contractor", oneLiner: "You are a contractor, not an employee." },
    fi: { name: "Itsenäinen urakoitsija", oneLiner: "Olet urakoitsija, et työntekijä." },
    de: { name: "Independent Contractor", oneLiner: "Sie sind Auftragnehmer, kein Arbeitnehmer." },
    fr: { name: "Independent Contractor", oneLiner: "Vous êtes prestataire, pas salarié." },
    es: { name: "Independent Contractor", oneLiner: "Eres contratista, no empleado." },
  },
  blank: {
    en: { name: "From scratch", oneLiner: "Write your own scope; we wrap it in a clean frame." },
    fi: { name: "Tyhjästä", oneLiner: "Kirjoita oma sisältö; me annamme sille selkeän kehyksen." },
    de: { name: "Von Grund auf", oneLiner: "Eigenen Umfang schreiben; wir geben den Rahmen." },
    fr: { name: "Partir de zéro", oneLiner: "Rédigez votre périmètre ; nous posons le cadre." },
    es: { name: "Desde cero", oneLiner: "Escribe tu alcance; nosotros ponemos el marco." },
  },
};

export const VARIABLE_LABELS: Record<string, LangMap<string>> = {
  DURATION: {
    en: "Confidentiality duration",
    fi: "Salassapidon kesto",
    de: "Dauer der Vertraulichkeit",
    fr: "Durée de confidentialité",
    es: "Duración de la confidencialidad",
  },
  PAYMENT_TERMS: {
    en: "Payment terms",
    fi: "Maksuehdot",
    de: "Zahlungsbedingungen",
    fr: "Conditions de paiement",
    es: "Condiciones de pago",
  },
  NOTICE_PERIOD: {
    en: "Notice period",
    fi: "Irtisanomisaika",
    de: "Kündigungsfrist",
    fr: "Préavis",
    es: "Plazo de preaviso",
  },
  PROJECT_NAME: {
    en: "Project name",
    fi: "Hankkeen nimi",
    de: "Projektname",
    fr: "Nom du projet",
    es: "Nombre del proyecto",
  },
  DELIVERABLES: {
    en: "Deliverables",
    fi: "Toimitukset",
    de: "Liefergegenstände",
    fr: "Livrables",
    es: "Entregables",
  },
  TIMELINE: {
    en: "Timeline",
    fi: "Aikataulu",
    de: "Zeitplan",
    fr: "Calendrier",
    es: "Calendario",
  },
  AMOUNT: {
    en: "Amount",
    fi: "Summa",
    de: "Betrag",
    fr: "Montant",
    es: "Importe",
  },
  RATE: {
    en: "Rate",
    fi: "Palkkio",
    de: "Honorar",
    fr: "Tarif",
    es: "Tarifa",
  },
  SCOPE: {
    en: "What this agreement covers",
    fi: "Mitä tämä sopimus kattaa",
    de: "Was diese Vereinbarung abdeckt",
    fr: "Ce que couvre cet accord",
    es: "Qué cubre este acuerdo",
  },
};

export function variableLabel(key: string, lang: ContractLanguage) {
  const map = VARIABLE_LABELS[key];
  return map ? pick(map, lang) : key.replaceAll("_", " ");
}

export function uiCopy(lang: ContractLanguage) {
  return pick(UI_COPY, lang);
}

export function clauseCopy(id: ClauseId, lang: ContractLanguage) {
  return pick(CLAUSE_COPY[id], lang);
}

export function typeCopy(id: TemplateId, lang: ContractLanguage) {
  return pick(TYPE_COPY[id], lang);
}
