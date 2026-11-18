// Every colleague story on the site in one list (HR: "combine all testimonials from the
// different pages into one"): the home stories, the Life at Bluehost stories and the
// country pages' quotes. The same list is shown on the home and Life at Bluehost pages.
import andrew from '../assets/img/people/andrew-jackson.jpg'
import jorge from '../assets/img/people/jorge-tristan.png'
import jose from '../assets/img/people/jose-castellano.jpg'
import maaz from '../assets/img/people/maaz-mansoor.png'
import rakshitha from '../assets/img/people/rakshitha-rai.png'
import brittney from '../assets/img/people/brittney-baring.jpg'
import candice from '../assets/img/people/candice-bethea.jpg'
import chelsey from '../assets/img/people/chelsey-attia.jpg'
import { countries } from './countries'

export interface Testimonial {
  quote: string
  name: string
  role: string
  photo?: string
}

const featured: Testimonial[] = [
  { quote: 'My journey here started 14 years ago. What I love most is how the company has evolved so many times. It feels like starting a new job every few years, but with the same great people by your side. Roles may change, but the sense of community stays the same.', name: 'Jorge Tristan', role: 'System Administrator · Argentina', photo: jorge },
  { quote: 'I joined Bluehost in 2016 and have seen firsthand how deeply the company lives its customer-first culture. What has kept me here is the people and the purpose. If you are looking for a place where you feel valued and proud of the difference your work makes, you will find it here.', name: 'Andrew Jackson', role: 'Director, Customer Advocacy · United States', photo: andrew },
  { quote: "I joined as a Sales Agent, and less than a year later I was part of the Bluehost marketing team. Growth here isn't just possible, it's encouraged. This is a place where your ambition is matched by opportunity.", name: 'Maaz Mansoor', role: 'Product Marketing Specialist · Canada', photo: maaz },
  { quote: 'My favorite part of my job is the people. I get to work with teams not just in India, but across the globe. Working with people from different cultural backgrounds brings fresh perspectives and little learning moments every day.', name: 'Rakshitha Rai', role: 'Content Marketing · India', photo: rakshitha },
  { quote: 'What keeps me going is knowing that every effort we make, every customer we help, and every solution we find contributes to something bigger than ourselves. We are here to grow, support each other, and make a difference.', name: 'Jose Castellano', role: 'Product Support Specialist · Philippines', photo: jose },
  { quote: "I've felt most empowered in moments when I was trusted to take an idea, run with it, and turn it into real impact. Having both ownership and the freedom to experiment is where creativity and confidence really grow.", name: 'Chelsey Attia', role: 'Senior Social Media Manager · United States', photo: chelsey },
  { quote: "Borrow someone else's belief in you. Sometimes your leaders or mentors see your potential long before you see it yourself. If you trust them, let their confidence carry you until yours catches up.", name: 'Brittney Baring', role: 'Talent Acquisition Supervisor · Philippines', photo: brittney },
  { quote: "Don't wait until you feel 100% ready. Step forward, speak up, and trust the value of your perspective. Stay curious, build strong networks, and never underestimate the impact you can make.", name: 'Candice Bethea', role: 'Senior Director, Learning and Development · United States', photo: candice },
]

const fromCountries: Testimonial[] = countries.flatMap(c => c.quotes.map(q => ({ quote: q.text, name: q.name, role: q.role.replace(' | ', ' · '), photo: q.photo })))

export const testimonials: Testimonial[] = [...featured, ...fromCountries].filter((t, i, all) => all.findIndex(x => x.name === t.name) === i)
