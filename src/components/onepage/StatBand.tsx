import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'motion/react';
import { site, categories } from '@/data/content';
import Reveal from './Reveal';

const years = new Date().getFullYear() - site.founded;
const varieties = categories.reduce((n, c) => n + c.sections.reduce((m, s) => m + s.items.length, 0), 0);

const STATS = [
  { value: years, suffix: '', label: 'Years of tradition' },
  { value: varieties, suffix: '', label: 'Varieties' },
  { value: categories.length, suffix: '', label: 'Collections' },
  { value: 100, suffix: '%', label: 'Nut-free facility' },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function StatBand() {
  return (
    <section className="bg-ink px-6 py-20 text-paper">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-12 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-caps-wide text-gold">Why Tova&rsquo;s</p>
          <p className="mx-auto max-w-2xl font-display text-2xl font-medium leading-snug text-paper sm:text-3xl">
            A wholesale partner retailers have shelved with confidence since {site.founded}.
          </p>
        </Reveal>
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className={`px-4 text-center ${i > 0 ? 'sm:border-l sm:border-gold/40' : ''}`}>
                <dt className="font-display text-5xl font-black text-paper sm:text-6xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dt>
                <dd className="mt-2 text-sm font-medium uppercase tracking-caps text-paper/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
