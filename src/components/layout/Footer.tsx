import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { site, nav } from '@/data/content';

const products = nav.find((n) => n.label === 'Our Products')!;
const year = new Date().getFullYear();

// Lucide v1 dropped brand glyphs — inline minimal SVGs for the socials.
function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'Facebook') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif text-2xl font-semibold text-cream-soft">Tova&rsquo;s Bakery</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/75">{site.shortDescription}</p>
            <div className="mt-5 flex gap-3">
              {site.social.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream/85 transition-colors hover:border-honey hover:text-honey"
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-honey">Explore</h2>
            <ul className="space-y-2 text-sm text-cream/85">
              <li><Link to="/#story" className="hover:text-honey">Our Story</Link></li>
              <li><Link to="/#range" className="hover:text-honey">Products</Link></li>
              <li><Link to="/#wholesale" className="hover:text-honey">Wholesale</Link></li>
              <li><Link to="/#quality" className="hover:text-honey">Quality &amp; Trust</Link></li>
              <li><Link to="/#contact" className="hover:text-honey">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-honey">Our Products</h2>
            <ul className="space-y-2 text-sm text-cream/85">
              {products.children!.map((c) => (
                <li key={c.path}>
                  <Link to={c.path} className="hover:text-honey">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-honey">Visit</h2>
            <ul className="space-y-3 text-sm text-cream/85">
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-honey" aria-hidden="true" />
                <span>{site.contact.address}</span>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-honey" aria-hidden="true" />
                <a href={site.contact.phoneHref} className="hover:text-honey">{site.contact.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-cream/15" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-cream/60 sm:flex-row">
          <p>&copy; {year} Tova&rsquo;s Bakery. All Rights Reserved.</p>
          <p className="font-semibold uppercase tracking-[0.12em] text-honey">Nut Free &middot; COR Certified Kosher</p>
        </div>
      </div>
    </footer>
  );
}
