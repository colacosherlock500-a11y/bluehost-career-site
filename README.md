# Bluehost Career Site

Front-end for the Bluehost careers site, built from the Figma file
*Bluehost Career Site – 10-23-26*. Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router.

```bash
npm install
cp .env.example .env   # then fill in the Workday section
npm run dev:api   # careers API on :8787 — pulls jobs from Workday
npm run dev       # site on http://localhost:5173 (proxies /api to the API)
npm run build     # type-check + production build into dist/
npm start         # production: API + built site from one Node process
npm run lint
```

Requires Node.js 22.18+ (the API server runs TypeScript natively). Without Workday settings, set
`VITE_JOBS_PROVIDER=mock` to browse the site with sample jobs.

## Pages

| Route | Page | Figma frame |
| --- | --- | --- |
| `/` | Home | Home page – OPT 1 |
| `/life-at-bluehost` | Life at Bluehost | Life at Bluehost |
| `/our-teams` (`?team=sales`) | Our teams (tabbed) | Our teams |
| `/our-teams/:slug` | Team detail (11 teams) | Each team pages |
| `/around-the-world` (`?country=brazil`) | Around the world (globe + country tabs) | Around the world |
| `/locations/:slug` | Location / country page (10 countries) | Location page |
| `/jobs` | Job search (filters, pagination, alerts, recently viewed) | Jobs search |
| `/jobs/:id` | Role page | Role page |

Global pieces: header with *Life at Bluehost / Our team / Around the World* mega-menus and language
switch, and the **Blu** chat widget (Chatbot frames). The footer is intentionally not part of this
build — the host site provides it.

## Project structure

```
server/               ← careers API (Node) — the only place Workday credentials live
  index.ts            HTTP routes (/api/jobs, /api/jobs/stats, /api/jobs/:id, /api/health) + static site
  config.ts           env vars → config (see .env.example)
  store.ts            in-memory job cache, re-synced from Workday every N minutes
  workday/
    rest.ts           Workday Recruiting REST API (OAuth 2.0 refresh token)
    raas.ts           Workday custom report / RaaS (ISU username + password)
    cxs.ts            public Workday career-site feed (no credentials)
    normalize.ts      Workday posting → site Job (team, country, brand, work type…)
    mapping.ts        ← EDIT: job family → team, location → country, company → brand
    sanitize.ts       allow-list HTML sanitizer for job descriptions
src/
  services/jobs/      job data layer used by the UI
    types.ts          Job, JobSearchParams, JobSearchResult, JobStats, JobsProvider
    search.ts         search / facets / stats (shared by the server and the mock)
    workdayProvider.ts calls the careers API (/api)
    mockProvider.ts   sample data
    index.ts          picks the provider from VITE_JOBS_PROVIDER
  services/jobAlerts.ts  "Create alert" sign-up hook
  hooks/useJobs.ts    useJobSearch, useJob, useJobStats, recently viewed
  data/               static site content (teams, countries, benefits, affinity groups…)
  components/
    layout/           Header, ChatWidget, Layout
    sections/         page sections (Globe, TeamsCarousel, JoinCta, …)
    jobs/             JobCard, JobListCard, OpenRoles, Pagination
    ui/               Button, FilterSelect, Marquee, SectionHeader, FeatureCard
  pages/              one file per route
  assets/img/         images/icons exported from Figma
```

## Workday integration

```
Workday tenant ──(every 15 min)──▶ careers API (server/) ──/api/*──▶ browser
                 OAuth / ISU          cache + mapping          no credentials
```

The API server pulls **all open job postings** from Workday on start-up and then every
`WORKDAY_SYNC_INTERVAL_MINUTES` (default 15), maps them onto the site's `Job` type, and serves the
site from that cache — so counts, lists and country/team numbers update automatically as recruiters
post or close jobs in Workday, visitors never wait on Workday, and a failed sync keeps serving the
last good data. Full job descriptions are fetched on first view when the list call doesn't include
them. `POST /api/jobs/refresh` (with `Authorization: Bearer $JOBS_REFRESH_SECRET`) forces a sync.

### Connection methods

