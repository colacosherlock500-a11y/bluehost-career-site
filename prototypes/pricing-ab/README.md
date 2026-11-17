# Pricing page A/B prototype — AI Builder placement

Open `index.html` in a browser (no build step, no dependencies). Edit `src.html`, then run `python3 build.py` to inline the logo into `index.html`.

| URL param | Effect |
| --- | --- |
| `?v=B` / `?v=C` / `?v=D` | Force a variant (otherwise random, sticky per browser) |
| `?qa` | Open the experiment panel and outline every price/link that still needs verifying |
| `?live=1` | Let CTAs navigate (by default they flash "Would go to cart" and only log the click) |

## Hypothesis

AI Builder gets few clicks because it sits in the last tab ("AI Tools") of a hosting-spec page. If the page starts from the visitor's **goal** (mirroring the nav: *Build website/app — no code · WordPress · VPS · Dedicated · Agency · AI tools*) and gives AI Builder equal weight to WordPress, AI Builder cart clicks will rise without lowering hosting revenue per visitor.

## Cells

| Cell | What changes | Risk |
| --- | --- | --- |
| **A — Control** | Live page | — |
| **B — Two doors** | Hero shows two equal cards — "Build a website or app, no coding" (AI, from $20/mo) and "Host WordPress" (from $3.99/mo) — with VPS / Dedicated / Agency / AI tools as chips beneath. No plans shown until a choice is made. | Highest AI lift; extra click before any plan is seen |
| **C — Goal tabs, AI first** | Six nav-style goal tabs; *Website or app (no code)* is first and pre-selected, so AI Builder plans are the first thing on screen. | Could cannibalise hosting; watch revenue/visitor |
| **D — Goal tabs, WordPress first + inline AI card** | Same tabs, WordPress pre-selected; AI Builder Lite is a 4th, visually distinct "No-code option" card in the hosting plan row. | Lowest risk; most likely the safe winner |

Shared across B–D: an AI ↔ hosting cross-sell rail under every plan grid, a 2-question "Help me choose" quiz, an "AI Builder or WordPress?" side-by-side, a Buy More Save More bundle band, a sticky decision bar that always offers the other path, and trust and guarantee lines above the fold.

## Metrics

- **Primary:** AI Builder cart-click rate per visitor (`pricing_cta_click` with `plan` = `ai_*` and `cta_type` = `cart`).
- **Guardrail:** total hosting cart-click rate and revenue per visitor (must not drop more than 3% relative).
- **Secondary:** goal-selection rate, quiz start and completion, bundle (hosting + AI) orders, and bounce from `/pricing`.

Events are pushed to `window.dataLayer`: `experiment_exposure`, `pricing_goal_select`, `pricing_cta_click`, `pricing_quiz_open`, `pricing_quiz_complete`, `pricing_term_toggle` and `pricing_nav_click`. Every event carries `experiment` and `variant`; CTA clicks also carry `goal`, `plan`, `position` and `href`.

## Before launch — data to confirm (outlined in `?qa` mode)

- AI Builder Lite and Standard **cart URLs**. Placeholders `aiWebsiteBuilderLite` and `aiWebsiteBuilderStandard` are used; the live product page only scrolls to its prompt box.
- WordPress **12-month prices** (the live page text only exposes 36-month pricing; the toggle is wired up but has no prices behind it).
- VPS, Dedicated, Agency and AI Store / AI Receptionist **prices and URLs**. AI All-Access Pack is shown at $20/mo, taken from structured data that gives a $17–20 range with no billing period.
- The AI Builder product page's structured data contradicts its visible copy: it mentions a 14-day and a 3-day trial, a "Pro" plan and "Get Online" plans. Clean that up separately.
