"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const branches = [
  {
    name: "Horizon Ridge Credit Union",
    address: "36 Main Street, Box Hill VIC 3128",
    email: "contact@horizonridge.cc"
  },
  {
    name: "ATM iStandard GroupMarketplace",
    address: "116 - 120 Mitchell Street, Horizon Ridge Credit Union 3550"
  }
];

export default function LocateUsPage() {
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
      <main id="mainContent" className="main branchListing bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="branchListing">
        {/* Header Banner */}
        <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center">
          <div className="absolute inset-0 z-0 hidden md:block">
            <div className="w-full h-full bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')" }}></div>
            <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          </div>
          <div className="absolute inset-0 z-0 md:hidden">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop')" }}></div>
            <div className="absolute inset-0 bg-black/60 dark:bg-brand-navy/80"></div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Locate a branch, agency or ATM</h1>
            </div>
          </div>
        </section>
        {/* Branch Listing Block */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Branch List */}
            {branches.length === 0 ? (
              <div className="text-center text-brand-gray dark:text-brand-light py-12">
                <i className="fa-solid fa-location-dot text-4xl mb-4 text-brand-sun"></i>
                <p className="text-lg font-semibold">No branches or ATMs found at this time.</p>
                <p>Please check back later for updated locations.</p>
              </div>
            ) : (
              <ul className="space-y-6">
                {branches.map((branch, i) => (
                  <li key={i} className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 shadow">
                    <h5 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{branch.name}</h5>
                    <p className="mb-2 text-brand-gray dark:text-brand-light">{branch.address}</p>
                    {branch.email ? (
                      <p className="text-sm">
                        <span className="font-semibold">Email:</span>{" "}
                        <a href={"mailto:" + branch.email} className="text-brand-sun underline">{branch.email}</a>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {/* Google Map */}
            <div className="w-full h-96 rounded-xl overflow-hidden shadow border border-brand-sun/20 bg-white dark:bg-brand-dark">
              <iframe
                title="Branch Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.870759647729!2d-74.0060156845936!3d40.71277597933009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c6b7b2d%3A0x7b8b1b1b1b1b1b1b!2sNew%20York%20St%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1688570000000!5m2!1sen!2sus">
              </iframe>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
