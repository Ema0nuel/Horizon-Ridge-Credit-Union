"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AccessibilityPage() {
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
              <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Accessibility and inclusion</h1>
              <p className="text-lg text-white dark:text-brand-sun mb-4">We are committed to creating a safe, inclusive and empowering environment where everyone can thrive.</p>
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
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li>/</li>
                <li>Accessibility and inclusion</li>
              </ol>
            </nav>
          </div>
        </section>
        {/* Section Header */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-3">Inclusive and accessible design is good for everyone</h2>
              <div className="text-brand-navy dark:text-brand-sun mb-4">
                <p>At Horizon Ridge Credit Union, we value all abilities and capabilities. We want our products, services and workplace to be accessible to all people. Using industry expertise and advances ensures banking with us is positive and seamless.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Partnerships Block */}
        <section className="py-8 bg-brand-sun/10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6">
              <div className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-2">Vision</div>
              <div className="text-brand-gray dark:text-brand-light">We work with Vision on design and testing of our key banking services for the visually impaired. A first of its kind, online learning for Better Banking for People.</div>
            </div>
            <div className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6">
              <div className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-2">Network on Disability</div>
              <div className="text-brand-gray dark:text-brand-light">Network on Disability (AND) is a national not-for-profit membership-based organisation. AND specialises in supporting businesses in building disability confidence, engagement and action.</div>
            </div>
            <div className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6">
              <div className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-2">PACE Mentoring</div>
              <div className="text-brand-gray dark:text-brand-light">PACE Mentoring is a dynamic mentoring program. They connect job seekers with disability to volunteer mentors from our staff.</div>
            </div>
          </div>
        </section>
        {/* Website Accessibility */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-4">Website accessibility</h2>
            <p className="text-brand-gray dark:text-brand-light mb-4">We aim to meet WCAG (Web Content Accessibility Guidelines) 2.1 AA on our websites by:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="list-inside list-disc space-y-2 text-brand-navy dark:text-brand-light">
                <li>Our website designs are responsive and adjust to fit the most popular devices screen display sizes.</li>
                <li>We use icons to help explain information and our online forms also feature descriptive error messages to help users complete.</li>
                <li>The text size on each website page is adjustable and within our content we also use simple paragraphs and lists for enhanced readability.</li>
                <li>We make sure foreground and background colors meet colour contrast requirements.</li>
                <li>Our buttons are clearly labelled and we make sure that links make sense out of context.</li>
                <li>We use correctly structured semantic HTML to aid users who tab through content and use screen readers.</li>
                <li>Our search and navigation options are keyboard accessible and available across the website.</li>
              </ul>
              <ul className="list-inside list-disc space-y-2 text-brand-gray dark:text-brand-light">
                <li className="opacity-70">We avoid using complex language within our web content.</li>
                <li className="opacity-70">We avoid the over-use of abbreviations or industry jargon.</li>
                <li className="opacity-70">We avoid using colour alone to convey meaning.</li>
              </ul>
            </div>
          </div>
        </section>
        {/* Ways to Bank */}
        <section className="py-8 bg-brand-sun/10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-3">Ways to bank</h2>
              <div className="text-brand-navy dark:text-brand-sun mb-4">
                <p>There are many different ways to bank with us. Find out more about our in-person, phone, online or on-the-go services.</p>
              </div>
            </div>
            <div>
              <Link href="/user/login" className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg" aria-label="Learn about all the ways to bank with us">
                Start banking with us
              </Link>
            </div>
          </div>
        </section>
        {/* Access and Inclusion Plan */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-4">Our Access and Inclusion Plan</h2>
            <div className="text-brand-gray dark:text-brand-light space-y-4">
              <p>We are committed to creating an inclusive and supportive bank for our customers, staff and community. The Horizon Ridge Credit Union Access and Inclusion Plan aims to do this.</p>
              <p>Our focus is on three groups: our customers, our people, and our workplace. We aim to raise awareness, influence strategy, and drive initiatives to deliver change.</p>
              <p>The plan was a collaborative effort. We worked with the Australian Network on Disability and input from senior leaders. The Banks employee and inclusion network was also involved. This network comprises members from across the organisation who have experience with disability. They share a passion for accessibility issues and building an inclusive workplace.</p>
            </div>
          </div>
        </section>
        {/* Diversity Statement */}
        <section className="py-8 bg-brand-grape/10">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-xl md:text-2xl font-bold text-brand-navy dark:text-brand-sun mb-2">We believe a diverse workforce supported by an inclusive culture is central to our success.</h3>
          </div>
        </section>
        {/* Feedback */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-3">We value your feedback</h2>
            <p className="text-brand-gray dark:text-brand-light mb-4">We continually strive to improve our accessibility and we value feedback from you on ways we can improve our access or fix any problems. Please contact us if there is information on this website, or in any of our digital channels, which you cannot access.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col">
                <div className="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Online</div>
                <div className="text-brand-gray dark:text-brand-light mb-2">
                  <p>Use our online <Link href="/contact" className="text-brand-sun underline" rel="noopener">customer feedback form</Link>.</p>
                  <p>Or use our online messaging service to chat with a staff member.</p>
                </div>
              </div>
              <div className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col">
                <div className="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Visit a branch</div>
                <div className="text-brand-gray dark:text-brand-light mb-2">
                  <p>Speak to a staff member at one of <Link href="/locate-us" className="text-brand-sun underline">our branches</Link>.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
