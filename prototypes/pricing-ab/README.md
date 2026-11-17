# Pricing page A/B prototype — AI Builder placement

Open `index.html` in a browser (no build step, no dependencies). Edit `src.html`, then run `python3 build.py` to inline the logo into `index.html`.

| URL param | Effect |
| --- | --- |
| `?v=B` / `?v=C` / `?v=D` | Force a variant (otherwise random, sticky per browser) |
| `?qa` | Open the experiment panel and outline every price/link that still needs verifying |
| `?live=1` | Let CTAs navigate (by default they flash "Would go to cart" and only log the click) |

## Hypothesis

AI Builder gets few clicks because it sits in the last tab ("AI Tools") of a hosting-spec page. A simpler page that puts **AI Builder and WordPress Hosting side by side as the only two choices** will raise AI Builder cart clicks without lowering hosting revenue per visitor.

## Page structure (all cells)

1. Hero with the AI Builder / WordPress Hosting choice and three trust lines (money-back guarantee, 24/7 support, free AI start).
2. Three plan cards per product. Each card shows price, one CTA and only the 3–4 most important features, plus "See all features".
3. One line under the cards pointing to the other product, a "Compare all features" button that opens the full comparison table, and a small link for VPS, Dedicated and Agency hosting.
4. "Same Bluehost. Different ways to build." — a short AI Builder vs WordPress decision block.
5. FAQ, and a sticky bar on scroll that always offers the other product.

No sale or promotional callouts: the page launches after the holiday sale.

## Cells

| Cell | What changes | Risk |
| --- | --- | --- |
| **A — Control** | Live page | — |
| **B — Two doors** | Two equal hero cards: "Build a website or app — no coding" (AI Builder, $20/mo for your own domain, free to start) and "Host a WordPress site" (from $3.99/mo). AI Builder plans load first. | Highest AI lift |
| **C — Switch, AI first** | A two-option switch with AI Builder first and selected | Strong AI lift; watch hosting revenue |
| **D — Switch, Hosting first + AI card** | Hosting selected first; AI Builder Lite is a fourth, dark "No-code option" card in the hosting row | Lowest risk |

## Metrics

- **Primary:** AI Builder cart-click rate per visitor (`pricing_cta_click` with `plan` = `ai_*` and `cta_type` = `cart`).
- **Guardrail:** total hosting cart-click rate and revenue per visitor (must not drop more than 3% relative).
- **Secondary:** product-switch rate, compare-table opens, and bounce from `/pricing`.

Events are pushed to `window.dataLayer`: `experiment_exposure`, `pricing_goal_select`, `pricing_cta_click` and `pricing_compare_open`. Every event carries `experiment` and `variant`; CTA clicks also carry `goal`, `plan`, `position` and `href`.

## Before launch — data to confirm (outlined in `?qa` mode)

- AI Builder Lite and Standard **cart URLs**. Placeholders `aiBuilderLite` and `aiBuilderStandard` are used; the live product page only scrolls to its prompt box.
- WordPress **intro prices after the holiday sale**. $3.99 / $6.99 / $14.99 (renewing at $9.99 / $13.99 / $21.99) were read from the live page during the sale.
- The AI Builder product page's structured data contradicts its visible copy: it mentions a 14-day and a 3-day trial, a "Pro" plan and "Get Online" plans. Clean that up separately.
