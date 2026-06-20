import { ExternalLink } from 'lucide-react';
import { site } from '@/data/content';

// Permanent bottom-right cross-promotion to the sister bakery (Grodzinski North).
// Intentional — inverted from Grodzinski's own button that links back to Tova's.
export default function GrodzinskiButton() {
  return (
    <aside aria-label="Sister bakery">
      <a
        href={site.crossLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-border-warm bg-cream-soft/95 px-4 py-2.5 text-sm font-semibold text-ink shadow-warm backdrop-blur transition-colors hover:bg-primary hover:text-cream-soft"
      >
        <span>{site.crossLink.label}</span>
        <ExternalLink size={15} aria-hidden="true" />
      </a>
    </aside>
  );
}
