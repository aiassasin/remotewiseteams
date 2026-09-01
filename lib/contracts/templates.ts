import { typeCopy, type ContractLanguage, type TemplateId } from "@/lib/contracts/i18n";

export type ContractSection = { heading: string; summary: string; body: string };

function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\[([A-Z_]+)\]/g, (match, key: string) => vars[key] || match);
}

type SectionSet = Record<ContractLanguage, ContractSection[]>;

const NDA: SectionSet = {
  en: [
    {
      heading: "Parties",
      summary: "Who this agreement is between.",
      body: "This non-disclosure agreement is between [COMPANY_NAME] (“Company”), [COMPANY_ADDRESS][COMPANY_ID_LINE], and [FREELANCER_NAME] (“Freelancer”).",
    },
    {
      heading: "Purpose",
      summary: "Why the parties are talking.",
      body: "The parties may share information to explore or do work together. This agreement sets a fair, simple rule for how that information is treated.",
    },
    {
      heading: "Confidential information",
      summary: "What must stay private.",
      body: "Confidential information is non-public business, technical, or personal information that one party shares with the other, whether spoken, written, or shown.",
    },
    {
      heading: "How we protect it",
      summary: "Use it only for the work, and keep it safe.",
      body: "Each party uses confidential information only for the purpose above, keeps it secure, and does not share it with third parties without prior written consent, except with people who need it to do the work and who are bound to keep it confidential.",
    },
    {
      heading: "Exceptions",
      summary: "What is not confidential.",
      body: "Information is not confidential if it is public, was already known, is independently developed, or must be disclosed by law. If the law requires disclosure, the receiving party gives notice where legally allowed.",
    },
    {
      heading: "How long this lasts",
      summary: "The duty continues after the talks end.",
      body: "This agreement starts on [START_DATE]. The duty of confidentiality lasts for [DURATION] from that date, unless a longer period is added in the clause library.",
    },
    {
      heading: "Return of materials",
      summary: "Give back or destroy what you no longer need.",
      body: "On written request, or when the work ends, each party returns or securely destroys the other party’s confidential materials, except copies the law requires it to keep.",
    },
    {
      heading: "Governing law",
      summary: "Finland-first, unless you choose another country.",
      body: "This agreement is governed by the laws of [GOVERNING_LAW]. Disputes are first discussed in good faith. If they cannot be resolved, the courts of that country have jurisdiction, unless the parties agree otherwise in writing.",
    },
  ],
  fi: [
    {
      heading: "Osapuolet",
      summary: "Keiden välillä tämä sopimus on.",
      body: "Tämä salassapitosopimus on [COMPANY_NAME] (“Yritys”), [COMPANY_ADDRESS][COMPANY_ID_LINE], ja [FREELANCER_NAME] (“Freelancer”) välillä.",
    },
    {
      heading: "Tarkoitus",
      summary: "Miksi osapuolet keskustelevat.",
      body: "Osapuolet voivat jakaa tietoja yhteistyön selvittämiseksi tai tekemiseksi. Tämä sopimus asettaa selkeän säännön tietojen käsittelylle.",
    },
    {
      heading: "Luottamukselliset tiedot",
      summary: "Mikä pysyy salassa.",
      body: "Luottamuksellista on ei-julkinen liike-, tekninen tai henkilötieto, jonka yksi osapuoli jakaa toiselle suullisesti, kirjallisesti tai näyttämällä.",
    },
    {
      heading: "Miten suojaamme tiedot",
      summary: "Käytä vain työhön ja pidä turvassa.",
      body: "Kumpikin käyttää luottamuksellisia tietoja vain yllä olevaan tarkoitukseen, pitää ne turvassa eikä jaa niitä kolmansille ilman etukäteistä kirjallista suostumusta, paitsi henkilöille, jotka tarvitsevat niitä työhön ja jotka ovat sidottuja salassapitoon.",
    },
    {
      heading: "Poikkeukset",
      summary: "Mikä ei ole luottamuksellista.",
      body: "Tieto ei ole luottamuksellista, jos se on julkista, oli jo tiedossa, kehitettiin itsenäisesti tai se on paljastettava lain nojalla. Jos laki vaatii paljastamista, vastaanottaja ilmoittaa siitä, jos se on laillisesti sallittua.",
    },
    {
      heading: "Voimassaolo",
      summary: "Velvollisuus jatkuu keskustelujen jälkeenkin.",
      body: "Tämä sopimus alkaa [START_DATE]. Salassapitovelvollisuus kestää [DURATION] tuosta päivästä, jollei ehtokirjastossa ole pidempää aikaa.",
    },
    {
      heading: "Aineiston palautus",
      summary: "Palauta tai hävitä, mitä et enää tarvitse.",
      body: "Kirjallisesta pyynnöstä tai työn päättyessä kumpikin palauttaa tai hävittää turvallisesti toisen luottamuksellisen aineiston, paitsi kopiot, jotka laki velvoittaa säilyttämään.",
    },
    {
      heading: "Sovellettava laki",
      summary: "Suomi ensisijaisesti, ellei toista maata valita.",
      body: "Tähän sopimukseen sovelletaan [GOVERNING_LAW] lakia. Erimielisyydet ratkaistaan ensin vilpittömässä keskustelussa. Ellei ratkaisua synny, kyseisen maan tuomioistuimilla on toimivalta, jollei toisin sovita kirjallisesti.",
    },
  ],
  de: [
    {
      heading: "Parteien",
      summary: "Zwischen wem diese Vereinbarung gilt.",
      body: "Diese Geheimhaltungsvereinbarung gilt zwischen [COMPANY_NAME] („Unternehmen“), [COMPANY_ADDRESS][COMPANY_ID_LINE], und [FREELANCER_NAME] („Freelancer“).",
    },
    {
      heading: "Zweck",
      summary: "Warum die Parteien sprechen.",
      body: "Die Parteien können Informationen austauschen, um zusammenzuarbeiten. Diese Vereinbarung setzt eine klare Regel für den Umgang damit.",
    },
    {
      heading: "Vertrauliche Informationen",
      summary: "Was privat bleibt.",
      body: "Vertraulich sind nicht-öffentliche geschäftliche, technische oder personenbezogene Informationen, die eine Partei der anderen mündlich, schriftlich oder durch Vorzeigen mitteilt.",
    },
    {
      heading: "Schutz",
      summary: "Nur für die Arbeit nutzen und sicher aufbewahren.",
      body: "Jede Partei nutzt vertrauliche Informationen nur für den oben genannten Zweck, hält sie sicher und gibt sie ohne vorherige schriftliche Zustimmung nicht an Dritte weiter, außer an Personen, die sie für die Arbeit brauchen und zur Vertraulichkeit verpflichtet sind.",
    },
    {
      heading: "Ausnahmen",
      summary: "Was nicht vertraulich ist.",
      body: "Informationen sind nicht vertraulich, wenn sie öffentlich sind, bereits bekannt waren, unabhängig entwickelt wurden oder gesetzlich offenzulegen sind. Ist eine Offenlegung gesetzlich nötig, informiert die empfangende Partei, soweit rechtlich zulässig.",
    },
    {
      heading: "Laufzeit",
      summary: "Die Pflicht gilt auch nach den Gesprächen.",
      body: "Diese Vereinbarung beginnt am [START_DATE]. Die Vertraulichkeitspflicht gilt [DURATION] ab diesem Datum, sofern die Klauselbibliothek keine längere Frist vorsieht.",
    },
    {
      heading: "Rückgabe",
      summary: "Zurückgeben oder sicher vernichten, was nicht mehr nötig ist.",
      body: "Auf schriftliche Anfrage oder bei Ende der Arbeit gibt jede Partei die vertraulichen Unterlagen der anderen zurück oder vernichtet sie sicher, außer Kopien, die das Gesetz verlangt.",
    },
    {
      heading: "Anwendbares Recht",
      summary: "Finnland zuerst, sofern kein anderes Land gewählt wird.",
      body: "Es gilt das Recht von [GOVERNING_LAW]. Streitigkeiten werden zunächst in gutem Glauben besprochen. Bleiben sie ungelöst, sind die Gerichte dieses Landes zuständig, sofern schriftlich nichts anderes vereinbart ist.",
    },
  ],
  fr: [
    {
      heading: "Parties",
      summary: "Entre qui cet accord est conclu.",
      body: "Cet accord de confidentialité est conclu entre [COMPANY_NAME] (« l’Entreprise »), [COMPANY_ADDRESS][COMPANY_ID_LINE], et [FREELANCER_NAME] (« le Freelance »).",
    },
    {
      heading: "Objet",
      summary: "Pourquoi les parties échangent.",
      body: "Les parties peuvent partager des informations pour explorer ou réaliser un travail ensemble. Cet accord pose une règle simple et équitable.",
    },
    {
      heading: "Informations confidentielles",
      summary: "Ce qui doit rester privé.",
      body: "Sont confidentielles les informations commerciales, techniques ou personnelles non publiques qu’une partie communique à l’autre, oralement, par écrit ou en les montrant.",
    },
    {
      heading: "Protection",
      summary: "Ne les utiliser que pour le travail, et les garder en sécurité.",
      body: "Chaque partie n’utilise les informations confidentielles que pour l’objet ci-dessus, les protège, et ne les communique pas à des tiers sans accord écrit préalable, sauf aux personnes qui en ont besoin pour le travail et qui sont tenues à la confidentialité.",
    },
    {
      heading: "Exceptions",
      summary: "Ce qui n’est pas confidentiel.",
      body: "Une information n’est pas confidentielle si elle est publique, déjà connue, développée indépendamment, ou si la loi impose sa divulgation. Dans ce cas, la partie destinataire prévient l’autre lorsque la loi le permet.",
    },
    {
      heading: "Durée",
      summary: "L’obligation continue après les échanges.",
      body: "Cet accord commence le [START_DATE]. L’obligation de confidentialité dure [DURATION] à compter de cette date, sauf période plus longue dans la bibliothèque de clauses.",
    },
    {
      heading: "Restitution",
      summary: "Rendre ou détruire ce qui n’est plus nécessaire.",
      body: "Sur demande écrite, ou à la fin du travail, chaque partie restitue ou détruit de façon sûre les supports confidentiels de l’autre, sauf les copies que la loi impose de conserver.",
    },
    {
      heading: "Droit applicable",
      summary: "La Finlande d’abord, sauf autre pays choisi.",
      body: "Cet accord est régi par le droit de [GOVERNING_LAW]. Les différends sont d’abord discutés de bonne foi. À défaut d’accord, les tribunaux de ce pays sont compétents, sauf accord écrit contraire.",
    },
  ],
  es: [
    {
      heading: "Partes",
      summary: "Entre quiénes se celebra este acuerdo.",
      body: "Este acuerdo de confidencialidad se celebra entre [COMPANY_NAME] («la Empresa»), [COMPANY_ADDRESS][COMPANY_ID_LINE], y [FREELANCER_NAME] («el Freelance»).",
    },
    {
      heading: "Finalidad",
      summary: "Por qué hablan las partes.",
      body: "Las partes pueden compartir información para explorar o realizar un trabajo juntas. Este acuerdo fija una regla clara y justa.",
    },
    {
      heading: "Información confidencial",
      summary: "Qué debe permanecer en privado.",
      body: "Es confidencial la información empresarial, técnica o personal no pública que una parte comparte con la otra, de forma oral, escrita o mostrándola.",
    },
    {
      heading: "Cómo se protege",
      summary: "Úsala solo para el trabajo y guárdala con cuidado.",
      body: "Cada parte usa la información confidencial solo para la finalidad anterior, la mantiene segura y no la comparte con terceros sin consentimiento escrito previo, salvo con quienes la necesiten para el trabajo y estén obligados a guardar secreto.",
    },
    {
      heading: "Excepciones",
      summary: "Qué no es confidencial.",
      body: "No es confidencial la información pública, ya conocida, desarrollada de forma independiente o que la ley obligue a revelar. Si la ley exige revelarla, la parte receptora avisa cuando sea legalmente posible.",
    },
    {
      heading: "Duración",
      summary: "El deber sigue después de las conversaciones.",
      body: "Este acuerdo empieza el [START_DATE]. El deber de confidencialidad dura [DURATION] desde esa fecha, salvo un plazo más largo en la biblioteca de cláusulas.",
    },
    {
      heading: "Devolución",
      summary: "Devuelve o destruye lo que ya no necesites.",
      body: "A petición escrita, o al terminar el trabajo, cada parte devuelve o destruye de forma segura los materiales confidenciales de la otra, salvo las copias que la ley obligue a conservar.",
    },
    {
      heading: "Ley aplicable",
      summary: "Finlandia primero, salvo que elijas otro país.",
      body: "Este acuerdo se rige por las leyes de [GOVERNING_LAW]. Las disputas se tratan primero de buena fe. Si no hay acuerdo, son competentes los tribunales de ese país, salvo pacto escrito en contrario.",
    },
  ],
};

