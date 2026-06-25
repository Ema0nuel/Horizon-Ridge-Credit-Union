"use client";

import { useState } from "react";
import Link from "next/link";

const goals = [
  {
    title: "Buying a home",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    details: "Whether you are a first home buyer or looking to upgrade, we offer flexible home loan solutions, expert advice, and support every step of the way.",
    link: "/personal-home-loans"
  },
  {
    title: "Buying with credit",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    details: "Our credit card options are designed to suit your lifestyle, with competitive rates, rewards, and security for your everyday purchases.",
    link: "/personal-credit-cards"
  },
  {
    title: "Managing your money",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    details: "From everyday accounts to budgeting tools, we help you stay in control of your finances with easy access and smart features.",
    link: "/transaction-accounts"
  },
  {
    title: "Saving for what is important",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    details: "Reach your savings goals faster with our range of high-interest savings accounts and flexible deposit options.",
    link: "/savings-accounts"
  },
  {
    title: "Protecting what you love",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    details: "Safeguard your family, home, and valuables with our comprehensive insurance products tailored to your needs.",
    link: "/personal-insurance"
  }
];

const featureTiles = [
  {
    title: "Solutions that fit everyone",
    subtitle: "Accessibility and inclusion",
    img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    text: "We value all abilities and capabilities. So, we want our products, services and workplace to be accessible to all people.",
    details: "Our commitment to accessibility means we continually improve our services and facilities to ensure everyone can bank with confidence, regardless of ability.",
  },
  {
    title: "Understand our decisions",
    subtitle: "Environment, social and governance",
    img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop",
    text: "Horizon Ridge Credit Union ESG reflects our responsibility to customers, shareholders and the communities in which we are part of.",
    details: "We integrate ESG principles into our business, striving for positive environmental impact, social responsibility, and strong governance.",
  },
  {
    title: "Join our team",
    subtitle: "Careers at Horizon Ridge Credit Union",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    text: "Horizon Ridge Credit Union is the bank you can be proud to work at. We are big enough to offer you every opportunity, but not so big that we lose the community feel that we are famous for.",
    details: "Explore rewarding career opportunities and become part of a team that values growth, diversity, and making a difference.",
  },
  {
    title: "Your money is protected",
    subtitle: "Financial Claims Scheme",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    text: "The Financial Claims Scheme is an Australian Government scheme that provides protection and quick access to deposits in banks, building societies and credit unions in the unlikely event that one of these financial institutions fails.",
    details: "With the FCS, your deposits are protected up to the government guarantee limit, giving you peace of mind.",
  },
  {
    title: "We have high standards",
    subtitle: "Codes of Practice",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    text: "At Horizon Ridge Credit Union, we pride ourselves on our commitment to conduct business ethically and to the highest possible standard. In line with this commitment, Horizon Ridge Credit Union complies with a range of codes of practices.",
    details: "Our codes of practice ensure transparency, fairness, and integrity in all our dealings with customers and the community.",
  },
  {
    title: "How we are performing",
    subtitle: "Horizon Ridge Credit Union Investor Centre",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop",
    text: "Information on our securities, financial results, announcements, sustainability reporting and other disclosures.",
    details: "Stay informed about our financial performance, sustainability initiatives, and investor updates.",
  }
];

export default function AboutPage() {
  const [openTiles, setOpenTiles] = useState<Record<number, boolean>>({});
  const [openGoals, setOpenGoals] = useState<Record<number, boolean>>({});

  const toggleTile = (idx: number) => {
    setOpenTiles((prev: Record<number, boolean>) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleGoal = (idx: number) => {
    setOpenGoals((prev: Record<number, boolean>) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop')" }} />
        <div className="absolute inset-0 z-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop')" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">
              The better big bank
            </h1>
            <p className="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">
              When you are a big bank, you have big responsibilities. The biggest of which is to do the right thing. It is something we have always been good at.
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
              <li className="text-gray-500 dark:text-gray-400">About us</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="pt-8 pb-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">Welcome to Horizon Ridge Credit Union</h2>
            <p className="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
              We are a credit union that is good with money but we are more interested in the good that money can do.
            </p>
            <p className="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
              Since we first opened our doors, every decision we have made, every product we have created, every service we have provided, has been in the best interests of our members, partners and people.
            </p>
            <p className="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
              Throughout this time, we have been innovative, competitive, and accessible. Providing you with everything you need to achieve your financial goals, while supporting the communities in which we live.
            </p>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <Link
              href="/switch-now"
              className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg"
            >
              Try Horizon Ridge Credit Union
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-sun/10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-4">A history of firsts</h2>
          <p className="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
            As one of the region most trusted credit unions, we have delivered many firsts over the years.
          </p>
          <ul className="list-disc pl-6 text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
            <li>First to introduce green loans and home loan offset accounts.</li>
            <li>First globally to offer a digital home loan application in partnership with online fintechs.</li>
            <li>First to introduce Community Banking, returning profits to the people and communities that generate them.</li>
          </ul>
          <p className="text-base md:text-lg text-brand-gray dark:text-brand-light">
            As we continue to grow, we continue to innovate, investing in technology, accessibility, and service to create a better banking experience for you.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white dark:bg-brand-dark/90">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">Learn more about us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureTiles.map((tile, i) => (
              <div key={i} className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-all duration-300 group">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={tile.img} alt={tile.title} className="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{tile.title}</h3>
                <div className="mb-2 text-brand-sun font-semibold">{tile.subtitle}</div>
                <div className="mb-4 text-brand-gray dark:text-brand-light">{tile.text}</div>
                <button
                  onClick={() => toggleTile(i)}
                  className="flex items-center gap-2 mt-auto text-brand-sun hover:text-brand-navy font-semibold transition-all duration-200 focus:outline-none"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-brand-sun bg-white dark:bg-brand-dark">
                    <span className="text-xl font-bold">{openTiles[i] ? "-" : "+"}</span>
                  </span>
                  <span>{openTiles[i] ? "Hide details" : "Show details"}</span>
                </button>
                {openTiles[i] && (
                  <div className="mt-3 text-brand-gray dark:text-brand-light text-sm">{tile.details}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-brand-sun/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">What is your goal?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal, i) => (
              <div key={i} className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-all duration-300 group">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img src={goal.img} alt={goal.title} className="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{goal.title}</h3>
                  <button
                    onClick={() => toggleGoal(i)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-brand-sun text-brand-sun bg-white dark:bg-brand-dark hover:bg-brand-sun hover:text-white transition-all duration-200 focus:outline-none"
                  >
                    <span className="text-xl font-bold">{openGoals[i] ? "-" : "+"}</span>
                  </button>
                </div>
                {openGoals[i] && (
                  <div className="mt-3 text-brand-gray dark:text-brand-light text-sm">{goal.details}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
