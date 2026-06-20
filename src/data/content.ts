// Typed access layer over tovas-content.json (the single content source of truth,
// captured from the live site + render-crawl on 2026-06-19). Mirrors Grodzinski's
// data-driven menuDisplay pattern, minus prices.
import raw from '../../tovas-content.json';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface VariantItem {
  name: string;
  tags: string[];
  /** Placeholder product image (live GoDaddy URL) — replace with real photography. */
  image: string;
  /** Original filename-derived name, kept for traceability. */
  sourceName?: string;
}

export interface CategorySection {
  heading: string;
  assortedImage: string | null;
  items: VariantItem[];
  note?: string;
}

export interface ProductCategory {
  slug: string;
  path: string;
  livePath: string;
  title: string;
  certBanner: string;
  intro: string | null;
  variantsComplete: boolean;
  imageSource?: string;
  sections: CategorySection[];
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface SiteInfo {
  name: string;
  domain: string;
  founded: number;
  tagline: string;
  shortDescription: string;
  certifications: string[];
  certBanner: string;
  social: SocialLink[];
  contact: {
    phone: string;
    phoneHref: string;
    email: string | null;
    address: string;
    hoursNote: string;
  };
  crossLink: { label: string; url: string; note?: string };
  logo: { liveUrl: string; isStock: boolean; note?: string; local?: string };
}

interface TovasContent {
  site: SiteInfo;
  nav: NavItem[];
  labels: { slug: string; name: string; badgeImage: string | null }[];
  labelBadges?: LabelAsset[];
  labelLoaves?: LabelAsset[];
  pages: Record<string, any>;
  categories: ProductCategory[];
}

export interface LabelAsset {
  image: string;
  alt: string;
}

export interface WholesaleVideoSection {
  heading: string;
  body: string;
  video?: string;
  poster?: string;
}

const content = raw as unknown as TovasContent;

export const site = content.site;
export const nav = content.nav;
export const labels = content.labels;
export const labelBadges = content.labelBadges ?? [];
export const labelLoaves = content.labelLoaves ?? [];
export const pages = content.pages;
export const categories = content.categories;

export const getCategory = (slug: string): ProductCategory | undefined =>
  categories.find((c) => c.slug === slug);

export default content;