const MSA: SectionSet = {
  en: [
    {
      heading: "Parties",
      summary: "Who works with whom.",
      body: "This master services agreement is between [COMPANY_NAME] (“Company”), [COMPANY_ADDRESS][COMPANY_ID_LINE], and [FREELANCER_NAME] (“Contractor”).",
    },
    {
      heading: "The relationship",
      summary: "A frame for ongoing work, not one project.",
      body: "The Contractor provides professional services described in statements of work. This agreement sets the shared rules. Each project can have its own statement of work.",
    },
    {
      heading: "How we pay",
      summary: "Clear invoices, paid on the agreed terms.",
      body: "The Company pays valid invoices according to [PAYMENT_TERMS]. Fees are due on the VAT-exclusive amount unless a statement of work says otherwise.",
    },
    {
      heading: "Independent contractor",
      summary: "Not an employee, partner, or agent.",
      body: "The Contractor is an independent contractor, not an employee of the Company, and is responsible for their own taxes, insurance, and working methods, within the law.",
    },
    {
      heading: "How this ends",
      summary: "Either side can stop with notice.",
      body: "Either party may end this agreement with [NOTICE_PERIOD] written notice. Work already done is paid. Confidentiality and other clauses that should survive, survive.",
    },
    {
      heading: "Governing law",
      summary: "Finland-first, unless you choose another country.",
      body: "This agreement is governed by the laws of [GOVERNING_LAW]. It starts on [START_DATE].",
    },
  ],
  fi: [
    {
      heading: "Osapuolet",
      summary: "Kuka tekee töitä kenen kanssa.",
      body: "Tämä puitesopimus on [COMPANY_NAME] (“Yritys”), [COMPANY_ADDRESS][COMPANY_ID_LINE], ja [FREELANCER_NAME] (“Urakoitsija”) välillä.",
    },
    {
      heading: "Yhteistyö",
      summary: "Kehys jatkuvalle työlle, ei yhdelle hankkeelle.",
      body: "Urakoitsija tekee ammattityötä, joka kuvataan työtilauksissa. Tämä sopimus asettaa yhteiset säännöt. Jokaisella hankkeella voi olla oma työtilaus.",
    },
    {
      heading: "Maksu",
      summary: "Selkeät laskut, maksetaan sovituin ehdoin.",
      body: "Yritys maksaa asianmukaiset laskut ehdoin [PAYMENT_TERMS]. Palkkiot koskevat ALV:tonta määrää, jollei työtilaus toisin sano.",
    },
    {
      heading: "Itsenäinen urakoitsija",
      summary: "Ei työntekijä, osakas eikä edustaja.",
      body: "Urakoitsija on itsenäinen urakoitsija, ei Yrityksen työntekijä, ja vastaa omista veroistaan, vakuutuksistaan ja työtavoistaan lain puitteissa.",
    },
    {
      heading: "Päättäminen",
      summary: "Kumpikin voi lopettaa irtisanomisajalla.",
      body: "Kumpikin voi päättää tämän sopimuksen [NOTICE_PERIOD] kirjallisella ilmoituksella. Tehty työ maksetaan. Salassapito ja muut ehdot, joiden tulee jäädä voimaan, jäävät.",
    },
    {
      heading: "Sovellettava laki",
      summary: "Suomi ensisijaisesti, ellei toista maata valita.",
      body: "Tähän sopimukseen sovelletaan [GOVERNING_LAW] lakia. Se alkaa [START_DATE].",
    },
  ],
  de: [
    {
      heading: "Parteien",
      summary: "Wer mit wem arbeitet.",
      body: "Dieser Rahmenvertrag gilt zwischen [COMPANY_NAME] („Unternehmen“), [COMPANY_ADDRESS][COMPANY_ID_LINE], und [FREELANCER_NAME] („Auftragnehmer“).",
    },
    {
      heading: "Zusammenarbeit",
      summary: "Rahmen für laufende Arbeit, nicht ein einzelnes Projekt.",
      body: "Der Auftragnehmer erbringt Leistungen, die in Leistungsbeschreibungen stehen. Dieser Vertrag setzt die gemeinsamen Regeln. Jedes Projekt kann eine eigene Leistungsbeschreibung haben.",
    },
    {
      heading: "Zahlung",
      summary: "Klare Rechnungen, gezahlt nach den vereinbarten Bedingungen.",
      body: "Das Unternehmen zahlt gültige Rechnungen gemäß [PAYMENT_TERMS]. Honorare beziehen sich auf den Nettobetrag, sofern die Leistungsbeschreibung nichts anderes sagt.",
    },
    {
      heading: "Selbstständiger Auftragnehmer",
      summary: "Kein Arbeitnehmer, Gesellschafter oder Vertreter.",
      body: "Der Auftragnehmer ist selbstständig, kein Arbeitnehmer des Unternehmens, und verantwortlich für Steuern, Versicherung und Arbeitsweise im Rahmen des Gesetzes.",
    },
    {
      heading: "Beendigung",
      summary: "Jede Seite kann mit Frist kündigen.",
      body: "Jede Partei kann diesen Vertrag mit [NOTICE_PERIOD] schriftlicher Frist beenden. Erbrachte Arbeit wird bezahlt. Vertraulichkeit und andere fortgeltende Klauseln bleiben.",
    },
    {
      heading: "Anwendbares Recht",
      summary: "Finnland zuerst, sofern kein anderes Land gewählt wird.",
      body: "Es gilt das Recht von [GOVERNING_LAW]. Der Vertrag beginnt am [START_DATE].",
    },
  ],
  fr: [
    {
      heading: "Parties",
      summary: "Qui travaille avec qui.",
      body: "Cet accord-cadre est conclu entre [COMPANY_NAME] (« l’Entreprise »), [COMPANY_ADDRESS][COMPANY_ID_LINE], et [FREELANCER_NAME] (« le Prestataire »).",
    },
    {
      heading: "La relation",
      summary: "Un cadre pour un travail continu, pas un seul projet.",
      body: "Le Prestataire fournit des services décrits dans des bons de commande. Cet accord pose les règles communes. Chaque projet peut avoir son propre bon de commande.",
    },
    {
      heading: "Paiement",
      summary: "Des factures claires, payées selon les délais convenus.",
      body: "L’Entreprise paie les factures valides selon [PAYMENT_TERMS]. Les honoraires portent sur le montant hors TVA sauf mention contraire.",
    },
    {
      heading: "Prestataire indépendant",
      summary: "Ni salarié, ni associé, ni mandataire.",
      body: "Le Prestataire est indépendant, n’est pas salarié de l’Entreprise, et assume ses impôts, assurances et méthodes de travail, dans le respect de la loi.",
    },
    {
      heading: "Fin du contrat",
      summary: "Chaque partie peut arrêter avec un préavis.",
      body: "Chaque partie peut mettre fin à cet accord avec un préavis écrit de [NOTICE_PERIOD]. Le travail déjà fait est payé. La confidentialité et les clauses destinées à survivre survivent.",
    },
    {
      heading: "Droit applicable",
      summary: "La Finlande d’abord, sauf autre pays choisi.",
      body: "Cet accord est régi par le droit de [GOVERNING_LAW]. Il commence le [START_DATE].",
    },
  ],
  es: [
    {
      heading: "Partes",
      summary: "Quién trabaja con quién.",
      body: "Este acuerdo marco se celebra entre [COMPANY_NAME] («la Empresa»), [COMPANY_ADDRESS][COMPANY_ID_LINE], y [FREELANCER_NAME] («el Contratista»).",
    },
    {
      heading: "La relación",
      summary: "Un marco para trabajo continuo, no un solo proyecto.",
      body: "El Contratista presta servicios profesionales descritos en órdenes de trabajo. Este acuerdo fija las reglas comunes. Cada proyecto puede tener su propia orden.",
    },
    {
      heading: "Pago",
      summary: "Facturas claras, pagadas en los plazos acordados.",
      body: "La Empresa paga las facturas válidas según [PAYMENT_TERMS]. Los honorarios se refieren al importe sin IVA salvo que la orden diga otra cosa.",
    },
    {
      heading: "Contratista independiente",
      summary: "No es empleado, socio ni agente.",
      body: "El Contratista es independiente, no empleado de la Empresa, y responde de sus impuestos, seguros y forma de trabajar, dentro de la ley.",
    },
    {
      heading: "Cómo termina",
      summary: "Cualquiera puede acabar con preaviso.",
      body: "Cualquiera de las partes puede terminar este acuerdo con [NOTICE_PERIOD] de preaviso escrito. El trabajo ya hecho se paga. La confidencialidad y las cláusulas que deban sobrevivir, sobreviven.",
    },
    {
      heading: "Ley aplicable",
      summary: "Finlandia primero, salvo que elijas otro país.",
      body: "Este acuerdo se rige por las leyes de [GOVERNING_LAW]. Empieza el [START_DATE].",
    },
  ],
};

