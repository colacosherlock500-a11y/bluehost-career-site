import tileArgentina from '../assets/img/countries/argentina.jpg'
import tileBrazil from '../assets/img/countries/brazil.jpg'
import tileCanada from '../assets/img/countries/canada.jpg'
import tileIndia from '../assets/img/countries/india.jpg'
import tileItaly from '../assets/img/countries/italy.jpg'
import tileNetherlands from '../assets/img/countries/netherlands.jpg'
import tilePhilippines from '../assets/img/countries/philippines.jpg'
import tileSpain from '../assets/img/countries/spain.jpg'
import tileUk from '../assets/img/countries/united-kingdom.jpg'
import tileUs from '../assets/img/countries/united-states.jpg'
import flagArgentina from '../assets/img/flags/argentina.svg'
import flagBrazil from '../assets/img/flags/brazil.svg'
import flagCanada from '../assets/img/flags/canada.svg'
import flagIndia from '../assets/img/flags/india.svg'
import flagItaly from '../assets/img/flags/italy.svg'
import flagNetherlands from '../assets/img/flags/netherlands.svg'
import flagPhilippines from '../assets/img/flags/philippines.svg'
import flagSpain from '../assets/img/flags/spain.svg'
import flagUk from '../assets/img/flags/united-kingdom.svg'
import flagUs from '../assets/img/flags/united-states.svg'
import brazilRemote from '../assets/img/offices/brazil-remote.jpg'
import buenosAires from '../assets/img/offices/buenos-aires.jpg'
import canadaRemote from '../assets/img/offices/canada-remote.jpg'
import catania from '../assets/img/offices/catania.jpg'
import cebu from '../assets/img/offices/cebu.jpg'
import florianopolis from '../assets/img/offices/florianopolis.jpg'
import hyderabad from '../assets/img/offices/hyderabad.jpg'
import italyRemote from '../assets/img/offices/italy-remote.jpg'
import jacksonville from '../assets/img/offices/jacksonville.jpg'
import mangalore from '../assets/img/offices/mangalore.jpg'
import mumbai from '../assets/img/offices/mumbai.jpg'
import provo from '../assets/img/offices/provo.jpg'
import spainRemote from '../assets/img/offices/spain-remote.jpg'
import tenerife from '../assets/img/offices/tenerife.jpg'
import ukRemote from '../assets/img/offices/uk-remote.jpg'
import wijchen from '../assets/img/offices/wijchen.jpg'
import blairPenney from '../assets/img/people/blair-penney.png'
import douglasReis from '../assets/img/people/douglas-reis.png'
import judith from '../assets/img/people/judith-terbeek-arts.png'
import mariaMarcondes from '../assets/img/people/maria-marcondes.png'
import mikielhyn from '../assets/img/people/mikielhyn-geniston.jpg'
import nikhilSharma from '../assets/img/people/nikhil-sharma.png'
import saraKlosterman from '../assets/img/people/sara-klosterman.png'
import ulises from '../assets/img/people/ulises-di-toro.png'

export interface Office {
  /** Card eyebrow, e.g. "office 1" or "remote". */
  label: string
  city: string
  image: string
  /** Remote offices link to country-wide roles instead of a city filter. */
  remote?: boolean
  /** [lat, lon] for the globe marker; omitted for remote. */
  coords?: [number, number]
}

export interface Quote {
  text: string
  name: string
  role: string
  photo: string
}

export interface Country {
  /** URL segment and the key used by the jobs service (`JobLocation.country`). */
  slug: string
  name: string
  flag: string
  /** Photo used on the country tiles and globe card. */
  tile: string
  headline: string
  description: string
  /** Team slugs (src/data/teams.ts) present in this country. */
  teams: string[]
  values: [string, string, string]
  offices: Office[]
  quotes: Quote[]
  /** Head-count shown on the globe card. CONTENT: Figma only has placeholder numbers — confirm with the People team. */
  employees?: number
  /** [lat, lon] the globe rotates to when the country is selected. */
  center: [number, number]
}

