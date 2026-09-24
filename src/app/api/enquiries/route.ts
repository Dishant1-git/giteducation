import type { ResultSetHeader } from "mysql2";

import { getPool } from "@/lib/db";

/**
 * POST /api/enquiries — stores any website form submission in the single
 * `form_submissions` table (schema: database/schema.sql).
 *
 * Body (JSON): { formType, course?, name, phone, email?, message?, pageUrl? }
 * Replies:     201 { ok: true, id }  |  400 { ok: false, errors }  |  500 { ok: false, message }
 *
 * Validation mirrors the client form, because the client cannot be trusted.
 */

const FORM_TYPES = new Set(["book-demo", "contact", "callback"]);

type Payload = {
  formType?: unknown;
  course?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  pageUrl?: unknown;
};

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const formType = text(body.formType, 50);
  const course = text(body.course, 150);
  const name = text(body.name, 120);
  const phone = text(body.phone, 15).replace(/\D/g, "");
  const email = text(body.email, 190);
  const message = text(body.message, 2000);
  const pageUrl = text(body.pageUrl, 500);

  const errors: Record<string, string> = {};
  if (!FORM_TYPES.has(formType)) errors.formType = "Unknown form.";
  if (formType === "book-demo" && !course) errors.course = "Please choose a course.";
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!/^\d{10}$/.test(phone)) errors.phone = "Enter a 10-digit contact number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 400 });

  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 500);
  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "").trim().slice(0, 45);

  try {
    const [result] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO form_submissions (form_type, course, name, phone, email, message, page_url, user_agent, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [formType, course || null, name, phone, email || null, message || null, pageUrl || null, userAgent || null, ip || null],
    );
    return Response.json({ ok: true, id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("[api/enquiries] insert failed:", error);
    return Response.json(
      { ok: false, message: "We could not save your enquiry right now. Please call us or try again in a minute." },
      { status: 500 },
    );
  }
}
