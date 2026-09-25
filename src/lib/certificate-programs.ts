/**
 * Certificate programs.
 *
 * Every page at /certificate-programs/[slug] is rendered from one entry here. The
 * slug, label and icon come from `certificatePrograms` in src/lib/site.ts (the
 * header menu), so a menu card can never point at a page that does not exist.
 *
 * Each program is the certificate track of an existing course: syllabus, tools,
 * projects, batches, fees and reviews are read from that course in
 * src/lib/courses.ts, so the course page and the certificate page never disagree.
 * Only certificate-specific copy — what is certified, how it is assessed, where
 * the certificate is used — lives in this file.
 */

import { getCourse, type Course } from "@/lib/courses";
import { certificatePrograms, type CertificateMenuItem } from "@/lib/site";

export type AssessmentPart = { part: string; weight: number; checks: string };

type CertificateDetails = {
  /** Slug of the course in src/lib/courses.ts this certificate is issued for. */
  courseSlug: string;
  /** H1. Keep the city: these are local-search pages. */
  title: string;
  /** Exact wording printed on the certificate. */
  credential: string;
  /** Prefix of the registration number printed on the certificate. */
  code: string;
  tagline: string;
  /** Two short paragraphs for the overview. */
  summary: string[];
  seo: { title: string; description: string; keywords: string[] };
  /** Skills the certificate states you have — each one is tested. */
  skills: string[];
  /** Weights must add up to 100. */
  assessment: AssessmentPart[];
  passMark: string;
  /** Where students actually use this certificate. */
  usedFor: string[];
  faqs: [question: string, answer: string][];
};

export type CertificateProgram = CertificateMenuItem & CertificateDetails & { course: Course };

/** FAQs appended to every certificate program. Program-specific FAQs come first. */
export const COMMON_FAQS: [string, string][] = [
  [
    "How can an employer verify my certificate?",
    "Every certificate carries a registration number. An employer can call the institute or email us that number and we confirm your name, the program, the modules completed and your result from our records.",
  ],
  [
    "What happens if I do not pass the final assessment?",
    "You get one free re-test within 30 days. The trainer tells you which parts fell short and books extra lab time before the re-test so you can practise them.",
  ],
  [
    "Is the certificate issued for attendance alone?",
    "No. The certificate is issued only after the practical assessment is passed. Attendance of at least 75% is required to sit the assessment.",
  ],
];

