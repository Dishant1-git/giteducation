/**
 * Data behind the "Salary Estimator" tool at /tools/salary-estimator.
 *
 * Figures are indicative monthly in-hand ranges (₹ thousands) for a fresher in a
 * Punjab tier-2 city, drawn from common job-post ranges for these roles. Location,
 * experience and extra skills scale that base. They are estimates to plan with,
 * not an offer or a guarantee, and the page says so next to every number.
 */

export type Range = [min: number, max: number];

export type Role = {
  id: string;
  title: string;
  /** Fresher monthly range in ₹ thousands, Punjab tier-2 city. */
  base: Range;
  courseSlug: string;
  courseName: string;
  jobTitles: string[];
  skills: { id: string; label: string }[];
};

export const ROLES: Role[] = [
  {
    id: "office",
    title: "Office Assistant / Computer Operator",
    base: [9, 14],
    courseSlug: "ms-office-course-in-jalandhar",
    courseName: "MS Office",
    jobTitles: ["Computer Operator", "Office Assistant", "Front Office Executive"],
    skills: [
      { id: "typing", label: "40+ WPM typing (English or Punjabi)" },
      { id: "excel", label: "Advance Excel" },
      { id: "english", label: "Confident written English" },
    ],
  },
  {
    id: "mis",
    title: "MIS / Data Reporting Executive",
    base: [11, 17],
    courseSlug: "advance-excel-course-in-jalandhar",
    courseName: "Advance Excel",
    jobTitles: ["MIS Executive", "Data Analyst (Junior)", "Back Office Executive"],
    skills: [
      { id: "dashboards", label: "Excel dashboards & pivot tables" },
      { id: "sql", label: "Basic SQL" },
      { id: "powerbi", label: "Power BI or Looker Studio" },
    ],
  },
  {
    id: "accounts",
    title: "Accounts Executive (Tally & GST)",
    base: [12, 18],
    courseSlug: "tally-prime-course-in-jalandhar",
    courseName: "Tally Prime with GST",
    jobTitles: ["Accounts Executive", "Tally Operator", "GST Assistant"],
    skills: [
      { id: "gst", label: "Files GST returns independently" },
      { id: "tds", label: "TDS & payroll basics" },
      { id: "excel", label: "Advance Excel" },
    ],
  },
  {
    id: "marketing",
    title: "Digital Marketing Executive",
    base: [12, 20],
    courseSlug: "digital-marketing-course-in-jalandhar",
    courseName: "Digital Marketing",
    jobTitles: ["Digital Marketing Executive", "SEO Executive", "Social Media Executive"],
    skills: [
      { id: "ads", label: "Runs Google / Meta ads with budget" },
      { id: "seo", label: "Local SEO results to show" },
      { id: "certs", label: "Google Ads & Analytics certificates" },
    ],
  },
  {
    id: "cad",
    title: "AutoCAD Draftsman / CAD Designer",
    base: [12, 22],
    courseSlug: "cad-cam-course-in-jalandhar",
    courseName: "CAD / CAM",
    jobTitles: ["AutoCAD Draftsman", "CAD Technician", "Design Trainee"],
    skills: [
      { id: "3d", label: "3D modelling (SolidWorks / Revit)" },
      { id: "cnc", label: "CNC programming" },
      { id: "site", label: "Site or shop-floor exposure" },
    ],
  },
  {
    id: "ai",
    title: "Junior Python / AI Developer",
    base: [15, 28],
    courseSlug: "artificial-intelligence-course-in-jalandhar",
    courseName: "Artificial Intelligence",
    jobTitles: ["Junior Python Developer", "AI Operations Associate", "Automation Executive"],
    skills: [
      { id: "github", label: "3+ projects on GitHub" },
      { id: "api", label: "Builds with AI APIs" },
      { id: "sql", label: "SQL & data handling" },
    ],
  },
];

export type Option = { id: string; label: string; hint: string; factor: number };

export const LOCATIONS: Option[] = [
  { id: "tier2", label: "Jalandhar / Ludhiana / Amritsar", hint: "Punjab tier-2 city", factor: 1 },
  { id: "tricity", label: "Mohali / Chandigarh", hint: "Tricity", factor: 1.2 },
  { id: "ncr", label: "Delhi NCR", hint: "Metro, higher rent", factor: 1.45 },
  { id: "remote", label: "Remote / Freelance", hint: "Varies widely", factor: 1.1 },
];

export const LEVELS: Option[] = [
  { id: "fresher", label: "Fresher", hint: "0–1 year", factor: 1 },
  { id: "junior", label: "1–2 years", hint: "Junior", factor: 1.4 },
  { id: "mid", label: "3–5 years", hint: "Experienced", factor: 2 },
  { id: "senior", label: "5+ years", hint: "Senior / lead", factor: 2.8 },
];

/** Each verified extra skill adds this share to the range, capped by the skill count. */
export const SKILL_BONUS = 0.08;

export function estimate(role: Role, locationFactor: number, levelFactor: number, skillCount: number): Range {
  const f = locationFactor * levelFactor * (1 + SKILL_BONUS * skillCount);
  // Round to the nearest ₹500 so the output never looks more precise than it is.
  const round = (n: number) => Math.round(n * f * 2) / 2;
  return [round(role.base[0]), round(role.base[1])];
}

export const formatK = (k: number) => `₹${(k * 1000).toLocaleString("en-IN")}`;
export const formatLakh = (monthlyK: number) => `₹${((monthlyK * 12) / 100).toFixed(1)} L`;
