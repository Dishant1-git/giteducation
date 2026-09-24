/**
 * Blog posts shown at /blogs. Each post is practical, skills-first writing tied to a
 * course the institute runs. No invented student stories or placement figures.
 */

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  readMinutes: number;
  image: string;
  courseSlug: string;
  courseName: string;
  sections: BlogSection[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "excel-formulas-every-office-job-expects",
    title: "5 Excel Formulas Every Office Job in Jalandhar Expects You to Know",
    excerpt:
      "Most office interviews include a short Excel test. These five formulas cover nearly every task in that test, and in the first month of the job.",
    category: "Computer Skills",
    date: "2026-09-22",
    readMinutes: 5,
    image: "/images/categories/office.jpg",
    courseSlug: "advance-excel-course-in-jalandhar",
    courseName: "Advance Excel",
    sections: [
      {
        heading: "Why Excel still decides office interviews",
        paragraphs: [
          "Billing counters, showrooms, schools and accounts offices all keep their daily records in spreadsheets. When they hire a computer operator or back-office executive, the practical round is usually a sheet of data and three or four questions to answer with it.",
          "You do not need hundreds of functions. You need a handful you can use quickly and without looking them up.",
        ],
      },
      {
        heading: "The five that come up again and again",
        paragraphs: ["Learn these on a real sheet of sales or attendance data, not on a blank workbook."],
        list: [
          "SUMIFS: add up values that meet one or more conditions, such as total sales for one product in one month.",
          "COUNTIFS: count rows that meet conditions, such as how many students were absent more than three days.",
          "XLOOKUP (or VLOOKUP in older versions): pull a price, name or phone number from another table using a code.",
          "IF and IFS: label rows automatically, such as “Paid” or “Pending”, or grade marks into bands.",
          "TEXT and date functions: turn a date into a month name or count the days between two dates for due-date tracking.",
        ],
      },
      {
        heading: "What to practise next",
        paragraphs: [
          "Once these are easy, move on to pivot tables. A pivot table answers most “total by month” or “total by customer” questions in a few clicks, and interviewers notice when you use one.",
          "Keep a small file of the sheets you practise on. Showing a working example in an interview is more convincing than listing “Advance Excel” on your resume.",
        ],
      },
    ],
  },
  {
    slug: "tally-prime-gst-first-month-accounts-fresher",
    title: "Tally Prime with GST: What an Accounts Fresher Actually Does in Month One",
    excerpt:
      "Vouchers, ledgers, bank entries and GST returns. Here is the real daily work of a junior accounts executive, so you know what to practise before you apply.",
    category: "Accounting",
    date: "2026-09-17",
    readMinutes: 6,
    image: "/images/categories/accounts.jpg",
    courseSlug: "tally-prime-course-in-jalandhar",
    courseName: "Tally Prime with GST",
    sections: [
      {
        heading: "Day to day: entering vouchers",
        paragraphs: [
          "Most of your first weeks will be voucher entry. Every bill, payment and bank transfer becomes a voucher in Tally, and the books are only as good as those entries.",
        ],
        list: [
          "Sales and purchase vouchers, with the correct GST rate and HSN or SAC code.",
          "Payment and receipt vouchers for cash and bank transactions.",
          "Contra vouchers for cash deposits and withdrawals.",
          "Journal vouchers for adjustments your senior asks you to post.",
        ],
      },
      {
        heading: "Ledgers and bank reconciliation",
        paragraphs: [
          "You will create ledgers for new customers and suppliers under the right groups, such as Sundry Debtors and Sundry Creditors. Putting a ledger in the wrong group is one of the most common beginner mistakes, and it shows up later in the balance sheet.",
          "Bank reconciliation means matching the bank statement with your entries in Tally and finding what is missing. It is repetitive, but it is where you learn to spot errors.",
        ],
      },
      {
        heading: "GST returns",
        paragraphs: [
          "For a business that files monthly, GSTR-1 reports outward sales and GSTR-3B is the summary return where tax is paid. As a fresher you will usually prepare the data in Tally and check it before a senior files it on the GST portal.",
          "Always check the current due dates on the GST portal, because the government changes them from time to time.",
        ],
      },
      {
        heading: "How to prepare",
        paragraphs: [
          "Practise a full month for an imaginary shop: opening balances, twenty to thirty vouchers, a bank reconciliation and the GST reports at the end. Doing one complete cycle teaches more than practising each topic on its own.",
        ],
      },
    ],
  },
  {
    slug: "local-seo-google-maps-jalandhar-shop",
    title: "Local SEO Basics: How a Jalandhar Shop Can Show Up on Google Maps",
    excerpt:
      "When people search “near me”, Google shows a map with three businesses. These are the basic steps that decide who appears there, and none of them need an ad budget.",
    category: "Digital Marketing",
    date: "2026-09-10",
    readMinutes: 5,
    image: "/images/categories/digital.jpg",
    courseSlug: "digital-marketing-course-in-jalandhar",
    courseName: "Digital Marketing",
    sections: [
      {
        heading: "Start with a Google Business Profile",
        paragraphs: [
          "A free Google Business Profile is what puts a shop on Google Maps. Claim and verify it, then fill in every field: the right main category, opening hours, phone number, website and a short description in plain language.",
          "The main category matters most. A sweet shop listed only as “Store” competes with every store in the city.",
        ],
      },
      {
        heading: "Keep name, address and phone the same everywhere",
        paragraphs: [
          "Google compares your details across your profile, website, Facebook page and directories. If the phone number or address is written differently in different places, it trusts the listing less. Pick one exact format and use it everywhere.",
        ],
      },
      {
        heading: "Reviews, photos and updates",
        paragraphs: ["Active, real listings tend to do better than empty ones."],
        list: [
          "Ask happy customers for a review, and reply to every review, good or bad.",
          "Add real photos of the shop front, inside and products, and update them now and then.",
          "Post offers or news on the profile so it looks cared for.",
          "Never buy fake reviews. Google removes them and can suspend the listing.",
        ],
      },
      {
        heading: "Measure what changes",
        paragraphs: [
          "The profile shows how many people called, asked for directions or visited the website. Check these numbers each month. They tell you whether the work is bringing in customers, which is the skill employers and clients pay for.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