const details: Record<string, CertificateDetails> = {
  "basic-computer-certificate-program-in-jalandhar": {
    courseSlug: "basic-computer-course-in-jalandhar",
    title: "Basic Computer Certificate Program in Jalandhar",
    credential: "Certificate in Computer Fundamentals",
    code: "GIT-CF",
    tagline: "A verifiable certificate that proves you can use a computer, the internet and office basics at work.",
    summary: [
      "The Basic Computer certificate program is for anyone who needs proof of computer skills for a job, a government form or a first office role. You learn on your own computer in every class and are tested on practical tasks, not multiple-choice questions.",
      "In two months you move from switching on a computer to typing documents, managing files, using email and online services safely, and preparing simple sheets and presentations.",
    ],
    seo: {
      title: "Basic Computer Certificate Program in Jalandhar | Practical Test & Verifiable Certificate",
      description:
        "Two-month Basic Computer certificate program in Jalandhar. Windows, internet, email, Word, Excel and PowerPoint basics with a practical assessment and a verifiable certificate.",
      keywords: ["basic computer certificate jalandhar", "computer certificate course jalandhar", "computer fundamentals certificate punjab"],
    },
    skills: [
      "Operate Windows: files, folders, settings and printing",
      "Use the internet, email and online forms safely",
      "Type and format letters and applications in Word",
      "Build simple tables and totals in Excel",
      "Make a short PowerPoint presentation",
      "Scan, save and upload documents in the right format",
    ],
    assessment: [
      { part: "Practical tasks", weight: 60, checks: "Timed tasks on Windows, Word, Excel and email on a lab computer" },
      { part: "Module files", weight: 25, checks: "Practical files submitted after each module, checked by the trainer" },
      { part: "Viva", weight: 15, checks: "Short spoken questions on what you did and why" },
    ],
    passMark: "50% overall, with at least 40% in practical tasks",
    usedFor: ["Clerical and data-entry job applications", "Government and semi-government forms that ask for a computer certificate", "Shop, reception and front-office roles", "The base for MS Office, Tally or typing certificates"],
    faqs: [
      ["I have never used a computer. Can I join?", "Yes. The program starts from holding the mouse and switching the computer on. Most students in each batch are first-time users."],
      ["Is this certificate enough for a government job form?", "It is accepted wherever a basic computer certificate from a registered institute is asked for. Where a specific board or university certificate is required, the counsellor will tell you before admission."],
    ],
  },

  "ms-office-certificate-program-in-jalandhar": {
    courseSlug: "ms-office-course-in-jalandhar",
    title: "MS Office Certificate Program in Jalandhar",
    credential: "Certificate in Microsoft Office Applications",
    code: "GIT-MSO",
    tagline: "Word, Excel, PowerPoint and Outlook certified on real office tasks — the skills every office job lists.",
    summary: [
      "The MS Office certificate program certifies that you can produce the documents, sheets and presentations an office runs on. Every skill on the certificate is tested on a practical task set by your trainer.",
      "Over three months you work through Word, Excel, PowerPoint and Outlook with office-style assignments: letters, reports, salary sheets, price lists and presentations.",
    ],
    seo: {
      title: "MS Office Certificate Program in Jalandhar | Word, Excel, PowerPoint",
      description:
        "Three-month MS Office certificate program in Jalandhar. Word, Excel, PowerPoint and Outlook with practical assessment, verifiable certificate and placement support.",
      keywords: ["ms office certificate jalandhar", "ms office course certificate punjab", "word excel powerpoint certificate jalandhar"],
    },
    skills: [
      "Format professional letters, reports and CVs in Word",
      "Use mail merge for bulk letters and labels",
      "Build Excel sheets with formulas, sorting and charts",
      "Design a clear PowerPoint presentation",
      "Manage mail, calendar and contacts in Outlook",
      "Share, protect and print Office files correctly",
    ],
    assessment: [
      { part: "Practical tasks", weight: 60, checks: "Timed Word, Excel and PowerPoint tasks on a lab computer" },
      { part: "Office project", weight: 25, checks: "A complete office file set: letter, sheet and presentation" },
      { part: "Viva", weight: 15, checks: "Questions on the tools used and the choices made" },
    ],
    passMark: "50% overall, with at least 40% in practical tasks",
    usedFor: ["Office assistant and back-office job applications", "Computer-operator posts that ask for an MS Office certificate", "Teachers and staff preparing school or office records", "Progression to the Advance Excel certificate"],
    faqs: [
      ["Which version of Office is taught?", "The current Microsoft 365 desktop apps. Everything taught also works in Office 2019 and 2021, which most offices in Jalandhar still use."],
      ["Do I need to know basic computer first?", "Basic comfort with a mouse and keyboard is enough. If you are a first-time user the counsellor will suggest starting with the Basic Computer certificate."],
    ],
  },

  "advance-excel-certificate-program-in-jalandhar": {
    courseSlug: "advance-excel-course-in-jalandhar",
    title: "Advance Excel Certificate Program in Jalandhar",
    credential: "Certificate in Advanced Excel & MIS Reporting",
    code: "GIT-AXL",
    tagline: "Lookups, pivots, dashboards and MIS reports — certified on real business data.",
    summary: [
      "The Advance Excel certificate program certifies the spreadsheet skills that MIS, accounts and operations roles test for in interviews: lookups, pivot tables, data cleaning and dashboards.",
      "You work on real sales, stock and attendance data throughout, and the final assessment is an MIS report you build from a raw data file in a fixed time.",
    ],
    seo: {
      title: "Advance Excel Certificate Program in Jalandhar | MIS, Pivot Tables & Dashboards",
      description:
        "Advance Excel certificate program in Jalandhar. XLOOKUP, pivot tables, Power Query, dashboards and MIS reporting with a timed practical assessment and a verifiable certificate.",
      keywords: ["advance excel certificate jalandhar", "mis reporting certificate punjab", "excel dashboard course jalandhar"],
    },
    skills: [
      "Use VLOOKUP, XLOOKUP, INDEX-MATCH and nested IF",
      "Clean and combine data with Power Query",
      "Summarise data with pivot tables and slicers",
      "Build an interactive MIS dashboard",
      "Validate, protect and share workbooks",
      "Automate a repeated task with a recorded macro",
    ],
    assessment: [
      { part: "Timed MIS report", weight: 50, checks: "Build a report and dashboard from a raw data file in 90 minutes" },
      { part: "Formula test", weight: 30, checks: "Practical lookup, logic and date-formula problems" },
      { part: "Viva", weight: 20, checks: "Explain your report: sources, formulas and what it shows" },
    ],
    passMark: "55% overall, with at least 45% in the timed MIS report",
    usedFor: ["MIS executive and data-entry supervisor applications", "Accounts and inventory roles that test Excel in the interview", "Proof of skill for promotion in your current job", "Progression to analytics or AI programs"],
    faqs: [
      ["Do I need MS Office first?", "You should be comfortable with basic Excel: entering data, simple formulas and formatting. A 10-minute placement check at counselling confirms this."],
      ["Is VBA covered?", "Recorded macros and simple edits to them are covered. Full VBA programming is not part of this certificate."],
    ],
  },

  "tally-prime-erp-certificate-program-in-jalandhar": {
    courseSlug: "tally-prime-course-in-jalandhar",
    title: "Tally Prime / ERP Certificate Program in Jalandhar",
    credential: "Certificate in Computerised Accounting & GST",
    code: "GIT-TLY",
    tagline: "Tally Prime, GST returns, inventory and payroll — certified on a full year of company books.",
    summary: [
      "The Tally Prime / ERP certificate program certifies that you can keep a company's books in Tally Prime from opening balances to GST returns. It is built for accounts assistant and billing roles in local businesses and CA firms.",
      "The final assessment gives you a set of business transactions to enter, reconcile and report, exactly as an accounts desk would.",
    ],
    seo: {
      title: "Tally Prime / ERP Certificate Program in Jalandhar | GST, Inventory & Payroll",
      description:
        "Tally Prime / ERP certificate program in Jalandhar covering accounting vouchers, GST, inventory, payroll and reports with a practical assessment and verifiable certificate.",
      keywords: ["tally prime certificate jalandhar", "tally erp certificate course punjab", "gst tally certificate jalandhar"],
    },
    skills: [
      "Create a company, ledgers and groups in Tally Prime",
      "Enter sales, purchase, payment, receipt and journal vouchers",
      "Record GST invoices and prepare GSTR-1 and GSTR-3B data",
      "Manage stock items, godowns and batches",
      "Process payroll with PF and ESI",
      "Reconcile the bank and read trial balance, P&L and balance sheet",
    ],
    assessment: [
      { part: "Company books", weight: 55, checks: "Enter and reconcile a month of transactions for a trading company" },
      { part: "GST task", weight: 25, checks: "Prepare GST invoices and return data from given bills" },
      { part: "Viva", weight: 20, checks: "Explain entries, ledgers and reports as you would to a senior accountant" },
    ],
    passMark: "50% overall, with at least 45% in company books",
    usedFor: ["Accounts assistant and billing executive applications", "CA-firm article and junior accountant roles", "Keeping your own shop's or family business's books", "Proof of Tally skill for commerce students"],
    faqs: [
      ["Is this Tally Prime or Tally ERP 9?", "Tally Prime, the current version. Differences from ERP 9 are shown in class because some offices still run it."],
      ["Do I need a commerce background?", "No. The first module covers the accounting basics needed for Tally. Commerce students move faster through it."],
    ],
  },

  "punjabi-typing-certificate-program-in-jalandhar": {
    courseSlug: "punjabi-typing-course-in-jalandhar",
    title: "Punjabi Typing Certificate Program in Jalandhar",
    credential: "Certificate in Punjabi Typing (with speed record)",
    code: "GIT-PBT",
    tagline: "Raavi and Asees typing with your tested speed and accuracy printed on the certificate.",
    summary: [
      "The Punjabi Typing certificate program prepares you for clerk, typist and data-entry posts that set a Punjabi typing test. Your tested words-per-minute and accuracy are printed on the certificate.",
      "You practise on the same Unicode fonts and keyboard layouts used in Punjab government typing tests, with timed tests every week so you can see your speed rise.",
    ],
    seo: {
      title: "Punjabi Typing Certificate Program in Jalandhar | Raavi & Asees Speed Test",
      description:
        "Punjabi typing certificate program in Jalandhar with Raavi and Asees Unicode fonts, weekly speed tests and a certificate that records your tested speed and accuracy.",
      keywords: ["punjabi typing certificate jalandhar", "raavi typing course punjab", "punjabi typing test preparation jalandhar"],
    },
    skills: [
      "Touch-type Punjabi on the Raavi and Asees layouts",
      "Type at a tested speed with measured accuracy",
      "Convert legacy fonts to Unicode",
      "Format official Punjabi letters and notices",
      "Handle matras, half letters and punctuation correctly",
      "Sit a government-style timed typing test with confidence",
    ],
    assessment: [
      { part: "Timed speed test", weight: 60, checks: "Two 10-minute passages; speed and accuracy recorded" },
      { part: "Document task", weight: 25, checks: "Type and format an official Punjabi letter" },
      { part: "Font conversion", weight: 15, checks: "Convert and correct a legacy-font file to Unicode" },
    ],
    passMark: "Minimum 25 wpm at 92% accuracy; your actual speed is printed",
    usedFor: ["Punjab government clerk and typist recruitment tests", "Court, tehsil and municipal office typing work", "Data-entry jobs that require Punjabi", "Freelance typing of documents and books"],
    faqs: [
      ["What speed will I reach?", "Most students reach 25–35 words per minute in two months with daily practice. Your certificate prints the speed you actually achieved in the final test."],
      ["Does this prepare me for the PSSSB typing test?", "Yes. Practice passages, fonts and timing follow the pattern of Punjab recruitment typing tests."],
    ],
  },

  "cad-cam-certificate-program-in-jalandhar": {
    courseSlug: "cad-cam-course-in-jalandhar",
    title: "CAD / CAM Certificate Program in Jalandhar",
    credential: "Certificate in CAD / CAM Design",
    code: "GIT-CAD",
    tagline: "AutoCAD, SolidWorks and CNC basics, certified on real drawings for Jalandhar's manufacturing units.",
    summary: [
      "The CAD / CAM certificate program certifies the drawing and modelling skills that design offices and manufacturing units test for: 2D drafting, 3D part modelling, assemblies and preparing parts for CNC.",
      "Jalandhar's hand-tool, sports-goods and auto-parts industry hires for exactly these skills. The final assessment is a drawing set you produce from a real component.",
    ],
    seo: {
      title: "CAD / CAM Certificate Program in Jalandhar | AutoCAD, SolidWorks & CNC",
      description:
        "CAD / CAM certificate program in Jalandhar covering AutoCAD, SolidWorks, drawings, assemblies and CNC basics with a practical drawing assessment and verifiable certificate.",
      keywords: ["cad cam certificate jalandhar", "autocad certificate course punjab", "solidworks certificate jalandhar"],
    },
    skills: [
      "Draft accurate 2D drawings with dimensions in AutoCAD",
      "Model 3D parts and assemblies in SolidWorks",
      "Produce manufacturing drawings to standard",
      "Read and apply GD&T basics",
      "Prepare a part and toolpath for CNC machining",
      "Print and export drawings for the shop floor",
    ],
    assessment: [
      { part: "Drawing set", weight: 50, checks: "Measure a real component and produce its 2D and 3D drawings" },
      { part: "Assembly task", weight: 30, checks: "Model and assemble a multi-part product with a drawing sheet" },
      { part: "Viva", weight: 20, checks: "Explain views, tolerances and manufacturing choices" },
    ],
    passMark: "55% overall, with at least 45% in the drawing set",
    usedFor: ["Draughtsman and CAD operator applications", "Design roles in hand-tool, sports-goods and auto-parts units", "Diploma and B.Tech mechanical students adding software proof", "Progression to the full CAD / CAM diploma"],
    faqs: [
      ["Is this the same as the CAD / CAM diploma?", "The certificate program uses the same syllabus and batches. It is issued as a certificate on passing the practical assessment described here; the course page lists the full diploma details."],
      ["Do I need an engineering background?", "ITI, diploma or 10+2 with maths is enough. Engineering drawing basics are covered in the first module."],
    ],
  },

  "english-typing-certificate-program-in-jalandhar": {
    courseSlug: "english-typing-course-in-jalandhar",
    title: "English Typing Certificate Program in Jalandhar",
    credential: "Certificate in English Typing (with speed record)",
    code: "GIT-ENT",
    tagline: "Touch typing with your tested speed and accuracy printed on the certificate.",
    summary: [
      "The English Typing certificate program prepares you for typist, clerk, steno and data-entry tests. Your tested words-per-minute and accuracy are printed on the certificate.",
      "You learn correct touch-typing technique first, then build speed with weekly timed tests on the passage styles used in SSC, court and Punjab recruitment tests.",
    ],
    seo: {
      title: "English Typing Certificate Program in Jalandhar | Speed Test & Certificate",
      description:
        "English typing certificate program in Jalandhar with touch-typing technique, weekly timed tests and a certificate that records your tested speed and accuracy.",
      keywords: ["english typing certificate jalandhar", "typing test preparation punjab", "typing speed certificate jalandhar"],
    },
    skills: [
      "Touch-type all keys without looking",
      "Type at a tested speed with measured accuracy",
      "Type numbers, symbols and tables correctly",
      "Format letters and reports to office standard",
      "Proofread and correct your own typing",
      "Sit a recruitment-style timed typing test",
    ],
    assessment: [
      { part: "Timed speed test", weight: 65, checks: "Two 10-minute passages; speed and accuracy recorded" },
      { part: "Document task", weight: 20, checks: "Type and format a letter with a table" },
      { part: "Proofreading", weight: 15, checks: "Find and correct errors in a typed passage" },
    ],
    passMark: "Minimum 30 wpm at 95% accuracy; your actual speed is printed",
    usedFor: ["SSC, court and Punjab clerk typing tests", "Data-entry and back-office job applications", "Steno and typist posts", "Faster everyday computer work"],
    faqs: [
      ["What speed will I reach?", "Most students reach 30–40 words per minute in two months with daily practice. Your certificate prints the speed achieved in the final test."],
      ["Can I take Punjabi and English typing together?", "Yes. Many students do both; the counsellor sets a combined timetable and a combined fee."],
    ],
  },

};

