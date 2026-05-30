import Link from 'next/link';
import { categories } from '@/lib/categories';

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-2xl font-bold text-brand-500 mb-1">
            Bhumika <span className="font-light italic text-slate-700 dark:text-slate-300">Style</span>
          </h3>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Studio</p>
          <p className="text-slate-600 dark:text-slate-400">
            Curated fashion for the modern soul. Discover top brands and timeless trends, all in one place.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-500"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li>Contact Us</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li>About Bhumika Style</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Bhumika Style Studio. Built with Next.js + Tailwind. Demo project.
      </div>
    </footer>
  );
}
