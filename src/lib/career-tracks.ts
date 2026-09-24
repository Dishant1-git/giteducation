/**
 * Data behind the "Find My Career Track" tool at /tools/career-track-finder.
 *
 * Four questions, one track per interest answer. The other three answers do not
 * change the track; they tune the plan (starting point, first move, pace and the
 * pitch template), so the result reads as written for the person who answered.
 *
 * Free resources are labelled honestly: "Free certificate" only where both the
 * learning and the certificate cost nothing; otherwise "Free course" or
 * "Free to learn, exam paid".
 */

export type TrackId = "ai" | "cad" | "marketing" | "design" | "accounts" | "data";
export type BackgroundId = "school" | "graduate" | "engineering" | "working";
export type RewardId = "job" | "freelance" | "business";
export type PaceId = "light" | "steady" | "fulltime";

export type Option<T extends string> = { id: T; title: string; text: string };

export type Question =
  | { key: "track"; step: string; title: string; lead: string; options: Option<TrackId>[] }
  | { key: "background"; step: string; title: string; lead: string; options: Option<BackgroundId>[] }
  | { key: "reward"; step: string; title: string; lead: string; options: Option<RewardId>[] }
  | { key: "pace"; step: string; title: string; lead: string; options: Option<PaceId>[] };

export type Answers = { track?: TrackId; background?: BackgroundId; reward?: RewardId; pace?: PaceId };

export const QUESTIONS: Question[] = [
  {
    key: "track",
    step: "Interest",
    title: "Which of these would you happily do for a whole afternoon?",
    lead: "Pick the one you would not have to force yourself through.",
    options: [
      { id: "ai", title: "Get a computer to do the boring part", text: "Prompts, small Python scripts and AI tools that finish in minutes what used to take a day." },
      { id: "cad", title: "Draw and model a real object", text: "Dimensions, sections, assemblies — a part or a floor plan that could actually be built." },
      { id: "marketing", title: "Grow a page's traffic and enquiries", text: "Keywords, ad copy, analytics, and the numbers moving week on week." },
      { id: "design", title: "Design posters, logos and social posts", text: "Colour, type and layout — work people stop scrolling to look at." },
      { id: "accounts", title: "Keep a business's books in order", text: "Billing, GST returns and ledgers that balance at the end of the month." },
      { id: "data", title: "Turn messy data into a clean report", text: "Spreadsheets, formulas and dashboards that answer the manager's question." },
    ],
  },
  {
    key: "background",
    step: "Background",
    title: "Where are you starting from?",
    lead: "No wrong answer. It only changes where your plan begins.",
    options: [
      { id: "school", title: "Just finished 10th or 12th", text: "Still at school, or waiting for college to start." },
      { id: "graduate", title: "Graduate or in college", text: "BA, BCom, BSc, BCA or similar." },
      { id: "engineering", title: "Engineering, Diploma or ITI", text: "B.Tech, polytechnic diploma or ITI trade." },
      { id: "working", title: "Working, and want to switch", text: "In a job or running a shop, looking for a better skill." },
    ],
  },
  {
    key: "reward",
    step: "Reward",
    title: "What would make the effort worth it?",
    lead: "Choose the outcome you would be happiest with a year from now.",
    options: [
      { id: "job", title: "A steady salaried job", text: "Fixed hours, fixed salary, a company name on the offer letter." },
      { id: "freelance", title: "My own clients", text: "Freelance work I choose, paid per project." },
      { id: "business", title: "Grow my own or family business", text: "Use the skill for a shop, firm or startup I am part of." },
    ],
  },
  {
    key: "pace",
    step: "Time",
    title: "How much time can you give it each day?",
    lead: "Be realistic. A plan you keep beats a plan you abandon.",
    options: [
      { id: "light", title: "About 1 hour", text: "Around college, a job or family work." },
      { id: "steady", title: "2 to 3 hours", text: "A proper daily slot, most days of the week." },
      { id: "fulltime", title: "Full-time", text: "This is my main focus for the next three months." },
    ],
  },
];

