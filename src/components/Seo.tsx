// Per-page metadata. React 19 hoists <title>/<meta>/<link> rendered anywhere
// into <head>, so each route can set its own SEO + canonical.
interface SeoProps {
  title: string;
  description?: string;
  path?: string;
}

export default function Seo({ title, description, path }: SeoProps) {
  const canonical = path ? `https://tovasbakery.com${path}` : undefined;
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:title" content={title} />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}
    </>
  );
}