const SOW: SectionSet = {
  en: [
    {
      heading: "Parties and project",
      summary: "This statement of work is for one defined project.",
      body: "This statement of work is between [COMPANY_NAME] (“Company”), [COMPANY_ADDRESS][COMPANY_ID_LINE], and [FREELANCER_NAME] (“Contractor”) for [PROJECT_NAME]. It starts on [START_DATE].",
    },
    {
      heading: "Deliverables",
      summary: "What will be handed over.",
      body: "[DELIVERABLES]",
    },
    {
      heading: "Timeline",
      summary: "When the work happens.",
      body: "The work follows this timeline: [TIMELINE].",
    },
    {
      heading: "Fee",
      summary: "What the Company pays for this work.",
      body: "The Company pays the Contractor [AMOUNT] for the services in this statement of work, plus any VAT that applies.",
    },
    {
      heading: "Acceptance",
      summary: "A short, fair window to raise issues.",
      body: "Deliverables are accepted unless the Company sends written objections within five business days of delivery. Silence after that window is acceptance.",
    },
    {
      heading: "Governing law",
      summary: "Finland-first, unless you choose another country.",
      body: "This statement of work is governed by the laws of [GOVERNING_LAW].",
    },
  ],
  fi: [
    {
      heading: "Osapuolet ja hanke",
      summary: "Tämä työtilaus koskee yhtä määriteltyä hanketta.",
      body: "Tämä työtilaus on [COMPANY_NAME] (“Yritys”), [COMPANY_ADDRESS][COMPANY_ID_LINE], ja [FREELANCER_NAME] (“Urakoitsija”) välillä hankkeessa [PROJECT_NAME]. Se alkaa [START_DATE].",
    },
    { heading: "Toimitukset", summary: "Mitä luovutetaan.", body: "[DELIVERABLES]" },
    { heading: "Aikataulu", summary: "Milloin työ tehdään.", body: "Työ noudattaa tätä aikataulua: [TIMELINE]." },
    {
      heading: "Palkkio",
      summary: "Mitä Yritys maksaa tästä työstä.",
      body: "Yritys maksaa Urakoitsijalle [AMOUNT] tämän työtilauksen palveluista, plus mahdollinen ALV.",
    },
    {
      heading: "Hyväksyntä",
      summary: "Lyhyt, reilu aika nostaa huomautuksia.",
      body: "Toimitukset hyväksytään, jollei Yritys lähetä kirjallisia huomautuksia viiden arkipäivän kuluessa. Hiljaisuus sen jälkeen on hyväksyntä.",
    },
    {
      heading: "Sovellettava laki",
      summary: "Suomi ensisijaisesti, ellei toista maata valita.",
      body: "Tähän työtilaukseen sovelletaan [GOVERNING_LAW] lakia.",
    },
  ],
  de: [
    {
      heading: "Parteien und Projekt",
      summary: "Diese Leistungsbeschreibung gilt für ein definiertes Projekt.",
      body: "Diese Leistungsbeschreibung gilt zwischen [COMPANY_NAME] („Unternehmen“), [COMPANY_ADDRESS][COMPANY_ID_LINE], und [FREELANCER_NAME] („Auftragnehmer“) für [PROJECT_NAME]. Beginn: [START_DATE].",
    },
    { heading: "Liefergegenstände", summary: "Was übergeben wird.", body: "[DELIVERABLES]" },
    { heading: "Zeitplan", summary: "Wann die Arbeit stattfindet.", body: "Die Arbeit folgt diesem Zeitplan: [TIMELINE]." },
    {
      heading: "Honorar",
      summary: "Was das Unternehmen für diese Arbeit zahlt.",
      body: "Das Unternehmen zahlt dem Auftragnehmer [AMOUNT] für die Leistungen in dieser Beschreibung, zuzüglich etwaiger MwSt.",
    },
    {
      heading: "Abnahme",
      summary: "Ein kurzes, faires Fenster für Einwände.",
      body: "Liefergegenstände gelten als abgenommen, wenn das Unternehmen nicht innerhalb von fünf Werktagen schriftlich widerspricht. Schweigen danach ist Abnahme.",
    },
    {
      heading: "Anwendbares Recht",
      summary: "Finnland zuerst, sofern kein anderes Land gewählt wird.",
      body: "Es gilt das Recht von [GOVERNING_LAW].",
    },
  ],
  fr: [
    {
      heading: "Parties et projet",
      summary: "Ce bon de commande concerne un projet défini.",
      body: "Ce bon de commande est conclu entre [COMPANY_NAME] (« l’Entreprise »), [COMPANY_ADDRESS][COMPANY_ID_LINE], et [FREELANCER_NAME] (« le Prestataire ») pour [PROJECT_NAME]. Il commence le [START_DATE].",
    },
    { heading: "Livrables", summary: "Ce qui sera remis.", body: "[DELIVERABLES]" },
    { heading: "Calendrier", summary: "Quand le travail a lieu.", body: "Le travail suit ce calendrier : [TIMELINE]." },
    {
      heading: "Honoraires",
      summary: "Ce que l’Entreprise paie pour ce travail.",
      body: "L’Entreprise paie au Prestataire [AMOUNT] pour les services de ce bon de commande, plus la TVA applicable.",
    },
    {
      heading: "Acceptation",
      summary: "Un délai court et équitable pour signaler un problème.",
      body: "Les livrables sont acceptés sauf objection écrite de l’Entreprise dans les cinq jours ouvrés. Le silence après ce délai vaut acceptation.",
    },
    {
      heading: "Droit applicable",
      summary: "La Finlande d’abord, sauf autre pays choisi.",
      body: "Ce bon de commande est régi par le droit de [GOVERNING_LAW].",
    },
  ],
  es: [
    {
      heading: "Partes y proyecto",
      summary: "Esta orden de trabajo es para un proyecto definido.",
      body: "Esta orden de trabajo se celebra entre [COMPANY_NAME] («la Empresa»), [COMPANY_ADDRESS][COMPANY_ID_LINE], y [FREELANCER_NAME] («el Contratista») para [PROJECT_NAME]. Empieza el [START_DATE].",
    },
    { heading: "Entregables", summary: "Qué se entregará.", body: "[DELIVERABLES]" },
    { heading: "Calendario", summary: "Cuándo ocurre el trabajo.", body: "El trabajo sigue este calendario: [TIMELINE]." },
    {
      heading: "Honorarios",
      summary: "Lo que la Empresa paga por este trabajo.",
      body: "La Empresa paga al Contratista [AMOUNT] por los servicios de esta orden, más el IVA que corresponda.",
    },
    {
      heading: "Aceptación",
      summary: "Una ventana breve y justa para plantear problemas.",
      body: "Los entregables se aceptan salvo objeción escrita de la Empresa en cinco días hábiles. El silencio después es aceptación.",
    },
    {
      heading: "Ley aplicable",
      summary: "Finlandia primero, salvo que elijas otro país.",
      body: "Esta orden se rige por las leyes de [GOVERNING_LAW].",
    },
  ],
};

