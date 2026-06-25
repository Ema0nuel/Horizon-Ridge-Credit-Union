import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-brand-light dark:bg-brand-dark border-t border-brand-gray/20 dark:border-brand-navy/40 mt-8" style={{ fontSize: "0.9rem" }}>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <img src="/images/logo-nobg.png" alt="Horizon Ridge Credit Union logo" className="h-10 mb-2 block dark:hidden" />
          <img src="/images/logo.jpg" alt="Horizon Ridge Credit Union logo" className="h-10 mb-2 hidden dark:block" />
          <div className="font-semibold text-brand-navy dark:text-brand-sun text-base mb-2">Horizon Ridge Credit Union</div>
          <p className="text-brand-gray dark:text-brand-light text-sm">Empowering your financial future.</p>
          <br />
          <p className="text-brand-gray dark:text-brand-light text-sm"><span className="font-medium">Email: </span>contact@horizonridge.cc</p>
          <br />
          <p className="text-brand-gray dark:text-brand-light text-sm"><span className="font-medium">Contact: </span>+1 (502) 209-5647</p>
        </div>
        <div>
          <div className="font-medium text-brand-navy dark:text-brand-sun mb-2">Quick links</div>
          <ul className="space-y-1">
            <li><Link href="/contact" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Contact us</Link></li>
            <li><Link href="/locate-us" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Locate a branch, ATM or Agency</Link></li>
            <li><Link href="/switch" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Switch your banking to us</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-brand-navy dark:text-brand-sun mb-2">About us</div>
          <ul className="space-y-1">
            <li><Link href="/about" className="hover:underline text-brand-gray dark:text-brand-light text-sm">About Horizon Ridge</Link></li>
            <li><Link href="/community" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Community</Link></li>
            <li><Link href="/accessibility" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Accessibility and Inclusion</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium text-brand-navy dark:text-brand-sun mb-2">Help and support</div>
          <ul className="space-y-1">
            <li><Link href="/financial-abuse" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Financial abuse</Link></li>
            <li><Link href="/financial-difficulty" className="hover:underline text-brand-gray dark:text-brand-light text-sm">Financial difficulty assistance</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4 border-t border-brand-gray/20 dark:border-brand-navy/40 text-sm text-brand-gray dark:text-brand-light flex flex-col md:flex-row justify-between items-center gap-2">
        <div>&copy; {new Date().getFullYear()} Horizon Ridge Credit Union. All rights reserved.</div>
        <div className="flex flex-wrap gap-2">
          <Link href="/security/terms" className="hover:underline">Terms of use</Link>
          <Link href="/security/important-info" className="hover:underline">Important information</Link>
          <Link href="/security/privacy" className="hover:underline">Privacy</Link>
          <Link href="/security" className="hover:underline">Security</Link>
          <Link href="/security/target-market" className="hover:underline">Target Market Determinations</Link>
        </div>
      </div>
    </footer>
  );
}
