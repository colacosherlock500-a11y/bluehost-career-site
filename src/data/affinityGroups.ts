const photos = import.meta.glob<string>('../assets/img/affinity/*.jpg', { eager: true, import: 'default' })
const photo = (slug: string) => photos[`../assets/img/affinity/${slug}.jpg`]

export type AffinityCategory = 'Belonging' | 'Hobbies & Sports' | 'Learning & Growth' | 'Well-being'

export interface AffinityGroup {
  name: string
  category: AffinityCategory
  image: string
}

const group = (name: string, category: AffinityCategory, slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) => ({ name, category, image: photo(slug) })

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
