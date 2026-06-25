"use client"

import Link from "next/link"

export default function TargetMarketPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div
          className="absolute inset-0 z-0 hidden md:block bg-cover bg-right"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/policies/privacypolicy/bannerpoliciescoffee.jpg')",
          }}
        />
        <div
          className="absolute inset-0 z-0 md:hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/policies/privacypolicy/mobilebannerpoliciescoffee.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Target Market Determinations
            </h1>
            <p className="text-white text-lg">
              Horizon Ridge Credit Union
              <br />
              <a
                href="mailto:contact@horizonridge.cc"
                className="underline"
              >
                contact@horizonridge.cc
              </a>{" "}
              &nbsp;|&nbsp;{" "}
              <a href="tel:+15022095647" className="underline">
                +1 502 209 5647
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav
        className="py-4 px-4 max-w-5xl mx-auto w-full"
        aria-label="Breadcrumb"
      >
        <ol className="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/security/important-info" className="hover:underline">
              Important information
            </Link>
          </li>
          <li>/</li>
          <li>Target Market Determinations</li>
        </ol>
      </nav>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-navy dark:text-brand-sun">
            Delivering better customer outcomes
          </h2>
        </div>
      </section>

      <section className="pt-0 pb-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          <div className="flex-1 text-brand-gray dark:text-brand-light">
            <p className="mb-4">
              We are required to make Target Market Determinations available
              under the{" "}
              <em>
                Treasury Laws Amendment (Design and Distribution Obligations and
                Product Intervention Powers) Act (Cth) 2019
              </em>
              .
            </p>
            <p className="mb-4">
              This is to ensure that the right products end up in the hands of
              the right customer by focusing on our customers in the design and
              distribution of our financial products.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-brand-navy dark:text-brand-sun">
              What is a Target Market Determination (TMD)?
            </h3>
            <p className="mb-2">A TMD is a document which describes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>the persons for which the product has been designed,</li>
              <li>the conditions around the product distribution,</li>
              <li>when this TMD will be reviewed, and</li>
              <li>record keeping and reporting obligations of distributors.</li>
            </ul>
            <p className="mb-4">
              Please note a TMD is not intended to provide financial advice.
              When making a decision about a product always make sure you refer
              to the Terms and Conditions and any supplementary document(s).
              These will outline the relevant terms and conditions being
              provided under that product.
            </p>
          </div>

          <div className="flex-1 bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 text-brand-gray dark:text-brand-light">
            <div className="flex items-center gap-3 mb-3">
              <i className="fa-regular fa-circle-info text-3xl text-brand-sun" />
              <h3 className="font-semibold text-lg text-brand-navy dark:text-brand-sun">
                About TMDs
              </h3>
            </div>
            <p>
              This page includes the Target Market Determinations for financial
              products issued and/or distributed by Horizon Ridge Credit Union.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
