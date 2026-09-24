/**
 * Events shown at /events.
 *
 * PLACEHOLDER SCHEDULE: these three sessions are examples of the kind of events the
 * institute runs on its own campus. Replace the titles, dates and times with the real
 * schedule before launch. Do not add college names or attendance figures that did not happen.
 */

export type EventItem = {
  id: string;
  title: string;
  kind: "Workshop" | "Demo class" | "Seminar";
  /** ISO date, yyyy-mm-dd. */
  date: string;
  time: string;
  summary: string;
  image: string;
  /** Course name passed to the enquiry form when someone registers. */
  enquiry: string;
};

export const EVENTS: EventItem[] = [
  {
    id: "excel-dashboards-workshop",
    title: "Hands-on Workshop: Build an Excel Sales Dashboard",
    kind: "Workshop",
    date: "2026-10-10",
    time: "11:00 AM – 1:00 PM",
    summary:
      "Bring a laptop and leave with a working dashboard: pivot tables, SUMIFS, XLOOKUP and charts on a real sales sheet. Suited to students and office staff.",
    image: "/images/categories/office.jpg",
    enquiry: "Advance Excel",
  },
  {
    id: "tally-gst-demo-class",
    title: "Free Demo Class: Tally Prime with GST",
    kind: "Demo class",
    date: "2026-10-17",
    time: "4:00 PM – 5:30 PM",
    summary:
      "See how a month of vouchers, a bank reconciliation and GST reports come together in Tally Prime, then ask the trainer about the full course.",
    image: "/images/categories/accounts.jpg",
    enquiry: "Tally Prime with GST",
  },
  {
    id: "career-counselling-open-day",
    title: "Career Counselling Open Day for 12th Pass & Graduates",
    kind: "Seminar",
    date: "2026-10-24",
    time: "10:00 AM – 2:00 PM",
    summary:
      "One-to-one sessions with counsellors to match your background and goals to a course, with a walk-through of the computer lab.",
    image: "/images/about/team.jpg",
    enquiry: "Career Counselling",
  },
];

export const formatEventDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
