import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export const runtime = "nodejs";


export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = (url.searchParams.get("code") ?? "").trim();


  const code = raw.toUpperCase();

  if (!code || code.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid PRN or Ticket Code." },
      { status: 400 }
    );
  }

  const row = db
    .prepare(
      `
      SELECT ticketCode, prn, fullName, age, fromCity, toCity, route,
             departureISO, arrivalISO, etaMinutes, status
      FROM tickets
      WHERE UPPER(ticketCode) = ? OR prn = ?
      LIMIT 1
    `
    )
    .get(code, raw);

  if (!row) {
    return NextResponse.json(
      { ok: false, error: "No ticket found for that PRN / Ticket Code." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, ticket: row });
}
