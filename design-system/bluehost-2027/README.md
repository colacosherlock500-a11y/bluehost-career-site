# Bluehost 2027 Design System — reference kit

Everything needed to design or rebuild a Bluehost page without opening Figma. Scanned on 2026-11-17 from four Figma files:

| Source | Figma file key | What it gave us |
|---|---|---|
| [2027 Bluehost Design System](https://www.figma.com/design/FiivRViQYqZXUjhmZN0Ak9/2027-Bluehost-Design-System) | `FiivRViQYqZXUjhmZN0Ak9` | Tokens, type, spacing, grid, color, components, 21 layout components, icons, logo lockups, image library |
| [Bluehost Product Gallery](https://www.figma.com/design/Bi2K8a1kF93CvDGVsbFxvt/Bluehost-Product-Gallery) | `Bi2K8a1kF93CvDGVsbFxvt` | Real product UI screenshots (Hermes agent hosting, Bluehost MCP, AI Builder) and glass marketing compositions |
| [2027 Brand Book](https://www.figma.com/design/QmWRG9MfRVb9TRckr7OUKZ/2027-Brand-Book) | `QmWRG9MfRVb9TRckr7OUKZ` | Mission, positioning, messaging pillars, tone of voice, writing rules, logo and photography rules |
| [Display Ads](https://www.figma.com/design/o8txrFrWCkGleEYG5TpsCH/Display-Ads) | `o8txrFrWCkGleEYG5TpsCH` | Finished social/display ads in every size, plus option boards |

**Which source wins:** for web pages, the **Design System Styleguide** is the authority (golden-ratio type scale, 110px margins). The Brand Book has an older type scale (50/48/32pt) and 100px padding; use it for brand, voice, logo and photography rules, not for web sizing.

---

## Folder map

```
design-system/bluehost-2027/
├── README.md                ← this guide (rules + how to build)
├── tokens.css               ← all CSS variables + .bh-* base classes. Import this first.
├── tokens.json              ← same tokens as JSON (for JS/Tailwind/etc.)
├── logos/bluehost-logo.svg  ← official horizontal logo (9-grid + wordmark), 159×28
├── icons/                   ← UI icons pulled from the header (arrow-right, dropdown, globe, cart, sparkle)
├── images/
│   ├── product-illustrations/  ← 5 hero illustrations @2x on mesh gradients (WP hosting, VPS, Email, Security, Disk usage)
│   ├── product-gallery/        ← real product UI captures: hermes/, bluehost-mcp/, ai-builder/
│   ├── display-ads/            ← 26 finished ads (1080², 1080×1350, 1200², 1200×628, 1280×720)
│   ├── ui-elements/            ← UI-chip sheets: URL bar, cursor, globe badge, dashboard, example sites
│   └── photos/                 ← raw photos/textures used inside illustrations
├── screenshots/
│   ├── design-system/   ← 00 overview → 08 homepage rules applied, 09 mesh gradients, 10 mobile homepage
│   ├── layouts/         ← 01–22: every layout component (desktop) — the page building blocks
│   ├── brand-book/      ← cover, brand frame, pillars, voice, writing, logo, color, type, photo, graphics, website
│   ├── product-gallery/ ← section overviews + compositions (glass screens, with/without Bluehost bg)
│   └── display-ads/     ← option boards (simplified, merged, Anhelina's)
└── reference/           ← full text pulled from the Brand Book chapters (messaging, voice, photography…)
```

---

## 1. Typography — Poppins only

Every text layer uses a Desktop/ or Mobile/ style. Line heights follow the golden ratio (body × 1.618; display/heads × ~1.272).

| Style | Desktop | Mobile | Use |
|---|---|---|---|
| Display | SemiBold 53/67 | SemiBold 33/42 | **Hero headline only** |
| Headline | SemiBold 42/53 | SemiBold 26/33 | First headline in every section (exactly one) |
| Title L | SemiBold 33/42 | SemiBold 20/26 | Not used in layouts |
| Title M | SemiBold 26/33 | SemiBold 16/20 | Sub-headlines, columns, card titles |
| Title S | SemiBold 20/26 | — | Not used in layouts |
| Eyebrow | SemiBold 16/26, CAPS | Medium 13/21 | Labels above headlines, FAQ questions |
| Body Regular | Regular 16/26 | same | Body copy |
| Body Medium | Medium 16/26 | same | UI labels, emphasis |
| Body SemiBold | SemiBold 16/26 | same | Links and CTAs in copy |
| Button | Medium 14, Title Case | same | Buttons |

**Rules**
- **Hierarchy:** Display = hero only. Each section starts with one Headline; everything after it is Title M.
- **No widows:** never end a headline or paragraph with one word on the last line — join the last two words with `&nbsp;`.
- **Headline punctuation:** one-sentence headlines have **no** closing period or exclamation mark. Two-plus sentences keep punctuation.
- **Casing:** sentence case everywhere. Title Case only for buttons/CTAs, product names and proper nouns. Eyebrows are caps (by style).
- **Minimum size:** nothing under 10px.
- Headline text color `#041D33`; body copy `#0C4A9C` (text/body) or muted `#7A889D`.

## 2. Color

Bluehost Blue 800 is the hero color in every layout. Secondary colors support. Every fill is a token.

**Primary:** Blue dark 1000 `#012957` · **Blue 800 `#196BDE`** · Blue Light 400 `#84C1FC` · White
**Secondary:** Night Sky Blue `#465D77` · Green Dark 700 `#19A27E` · Gold `#F4C652` · Aqua `#29C9E0`
Full 12-step ramps for Blue, Night Sky, Aqua, Green, Gold are in `tokens.css`.

| Role | Value |
|---|---|
| text/primary (on white/light) | `#041D33` |
| text/body | `#0C4A9C` |
| text/link · primary links | `#196BDE` |
| secondary links | `#0C4A9C` |
| text/muted | `#7A889D` |
| surface/alt (hero bg) | `#F0FAFF` |
| alternating section bg | `#F4F8FC` |
| surface/placeholder (icon tiles) | `#DBF1FC` |
| surface/inverse · announcement bar | `#041D33` |
| testimonials band | `#012957` |
| CTA callout / sale bar | `#196BDE` |
| border/subtle | `#DCE1EA` |

**Rules**
- Primary button: Blue 800 + white text. Secondary: white + blue text. Orange: Gold Light 500 + `#0D0349` text. Links Blue 800; secondary links Blue dark 900.
- **Never white text on Gold** (contrast fails) — use `#041D33`. Gold can replace a blue background to balance a blue-heavy page.
- Cards on white sections use **Shadow/Card glow**: 2px inside border `#BADEFA`, white fill, 16 radius, drop shadows `#6AF6FB 10% y+8 blur80` + `#AB9DFB 10% y−8 blur80`.
- WCAG 2.2 AA minimum for every pairing.
- Gradients (14 named) and 30 mesh gradients exist; mesh gradients use only palette colors, Gold max one small corner swatch. See `screenshots/design-system/09-mesh-gradients.png`. Brand Book: gradients only for large blocks/tiles.

## 3. Spacing, radius, grid

Spacing scale: `4 · 6 · 10 · 16 · 26 · 42 · 68 · 110 · 178` (3xs → 3xl).

| Layout token | Desktop | Mobile |
|---|---|---|
| page-margin | 110 | 16 |
| section-y | 110 | 68 |
| hero-top | 110 | 42 |
| callout-y | 68 | 42 |
| heading-to-content | 42 | 26 |
| column-gap | 68 | 26 |
| heading-group-gap | 16 | 16 |
| content-stack / card-padding / grid-gutter | 26 | 26 (gutter 16 on mobile grid) |
| panel-padding | 42 | 26 |
| card-gap | 10 | 10 |
| button-x × button-y | 26 × 16 | 26 × 16 |

Radius: control 10 · button 10 · card 16 · panel 26 · pill 999.

**Grid:** Desktop 1440 frame, 12 cols, 110 margin, 26 gutter, **1220 content**. Mobile 375, stacked single column, 16 margin, 343 content. Header exception: 1475 frame / 1255 content.
- **Text-wider split:** two-column = **658 + 68 + 494** (text gets ~⅓ more width). Mobile stacks text, then image. (Layout components page also lists a golden 440 + 68 + 712 split.)
- **Golden media:** images 1.618:1 → 494×305 desktop, 343×212 mobile, aspect locked.
- Card columns: 3-up 389px wide; cards in a row share a min height so CTAs line up.
- On mobile every item is centred.

## 4. Components

- **Button** — 52px tall, 16×26 padding, 6px label→icon gap (chevron `>`), 10 radius, Poppins Medium 14 Title Case. Mobile buttons fill the width. Variants: Type (Primary/Secondary/Orange/Link) × Style (Solid/Transparent/Transparent Blue Text) × Breakpoint × Icon.
  | Variant | Fill | Label | Use |
  |---|---|---|---|
  | Primary · Solid | Blue 800 | White | Main action on light sections |
  | Primary · Transparent | `#E6F2FE` 25% + border | White | On dark, image or gradient backgrounds |
  | Primary · Transparent Blue Text | `#E6F2FE` 25% + border | Blue | Secondary action on tinted backgrounds |
  | Secondary · Solid | White | Blue | Action on blue/dark panels (CTA bands) |
  | Orange · Solid | Gold Light 500 + shadow | `#0D0349` | Promotional emphasis, sparingly |
  | Link | — | Blue SemiBold, `→` | Inline links, phone numbers |
- **Card / Feature** — 16 radius, 26 padding, 10 gap, 48px icon tile (`#DBF1FC`, 10 radius) on top, Title M title, Body Regular text, link CTA pinned to bottom.
- **Plan cards** — Standard / Most popular (taller, 610 vs 570) / Enterprise; min height 570; Feature list of check items (Included / Not included × Default/Link/Bold × Light/Dark); Term tabs (Monthly / 1 Year / 3 Years); Pricing table row 1220×48. See `screenshots/layouts/22-plan-cards.png`.
- **Icons** — one library ("Certain"), ~5,000 icons in 22 categories. Only use that library style (solid, rounded, single-color). 24px inside icon tiles (10 radius, 10 padding); 12–18px inline next to labels (6px gap). Icons take the text/color role color. Header icons saved in `icons/`.

## 5. Layout components (page building blocks)

Each exists at Desktop (1440) and Mobile (375). Screenshots in `screenshots/layouts/`.

| # | Layout | Notes from the homepage spec |
|---|---|---|
| 01 | Announcement bar | bg `#041D33`, Body Medium, 10 padding (72 tall) |
| 02 | Sale banner | bg `#196BDE`, Body Medium, 10 padding |
| 03 | Header | 1475 wide; black top utility bar (promo text, Contact Sales pill, Help, Login, USD, cart) + white nav (logo, For Business ▾, For Developers ▾, Hosting ▾, ✦ AI Suite **New**, Managed & Enterprise ▾, Partnerships ▾, Pricing, **Get Started →**) |
| 04 | Hero | bg `#F0FAFF`; centred Display, subline, Primary + Transparent-blue buttons + phone link, 4 feature cards, stats row (WordPress.org · 99.99% · 5M+ · 24/7 · 4.5/5 Trustpilot) |
| 05 | Hero — gradient card + media | |
| 06/07/08 | Split — media right / left / right (alt) | Eyebrow + Headline + Title M + body + Button; 658+68+494; alternate white and `#F4F8FC` |
| 09 | Accordion + media | |
| 10 | Icon features — 4 up | |
| 11 | Card grid — 3 up | Card / Feature + Shadow/Card glow |
| 12 | Card grid — product tiles | bg `#F4F8FC`, centred eyebrow + headline + sub, 3×2 cards with "Learn more →" |
| 13 | Image cards — 4 up | |
| 14 | Steps — 4 cards | |
| 15 | Testimonials | bg `#012957` |
| 16 | FAQ — cards | eyebrow style for questions |
| 17 | CTA callout | bg `#196BDE`, 68 vertical padding, Headline + body + Secondary button |
| 18 | CTA band — card | |
| 19 | Form — consultation | |
| 20 | Form — centered card | |
| 21 | Footer | 1475 wide |

Homepage section order (rules-applied page): Announcement → Sale → Header → Hero → Build with WordPress (split R) → Build anything (split L, alt bg) → Host anything (split R) → AI Agents (split L, alt bg) → 24/7 Expert Support (3-up cards) → Testimonials → Growth Tools (product tiles) → Plans callout (CTA) → Consultation (form) → FAQs → Footer. See `screenshots/design-system/08-rules-applied-homepage.png` and `10-homepage-mobile.png`.

## 6. Logo

- Horizontal logo (9-grid icon + custom logotype) is primary. Use `logos/bluehost-logo.svg`; never re-draw. (The SVG fill is `#1B4FD8`; for on-brand rendering recolor to Blue 800 on light / white on dark.)
- Clearspace = the 9-grid scaled to 50%, minimum. More is better.
- Blue logo on white/light gray; white logo on Bluehost blue, dark colors and **always over photography**; one-color black only as last resort.
- Don't: distort, add shadow, use logotype without icon, recolor the icon, outline, put blue logo on a photo, alter the type.
- Placement: web/email/product → top-left. Ads/marketing → top or bottom, left or centre, anchored to the edge with clearspace.
- **Product lockups** (e.g. AGENT HOSTING): X = icon height. Descriptor in **Lexend Medium, ALL CAPS, 0.5X, 36% tracking**, never scaled/squeezed/centred/wrapped. *Stacked:* descriptor ¼X below logo, left-aligned with icon; min descriptor 10px (icon ≥ 20px). *Horizontal:* logo | rule | descriptor, 0.6X either side of the rule, rule ≈1X tall × 0.06X wide (Night Sky Light 400 on light, white 40% on dark); min width 320px. One color only (Blue 800 or white).

## 7. Imagery

**Product illustrations** (`images/product-illustrations/`): product UI cards floating on a mesh-gradient field — the house style for feature media. **Glass compositions** (`screenshots/product-gallery/`): frosted-glass UI panels (white, rounded, soft border) over a blue→teal gradient with a small "✓ label" pill and a pointer cursor; logo top-left in white.

**Photography** — real people, real workplaces, real emotion.
- Look for: real offices/studios/storefronts/home offices, natural window light, warm-neutral WB (4800–5600K), negative space on one side for copy, subject on thirds, f/2.8–5.6, eye-level camera, calm backgrounds that sit beside our blues. People first, device second; screens visible but not readable.
- Avoid: glowing server rooms, sci-fi "data" imagery, stock-set boardrooms, competitor logos, strong red/orange/magenta casts, hard flash, posed handshakes/high-fives, everyone smiling at camera, token diversity line-ups, heavy retouching.
- Diversity across ethnicity, age, gender, body, ability, seniority — every demographic in leading roles.

## 8. Display ads (`images/display-ads/`)

Sizes: 1080×1080, 1080×1350 (4:5), 1200×1200 (Meta), 1200×628, 1280×720.
Patterns seen:
- Bluehost-blue (Blue 800) headline block with white Poppins type, second line or key phrase in *italic* (e.g. "Build websites in minutes *with AI*").
- Lifestyle photo (person in their own business) + floating glass UI card (chat agent, uptime 99.9% ring, "Launch product" chip, cursor).
- White-left / photo-right landscape: logo top-left, black headline with **blue italic** emphasis, Primary button with chevron ("Get Faster Hosting >").
- Short CTAs: Try It Now, Get A Demo, Start building, Get started.
- Example headlines: "Build a website with AI in minutes, not weeks." · "Your front desk is open. Even when you're closed." · "Book clients while you sleep" · "Never miss a customer" · "Your AI agent, hosted & ready." · "Describe it. Publish it. Done in minutes." · "Fast WordPress hosting, even in traffic spikes".

## 9. Brand & messaging (from the Brand Book — full text in `reference/`)

- **Purpose:** We believe every small business deserves the opportunity to succeed online.
- **Mission:** Give small businesses the confidence to think big.
- **Positioning:** Bluehost is the AI-powered business platform empowering small businesses, developers, and agencies worldwide to build, grow and run online with confidence.
- **Tagline:** *Built to grow. Simple to run.*
- **Pillars:** Premium performance without premium cost · AI-powered digital tools that speed growth · Simple by design · Real human expert support, anytime.
- **Proof points:** 5M+ global customers · 100+ countries · 99.99% uptime SLA · 98% CSAT · <2 min support response · 4.6/5 Trustpilot · 50M+ pages created/yr · #1 VPS benchmark (2026) · Recommended by WordPress.org since 2005.
- **Audiences:** Business builders (SMB owners, entrepreneurs) — "Build & Launch", "Run & Grow". Tech builders (developers, MSPs, agencies) — "Build, Deploy & Scale", "Manage at Scale".
- **Portfolio:** Bluehost Hosting (Managed WordPress, Managed WooCommerce, Cloud-Agency, VPS/Dedicated, Agentic Hosting) · Bluehost AI (AI brand presence: site/store/logo/domain, AI Front Desk Agent, All Access Pack AI Assistants, Bluehost Blu) · Professional Services (Full Service + SEO, Pro Web Design, Pro Digital Marketing, Pro Design Live Support).
- **Voice:** a helpful, tech-savvy mentor — **Confident · Informed · Supportive**. Clever in high-visibility pieces, pragmatic in product copy.
- **Writing:** Oxford comma yes. Eyebrows ALL CAPS, simple. Headlines sentence case, clever, no "!" or period. Subheads sentence case with proper punctuation, descriptive. CTAs short, Title Case, under 16 characters. Every page: clear narrative, drive to conversion, "deliver the message, and move aside."
- **Terms:** website, email, eCommerce, WordPress, plugin, malware, cybersecurity, backup (noun) / back up (verb), login (noun) / log in (verb), SSL certificate, top-level domain, TLDs, internet, JavaScript, cancellation. Clear product names (e.g. "Site backups", not CodeGuard; "Website security", not SiteLock).

---

## How to use this kit on a redesign

1. `@import` / link `tokens.css`; never hard-code a color, size, space or radius that isn't a token.
2. Compose the page from the layout components in §5, in the homepage order where relevant; alternate white and `#F4F8FC` sections.
3. Apply type hierarchy strictly (one Display in the hero, one Headline per section, Title M below).
4. Use the logo SVG, header icons, product illustrations, product UI captures and ads from `images/` rather than placeholders or outside stock.
5. Write copy in the Bluehost voice with the writing rules in §9.
6. Check: 10px minimum, no widows, no white on Gold, WCAG AA, mobile stacks at 375 with 16 margins and full-width buttons.