const ICA: SectionSet = {
  en: [
    {
      heading: "Parties",
      summary: "A contractor relationship, not employment.",
      body: "This independent contractor agreement is between [COMPANY_NAME] (“Company”), [COMPANY_ADDRESS][COMPANY_ID_LINE], and [FREELANCER_NAME] (“Contractor”). It starts on [START_DATE].",
    },
    {
      heading: "Status",
      summary: "You invoice. You are not on payroll.",
      body: "The Contractor is engaged as an independent contractor, not as an employee, and is responsible for their own taxes, pensions, and benefits under the law of their tax residency.",
    },
    {
      heading: "Compensation",
      summary: "The agreed rate for the work.",
      body: "The Company pays the Contractor [RATE], invoiced as agreed. RemoteWise fees, if any, are shown before an invoice is sent.",
    },
    {
      heading: "Work product",
      summary: "What happens to the work you create.",
      body: "Unless a clause below says otherwise, work product created for the Company under this agreement is used by the Company for its business. Pre-existing tools stay with the Contractor.",
    },
    {
      heading: "Governing law",
      summary: "Finland-first, unless you choose another country.",
      body: "This agreement is governed by the laws of [GOVERNING_LAW].",
    },
  ],
  fi: [
    {
      heading: "Osapuolet",
      summary: "Urakkasuhde, ei työsuhde.",
      body: "Tämä itsenäisen urakoitsijan sopimus on [COMPANY_NAME] (“Yritys”), [COMPANY_ADDRESS][COMPANY_ID_LINE], ja [FREELANCER_NAME] (“Urakoitsija”) välillä. Se alkaa [START_DATE].",
    },
    {
      heading: "Asema",
      summary: "Laskutat. Et ole palkkalistoilla.",
      body: "Urakoitsija toimii itsenäisenä urakoitsijana, ei työntekijänä, ja vastaa veroistaan, eläkkeistään ja eduistaan verotusmaansa lain mukaan.",
    },
    {
      heading: "Palkkio",
      summary: "Sovittu hinta työstä.",
      body: "Yritys maksaa Urakoitsijalle [RATE], laskutettuna sovitusti. RemoteWisen palkkiot, jos niitä on, näkyvät ennen laskun lähettämistä.",
    },
    {
      heading: "Työn tulos",
      summary: "Mitä luodulle työlle tapahtuu.",
      body: "Jollei alla oleva ehto toisin sano, Yritys saa käyttää tähän sopimukseen perustuvaa työtä liiketoiminnassaan. Aiemmat työkalut jäävät Urakoitsijalle.",
    },
    {
      heading: "Sovellettava laki",
      summary: "Suomi ensisijaisesti, ellei toista maata valita.",
      body: "Tähän sopimukseen sovelletaan [GOVERNING_LAW] lakia.",
    },
  ],
  de: [
    {
      heading: "Parteien",
      summary: "Auftrag, kein Arbeitsverhältnis.",
      body: "Dieser Vertrag über selbstständige Leistung gilt zwischen [COMPANY_NAME] („Unternehmen“), [COMPANY_ADDRESS][COMPANY_ID_LINE], und [FREELANCER_NAME] („Auftragnehmer“). Beginn: [START_DATE].",
    },
    {
      heading: "Status",
      summary: "Sie stellen Rechnungen. Sie sind nicht angestellt.",
      body: "Der Auftragnehmer ist selbstständig, kein Arbeitnehmer, und verantwortlich für Steuern, Rente und Sozialleistungen nach dem Recht seines Steuerwohnsitzes.",
    },
    {
      heading: "Vergütung",
      summary: "Der vereinbarte Satz.",
      body: "Das Unternehmen zahlt dem Auftragnehmer [RATE], abgerechnet wie vereinbart. RemoteWise-Gebühren, falls vorhanden, sind vor dem Rechnungsversand sichtbar.",
    },
    {
      heading: "Arbeitsergebnis",
      summary: "Was mit der erstellten Arbeit geschieht.",
      body: "Soweit unten nichts anderes steht, darf das Unternehmen die unter diesem Vertrag erstellte Arbeit geschäftlich nutzen. Vorbestehende Werkzeuge bleiben beim Auftragnehmer.",
    },
    {
      heading: "Anwendbares Recht",
      summary: "Finnland zuerst, sofern kein anderes Land gewählt wird.",
      body: "Es gilt das Recht von [GOVERNING_LAW].",
    },
  ],
  fr: [
    {
      heading: "Parties",
      summary: "Une relation de prestataire, pas un contrat de travail.",
      body: "Cet accord de prestataire indépendant est conclu entre [COMPANY_NAME] (« l’Entreprise »), [COMPANY_ADDRESS][COMPANY_ID_LINE], et [FREELANCER_NAME] (« le Prestataire »). Il commence le [START_DATE].",
    },
    {
      heading: "Statut",
      summary: "Vous facturez. Vous n’êtes pas salarié.",
      body: "Le Prestataire est indépendant, n’est pas salarié, et assume impôts, retraite et protections selon le droit de sa résidence fiscale.",
    },
    {
      heading: "Rémunération",
      summary: "Le tarif convenu.",
      body: "L’Entreprise paie le Prestataire [RATE], facturé comme convenu. Les frais RemoteWise, s’il y en a, sont visibles avant l’envoi de la facture.",
    },
    {
      heading: "Livrables",
      summary: "Ce qu’il advient du travail créé.",
      body: "Sauf clause contraire ci-dessous, l’Entreprise peut utiliser le travail créé au titre de cet accord. Les outils préexistants restent au Prestataire.",
    },
    {
      heading: "Droit applicable",
      summary: "La Finlande d’abord, sauf autre pays choisi.",
      body: "Cet accord est régi par le droit de [GOVERNING_LAW].",
    },
  ],
  es: [
    {
      heading: "Partes",
      summary: "Relación de contratista, no laboral.",
      body: "Este acuerdo de contratista independiente se celebra entre [COMPANY_NAME] («la Empresa»), [COMPANY_ADDRESS][COMPANY_ID_LINE], y [FREELANCER_NAME] («el Contratista»). Empieza el [START_DATE].",
    },
    {
      heading: "Estatus",
      summary: "Facturas. No estás en nómina.",
      body: "El Contratista actúa como independiente, no como empleado, y responde de impuestos, pensiones y prestaciones según la ley de su residencia fiscal.",
    },
    {
      heading: "Compensación",
      summary: "La tarifa acordada.",
      body: "La Empresa paga al Contratista [RATE], facturado como se acuerde. Las comisiones de RemoteWise, si las hay, se ven antes de enviar la factura.",
    },
    {
      heading: "Resultado del trabajo",
      summary: "Qué ocurre con lo que creas.",
      body: "Salvo que una cláusula siguiente diga otra cosa, la Empresa puede usar el trabajo creado bajo este acuerdo. Las herramientas previas siguen siendo del Contratista.",
    },
    {
      heading: "Ley aplicable",
      summary: "Finlandia primero, salvo que elijas otro país.",
      body: "Este acuerdo se rige por las leyes de [GOVERNING_LAW].",
    },
  ],
};

