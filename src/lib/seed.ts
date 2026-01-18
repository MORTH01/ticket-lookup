const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "tickets.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);

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

const sample = [
  {
    ticketCode: "TCK-1Z9Q7M",
    prn: "PRN123456",
    fullName: "Riya Sharma",
    age: 26,
    fromCity: "Pune",
    toCity: "Delhi",
    route: "PNQ → DEL (Flight FLY-218)",
    departureISO: "2026-01-20T08:10:00.000Z",
    arrivalISO: "2026-01-20T10:20:00.000Z",
    etaMinutes: 45,
    status: "CONFIRMED"
  },
  {
    ticketCode: "TCK-7K2P9A",
    prn: "PRN654321",
    fullName: "Arjun Mehta",
    age: 31,
    fromCity: "Mumbai",
    toCity: "Bengaluru",
    route: "BOM → BLR (Flight FLY-512)",
    departureISO: "2026-01-22T05:35:00.000Z",
    arrivalISO: "2026-01-22T07:15:00.000Z",
    etaMinutes: 20,
    status: "BOARDING"
  }
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO tickets
  (ticketCode, prn, fullName, age, fromCity, toCity, route, departureISO, arrivalISO, etaMinutes, status)
  VALUES (@ticketCode, @prn, @fullName, @age, @fromCity, @toCity, @route, @departureISO, @arrivalISO, @etaMinutes, @status)
`);

const tx = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
tx(sample);

db.close();
console.log("✅ Seeded DB at:", dbPath);
