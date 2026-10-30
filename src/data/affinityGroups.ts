const photos = import.meta.glob<string>('../assets/img/affinity/*.jpg', { eager: true, import: 'default' })
const photo = (slug: string) => photos[`../assets/img/affinity/${slug}.jpg`]

export type AffinityCategory = 'Belonging' | 'Hobbies & Sports' | 'Learning & Growth' | 'Well-being'

export interface AffinityGroup {
  name: string
  category: AffinityCategory
  image: string
  /** Shown on hover. CONTENT: only "Able" is written in Figma; the rest are drafts to confirm with the group leads. */
  description?: string
}

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const group = (name: string, category: AffinityCategory, slug = slugify(name)) => ({ name, category, image: photo(slug), description: descriptions[name] })

const descriptions: Record<string, string> = {
  Able: 'An inclusive space for people with and without disabilities to connect, learn, and ask questions openly.',
  Black: 'A community that celebrates Black culture, uplifts Black voices, and supports career growth across our brands.',
  'Hispanic/Latinos': 'Celebrating Hispanic and Latino heritage, languages, and traditions, and building connections across our offices.',
  Jewish: 'A welcoming space to share Jewish culture, holidays, and traditions, and to learn from one another.',
  Neurodiverse: 'Connecting neurodivergent colleagues and allies to share experiences and help make work better for every kind of mind.',
  Parents: 'Support, advice, and community for parents and caregivers balancing family life and work.',
  Pets: 'For everyone who loves their animals: share photos, swap tips, and celebrate the pets who keep us company.',
  Veterans: 'Connecting veterans, service members, and military families, and helping them thrive in their careers.',
  'Women in Newfold': 'Championing gender equity through mentorship, events, and visibility programs across all offices.',
  'All Things NFL': 'Game days, fantasy leagues, and friendly rivalries for football fans across the company.',
  Artist: 'A creative community to share art, music, and craft projects, and to inspire each other.',
  Basketball: 'Pickup games, playoff watch parties, and plenty of basketball talk.',
  'Earth Allies': 'Taking action on sustainability, from green habits at work to volunteering for the planet.',
  Foodies: 'Recipes, restaurant tips, and cooking challenges for people who love good food.',
  Gamers: 'Online sessions, tournaments, and game recommendations for players of every platform.',
  Globetrotters: 'Travel stories, destination tips, and inspiration for your next trip.',
  Golfers: 'Tee times, tips, and friendly competition for golfers of every skill level.',
  Greenthumbs: 'Gardening tips, plant swaps, and help keeping your green friends alive.',
  Read2Lead: 'A book club for growth-minded readers who discuss leadership, business, and personal development.',
  AllThingsMechanical: 'For people who love to build, fix, and tinker, from cars to keyboards.',
  Coders: 'A place to share code, learn new languages and tools, and build side projects together.',
  'Leadership Compass': 'Helping current and future leaders build skills through workshops, mentoring, and open discussion.',
  Speakers: 'Practice public speaking in a supportive space and build confidence presenting to any audience.',
  Writers: 'Share your writing, get friendly feedback, and grow your craft with fellow writers.',
  Breathe: 'Mindfulness, meditation, and simple practices to reduce stress and stay grounded.',
  FIT: 'Workouts, step challenges, and accountability to help each other stay active.',
  Strides: 'Runners and walkers of every pace sharing goals, routes, and race days.',
  Thrive: 'Resources and conversations that support mental health and overall well-being.',
}

export const affinityCategories = [
  { title: 'Belonging', count: 11, body: 'Communities that celebrate identity, champion inclusion, and make sure every voice is heard.' },
  { title: 'Hobbies and sports', count: 12, body: 'Groups that turn shared passions into friendships across teams and countries.' },
  { title: 'Learning and growth', count: 6, body: 'Spaces to build new skills, share knowledge, and grow as professionals and leaders.' },
  { title: 'Wellbeing', count: 4, body: 'Communities that support your physical and mental health, at work and beyond.' },
]

/** The 33 employee-led affinity groups (Figma "Affinity" rows). */
export const affinityGroups: AffinityGroup[] = [
  group('Able', 'Belonging'),
  group('Black', 'Belonging'),
  group('Hispanic/Latinos', 'Belonging', 'hispanic-latinos'),
  group('Influencers', 'Belonging'),
  group('Jewish', 'Belonging'),
  group('Neurodiverse', 'Belonging'),
  group('Parents', 'Belonging'),
  group('Pets', 'Belonging'),
  group('PRISM', 'Belonging'),
  group('Veterans', 'Belonging'),
  group('Women in Newfold', 'Belonging'),
  group('All Things NFL', 'Hobbies & Sports'),
  group('Artist', 'Hobbies & Sports'),
  group('Basketball', 'Hobbies & Sports'),
  group('Earth Allies', 'Hobbies & Sports'),
  group('Foodies', 'Hobbies & Sports'),
  group('Gamers', 'Hobbies & Sports'),
  group('Globetrotters', 'Hobbies & Sports'),
  group('Golfers', 'Hobbies & Sports'),
  group('Greenthumbs', 'Hobbies & Sports'),
  group('James', 'Hobbies & Sports'),
  group('PowerServe', 'Hobbies & Sports'),
  group('Read2Lead', 'Hobbies & Sports'),
  group('AllThingsMechanical', 'Learning & Growth', 'allthingsmechanical'),
  group('Coders', 'Learning & Growth'),
  group('Leadership Compass', 'Learning & Growth'),
  group('Mixed', 'Learning & Growth'),
  group('Speakers', 'Learning & Growth'),
  group('Writers', 'Learning & Growth'),
  group('Breathe', 'Well-being'),
  group('FIT', 'Well-being'),
  group('Strides', 'Well-being'),
  group('Thrive', 'Well-being'),
]
