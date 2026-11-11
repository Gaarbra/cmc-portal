# CMC Portal

A modern, mobile-friendly front end for the Claremont McKenna student portal
(`portal.claremontmckenna.edu/ics`). It puts grades, your schedule, courses,
registration and your student account a tap away instead of buried in portlets.

> Unofficial student project. Not affiliated with Claremont McKenna College.

## What's in it

| Page | What it does |
| --- | --- |
| **Home** | Today's classes (with a "Now" badge), upcoming deadlines, GPA, balance due, holds, announcements |
| **Grades** | Grades by term, midterm grades, term-GPA trend, and a **what-if GPA calculator** |
| **Schedule** | Weekly calendar grid, or a by-day list on phones |
| **Courses** | Course cards with due/new counts; each course has coursework + scores, announcements, handouts |
| **Registration** | Search the 5C catalog, filter by campus, see open seats, build a plan with **time-conflict detection** |
| **Finances** | Balance, account activity, financial aid awards |
| **Profile** | Student info, advisor, holds |

Also: dark mode, sidebar on desktop / tab bar on phones, and it's an installable
**PWA** — on iPhone open it in Safari → Share → *Add to Home Screen* and it runs
like a native app.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Sign in with any username — it currently runs in **demo mode** on sample data.

## Architecture

```
src/
  api/
    types.ts      # domain model + the PortalApi interface
    mockData.ts   # sample data
    mockApi.ts    # PortalApi implementation backed by sample data
    index.ts      # picks which PortalApi the app uses  ← swap here
  pages/          # one file per screen
  components/     # Layout (nav) and shared UI
  lib/            # auth, theme, formatting, GPA math
```

The UI only ever talks to the `PortalApi` interface, so connecting real data
means writing one new adapter — no page changes.

## Next step: real data

The real portal is Jenzabar JICS and has no public API. The plan is a small
backend that signs in on the student's behalf and turns JICS pages into the JSON
shapes in `src/api/types.ts`:

1. Backend (Node/Express or serverless) with `/login`, `/grades`, `/courses`, … endpoints.
2. It holds the JICS session cookie server-side; the browser only gets an app session.
3. Parse the relevant portlets (My Grades / unofficial transcript, Course Schedule,
   Account Info, course pages) into the typed model.
4. Add `src/api/httpApi.ts` implementing `PortalApi` with `fetch`, and export it from `src/api/index.ts`.

Things to check first: whether CMC sign-in goes through SSO/MFA (which changes
how the backend authenticates), and CMC IT's acceptable-use policy. Never store
student passwords.

After that, the same code can ship to the App Store / Play Store with Capacitor.
