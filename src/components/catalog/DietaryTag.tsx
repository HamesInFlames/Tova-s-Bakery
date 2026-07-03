const LABELS: Record<string, string> = {
  'gluten-free': 'Gluten Free',
  'sugar-free': 'Sugar Free',
  dairy: 'Dairy',
  parve: 'Parve',
};

// Brand-manual label system: gold sticker = gluten free, mint sticker = sugar free,
// black sticker = parve, white (outlined) sticker = dairy.
const STYLES: Record<string, string> = {
  'gluten-free': 'bg-gold text-ink',
  'sugar-free': 'bg-mint text-ink',
  parve: 'bg-ink text-paper',
  dairy: 'bg-paper text-ink border border-ink/30',
};

export default function DietaryTag({ tag }: { tag: string }) {
  const label = LABELS[tag] ?? tag;
  const style = STYLES[tag] ?? 'bg-paper text-ink border border-ink/30';
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-caps ${style}`}>
      {label}
    </span>
  );
}
