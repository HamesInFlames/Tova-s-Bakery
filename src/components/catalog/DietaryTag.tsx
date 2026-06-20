const LABELS: Record<string, string> = {
  'gluten-free': 'Gluten Free',
  'sugar-free': 'Sugar Free',
  dairy: 'Dairy',
  parve: 'Parve',
};

export default function DietaryTag({ tag }: { tag: string }) {
  const label = LABELS[tag] ?? tag;
  return (
    <span className="rounded-full border border-border-warm bg-wheat px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary">
      {label}
    </span>
  );
}