Set `WORKDAY_SOURCE` to one of:

| `WORKDAY_SOURCE` | Workday API | Credentials | Notes |
| --- | --- | --- | --- |
| `rest` (recommended) | Recruiting REST API — `GET /ccx/api/recruiting/v4/{tenant}/jobPostings` | OAuth 2.0: client ID, client secret, refresh token | Official API; access tokens are renewed automatically |
| `raas` | Custom report as a web service — `/ccx/service/customreport2/…?format=json` | Integration System User username + password | Report columns are listed in `server/workday/raas.ts` |
| `cxs` | Public career site JSON (`*.myworkdayjobs.com/wday/cxs/…`) | none | Only what is already public on the external career site; good for going live early |

All variables are documented in `.env.example`. Credentials are read only by the server; never
put them in `VITE_*` variables (those are bundled into the public JavaScript).

### Endpoints the site uses

| Endpoint | Used by |
| --- | --- |
| `GET /api/jobs?keyword=&country=&team=&workType=&location=&page=&pageSize=` | Job search + pagination + filter counts, "Open roles" on team & location pages, "Related jobs" |
| `GET /api/jobs/stats` → `{ total, byCountry, byTeam }` | "44 open roles" labels (teams carousel, Our teams, team pages), globe "Open roles" panel |
| `GET /api/jobs/:id` | Role page (title, location, team, posted date, description HTML, Apply URL) |
| `GET /api/health` | Monitoring: last sync time, errors, job count, and **unmapped** Workday values |

### Mapping Workday values

`server/workday/mapping.ts` decides how Workday data lands on the site:

- **Team** — Job Family (Group) → one of the 11 team slugs (exact overrides first, then keyword rules
  on the family and the job title).
- **Country** — location / country → one of the 10 country slugs (country names, ISO codes,
  "City, ST" US states / Canadian provinces, and known office cities).
- **Brand** — company / hiring organization → Bluehost, HostGator, Yoast or YITH.

After the first sync, open `/api/health`: `unmapped.families` and `unmapped.locations` list anything
that fell back to a default, so the tables can be tuned with real data.

### Deployment

Run `npm run build && npm start` on any Node 22.18+ host (container, VM, PaaS) with the env vars
set; it serves both the site and `/api`. To host the static site elsewhere (CDN), deploy `dist/` there,
run the API separately, and build with `VITE_JOBS_API_URL=https://<api-host>/api`.

Adding a team or country is a data change only: add an entry to `src/data/teams.ts` or
`src/data/countries.ts` (and its images) and it appears in navigation, filters, tabs, and the globe.

## Content & media still needed

These are marked with `CONTENT:` / `MEDIA:` / `INTEGRATION:` comments in the code.

- **Brand video** (`VideoSection` on the home page): Figma only has a placeholder.
- **Employee counts per country** (`src/data/countries.ts`): Figma uses placeholder numbers; only
  US / Argentina / Philippines are filled in.
- **Affinity group descriptions** (`src/data/affinityGroups.ts`): Figma only has text for *Able*;
  the others are drafts to confirm, and Influencers, PRISM, Mixed, James and PowerServe have none yet
  (their cards show no description on hover).
- **Quotes for UK, Italy, Spain**: Figma reuses other countries' quotes as placeholders, so these
  are left empty.
- **Benefits for Italy & Spain** (`src/data/benefits.ts`): not in Figma yet.
- **Role page CTA**: Figma has placeholder copy ("Ready to Ride?" / lorem ipsum); replaced with
  Bluehost copy.
- **Chat assistant** (`ChatWidget.getBotReply`): UI and quick actions are wired; replies are
  scripted until a backend is connected.
- **Language switch** (Header): toggles state only; connect to your i18n provider for Portuguese.

## Embeds

`embeds/ai-website-builder/index.html` is a self-contained AI Website Builder landing-page embed for
the AEM host page, styled with the same design tokens as this site (see `src/index.css`). It keeps the
AEM Ai Builder clientlib hooks (`.cmp-aibuilder*`), analytics `data-element-*` attributes and BFF pricing
attributes; everything is scoped to `#bh-aib-embed`.
