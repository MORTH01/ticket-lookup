# Ticket Lookup App

A modern full-stack ticket lookup web application built with **Next.js** and **SQLite**, allowing users to search for tickets using a **PRN or Ticket Code** and instantly view passenger, route, and timing details.

The app features a fixed full-screen background, a clean glass-style UI, and a lightweight server API backed by SQLite for fast local lookups.

---

## Features

- Search tickets by **PRN** or **Ticket Code**
- View passenger details, route, ETA, and journey timing
- Fixed full-screen hero background that stays constant on scroll
- Clean, responsive UI with modern styling
- SQLite-backed API using `better-sqlite3`
- One-command database seeding for local development

---

## Tech Stack

- **Next.js** (App Router)
- **React**
- **SQLite** (`better-sqlite3`)
- **Tailwind CSS**
- **Node.js**

---

## Getting Started

### 1. Install dependencies
```bash
npm install

## Seed the database
npm run seed
This creates a local SQLite database with sample ticket data

## Run the development server
npm run dev
open:
http://Localhost:3000

## Sample Search Inputs
Use these to test the app after seeding:
PRN123456
TCK-1Z9Q7M

## PRoject Structure
.
├── scripts/
│   └── seed.js          # SQLite seed script
├── src/
│   ├── app/
│   │   ├── api/ticket/  # Ticket lookup API
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── lib/
│       └── db.ts        # SQLite database connection
├── data/                # Local SQLite DB (gitignored)
├── public/              # Static assets
└── package.json

## Notes
The SQLite database file is not committed to Git.
Run npm run seed after cloning to generate the database locally.
Turbopack is disabled on Windows for stability.
 
