"use client";

import { useState, useEffect, useCallback } from "react";

const heroBanners = [
  {
    title: "Express Home Loan: Fast, Flexible, Yours.",
    desc: "Get approved in as little as 24 hours. Enjoy competitive rates, flexible repayments, and a dedicated team to guide you home.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop",
    cta: "Apply Now",
    ctaLink: "/login",
  },
  {
    title: "Your Dream Home Awaits.",
    desc: "Unlock exclusive member rates and personalized support. Start your journey with Horizon Ridge Credit Union today.",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop",
    cta: "Start Now",
    ctaLink: "/signup",
  },
  {
    title: "Refinance & Save Big.",
    desc: "Switch your home loan and save with our low rates and zero application fees. See how much you could save in minutes.",
    img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    cta: "See Savings",
    ctaLink: "/login",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const goTo = useCallback(
    (next: boolean) => {
      setFade(true);
      setTimeout(() => {
        setIndex((prev) =>
          next
            ? (prev + 1) % heroBanners.length
            : (prev - 1 + heroBanners.length) % heroBanners.length
        );
        setFade(false);
      }, 400);
    },
    []
  );

  useEffect(() => {
    const timer = setInterval(() => goTo(true), 7000);
    return () => clearInterval(timer);
  }, [goTo]);

  const banner = heroBanners[index];

  return (
    <section className="relative w-full bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12 transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/logo-nobg.png"
          alt=""
          className="absolute left-1/2 top-1/2 w-96 max-w-full opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        />
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center opacity-40 md:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-sun/60 to-brand-navy/80" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1
            className={`text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-300 ${
              fade ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {banner.title}
          </h1>
          <p
            className={`text-lg md:text-2xl text-white mb-6 max-w-xl transition-all duration-300 ${
              fade ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {banner.desc}
          </p>
          <a
            href={banner.ctaLink}
            className={`inline-block px-8 py-3 rounded-full bg-brand-sun text-white font-medium shadow-lg hover:bg-brand-navy hover:scale-105 transition-all duration-300 text-lg ${
              fade ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {banner.cta}
          </a>
        </div>
        <div
          className={`flex-1 flex justify-center md:justify-end w-full transition-all duration-300 ${
            fade ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="rounded-2xl shadow-2xl overflow-hidden border-4 border-brand-sun bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg">
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-64 md:h-96 object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
