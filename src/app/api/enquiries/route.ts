import type { ResultSetHeader } from "mysql2";

import { getPool } from "@/lib/db";

/**
 * POST /api/enquiries — receives every website form submission.
 *
 * With the CMS connected (CMS_API_URL set) the enquiry is filed there, where
 * staff work the lead: status, notes, follow-up dates, CSV export. Without it,
 * or if the CMS cannot be reached, it is saved to the local
 * `form_submissions` table (database/schema.sql) when one is configured, so a
 * lead is not lost to an outage.
 *
 * Body (JSON): { formType, course?, name, phone, email?, message?, pageUrl? }
 * Replies:     201 { ok: true }  |  400 { ok: false, errors }  |  500 { ok: false, message }
 *
 * Validation mirrors the client form, because the client cannot be trusted.
 */

/** Accepted form types, and the name staff see beside the enquiry in the CMS. */
const FORM_TYPES: Record<string, string> = {
  "book-demo": "Book Free Demo",
  contact: "Contact form",
  callback: "Callback request",
};

type Payload = {
  formType?: unknown;
  course?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  pageUrl?: unknown;
};

type Enquiry = {
  formType: string;
  course: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  pageUrl: string;
  userAgent: string;
  ip: string;
};

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const CMS_API_URL = process.env.CMS_API_URL?.replace(/\/$/, "");

/** Files the enquiry in the CMS. `null` means it could not be reached. */
async function sendToCms(enquiry: Enquiry): Promise<Response | null> {
  if (!CMS_API_URL) return null;
  try {
    return await fetch(`${CMS_API_URL}/api/public/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The CMS rate-limits per address; without this every visitor would
        // count as this server.
        ...(enquiry.ip ? { "X-Forwarded-For": enquiry.ip } : {}),
      },
      body: JSON.stringify({
        studentName: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        courseName: enquiry.course,
        message: enquiry.message || undefined,
        source: "website",
        formType: FORM_TYPES[enquiry.formType],
        sourceUrl: enquiry.pageUrl || undefined,
        ip: enquiry.ip || undefined,
        userAgent: enquiry.userAgent.slice(0, 255) || undefined,
      }),
      cache: "no-store",
      // Generous: a lead filed late is still filed, and giving up early would
      // tell the visitor it failed when the CMS was only slow to answer.
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    console.error("[api/enquiries] CMS unreachable:", error);
    return null;
  }
}

async function saveLocally(enquiry: Enquiry): Promise<void> {
  await getPool().execute<ResultSetHeader>(
    `INSERT INTO form_submissions (form_type, course, name, phone, email, message, page_url, user_agent, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      enquiry.formType,
      enquiry.course || null,
      enquiry.name,
      enquiry.phone,
      enquiry.email || null,
      enquiry.message || null,
      enquiry.pageUrl || null,
      enquiry.userAgent || null,
      enquiry.ip || null,
    ],
  );
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const enquiry: Enquiry = {
    formType: text(body.formType, 50),
    course: text(body.course, 150),
    name: text(body.name, 120),
    phone: text(body.phone, 15).replace(/\D/g, ""),
    email: text(body.email, 190),
    message: text(body.message, 2000),
    pageUrl: text(body.pageUrl, 500),
    userAgent: (request.headers.get("user-agent") ?? "").slice(0, 500),
    ip: (request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "").trim().slice(0, 45),
  };

  const errors: Record<string, string> = {};
  if (!(enquiry.formType in FORM_TYPES)) errors.formType = "Unknown form.";
  if (enquiry.formType === "book-demo" && !enquiry.course) errors.course = "Please choose a course.";
  if (enquiry.name.length < 2) errors.name = "Please enter your full name.";
  if (!/^\d{10}$/.test(enquiry.phone)) errors.phone = "Enter a 10-digit contact number.";
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) errors.email = "Enter a valid email address.";
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 400 });

  const cms = await sendToCms(enquiry);

  // 429 from the CMS means this number already enquired today. The lead is on
  // file, so the visitor is told it went through rather than shown an error.
  if (cms && (cms.ok || cms.status === 429)) return Response.json({ ok: true }, { status: 201 });

  if (cms) console.error("[api/enquiries] CMS rejected the enquiry:", cms.status, await cms.text().catch(() => ""));

  try {
    await saveLocally(enquiry);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[api/enquiries] could not save the enquiry:", error);
    return Response.json(
      { ok: false, message: "We could not save your enquiry right now. Please call us or try again in a minute." },
      { status: 500 },
    );
  }
}