export type Resource = { name: string; provider: string; cost: "Free certificate" | "Free course" | "Free to learn, exam paid" };

export type Track = {
  id: TrackId;
  name: string;
  summary: string;
  icon: string;
  courseSlug: string;
  skill: string;
  phases: { title: string; tasks: string[] }[];
  resources: Resource[];
  projects: { title: string; text: string }[];
  jobTitles: string[];
  service: string;
  clientType: string;
};

export const TRACKS: Record<TrackId, Track> = {
  ai: {
    id: "ai",
    name: "AI & Automation",
    summary: "You like making work disappear. Learn to use AI tools and a little Python to automate reports, content and data work for offices and small businesses.",
    icon: "robot",
    courseSlug: "artificial-intelligence-course-in-jalandhar",
    skill: "AI tools and Python automation",
    phases: [
      { title: "Foundations", tasks: ["Use ChatGPT, Gemini and Copilot daily; keep a notebook of prompts that worked", "Learn Python basics: variables, loops, lists and functions", "Read and write Excel and CSV files from Python"] },
      { title: "Build", tasks: ["Automate one real task: renaming files, merging sheets or sending reminders", "Call an AI API from Python to summarise or classify text", "Learn prompt patterns: role, examples, format and checks"] },
      { title: "Show", tasks: ["Finish and document the three portfolio projects below", "Record a two-minute screen video of each project running", "Apply to ten openings and pitch two local businesses"] },
    ],
    resources: [
      { name: "Elements of AI", provider: "University of Helsinki", cost: "Free certificate" },
      { name: "Python and Intro to Machine Learning", provider: "Kaggle Learn", cost: "Free certificate" },
      { name: "Azure AI Fundamentals (AI-900) learning path", provider: "Microsoft Learn", cost: "Free to learn, exam paid" },
    ],
    projects: [
      { title: "Invoice data extractor", text: "Pull name, date and amount out of 20 PDF bills into one Excel sheet." },
      { title: "Customer reply assistant", text: "A script that drafts polite replies to common WhatsApp or email enquiries." },
      { title: "Weekly report bot", text: "Reads a sales sheet and writes a one-paragraph summary with the top changes." },
    ],
    jobTitles: ["AI Operations Assistant", "Automation Executive", "Prompt Writer / AI Content Associate", "Junior Python Developer", "MIS Executive (AI tools)"],
    service: "automate one repetitive task in your office using AI tools",
    clientType: "office manager or shop owner",
  },
  cad: {
    id: "cad",
    name: "CAD / CAM Design",
    summary: "You think in shapes and measurements. Learn to draft and model parts and buildings the way manufacturers, architects and contractors need them.",
    icon: "cube",
    courseSlug: "cad-cam-course-in-jalandhar",
    skill: "AutoCAD and 3D modelling",
    phases: [
      { title: "Foundations", tasks: ["AutoCAD 2D: lines, layers, dimensions and layouts", "Practise 30 standard drawing exercises, one or two a day", "Learn to read orthographic views and sections"] },
      { title: "Build", tasks: ["3D part modelling and assemblies (SolidWorks or Fusion)", "Produce proper drawing sheets with title blocks and tolerances", "Model three real objects from around your house, measured with a scale"] },
      { title: "Show", tasks: ["Finish and print the three portfolio projects below as a PDF set", "Visit or message ten local workshops, fabricators or architects", "Apply for draftsman and design trainee openings"] },
    ],
    resources: [
      { name: "Onshape Learning Center courses", provider: "PTC Onshape", cost: "Free course" },
      { name: "Autodesk education licence and learning", provider: "Autodesk", cost: "Free course" },
      { name: "Engineering Drawing and Computer Graphics", provider: "NPTEL", cost: "Free to learn, exam paid" },
    ],
    projects: [
      { title: "House floor plan", text: "A two-bedroom plan with furniture layout, dimensions and a printable sheet." },
      { title: "Machine part drawing", text: "A flange or bracket modelled in 3D with a full manufacturing drawing." },
      { title: "Small assembly", text: "A vice or pulley assembly with an exploded view and bill of materials." },
    ],
    jobTitles: ["AutoCAD Draftsman", "Design Trainee", "CAD Technician", "Junior Design Engineer", "CNC Programmer (trainee)"],
    service: "turn your hand sketches into clean AutoCAD drawings, ready to print or send",
    clientType: "architect, contractor or workshop owner",
  },
  marketing: {
    id: "marketing",
    name: "Digital Marketing",
    summary: "You like watching numbers move. Learn to bring enquiries to a business through Google, social media and ads, and to prove it with reports.",
    icon: "megaphone",
    courseSlug: "digital-marketing-course-in-jalandhar",
    skill: "SEO, social media and Google Ads",
    phases: [
      { title: "Foundations", tasks: ["How search, social and ads work; set up your own practice page", "Keyword research for one local business", "Set up and optimise a Google Business Profile"] },
      { title: "Build", tasks: ["Plan and post a 30-day social media calendar", "Run a small practice ad (₹500 budget) and read the results", "Learn Google Analytics and Search Console reports"] },
      { title: "Show", tasks: ["Write up the three portfolio projects below as case studies with numbers", "Earn the free certificates listed below", "Apply to ten agencies and pitch three local shops"] },
    ],
    resources: [
      { name: "Fundamentals of Digital Marketing", provider: "Google Digital Garage", cost: "Free certificate" },
      { name: "Google Ads Search and Google Analytics certifications", provider: "Google Skillshop", cost: "Free certificate" },
      { name: "SEO and Social Media Marketing", provider: "HubSpot Academy", cost: "Free certificate" },
    ],
    projects: [
      { title: "Local SEO audit", text: "Audit a Jalandhar shop's Google presence and list ten fixes, before and after." },
      { title: "30-day content calendar", text: "Posts, captions and hashtags for one brand, with reach numbers at the end." },
      { title: "Ad campaign report", text: "A small real campaign with spend, clicks, cost per enquiry and what you would change." },
    ],
    jobTitles: ["Digital Marketing Executive", "SEO Executive", "Social Media Executive", "Performance Marketing Trainee", "Content Marketing Associate"],
    service: "get more calls and walk-ins from Google and Instagram",
    clientType: "shop, clinic or coaching centre owner",
  },
  design: {
    id: "design",
    name: "Graphic Design",
    summary: "You notice fonts and colours others miss. Learn to design for print and social media with the tools studios and printing presses actually use.",
    icon: "pen",
    courseSlug: "graphic-design-course-in-jalandhar",
    skill: "Photoshop, CorelDRAW and Illustrator",
    phases: [
      { title: "Foundations", tasks: ["Design basics: alignment, contrast, hierarchy and colour", "Photoshop: selections, layers, masks and retouching", "CorelDRAW or Illustrator: vector shapes and text"] },
      { title: "Build", tasks: ["Recreate five designs you admire, then make your own version", "Learn print specs: bleed, CMYK, resolution and flex sizes", "Design one piece every day for a month and post it"] },
      { title: "Show", tasks: ["Put the three portfolio projects below on Behance or Instagram", "Visit five printing presses and studios with your portfolio", "Apply to design jobs and pitch two local brands"] },
    ],
    resources: [
      { name: "Canva Design School courses", provider: "Canva", cost: "Free course" },
      { name: "Adobe Express and Photoshop tutorials", provider: "Adobe", cost: "Free course" },
      { name: "Social Media Marketing", provider: "HubSpot Academy", cost: "Free certificate" },
    ],
    projects: [
      { title: "Brand identity kit", text: "Logo, colours, visiting card and letterhead for a made-up or real local brand." },
      { title: "Social media set", text: "Nine matching Instagram posts for one business, with a consistent style." },
      { title: "Print job", text: "A flex banner and a brochure, set up with bleed and ready for the press." },
    ],
    jobTitles: ["Graphic Designer", "Social Media Designer", "DTP Operator", "Junior Visual Designer", "Print & Packaging Designer"],
    service: "design your posts, banners and visiting cards so your brand looks consistent",
    clientType: "shop owner, event organiser or local brand",
  },
  accounts: {
    id: "accounts",
    name: "Accounts & GST",
    summary: "You like things that add up. Learn practical accounting on Tally Prime with GST, the skill every trader, CA firm and business in Punjab hires for.",
    icon: "receipt",
    courseSlug: "tally-prime-course-in-jalandhar",
    skill: "Tally Prime with GST",
    phases: [
      { title: "Foundations", tasks: ["Accounting basics: journal, ledger and trial balance", "Tally Prime: company creation, ledgers and vouchers", "Sales, purchase and stock entries with inventory"] },
      { title: "Build", tasks: ["GST: invoices, input credit, GSTR-1 and GSTR-3B", "Bank reconciliation and TDS basics", "Maintain one month of books for a practice business"] },
      { title: "Show", tasks: ["Finish the three portfolio projects below as printed reports", "Earn the free certificate listed below", "Apply to CA firms, traders and offices for accounts roles"] },
    ],
    resources: [
      { name: "GST portal user manuals and tutorials", provider: "GSTN (gst.gov.in)", cost: "Free course" },
      { name: "Excel for accounting modules", provider: "Microsoft Learn", cost: "Free course" },
      { name: "Financial Literacy and Accounting basics", provider: "NPTEL / SWAYAM", cost: "Free to learn, exam paid" },
    ],
    projects: [
      { title: "Trading firm books", text: "A full month of sales, purchase and stock entries for a practice trading company." },
      { title: "GST return file", text: "Prepare GSTR-1 and GSTR-3B figures from your own set of invoices." },
      { title: "Bank reconciliation", text: "Match a month of bank statement entries against Tally and explain differences." },
    ],
    jobTitles: ["Accounts Executive", "Tally Operator", "GST Assistant", "Billing Executive", "Junior Accountant"],
    service: "keep your books and GST filings up to date every month",
    clientType: "trader or small business owner",
  },
  data: {
    id: "data",
    name: "Office & Data (MIS)",
    summary: "You like order. Learn Advance Excel and reporting so you become the person every office relies on for clean data and quick answers.",
    icon: "chart",
    courseSlug: "advance-excel-course-in-jalandhar",
    skill: "Advance Excel and reporting",
    phases: [
      { title: "Foundations", tasks: ["Excel fundamentals: formatting, sorting, filters and shortcuts", "Formulas: IF, SUMIFS, COUNTIFS, XLOOKUP and text functions", "Clean a messy data sheet from start to finish"] },
      { title: "Build", tasks: ["Pivot tables, charts and conditional formatting", "Build an interactive dashboard with slicers", "Learn basic SQL to pull data from a database"] },
      { title: "Show", tasks: ["Finish the three portfolio projects below and share them as files", "Take a typing test and list your speed on your résumé", "Apply to MIS, back-office and data entry openings"] },
    ],
    resources: [
      { name: "Excel training modules", provider: "Microsoft Learn", cost: "Free course" },
      { name: "Intro to SQL", provider: "Kaggle Learn", cost: "Free certificate" },
      { name: "Google Sheets and Looker Studio training", provider: "Google Skillshop", cost: "Free course" },
    ],
    projects: [
      { title: "Sales dashboard", text: "One-page Excel dashboard of monthly sales by product and region, with slicers." },
      { title: "Attendance and salary sheet", text: "Automatic totals, late marks and salary for 20 employees." },
      { title: "Data clean-up", text: "Take a 1,000-row messy list, remove duplicates and fix formats, and document the steps." },
    ],
    jobTitles: ["MIS Executive", "Data Entry Operator", "Back Office Executive", "Excel Reporting Analyst", "Office Coordinator"],
    service: "turn your scattered sheets into one clean report you can read in a minute",
    clientType: "office manager or business owner",
  },
};

