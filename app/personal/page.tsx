"use client";

import { useState } from "react";
import Link from "next/link";

const loanTypes = [
  { icon: "fa-lock", label: "Secured personal loan" },
  { icon: "fa-unlock", label: "Unsecured personal loan" },
  { icon: "fa-leaf", label: "Secured green personal loan" },
  { icon: "fa-leaf", label: "Unsecured green personal loan" },
  { icon: "fa-user-graduate", label: "Secured student personal loan" },
  { icon: "fa-user-graduate", label: "Unsecured student personal loan" },
];

const securedLoans = [
  { name: "Personal Loan", desc: "Whether it's for a car, a boat, a holiday or something completely different.", rate: "7.79% p.a.", compRate: "8.51% p.a." },
  { name: "Green Personal Loan", desc: "This loan rewards you for your environmentally friendly purchases.", rate: "4.99% p.a.", compRate: "5.35% p.a." },
  { name: "Student Personal Loan", desc: "A loan for all higher education students and apprentices.", rate: "6.79% p.a.", compRate: "6.95% p.a." },
];

const unsecuredLoans = [
  { name: "Personal Loan", desc: "Great for your dream holiday or any number of needs where you don't offer security.", rate: "12.79% p.a.", compRate: "14.89% p.a." },
  { name: "Green Personal Loan", desc: "Ideal for solar hot water, grey water treatment systems or energy saving white goods.", rate: "6.99% p.a.", compRate: "8.01% p.a." },
  { name: "Student Personal Loan", desc: "A loan for your dream holiday or any number of needs where you don't have security.", rate: "9.99% p.a.", compRate: "9.99% p.a." },
];

const benefits = [
  { icon: "fa-sliders", title: "Flexible options", desc: "Choose from weekly, fortnightly or monthly repayments, secured or unsecured loans with terms up to 7 years." },
  { icon: "fa-arrows-up-down-left-right", title: "Big or small", desc: "Choose a loan size to suit your needs. Whether for a holiday, a car, a boat or something completely different, just ask us." },
  { icon: "fa-bolt", title: "Quick response", desc: "We know you want to hear about your application quickly. You will have a response from us within 48 hours." },
];

const tools = [
  { icon: "fa-calculator", label: "Personal loan repayments calculator" },
  { icon: "fa-percent", label: "Personal loan interest rates" },
  { icon: "fa-money-bill-trend-up", label: "Check your borrowing power" },
];

