"use client";

import Link from "next/link";

const features = [
  { icon: "fa-dollar-sign", title: "$0 annual fee", desc: "No annual fee means more of your money stays where it belongs — with you." },
  { icon: "fa-plane", title: "Platinum travel perks", desc: "Complimentary travel insurance, concierge service, and airport lounge access." },
  { icon: "fa-percent", title: "Low purchase rate", desc: "Competitive ongoing rate starting at 19.99% p.a. on purchases." },
  { icon: "fa-gift", title: "Rewards program", desc: "Earn points on every dollar spent. Redeem for travel, gift cards, or cashback." },
  { icon: "fa-shield-halved", title: "Purchase protection", desc: "Insured against damage or theft for 120 days on eligible purchases." },
  { icon: "fa-mobile-screen-button", title: "Digital wallet ready", desc: "Add to Apple Pay, Google Pay, or Samsung Pay for tap-and-go payments." },
];

const rates = [
  { label: "Purchase rate", value: "19.99% p.a." },
  { label: "Cash advance rate", value: "21.99% p.a." },
  { label: "Balance transfer rate", value: "0% p.a. for 12 months" },
  { label: "Annual fee", value: "$0" },
  { label: "Foreign transaction fee", value: "2.50%" },
  { label: "Min credit limit", value: "$1,000" },
  { label: "Max credit limit", value: "$25,000" },
];

export default function CreditCardsReadyPage() {
  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      {/* Hero */}
      <section className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop')" }} />
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-6">
            <i className="fa-solid fa-credit-card" />
            Credit card
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            iStandard GroupReady Credit Card
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            $0 annual fee with platinum travel perks. The card that rewards every purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block px-8 py-3 rounded-full bg-white text-brand-navy font-semibold shadow-lg hover:bg-brand-sun hover:text-white transition-all duration-300 text-lg"
            >
              Apply now
            </Link>
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm" aria-label="Breadcrumb">
            <ol className="flex space-x-2 text-brand-gray dark:text-gray-400">
              <li><Link href="/" className="hover:text-brand-sun">Home</Link></li>
              <li>/</li>
              <li className="text-brand-navy dark:text-brand-sun font-medium">iStandard GroupReady Credit Card</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Rate card */}
      <section className="py-12 bg-white dark:bg-brand-dark/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">
                The card that gives you more
              </h2>
              <p className="text-base md:text-lg text-brand-gray dark:text-brand-light mb-6">
                Whether you are after everyday value or travel rewards, the iStandard GroupReady Credit Card
                delivers with no annual fee, competitive rates, and platinum-level benefits.
              </p>
              <p className="text-base md:text-lg text-brand-gray dark:text-brand-light mb-6">
                Enjoy complimentary travel insurance, 24/7 concierge service, and access to airport lounges
                worldwide. Plus, earn rewards points on every purchase you make.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-sun">19.99%</div>
                  <div className="text-sm text-brand-gray dark:text-gray-400">Purchase rate p.a.</div>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-sun">$0</div>
                  <div className="text-sm text-brand-gray dark:text-gray-400">Annual fee</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-brand-navy dark:text-brand-sun mb-4">Interest rates and fees</h3>
              <div className="space-y-3">
                {rates.map((r, i) => (
                  <div key={i} className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <span className="text-sm text-brand-gray dark:text-gray-400">{r.label}</span>
                    <span className="text-sm font-semibold text-brand-navy dark:text-brand-light">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-12 bg-brand-sun/5 dark:bg-brand-dark/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-brand-dark border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-brand-sun/10 flex items-center justify-center mb-4">
                  <i className={`fa-solid ${f.icon} text-brand-sun text-xl`} />
                </div>
                <h3 className="font-semibold text-lg text-brand-navy dark:text-brand-sun mb-2">{f.title}</h3>
                <p className="text-sm text-brand-gray dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-brand-navy to-brand-dark text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to apply?</h2>
          <p className="text-lg text-white/80 mb-8">
            Join over 1.9 million members who trust Horizon Ridge Credit Union.
            Apply online in minutes and get a decision fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block px-8 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-white hover:text-brand-navy transition-all duration-300"
            >
              Apply now
            </Link>
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer notice */}
      <section className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-brand-gray dark:text-gray-500 leading-relaxed">
            Terms and conditions apply. Fees, charges, and eligibility criteria are available on request.
            The comparison rate for the iStandard GroupReady Credit Card is 21.50% p.a. based on a $1,500
            credit limit for a 24-month period. Warning: This comparison rate applies only to the example
            or examples given. Different amounts and terms will result in different comparison rates. Costs
            such as redraw fees or early repayment fees, and cost savings such as fee waivers, are not
            included in the comparison rate but may influence the cost of the card. Application for credit
            is subject to responsible lending criteria and approval.
          </p>
        </div>
      </section>
    </main>
  );
}
