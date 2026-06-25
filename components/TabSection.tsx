"use client";

import { useState } from "react";

type TabKey = "products" | "rates" | "tools";

interface ProductCard {
  icon: string;
  title: string;
  items: { label: string; href: string }[];
}

const products: ProductCard[] = [
  {
    icon: "fa-house-chimney",
    title: "Loans",
    items: [
      { label: "Home Loans", href: "#" },
      { label: "Pre-qualify for a home loan", href: "#" },
      { label: "Personal Loans", href: "#" },
    ],
  },
  {
    icon: "fa-piggy-bank",
    title: "Accounts",
    items: [
      { label: "Savings Accounts", href: "#" },
      { label: "Transaction Accounts", href: "#" },
      { label: "Term Deposits", href: "#" },
    ],
  },
  {
    icon: "fa-chart-line",
    title: "Investing & Super",
    items: [
      { label: "Investing", href: "#" },
      { label: "Superannuation and retirement", href: "#" },
    ],
  },
  {
    icon: "fa-briefcase",
    title: "Business",
    items: [
      { label: "All business products", href: "/business" },
      { label: "Talk to a business specialist", href: "#" },
    ],
  },
  {
    icon: "fa-user-shield",
    title: "Insurance",
    items: [
      { label: "Personal Insurance", href: "#" },
      { label: "Commercial Insurance", href: "#" },
      { label: "Life Insurance", href: "#" },
    ],
  },
];

interface RateCard {
  title: string;
  type: string;
  desc: string;
  rate: string;
  rateLabel: string;
  extra?: { label: string; value: string };
  link?: string;
}

const rates: RateCard[] = [
  {
    title: "Complete Home Loan - variable",
    type: "Home Loan",
    desc: "Get the flexibility you want, with the features and benefits you need.",
    rate: "5.44%",
    rateLabel: "p.a.",
    extra: { label: "Comparison rate:", value: "5.67% p.a." },
    link: "/home-loans-complete",
  },
  {
    title: "iStandard GroupReady Credit Card",
    type: "Credit card",
    desc: "Enjoy $0 annual fee with platinum travel perks.",
    rate: "19.99%",
    rateLabel: "p.a.",
    extra: { label: "Annual fee:", value: "$0" },
    link: "/credit-cards-ready",
  },
  {
    title: "Secured Personal Loan",
    type: "Personal Loan",
    desc: "Perfect for that new or used car you're after, or to refinance an existing car loan.",
    rate: "7.79%",
    rateLabel: "p.a.",
    extra: { label: "Comparison rate:", value: "8.51% p.a." },
  },
  {
    title: "Special Offer",
    type: "Term Deposit",
    desc: "Great rates so you can watch your money grow.",
    rate: "3.75%",
    rateLabel: "p.a.",
    extra: { label: "Minimum deposit:", value: "$5,000" },
  },
];

interface Tool {
  icon: string;
  title: string;
  href: string;
}

const tools: Tool[] = [
  { icon: "fa-clipboard-check", title: "Pre-qualify for a home loan", href: "#" },
  { icon: "fa-calculator", title: "Check your borrowing power", href: "#" },
  { icon: "fa-money-bill-trend-up", title: "Foreign exchange calculator", href: "#" },
];

const tabs: { key: TabKey; icon: string; label: string }[] = [
  { key: "products", icon: "fa-box-open", label: "Products" },
  { key: "rates", icon: "fa-percent", label: "Interest rates" },
  { key: "tools", icon: "fa-calculator", label: "Calculators & tools" },
];

export default function TabSection() {
  const [active, setActive] = useState<TabKey>("products");

  return (
    <section className="w-full bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <ul className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow hover:bg-brand-navy transition-all duration-300 ${
                      active === tab.key
                        ? "bg-brand-sun text-white"
                        : "bg-brand-navy text-white"
                    }`}
                  >
                    <i className={`fa-solid ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tab-content">
          {/* Products Tab */}
          {active === "products" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, i) => (
                  <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4">
                      <i className={`fa-solid ${product.icon} text-brand-sun text-3xl`}></i>
                      <h3 className="text-xl font-semibold text-brand-navy dark:text-brand-sun">{product.title}</h3>
                    </div>
                    <ul className="space-y-1 text-brand-gray dark:text-brand-light text-base">
                      {product.items.map((item, j) => (
                        <li key={j}>
                          <a href={item.href} className="hover:text-brand-sun transition">{item.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <a href="/finder" className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-medium shadow-lg hover:bg-brand-navy hover:scale-105 transition-all duration-300">
                  View all products and services
                </a>
              </div>
            </div>
          )}

          {/* Rates Tab */}
          {active === "rates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {rates.map((rate, i) => (
                <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start">
                  <h4 className="text-lg font-semibold text-brand-navy dark:text-brand-sun mb-2">{rate.title}</h4>
                  <div className="text-brand-gray dark:text-brand-light mb-2">{rate.type}</div>
                  <div className="text-brand-gray dark:text-brand-light mb-2">{rate.desc}</div>
                  <div className="text-brand-sun font-semibold text-2xl mb-2">
                    {rate.rate} <span className="text-base">{rate.rateLabel}</span>
                  </div>
                  {rate.extra && (
                    <div className="text-brand-gray dark:text-brand-light mb-2">
                      {rate.extra.label} <span className="font-semibold">{rate.extra.value}</span>
                    </div>
                  )}
                  {rate.link && (
                    <a href={rate.link} className="mt-4 px-4 py-2 rounded-full bg-brand-sun text-white font-medium shadow hover:bg-brand-navy transition-all duration-300">
                      Learn more
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tools Tab */}
          {active === "tools" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, i) => (
                <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <i className={`fa-solid ${tool.icon} text-brand-sun text-3xl`}></i>
                    <h3 className="text-xl font-semibold text-brand-navy dark:text-brand-sun">{tool.title}</h3>
                  </div>
                  <a href={tool.href} className="mt-2 px-4 py-2 rounded-full bg-brand-sun text-white font-medium shadow hover:bg-brand-navy transition-all duration-300">
                    Start now
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
