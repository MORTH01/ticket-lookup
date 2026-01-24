"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Ticket = {
  ticketCode: string;
  prn: string;
  fullName: string;
  age: number;
  fromCity: string;
  toCity: string;
  route: string;
  departureISO: string;
  arrivalISO: string;
  etaMinutes: number;
  status: string;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function diffMins(aISO: string, bISO: string) {
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  return Math.max(0, Math.round((b - a) / 60000));
}

function prettyMins(m: number) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function badgeClass(status: string) {
  const s = status.toUpperCase();
  if (s === "CONFIRMED") return "bg-emerald-500/20 text-emerald-100";
  if (s === "BOARDING") return "bg-sky-500/20 text-sky-100";
  if (s === "WAITLIST") return "bg-amber-500/20 text-amber-100";
  if (s === "CANCELLED") return "bg-rose-500/20 text-rose-100";
  return "bg-white/10 text-white";
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
      {children}
    </div>
  );
}

export default function Page() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const derived = useMemo(() => {
    if (!ticket) return null;
    return {
      departure: formatDateTime(ticket.departureISO),
      arrival: formatDateTime(ticket.arrivalISO),
      durationPretty: prettyMins(ticket.etaMinutes),
      etaPretty: prettyMins(ticket.etaMinutes),
    };
  }, [ticket]);

  async function lookup() {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter your PRN or Ticket Code.");
      setTicket(null);
      return;
    }

    setLoading(true);
    setError(null);
    setTicket(null);

    try {
      const res = await fetch(`/api/ticket?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        return;
      }
      setTicket(data.ticket);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setCode("");
    setTicket(null);
    setError(null);
  }

  return (
    <main className="relative min-h-screen text-white">

      <div className="fixed inset-0 -z-20">
        <Image
          src="/hero.jpeg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" />
      </div>


      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-44 left-8 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute top-12 right-8 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-8 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>


      <header className="mx-auto max-w-6xl px-6 pt-6 md:px-10">
        <div className="flex items-center justify-between">
          <div className="font-semibold tracking-tight">FlyInn</div>
          <button className="rounded-full bg-white/15 px-4 py-2 text-sm hover:bg-white/20">
            Sign in
          </button>
        </div>

        <div className="mt-10">
          <div className="text-sm text-white/85">Ticket Lookup</div>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-5xl">
            Check your ticket details in seconds.
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Enter your PRN or Ticket Code to view route, timings, ETA, and passenger info.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6">

        <div className="rounded-2xl bg-white/95 text-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="p-5 md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm text-zinc-700">
                  PRN / Ticket Code
                </label>

                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sky-300">
                  <span className="text-zinc-400">🔎</span>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && lookup()}
                    placeholder="PRN123456 or TCK-1Z9Q7M"
                    className="w-full bg-transparent py-1 text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                  <button
                    onClick={clearAll}
                    className="text-xs text-zinc-500 hover:text-zinc-800"
                    type="button"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2 text-xs text-zinc-500">
                  Try sample:{" "}
                  <span className="font-medium text-zinc-700">PRN123456</span>{" "}
                  or <span className="font-medium text-zinc-700">TCK-1Z9Q7M</span>
                </div>
              </div>

              <button
                onClick={lookup}
                disabled={loading}
                className="rounded-xl bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-black disabled:opacity-60 md:w-44"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS */}
        <section className="mt-10 grid gap-4">
          {ticket && derived ? (
            <>
              <GlassCard>
                <div className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm text-white/70">Passenger</div>
                      <div className="text-2xl font-semibold">{ticket.fullName}</div>
                      <div className="text-white/80">Age: {ticket.age}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-sm ${badgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                        Ticket: {ticket.ticketCode}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                        PRN: {ticket.prn}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="grid gap-4 md:grid-cols-2">
                <GlassCard>
                  <div className="p-6">
                    <div className="text-sm text-white/70">Route</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {ticket.fromCity} <span className="text-white/50">→</span> {ticket.toCity}
                    </div>
                    <div className="mt-3 text-white/80">{ticket.route}</div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="p-6">
                    <div className="text-sm text-white/70">Timing</div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/10 p-3">
                        <div className="text-xs text-white/60">Departure</div>
                        <div className="text-sm font-medium">{derived.departure}</div>
                      </div>
                      <div className="rounded-xl bg-white/10 p-3">
                        <div className="text-xs text-white/60">Arrival</div>
                        <div className="text-sm font-medium">{derived.arrival}</div>
                      </div>
                      <div className="rounded-xl bg-white/10 p-3">
                        <div className="text-xs text-white/60">ETA</div>
                        <div className="text-sm font-medium">{derived.etaPretty}</div>
                      </div>
                      <div className="rounded-xl bg-white/10 p-3">
                        <div className="text-xs text-white/60">Trip Duration</div>
                        <div className="text-sm font-medium">{derived.durationPretty}</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </>
          ) : (
            <GlassCard>
              <div className="p-6">
                <div className="text-lg font-semibold">Search your ticket</div>
                <p className="mt-1 text-white/70">
                  Enter PRN / Ticket Code above to see passenger details, route, and timings.
                </p>
              </div>
            </GlassCard>
          )}

          <footer className="mt-6 text-sm text-white/50">
            Vac-Vectoor Hyperloop
          </footer>
        </section>
      </div>
    </main>
  );
}
