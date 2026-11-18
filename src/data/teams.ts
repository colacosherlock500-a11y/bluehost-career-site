import customerService from '../assets/img/teams/customer-service.jpg'
import executive from '../assets/img/teams/executive-2.jpg'
import facilities from '../assets/img/teams/facilities.jpg'
import finance from '../assets/img/teams/finance.jpg'
import fulfillment from '../assets/img/teams/fulfillment.jpg'
import humanResources from '../assets/img/teams/human-resources.jpg'
import legal from '../assets/img/teams/legal.jpg'
import marketing from '../assets/img/teams/marketing.jpg'
import product from '../assets/img/teams/product-2.jpg'
import sales from '../assets/img/teams/sales.jpg'
import technology from '../assets/img/teams/technology-and-engineering.jpg'

export interface Team {
  /** URL segment and the key used by the jobs service (`Job.team`). */
  slug: string
  name: string
  /** Short label used in the "Our teams" tab bar. */
  tabLabel: string
  headline: string
  /** One-liner used on carousel cards. */
  tagline: string
  description: string
  ctaLabel: string
  buildAreas: [string[], string[]]
  image: string
  /** CSS object-position for wide crops, so faces stay in frame (default: centre, 20% from the top). */
  imageFocus?: string
}

export const teams: Team[] = [
  {
    slug: 'customer-service',
    name: 'Customer Service',
    tabLabel: 'Customer Service',
    headline: 'The human voice behind trust',
    tagline: 'The human voice behind trust',
    description:
      'Every call, chat, and email is a chance to prove what we say and what we do are the same thing. Our team turns stressful moments, a lapsed domain, a site that won’t load, into problems solved, blending fast AI-powered support with the human judgment and empathy that no algorithm can replace. We are often the only Bluehost employee a customer ever talks to, so we treat every conversation like it’s building, or breaking, trust for the whole company.',
    ctaLabel: 'View support roles',
    buildAreas: [
      ['Technical Support', 'Live Chat & Phone Support', 'Customer Success'],
      ['Retention', 'Knowledge Base & Self-Service'],
    ],
    image: customerService,
  },
  {
    slug: 'executive',
    name: 'Executive',
    tabLabel: 'Executive',
    headline: 'Setting a clear direction, together',
    tagline: 'Setting a clear direction, together',
    description:
      'We give shape to Bluehost’s ambition. Bringing together trusted digital identity, reliable infrastructure, security, AI, and human expertise, we set the priorities that help our customers succeed and our business grow sustainably. Working as one team across every function, we make the decisions that keep us focused on customer outcomes, operational excellence, and sustainable, profitable growth. We lead with curiosity, accountability, and a commitment to learning alongside our teams. The next chapter of the internet hasn’t been written yet, and we are helping define what comes next.',
    ctaLabel: 'View Executive roles',
    buildAreas: [
      ['Strategic Planning', 'Cross-Functional Leadership', 'Business Development'],
      ['Governance', 'Stakeholder Relations'],
    ],
    image: executive,
  },
  {
    slug: 'facilities',
    name: 'Facilities',
    tabLabel: 'Facilities',
    headline: 'Where great work has a place to happen',
    tagline: 'Where great work has a place to happen',
    description:
      'Bluehost’s culture is built by people who show up for each other every day, and we make sure they have the space, safety, and support to do it. From welcoming workplaces to the everyday logistics, no one notices until they’re missing; our work is quiet but essential. We partner with every department, because a company that cares about small businesses starts by caring about its own people first.',
    ctaLabel: 'View facilities roles',
    buildAreas: [
      ['Workplace Operations', 'Health & Safety', 'Vendor Management'],
      ['Space Planning', 'Sustainability'],
    ],
    image: facilities,
    imageFocus: 'center 70%',
  },
  {
    slug: 'finance',
    name: 'Finance',
    tabLabel: 'Finance',
    headline: 'The discipline behind sustainable growth',
    tagline: 'The discipline behind sustainable growth',
    description:
      'We turn data into informed decisions, helping Bluehost grow profitably, invest wisely, and stay accountable to every customer and teammate who counts on us. Our say-do ratio matters here: what we forecast is what we deliver, and that reliability builds trust across the business. We partner with every team to make smart calls, so more of what we do goes back into helping small businesses succeed.',
    ctaLabel: 'View Finance roles',
    buildAreas: [
      ['FP&A', 'Accounting', 'Revenue Operations'],
      ['Financial Reporting', 'Strategic Analysis'],
    ],
    image: finance,
  },
  {
    slug: 'fulfillment',
    name: 'Fulfillment',
    tabLabel: 'Fulfillment',
    headline: 'Where a promise becomes proof',
    tagline: 'Where a promise becomes proof',
    description:
      'When customers trust us to help build and grow their online presence, our job is to turn that trust into results. From launching a website to ongoing management, optimization, and growth, our Professional Services teams provide the expertise and hands on support customers need to move their business forward. We work across the organization to make sure services are delivered reliably, customers know what to expect, and what we promise is what they experience.',
    ctaLabel: 'View Fulfillment roles',
    buildAreas: [
      ['Website Design', 'Website Management', 'AEO & SEO', 'PPC'],
      ['Business Listings', 'Service Delivery', 'Operations and Process Improvement'],
    ],
    image: fulfillment,
  },
  {
    slug: 'human-resources',
    name: 'Human Resources',
    tabLabel: 'Human Resources',
    headline: 'The foundation every team builds on',
    tagline: 'Shaping the culture, programs, and experiences that make Bluehost a great place to grow.',
    description:
      "We bring Bluehost's purpose, performance, and long-term goals to life through our people. HR is part of every moment of employee experience: how we hire, welcome, reward, develop and support the people who serve our customers, and how we grow the leaders who will take us forward. We make the complex simple and remove what slows people down, so our teams can move fast and focus on the work that matters most. We help build a culture where people take ownership, work as one team, put customers first, and are recognized for the results they deliver. Real people, real stories, and shared values are what keeps this company human.",
    ctaLabel: 'View Human Resources roles',
    buildAreas: [
      ['Talent Acquisition', 'People Operations', 'Learning & Development'],
      ['Total Rewards', 'Employee Experience'],
    ],
    image: humanResources,
  },
  {
    slug: 'legal',
    name: 'Legal',
    tabLabel: 'Legal',
    headline: 'Where trust is put in writing',
    tagline: 'Where trust is put in writing',
    description:
      "Trust is what we sell, and we help protect it. From contracts and privacy to intellectual property and compliance, our team makes sure Bluehost can move fast and still do right by every customer, partner, and teammate, in every market we serve. We're business partners first: turning complexity into clear guidance and working side by side with the business ideas to launch with confidence, not hesitation.",
    ctaLabel: 'View legal roles',
    buildAreas: [
      ['Corporate & Commercial Law', 'Privacy & Data Protection', 'Intellectual Property'],
      ['Compliance & Risk', 'Regulatory & Policy'],
    ],
    image: legal,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    tabLabel: 'Marketing',
    headline: 'The voice that gets small businesses to believe',
    tagline: 'The voice that gets small businesses to believe',
    description:
      "We tell Bluehost's story the way we would want to hear it if we were the florist debating a website, or the baker deciding who to trust with their business online. That means showing up everywhere they're already looking search, social, AI answers and reviews. If we're not there in that moment, we do not exist to them. Our job isn't just reach. It’s earning belief. Brand, social, content and SEO, performance, lifecycle, and product marketing all work as one, powered by data and constant testing, to turn curiosity into confidence. And we are rebuilding the brand for the AI era, in real time.",
    ctaLabel: 'View Marketing roles',
    buildAreas: [
      ['Brand & Creative', 'Growth Marketing', 'Content & SEO'],
      ['Marketing Analytics', 'Campaign Management'],
    ],
    image: marketing,
  },
  {
    slug: 'product',
    name: 'Product',
    tabLabel: 'Product',
    headline: 'Build tools that help small businesses achieve their outcomes & grow',
    tagline: 'Shaping product vision and roadmaps to deliver real value to millions of small businesses around the world.',
    description:
      'Somewhere right now, someone is launching their big idea online and we build what helps them do it. Our customers are small business owners who want to succeed online without becoming technologists. Our product portfolio includes AI agents, AI website and store builder, domains, hosting and security products that help them build, host and run their business, with a team that’s always in their corner. We listen to customers, follow the data and find where people get stuck. We solve, test early, and partner with Design and Engineering to make complex technology feel simple. Our work lives in real launches and real growth, and when we get it right, someone’s business gets a real chance to compete.',
    ctaLabel: 'View Product roles',
    buildAreas: [
      ['AI-Native Products', 'UX/UI Design', 'Product Management'],
      ['Research & Product Analytics', 'Product Innovation'],
    ],
    image: product,
  },
  {
    slug: 'sales',
    name: 'Sales',
    tabLabel: 'Sales',
    headline: 'Powering the people behind the websites',
    tagline: 'Powering the people behind the websites',
    description:
      "Every website tells a story, and every story begins with someone bold enough to start. Our Sales team works with entrepreneurs, small businesses, and growing brands to bring their ideas online and help them reach what's next. By taking a consultative approach, we focus on understanding our customers' goals before recommending the right solutions across our product portfolio. We believe every meaningful customer relationship starts with listening, trust is earned through every interaction, and our success is measured by the growth of our customers. Together, we're helping build a better web, one business at a time.",
    ctaLabel: 'View Sales roles',
    buildAreas: [
      ['Inside Sales', 'Partner & Channel Sales', 'Sales Enablement'],
      ['Strategic Account Management', 'Sales Operations'],
    ],
    image: sales,
  },
  {
    slug: 'technology-and-engineering',
    name: 'Technology and Engineering',
    tabLabel: 'Engineering',
    headline: 'The engine behind every business built online',
    tagline: 'The engine behind every business built online',
    description:
      'We build the platform where business builders go from idea to online: prompt-first building tools, hosting that stays simple and predictable as you grow, and AI agents that help businesses get found and thrive. Our team moves with velocity, shipping in days what used to take weeks, because curiosity and the courage to adapt matter as much as technical depth. Every system we build has to earn the trust customers place in it, every day.',
    ctaLabel: 'View Technology and Engineering roles',
    buildAreas: [
      ['Software Engineering', 'Infrastructure & Cloud', 'AI & Automation'],
      ['QA & DevOps', 'Security'],
    ],
    image: technology,
  },
]

export const getTeam = (slug: string | undefined) => teams.find(t => t.slug === slug)
