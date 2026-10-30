import argentina from '../../assets/img/nav/countries/argentina.jpg'
import brazil from '../../assets/img/nav/countries/brazil.jpg'
import canada from '../../assets/img/nav/countries/canada.jpg'
import india from '../../assets/img/nav/countries/india.jpg'
import italy from '../../assets/img/nav/countries/italy.jpg'
import netherlands from '../../assets/img/nav/countries/netherlands.jpg'
import spain from '../../assets/img/nav/countries/spain.jpg'
import unitedKingdom from '../../assets/img/nav/countries/united-kingdom.jpg'
import unitedStates from '../../assets/img/nav/countries/united-states.jpg'
import customerService from '../../assets/img/nav/teams/customer-service.webp'
import executive from '../../assets/img/nav/teams/executive.webp'
import facilities from '../../assets/img/nav/teams/facilities.webp'
import finance from '../../assets/img/nav/teams/finance.webp'
import fulfillment from '../../assets/img/nav/teams/fulfillment.webp'
import humanResources from '../../assets/img/nav/teams/human-resources.webp'
import marketing from '../../assets/img/nav/teams/marketing.webp'
import product from '../../assets/img/nav/teams/product.webp'
import sales from '../../assets/img/nav/teams/sales.webp'
import technology from '../../assets/img/nav/teams/technology-and-engineering.webp'

export interface NavCard {
  label: string
  to: string
  image: string
}

/** "Our team" mega-menu (order matches Figma). */
export const teamNav: NavCard[] = [
  { label: 'Customer Service', to: '/our-teams/customer-service', image: customerService },
  { label: 'Engineering', to: '/our-teams/technology-and-engineering', image: technology },
  { label: 'Executive', to: '/our-teams/executive', image: executive },
  { label: 'Facilities', to: '/our-teams/facilities', image: facilities },
  { label: 'Finance', to: '/our-teams/finance', image: finance },
  { label: 'Fulfillment', to: '/our-teams/fulfillment', image: fulfillment },
  { label: 'Human Resources', to: '/our-teams/human-resources', image: humanResources },
  { label: 'Marketing', to: '/our-teams/marketing', image: marketing },
  { label: 'Product', to: '/our-teams/product', image: product },
  { label: 'Sales', to: '/our-teams/sales', image: sales },
]

/** "Around the World" mega-menu (order matches Figma). */
export const countryNav: NavCard[] = [
  { label: 'United States', to: '/locations/united-states', image: unitedStates },
  { label: 'Canada', to: '/locations/canada', image: canada },
  { label: 'India', to: '/locations/india', image: india },
  { label: 'Argentina', to: '/locations/argentina', image: argentina },
  { label: 'Brazil', to: '/locations/brazil', image: brazil },
  { label: 'United Kingdom', to: '/locations/united-kingdom', image: unitedKingdom },
  { label: 'Netherlands', to: '/locations/netherlands', image: netherlands },
  { label: 'Italy', to: '/locations/italy', image: italy },
  { label: 'Spain', to: '/locations/spain', image: spain },
]

/** "Life at Bluehost" menu — anchors into the Life at Bluehost page. */
export const lifeNav = [
  { label: 'Purpose, mission & values', to: '/life-at-bluehost#values' },
  { label: 'Benefits', to: '/life-at-bluehost#benefits' },
  { label: 'Affinity groups', to: '/life-at-bluehost#affinity-groups' },
  { label: 'Learning & growth', to: '/life-at-bluehost#growth' },
  { label: 'Awards & recognition', to: '/life-at-bluehost#awards' },
]