const BACKGROUND_NOTE: Record<BackgroundId, string> = {
  school: "Start with a week of Basic Computer (typing, files and internet) if you are not yet comfortable on a computer. Everything else builds on it.",
  graduate: "Your degree already shows you can learn. Put the track's projects on your résumé above your marks: employers read projects first.",
  engineering: "Your technical background is a head start. Move faster through the foundations and spend the saved time on the projects.",
  working: "Link every project to the work you already do. A switch is easiest when your first project solves a problem at your current job.",
};

const REWARD_MOVE: Record<RewardId, string> = {
  job: "Your first move: make a one-page résumé with the three projects at the top, then apply to ten openings in the last two weeks.",
  freelance: "Your first move: finish one project for a real person, even free, and ask for a written review you can show the next client.",
  business: "Your first move: use every project on your own or family business first. Real results there are your best proof.",
};

const PACE: Record<PaceId, { hours: string; note: string }> = {
  light: { hours: "about 7 hours a week", note: "At an hour a day this plan fits 90 days comfortably. Keep the streak, even on busy days do 15 minutes." },
  steady: { hours: "about 15–20 hours a week", note: "At 2–3 hours a day you can finish the plan on time and add a fourth project." },
  fulltime: { hours: "35+ hours a week", note: "Full-time, you can finish the plan in about 60 days. Use the last month for internships and interviews." },
};

