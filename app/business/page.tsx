"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const quickLinks = [
  { title: "Grow your business with a loan", icon: "fa-sack-dollar", href: "/#" },
  { title: "Take and make payments", icon: "fa-credit-card", href: "/#" },
  { title: "Manage your business transactions", icon: "fa-money-check-dollar", href: "/#" },
  { title: "Purchase the equipment you need", icon: "fa-truck-ramp-box", href: "/#" },
  { title: "Credit and debit cards for your business", icon: "fa-id-card", href: "/#" },
  { title: "Protect against the unexpected", icon: "fa-shield-halved", href: "/#" },
];

const highlights = [
  {
    title: "Managing your cash flow",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    desc: "Ensuring your day-to-day business details run smoothly, we offer a competitive range of transaction and savings accounts specifically designed to help you access your money and take care of business.",
  },
  {
    title: "Growing your business",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    desc: "Big, small, established or new, if you need finance, we have a range of business and commercial loans to suit your unique needs.",
  },
  {
    title: "Trading with confidence",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    desc: "We offer a range of other financial solutions to allow your business to run smoothly so that you can focus on growing your business and better service your customers.",
  },
  {
    title: "Operating internationally",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    desc: "We provide secure solutions and competitive rates that allows you to transfer funds or travel overseas with confidence.",
  },
  {
    title: "Building wealth",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop",
    desc: "Super that's good for you and your employees. West Coast GroupSmartStart Super is a low cost, easy to use superannuation solution designed to keep things simple for you and your employees.",
  },
  {
    title: "Protecting my assets",
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    desc: "We offer a comprehensive range of commercial insurance solutions across business, farm and trade activities.",
  },
];

const profiles = [
  {
    title: "Tips on how you can better manage cash flow",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    desc: "What's the number one issue keeping business owners up at night? Cash flow. Put simply, having money in the bank to cover your business expenses.",
    link: "/#",
    linkText: "Read more",
  },
  {
    title: "How to borrow to grow your business",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    desc: "The thought of growing your business can be daunting. The good news is there are so many options available so you can tailor finance to suit you.",
    link: "/#",
    linkText: "Read more",
  },
  {
    title: "Economic update with David Robertson",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    desc: "David Robertson, Head of Economic and Markets Research provides a monthly update on the economy and market.",
    link: "/#",
    linkText: "View economic updates",
  },
];

export default function BusinessPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">
              Your business matters
            </h1>
            <p className="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">
              Everything you need to make business banking easy
            </p>
          </div>
        </div>
      </section>

      {/* Proposition Banner */}
      <section className="bg-brand-sun/10 py-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow">
              <i className="fa-solid fa-percent text-brand-sun text-2xl" />
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">Competitive rates</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow">
              <i className="fa-solid fa-layer-group text-brand-sun text-2xl" />
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">Wide product range</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow">
              <i className="fa-solid fa-handshake text-brand-sun text-2xl" />
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">Banking made easy</span>
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
              <li className="text-gray-500 dark:text-gray-400">Business</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-xl shadow-sm hover:bg-brand-sun/10 transition border border-gray-100 dark:border-gray-800"
              >
                <span className="mb-3 text-brand-sun text-3xl">
                  <i className={`fa-solid ${link.icon}`} />
                </span>
                <span className="text-center text-sm text-brand-navy dark:text-brand-light">{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-10 bg-white dark:bg-brand-dark/90">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">
            What matters to you, matters to us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <div key={i} className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 flex flex-col p-5">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={h.img} alt={h.title} className="w-full h-40 object-cover" />
                </div>
                <h4 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{h.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-sun py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Not sure which solution is right for you?
            </h2>
            <p className="text-white/90">
              We have a range of specialists who can work with you to tailor the right solution
            </p>
          </div>
          <Link
            href="/personal-enquiry"
            className="inline-block px-6 py-3 rounded-full bg-white text-brand-navy font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300"
          >
            Make an enquiry
          </Link>
        </div>
      </section>

      {/* Profile Cards */}
      <section className="bg-brand-sun/10 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {profiles.map((profile, i) => (
              <div key={i} className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 flex flex-col h-full p-5">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={profile.img} alt={profile.title} className="w-full h-40 object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{profile.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{profile.desc}</p>
                </div>
                <div className="mt-auto">
                  <a href={profile.link} className="inline-block border-t border-gray-200 dark:border-gray-700 pt-3 text-brand-sun hover:text-brand-navy font-semibold text-sm transition">
                    {profile.linkText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-4">Things you should know</h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
            <p>
              Terms, conditions, fees, charges and lending criteria apply. Individual circumstances may vary.
              You should consult your taxation advisor and read the relevant Terms and Conditions available
              at Horizon Ridge Credit Union before making a decision. Rates are subject to change.
            </p>
            <p>
              Awards are based on information collected from the DBM Atlas research program feedback from
              over 80,000 businesses and/or retail customers January 2021 through December 2021.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
