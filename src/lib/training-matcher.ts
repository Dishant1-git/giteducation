/**
 * Data behind the "Training Matcher" tool at /tools/training-matcher.
 *
 * University + branch + semester in, a training format and matching project
 * tracks out. The semester decides the format (summer, 6-week, pre-final minor
 * project or 6-month); the branch decides which tracks are shown. Every track is
 * one of the institute's own courses, so the page never offers training the
 * institute does not run.
 */

export type University = { id: string; name: string; semesters: number };

export const UNIVERSITIES: University[] = [
  { id: "ptu", name: "IKG Punjab Technical University (PTU)", semesters: 8 },
  { id: "gndu", name: "Guru Nanak Dev University (GNDU)", semesters: 8 },
  { id: "pup", name: "Punjabi University, Patiala", semesters: 8 },
  { id: "mrsptu", name: "MRSPTU, Bathinda", semesters: 8 },
  { id: "psbte", name: "PSBTE (Diploma)", semesters: 6 },
  { id: "lpu", name: "Lovely Professional University (LPU)", semesters: 8 },
  { id: "cu", name: "Chandigarh University", semesters: 8 },
  { id: "dav", name: "DAV University, Jalandhar", semesters: 8 },
  { id: "ctu", name: "CT University, Ludhiana", semesters: 8 },
  { id: "other", name: "Other university or board", semesters: 8 },
];

export type BranchId = "cse" | "bca" | "mca" | "aids" | "mech" | "civil" | "ece" | "commerce";

export type Branch = { id: BranchId; name: string; icon: string; tracks: string[] };

export const BRANCHES: Branch[] = [
  { id: "cse", name: "CSE / IT", icon: "code", tracks: ["python-ai", "web-python", "excel-data"] },
  { id: "bca", name: "BCA / B.Sc IT", icon: "monitor", tracks: ["python-ai", "web-python", "digital-marketing"] },
  { id: "mca", name: "MCA / M.Sc IT", icon: "code", tracks: ["python-ai", "web-python", "excel-data"] },
  { id: "aids", name: "AI & Data Science", icon: "robot", tracks: ["python-ai", "excel-data", "web-python"] },
  { id: "mech", name: "Mechanical & Automobile", icon: "cube", tracks: ["cad-mech", "cnc", "excel-data"] },
  { id: "civil", name: "Civil & Architecture", icon: "building", tracks: ["cad-civil", "structural", "excel-data"] },
  { id: "ece", name: "ECE / EE / Electronics", icon: "chip", tracks: ["python-ai", "cad-mech", "excel-data"] },
  { id: "commerce", name: "MBA / BBA / B.Com", icon: "briefcase", tracks: ["tally-gst", "excel-data", "digital-marketing"] },
];

export type Track = {
  id: string;
  title: string;
  tag: string;
  text: string;
  stack: string[];
  outcome: string;
  /** Course page slug; undefined links to the course directory. */
  courseSlug?: string;
  enquiryName: string;
};