/** Every certificate program, in menu order. Throws at build time if the menu and content disagree. */
export const CERTIFICATE_PROGRAMS: CertificateProgram[] = certificatePrograms.map((item) => {
  const entry = details[item.slug];
  if (!entry) throw new Error(`No certificate program content for menu slug "${item.slug}"`);
  const course = getCourse(entry.courseSlug);
  if (!course) throw new Error(`Certificate program "${item.slug}" points at unknown course "${entry.courseSlug}"`);
  const total = entry.assessment.reduce((sum, part) => sum + part.weight, 0);
  if (total !== 100) throw new Error(`Assessment weights for "${item.slug}" add up to ${total}, not 100`);
  return { ...item, ...entry, faqs: [...entry.faqs, ...COMMON_FAQS], course };
});

export function getCertificateProgram(slug: string): CertificateProgram | undefined {
  return CERTIFICATE_PROGRAMS.find((program) => program.slug === slug);
}

/** Other programs for the "more certificates" rail — same course category first. */
export function getOtherCertificatePrograms(program: CertificateProgram, limit = 3): CertificateProgram[] {
  const others = CERTIFICATE_PROGRAMS.filter((p) => p.slug !== program.slug);
  const same = others.filter((p) => p.course.category === program.course.category);
  const rest = others.filter((p) => p.course.category !== program.course.category);
  return [...same, ...rest].slice(0, limit);
}
