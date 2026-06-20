import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import SectionNav from '@/components/onepage/SectionNav';
import Footer from '@/components/layout/Footer';
import GrodzinskiButton from '@/components/layout/GrodzinskiButton';
import { categories } from '@/data/content';
import Home from '@/pages/Home';

const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-cream-soft">
        Skip to content
      </a>
      <SectionNav />
      <ScrollToTop />
      <main id="main" className={`flex-1 ${isHome ? '' : 'pt-16'}`}>
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-ink-soft">Loading…</div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/products/:slug" element={<PageTransition><CategoryPage /></PageTransition>} />

              {/* Old single-page route paths now jump to the relevant home section */}
              <Route path="/about-us" element={<Navigate to="/#story" replace />} />
              <Route path="/our-labels" element={<Navigate to="/#quality" replace />} />
              <Route path="/wholesale-catalog" element={<Navigate to="/#wholesale" replace />} />
              <Route path="/contact-us" element={<Navigate to="/#contact" replace />} />
              <Route path="/products" element={<Navigate to="/#range" replace />} />

              {/* Redirects from the old GoDaddy category URLs */}
              {categories.map((c) => (
                <Route key={c.livePath} path={decodeURIComponent(c.livePath)} element={<Navigate to={c.path} replace />} />
              ))}

              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <GrodzinskiButton />
    </div>
  );
}
