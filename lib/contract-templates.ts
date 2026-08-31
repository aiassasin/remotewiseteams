export type ContractTemplate = {
  id: string;
  name: string;
  type: "NDA" | "MSA" | "SOW" | "ICA" | "Custom";
  description: string;
  included: string[];
  readTime: string;
  body: string;
  variables: string[];
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: "nda",
    name: "NDA",
    type: "NDA",
    description:
      "A mutual non-disclosure agreement that protects confidential information on both sides.",
    included: ["Mutual confidentiality", "2-year default term", "Return of materials", "Governing law"],
    readTime: "~2 min read",
    variables: ["COMPANY_NAME", "FREELANCER_NAME", "DATE", "GOVERNING_LAW", "DURATION"],
    body: `This Mutual Non-Disclosure Agreement (“Agreement”) is entered into as of [DATE] by and between [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Freelancer”).

1. PURPOSE
The parties wish to explore a working relationship and may share confidential information.

2. CONFIDENTIALITY
Each party agrees to hold in confidence all non-public information received from the other for [DURATION], and not to disclose it to third parties without prior written consent.

3. EXCEPTIONS
Information is not confidential if it is public, independently developed, or required to be disclosed by law.

4. GOVERNING LAW
This Agreement is governed by the laws of [GOVERNING_LAW].`,
  },
  {
    id: "msa",
    name: "MSA",
    type: "MSA",
    description:
      "Defines the ongoing working relationship, payment terms, and notice period between company and freelancer.",
    included: ["Relationship terms", "Payment terms", "Notice period", "Liability cap"],
    readTime: "~3 min read",
    variables: ["COMPANY_NAME", "FREELANCER_NAME", "DATE", "PAYMENT_TERMS", "NOTICE_PERIOD"],
    body: `This Master Service Agreement (“Agreement”) is entered into as of [DATE] by and between [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Contractor”).

1. SERVICES
Contractor will provide professional services as described in one or more Statements of Work.

2. PAYMENT
Company will pay Contractor according to [PAYMENT_TERMS] after a valid invoice is received.

3. INDEPENDENT CONTRACTOR
Contractor is an independent contractor and not an employee, partner, or agent of Company.

4. TERMINATION
Either party may terminate this Agreement with [NOTICE_PERIOD] written notice.`,
  },
  {
    id: "sow",
    name: "SOW",
    type: "SOW",
    description:
      "A statement of work for a specific project: deliverables, timeline, and commercial amount.",
    included: ["Project scope", "Deliverables", "Timeline", "Fixed or hourly amount"],
    readTime: "~2 min read",
    variables: ["COMPANY_NAME", "FREELANCER_NAME", "PROJECT_NAME", "DELIVERABLES", "TIMELINE", "AMOUNT"],
    body: `This Statement of Work (“SOW”) is entered into by [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Contractor”) for [PROJECT_NAME].

1. DELIVERABLES
[DELIVERABLES]

2. TIMELINE
Work will be performed according to the following timeline: [TIMELINE].

3. FEES
Company will pay Contractor [AMOUNT] for the services described in this SOW.

4. ACCEPTANCE
Deliverables are accepted unless Company provides written objections within five business days.`,
  },
  {
    id: "ica",
    name: "Independent Contractor Agreement",
    type: "ICA",
    description:
      "Clarifies contractor (not employee) status, rate, and start date for ongoing engagements.",
    included: ["Contractor status", "Rate", "Start date", "IP assignment option"],
    readTime: "~3 min read",
    variables: ["COMPANY_NAME", "FREELANCER_NAME", "DATE", "RATE", "START_DATE"],
    body: `This Independent Contractor Agreement (“Agreement”) is made as of [DATE] between [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Contractor”).

1. STATUS
Contractor is engaged as an independent contractor, not as an employee, and is responsible for their own taxes and benefits.

2. COMPENSATION
Company will pay Contractor at the rate of [RATE], invoiced according to the applicable Statement of Work.

3. START DATE
Services commence on [START_DATE].

4. INTELLECTUAL PROPERTY
Work product created for Company is assigned to Company upon payment, unless otherwise agreed in writing.`,
  },
];

export function getTemplate(id: string) {
  if (id === "blank") {
    return {
      id: "blank",
      name: "Custom contract",
      type: "Custom" as const,
      description: "Write a custom contract from scratch.",
      included: ["Your own clauses"],
      readTime: "Flexible",
      variables: ["COMPANY_NAME", "FREELANCER_NAME", "DATE"],
      body: `This Agreement is entered into as of [DATE] by [COMPANY_NAME] and [FREELANCER_NAME].

1. SCOPE
Describe the services here.`,
    } satisfies (typeof CONTRACT_TEMPLATES)[number];
  }
  return CONTRACT_TEMPLATES.find((item) => item.id === id) ?? null;
}

export function fillTemplate(body: string, variables: Record<string, string>) {
  return body.replace(/\[([A-Z_]+)\]/g, (match, key: string) => variables[key] || match);
}
