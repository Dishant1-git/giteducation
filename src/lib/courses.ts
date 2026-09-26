/**
 * Course catalogue.
 *
 * Every course page at /courses/[slug] is rendered from one entry in this file —
 * the page component holds no course copy of its own. Adding a course here adds a
 * fully-formed, statically generated page; no template changes are needed.
 *
 * Fees are indicative and confirmed at counselling; `feeNote` carries that caveat
 * on every page so no page states a price as final.
 */

export type CourseModule = {
  title: string;
  hours: string;
  topics: string[];
};

export type Course = {
  slug: string;
  /** H1 / <title> base. Keep the city in the title: these pages are local-search pages. */
  title: string;
  /** Used in cards, breadcrumbs and the related-courses rail. */
  shortTitle: string;
  category: string;
  /** Key in `lineIcons` (src/lib/site.ts). */
  icon: string;
  tagline: string;
  /** Overview paragraphs. Two to three, written for a reader deciding whether to enrol. */
  summary: string[];
  seo: { title: string; description: string; keywords: string[] };
  level: string;
  duration: string;
  weeklyHours: string;
  modes: string[];
  languages: string[];
  certification: string;
  fee: { amount: number; installments: string };
  seats: number;
  rating: { value: number; count: number };
  nextBatch: string;
  highlights: { icon: string; title: string; text: string }[];
  outcomes: string[];
  audience: string[];
  eligibility: string[];
  curriculum: CourseModule[];
  tools: { group: string; items: string[] }[];
  projects: { title: string; text: string; tags: string[] }[];
  careers: { role: string; salary: string; demand: "Moderate" | "High" | "Very high" }[];
  batches: { name: string; days: string; time: string; mode: string; seats: string }[];
  faqs: [question: string, answer: string][];
  reviews: { initials: string; name: string; role: string; text: string }[];
  /** Slugs of courses shown in the related rail. Invalid slugs are ignored at render time. */
  related: string[];
};

/** Shown identically on every course page — one process, one promise. */
export const PLACEMENT_STEPS: { title: string; text: string }[] = [
  {
    title: "Skill assessment",
    text: "A trainer reviews your practical files in the final month and records the modules you are strongest in, so the CV we build is accurate.",
  },
  {
    title: "CV and portfolio build",
    text: "We write your CV around the projects you completed in class, and collect your work into a folder or PDF portfolio you can send to employers.",
  },
  {
    title: "Mock interviews",
    text: "Two rounds of practice interviews with feedback — one on the software itself, one on the everyday questions every employer asks.",
  },
  {
    title: "Job referrals",
    text: "We share openings from the local employers we work with — offices, CA firms, design studios, manufacturing units and online-marketing agencies in Jalandhar and nearby cities.",
  },
];

export const FEE_NOTE =
  "Fees shown are indicative for the standard batch and are confirmed in writing at counselling. Instalment plans, sibling concessions and student-ID concessions are available.";

/** FAQs appended to every course. Course-specific FAQs come first. */
export const COMMON_FAQS: [string, string][] = [
  [
    "Can I pay the fees in instalments?",
    "Yes. Every course can be paid in two or three instalments. The schedule is written on your admission receipt, and there is no extra charge for paying in parts.",
  ],
  [
    "What happens if I miss classes?",
    "Tell the front desk in advance and we schedule backup classes in another batch of the same course, or in the open lab hours. Recorded notes for each module stay available to you for the whole course.",
  ],
  [
    "Do I get a certificate?",
    "Yes. You receive a course completion certificate after the final practical test. The certificate carries your registration number and can be verified by an employer over the phone.",
  ],
];

