"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const stats = [
  { icon: "fa-trophy", value: "$4.6m", desc: "towards sport & recreation" },
  { icon: "fa-building-columns", value: "$4.1m", desc: "towards facilities & infrastructure" },
  { icon: "fa-graduation-cap", value: "$3.6m", desc: "towards education & research" },
  { icon: "fa-heart-pulse", value: "$3m", desc: "towards health & wellbeing" },
  { icon: "fa-palette", value: "$2.9m", desc: "towards art, culture & heritage" },
  { icon: "fa-leaf", value: "$300k", desc: "towards environment & animal welfare" },
  { icon: "fa-truck-medical", value: "$600k", desc: "towards emergency services & support" }
];

export default function CommunityPage() {
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
          <div className="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop')" }}></div>
          <div className="absolute inset-0 z-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop')" }}></div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Be part of the Horizon Ridge Credit Union community</h1>
              <div className="mb-6">
                <Link href="/locate-us" className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg">
                  Find a branch
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Proposition Banner */}
        <section className="bg-brand-sun/10 py-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i className="fa-solid fa-hand-holding-dollar text-brand-sun text-2xl"></i>
              </span>
              <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">$292 million reinvested back into local communities</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i className="fa-solid fa-store text-brand-sun text-2xl"></i>
              </span>
              <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">Over 300 Community Bank branches</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i className="fa-solid fa-building-columns text-brand-sun text-2xl"></i>
              </span>
              <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">One of Australia biggest banks</span>
            </div>
          </div>
        </section>
        {/* Breadcrumbs */}
        <section className="py-4">
          <div className="max-w-6xl mx-auto px-4">
            <nav className="text-sm" aria-label="Breadcrumb">
              <ol className="flex space-x-2 text-brand-navy dark:text-brand-sun">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li>/</li>
                <li>Community</li>
              </ol>
            </nav>
          </div>
        </section>
        {/* Section Header */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-3">Every day our customers help change and save lives, simply by banking with us.</h2>
              <div className="text-brand-navy dark:text-brand-sun mb-4">Community banking is based on a profit-with-purpose model, which means our profits are returned directly to the community that has generated them.</div>
            </div>
          </div>
        </section>
        {/* Stats Block */}
        <section className="bg-brand-sun/10 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-brand-navy dark:text-brand-sun mb-8">This year contributions included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 flex flex-col items-center p-6">
                  <span className="mb-2 text-brand-sun text-4xl">
                    <i className={"fa-solid " + s.icon}></i>
                  </span>
                  <div className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-2">{s.value}</div>
                  <div className="text-brand-gray dark:text-brand-light text-center">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Banner Block */}
        <section className="relative w-full min-h-[220px] md:min-h-[320px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90 mt-10">
          <div className="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop')" }}></div>
          <div className="absolute inset-0 z-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop')" }}></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white dark:text-brand-sun mb-2">Switch to Horizon Ridge Credit Union</h3>
              <p className="text-white dark:text-brand-sun mb-4">Be part of something bigger. See below for more information about our in-person, phone, online or on the go services.</p>
              <Link href="/switch-now" className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg">
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
