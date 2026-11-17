# Project memory

## Bluehost design work — ALWAYS use the 2027 Design System

Whenever the user asks to design, redesign, build or update any Bluehost page, section, email, ad or component:

1. **Read `design-system/bluehost-2027/README.md` first** — it holds every rule (type, color, spacing, grid, components, layouts, logo, imagery, voice, writing).
2. **Import `design-system/bluehost-2027/tokens.css`** (or `tokens.json`) and build only with its tokens and `.bh-*` classes. No off-system colors, fonts, sizes, spacing or radii.
3. **Build from the layout components** shown in `design-system/bluehost-2027/screenshots/layouts/` (Announcement bar, Header, Hero, Splits, Card grids, Testimonials, CTA callout, Forms, FAQ, Footer, Plan cards). Look at the relevant screenshot before building each section.
4. **Use the real assets**, not placeholders or outside stock:
   - Logo: `design-system/bluehost-2027/logos/bluehost-logo.svg`
   - Icons: `design-system/bluehost-2027/icons/` (style: solid, rounded, single color — the "Certain" library)
   - Feature/hero media: `images/product-illustrations/`, `images/product-gallery/`, `screenshots/product-gallery/` (glass compositions)
   - Ads and campaign style: `images/display-ads/`
5. **Write copy in the Bluehost voice** (Confident · Informed · Supportive; tagline "Built to grow. Simple to run.") following the writing rules in README §9 and the full text in `design-system/bluehost-2027/reference/`.

Key non-negotiables: Poppins only · Display = hero only, one Headline per section, Title M below · sentence case, no period/"!" on one-sentence headlines · no widows · Blue 800 `#196BDE` is the hero color · text `#041D33` on light · never white text on Gold · 1440 desktop / 110 margins / 1220 content / 26 gutter · 375 mobile / 16 margins / stacked, full-width buttons · nothing under 10px · WCAG 2.2 AA.

If the Figma source needs re-checking, the file keys are listed at the top of the README (Design System `FiivRViQYqZXUjhmZN0Ak9`, Product Gallery `Bi2K8a1kF93CvDGVsbFxvt`, Brand Book `QmWRG9MfRVb9TRckr7OUKZ`, Display Ads `o8txrFrWCkGleEYG5TpsCH`). The Design System Styleguide page outranks the Brand Book for web sizing.
