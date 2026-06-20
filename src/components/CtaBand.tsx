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
    <section className="bg-primary text-cream-soft">
      <div className="mx-auto max-w-container px-6 py-16 text-center">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-xl text-cream-soft/85">{text}</p>
        <Link
          to={ctaPath}
          className="mt-8 inline-flex items-center rounded-md bg-cream-soft px-8 py-3.5 font-semibold text-primary transition-colors hover:bg-honey hover:text-ink"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
