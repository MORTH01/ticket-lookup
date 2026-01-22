import { NextResponse } from "next/server";

const TICKETS = [
  {
    ticketCode: "TCK-8F3K2A",
    prn: "PRN123456",
    fullName: "Aarav Sharma",
    age: 27,
    fromCity: "Pune",
    toCity: "Mumbai",
    route: "Pune → Lonavala → Panvel → Mumbai",
    departureISO: "2026-01-20T08:15:00+05:30",
    arrivalISO: "2026-01-20T11:05:00+05:30",
    etaMinutes: 170,
    status: "CONFIRMED",
  },
  {
    ticketCode: "TCK-1Z9Q7M",
    prn: "PRN777888",
    fullName: "Fatima Khan",
    age: 31,
    fromCity: "Hyderabad",
    toCity: "Bengaluru",
    route: "Hyderabad → Kurnool → Anantapur → Bengaluru",
    departureISO: "2026-01-22T21:40:00+05:30",
    arrivalISO: "2026-01-23T06:10:00+05:30",
    etaMinutes: 510,
    status: "BOARDING",
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = (url.searchParams.get("code") ?? "").trim();

  if (!code || code.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid PRN or Ticket Code." },
      { status: 400 }
    );
  }

  const found = TICKETS.find(
    (t) => t.ticketCode.toUpperCase() === code.toUpperCase() || t.prn.toUpperCase() === code.toUpperCase()
  );

  if (!found) {
    return NextResponse.json(
      { ok: false, error: "No ticket found for that PRN / Ticket Code." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, ticket: found });
}
