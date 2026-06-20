import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found — Tova's Bakery" />
      <section className="flex min-h-[60vh] items-center justify-center bg-cream px-6">
        <div className="text-center">
          <p className="font-serif text-7xl font-semibold text-primary/30">404</p>
          <h1 className="mt-4 font-serif text-3xl font-semibold text-ink">Page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            The page you're looking for has moved or never existed.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/" className="rounded-md bg-accent px-6 py-3 font-semibold text-cream-soft hover:bg-accent-hover">
              Back Home
            </Link>
            <Link to="/products" className="rounded-md border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-cream-soft">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
