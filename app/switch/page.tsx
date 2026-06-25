"use client";

import Link from "next/link";

const exploreTiles = [
  {
    title: "Owner occupied variable",
    subtitle: "Express Home Loan",
    description: "Combines fast online approval with a competitive interest rate and flexible terms.",
    rate: "4.97%",
    comparison: "5.12%",
    link: "/personal",
    eligibility: "/personal",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
  },
  {
    title: "Owner occupied variable",
    subtitle: "Complete Home Loan",
    description: "Get the flexibility you want, with the features and benefits you need.",
    rate: "5.44%",
    comparison: "5.67%",
    link: "/home",
    eligibility: "/personal/enquiry",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
  },
  {
    title: "Investment variable",
    subtitle: "Complete Home Loan",
    description: "Flexible terms for your investment property.",
    rate: "5.69%",
    comparison: "5.92%",
    link: "/",
    eligibility: "/personal/enquiry",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
  }
];

const categoryTiles = [
  {
    title: "Complete Home Loan",
    link: "/business",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
  },
  {
    title: "Express Home Loan",
    link: "/personal",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
  },
  {
    title: "Home Insurance",
    link: "/personal",
    img: "https://westcoastsgroup.com/siteassets/personal/insurance/homeinsurance/promotiles/categorytile-homeinsurance.jpg"
  },
  {
    title: "Credit Cards",
    link: "/personal",
    img: "https://westcoastsgroup.com/siteassets/personal/creditcards/_promotiles/categorytile-creditcards.jpg"
  }
];

const numberedTiles = [
  {
    number: 1,
    text: "Speak to our lending specialists who will be able to guide you through the process and discuss which home loan best suits your needs."
  },
  {
    number: 2,
    text: "Do you want to bring your everyday banking or credit cards with you? We can help you start this process."
  },
  {
    number: 3,
    text: "Once you have decided on the loan that best suits you we will get to work and do all the heavy lifting for you."
  }
];

export default function SwitchPage() {
  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style={{ backgroundImage: "url('https://westcoastsgroup.com/siteassets/switchnow/headerbanner-switchnow.jpg')" }} />
        <div className="absolute inset-0 z-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('https://westcoastsgroup.com/siteassets/switchnow/mobilebanner-switchnow.jpg')" }} />
        <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">
              Moving to Horizon Ridge Credit Union is easier than ever
            </h1>
            <p className="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">
              Refinance with a bank you can feel better about and join 1.9 million Aussies already benefiting from our competitive rates and trusted services.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-sun/10 py-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
              <i className="fa-solid fa-users text-brand-sun text-2xl" />
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">Caring for 1.9 million customers</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
              <i className="fa-solid fa-hand-holding-dollar text-brand-sun text-2xl" />
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">$272 million reinvested back into local communities</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
              <i className="fa-solid fa-house-chimney-user text-brand-sun text-2xl" />
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-semibold">Australia most satisfied home loan customers*</span>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm" aria-label="Breadcrumb">
            <ol className="flex space-x-2 text-brand-navy dark:text-brand-sun">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li>/</li>
              <li className="text-gray-500 dark:text-gray-400">Switch now</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/campaign-panel-desktop.jpg"
              alt="Refinance Home Loan"
              className="rounded-xl shadow-sm w-full object-cover mb-6 md:mb-0"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">Refinance your home loan</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="bg-white dark:bg-brand-dark rounded-xl p-4 flex-1 shadow-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-brand-navy dark:text-brand-sun">4.97%</span>
                  <span className="text-brand-navy dark:text-brand-sun">p.a.</span>
                </div>
                <div className="text-brand-gray dark:text-brand-light text-sm">Variable rate<sup>4</sup></div>
              </div>
              <div className="bg-white dark:bg-brand-dark rounded-xl p-4 flex-1 shadow-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-brand-navy dark:text-brand-sun">5.12%</span>
                  <span className="text-brand-navy dark:text-brand-sun">p.a.</span>
                </div>
                <div className="text-brand-gray dark:text-brand-light text-sm">Comparison rate<sup>1</sup></div>
              </div>
            </div>
            <ul className="mb-4 space-y-2">
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-brand-sun" /> Offset available on variable and fixed loans<sup>3</sup></li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-brand-sun" /> Access additional repayments using online redraw</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-brand-sun" /> Apply online - full online experience</li>
            </ul>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href="/personal"
                className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition text-center"
              >
                Learn more
              </Link>
              <Link
                href="/personal"
                className="inline-block px-6 py-3 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition text-center"
              >
                Check my eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-brand-sun/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">
              Great reasons to refinance your home loan with Horizon Ridge Credit Union
            </h2>
            <p className="mb-4 text-brand-gray dark:text-brand-light">
              Our competitive rates, simplified home loan products, and personalized customer service. Just some of the reasons why our customers choose to bank with us. We are also one of Australia most trusted brands.<sup>^</sup>
            </p>
            <p className="mb-4 text-brand-gray dark:text-brand-light">
              See for yourself when you switch your home loan to Horizon Ridge Credit Union, the better big bank.
            </p>
            <Link
              href="/personal/enquiry"
              className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition"
            >
              Make an enquiry
            </Link>
          </div>
          <div>
            <div className="bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Move other banking</h3>
              <p className="mb-4 text-brand-gray dark:text-brand-light">
                Also interested in moving your other banking to us? Learn how to easily switch your transaction account or personal loan today.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/user/login"
                  className="inline-block px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition text-center"
                >
                  Transaction account
                </Link>
                <Link
                  href="/user/login"
                  className="inline-block px-4 py-2 rounded-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition text-center"
                >
                  Personal loan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-brand-sun/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">Great loans for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exploreTiles.map((tile, i) => (
              <div key={i} className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-all duration-300 group">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={tile.img} alt={tile.title} className="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{tile.title}</h3>
                <div className="mb-2 text-brand-sun font-semibold">{tile.subtitle}</div>
                <div className="mb-4 text-brand-gray dark:text-brand-light">{tile.description}</div>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-brand-navy dark:text-brand-sun">{tile.rate}</span>
                    <span className="text-brand-navy dark:text-brand-sun">p.a.</span>
                  </div>
                  <div className="text-brand-gray dark:text-brand-light text-sm">
                    Comparison rate: <span className="font-semibold">{tile.comparison}</span> p.a.
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    href={tile.link}
                    className="inline-block px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition text-center"
                  >
                    Learn more
                  </Link>
                  <Link
                    href={tile.eligibility}
                    className="inline-block px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition text-center"
                  >
                    Check my eligibility
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/personal"
              className="inline-block px-6 py-3 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300"
            >
              View all home loan rates
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-brand-sun/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">
            Explore how to switch to Horizon Ridge Credit Union
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {numberedTiles.map((tile, i) => (
              <div key={i} className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-sun text-white text-2xl font-bold mb-4">
                  {tile.number}
                </div>
                <div className="text-brand-navy dark:text-brand-sun font-semibold">{tile.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">
            You may also be interested in
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryTiles.map((tile, i) => (
              <Link
                key={i}
                href={tile.link}
                className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300 hover:shadow-md group"
              >
                <div className="rounded-t-xl overflow-hidden">
                  <img src={tile.img} alt={tile.title} className="w-full h-32 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex-1 flex flex-col justify-between p-4">
                  <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{tile.title}</h3>
                  <span className="inline-block mt-auto text-brand-sun font-semibold">
                    Learn more <i className="fa-solid fa-arrow-right ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