export const countries: Country[] = [
  {
    slug: 'united-states',
    name: 'United States',
    flag: flagUs,
    tile: tileUs,
    headline: 'Where our story started',
    description:
      'Bluehost began in Utah in 2003. Today our United States team spans our Jacksonville headquarters, our Provo office, and remote colleagues across the country. Customer service, sales, marketing, engineering, product, finance, HR, and leadership work side by side here to shape what Bluehost Group builds next.',
    teams: ['customer-service', 'sales', 'marketing', 'technology-and-engineering', 'fulfillment', 'product', 'finance', 'human-resources', 'executive'],
    values: ['Leadership', 'customer first', 'innovation'],
    offices: [
      { label: 'office 1', city: 'Jacksonville', image: jacksonville, coords: [30.33, -81.66] },
      { label: 'office 2', city: 'Provo', image: provo, coords: [40.23, -111.66] },
    ],
    quotes: [
      {
        text: "Stay curious and keep learning. People are often happy to teach if you're willing to ask and listen. When you take ownership of growing your skills and improving the systems around you, you become invaluable, regardless of role or title.",
        name: 'Sara Klosterman',
        role: 'Senior Manager, Professional Services | United States',
        photo: saraKlosterman,
      },
    ],
    employees: 267,
    center: [36, -95],
  },
  {
    slug: 'argentina',
    name: 'Argentina',
    flag: flagArgentina,
    tile: tileArgentina,
    headline: 'Quality engineering with a community that lasts',
    description:
      'Our team in Argentina is a close-knit group of engineers who make sure what we ship is reliable, secure, and ready for millions of customers. From Buenos Aires and remote locations, they bring deep technical expertise, a strong sense of ownership, and the kind of long-term connections that turn colleagues into community.',
    teams: ['technology-and-engineering'],
    values: ['Quality', 'ownership', 'community'],
    offices: [{ label: 'office', city: 'Buenos Aires', image: buenosAires, coords: [-34.6, -58.38] }],
    quotes: [
      {
        text: 'Being part of a company that puts people first makes you feel valued and reminds you that your work improves the customer experience. I was given the chance to take on management roles because leaders trusted me and chose to invest in my career.',
        name: 'Ulises di Toro',
        role: 'Director, Software Engineering | Argentina',
        photo: ulises,
      },
    ],
    employees: 12,
    center: [-34.6, -58.38],
  },
  {
    slug: 'brazil',
    name: 'Brazil',
    flag: flagBrazil,
    tile: tileBrazil,
    headline: 'Warm energy with a global reach',
    description:
      'Brazil is one of our largest teams and a vibrant hub for customer support, software engineering, marketing, and product. From our office in Florianópolis and homes across the country, our people support customers in Portuguese and Spanish, build products used around the world, and bring the energy of Brazil to every project. Florianópolis is also home to HostGator in Brazil, which serves customers across Latin America.',
    teams: ['customer-service', 'technology-and-engineering', 'marketing', 'product', 'sales', 'human-resources', 'finance'],
    values: ['energy', 'Collaboration', 'growth'],
    offices: [
      { label: 'office', city: 'Florianópolis', image: florianopolis, coords: [-27.6, -48.55] },
      { label: 'remote', city: 'Remote across the country', image: brazilRemote, remote: true },
    ],
    quotes: [
      {
        text: "My journey began three years ago in customer service, speaking both Portuguese and Spanish. From the beginning, I felt welcomed by an incredible team and a culture that values the growth of each person. With the company's support, I was promoted to Account Manager. Here, we grow together.",
        name: 'Douglas Reis',
        role: 'Account Executive | Brazil',
        photo: douglasReis,
      },
      {
        text: "Don't be afraid of things you don't know. If we wait to be 100% ready for new challenges, we'll probably keep waiting forever. Instead, think about how much you've already learned to make this opportunity come to you. Embracing this mindset has fueled my growth.",
        name: 'Maria Marcondes',
        role: 'Communications Specialist | Brazil',
        photo: mariaMarcondes,
      },
    ],
    center: [-15, -50],
  },
  {
    slug: 'canada',
    name: 'Canada',
    flag: flagCanada,
    tile: tileCanada,
    headline: 'A connected team from coast to coast',
    description:
      'Our colleagues in Canada work remotely across the country, contributing to engineering, SEO, marketing, sales, and customer success. They work closely with teams around the world and show how far a good idea can travel when you work as one team.',
    teams: ['marketing', 'technology-and-engineering', 'sales', 'customer-service', 'fulfillment'],
    values: ['Flexibility', 'Customer focus', 'teamwork'],
    offices: [{ label: 'remote', city: 'Remote across the country', image: canadaRemote, remote: true }],
    quotes: [
      {
        text: "Bluehost has rewarded me with new challenges, learning, relationships, and a constant reminder of the importance of customers. We get to be part of our customers' dreams and success, and that is a privilege.",
        name: 'Blair Penney',
        role: 'Sales Manager | Canada',
        photo: blairPenney,
      },
    ],
    center: [56, -100],
  },
  {
    slug: 'india',
    name: 'India',
    flag: flagIndia,
    tile: tileIndia,
    headline: 'Building the technology behind our brands',
    description:
      'Across Mumbai, Mangalore, and Hyderabad, our team in India builds and tests the technology behind our brands and creates content that helps small businesses grow. Engineers, quality specialists, content creators, and sales professionals collaborate every day with colleagues around the globe, learning from new perspectives and growing together.',
    teams: ['technology-and-engineering', 'marketing', 'sales', 'customer-service', 'finance', 'human-resources', 'product'],
    values: ['Innovation', 'Learning', 'Impact'],
    offices: [
      { label: 'office 1', city: 'Mumbai', image: mumbai, coords: [19.07, 72.87] },
      { label: 'office 2', city: 'Mangalore', image: mangalore, coords: [12.91, 74.86] },
      { label: 'office 3', city: 'Hyderabad', image: hyderabad, coords: [17.39, 78.49] },
    ],
    quotes: [
      {
        text: "What makes this journey special is a culture that celebrates wins together, trusts people with responsibility, and always has each other's back. I'm most proud of seeing how this culture helps people step up, take ownership, and succeed together as a team.",
        name: 'Nikhil Sharma',
        role: 'Associate Manager, Sales | India',
        photo: nikhilSharma,
      },
    ],
    center: [20, 78],
  },
  {
    slug: 'netherlands',
    name: 'Netherlands',
    flag: flagNetherlands,
    tile: tileNetherlands,
    headline: 'The home of Yoast',
    description:
      'In Wijchen, our Netherlands team is the home of Yoast, one of the most user-friendly SEO plugins for WordPress. Engineers, DevOps specialists, designers, marketers, and product experts work together in a culture that supports people in their growth and brings the spirit of the open web into everything they build.',
    teams: ['technology-and-engineering', 'marketing', 'product', 'facilities', 'customer-service', 'human-resources'],
    values: ['Open web', 'Craft', 'Growth'],
    offices: [{ label: 'office', city: 'Wijchen', image: wijchen, coords: [51.81, 5.73] }],
    quotes: [
      {
        text: "I've been working at Yoast for eleven years now, and I've always been able to ask for support and discuss my ambitions. I've had many opportunities to grow and challenge myself, and I still do. That's what Yoast stands for: we support people in their growth.",
        name: 'Judith Terbeek-Arts',
        role: 'Management Assistant | Netherlands',
        photo: judith,
      },
    ],
    center: [52, 5.5],
  },
  {
    slug: 'philippines',
    name: 'Philippines',
    flag: flagPhilippines,
    tile: tilePhilippines,
    headline: 'The heart of our customer care',
    description:
      'Our largest team works in Cebu, where our people help customers around the world every day. From WordPress live support and product support to fulfillment, sales, and design, this team turns questions into solutions and first-time customers into confident business owners. It is also a place where new hires are welcomed and supported from day one.',
    teams: ['customer-service', 'fulfillment', 'sales', 'human-resources', 'marketing'],
    values: ['care', 'Dedication', 'Community'],
    offices: [{ label: 'office', city: 'Cebu', image: cebu, coords: [10.32, 123.89] }],
    quotes: [
      {
        text: "It's great working with such a collaborative team. You will not feel left out or unseen. Everyone has the opportunity to voice their concerns and be heard, and the Support team loves helping each other, especially new hires.",
        name: 'Mikielhyn Geniston',
        role: 'Support Engineer | Philippines',
        photo: mikielhyn,
      },
    ],
    employees: 308,
    center: [12, 122],
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    flag: flagUk,
    tile: tileUk,
    headline: 'Helping Bluehost show up and stand out',
    description:
      'Our United Kingdom team focuses on digital marketing, SEO, public relations, social media, and product management. Working closely with colleagues in Europe, the Americas, and Asia, they help small businesses everywhere discover our brands and grow with confidence.',
    teams: ['marketing', 'product'],
    values: ['Storytelling', 'Strategy', 'Reach'],
    offices: [{ label: 'remote', city: 'Remote across the country', image: ukRemote, remote: true }],
    // CONTENT: Figma reuses a Philippines quote here as a placeholder — add a UK colleague's quote.
    quotes: [],
    center: [54, -2],
  },
  {
    slug: 'italy',
    name: 'Italy',
    flag: flagItaly,
    tile: tileItaly,
    headline: 'The home of YITH',
    description:
      'In Catania, on the island of Sicily, our Italy team is the home of YITH, one of the largest collections of WooCommerce plugins for WordPress. Engineers and product experts work together to build tools that are easy to use and help online stores sell more. From our office and from homes across Italy, they bring attention to detail and a passion for eCommerce to every plugin they ship.',
    teams: ['technology-and-engineering', 'product'],
    values: ['Craft', 'eCommerce', 'Collaboration'],
    offices: [
      { label: 'office', city: 'Catania', image: catania, coords: [37.5, 15.09] },
      { label: 'remote', city: 'Remote across the country', image: italyRemote, remote: true },
    ],
    // CONTENT: Figma reuses Brazil quotes here as placeholders — add an Italy colleague's quote.
    quotes: [],
    center: [41.9, 12.5],
  },
  {
    slug: 'spain',
    name: 'Spain',
    flag: flagSpain,
    tile: tileSpain,
    headline: 'Building together from the Canary Islands',
    description:
      'From our office in Tenerife, in the Canary Islands, and from homes across the country, our team in Spain brings together engineers, marketers, and product and support specialists. As a small team, they work closely with colleagues in Europe, the Americas, and Asia, and they see the impact of their work in the products our customers use every day.',
    teams: ['technology-and-engineering', 'marketing', 'customer-service', 'product'],
    values: ['Collaboration', 'Ownership', 'Curiosity'],
    offices: [
      { label: 'office', city: 'Tenerife', image: tenerife, coords: [28.29, -16.63] },
      { label: 'remote', city: 'Remote across the country', image: spainRemote, remote: true },
    ],
    // CONTENT: Figma reuses Brazil quotes here as placeholders — add a Spain colleague's quote.
    quotes: [],
    center: [40, -4],
  },
]

/** Benefits listed on the globe card (Figma shows one shared list). CONTENT: make per-country if needed. */
export const defaultBenefits = [
  'Accident Insurance',
  'Free Friday Lunch',
  'Free Website or Hosting Domain',
  'Health Insurance',
  'Life Insurance',
  'Vacation & Sick Leave',
  'Wellness Support',
]

export const getCountry = (slug: string | undefined) => countries.find(c => c.slug === slug)
