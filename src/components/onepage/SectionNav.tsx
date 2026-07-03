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
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

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
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-paper">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button onClick={toTop} aria-label="Tova's Bakery — top">
          <img src="/images/brand/wordmark-black.svg" alt="Tova's Bakery" className="h-4 w-auto sm:h-5" />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`relative text-xs font-medium uppercase tracking-caps transition-colors duration-150 ${
                active === s.id && onHome
                  ? 'text-ink after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:border-b-2 after:border-gold after:content-[""]'
                  : 'text-ink/70 hover:text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => go('contact')}
            className="rounded-none bg-ink px-5 py-2 text-xs font-medium uppercase tracking-caps text-paper transition-colors duration-150 hover:bg-gold hover:text-ink"
          >
            Inquire
          </button>
        </div>

        <button className="text-ink md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <Menu size={24} />
        </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-paper md:hidden"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/15 px-6">
              <img src="/images/brand/wordmark-black.svg" alt="Tova's Bakery" className="h-4 w-auto" />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors duration-150 hover:bg-ink hover:text-paper">
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
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      onClick={() => go(s.id)}
                      className="flex w-full items-baseline justify-between border-b border-ink/15 py-4 font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink transition-colors duration-150"
                    >
                      {s.label}
                      <span className="font-sans text-xs font-medium tracking-caps text-ink/40">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 space-y-4 px-8 pb-10">
              <button onClick={() => go('contact')} className="w-full rounded-none bg-ink py-4 text-xs font-medium uppercase tracking-caps text-paper transition-colors duration-150 hover:bg-gold hover:text-ink">
                Wholesale Inquiry
              </button>
              <div className="flex items-center justify-between">
                <a href={site.contact.phoneHref} className="text-sm font-medium text-ink/65">{site.contact.phone}</a>
                <span className="text-xs font-medium uppercase tracking-caps text-ink/60">Nut-Free &middot; COR</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