export function pitchTemplate(track: Track, reward: RewardId): string {
  if (reward === "job") {
    return [
      `Subject: Application for ${track.jobTitles[0]}`,
      "",
      "Dear Sir/Madam,",
      "",
      `I am [Your Name] from Jalandhar and I have trained in ${track.skill}. I saw that you are hiring for ${track.jobTitles[0]} and I would like to apply.`,
      "",
      `Recently I completed: ${track.projects.map((p) => p.title.toLowerCase()).join(", ")}. I have attached my résumé and links to these projects.`,
      "",
      "I can join immediately and I am happy to do a short test task. Could we speak for ten minutes this week?",
      "",
      "Regards,",
      "[Your Name] · [Phone number]",
    ].join("\n");
  }

  return [
    `Hello [Name] ji,`,
    "",
    `I am [Your Name], I work in ${track.skill} here in Jalandhar. I noticed [one specific thing about their business] and I can help you ${track.service}.`,
    "",
    `I recently did a similar job: ${track.projects[0].title.toLowerCase()}. I can show it to you in two minutes.`,
    "",
    `For a ${track.clientType} like you I would start with one small task at ₹[price], so you can judge the work before anything bigger.`,
    "",
    "Can I send you a free sample this week?",
    "",
    "[Your Name] · [Phone number]",
  ].join("\n");
}

export type Plan = {
  track: Track;
  alternate?: Track;
  startNote: string;
  firstMove: string;
  hours: string;
  paceNote: string;
  pitch: string;
};

/** A second track worth a look, based on background, if it differs from the first. */
const ALTERNATE: Record<BackgroundId, TrackId[]> = {
  school: ["design", "data"],
  graduate: ["accounts", "marketing"],
  engineering: ["cad", "ai"],
  working: ["data", "marketing"],
};

export function buildPlan(answers: Required<Answers>): Plan {
  const track = TRACKS[answers.track];
  const alternateId = ALTERNATE[answers.background].find((id) => id !== answers.track);
  return {
    track,
    alternate: alternateId ? TRACKS[alternateId] : undefined,
    startNote: BACKGROUND_NOTE[answers.background],
    firstMove: REWARD_MOVE[answers.reward],
    hours: PACE[answers.pace].hours,
    paceNote: PACE[answers.pace].note,
    pitch: pitchTemplate(track, answers.reward),
  };
}
