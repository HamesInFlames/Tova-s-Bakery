import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '@/data/content';

const SECTIONS = [
  { id: 'story', label: 'Story' },
  { id: 'range', label: 'Products' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'quality', label: 'Quality' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';
  // Over the dark hero at the very top of home → light text on a transparent bar.
  const light = onHome && !scrolled;

  useEffect(() => {
    if (!onHome) { setActive(''); return; }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = useCallback((id: string) => {
    setOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  }, [location.pathname, navigate]);

  const toTop = () => {
    setOpen(false);
    if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/');
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? 'border-b border-rule/70 bg-cream/80 backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button onClick={toTop} className={`font-serif text-xl font-semibold tracking-tight transition-colors ${light ? 'text-cream-soft' : 'text-ink'}`} aria-label="Tova's Bakery — top">
          Tova&rsquo;s Bakery
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`text-sm font-medium tracking-tight transition-colors ${
                active === s.id && onHome
                  ? 'text-accent'
                  : light
                    ? 'text-cream-soft/80 hover:text-cream-soft'
                    : 'text-ink/70 hover:text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => go('contact')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${light ? 'bg-cream-soft text-ink hover:bg-cream' : 'bg-ink text-cream-soft hover:bg-primary'}`}
          >
            Inquire
          </button>
        </div>

        <button className={`md:hidden ${light ? 'text-cream-soft' : 'text-ink'}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <Menu size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-cream md:hidden"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-6">
              <span className="font-serif text-xl font-semibold text-ink">Tova&rsquo;s Bakery</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-wheat text-ink">
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-8" aria-label="Mobile primary">
              <ul>
                {SECTIONS.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => go(s.id)}
                      className={`flex w-full items-baseline justify-between border-b border-rule py-4 font-serif text-3xl transition-colors ${active === s.id && onHome ? 'text-accent' : 'text-ink'}`}
                    >
                      {s.label}
                      <span className="font-sans text-xs font-medium text-ink/40">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 space-y-4 px-8 pb-10">
              <button onClick={() => go('contact')} className="w-full rounded-full bg-ink py-4 font-semibold text-cream-soft transition-colors hover:bg-primary">
                Wholesale Inquiry
              </button>
              <div className="flex items-center justify-between">
                <a href={site.contact.phoneHref} className="text-sm font-medium text-ink-soft">{site.contact.phone}</a>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-hover">Nut-Free &middot; COR</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