const courses: Course[] = [
  {
    slug: "artificial-intelligence-course-in-jalandhar",
    title: "Artificial Intelligence Certificate Program in Jalandhar",
    shortTitle: "Artificial Intelligence",
    category: "Future Skills",
    icon: "brain",
    tagline: "Live projects, placement support and a portfolio you can show an employer.",
    summary: [
      "This certificate program takes you from Python basics to working AI applications in six months, taught in a classroom in Jalandhar with one computer per student. You write code in every class; there are no lecture-only sessions.",
      "The syllabus covers the three things employers actually ask for: data handling with Python, machine learning that you can explain, and applied AI built on today's language and vision models. You finish with four live projects, a GitHub profile and a CV built around that work.",
      "No prior programming experience is required. The first module starts from installing Python and writing your first script, and the pace is set so that a graduate from any stream can follow it.",
    ],
    seo: {
      title: "Artificial Intelligence Course in Jalandhar | Live Projects & Placement Support",
      description:
        "Six-month Artificial Intelligence certificate program in Jalandhar. Python, machine learning, deep learning and generative AI with live projects, one computer per student and placement support.",
      keywords: [
        "artificial intelligence course in jalandhar",
        "ai training institute jalandhar",
        "machine learning course jalandhar",
        "python ai course punjab",
        "generative ai course jalandhar",
      ],
    },
    level: "Beginner to Advanced",
    duration: "6 months",
    weeklyHours: "10 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Live online", "Weekend batch"],
    languages: ["English", "Hindi", "Punjabi"],
    certification: "GIT Education Certificate in Applied Artificial Intelligence",
    fee: { amount: 42000, installments: "3 instalments of ₹14,000" },
    seats: 18,
    rating: { value: 4.9, count: 128 },
    nextBatch: "First Monday of every month",
    highlights: [
      { icon: "code", title: "Code from day one", text: "Every class ends with working code on your own machine, reviewed by the trainer before you leave." },
      { icon: "briefcase", title: "Four live projects", text: "A sales forecast, a document chatbot, an image classifier and a full capstone, all built on real datasets." },
      { icon: "users", title: "Batches of 18", text: "One computer per student and a trainer who can reach every desk in a single class." },
      { icon: "certificate", title: "Portfolio and CV", text: "You leave with a GitHub profile, a project portfolio and a CV written around what you built." },
    ],
    outcomes: [
      "Write Python programs that read, clean and analyse real datasets using pandas and NumPy.",
      "Build, evaluate and explain supervised machine-learning models for classification and regression problems.",
      "Train and fine-tune neural networks for image and text tasks using TensorFlow and Keras.",
      "Build retrieval-augmented chatbots and automation on top of large language models, with prompt design and API integration.",
      "Deploy a model as a working web application and hand over documentation an employer can read.",
      "Explain your model's decisions, limitations and bias risks in plain language during an interview.",
    ],
    audience: [
      "Graduates and final-year students from any stream who want an AI role",
      "Working IT and support staff moving into data and AI teams",
      "Commerce and science graduates with no coding background",
      "Business owners who want to automate reporting and customer replies",
    ],
    eligibility: [
      "10+2 or above in any stream",
      "Comfortable using a computer and the internet",
      "No prior programming knowledge required",
      "Basic English reading ability (class discussion is in Hindi, Punjabi or English)",
    ],
    curriculum: [
      {
        title: "Python for AI",
        hours: "24 hours",
        topics: [
          "Installing Python, VS Code and Jupyter; running your first script",
          "Variables, data types, conditions and loops",
          "Functions, modules and error handling",
          "Lists, dictionaries, sets and file handling",
          "Working with CSV and Excel files in Python",
        ],
      },
      {
        title: "Data handling and statistics",
        hours: "28 hours",
        topics: [
          "NumPy arrays and vectorised operations",
          "pandas: loading, filtering, grouping and joining datasets",
          "Cleaning messy data: missing values, duplicates, outliers",
          "Descriptive statistics, distributions and correlation",
          "Charts with Matplotlib and Seaborn for data storytelling",
        ],
      },
      {
        title: "Machine learning foundations",
        hours: "36 hours",
        topics: [
          "Supervised vs unsupervised learning, and when each applies",
          "Linear and logistic regression, decision trees, random forests",
          "Train/test splits, cross-validation and overfitting",
          "Accuracy, precision, recall, F1 and the confusion matrix",
          "Feature engineering and scikit-learn pipelines",
        ],
      },
      {
        title: "Deep learning",
        hours: "32 hours",
        topics: [
          "Neural network structure, activation functions and backpropagation",
          "TensorFlow and Keras model building",
          "Convolutional networks for image classification",
          "Transfer learning with pre-trained models",
          "Sequence models and an introduction to transformers",
        ],
      },
      {
        title: "Generative AI and LLM applications",
        hours: "30 hours",
        topics: [
          "How large language models work, and where they fail",
          "Prompt design, system prompts and structured outputs",
          "Embeddings, vector databases and retrieval-augmented generation",
          "Building a document chatbot over your own PDFs",
          "Responsible AI: bias, privacy, hallucination and human review",
        ],
      },
      {
        title: "Deployment and capstone project",
        hours: "30 hours",
        topics: [
          "Packaging a model with Flask or FastAPI",
          "Building a front end with Streamlit",
          "Version control with Git and GitHub",
          "Capstone project: problem selection, build, review and presentation",
          "Portfolio, CV and interview preparation",
        ],
      },
    ],
    tools: [
      { group: "Languages & libraries", items: ["Python", "NumPy", "pandas", "scikit-learn", "Matplotlib", "Seaborn"] },
      { group: "Deep learning", items: ["TensorFlow", "Keras", "OpenCV", "Hugging Face Transformers"] },
      { group: "Generative AI", items: ["LLM APIs", "LangChain", "Vector databases", "Prompt engineering"] },
      { group: "Delivery", items: ["Jupyter", "VS Code", "Git & GitHub", "Streamlit", "FastAPI"] },
    ],
    projects: [
      {
        title: "Retail sales forecasting",
        text: "Clean two years of shop sales data, engineer seasonal features and forecast next month's demand, then present the numbers to the class as you would to an owner.",
        tags: ["pandas", "Regression", "Time series"],
      },
      {
        title: "Document chatbot",
        text: "Build a retrieval-augmented assistant that answers questions from a set of PDFs — fee rules, product manuals or policy documents — with citations back to the source page.",
        tags: ["LLM", "Embeddings", "RAG"],
      },
      {
        title: "Image classifier",
        text: "Train a convolutional network to sort product photographs into categories, then improve it with transfer learning and report the accuracy gain.",
        tags: ["CNN", "Transfer learning", "OpenCV"],
      },
      {
        title: "Capstone: deployed AI application",
        text: "Pick a problem, build the model, deploy it as a web app and write the handover documentation. This is the project that goes at the top of your CV.",
        tags: ["End to end", "Deployment", "Portfolio"],
      },
    ],
    careers: [
      { role: "Junior Data Analyst", salary: "₹2.4 – 4.2 LPA", demand: "Very high" },
      { role: "Machine Learning Engineer (Trainee)", salary: "₹3.0 – 6.0 LPA", demand: "High" },
      { role: "AI Application Developer", salary: "₹3.6 – 7.2 LPA", demand: "High" },
      { role: "Automation / Prompt Engineer", salary: "₹3.0 – 5.4 LPA", demand: "High" },
      { role: "Business Intelligence Executive", salary: "₹2.4 – 4.8 LPA", demand: "Moderate" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "8:00 AM – 10:00 AM", mode: "Classroom", seats: "6 of 18 left" },
      { name: "Evening", days: "Mon – Fri", time: "5:30 PM – 7:30 PM", mode: "Classroom", seats: "9 of 18 left" },
      { name: "Weekend", days: "Sat – Sun", time: "10:00 AM – 3:00 PM", mode: "Classroom / Online", seats: "11 of 18 left" },
    ],
    faqs: [
      [
        "I have never written code. Can I still join this AI course?",
        "Yes. The first month is Python from the very beginning — installing it, writing your first script, then loops and functions. Around half of each batch starts with no coding background, and the trainer checks your practice files every class.",
      ],
      [
        "Do I need an expensive laptop with a graphics card?",
        "No. All classroom systems are provided, and the heavier deep-learning exercises run on free cloud notebooks. A basic laptop is enough for home practice; we set it up with you in the first week.",
      ],
      [
        "What kind of placement support is included?",
        "Skill assessment, a CV built around your projects, two mock interview rounds and referrals to employers hiring in Jalandhar, Ludhiana, Mohali and the wider NCR. We do not guarantee a job — no honest institute can — but every student gets the full support process.",
      ],
      [
        "Are the projects real, or practice exercises?",
        "They use real datasets and real problem statements, and you build them yourself over the course rather than copying a finished notebook. The capstone is chosen with your trainer so it fits the job you are aiming for.",
      ],
      [
        "Can I attend online if I live outside Jalandhar?",
        "Yes. The weekend batch runs in the classroom and live online at the same time, with the same trainer and the same project reviews. Recordings are available for the sessions you miss.",
      ],
    ],
    reviews: [
      {
        initials: "RK",
        name: "Ravneet K.",
        role: "Data Analyst, Mohali",
        text: "I came from a B.Com background and was scared of coding. By the third month I was cleaning data in pandas on my own. The document chatbot project is what got me through my interview.",
      },
      {
        initials: "HS",
        name: "Harman S.",
        role: "AI Developer, Jalandhar",
        text: "What helped most was that the trainer made us explain our models out loud. In the interview they asked exactly that — why this algorithm and not another one.",
      },
    ],
    related: [
      "advance-excel-course-in-jalandhar",
      "digital-marketing-course-in-jalandhar",
      "ms-office-course-in-jalandhar",
    ],
  },

  {
    slug: "basic-computer-course-in-jalandhar",
    title: "Basic Computer Course in Jalandhar",
    shortTitle: "Basic Computer",
    category: "Office & Basics",
    icon: "monitor",
    tagline: "Start from switching on the computer and finish job-ready for office work.",
    summary: [
      "A first course for anyone who has never used a computer, or who uses one only for a phone-style task or two. It starts at the power button and ends with you handling Windows, files, email, the internet and basic documents confidently.",
      "Classes are practical. You spend the hour on your own computer with a trainer at your shoulder, not watching a screen at the front of the room.",
    ],
    seo: {
      title: "Basic Computer Course in Jalandhar | Beginner Computer Classes",
      description:
        "Two-month basic computer course in Jalandhar covering Windows, typing, internet, email, MS Word and Excel basics. One computer per student, morning and evening batches.",
      keywords: [
        "basic computer course in jalandhar",
        "computer classes jalandhar",
        "beginner computer course punjab",
        "computer institute near me jalandhar",
      ],
    },
    level: "Beginner",
    duration: "2 months",
    weeklyHours: "6 hours per week (6 classes)",
    modes: ["Classroom — Jalandhar", "Weekend batch"],
    languages: ["Punjabi", "Hindi", "English"],
    certification: "GIT Education Certificate in Computer Fundamentals",
    fee: { amount: 5500, installments: "2 instalments of ₹2,750" },
    seats: 20,
    rating: { value: 4.8, count: 214 },
    nextBatch: "New batch every Monday",
    highlights: [
      { icon: "monitor", title: "Absolute beginners welcome", text: "Class one starts at the power button. Nothing is assumed." },
      { icon: "users", title: "Patient trainers", text: "Trainers repeat a step as many times as you need, in Punjabi, Hindi or English." },
      { icon: "clock", title: "Open lab practice", text: "Free practice hours in the lab on any working day, outside your class time." },
      { icon: "certificate", title: "Certificate in 2 months", text: "A completion certificate accepted for job forms and government applications." },
    ],
    outcomes: [
      "Operate Windows confidently: files, folders, settings, printing and safe shutdown.",
      "Type comfortably with correct finger placement in English.",
      "Use email for real tasks — writing, replying, attachments and organising the inbox.",
      "Search the internet safely and fill in online government and job forms.",
      "Create simple letters in Word and simple lists and totals in Excel.",
      "Protect yourself from common online frauds, weak passwords and unsafe downloads.",
    ],
    audience: [
      "First-time computer users of any age",
      "School and college students needing a base before advanced courses",
      "Shop owners and home-makers handling their own paperwork",
      "Job seekers whose applications ask for basic computer knowledge",
    ],
    eligibility: ["No prior computer knowledge required", "Able to read Punjabi, Hindi or English", "Any age from 12 upwards"],
    curriculum: [
      {
        title: "Computer fundamentals",
        hours: "10 hours",
        topics: ["Parts of a computer and what each one does", "Starting up and shutting down safely", "Mouse and keyboard control", "Files, folders and storage", "USB drives and printing"],
      },
      {
        title: "Windows operating system",
        hours: "10 hours",
        topics: ["Desktop, taskbar and start menu", "Installing and removing programs", "Copy, move, rename and delete", "Settings, display and sound", "Antivirus and safe computing"],
      },
      {
        title: "Typing practice",
        hours: "12 hours",
        topics: ["Correct finger placement", "Home-row drills", "Speed and accuracy tests", "Typing a full page without looking", "Weekly progress tracking"],
      },
      {
        title: "Internet and email",
        hours: "10 hours",
        topics: ["Browsers, search and bookmarks", "Creating and using an email account", "Attachments and replies", "Online forms and government portals", "Online safety and fraud awareness"],
      },
      {
        title: "Documents and spreadsheets",
        hours: "12 hours",
        topics: ["MS Word: letters, formatting and printing", "MS Excel: rows, columns and simple formulas", "Making a list and totalling it", "Saving in the right format", "A first small project of your own"],
      },
    ],
    tools: [
      { group: "System", items: ["Windows 11", "File Explorer", "Antivirus basics"] },
      { group: "Office", items: ["MS Word", "MS Excel", "Notepad"] },
      { group: "Internet", items: ["Chrome", "Gmail", "Government portals", "Online forms"] },
    ],
    projects: [
      { title: "Personal document folder", text: "Build a properly named and sorted folder structure for your own documents, and print an index of it.", tags: ["Windows", "Files"] },
      { title: "Job application email", text: "Write an application email with a CV attached, addressed correctly and free of errors.", tags: ["Email", "Word"] },
      { title: "Household budget sheet", text: "Make a monthly expense sheet in Excel with totals, and read it back to the class.", tags: ["Excel", "Formulas"] },
    ],
    careers: [
      { role: "Computer Operator", salary: "₹1.2 – 2.2 LPA", demand: "High" },
      { role: "Data Entry Assistant", salary: "₹1.4 – 2.4 LPA", demand: "High" },
      { role: "Front Office Assistant", salary: "₹1.2 – 2.0 LPA", demand: "Moderate" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Sat", time: "8:00 AM – 9:00 AM", mode: "Classroom", seats: "Open" },
      { name: "Afternoon", days: "Mon – Sat", time: "1:00 PM – 2:00 PM", mode: "Classroom", seats: "Open" },
      { name: "Evening", days: "Mon – Sat", time: "6:00 PM – 7:00 PM", mode: "Classroom", seats: "4 of 20 left" },
    ],
    faqs: [
      ["I am 45 and have never touched a computer. Is this course for me?", "Yes. A good part of every batch is adults learning for the first time. The trainer starts from the power button and repeats each step until you are comfortable."],
      ["Do I need my own laptop?", "No. You get your own computer in every class, and free lab hours for practice. If you buy a laptop later, we help you set it up."],
      ["Will this course be enough for a data entry job?", "It is the right first step. For data-entry work most employers also ask for typing speed and MS Office, so students usually continue with the English Typing and MS Office courses."],
    ],
    reviews: [
      { initials: "GS", name: "Gurleen S.", role: "Student, 12th pass", text: "I could not even hold the mouse properly when I joined. Now I make my own notes in Word and fill my exam forms online myself." },
      { initials: "BK", name: "Balwinder K.", role: "Shop owner, Jalandhar", text: "I joined to handle my own billing records. The trainer never made me feel slow, and I finished the course in two months." },
    ],
    related: ["ms-office-course-in-jalandhar", "english-typing-course-in-jalandhar", "advance-excel-course-in-jalandhar"],
  },

  {
    slug: "ms-office-course-in-jalandhar",
    title: "MS Office Course in Jalandhar",
    shortTitle: "MS Office",
    category: "Office & Basics",
    icon: "document",
    tagline: "Start your MS Office certification with practical, job-ready training — right here in Jalandhar.",
    summary: [
      "Looking for a government-recognized MS Office course in Jalandhar that actually improves your job prospects? You're in the right place. Under initiatives like the Punjab Skill Development Mission (PSDM) and PMKVY (Pradhan Mantri Kaushal Vikas Yojana), Jalandhar students now have access to structured, certified computer training that aligns with real industry demand — including a recent PSDM–Microsoft collaboration focused on digital productivity skills for Punjab's youth.",
      "This MS Office program covers Word, Excel, PowerPoint, and Outlook from the basics to advanced, job-ready proficiency — the exact skill set employers across banking, administration, retail, and back-office roles in Jalandhar and Punjab expect from freshers today. Classes are practical, project-based, and designed for 12th pass students, graduates, and job seekers who want a recognized certificate without long detours.",
      "Locally, training partners like Techcadd support this ecosystem by offering hands-on MS Office batches in Jalandhar aligned with these skilling standards — making certified, practical training accessible right in the city, without needing to travel to Chandigarh or Delhi for quality computer education.",
    ],
    seo: {
      title: "MS Office Course in Jalandhar | Word, Excel, PowerPoint & Outlook",
      description:
        "Three-month MS Office course in Jalandhar covering Word, Excel, PowerPoint and Outlook with practical office documents, certificate and placement assistance.",
      keywords: ["ms office course in jalandhar", "computer office course jalandhar", "word excel powerpoint classes jalandhar"],
    },
    level: "Beginner to Intermediate",
    duration: "3 months",
    weeklyHours: "7.5 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Weekend batch"],
    languages: ["Punjabi", "Hindi", "English"],
    certification: "GIT Education Certificate in Microsoft Office Applications",
    fee: { amount: 8500, installments: "2 instalments of ₹4,250" },
    seats: 20,
    rating: { value: 4.8, count: 186 },
    nextBatch: "1st and 15th of every month",
    highlights: [
      { icon: "shield", title: "Backed by a genuine government skilling push", text: "The Punjab Skill Development Mission has partnered with Microsoft to bring structured digital productivity training to the state's youth, and Jalandhar is home to one of PSDM's Multi Skill Development Centres. Enrolling now aligns your learning with a recognized, evolving skilling framework rather than an outdated or informal one." },
      { icon: "building", title: "Designed around real local job requirements", text: "Jalandhar's economy spans sports goods manufacturing and export, leather and hosiery, education and coaching, BPO and IT-enabled services, and a dense network of SMEs. Nearly all of them rely on Word for documentation, Excel for inventory, billing and data tracking, and PowerPoint for presentations — the exact use cases this program is built around." },
      { icon: "briefcase", title: "Practical, project-based learning", text: "You build real outputs — invoices and reports in Excel, formatted resumes and letters in Word, pitch-style decks in PowerPoint and professional email workflows in Outlook — so you can speak to what you've actually built in an interview." },
      { icon: "clock", title: "Short duration, fast return on time invested", text: "Unlike degree programs that take years, an MS Office course is completed in a matter of weeks — a low-time-commitment, high-utility addition to a resume in a competitive local job market." },
      { icon: "certificate", title: "A recognized certificate that signals credibility", text: "Employers in Jalandhar increasingly screen resumes for specific, verifiable skills rather than vague claims of \"computer knowledge.\" A structured certification connected to the PSDM/PMKVY skilling ecosystem demonstrates structured learning, assessment and a defined skill standard." },
      { icon: "location", title: "Local access without compromise", text: "This level of training no longer requires traveling to Chandigarh, Delhi or other metros. Training partners within Jalandhar, including Techcadd, bring practical, employability-focused MS Office training directly to the city — saving travel, time and cost." },
      { icon: "target", title: "Training aligned with real employability standards", text: "Techcadd structures its MS Office course around the skills Jalandhar employers actually screen for — spreadsheet management in Excel, professional documentation in Word, presentation-building in PowerPoint and everyday communication workflows in Outlook — with outputs that double as portfolio pieces." },
      { icon: "users", title: "Small-batch, practical-first teaching", text: "Instead of oversized batches where individual doubts get lost, Techcadd's MS Office training emphasizes hands-on lab time and doubt resolution rather than passive lecture-style teaching." },
      { icon: "calendar", title: "Flexible timings for different kinds of learners", text: "Fresh 12th pass students, graduates, working professionals and homemakers returning to the workforce all learn here, so batch timings are structured to fit the course around existing commitments." },
      { icon: "sparkle", title: "Support beyond the classroom", text: "Guidance on resume building, interview readiness and how these skills translate into actual job requirements in Jalandhar's local industries — sports goods, leather, BPO, retail and SMEs — makes the learning experience complete, not purely academic." },
    ],
    outcomes: [
      "Create resumes, official letters, reports and business templates in Word, using mail merge, tables, headers/footers, track changes and comments.",
      "Build inventory sheets, billing templates, attendance trackers and expense reports in Excel with SUM, AVERAGE, IF, VLOOKUP/HLOOKUP and COUNTIF.",
      "Sort, filter and summarize large datasets with pivot tables, and present numbers clearly with charts.",
      "Build pitch-style decks, project presentations and training materials in PowerPoint with clean layouts, visuals and charts.",
      "Handle professional email, calendar and meeting scheduling, and inbox management in Outlook from your first day in an office.",
      "Independently manage the day-to-day documentation, data and communication tasks Jalandhar employers expect from entry-level and mid-level staff.",
    ],
    audience: [
      "12th pass students — often the very first professional skill on your profile, a head start before graduation, and a useful gap-year skill while waiting for admission results or preparing for competitive exams.",
      "Graduates looking for job-ready skills — BA, B.Com, BSc, BCA or B.Tech graduates whose degree covered theory but left little room for hands-on Excel, Word or PowerPoint practice.",
      "Job seekers and working professionals — applying for administrative roles, switching careers, or formalizing skills picked up informally, including through PSDM-linked placement drives and PMKVY-affiliated job fairs.",
      "Housewives, homemakers and career returners — from Jalandhar and nearby towns like Kapurthala, Nakodar and Phillaur, re-entering the workforce or starting home-based work such as data entry, tutoring or bookkeeping.",
      "Anyone preparing for competitive or government exams — several Punjab exam patterns include computer proficiency tests as part of eligibility or scoring.",
    ],
    eligibility: [
      "No strict eligibility barrier — age, stream or current employment status rarely disqualifies you",
      "Basic literacy and a willingness to learn",
      "No prior computer experience is mandatory",
      "No strict age limit",
    ],
    curriculum: [
      {
        title: "MS Word",
        hours: "22 hours",
        topics: ["Document formatting fundamentals — fonts, styles, spacing and page layout", "Creating resumes, official letters, reports and business templates", "Mail merge for bulk letters or certificates", "Tables, headers and footers", "Reviewing tools — track changes and comments"],
      },
      {
        title: "MS Excel — core",
        hours: "24 hours",
        topics: ["Spreadsheet basics, formatting and data entry", "Formulas and functions — SUM, AVERAGE, IF and COUNTIF", "Data sorting and filtering", "Basic charting and data visualization", "Presenting numbers clearly"],
      },
      {
        title: "MS Excel — applied",
        hours: "16 hours",
        topics: ["VLOOKUP and HLOOKUP", "Pivot tables for summarizing large datasets", "Inventory sheets and billing templates", "Attendance trackers", "Basic expense reports"],
      },
      {
        title: "MS PowerPoint",
        hours: "14 hours",
        topics: ["Slide design, layouts and transitions", "Effective use of visuals and charts", "Pitch-style decks", "Project presentations and training materials", "Presenting in a classroom, interview or workplace meeting"],
      },
      {
        title: "MS Outlook and integration",
        hours: "14 hours",
        topics: ["Professional email etiquette", "Calendar and meeting scheduling", "Inbox management", "Basic computer and internet literacy — file management, operating system basics and safe internet use", "Resume building, interview guidance and final practical assessment"],
      },
    ],
    tools: [
      { group: "Documents", items: ["MS Word", "Mail merge", "Track changes"] },
      { group: "Spreadsheets", items: ["MS Excel", "Formulas & functions", "Pivot tables", "Charts"] },
      { group: "Presentation & mail", items: ["MS PowerPoint", "MS Outlook"] },
      { group: "Computer basics", items: ["File management", "Operating system basics", "Safe internet use"] },
    ],
    projects: [
      { title: "Invoices and reports", text: "Build invoices, billing templates and reports in Excel — the same files used in Jalandhar's retail, export and small business sectors.", tags: ["Excel", "Formulas"] },
      { title: "Inventory and attendance tracker", text: "A working inventory sheet and attendance tracker with lookups, sorting, filtering and a pivot table summary.", tags: ["Excel", "Pivot"] },
      { title: "Resume and official letters", text: "A formatted resume, official letters and business templates in Word, with mail merge for bulk letters or certificates.", tags: ["Word", "Mail merge"] },
      { title: "Pitch-style presentation", text: "A pitch-style deck with clean layouts, visuals and charts, ready to present in a classroom, interview or workplace meeting.", tags: ["PowerPoint", "Charts"] },
    ],
    careers: [
      { role: "Data Entry Operator", salary: "₹1.4 – 2.4 LPA", demand: "High" },
      { role: "Administrative Assistant", salary: "₹1.8 – 3.0 LPA", demand: "Very high" },
      { role: "Office Coordinator", salary: "₹1.8 – 3.2 LPA", demand: "Moderate" },
      { role: "Back-office Executive", salary: "₹1.6 – 2.8 LPA", demand: "High" },
      { role: "Billing / Inventory Executive", salary: "₹1.6 – 2.8 LPA", demand: "High" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "9:00 AM – 10:30 AM", mode: "Classroom", seats: "Open" },
      { name: "Evening", days: "Mon – Fri", time: "6:00 PM – 7:30 PM", mode: "Classroom", seats: "5 of 20 left" },
      { name: "Weekend", days: "Sat – Sun", time: "11:00 AM – 2:00 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["What is the best MS Office course in Jalandhar for beginners?", "A good beginner-friendly MS Office course in Jalandhar covers Word, Excel, PowerPoint, and Outlook from the basics, with hands-on practice rather than just theory. Look for programs aligned with government skilling standards like PSDM or PMKVY, and locally accessible training partners such as Techcadd, so you get structured, verifiable learning close to home."],
      ["Who is eligible to join an MS Office course in Jalandhar?", "There's no strict eligibility barrier. 12th pass students, graduates, job seekers, working professionals, and homemakers can all enroll. Most centers only require basic literacy and a willingness to learn — no prior computer experience is mandatory."],
      ["How long does an MS Office course in Jalandhar usually take?", "Most MS Office courses are completed in a few weeks, depending on batch schedule and depth of training. This makes it a practical, low-time-commitment option compared to longer diploma or degree programs."],
      ["Is the MS Office course certificate recognized by employers in Jalandhar?", "Yes. A structured MS Office certificate, especially one aligned with skilling frameworks like PMKVY or PSDM standards, is widely accepted by employers across Jalandhar's retail, BPO, administrative, and SME sectors as proof of practical computer proficiency."],
      ["What topics are covered in an MS Office course?", "Core modules typically include Word (documentation and formatting), Excel (formulas, pivot tables, data management), PowerPoint (presentation design), and Outlook (professional email and scheduling). Some programs also include basic computer and internet literacy for absolute beginners."],
      ["Can I do this course while working a full-time or part-time job?", "Yes. Many training centers in Jalandhar, including Techcadd, offer flexible batch timings — morning, evening, or weekend slots — specifically designed for working professionals and students managing other commitments."],
      ["Is MS Office training useful for government job applications in Jalandhar?", "Yes. Several government and semi-government exam patterns in Punjab include computer proficiency as part of eligibility or scoring criteria, so a completed MS Office course can directly support your application or exam readiness."],
      ["Why choose a local Jalandhar-based institute instead of an online-only course?", "In-person, local training offers hands-on lab practice, immediate doubt resolution, and structured assessments — advantages that are harder to replicate in a purely self-paced online format, especially for practical, tool-based subjects like MS Office."],
      ["Does Techcadd offer government-aligned MS Office training in Jalandhar?", "Techcadd structures its MS Office course around practical, employability-focused learning that aligns with the broader skilling standards promoted under Punjab's government initiatives, making it a convenient local option for Jalandhar students."],
      ["What kind of jobs can I apply for after completing an MS Office course?", "Common roles include data entry operator, administrative assistant, office coordinator, back-office executive, and billing/inventory roles — all widely available across Jalandhar's retail, export, BPO, and SME sectors."],
      ["Is there an age limit to join an MS Office course in Jalandhar?", "No strict age limit typically applies. The course is suited for recent 12th pass students, graduates in their early 20s, working professionals, and even homemakers returning to the workforce later in life."],
    ],
    reviews: [
      { initials: "SK", name: "Simran Kaur", role: "Model Town, Jalandhar", text: "I did my 12th from a Model Town school and had zero computer knowledge before this. The Excel classes especially helped — now I can make bills and reports without asking anyone. Feels good to have a proper certificate in hand." },
      { initials: "HS", name: "Harpreet Singh", role: "Nakodar Road, Jalandhar", text: "Mainu job dhundan vele har jagah 'MS Office knowledge required' likhya milda si. Ohi gap fill karan layi eh course kita, te sach kaha jaave, interview vich confidence bahut vadh gaya." },
      { initials: "PS", name: "Priya Sharma", role: "GT Road, Jalandhar", text: "B.Com kiti si but practical Excel kadi nahi seekhya si. Yahan pivot table te formulas hands-on sikhaye gaye, jo college vich kade nahi hoya. Ab confidently resume vich likh sakdi haan." },
      { initials: "RM", name: "Rohit Mahajan", role: "Maqsudan, Jalandhar", text: "Batch timings flexible the, so main apni part-time job de naal eh course kar saka. PowerPoint module sabse vadhiya laga, presentations banaunda bahut vadhiya seekhya." },
      { initials: "AD", name: "Anjali Devi", role: "Kapurthala (commutes to Jalandhar)", text: "Ghar sambhalan de baad job dhundna hor mushkil ho gaya si, par ehna instructors ne bahut patience naal sikhaya. Word te Excel dono chungi tarah aa gaye, ab data entry di job vaste apply kar rahi haan." },
      { initials: "KS", name: "Karanveer Singh", role: "Phillaur", text: "Mera bhai ne Jalandhar da centre suggest kita si kyunki Chandigarh jaan di zaroorat nahi si. Practical training bahut vadhiya, teachers har doubt clear karde. Certificate PMKVY standard de naal match honda hai, that gave extra confidence." },
      { initials: "NR", name: "Neha Rani", role: "Basti Sheikh, Jalandhar", text: "Graduate hone de baad bhi Excel vich weak si. Course de baad ab VLOOKUP, pivot tables sab aa gaye. Only thing — thodi hor practice time mil jaave taan hor vadhiya." },
      { initials: "AK", name: "Amanpreet Kaur", role: "Guru Teg Bahadur Nagar, Jalandhar", text: "Sports goods industry vich office job layi apply kita si, waha MS Office test hoya. Iss course di wajah naal easily clear ho gaya. Sach vich local level te vadhiya training mildi hai, bahar jaan di zaroorat nahi." },
      { initials: "DK", name: "Deepak Kumar", role: "Jalandhar Cantt", text: "Government exam layi computer proficiency test dena si, ohi layi eh course kita. Structured tarike naal sab kuch cover hoya — Word, Excel, PowerPoint, Outlook sab. Worth karna." },
      { initials: "MK", name: "Manpreet Kaur", role: "Adarsh Nagar, Jalandhar", text: "Housewife haan, ghar toh kam karn di soch rahi si, ohi layi eh course join kita. Ab basic bookkeeping te data entry da kaam kar sakdi haan. Teachers da behavior bahut supportive si." },
      { initials: "YS", name: "Yuvraj Sharma", role: "Urban Estate, Jalandhar", text: "BCA kiti si par interview vich practical MS Office skills test hundi si, jo theory naal nahi aayi. Iss course ne wo gap fill kita, especially Excel formulas te PowerPoint design. Highly recommend Jalandhar de students nu." },
    ],
    related: ["advance-excel-course-in-jalandhar", "basic-computer-course-in-jalandhar", "tally-prime-course-in-jalandhar"],
  },

  {
    slug: "advance-excel-course-in-jalandhar",
    title: "Advance Excel Course in Jalandhar",
    shortTitle: "Advance Excel",
    category: "Office & Basics",
    icon: "chart",
    tagline: "Lookups, pivots, Power Query, dashboards and macros for MIS and analyst roles.",
    summary: [
      "An Excel course for people who already use Excel and want the skills that MIS, accounts and analyst jobs are hiring for: reliable lookups, clean pivots, automated data cleaning with Power Query and dashboards a manager can read at a glance.",
      "Every module ends with a report built from raw, messy data, because that is the form data arrives in at work.",
    ],
    seo: {
      title: "Advance Excel Course in Jalandhar | Pivot Tables, Power Query & Dashboards",
      description:
        "Advance Excel training in Jalandhar: VLOOKUP, XLOOKUP, pivot tables, Power Query, dashboards and macros with MIS projects, certificate and placement support.",
      keywords: ["advance excel course in jalandhar", "excel classes jalandhar", "mis excel training punjab", "excel dashboard course jalandhar"],
    },
    level: "Intermediate to Advanced",
    duration: "2.5 months",
    weeklyHours: "7.5 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Live online", "Weekend batch"],
    languages: ["English", "Hindi", "Punjabi"],
    certification: "GIT Education Certificate in Advanced Excel & MIS Reporting",
    fee: { amount: 11000, installments: "2 instalments of ₹5,500" },
    seats: 16,
    rating: { value: 4.9, count: 162 },
    nextBatch: "1st of every month",
    highlights: [
      { icon: "chart", title: "Dashboard-led", text: "Four dashboards built from raw data, each reviewed and critiqued in class." },
      { icon: "code", title: "Power Query and macros", text: "Automate the cleaning and refreshing that takes most people a full morning." },
      { icon: "briefcase", title: "MIS case studies", text: "Sales, attendance, inventory and collection reports modelled on real office files." },
      { icon: "certificate", title: "Practical assessment", text: "Certificate issued after a timed, real-world Excel test." },
    ],
    outcomes: [
      "Build reliable lookups with XLOOKUP, INDEX/MATCH and multi-condition criteria.",
      "Turn raw exports into clean tables automatically with Power Query.",
      "Summarise large datasets with pivot tables, slicers and calculated fields.",
      "Design one-screen dashboards with charts, KPIs and conditional formatting.",
      "Record and edit macros to remove repetitive monthly work.",
      "Protect, share and audit a workbook so other people can use it safely.",
    ],
    audience: [
      "Accounts, sales and operations staff who report in Excel",
      "MIS executives and analysts wanting to move up",
      "Graduates targeting data and reporting roles",
      "Business owners reviewing their own numbers",
    ],
    eligibility: ["Comfortable with basic Excel formulas and formatting", "Graduate or working professional", "Own laptop useful but not required"],
    curriculum: [
      {
        title: "Formula mastery",
        hours: "16 hours",
        topics: ["Absolute, relative and mixed references", "IF, IFS, AND, OR and nested logic", "SUMIFS, COUNTIFS, AVERAGEIFS", "Text, date and time functions", "Error handling with IFERROR"],
      },
      {
        title: "Lookups and data models",
        hours: "14 hours",
        topics: ["VLOOKUP and its limits", "XLOOKUP and INDEX/MATCH", "Multi-criteria lookups", "Data validation and dependent dropdowns", "Named ranges and structured tables"],
      },
      {
        title: "Pivot tables and analysis",
        hours: "16 hours",
        topics: ["Pivot table layouts and grouping", "Calculated fields and items", "Slicers and timelines", "Pivot charts", "GETPIVOTDATA for report cells"],
      },
      {
        title: "Power Query",
        hours: "14 hours",
        topics: ["Importing from CSV, Excel, folder and web", "Split, merge, unpivot and fill", "Appending and merging queries", "Refreshable monthly reports", "Query documentation and troubleshooting"],
      },
      {
        title: "Dashboards",
        hours: "14 hours",
        topics: ["Choosing the right chart for the question", "KPI tiles and sparklines", "Conditional formatting rules", "Layout, colour and print/PDF export", "Dashboard review and feedback"],
      },
      {
        title: "Macros and automation",
        hours: "12 hours",
        topics: ["Recording and running macros", "Reading and editing VBA code", "Buttons and simple forms", "Macro security and .xlsm files", "Final MIS project"],
      },
    ],
    tools: [
      { group: "Core", items: ["MS Excel 365", "Structured tables", "Named ranges"] },
      { group: "Analysis", items: ["Pivot tables", "Power Query", "Power Pivot basics", "Charts"] },
      { group: "Automation", items: ["Macros", "VBA basics", "Templates"] },
    ],
    projects: [
      { title: "Sales MIS dashboard", text: "Turn twelve months of raw invoices into a refreshable dashboard with region, product and month views.", tags: ["Power Query", "Pivot", "Dashboard"] },
      { title: "Attendance and payroll summary", text: "Clean biometric exports, calculate late marks and overtime, and produce a monthly payroll input sheet.", tags: ["Formulas", "Dates"] },
      { title: "Collection ageing report", text: "Build a receivables ageing analysis with buckets, highlighting and a one-click refresh macro.", tags: ["SUMIFS", "Macro"] },
    ],
    careers: [
      { role: "MIS Executive", salary: "₹2.4 – 4.8 LPA", demand: "Very high" },
      { role: "Data Analyst (Excel)", salary: "₹2.8 – 5.4 LPA", demand: "High" },
      { role: "Accounts Executive", salary: "₹2.0 – 3.6 LPA", demand: "High" },
      { role: "Operations Coordinator", salary: "₹2.2 – 4.0 LPA", demand: "Moderate" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "7:30 AM – 9:00 AM", mode: "Classroom", seats: "3 of 16 left" },
      { name: "Evening", days: "Mon – Fri", time: "7:00 PM – 8:30 PM", mode: "Classroom / Online", seats: "7 of 16 left" },
      { name: "Weekend", days: "Sun", time: "10:00 AM – 2:00 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["How much Excel do I need before joining?", "You should be able to type a formula, use SUM and format a sheet. If not, take the MS Office course first — we will tell you honestly at counselling which one fits."],
      ["Do you teach Power BI as well?", "Power Query and the data-model thinking taught here are the foundation of Power BI. A separate Power BI module is available as an add-on for students who need it for work."],
      ["Will macros work on my office computer?", "Yes, with macro-enabled files. We cover macro security settings and the common reasons a macro is blocked on a company machine."],
    ],
    reviews: [
      { initials: "RM", name: "Rohit M.", role: "MIS Executive, Mohali", text: "The Power Query module changed my month-end. What took me two days now refreshes in a minute." },
      { initials: "NK", name: "Neha K.", role: "Analyst, Ludhiana", text: "I built the sales dashboard from class into my interview presentation and got the offer the same week." },
    ],
    related: ["ms-office-course-in-jalandhar", "tally-prime-course-in-jalandhar", "artificial-intelligence-course-in-jalandhar"],
  },

  {
    slug: "tally-prime-course-in-jalandhar",
    title: "Tally Prime with GST Course in Jalandhar",
    shortTitle: "Tally Prime with GST",
    category: "Accounts & Typing",
    icon: "receipt",
    tagline: "Accounting, GST returns, TDS, payroll and inventory on real business entries.",
    summary: [
      "A complete accounting course built around Tally Prime as it is used in shops, firms and CA offices in Punjab — real vouchers, real GST rates and real month-end pressure.",
      "You post entries from actual bills, file practice GST returns, run payroll and close a set of books from opening balance to balance sheet.",
    ],
    seo: {
      title: "Tally Prime with GST Course in Jalandhar | Accounting & Taxation Training",
      description:
        "Tally Prime course in Jalandhar with GST, TDS, payroll and inventory. Practical accounting entries, e-way bills, returns practice, certificate and placement assistance.",
      keywords: ["tally course in jalandhar", "tally prime gst course jalandhar", "accounting course jalandhar", "gst training punjab"],
    },
    level: "Beginner to Advanced",
    duration: "3 months",
    weeklyHours: "7.5 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Weekend batch"],
    languages: ["Punjabi", "Hindi", "English"],
    certification: "GIT Education Certificate in Computerised Accounting & GST",
    fee: { amount: 12000, installments: "3 instalments of ₹4,000" },
    seats: 18,
    rating: { value: 4.9, count: 241 },
    nextBatch: "1st and 15th of every month",
    highlights: [
      { icon: "receipt", title: "Real vouchers", text: "Entries posted from actual purchase, sales and expense bills." },
      { icon: "shield", title: "GST done properly", text: "Rates, input credit, e-way bills and return formats, kept current with the law." },
      { icon: "briefcase", title: "Month-end simulation", text: "Close a full set of books under time pressure, the way a firm works." },
      { icon: "certificate", title: "CA-office ready", text: "Trained on the workflow local CA offices and firms actually follow." },
    ],
    outcomes: [
      "Create and maintain a company in Tally Prime with a correct ledger and group structure.",
      "Post every common voucher type: purchase, sales, payment, receipt, contra, journal and credit note.",
      "Apply GST correctly on inward and outward supplies, including input credit and reverse charge.",
      "Prepare the data needed for GSTR-1 and GSTR-3B and generate e-way bills.",
      "Run inventory with stock groups, batches, godowns and reorder levels.",
      "Process payroll and TDS, and produce the trial balance, P&L and balance sheet.",
    ],
    audience: [
      "Commerce students and graduates targeting accounting jobs",
      "Existing accounts staff moving to Tally Prime",
      "Shop and business owners doing their own billing and returns",
      "Anyone preparing to work in a CA office",
    ],
    eligibility: ["10+2, preferably commerce (others are taught the accounting basics)", "Basic computer knowledge", "Comfortable with numbers"],
    curriculum: [
      {
        title: "Accounting foundations",
        hours: "14 hours",
        topics: ["Double entry, debit and credit", "Ledgers, groups and the chart of accounts", "Journal, cash and bank books", "Trial balance logic", "Reading a P&L and balance sheet"],
      },
      {
        title: "Tally Prime essentials",
        hours: "18 hours",
        topics: ["Company creation and configuration", "Masters: ledgers, groups, stock items", "All voucher types with shortcuts", "Bill-wise details and outstanding reports", "Backup, restore and data security"],
      },
      {
        title: "GST in practice",
        hours: "22 hours",
        topics: ["GST structure, rates and HSN codes", "Sales and purchase with CGST/SGST/IGST", "Input tax credit and ineligible credit", "GSTR-1 and GSTR-3B data preparation", "E-invoicing and e-way bill generation"],
      },
      {
        title: "Inventory and billing",
        hours: "14 hours",
        topics: ["Stock groups, categories and units", "Batches, expiry and godowns", "Price lists and discounts", "Reorder levels and stock ageing", "Printed invoices and challans"],
      },
      {
        title: "Payroll and TDS",
        hours: "14 hours",
        topics: ["Employee masters and pay heads", "Attendance, salary processing and payslips", "PF, ESI and professional tax", "TDS sections, rates and deduction entries", "Form 16 data and TDS reports"],
      },
      {
        title: "Finalisation and month-end",
        hours: "12 hours",
        topics: ["Bank reconciliation", "Depreciation and adjusting entries", "Closing stock and year-end", "Report analysis and ratio reading", "Full month-end simulation project"],
      },
    ],
    tools: [
      { group: "Accounting", items: ["Tally Prime", "Tally ERP 9", "Busy Accounting"] },
      { group: "Compliance", items: ["GST portal", "E-way bill portal", "TDS returns", "Form 16"] },
      { group: "Support", items: ["MS Excel", "PDF invoicing", "Data backup"] },
    ],
    projects: [
      { title: "Trading company books", text: "Set up a trading firm from scratch and post three months of purchases, sales, expenses and payments.", tags: ["Tally", "Vouchers"] },
      { title: "GST return pack", text: "Prepare GSTR-1 and GSTR-3B working files from your posted data and reconcile them against the books.", tags: ["GST", "Reconciliation"] },
      { title: "Payroll run", text: "Process a month of salaries for fifteen employees with PF, ESI and TDS, and print payslips.", tags: ["Payroll", "TDS"] },
    ],
    careers: [
      { role: "Accountant", salary: "₹1.8 – 3.6 LPA", demand: "Very high" },
      { role: "Billing Executive", salary: "₹1.6 – 2.8 LPA", demand: "High" },
      { role: "GST Assistant", salary: "₹2.0 – 3.6 LPA", demand: "High" },
      { role: "Accounts Executive (CA firm)", salary: "₹2.0 – 4.2 LPA", demand: "Very high" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "8:00 AM – 9:30 AM", mode: "Classroom", seats: "2 of 18 left" },
      { name: "Evening", days: "Mon – Fri", time: "5:00 PM – 6:30 PM", mode: "Classroom", seats: "6 of 18 left" },
      { name: "Weekend", days: "Sat – Sun", time: "9:00 AM – 12:00 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["I am not from a commerce background. Can I learn Tally?", "Yes. The first module teaches the accounting logic — debit, credit, ledgers — before Tally is opened. Students from arts and science streams complete this course every batch."],
      ["Is GST taught with the current rules?", "Yes. The GST module is reviewed each quarter against the current notifications, including e-invoicing thresholds and the latest return formats."],
      ["Will I be able to handle a small firm's accounts alone after this?", "That is the aim of the month-end simulation in the last module. Most students start as an assistant and handle a full set of books within a few months of joining."],
    ],
    reviews: [
      { initials: "SK", name: "Simran K.", role: "Accounts Assistant, Jalandhar", text: "Very practical. I learned billing and returns on real entries, and got a job at a CA office before the course ended." },
      { initials: "JS", name: "Jaspreet S.", role: "Accountant, Kapurthala", text: "The e-way bill and GSTR practice is what my employer tested me on in the interview. I had already done it a dozen times in class." },
    ],
    related: ["advance-excel-course-in-jalandhar", "ms-office-course-in-jalandhar", "basic-computer-course-in-jalandhar"],
  },

  {
    slug: "punjabi-typing-course-in-jalandhar",
    title: "Punjabi Typing Course in Jalandhar",
    shortTitle: "Punjabi Typing",
    category: "Accounts & Typing",
    icon: "keyboard",
    tagline: "Raavi and Asees typing with daily timed tests for Punjab government exams.",
    summary: [
      "A focused typing course for Punjab government recruitment tests — Raavi and Asees fonts, Gurmukhi keyboard layouts and the exact test conditions used in clerk and steno examinations.",
      "Speed is built the only way it can be: daily timed practice, accuracy tracking and correction of the specific keys you keep missing.",
    ],
    seo: {
      title: "Punjabi Typing Course in Jalandhar | Raavi & Asees for Government Exams",
      description:
        "Punjabi typing classes in Jalandhar in Raavi and Asees fonts with daily timed tests, Gurmukhi keyboard training and government exam practice. Morning and evening batches.",
      keywords: ["punjabi typing course in jalandhar", "raavi font typing classes", "gurmukhi typing jalandhar", "punjab govt typing test practice"],
    },
    level: "Beginner to Advanced",
    duration: "2 months",
    weeklyHours: "6 hours per week (6 classes)",
    modes: ["Classroom — Jalandhar", "Extra practice hours"],
    languages: ["Punjabi", "Hindi"],
    certification: "GIT Education Certificate in Punjabi Typing (with speed record)",
    fee: { amount: 4500, installments: "2 instalments of ₹2,250" },
    seats: 20,
    rating: { value: 4.9, count: 198 },
    nextBatch: "New batch every Monday",
    highlights: [
      { icon: "keyboard", title: "Raavi and Asees", text: "Both fonts taught, plus Gurmukhi Unicode for office work." },
      { icon: "clock", title: "Daily timed tests", text: "A recorded speed and accuracy test every class, with a weekly progress sheet." },
      { icon: "target", title: "Exam conditions", text: "Practice under the same time limit and error rules as the recruitment test." },
      { icon: "certificate", title: "Speed certificate", text: "Your certificate records your final words-per-minute and accuracy." },
    ],
    outcomes: [
      "Type Gurmukhi accurately without looking at the keyboard.",
      "Work in both Raavi and Asees fonts, and switch between them confidently.",
      "Reach the speed and accuracy required by Punjab government typing tests.",
      "Use Gurmukhi Unicode for office documents and online forms.",
      "Type from printed copy with correct punctuation and matras.",
      "Sit a full-length mock typing test without losing speed under pressure.",
    ],
    audience: [
      "Candidates for Punjab clerk, steno and data-entry posts",
      "Students preparing for government recruitment tests",
      "Office staff who type in Punjabi daily",
      "Anyone who needs certified Punjabi typing speed",
    ],
    eligibility: ["Able to read and write Punjabi", "Basic computer familiarity", "No prior typing experience needed"],
    curriculum: [
      {
        title: "Keyboard foundation",
        hours: "10 hours",
        topics: ["Gurmukhi keyboard layout", "Home-row finger placement", "Raavi font setup", "Posture and hand position", "First accuracy drills"],
      },
      {
        title: "Raavi font typing",
        hours: "14 hours",
        topics: ["Full character set and matras", "Sidhi and adhak combinations", "Punctuation and numerals", "Paragraph typing from copy", "Common error correction"],
      },
      {
        title: "Asees font typing",
        hours: "12 hours",
        topics: ["Asees layout differences", "Switching between fonts", "Font conversion tools", "Copy typing practice", "Accuracy under time"],
      },
      {
        title: "Speed building",
        hours: "14 hours",
        topics: ["Timed drills at increasing speeds", "Rhythm and stroke consistency", "Reducing backspace dependence", "Weekly speed records", "Targeted drills on weak keys"],
      },
      {
        title: "Exam practice",
        hours: "10 hours",
        topics: ["Punjab government test format", "Full-length mock tests", "Error rules and penalty calculation", "Gurmukhi Unicode for forms", "Final certified speed test"],
      },
    ],
    tools: [
      { group: "Fonts", items: ["Raavi", "Asees", "Gurmukhi Unicode", "Anmol Lipi"] },
      { group: "Practice", items: ["Typing test software", "Timed drills", "Accuracy reports"] },
      { group: "Applications", items: ["MS Word", "Online forms", "Font converters"] },
    ],
    projects: [
      { title: "Weekly speed log", text: "A recorded chart of your speed and accuracy week by week, signed by your trainer.", tags: ["Speed", "Tracking"] },
      { title: "Mock recruitment test", text: "A full-length test under exam conditions, marked with the official error rules.", tags: ["Exam", "Accuracy"] },
      { title: "Punjabi office document", text: "Type and format a letter in Gurmukhi Unicode ready for printing or online submission.", tags: ["Unicode", "Word"] },
    ],
    careers: [
      { role: "Clerk (Punjab Government)", salary: "As per pay scale", demand: "Very high" },
      { role: "Data Entry Operator", salary: "₹1.4 – 2.6 LPA", demand: "High" },
      { role: "Punjabi Content Typist", salary: "₹1.5 – 2.8 LPA", demand: "Moderate" },
    ],
    batches: [
      { name: "Early morning", days: "Mon – Sat", time: "7:00 AM – 8:00 AM", mode: "Classroom", seats: "Open" },
      { name: "Afternoon", days: "Mon – Sat", time: "2:00 PM – 3:00 PM", mode: "Classroom", seats: "Open" },
      { name: "Evening", days: "Mon – Sat", time: "6:30 PM – 7:30 PM", mode: "Classroom", seats: "3 of 20 left" },
    ],
    faqs: [
      ["What speed will I reach in two months?", "Most students who attend daily and use the free practice hours reach 25–30 words per minute with high accuracy in two months. Your certificate records your actual tested speed, not a claim."],
      ["Which font does the Punjab government test use?", "Tests have used both Raavi and Asees depending on the department and year, so the course covers both and you sit mocks in each."],
      ["Can I practise outside class?", "Yes. Lab practice hours are free for enrolled students on any working day, and this is where speed is really built."],
    ],
    reviews: [
      { initials: "HS", name: "Harpreet S.", role: "Clerk, Punjab Govt.", text: "Daily Raavi practice got me through my typing test comfortably. The mock tests were harder than the real one." },
      { initials: "PK", name: "Pawan K.", role: "Data Entry Operator", text: "I started at 8 words per minute. The weekly chart kept me honest, and I finished at 32." },
    ],
    related: ["english-typing-course-in-jalandhar", "basic-computer-course-in-jalandhar", "ms-office-course-in-jalandhar"],
  },

  {
    slug: "english-typing-course-in-jalandhar",
    title: "English Typing Course in Jalandhar",
    shortTitle: "English Typing",
    category: "Accounts & Typing",
    icon: "type",
    tagline: "Speed and accuracy for clerk, steno and data-entry examinations.",
    summary: [
      "A disciplined typing course that builds real speed: correct technique first, then daily timed drills, then full exam-length tests with the official error rules applied.",
      "Suitable both for exam candidates who need a certified speed and for office staff who want to stop hunting for keys.",
    ],
    seo: {
      title: "English Typing Course in Jalandhar | Speed & Accuracy Training",
      description:
        "English typing classes in Jalandhar with daily timed tests, technique correction and exam-format practice for clerk, steno and data entry posts.",
      keywords: ["english typing course in jalandhar", "typing classes jalandhar", "typing speed test practice punjab"],
    },
    level: "Beginner to Advanced",
    duration: "2 months",
    weeklyHours: "6 hours per week (6 classes)",
    modes: ["Classroom — Jalandhar", "Extra practice hours"],
    languages: ["English", "Hindi", "Punjabi"],
    certification: "GIT Education Certificate in English Typing (with speed record)",
    fee: { amount: 4000, installments: "2 instalments of ₹2,000" },
    seats: 20,
    rating: { value: 4.8, count: 154 },
    nextBatch: "New batch every Monday",
    highlights: [
      { icon: "type", title: "Technique first", text: "Two weeks on finger placement before speed is pushed — it is what makes speed last." },
      { icon: "clock", title: "Recorded daily tests", text: "Every class ends with a timed test that goes on your progress sheet." },
      { icon: "target", title: "Exam format practice", text: "Mocks match the length, difficulty and error rules of recruitment tests." },
      { icon: "certificate", title: "Certified speed", text: "Your final tested words-per-minute is printed on the certificate." },
    ],
    outcomes: [
      "Touch-type the full English keyboard without looking down.",
      "Maintain accuracy above 95% at your working speed.",
      "Type continuously from printed copy for a full test duration.",
      "Handle numbers, symbols and punctuation without slowing.",
      "Meet the typing speed required by common government recruitment tests.",
      "Type comfortably for a full working day without strain.",
    ],
    audience: [
      "Government exam candidates needing a typing qualification",
      "Data entry and back-office staff",
      "Students preparing for computer-based tests",
      "Anyone who types slowly with two fingers",
    ],
    eligibility: ["Basic English reading", "Basic computer familiarity", "No prior typing experience needed"],
    curriculum: [
      { title: "Technique", hours: "10 hours", topics: ["Home row and finger assignment", "Posture, wrist and screen position", "Rhythm over rush", "First accuracy drills", "Breaking hunt-and-peck habits"] },
      { title: "Full keyboard", hours: "12 hours", topics: ["Top and bottom rows", "Capitals and shift technique", "Numbers and the number row", "Punctuation and symbols", "Copy typing paragraphs"] },
      { title: "Speed building", hours: "14 hours", topics: ["Graduated timed drills", "Weak-key targeting", "Reducing corrections", "Sustained typing stamina", "Weekly speed records"] },
      { title: "Accuracy under pressure", hours: "12 hours", topics: ["Error types and how to prevent them", "Reading ahead while typing", "Long-form copy tests", "Typing from handwritten copy", "Managing test nerves"] },
      { title: "Exam practice", hours: "10 hours", topics: ["Recruitment test formats", "Full-length mock tests", "Official error and penalty rules", "Result analysis", "Final certified speed test"] },
    ],
    tools: [
      { group: "Practice", items: ["Typing tutor software", "Timed test software", "Accuracy reports"] },
      { group: "Applications", items: ["MS Word", "Notepad", "Online test portals"] },
    ],
    projects: [
      { title: "Speed progression chart", text: "A week-by-week record of speed and accuracy, signed off by your trainer.", tags: ["Tracking"] },
      { title: "Exam-length mock", text: "A full test under recruitment conditions, marked with official penalties.", tags: ["Exam"] },
      { title: "Document typing set", text: "Type and format five business documents from printed copy within a time limit.", tags: ["Word", "Accuracy"] },
    ],
    careers: [
      { role: "Data Entry Operator", salary: "₹1.4 – 2.6 LPA", demand: "Very high" },
      { role: "Clerk / LDC", salary: "As per pay scale", demand: "High" },
      { role: "Back Office Assistant", salary: "₹1.6 – 2.8 LPA", demand: "High" },
    ],
    batches: [
      { name: "Early morning", days: "Mon – Sat", time: "7:00 AM – 8:00 AM", mode: "Classroom", seats: "Open" },
      { name: "Afternoon", days: "Mon – Sat", time: "3:00 PM – 4:00 PM", mode: "Classroom", seats: "Open" },
      { name: "Evening", days: "Mon – Sat", time: "7:30 PM – 8:30 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["How fast can I get in two months?", "Students who attend daily typically reach 30–40 words per minute with good accuracy. The certificate records your tested speed rather than a promised figure."],
      ["Should I take English and Punjabi typing together?", "Many exam candidates do, in back-to-back class slots. There is a combined fee for both courses — ask at counselling."],
      ["Do you correct bad typing habits?", "Yes, and that is the hardest part of the first two weeks. Self-taught two-finger typists are slowed down deliberately at first, then rebuilt on correct technique."],
    ],
    reviews: [
      { initials: "AD", name: "Anjali D.", role: "Data Entry Operator, Jalandhar", text: "I typed with two fingers for years. It felt slower for two weeks, then much faster than before." },
      { initials: "VS", name: "Vikram S.", role: "Exam candidate", text: "The mock tests with penalty marking prepared me for exactly what the exam felt like." },
    ],
    related: ["punjabi-typing-course-in-jalandhar", "basic-computer-course-in-jalandhar", "ms-office-course-in-jalandhar"],
  },

  {
    slug: "cad-cam-course-in-jalandhar",
    title: "CAD / CAM Course in Jalandhar",
    shortTitle: "CAD / CAM",
    category: "Design & CAD",
    icon: "cube",
    tagline: "AutoCAD, SolidWorks, CATIA, Creo and Revit taught on production drawings.",
    summary: [
      "A design and drafting course for mechanical, civil and architecture students that moves from 2D drafting discipline to full 3D modelling and production drawings.",
      "Every module ends with a drawing set that meets drawing-office standards — correct layers, dimensions, tolerances, title block and print scale — because that is what a design office checks first.",
    ],
    seo: {
      title: "CAD CAM Course in Jalandhar | AutoCAD, SolidWorks, CATIA & Revit Training",
      description:
        "CAD/CAM training in Jalandhar covering AutoCAD 2D and 3D, SolidWorks, CATIA, Creo and Revit with production drawings, portfolio projects and placement support.",
      keywords: ["cad cam course in jalandhar", "autocad classes jalandhar", "solidworks training punjab", "revit course jalandhar"],
    },
    level: "Beginner to Advanced",
    duration: "6 months",
    weeklyHours: "9 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Weekend batch"],
    languages: ["English", "Hindi", "Punjabi"],
    certification: "GIT Education Diploma in CAD / CAM Design",
    fee: { amount: 28000, installments: "3 instalments of ₹9,334" },
    seats: 16,
    rating: { value: 4.8, count: 137 },
    nextBatch: "1st of every month",
    highlights: [
      { icon: "cube", title: "Five industry packages", text: "AutoCAD, SolidWorks, CATIA, Creo and Revit in one structured sequence." },
      { icon: "document", title: "Drawing-office standards", text: "Layers, dimensioning, tolerances and title blocks checked on every submission." },
      { icon: "briefcase", title: "Portfolio drawing set", text: "A printed and digital portfolio of assemblies and drawings for interviews." },
      { icon: "certificate", title: "Diploma in 6 months", text: "Issued after a practical modelling and drafting assessment." },
    ],
    outcomes: [
      "Produce accurate 2D drawings with correct layers, blocks, dimensions and annotation.",
      "Model 3D parts and assemblies with proper feature trees and mates.",
      "Generate production drawings with sections, views, tolerances and a title block.",
      "Apply GD&T symbols and read an existing engineering drawing correctly.",
      "Work in Revit for basic building models, floor plans and elevations.",
      "Present a portfolio of drawings and models that a design office can assess.",
    ],
    audience: [
      "Mechanical, civil and architecture students and diploma holders",
      "ITI draughtsmen upgrading to 3D packages",
      "Working technicians moving into design roles",
      "Fabrication and manufacturing unit staff",
    ],
    eligibility: ["10+2, ITI or engineering background preferred", "Basic computer knowledge", "Ability to read basic engineering drawings is useful but taught if not"],
    curriculum: [
      { title: "AutoCAD 2D", hours: "40 hours", topics: ["Drawing setup, units and limits", "Draw and modify commands", "Layers, linetypes and properties", "Blocks, attributes and xrefs", "Dimensioning, annotation and plotting"] },
      { title: "AutoCAD 3D", hours: "28 hours", topics: ["3D workspace and coordinate systems", "Solid primitives and boolean operations", "Extrude, revolve, sweep and loft", "Materials, lighting and rendering", "3D to 2D drawing views"] },
      { title: "SolidWorks", hours: "40 hours", topics: ["Sketching and constraints", "Part features and design intent", "Assemblies and mates", "Drawing views and BOM", "Sheet metal and weldment basics"] },
      { title: "CATIA and Creo", hours: "36 hours", topics: ["Part design workbench", "Surface modelling basics", "Assembly design", "Drafting workbench", "Package comparison and file exchange"] },
      { title: "Revit and BIM", hours: "26 hours", topics: ["Levels, grids and walls", "Doors, windows and families", "Floors, roofs and stairs", "Floor plans, elevations and sections", "Sheets, schedules and export"] },
      { title: "Standards and portfolio", hours: "20 hours", topics: ["GD&T and tolerance stacks", "Drawing checking and revision control", "File formats: DWG, STEP, IGES, PDF", "Portfolio assembly and printing", "Final practical assessment"] },
    ],
    tools: [
      { group: "Drafting", items: ["AutoCAD 2D", "AutoCAD 3D", "DraftSight basics"] },
      { group: "3D modelling", items: ["SolidWorks", "CATIA", "Creo", "Fusion 360"] },
      { group: "Architecture", items: ["Revit", "3ds Max basics", "BIM workflow"] },
    ],
    projects: [
      { title: "Machine part drawing set", text: "Model a gearbox component and produce a fully dimensioned production drawing with tolerances.", tags: ["SolidWorks", "GD&T"] },
      { title: "Assembly with BOM", text: "Build a multi-part assembly with correct mates, an exploded view and a bill of materials.", tags: ["Assembly", "Drawings"] },
      { title: "Residential floor plan", text: "Create a two-bedroom house model in Revit with plans, elevations, sections and a sheet set.", tags: ["Revit", "BIM"] },
    ],
    careers: [
      { role: "CAD Draughtsman", salary: "₹1.8 – 3.6 LPA", demand: "Very high" },
      { role: "Design Engineer (Trainee)", salary: "₹2.4 – 4.8 LPA", demand: "High" },
      { role: "Architectural Assistant", salary: "₹2.0 – 3.6 LPA", demand: "High" },
      { role: "Product Design Assistant", salary: "₹2.4 – 4.2 LPA", demand: "Moderate" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "9:00 AM – 11:00 AM", mode: "Classroom", seats: "4 of 16 left" },
      { name: "Evening", days: "Mon – Fri", time: "5:00 PM – 7:00 PM", mode: "Classroom", seats: "7 of 16 left" },
      { name: "Weekend", days: "Sat – Sun", time: "10:00 AM – 2:30 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["Do I need an engineering degree?", "No. Diploma holders, ITI draughtsmen and 10+2 students join every batch. Engineering students usually move faster through the first module, and the syllabus lets them."],
      ["Can I take only AutoCAD?", "Yes, AutoCAD 2D and 3D can be taken as a separate two-month course. The full diploma is better value if you are targeting a design role."],
      ["Is the software licensed?", "Yes, the lab runs licensed or education-licensed installations, and we show you the legitimate student versions you can install at home."],
    ],
    reviews: [
      { initials: "AV", name: "Arjun V.", role: "Draughtsman, Phagwara", text: "AutoCAD and SolidWorks were taught with real drawings, not sample files. My portfolio got me hired." },
      { initials: "KS", name: "Karan S.", role: "Design trainee, Ludhiana", text: "The drawing-checking discipline was strict, and that is exactly what my company cares about." },
    ],
    related: ["graphic-design-course-in-jalandhar", "advance-excel-course-in-jalandhar", "basic-computer-course-in-jalandhar"],
  },

  {
    slug: "graphic-design-course-in-jalandhar",
    title: "Graphic Design Course in Jalandhar",
    shortTitle: "Graphic Design",
    category: "Design & CAD",
    icon: "pen",
    tagline: "Photoshop, CorelDRAW, Illustrator and InDesign for print, social media and branding.",
    summary: [
      "A working designer's course: the four industry tools, the design principles behind them, and the print and social-media specifications that decide whether a job comes back for reprinting.",
      "You build a real portfolio — logo, brand kit, social campaign, brochure and wedding card — and learn how to prepare files a press can actually print.",
    ],
    seo: {
      title: "Graphic Design Course in Jalandhar | Photoshop, CorelDRAW & Illustrator",
      description:
        "Graphic design training in Jalandhar covering Photoshop, CorelDRAW, Illustrator and InDesign with branding, print production and a portfolio of live projects.",
      keywords: ["graphic design course in jalandhar", "photoshop classes jalandhar", "coreldraw course punjab", "illustrator training jalandhar"],
    },
    level: "Beginner to Advanced",
    duration: "5 months",
    weeklyHours: "9 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Weekend batch"],
    languages: ["English", "Hindi", "Punjabi"],
    certification: "GIT Education Diploma in Graphic Design & Print Production",
    fee: { amount: 22000, installments: "3 instalments of ₹7,334" },
    seats: 16,
    rating: { value: 4.8, count: 149 },
    nextBatch: "1st of every month",
    highlights: [
      { icon: "pen", title: "Four industry tools", text: "Photoshop, CorelDRAW, Illustrator and InDesign, each used for what it is actually best at." },
      { icon: "target", title: "Design principles", text: "Type, grid, colour and hierarchy — so your work looks designed, not decorated." },
      { icon: "printer", title: "Print-ready files", text: "Bleed, CMYK, resolution and cutting marks checked on every submission." },
      { icon: "briefcase", title: "Real portfolio", text: "Five finished pieces, printed and digital, ready to show a studio or a client." },
    ],
    outcomes: [
      "Edit and retouch photographs to a professional standard in Photoshop.",
      "Draw scalable vector logos and illustrations in Illustrator and CorelDRAW.",
      "Lay out multi-page brochures and magazines in InDesign with a proper grid.",
      "Apply type, colour and layout principles rather than guessing.",
      "Prepare print-ready artwork with bleed, CMYK and correct resolution.",
      "Present a portfolio and quote a job to a client with confidence.",
    ],
    audience: [
      "Students and graduates aiming for design studio jobs",
      "Print shop and DTP operators upgrading their skills",
      "Small business owners making their own marketing material",
      "Freelancers building a design income",
    ],
    eligibility: ["10+2 or above", "Basic computer knowledge", "An interest in visual work; drawing skill is not required"],
    curriculum: [
      { title: "Design foundations", hours: "18 hours", topics: ["Typography and font pairing", "Colour theory and CMYK vs RGB", "Grid, alignment and hierarchy", "Composition and white space", "Critique: reading a design"] },
      { title: "Adobe Photoshop", hours: "34 hours", topics: ["Selections, layers and masks", "Retouching and healing tools", "Adjustment layers and colour grading", "Compositing and effects", "Social media and web export"] },
      { title: "CorelDRAW", hours: "30 hours", topics: ["Vector drawing and node editing", "Text handling and envelopes", "Visiting cards and flex banners", "Colour palettes for local print", "Print setup and cutting marks"] },
      { title: "Adobe Illustrator", hours: "30 hours", topics: ["Pen tool mastery", "Logo construction and grids", "Pathfinder, gradients and blends", "Brand mark variations", "Exporting for web and print"] },
      { title: "Adobe InDesign", hours: "24 hours", topics: ["Master pages and grids", "Paragraph and character styles", "Multi-page brochures", "Tables and long documents", "Packaging files for the press"] },
      { title: "Portfolio and client work", hours: "20 hours", topics: ["Brief taking and rough concepts", "Presenting options to a client", "Revisions and file handover", "Pricing and invoicing basics", "Portfolio build and final review"] },
    ],
    tools: [
      { group: "Raster", items: ["Adobe Photoshop", "Lightroom basics"] },
      { group: "Vector", items: ["CorelDRAW", "Adobe Illustrator"] },
      { group: "Layout & print", items: ["Adobe InDesign", "PageMaker", "PDF/X export", "Press specifications"] },
      { group: "Extras", items: ["Canva", "Premiere Pro basics", "Social media formats"] },
    ],
    projects: [
      { title: "Brand identity kit", text: "Design a logo with variations, colour palette, type scale and a one-page brand sheet for a local business.", tags: ["Illustrator", "Branding"] },
      { title: "Social media campaign", text: "A five-post campaign in the correct sizes for Instagram and Facebook, consistent across the set.", tags: ["Photoshop", "Social"] },
      { title: "Print pack", text: "Visiting card, flex banner and wedding card prepared with bleed and cutting marks, checked against press specs.", tags: ["CorelDRAW", "Print"] },
      { title: "Twelve-page brochure", text: "A product brochure built on a grid with styles, ready to package and send to a press.", tags: ["InDesign", "Layout"] },
    ],
    careers: [
      { role: "Graphic Designer", salary: "₹1.8 – 4.2 LPA", demand: "Very high" },
      { role: "DTP Operator", salary: "₹1.5 – 2.8 LPA", demand: "High" },
      { role: "Social Media Designer", salary: "₹2.0 – 4.2 LPA", demand: "Very high" },
      { role: "Freelance Designer", salary: "Project based", demand: "High" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "10:00 AM – 12:00 PM", mode: "Classroom", seats: "5 of 16 left" },
      { name: "Evening", days: "Mon – Fri", time: "4:30 PM – 6:30 PM", mode: "Classroom", seats: "6 of 16 left" },
      { name: "Weekend", days: "Sat – Sun", time: "11:00 AM – 3:00 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["I cannot draw. Is graphic design still possible for me?", "Yes. Almost no commercial design work is hand drawing. It is type, layout, colour and software skill, all of which are taught step by step."],
      ["Do I need a Mac?", "No. The lab runs Windows machines with licensed software, which is what most studios and print shops in Punjab use."],
      ["Will I be able to freelance after the course?", "The last module covers briefs, revisions, pricing and file handover specifically so you can take small jobs. Several students start freelancing while still studying."],
    ],
    reviews: [
      { initials: "NB", name: "Navneet B.", role: "Graphic Designer, Ludhiana", text: "I learned Photoshop and CorelDRAW from scratch. Now I design banners and wedding cards for my own clients." },
      { initials: "TS", name: "Tanvir S.", role: "Designer, Jalandhar", text: "The print-ready checking was the most useful part. My files stopped coming back from the press." },
    ],
    related: ["dtp-printing-course-in-jalandhar", "digital-marketing-course-in-jalandhar", "cad-cam-course-in-jalandhar"],
  },

  {
    slug: "dtp-printing-course-in-jalandhar",
    title: "DTP & Printing Course in Jalandhar",
    shortTitle: "DTP & Printing",
    category: "Design & CAD",
    icon: "printer",
    tagline: "Page layout, visiting cards, flex banners and wedding cards, prepared for the press.",
    summary: [
      "A short, practical course for print shop work: setting type, laying out pages and producing the visiting cards, banners, cards and stationery that local presses print every day.",
      "The focus is on getting files right the first time — correct size, bleed, colour mode and resolution — which is what separates a paid job from a reprint.",
    ],
    seo: {
      title: "DTP & Printing Course in Jalandhar | Page Layout & Print Production",
      description:
        "DTP course in Jalandhar covering PageMaker, CorelDRAW, InDesign and print production for visiting cards, banners, wedding cards and brochures.",
      keywords: ["dtp course in jalandhar", "printing course punjab", "pagemaker coreldraw classes jalandhar"],
    },
    level: "Beginner to Intermediate",
    duration: "3 months",
    weeklyHours: "7.5 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Weekend batch"],
    languages: ["Punjabi", "Hindi", "English"],
    certification: "GIT Education Certificate in Desktop Publishing",
    fee: { amount: 9500, installments: "2 instalments of ₹4,750" },
    seats: 18,
    rating: { value: 4.7, count: 96 },
    nextBatch: "1st and 15th of every month",
    highlights: [
      { icon: "printer", title: "Press-ready output", text: "Bleed, crop marks, CMYK and resolution checked on every file you submit." },
      { icon: "type", title: "Multilingual typesetting", text: "Punjabi, Hindi and English typesetting, including font and Unicode issues." },
      { icon: "briefcase", title: "Real job formats", text: "Visiting cards, flex, wedding cards, bill books, brochures and pamphlets." },
      { icon: "certificate", title: "Certificate in 3 months", text: "Issued after a practical print-production test." },
    ],
    outcomes: [
      "Lay out single and multi-page documents with correct margins and grids.",
      "Typeset accurately in Punjabi, Hindi and English, including Unicode conversion.",
      "Prepare visiting cards, flex banners and wedding cards to press specification.",
      "Set up bleed, crop marks, colour mode and resolution for every job type.",
      "Produce bill books, letterheads and stationery sets.",
      "Package and hand files to a press with the fonts and links included.",
    ],
    audience: [
      "Print shop and photocopy shop staff",
      "Students wanting a quick, employable skill",
      "Small business owners printing their own material",
      "Designers needing print production discipline",
    ],
    eligibility: ["10th pass or above", "Basic computer knowledge", "No design background required"],
    curriculum: [
      { title: "DTP foundations", hours: "14 hours", topics: ["Page sizes, margins and grids", "Typography for print", "Fonts, Unicode and legacy conversion", "Resolution and image sizing", "Colour modes explained"] },
      { title: "CorelDRAW for print", hours: "24 hours", topics: ["Vector drawing tools", "Text frames and paragraph styles", "Visiting card and card design", "Flex banner scaling", "Print setup and cutting marks"] },
      { title: "PageMaker and InDesign", hours: "22 hours", topics: ["Master pages", "Text flow and threading", "Multi-page documents", "Tables and price lists", "Packaging for output"] },
      { title: "Photoshop for DTP", hours: "16 hours", topics: ["Image correction and sharpening", "Background removal", "Resolution for large-format printing", "Clipping paths", "Saving in press formats"] },
      { title: "Production practice", hours: "14 hours", topics: ["Wedding card sets", "Bill books and numbering", "Brochure folding layouts", "Proofing and corrections", "Final practical assessment"] },
    ],
    tools: [
      { group: "Layout", items: ["CorelDRAW", "PageMaker", "Adobe InDesign"] },
      { group: "Images", items: ["Adobe Photoshop", "Image resolution tools"] },
      { group: "Output", items: ["PDF/X export", "Crop and bleed setup", "Press specifications"] },
    ],
    projects: [
      { title: "Wedding card set", text: "A complete card set with envelope and insert, typeset in Punjabi and English and prepared for press.", tags: ["CorelDRAW", "Typesetting"] },
      { title: "Shop stationery pack", text: "Letterhead, visiting card and bill book with numbering, produced as a matched set.", tags: ["Print", "Layout"] },
      { title: "Flex banner", text: "A large-format banner at correct scale and resolution, with the maths shown for the enlargement.", tags: ["Large format"] },
    ],
    careers: [
      { role: "DTP Operator", salary: "₹1.4 – 2.6 LPA", demand: "High" },
      { role: "Print Production Assistant", salary: "₹1.6 – 2.8 LPA", demand: "Moderate" },
      { role: "Typesetting Operator", salary: "₹1.4 – 2.4 LPA", demand: "Moderate" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "11:00 AM – 12:30 PM", mode: "Classroom", seats: "Open" },
      { name: "Evening", days: "Mon – Fri", time: "6:00 PM – 7:30 PM", mode: "Classroom", seats: "Open" },
      { name: "Weekend", days: "Sat – Sun", time: "3:00 PM – 6:00 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["Is DTP different from graphic design?", "DTP is focused on typesetting and preparing files for printing; graphic design covers concept, branding and illustration too. Many students take DTP first, then the design diploma."],
      ["Do you teach Punjabi typesetting?", "Yes, including the legacy font and Unicode conversion problems that cause most reprints in local print shops."],
      ["Can this get me a job in a print shop?", "Yes — DTP operators are among the most frequently requested roles from the print shops we work with in Jalandhar."],
    ],
    reviews: [
      { initials: "RS", name: "Rajinder S.", role: "DTP Operator, Jalandhar", text: "The bleed and crop mark training saved me from the mistakes I used to make every week." },
      { initials: "MK", name: "Meena K.", role: "Print shop owner", text: "I joined to check my own staff's files. Now I do the wedding card sets myself." },
    ],
    related: ["graphic-design-course-in-jalandhar", "basic-computer-course-in-jalandhar", "ms-office-course-in-jalandhar"],
  },

  {
    slug: "digital-marketing-course-in-jalandhar",
    title: "Digital Marketing Course in Jalandhar",
    shortTitle: "Digital Marketing",
    category: "Future Skills",
    icon: "megaphone",
    tagline: "SEO, ads, social media and analytics run on a real business, not a demo account.",
    summary: [
      "A digital marketing course where you run campaigns on a real business from the second month — a local shop, a service provider or your own venture — and report actual numbers rather than screenshots from a slide.",
      "It covers the full loop: find the customer, reach them with search and social, bring them to a landing page, and measure whether the money worked.",
    ],
    seo: {
      title: "Digital Marketing Course in Jalandhar | SEO, Google Ads & Social Media",
      description:
        "Four-month digital marketing course in Jalandhar covering SEO, Google Ads, Meta Ads, content, email and analytics with live campaigns and placement support.",
      keywords: ["digital marketing course in jalandhar", "seo training jalandhar", "google ads course punjab", "social media marketing classes jalandhar"],
    },
    level: "Beginner to Advanced",
    duration: "4 months",
    weeklyHours: "8 hours per week (5 classes)",
    modes: ["Classroom — Jalandhar", "Live online", "Weekend batch"],
    languages: ["English", "Hindi", "Punjabi"],
    certification: "GIT Education Certificate in Digital Marketing",
    fee: { amount: 18000, installments: "3 instalments of ₹6,000" },
    seats: 18,
    rating: { value: 4.8, count: 112 },
    nextBatch: "1st of every month",
    highlights: [
      { icon: "megaphone", title: "Live campaigns", text: "Real ad spend on a real business, with results reviewed weekly in class." },
      { icon: "chart", title: "Measured, not guessed", text: "Analytics, conversion tracking and honest reporting on what the money returned." },
      { icon: "target", title: "Local-business focus", text: "Built for the shops, clinics, institutes and manufacturers that hire in Punjab." },
      { icon: "briefcase", title: "Campaign portfolio", text: "Documented campaigns with before-and-after numbers for interviews and clients." },
    ],
    outcomes: [
      "Plan a marketing funnel from awareness to enquiry for a specific business.",
      "Run on-page, off-page and technical SEO on a real website.",
      "Build and optimise Google Search, Display and Performance Max campaigns.",
      "Run Meta ad campaigns with correct audiences, creatives and budgets.",
      "Set up analytics and conversion tracking, and read the reports honestly.",
      "Present a campaign report with cost per lead and recommended next steps.",
    ],
    audience: [
      "Graduates targeting marketing agency and in-house roles",
      "Business owners marketing their own shop or service",
      "Sales staff moving into digital roles",
      "Freelancers offering marketing services locally",
    ],
    eligibility: ["10+2 or above", "Basic computer and internet skills", "Reasonable English reading and writing"],
    curriculum: [
      { title: "Marketing foundations", hours: "14 hours", topics: ["Customer and market research", "The digital funnel", "Positioning and offer design", "Competitor analysis", "Setting measurable goals"] },
      { title: "Website and landing pages", hours: "16 hours", topics: ["WordPress site setup", "Landing page structure that converts", "Forms, WhatsApp and call tracking", "Page speed and mobile experience", "Basic UX for small business sites"] },
      { title: "Search engine optimisation", hours: "26 hours", topics: ["Keyword research for local intent", "On-page SEO and content structure", "Technical SEO and indexing", "Google Business Profile and local SEO", "Link building and reporting"] },
      { title: "Paid advertising", hours: "26 hours", topics: ["Google Search and Display campaigns", "Performance Max and shopping basics", "Meta ad campaign structure", "Audiences, creatives and budgets", "Bid strategy and optimisation"] },
      { title: "Social and content", hours: "18 hours", topics: ["Content calendar and formats", "Reels and short-form video basics", "Copywriting for ads and posts", "Email and WhatsApp marketing", "Community and review management"] },
      { title: "Analytics and reporting", hours: "16 hours", topics: ["Google Analytics 4 setup", "Conversion tracking and events", "Search Console reports", "Building a client report", "Final live campaign review"] },
    ],
    tools: [
      { group: "Search", items: ["Google Search Console", "Google Business Profile", "Keyword tools", "Google Ads"] },
      { group: "Social", items: ["Meta Ads Manager", "Instagram", "YouTube basics", "Canva"] },
      { group: "Site & analytics", items: ["WordPress", "Google Analytics 4", "Tag Manager basics", "Looker Studio"] },
    ],
    projects: [
      { title: "Local SEO rebuild", text: "Take a real local business listing and website from unranked to visible for its main local searches, with measurements at both ends.", tags: ["SEO", "Local"] },
      { title: "Lead generation campaign", text: "Run a real Google or Meta campaign on a small budget and report the cost per enquiry.", tags: ["Ads", "Conversion"] },
      { title: "Content calendar and execution", text: "Plan and publish a month of social content for a business, and report on reach and engagement.", tags: ["Social", "Content"] },
      { title: "Client campaign report", text: "A full report with spend, leads, cost per lead and recommendations, presented to the class as to a client.", tags: ["Analytics", "Reporting"] },
    ],
    careers: [
      { role: "Digital Marketing Executive", salary: "₹2.0 – 4.2 LPA", demand: "Very high" },
      { role: "SEO Executive", salary: "₹1.8 – 3.6 LPA", demand: "High" },
      { role: "Performance Marketer", salary: "₹2.8 – 6.0 LPA", demand: "High" },
      { role: "Social Media Manager", salary: "₹2.0 – 4.2 LPA", demand: "High" },
    ],
    batches: [
      { name: "Morning", days: "Mon – Fri", time: "10:00 AM – 11:40 AM", mode: "Classroom", seats: "6 of 18 left" },
      { name: "Evening", days: "Mon – Fri", time: "6:30 PM – 8:10 PM", mode: "Classroom / Online", seats: "8 of 18 left" },
      { name: "Weekend", days: "Sat – Sun", time: "12:00 PM – 4:00 PM", mode: "Classroom", seats: "Open" },
    ],
    faqs: [
      ["Do I need to spend my own money on ads?", "A small practice budget is included in the course for your campaign, and we keep the spend deliberately low so the learning is in the optimisation, not the budget."],
      ["Will you help me get clients as a freelancer?", "The course covers proposals, pricing and reporting, and the campaign portfolio you build is what wins the first client. We also refer small local jobs to strong students."],
      ["Is SEO still worth learning with AI search?", "Yes, and the course covers how AI answers and local results change what ranks. The fundamentals — intent, content quality and technical health — matter more, not less."],
    ],
    reviews: [
      { initials: "AK", name: "Ashish K.", role: "Digital Marketing Executive, Jalandhar", text: "Running real campaigns meant I had actual numbers to talk about in interviews instead of theory." },
      { initials: "SG", name: "Sunita G.", role: "Boutique owner", text: "I took the course for my own shop. My enquiries from Instagram went from a few a month to a few a day." },
    ],
    related: ["graphic-design-course-in-jalandhar", "artificial-intelligence-course-in-jalandhar", "advance-excel-course-in-jalandhar"],
  },
];

/** Every course, with common FAQs appended once. */
export const COURSES: Course[] = courses.map((course) => ({
  ...course,
  faqs: [...course.faqs, ...COMMON_FAQS],
}));

export const COURSE_SLUGS: string[] = COURSES.map((c) => c.slug);

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/** Related courses, skipping any slug that no longer exists. */
export function getRelatedCourses(course: Course): Course[] {
  return course.related.map(getCourse).filter((c): c is Course => Boolean(c));
}

/** Courses grouped by category, in catalogue order — used by the /courses index. */
export function getCoursesByCategory(): { category: string; courses: Course[] }[] {
  const groups: { category: string; courses: Course[] }[] = [];
  for (const course of COURSES) {
    const group = groups.find((g) => g.category === course.category);
    if (group) group.courses.push(course);
    else groups.push({ category: course.category, courses: [course] });
  }
  return groups;
}

export const formatFee = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
