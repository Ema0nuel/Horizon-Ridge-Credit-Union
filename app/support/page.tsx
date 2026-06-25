"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center font-sans text-sm">
        <div className="animate-pulse text-brand-navy dark:text-brand-sun text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans text-sm">
      <main id="mainContent" className="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        {/* Header Banner */}
        <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div className="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')" }}></div>
          <div className="absolute inset-0 z-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')" }}></div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Support centre</h1>
              <p className="text-lg text-white dark:text-brand-sun mb-4">Providing help and support when you need it.</p>
            </div>
          </div>
        </section>
        {/* Quick Tiles */}
        <section className="py-6 bg-white dark:bg-brand-dark/90">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/user/login" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span className="mb-2"><i className="fa-solid fa-link text-2xl text-brand-sun"></i></span>
              <span className="font-semibold text-brand-navy dark:text-brand-sun">Popular links</span>
            </Link>
            <Link href="/user/login" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span className="mb-2"><i className="fa-solid fa-laptop text-2xl text-brand-sun"></i></span>
              <span className="font-semibold text-brand-navy dark:text-brand-sun">e-banking help</span>
            </Link>
            <Link href="/user/login" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span className="mb-2"><i className="fa-solid fa-hands-holding-heart text-2xl text-brand-sun"></i></span>
              <span className="font-semibold text-brand-navy dark:text-brand-sun">We are here for you</span>
            </Link>
            <Link href="/user/login" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span className="mb-2"><i className="fa-solid fa-gear text-2xl text-brand-sun"></i></span>
              <span className="font-semibold text-brand-navy dark:text-brand-sun">Manage your banking</span>
            </Link>
            <Link href="/user/login" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span className="mb-2"><i className="fa-solid fa-ellipsis text-2xl text-brand-sun"></i></span>
              <span className="font-semibold text-brand-navy dark:text-brand-sun">Other support topics</span>
            </Link>
          </div>
        </section>
        {/* Popular Links */}
        <section className="py-8" id="popularlinks">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">Popular links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Link href="/user/login" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-id-card text-brand-sun text-2xl mr-4"></i>
                <span>Find my e-banking Access ID</span>
              </Link>
              <Link href="/user/login" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-key text-brand-sun text-2xl mr-4"></i>
                <span>Reset my e-banking password</span>
              </Link>
              <Link href="/user/login" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-envelope text-brand-sun text-2xl mr-4"></i>
                <span>Update my postal address</span>
              </Link>
              <Link href="/user/login" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-credit-card text-brand-sun text-2xl mr-4"></i>
                <span>Report a lost or stolen card</span>
              </Link>
            </div>
          </div>
        </section>
        {/* Scam Spotlight */}
        <section className="py-8 bg-brand-coral/10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 className="text-xl md:text-2xl font-bold text-brand-navy dark:text-brand-sun">Scams are on the rise so it never been more important to know how to spot a scam.</h3>
            <Link href="/user/login" className="px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg" aria-label="Learn how to spot a scam">
              Learn how to spot a scam
            </Link>
          </div>
        </section>
        {/* e-banking Support */}
        <section className="py-8" id="ebanking">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">e-banking support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 shadow">
                <h3 className="text-xl font-bold mb-2">Getting started</h3>
                <p className="mb-2">Everything you need to know when getting started.</p>
                <ul>
                  <li><Link href="/user/login" className="text-brand-sun underline">Accessing e-banking</Link></li>
                </ul>
              </div>
              <div className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 shadow">
                <h3 className="text-xl font-bold mb-2">Managing my accounts</h3>
                <p className="mb-2">Tips on managing your accounts to get the most out of e-banking.</p>
                <ul>
                  <li><Link href="/user/login" className="text-brand-sun underline">Account management</Link></li>
                  <li><Link href="/user/login" className="text-brand-sun underline">e-statements</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
              <Link href="/user/login" className="px-6 py-3 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition font-semibold">
                e-banking troubleshooting
              </Link>
              <Link href="/user/login" className="px-6 py-3 rounded-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition font-semibold">
                e-banking feedback
              </Link>
            </div>
          </div>
        </section>
        {/* We are Here For You */}
        <section className="py-8 bg-brand-grape/10" id="support">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">We are here for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Link href="/about" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i className="fa-solid fa-hands-holding-heart text-brand-sun text-2xl mb-2"></i>
                <span className="font-semibold text-brand-navy dark:text-brand-sun text-center">Vulnerable customers</span>
              </Link>
              <Link href="/about" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i className="fa-solid fa-hand-holding-dollar text-brand-sun text-2xl mb-2"></i>
                <span className="font-semibold text-brand-navy dark:text-brand-sun text-center">Financial difficulty assistance</span>
              </Link>
              <Link href="/about" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i className="fa-solid fa-cloud-bolt text-brand-sun text-2xl mb-2"></i>
                <span className="font-semibold text-brand-navy dark:text-brand-sun text-center">Natural disaster assistance</span>
              </Link>
              <Link href="/about" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i className="fa-solid fa-user-shield text-brand-sun text-2xl mb-2"></i>
                <span className="font-semibold text-brand-navy dark:text-brand-sun text-center">Financial abuse</span>
              </Link>
              <Link href="/about" className="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i className="fa-solid fa-virus-covid text-brand-sun text-2xl mb-2"></i>
                <span className="font-semibold text-brand-navy dark:text-brand-sun text-center">COVID-19 hub</span>
              </Link>
            </div>
          </div>
        </section>
        {/* Manage Your Banking */}
        <section className="py-8" id="manage">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">Manage your banking</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl shadow">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" alt="" className="w-full h-40 object-cover rounded-t-xl" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Products</h3>
                  <p className="mb-2">Helping you to manage your products.</p>
                  <ul>
                    <li><Link href="/user/login" className="text-brand-sun underline">Home loans</Link></li>
                    <li><Link href="/user/login" className="text-brand-sun underline">Credit and debit cards</Link></li>
                    <li><Link href="/user/login" className="text-brand-sun underline">Business cards</Link></li>
                  </ul>
                </div>
              </div>
              <div className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl shadow">
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop" alt="" className="w-full h-40 object-cover rounded-t-xl" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Security</h3>
                  <p className="mb-2">Keeping you and your family safe.</p>
                  <ul>
                    <li><Link href="/user/login" className="text-brand-sun underline">Scam alerts</Link></li>
                    <li><Link href="/user/login" className="text-brand-sun underline">Identity theft</Link></li>
                    <li><Link href="/user/login" className="text-brand-sun underline">General security</Link></li>
                  </ul>
                </div>
              </div>
              <div className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl shadow">
                <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop" alt="" className="w-full h-40 object-cover rounded-t-xl" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Ways to bank</h3>
                  <p className="mb-2">Supporting you to bank the way you want.</p>
                  <ul>
                    <li><Link href="/user/login" className="text-brand-sun underline">Internet banking</Link></li>
                    <li><Link href="/user/login" className="text-brand-sun underline">All ways to bank</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Us Spotlight */}
        <section className="py-8 bg-brand-sun/10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">Contact us</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/contact" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-envelope-open-text text-brand-sun text-2xl mr-4"></i>
                <span className="font-semibold">Online</span>
              </Link>
              <Link href="/locate-us" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-location-dot text-brand-sun text-2xl mr-4"></i>
                <span className="font-semibold">Find a branch</span>
              </Link>
              <a href="tel:1300236344" className="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i className="fa-solid fa-phone text-brand-sun text-2xl mr-4"></i>
                <span className="font-semibold">Call us</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