const BLANK: SectionSet = {
  en: [
    {
      heading: "Parties",
      summary: "Who this agreement is between.",
      body: "This agreement is between [COMPANY_NAME] (“Company”), [COMPANY_ADDRESS][COMPANY_ID_LINE], and [FREELANCER_NAME] (“Freelancer”). It starts on [START_DATE].",
    },
    {
      heading: "What this covers",
      summary: "The scope you wrote.",
      body: "[SCOPE]",
    },
    {
      heading: "Governing law",
      summary: "Finland-first, unless you choose another country.",
      body: "This agreement is governed by the laws of [GOVERNING_LAW].",
    },
  ],
  fi: [
    {
      heading: "Osapuolet",
      summary: "Keiden välillä tämä sopimus on.",
      body: "Tämä sopimus on [COMPANY_NAME] (“Yritys”), [COMPANY_ADDRESS][COMPANY_ID_LINE], ja [FREELANCER_NAME] (“Freelancer”) välillä. Se alkaa [START_DATE].",
    },
    { heading: "Mitä tämä kattaa", summary: "Itse kirjoitettu sisältö.", body: "[SCOPE]" },
    {
      heading: "Sovellettava laki",
      summary: "Suomi ensisijaisesti, ellei toista maata valita.",
      body: "Tähän sopimukseen sovelletaan [GOVERNING_LAW] lakia.",
    },
  ],
  de: [
    {
      heading: "Parteien",
      summary: "Zwischen wem diese Vereinbarung gilt.",
      body: "Diese Vereinbarung gilt zwischen [COMPANY_NAME] („Unternehmen“), [COMPANY_ADDRESS][COMPANY_ID_LINE], und [FREELANCER_NAME] („Freelancer“). Beginn: [START_DATE].",
    },
    { heading: "Umfang", summary: "Der von Ihnen geschriebene Inhalt.", body: "[SCOPE]" },
    {
      heading: "Anwendbares Recht",
      summary: "Finnland zuerst, sofern kein anderes Land gewählt wird.",
      body: "Es gilt das Recht von [GOVERNING_LAW].",
    },
  ],
  fr: [
    {
      heading: "Parties",
      summary: "Entre qui cet accord est conclu.",
      body: "Cet accord est conclu entre [COMPANY_NAME] (« l’Entreprise »), [COMPANY_ADDRESS][COMPANY_ID_LINE], et [FREELANCER_NAME] (« le Freelance »). Il commence le [START_DATE].",
    },
    { heading: "Périmètre", summary: "Le texte que vous avez rédigé.", body: "[SCOPE]" },
    {
      heading: "Droit applicable",
      summary: "La Finlande d’abord, sauf autre pays choisi.",
      body: "Cet accord est régi par le droit de [GOVERNING_LAW].",
    },
  ],
  es: [
    {
      heading: "Partes",
      summary: "Entre quiénes se celebra este acuerdo.",
      body: "Este acuerdo se celebra entre [COMPANY_NAME] («la Empresa»), [COMPANY_ADDRESS][COMPANY_ID_LINE], y [FREELANCER_NAME] («el Freelance»). Empieza el [START_DATE].",
    },
    { heading: "Alcance", summary: "El texto que has escrito.", body: "[SCOPE]" },
    {
      heading: "Ley aplicable",
      summary: "Finlandia primero, salvo que elijas otro país.",
      body: "Este acuerdo se rige por las leyes de [GOVERNING_LAW].",
    },
  ],
};

const SETS: Record<TemplateId, SectionSet> = {
  nda: NDA,
  msa: MSA,
  sow: SOW,
  ica: ICA,
  blank: BLANK,
};

export const TEMPLATE_VARIABLES: Record<TemplateId, string[]> = {
  nda: ["DURATION"],
  msa: ["PAYMENT_TERMS", "NOTICE_PERIOD"],
  sow: ["PROJECT_NAME", "DELIVERABLES", "TIMELINE", "AMOUNT"],
  ica: ["RATE"],
  blank: ["SCOPE"],
};

export function templateSections(id: TemplateId, lang: ContractLanguage, vars: Record<string, string>): ContractSection[] {
  const rows = SETS[id][lang] ?? SETS[id].en;
  return rows.map((row) => ({
    heading: row.heading,
    summary: row.summary,
    body: fill(row.body, vars),
  }));
}

export function templateDisplayName(id: TemplateId, lang: ContractLanguage) {
  return typeCopy(id, lang).name;
}
