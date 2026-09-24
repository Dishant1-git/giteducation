/**
 * Content for /college-partnerships.
 *
 * Formats and steps describe what the institute offers colleges. Branch tracks
 * and report deliverables are read from the Training Matcher data, so the two
 * pages never disagree about what a student gets.
 */

export type PartnershipFormat = { icon: string; title: string; text: string };

export const FORMATS: PartnershipFormat[] = [
  {
    icon: "users",
    title: "Campus workshops",
    text: "One to three day hands-on sessions on Excel, Tally with GST, AI tools, CAD or digital marketing, sized for one class or a whole year group.",
  },
  {
    icon: "calendar",
    title: "Industrial training",
    text: "4-week, 6-week and 6-month training mapped to university requirements, so a batch completes its mandated hours without a timetable clash.",
  },
  {
    icon: "document",
    title: "Project & report support",
    text: "Synopsis, daily diary, final report and viva preparation in the format your university asks for, for every student in the batch.",
  },
  {
    icon: "briefcase",
    title: "Placement preparation",
    text: "CV sessions, mock interviews and job-lead sharing for final-year students, run at your campus or at our centre.",
  },
  {
    icon: "book",
    title: "Faculty sessions",
    text: "Short practical refreshers for teaching staff on the software their students are now expected to know.",
  },
  {
    icon: "certificate",
    title: "Certificates",
    text: "A completion certificate for every student who finishes a programme, with the details your department needs on file.",
  },
];

export const STEPS: { title: string; text: string }[] = [
  { title: "Introductory call", text: "A short conversation about your departments, student numbers and which semester you are planning for." },
  { title: "Written proposal", text: "Scope, duration, schedule, delivery mode and cost in writing, before anything starts." },
  { title: "Pilot batch", text: "One workshop or one small batch first, so your department can judge the fit before a longer plan." },
  { title: "Ongoing programme", text: "A schedule that repeats across semesters, adjusted each time from student and faculty feedback." },
];

export type PartnerInstitution = { name: string; city: string; logo?: string };

/**
 * Institutions the institute has actually worked with. Leave empty until each
 * one has agreed to be listed; the section is hidden while this is empty.
 */
export const PARTNER_INSTITUTIONS: PartnerInstitution[] = [];
