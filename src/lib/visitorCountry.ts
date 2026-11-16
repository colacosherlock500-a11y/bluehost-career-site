/**
 * Best guess at which of our countries the visitor is in, from the browser's time zone
 * (no permission prompt, unlike geolocation). Falls back to the United States.
 * Slugs match src/data/countries.ts.
 */
const byZone: [RegExp, string][] = [
  [/^America\/(Argentina\/|Buenos_Aires|Cordoba|Mendoza)/, 'argentina'],
  [/^America\/(Sao_Paulo|Bahia|Fortaleza|Recife|Belem|Manaus|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Araguaina|Maceio|Santarem|Noronha)/, 'brazil'],
  [/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal|Moncton|Whitehorse|Yellowknife|Iqaluit)/, 'canada'],
  [/^(America\/|US\/|Pacific\/Honolulu)/, 'united-states'],
  [/^Asia\/(Kolkata|Calcutta)/, 'india'],
  [/^Asia\/Manila/, 'philippines'],
  [/^Europe\/(London|Belfast)/, 'united-kingdom'],
  [/^Europe\/Amsterdam/, 'netherlands'],
  [/^Europe\/Rome/, 'italy'],
  [/^(Europe\/Madrid|Atlantic\/Canary|Africa\/Ceuta)/, 'spain'],
]

export function visitorCountry(fallback = 'united-states'): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
    return byZone.find(([re]) => re.test(zone))?.[1] ?? fallback
  } catch {
    return fallback
  }
}
