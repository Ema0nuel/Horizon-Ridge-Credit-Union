import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-extrabold text-brand-sun mb-4">404</h1>
      <h2 className="text-3xl font-bold text-brand-navy dark:text-brand-sun mb-2">
        Page not found
      </h2>
      <p className="text-brand-gray dark:text-brand-light text-lg mb-8 max-w-md">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy transition-all duration-300 text-lg"
      >
        Go home
      </Link>
    </main>
  );
}
