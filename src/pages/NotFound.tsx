import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found — Tova's Bakery" />
      <section className="flex min-h-[60vh] items-center justify-center bg-paper px-6">
        <div className="text-center">
          <p className="font-display text-7xl font-black text-ink/15">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink">Page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-ink/65">
            The page you're looking for has moved or never existed.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/" className="rounded-none bg-ink px-6 py-3 text-sm font-medium uppercase tracking-caps text-paper transition-colors duration-150 hover:bg-gold hover:text-ink">
              Back Home
            </Link>
            <Link to="/products" className="rounded-none border border-ink px-6 py-3 text-sm font-medium uppercase tracking-caps text-ink transition-colors duration-150 hover:border-gold hover:bg-gold">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
