"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(path: string) {
    return pathname === path
      ? "text-brand-sun font-medium"
      : "text-brand-gray dark:text-brand-light";
  }

  const navLinks = [
    { href: "/personal", label: "Personal" },
    { href: "/business", label: "Business" },
    { href: "/about", label: "About us" },
    { href: "/contact", label: "Contact us" },
    { href: "/support", label: "Support centre" },
  ];

  return (
    <nav
      className={`sticky top-0 z-40 w-full bg-brand-light dark:bg-brand-dark border-b border-brand-gray/20 dark:border-brand-navy/40 shadow-sm transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ fontSize: "13px" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/logo-nobg.png"
            alt="Horizon Ridge Credit Union logo"
            className="h-8 w-auto block dark:hidden"
          />
          <img
            src="/images/logo.jpg"
            alt="Horizon Ridge Credit Union logo"
            className="h-8 w-auto hidden dark:block"
          />
          <span className="font-semibold text-sm md:text-base text-brand-navy dark:text-brand-sun ml-1 hidden xs:inline">
            Horizon Ridge
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-1 lg:gap-3 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-1.5 rounded hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition text-sm ${isActive(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-3 px-4 py-1.5 rounded-full bg-brand-sun text-white font-medium shadow hover:bg-brand-navy transition text-sm"
          >
            Login
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {dark ? (
              <i className="fa-solid fa-sun text-sm text-amber-400"></i>
            ) : (
              <i className="fa-solid fa-moon text-sm text-brand-navy"></i>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            aria-label="Open menu"
            className="md:hidden p-1.5 rounded-lg text-brand-navy dark:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col py-6 px-5 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          aria-label="Close menu"
          className="self-end mb-6 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2.5 rounded-lg text-sm ${isActive(link.href)} hover:bg-brand-sun/10 dark:hover:bg-brand-teal/20 transition`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/login"
            className="block w-full text-center px-4 py-2.5 rounded-full bg-brand-sun text-white font-medium shadow hover:bg-brand-navy transition text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
