import { Link } from 'react-router-dom';

interface CtaBandProps {
  heading: string;
  text: string;
  ctaLabel: string;
  ctaPath: string;
}

// Reusable conversion band — every page funnels to Contact / Wholesale.
export default function CtaBand({ heading, text, ctaLabel, ctaPath }: CtaBandProps) {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-container px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-xl text-paper/75">{text}</p>
        <Link
          to={ctaPath}
          className="mt-8 inline-flex items-center rounded-none border border-paper px-8 py-3.5 text-sm font-medium uppercase tracking-caps text-paper transition-colors hover:border-gold hover:bg-gold hover:text-ink"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
