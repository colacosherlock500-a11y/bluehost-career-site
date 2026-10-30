import logo from '../../assets/img/common/footer-logo.svg'
import socials from '../../assets/img/common/footer-socials.svg'

const columns: { title: string; links: string[] }[] = [
  {
    title: 'Products',
    links: ['Web Hosting', 'WordPress Hosting', 'Cloud Hosting', 'Fast Hosting', 'Online Store', 'VPS Hosting', 'Dedicated Hosting', 'Google Workspace', 'Professional Email', 'eCommerce Essentials', 'eCommerce Premium', 'Domains', 'SSL Certificates', 'Website Security', 'Website Backup'],
  },
  {
    title: 'Business Solutions',
    links: ['Small Business', 'Wedding Photography', 'Booking', 'Art', 'Blog', 'Travel Blog', 'Restaurant', 'Event', 'Online Boutique', 'Fitness', 'Auto Shop', 'Non-Profit'],
  },
  { title: 'Programs', links: ['Affiliates', 'Agencies', 'Marketing Services', 'Web Design', 'Digital Marketing', 'WordPress Guide', 'Pro Design Live', 'Refer A Friend'] },
  { title: 'Support', links: ['Knowledge Base', 'Accessibility', 'Cookie Settings', 'Report Abuse'] },
  { title: 'Company', links: ['About', 'Careers', 'Contact', 'Academy', 'Blog', 'Sitemap'] },
]

// CONTENT: replace with the real bluehost.com URLs.
const href = (label: string) => (label === 'Knowledge Base' ? 'https://www.bluehost.com/help' : label === 'Careers' ? '/' : 'https://www.bluehost.com/')

const socialLinks = [
  { label: 'Facebook', url: 'https://www.facebook.com/bluehost' },
  { label: 'X', url: 'https://x.com/bluehost' },
  { label: 'YouTube', url: 'https://www.youtube.com/user/bluehost' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/bluehost-com' },
  { label: 'Pinterest', url: 'https://www.pinterest.com/bluehost' },
  { label: 'Instagram', url: 'https://www.instagram.com/bluehost' },
]

const legal = ['Do Not Sell My Personal Information', 'Terms of Service', 'Privacy']

export function Footer() {
  return (
    <footer className="font-montserrat text-white">
      <div className="bg-bh-blue-1000">
        <div className="mx-auto flex max-w-[1326px] flex-col gap-10 px-4 py-[50px] md:px-6 xl:flex-row xl:justify-between">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:flex xl:gap-0">
            {columns.map(col => (
              <div key={col.title} className="xl:w-[190px] xl:first:w-[216px] xl:[&:nth-child(2)]:w-[239px]">
                <h3 className="mb-[26px] text-[20px] font-medium leading-[26px]">{col.title}</h3>
                <ul>
                  {col.links.map(l => (
                    <li key={l}>
                      <a href={href(l)} className="text-[13px] leading-[26px] hover:underline">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <img src={logo} alt="Bluehost" className="h-6 w-[136px] xl:mt-[26px]" />
        </div>
      </div>
      <div className="bg-bh-blue-900">
        <div className="mx-auto flex max-w-[1326px] flex-col gap-6 px-4 py-[38px] md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative h-5 w-[259px]">
            <img src={socials} alt="" className="h-5 w-[259px]" />
            <div className="absolute inset-0 grid grid-cols-6">
              {socialLinks.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={`Bluehost on ${s.label}`} className="block" />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2 text-[12px] leading-[26px]">
            {legal.map(l => (
              <a key={l} href="https://www.bluehost.com/legal" className="hover:underline">{l}</a>
            ))}
            <span>© 2002-2025 Bluehost Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
