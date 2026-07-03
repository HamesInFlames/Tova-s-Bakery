import { useParams, Link, Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';
import CtaBand from '@/components/CtaBand';
import CategorySection from '@/components/catalog/CategorySection';
import { getCategory, categories } from '@/data/content';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = slug ? getCategory(slug) : undefined;
  if (!cat) return <Navigate to="/products" replace />;

  const total = cat.sections.reduce((n, s) => n + s.items.length, 0);
  const others = categories.filter((c) => c.slug !== cat.slug);

  return (
    <>
      <Seo
        title={`${cat.title} — Tova's Bakery`}
        description={cat.intro ?? `${cat.title} at Tova's Bakery — kosher, nut-free, COR-certified. ${total} varieties.`}
        path={cat.path}
      />

      {/* Kosher cert ribbon — trust signal at the top of every category page */}
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-container items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold uppercase tracking-caps">
          <ShieldCheck size={16} aria-hidden="true" />
          {cat.certBanner}
        </div>
      </div>

      <header className="border-b border-ink/15 bg-paper">
        <div className="mx-auto max-w-container px-6 py-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-caps-wide text-ink/60">
            <Link to="/products" className="hover:underline">Our Products</Link>
          </p>
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">{cat.title}</h1>
          {cat.intro && <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/65">{cat.intro}</p>}
          <p className="mt-4 text-sm text-ink/65">{total} varieties across {cat.sections.length} collections</p>
        </div>
      </header>

      <section className="bg-paper">
        <div className="mx-auto max-w-container px-6 py-8">
          {cat.sections.map((section) => (
            <CategorySection key={section.heading} section={section} />
          ))}
        </div>
      </section>

      {/* Other categories */}
      <section className="border-t border-ink/15 bg-paper">
        <div className="mx-auto max-w-container px-6 py-12">
          <h2 className="mb-5 text-center font-display text-2xl font-bold text-ink">More from Tova's</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                to={c.path}
                className="rounded-none border border-ink/20 bg-paper px-4 py-2 text-xs font-medium uppercase tracking-caps text-ink/70 transition-colors hover:border-ink hover:text-ink"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading={`Order ${cat.title} from Tova's`}
        text="Wholesale or retail — request pricing and we'll get back to you quickly."
        ctaLabel="Request Pricing"
        ctaPath="/contact-us"
      />
    </>
  );
}
