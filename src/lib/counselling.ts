/**
 * Virtual counselling bookings: the slots on offer and the days that can be
 * booked. Shared by the booking dialog on /contact and by POST /api/enquiries,
 * so the browser and the server always agree on what is bookable.
 *
 * The slot labels are stored with the booking and offered again in the CMS
 * when staff move one (COUNSELLING_SLOT_OPTIONS in cms-admin's enquiryMeta.ts)
 * — change them in both places.
 */

export const COUNSELLING_SLOTS = ["10:00 AM – 10:30 AM", "11:30 AM – 12:00 PM", "2:00 PM – 2:30 PM", "4:00 PM – 4:30 PM", "6:00 PM – 6:30 PM"];

/** A session can be booked from tomorrow up to this many days from today. */
export const COUNSELLING_MAX_DAYS_AHEAD = 10;

/** Today's date in India, as yyyy-mm-dd, whatever timezone the code runs in. */
const todayInIndia = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** `date` (yyyy-mm-dd) moved by `days`, as yyyy-mm-dd. */
function addDays(date: string, days: number): string {
  const moved = new Date(`${date}T00:00:00Z`);
  moved.setUTCDate(moved.getUTCDate() + days);
  return moved.toISOString().slice(0, 10);
}

/** First and last bookable day, as yyyy-mm-dd — the date field's min and max. */
export function counsellingWindow(): { min: string; max: string } {
  const today = todayInIndia();
  return { min: addDays(today, 1), max: addDays(today, COUNSELLING_MAX_DAYS_AHEAD) };
}

/** The office is closed on Sundays. */
const isSunday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay() === 0;

/** Why `date` cannot be booked, or an empty string when it can. */
export function counsellingDateError(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Please choose a date.";
  const { min, max } = counsellingWindow();
  if (date < min || date > max) return `Choose a date within the next ${COUNSELLING_MAX_DAYS_AHEAD} days.`;
  if (isSunday(date)) return "We are closed on Sundays. Please choose another day.";
  return "";
}

/** "2026-10-05" → "Monday, 5 October 2026". */
export const formatCounsellingDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
