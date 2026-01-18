import Database from "better-sqlite3";
import fs from "fs";
import path from "path";



const dbPath = path.join(process.cwd(), "data", "tickets.db");


const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

if (!fs.existsSync(dbPath)) {
  
  
  if (isProd) {
    throw new Error(
      `Database file not found at ${dbPath}. Make sure data/tickets.db is committed and deployed.`
    );
  }
}

export const db = new Database(dbPath, {
  
  readonly: isProd
});


if (!isProd) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticketCode TEXT UNIQUE NOT NULL,
      prn TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      age INTEGER NOT NULL,
      fromCity TEXT NOT NULL,
      toCity TEXT NOT NULL,
      route TEXT NOT NULL,
      departureISO TEXT NOT NULL,
      arrivalISO TEXT NOT NULL,
      etaMinutes INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tickets_ticketCode ON tickets(ticketCode);
    CREATE INDEX IF NOT EXISTS idx_tickets_prn ON tickets(prn);
  `);
}
