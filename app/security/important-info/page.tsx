"use client"

import Link from "next/link"

const infoTiles = [
  {
    title: "Codes of practice",
    icon: "fa-regular fa-scale-balanced",
    details: [
      "Banking Code of Practice",
      "Code of Operation for the Department of Human Services and the Department of Veterans Affairs",
      "Family Law Guidelines",
      "ePayments Code",
    ],
    link: "/security",
    linkText: "Learn more about our codes of practice",
  },
  {
    title: "Disclosure documents",
    icon: "fa-regular fa-file-lines",
    details: [
      "Terms and conditions for products and services",
      "Product disclosure statements",
      "Privacy disclosure statement",
      "Electronic communication consent",
      "Financial services guide, and more.",
    ],
    link: "/security",
    linkText: "View our disclosure documents",
  },
  {
    title: "Financial Claims Scheme (FCS)",
    icon: "fa-regular fa-shield-halved",
    details: [
      "An Australian Government scheme that provides protection and quick access to deposits in banks, building societies and credit unions in the unlikely event that one of these financial institutions fails.",
    ],
    link: "/security",
    linkText: "Learn more about FCS",
  },
  {
    title: "Privacy",
    icon: "fa-regular fa-user-shield",
    details: [
      "Horizon Ridge Credit Union Privacy Policy",
      "Credit Reporting Policy",
      "Credit Reporting Statement of Notifiable Matters",
      "Consumer Data Right",
    ],
    link: "/security/privacy",
    linkText: "View our policies",
  },
  {
    title: "Target Market Determinations (TMD)",
    icon: "fa-regular fa-bullseye",
    details: [
      "Target Market Determinations for financial products distributed by Horizon Ridge Credit Union are to ensure that the right products end up in the hands of the right customer. We do this by focusing on our customers in the design and distribution of our financial products.",
    ],
    link: "/security/target-market",
    linkText: "Learn more about TMDs",
  },
  {
    title: "Website terms of use",
    icon: "fa-regular fa-globe",
    details: [
      "The terms of use for the Horizon Ridge Credit Union website sets the rules for using our website with our rights in, and restrictions on your use of, the site, product and services information, third party content and jurisdiction.",
    ],
    link: "/security/terms",
    linkText: "Read our terms of use",
  },
]

export default function ImportantInfoPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div
          className="absolute inset-0 z-0 hidden md:block bg-cover bg-right"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/policies/creditreportingpolicy/bannerpoliciesglasses.jpg')",
          }}
        />
        <div
          className="absolute inset-0 z-0 md:hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/policies/creditreportingpolicy/mobilebannerpoliciesglasses.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Important Information
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
          <li>Important information</li>
        </ol>
      </nav>

      {/* Tile Grid */}
      <section className="py-10 bg-white dark:bg-brand-dark/90">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">
            Find information that may be important to you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {infoTiles.map((tile, i) => (
              <div
                key={i}
                className="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group h-full"
              >
                <div className="flex justify-center mb-4">
                  <i
                    className={`${tile.icon} text-5xl text-brand-sun`}
                  />
                </div>
                <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2 text-center">
                  {tile.title}
                </h3>
                {tile.details.length === 1 ? (
                  <p className="mb-4 text-brand-gray dark:text-brand-light text-center">
                    {tile.details[0]}
                  </p>
                ) : (
                  <ul className="mb-4 text-brand-gray dark:text-brand-light list-disc pl-5 space-y-1">
                    {tile.details.map((detail, j) => (
                      <li key={j}>{detail}</li>
                    ))}
                  </ul>
                )}
                <Link
                  href={tile.link}
                  className="inline-block mt-auto self-center px-6 py-2 rounded-full border-2 border-brand-sun text-brand-sun font-semibold hover:bg-brand-sun hover:text-white transition-all duration-300"
                >
                  {tile.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
