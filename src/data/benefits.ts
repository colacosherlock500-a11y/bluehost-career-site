import calendarHeart from '../assets/img/benefits/calendar-heart.svg'
import disability from '../assets/img/benefits/disability.svg'
import discounts from '../assets/img/benefits/discounts.svg'
import education from '../assets/img/benefits/education.svg'
import family from '../assets/img/benefits/family.svg'
import health from '../assets/img/benefits/health.svg'
import money from '../assets/img/benefits/money.svg'
import remote from '../assets/img/benefits/remote.svg'
import retirement from '../assets/img/benefits/retirement.svg'
import support from '../assets/img/benefits/support.svg'
import website from '../assets/img/benefits/website.svg'
import wellness from '../assets/img/benefits/wellness.svg'

/**
 * Benefits per country, as listed in the Figma "Benefits and wellbeing" component.
 * CONTENT: Italy and Spain have no list in Figma yet — add them here when available.
 */
export const benefitsByCountry: Record<string, string[]> = {
  'united-states': ['Disability Coverage', 'Education Reimbursement', 'Employee Support Program', 'Exclusive Discounts', 'Fertility & Family Benefit', 'Free Website or Hosting Domain', 'Health Plan', 'Life Insurance', 'Paid Time Off', 'Parental Leave', 'Remote Work', 'Retirement Savings'],
  brazil: ['Education Support Program', 'Ergonomic Allowance (Remote Positions)', 'Exclusive Discounts', 'Extended Parental Leave', 'Free Website or Hosting Domain', 'Health Plan', 'Home Office Allowance (Remote Positions)', 'Life Insurance', 'Meal Allowance', 'Pet Health Insurance', 'Snacks & Beverages (On-site Positions)', 'Telemedicine Program', 'Transportation Allowance (On-site Positions)', 'Wellness Programs'],
  canada: ['Disability Coverage', 'Education Reimbursement', 'Employee Support Program', 'Exclusive Discounts', 'Fertility & Family Benefit', 'Free Website or Hosting Domain', 'Health Plan', 'Life Insurance', 'Paid Time Off', 'Parental Leave', 'Remote Work', 'Retirement Savings'],
  argentina: ['Education Reimbursement', 'English Classes', 'Exclusive Discounts', 'Free Website or Hosting Domain', 'Health Plan', 'Internet Reimbursement', 'Paid Time Off', 'Remote Work', 'Wellness Programs'],
  netherlands: ['Exclusive Discounts', 'Free Website or Hosting Domain', 'Home Office Allowance', 'Meal Allowance', 'Paid Time Off', 'Parental Leave', 'Pension Plan', 'Remote Work', 'Transportation Allowance'],
  philippines: ['Accident Insurance', 'Free Friday Lunch', 'Free Website or Hosting Domain', 'Health Insurance', 'Life Insurance', 'Vacation and Sick Leave', 'Wellness Support'],
  india: ['Education Reimbursement', 'Employee Support Program', 'Exclusive Discounts', 'Free Website or Hosting Domain', 'Health Plan', 'Internet Reimbursement', 'Life and Accident Insurance', 'Paid Time Off', 'Parental Leave', 'Remote Work', 'Retirement Savings', 'Wellness Programs'],
  'united-kingdom': ['Annual Leave', 'Employee Support Program', 'Exclusive Discounts', 'Free Website or Hosting Domain', 'Health Plan', 'Life Insurance', 'Parental Leave', 'Remote Work', 'Retirement Savings', 'Sick Leave'],
}

/** Countries shown as tabs in the benefits section (Figma order). */
export const benefitCountries = ['united-states', 'brazil', 'canada', 'argentina', 'netherlands', 'philippines', 'india', 'united-kingdom']

export const getBenefits = (slug: string) => benefitsByCountry[slug] ?? benefitsByCountry['united-states']

const rules: [RegExp, string][] = [
  [/disability/i, disability],
  [/education|english|school/i, education],
  [/support program/i, support],
  [/discount/i, discounts],
  [/fertility|family|parental/i, family],
  [/website|internet/i, website],
  [/health|insurance|telemedicine/i, health],
  [/leave|time off|vacation/i, calendarHeart],
  [/remote|home office|ergonomic/i, remote],
  [/retirement|pension/i, retirement],
  [/wellness|wellbeing/i, wellness],
  [/allowance|meal|lunch|snack|transport/i, money],
]

/** Icon for a benefit label (falls back to the money icon). */
export const benefitIcon = (label: string) => rules.find(([re]) => re.test(label))?.[1] ?? money
