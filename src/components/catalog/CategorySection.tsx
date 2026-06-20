import type { CategorySection as Section } from '@/data/content';
import VariantConfigurator from './VariantConfigurator';

export default function CategorySection({ section }: { section: Section }) {
  if (!section.items.length) return null;
  return (
    <section className="border-t border-rule py-12 first:border-t-0">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-3xl font-semibold text-ink">{section.heading}</h2>
        <span className="shrink-0 text-sm text-ink-soft">
          {section.items.length} {section.items.length === 1 ? 'variety' : 'varieties'}
        </span>
      </div>
      {section.note && <p className="mb-5 max-w-2xl text-sm italic text-ink-soft">{section.note}</p>}
      <VariantConfigurator items={section.items} />
    </section>
  );
}