export const TRACKS: Record<string, Track> = {
  "python-ai": {
    id: "python-ai",
    title: "Python & AI Live Project",
    tag: "High demand",
    text: "Core Python, data handling and AI tools, ending in one working project that automates or predicts something real.",
    stack: ["Python 3", "Pandas", "Jupyter", "ChatGPT / Gemini APIs", "Streamlit"],
    outcome: "One working AI project with source code",
    courseSlug: "artificial-intelligence-course-in-jalandhar",
    enquiryName: "Artificial Intelligence",
  },
  "web-python": {
    id: "web-python",
    title: "Web Development with Python",
    tag: "Most popular",
    text: "HTML, CSS and JavaScript for the front end, Python for the back end, and a database behind it, deployed online.",
    stack: ["HTML5", "CSS", "JavaScript", "Python", "Django", "MySQL"],
    outcome: "One deployed website with a GitHub repository",
    enquiryName: "Web Development with Python",
  },
  "excel-data": {
    id: "excel-data",
    title: "Data Reporting with Advance Excel",
    tag: "Every industry",
    text: "Formulas, pivot tables and dashboards built on a real data set, the reporting work every office and plant runs on.",
    stack: ["Advance Excel", "Pivot tables", "Dashboards", "Google Sheets"],
    outcome: "One interactive MIS dashboard",
    courseSlug: "advance-excel-course-in-jalandhar",
    enquiryName: "Advance Excel",
  },
  "digital-marketing": {
    id: "digital-marketing",
    title: "Digital Marketing Live Project",
    tag: "Trending",
    text: "SEO, social media and ads for one real business, with reports that show what changed.",
    stack: ["Google Search Console", "Google Business Profile", "Meta Ads", "Google Analytics"],
    outcome: "One campaign case study with numbers",
    courseSlug: "digital-marketing-course-in-jalandhar",
    enquiryName: "Digital Marketing",
  },
  "cad-mech": {
    id: "cad-mech",
    title: "Mechanical CAD Design Project",
    tag: "Core branch",
    text: "2D drafting and 3D part and assembly modelling, ending in a full set of manufacturing drawings.",
    stack: ["AutoCAD", "SolidWorks", "Drawing sheets", "GD&T basics"],
    outcome: "One assembly with a printable drawing set",
    courseSlug: "cad-cam-course-in-jalandhar",
    enquiryName: "CAD / CAM",
  },
  cnc: {
    id: "cnc",
    title: "CAM & CNC Programming",
    tag: "Shop floor",
    text: "From a 3D model to tool paths and G-code, the skills workshops and CNC units hire for.",
    stack: ["CNC Programming", "SolidCAM", "WorkNC", "G-code"],
    outcome: "One machined-part tool path with G-code",
    courseSlug: "cad-cam-course-in-jalandhar",
    enquiryName: "CAD / CAM",
  },
  "cad-civil": {
    id: "cad-civil",
    title: "Civil & Architectural Drafting",
    tag: "Core branch",
    text: "Building plans, elevations and sections, then a 3D model and walkthrough of the same building.",
    stack: ["AutoCAD", "Revit", "SketchUp", "3ds Max"],
    outcome: "One house plan set with a 3D model",
    courseSlug: "cad-cam-course-in-jalandhar",
    enquiryName: "CAD / CAM",
  },
  structural: {
    id: "structural",
    title: "Structural Analysis Project",
    tag: "Final year",
    text: "Model a small frame building, apply loads and read the results, the way design offices work.",
    stack: ["STAAD Pro", "ETABS", "AutoCAD"],
    outcome: "One analysed structure with a design report",
    courseSlug: "cad-cam-course-in-jalandhar",
    enquiryName: "CAD / CAM",
  },
  "tally-gst": {
    id: "tally-gst",
    title: "Accounting with Tally Prime & GST",
    tag: "Most popular",
    text: "A month of books for a practice company: vouchers, stock, GST returns and bank reconciliation.",
    stack: ["Tally Prime", "GST returns", "Advance Excel"],
    outcome: "One complete set of company accounts",
    courseSlug: "tally-prime-course-in-jalandhar",
    enquiryName: "Tally Prime with GST",
  },
};

export type Format = { label: string; title: string; text: string; duration: string };

/** Training format by semester. Most Punjab universities ask for summer/6-week training after even semesters and a 6-month training in the final year. */
export function formatFor(semester: number, totalSemesters: number): Format {
  if (semester >= totalSemesters - 1) {
    return {
      label: "Final year track",
      title: "6 Months Industrial Training",
      text: "A full semester on one major live project, with internship-style daily work, a documented report and viva preparation.",
      duration: "6 months",
    };
  }
  if (semester >= totalSemesters - 3) {
    return {
      label: "Pre-final year track",
      title: "6 Weeks Minor Project Training",
      text: "Builds one solid live project to strengthen your résumé before campus placements and complete your training credits.",
      duration: "6 weeks",
    };
  }
  if (semester >= 3) {
    return {
      label: "Mid-degree track",
      title: "6 Weeks Industrial Training",
      text: "Learn one industry tool properly and finish a small project you can show, during the summer or winter break.",
      duration: "6 weeks",
    };
  }
  return {
    label: "Early start track",
    title: "4 Weeks Summer Skill Training",
    text: "Get ahead of your syllabus with the software your seniors wish they had learned in the first year.",
    duration: "4 weeks",
  };
}

export const DELIVERABLES = [
  { title: "Synopsis for department approval", text: "A project synopsis drafted in the first weeks, ready for your guide and HOD to sign." },
  { title: "Daily training diary", text: "A day-by-day log of modules, lab work and weekly progress, in the format colleges ask for." },
  { title: "Final project report", text: "Soft and hard copy, with diagrams, screenshots and references, laid out to your university's format." },
  { title: "Viva preparation", text: "A walk-through of your own project and mock questions before your external viva." },
];
