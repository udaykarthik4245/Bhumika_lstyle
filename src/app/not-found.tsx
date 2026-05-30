import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-brand-500">404</h1>
      <p className="text-lg font-semibold mt-2">Page not found</p>
      <p className="text-sm text-slate-500 mt-1">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary inline-flex mt-6">
        Go Home
      </Link>
    </div>
  );
}
