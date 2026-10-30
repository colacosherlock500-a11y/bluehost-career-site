# Bluehost Career Site

Front-end for the Bluehost careers site, built from the Figma file
*Bluehost Career Site – 10-23-26*. Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
npm run lint
```

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
switch, footer, and the **Blu** chat widget (Chatbot frames).

## Project structure

```
src/
  services/jobs/      ← job data layer (Workday goes here)
    types.ts          Job, JobSearchParams, JobSearchResult, JobStats, JobsProvider
    mockProvider.ts   sample data used until Workday is connected
    workdayProvider.ts Workday/BFF implementation stub (TODOs inside)
    index.ts          picks the provider from VITE_JOBS_PROVIDER
  services/jobAlerts.ts  "Create alert" sign-up hook
  hooks/useJobs.ts    useJobSearch, useJob, useJobStats, recently viewed
  data/               static site content (teams, countries, benefits, affinity groups…)
  components/
    layout/           Header, Footer, ChatWidget, Layout
    sections/         page sections (Globe, TeamsCarousel, JoinCta, …)
    jobs/             JobCard, JobListCard, OpenRoles, Pagination
    ui/               Button, FilterSelect, Marquee, SectionHeader, FeatureCard
  pages/              one file per route
  assets/img/         images/icons exported from Figma
```

## Workday integration

Every job-related number and list on the site comes from **one interface**, `JobsProvider`
(`src/services/jobs/types.ts`):

```ts
interface JobsProvider {
  searchJobs(params: JobSearchParams): Promise<JobSearchResult> // list + facet counts
  getJob(id: string): Promise<Job | null>                      // role page
  getJobStats(): Promise<JobStats>                             // total / by country / by team
}
```

Where the data shows up:

| Data | Used by |
| --- | --- |
| `searchJobs` | Job search results + pagination, "Open roles" on team & location pages, "Related jobs" on the role page |
| `searchJobs().facets` | Counts next to Country / Team options on the job search page |
| `getJobStats().byTeam` | "44 open roles" labels on the home teams carousel, Our teams tabs, team page hero, Team filter counts |
| `getJobStats().byCountry` | Globe "Open roles" panel, Location filter counts |
| `getJob` | Role page (title, summary, location, team, posted date, description, Apply URL) |

### Steps

1. Build a small backend/proxy (recommended — Workday endpoints shouldn't be called from the
   browser: CORS, credentials, and tenant details). It should expose:
   - `GET /jobs?keyword=&country=&team=&workType=&location=&radiusMiles=&page=&pageSize=`
   - `GET /jobs/:id`
   - `GET /jobs/stats` → `{ total, byCountry: { [countrySlug]: n }, byTeam: { [teamSlug]: n } }`
2. Set environment variables (see `.env.example`):
   ```
   VITE_JOBS_PROVIDER=workday
   VITE_JOBS_API_URL=https://careers-api.example.com
   VITE_JOB_ALERTS_URL=https://careers-api.example.com/alerts   # optional
   ```
3. In `src/services/jobs/workdayProvider.ts`, adjust `WorkdayJob` to your proxy's payload and finish
   `mapJob` — especially:
   - **Team mapping** — Workday Job Family Group → team slug in `src/data/teams.ts`
     (`customer-service`, `executive`, `facilities`, `finance`, `fulfillment`, `human-resources`,
     `legal`, `marketing`, `product`, `sales`, `technology-and-engineering`).
   - **Country mapping** — Workday location/country → country slug in `src/data/countries.ts`
     (`united-states`, `argentina`, `brazil`, `canada`, `india`, `netherlands`, `philippines`,
     `united-kingdom`, `italy`, `spain`).
   - **Description** — Workday returns HTML; either split it into the `description` sections or
     render it as sanitized HTML in `src/pages/RolePage.tsx`.
   - **applyUrl** — the Workday external apply link (used by every *Apply* button).
4. Nothing else needs to change: pages read data only through `src/hooks/useJobs.ts`.

Adding a team or country is a data change only: add an entry to `src/data/teams.ts` or
`src/data/countries.ts` (and its images) and it appears in navigation, filters, tabs, and the globe.

## Content & media still needed

These are marked with `CONTENT:` / `MEDIA:` / `INTEGRATION:` comments in the code.

- **Hero video** (`VideoHero`): Figma uses a video fill that can't be exported. Pass `videoSrc`
  once the MP4 is available; until then the exported still frame is shown.
- **Brand video** (`VideoSection` on the home page): Figma only has a placeholder.
- **Employee counts per country** (`src/data/countries.ts`): Figma uses placeholder numbers; only
  US / Argentina / Philippines are filled in.
- **Quotes for UK, Italy, Spain**: Figma reuses other countries' quotes as placeholders, so these
  are left empty.
- **Benefits for Italy & Spain** (`src/data/benefits.ts`): not in Figma yet.
- **Role page CTA**: Figma has placeholder copy ("Ready to Ride?" / lorem ipsum); replaced with
  Bluehost copy.
- **Chat assistant** (`ChatWidget.getBotReply`): UI and quick actions are wired; replies are
  scripted until a backend is connected.
- **Language switch** (Header): toggles state only; connect to your i18n provider for Portuguese.
- **Footer links**: point to bluehost.com placeholders — replace with the real URLs.
