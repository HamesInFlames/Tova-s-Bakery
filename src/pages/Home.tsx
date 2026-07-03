import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, ArrowRight, MapPin, Phone, Clock } from 'lucide-react';
import Seo from '@/components/Seo';
import Reveal from '@/components/onepage/Reveal';
import RangeShowcase from '@/components/onepage/RangeShowcase';
import StatBand from '@/components/onepage/StatBand';
import VideoEmbed from '@/components/VideoEmbed';
import ContactForm from '@/components/ContactForm';
import { site, pages, labelBadges, labelLoaves } from '@/data/content';

const home = pages.home;
const wholesale = pages.wholesale;
const showcase = wholesale.showcaseVideo as { src: string; poster?: string } | undefined;

// Tiny 260px thumbs (built by scripts/build-hero-thumbs.mjs) for the darkened,
// blurred hero backdrop — keeps the above-the-fold payload small.
const heroImages = Array.from({ length: 12 }, (_, i) => `/images/hero/${i}.webp`);

const Eyebrow = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`mb-5 text-xs font-medium uppercase tracking-caps-wide ${dark ? 'text-gold' : 'text-ink/60'}`}>{children}</p>
);

export default function Home() {
  const location = useLocation();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Arriving at /#section from another page → scroll there once mounted.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    }
  }, [location.hash]);

  return (
    <>
      <Seo title={home.title} description={home.metaDescription} path="/" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
        {/* Darkened wall of real product photos */}
        <motion.div style={{ scale: bgScale }} className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="grid h-full w-full auto-rows-fr grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {heroImages.map((src, i) => (
              <div key={i} className="overflow-hidden">
                <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full scale-105 object-cover opacity-55 blur-[2px]" />
              </div>
            ))}
          </div>
        </motion.div>
        {/* Vignette veil (logo stays crisp at centre) */}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 44%, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.9) 100%)' }} />

        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 flex flex-col items-center">
          <h1 className="sr-only">Tova&rsquo;s Bakery — Kosher, Nut-Free, COR-Certified Wholesale Bakery in Markham, since {site.founded}</h1>

          {/* Cert badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-paper/20 bg-paper/5 px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-caps text-paper/75 backdrop-blur-sm"
          >
            <span>Est. {site.founded}</span><span className="h-3 w-px bg-paper/30" aria-hidden="true" />
            <span>Kosher</span><span className="h-3 w-px bg-paper/30" aria-hidden="true" />
            <span>Nut-Free</span><span className="h-3 w-px bg-paper/30" aria-hidden="true" />
            <span>COR</span>
          </motion.div>

          <img src="/images/brand/logo-stacked-white.svg" alt="Tova's Bakery — since 1999" width={520} height={338} fetchPriority="high" className="mx-auto w-full max-w-[320px] sm:max-w-[420px]" />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-xl text-2xl font-light italic text-paper sm:text-3xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          >
            <a href="#contact" className="inline-flex items-center rounded-none border border-paper px-7 py-3.5 text-sm font-medium uppercase tracking-caps text-paper transition-colors hover:border-gold hover:bg-gold hover:text-ink">
              Wholesale inquiry
            </a>
            <a href="#range" className="group inline-flex items-center gap-2 text-base font-medium text-paper/80 transition-colors hover:text-gold">
              Explore the range <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>

        <a href="#story" aria-label="Scroll to story" className="absolute bottom-9 z-10 flex flex-col items-center gap-2 text-paper/50 transition-colors hover:text-paper">
          <span className="text-[0.65rem] font-medium uppercase tracking-caps-wide">Scroll</span>
          <ChevronDown size={20} className="scroll-cue" />
        </a>

        {/* Soft fade into the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 bg-gradient-to-b from-transparent to-ink" />
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section id="story" className="bg-paper px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* TODO(phase0): engraved illustration corner motif */}
          <Reveal>
            <Eyebrow>Our Story</Eyebrow>
            <div className="mx-auto w-16 border-t border-ink/20" aria-hidden="true" />
            <p className="mt-10 font-display text-2xl font-light leading-snug text-ink sm:text-3xl">
              Since 1999, our flavor spoke for us. It was on your table, in your celebrations, in your
              everyday moments. Like those family recipes everyone loves, but no one really knows where
              they come from. Today, after all this time, we&rsquo;ve decided to share the secret. We
              didn&rsquo;t change grandpa&rsquo;s recipe, we just cared for it and gave it a name.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 font-display text-3xl font-bold text-ink sm:text-4xl">
              Tova&rsquo;s, the flavor that&rsquo;s always been there.
            </p>
            <div className="mx-auto mt-10 w-16 border-t border-ink/20" aria-hidden="true" />
          </Reveal>
        </div>
      </section>

      {/* ── BY THE NUMBERS ───────────────────────────────────────────────── */}
      <StatBand />

      {/* ── RANGE ────────────────────────────────────────────────────────── */}
      <RangeShowcase />

      {/* ── WHOLESALE (centerpiece) ──────────────────────────────────────── */}
      <section id="wholesale" className="bg-ink px-6 py-28 text-paper sm:py-36">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <Eyebrow dark>Wholesale</Eyebrow>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Built for your shelves</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-paper/70">{wholesale.tagline}</p>
          </Reveal>

          {showcase?.src && (
            <Reveal className="mb-20">
              <VideoEmbed src={showcase.src} poster={showcase.poster} title="Tova's Wholesale Showcase" />
            </Reveal>
          )}

          <div className="space-y-20">
            {(wholesale.sections as { heading: string; body: string; video?: string; poster?: string }[]).map((s, i) => (
              <Reveal key={s.heading}>
                <div className="grid items-center gap-10 md:grid-cols-2">
                  <div className={i % 2 ? 'md:order-2' : ''}>
                    {s.video ? (
                      <VideoEmbed src={s.video} poster={s.poster} title={s.heading} />
                    ) : (
                      <div className="aspect-video w-full rounded-none bg-paper/5" />
                    )}
                  </div>
                  <div className={i % 2 ? 'md:order-1' : ''}>
                    <h3 className="font-display text-3xl font-bold text-paper">{s.heading}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-paper/70">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY ──────────────────────────────────────────────────────── */}
      <section id="quality" className="bg-paper px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <Eyebrow>Quality &amp; Trust</Eyebrow>
            <h2 className="font-display text-4xl font-bold text-ink sm:text-5xl">Certified, every batch</h2>
            <p className="mt-5 text-xs font-bold uppercase tracking-caps-wide text-ink">
              Nut Free &ndash; Parve &ndash; Pas Yisroel
            </p>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/65">
              Tova&rsquo;s is more than bread. It has been a family tradition that brings generations
              together around the table. We carefully preserve recipes that taste like home, so every
              family can continue sharing the flavor that&rsquo;s always been there. Honoring kosher
              traditions, supporting our community and delivering quality you can trust.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink/65">
              Everything is baked in a 100% nut-free facility under COR kosher supervision, and clearly labelled.
            </p>
          </Reveal>

          {/* The six labels — compact cards */}
          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
            {labelBadges.map((b) => (
              <Reveal key={b.image}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-none border border-ink/15 bg-paper p-3 sm:p-5">
                  <img src={b.image} alt={b.alt} loading="lazy" className="max-h-full w-auto object-contain" />
                </div>
              </Reveal>
            ))}
          </div>

          {/* The label, on every loaf — contained photography */}
          {labelLoaves.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {labelLoaves.map((l) => (
                <Reveal key={l.image}>
                  <div className="aspect-[4/3] overflow-hidden rounded-none bg-black ring-1 ring-ink/10">
                    <img src={l.image} alt={l.alt} loading="lazy" className="h-full w-full object-cover object-center" />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="border-t border-ink/15 bg-paper px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14 text-center">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="font-display text-4xl font-bold text-ink sm:text-5xl">Let&rsquo;s talk wholesale</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/65">
              Tell us about your shop or event and we&rsquo;ll send a current price list and minimums.
            </p>
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin size={22} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
                  <div><p className="font-semibold text-ink">{site.contact.address.split(',')[0]}</p><p className="text-ink/65">{site.contact.address}</p></div>
                </div>
                <div className="flex gap-4">
                  <Phone size={22} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
                  <div><p className="font-semibold text-ink">Phone</p><a href={site.contact.phoneHref} className="text-ink/65 underline underline-offset-4 transition-opacity hover:opacity-70">{site.contact.phone}</a></div>
                </div>
                <div className="flex gap-4">
                  <Clock size={22} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
                  <div><p className="font-semibold text-ink">Ordering</p><p className="text-ink/65">{site.contact.hoursNote}</p></div>
                </div>
                <div className="overflow-hidden rounded-none border border-ink/15">
                  <iframe title="Map to Tova's Bakery" src={`https://www.google.com/maps?q=${encodeURIComponent(site.contact.address)}&output=embed`} loading="lazy" className="h-64 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