export default function PersonalPage() {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop')" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">
              Personal loans
            </h1>
            <p className="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">
              Bringing your plans to life.
            </p>
            <Link
              href="/personal-enquiry"
              className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy transition-all duration-300 text-lg"
            >
              Make an enquiry
            </Link>
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
              <li className="text-gray-500 dark:text-gray-400">Personal loans</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Loan Types */}
      <section className="bg-brand-sun/10 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h4 className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-6">Apply for your personal loan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loanTypes.map((loan, i) => (
              <a key={i} href="#" className="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-xl shadow-sm hover:bg-brand-sun/10 transition border border-gray-100 dark:border-gray-800">
                <span className="mb-3 text-brand-sun text-3xl"><i className={`fa-solid ${loan.icon}`} /></span>
                <span className="text-sm text-center text-brand-navy dark:text-brand-light">{loan.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 bg-white dark:bg-brand-dark/90">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">
            Our personal loans come with a range of benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <span className="text-brand-sun text-4xl"><i className={`fa-solid ${b.icon}`} /></span>
                <h5 className="mt-3 mb-2 text-brand-navy dark:text-brand-sun font-bold text-lg">{b.title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secured Loans */}
      <section className="bg-brand-sun/5 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-2">
            Secured personal loan comparison
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            A secured personal loan is a loan guaranteed by an asset, such as a car. Having security means we can offer a lower interest rate for the loan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securedLoans.map((loan, i) => (
              <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h5 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{loan.name}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{loan.desc}</p>
                <div className="text-brand-sun font-semibold">Rate: {loan.rate}</div>
                <div className="text-brand-sun font-semibold">Comparison rate: {loan.compRate}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unsecured Loans */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-2">
            Unsecured personal loan comparison
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            An unsecured loan means that you don't need to provide any security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {unsecuredLoans.map((loan, i) => (
              <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h5 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{loan.name}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{loan.desc}</p>
                <div className="text-brand-sun font-semibold">Rate: {loan.rate}</div>
                <div className="text-brand-sun font-semibold">Comparison rate: {loan.compRate}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section className="bg-brand-sun/10 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-3">Calculators and tools</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Use our tools and calculators to help compare and select the right personal loan for you.
            </p>
            <Link
              href="/personal-enquiry"
              className="inline-block px-6 py-3 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300"
            >
              Make an enquiry
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tools.map((tool, i) => (
              <a key={i} href="#" className="bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col items-center hover:bg-brand-sun/10 transition">
                <span className="mb-2 text-brand-sun text-3xl"><i className={`fa-solid ${tool.icon}`} /></span>
                <span className="text-sm text-center text-brand-navy dark:text-brand-light">{tool.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-4">How to apply for a loan</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Select the loan that is most suited to you</li>
              <li><Link href="/login" className="text-brand-sun hover:underline">Apply online</Link> or <Link href="/contact-us" className="text-brand-sun hover:underline">contact us</Link></li>
              <li>Send supporting documentation so that we can finalize your application</li>
              <li>Receive a response to your application and you will be one step closer to getting that new car, holiday, caravan, home improvements, whatever in no time at all.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-4">Personal loan pre application</h2>
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full text-left py-2.5 px-4 bg-brand-sun/10 rounded-xl font-semibold text-brand-navy dark:text-brand-sun flex items-center justify-between"
            >
              Show details
              <i className={`fa-solid fa-chevron-down transition-transform ${accordionOpen ? "rotate-180" : ""}`} />
            </button>
            {accordionOpen && (
              <div className="bg-white dark:bg-brand-dark rounded-xl p-4 mt-2 border border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
                <p>
                  Desperate for a holiday? Or to dive into an adventure? Driven to buy your next car? Or dreaming of a home makeover? Or home comforts? A Horizon Ridge Credit Union personal loan can make it happen. Applying online is quick and easy.
                </p>
                <p>
                  Here is how it works. To be eligible, you need to be over 18, a US citizen or permanent resident, employed, or have a regular income, not bankrupt or in financial hardship. If you receive government benefits, it is best to call us.
                </p>
                <p>
                  You will need identification, income and employment details, asset details, expenses, and details around any debts you have. Now you have got your info, it is time to apply. It is fast. Taking around 10 to 20 minutes to complete online. We will call you as soon as possible to go over your application, so you can dive, drive and make your dream come true. Apply now.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Switch Spotlight */}
      <section className="bg-brand-sun/20 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-2">
              Looking to switch your personal loan to Horizon Ridge Credit Union?
            </h3>
          </div>
          <Link
            href="/switch"
            className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300"
          >
            Switch now
          </Link>
        </div>
      </section>

      {/* Insurance Banner */}
      <section className="relative w-full min-h-[220px] md:min-h-[330px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop')" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-bold text-white dark:text-brand-sun mb-2">Car insurance</h3>
            <p className="text-white/90 mb-4">Insurance is about protecting your future. Get cover for what you love today.</p>
            <a href="#" className="inline-block px-6 py-3 rounded-full bg-white text-brand-navy font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300">
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-4">Things you should know</h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
            <p>
              <Link href="/security/terms" className="text-brand-sun hover:underline">Terms and conditions, fees and charges</Link> apply.
              All information including interest rate is subject to change without notice. Full details available on application.
              Lending criteria apply.
            </p>
            <p>
              <strong>Important information about comparison rate:</strong> The comparison rates displayed are calculated
              for secured personal loans with a loan amount of $30,000 and a term of 5 years, for unsecured personal loans
              the loan amount is $10,000 with a term of 3 years.
            </p>
            <p>
              <strong>WARNING:</strong> This comparison rate is true only for the examples given and may not include all
              fees and charges. Different terms, fees or other loan amounts might result in a different comparison rate.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
