"use client";

import Link from "next/link";

const featureTiles = [
  {
    title: "Keeping your identity safe",
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    details: "Identity theft is a type of fraud that involves stealing money or gaining other benefits by pretending to be someone else. Learn how you can protect yourself.",
    link: "/security",
    linkText: "Learn more about identity theft"
  },
  {
    title: "Protecting your business",
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    details: "Businesses can also be targeted by criminals. It is important business owners implement appropriate risk management practices and systems to adequately protect themselves and their customers.",
    link: "/security",
    linkText: "Learn more about business security"
  },
  {
    title: "How to spot a scam",
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    details: "Learn about the scams that could impact you, then understand how to protect yourself.",
    link: "/security",
    linkText: "Learn more about scams"
  }
];

const highlightTiles = [
  {
    title: "General",
    icon: "fa-solid fa-shield",
    details: [
      "Keep your computer up to date by installing the latest security software and patches for your operating system",
      "Ensure you have installed anti-virus/spyware software along with a firewall and keep them up to date",
      "Make sure you have a current backup of your important personal information and files",
      "Delete spam emails and do not open email attachments or click on links in emails from strangers",
      "Do not respond to an unsolicited email asking you for personal information or financial details",
      "Be aware of email, internet and telephone hoaxes and scams. If something appears too good to be true, it almost certainly is",
      "If possible avoid using shared computers, such as those at internet cafes, hotels and airports"
    ]
  },
  {
    title: "Phone",
    icon: "fa-solid fa-phone",
    details: [
      "Criminals use phones as the number one delivery method for scams",
      "Never allow anyone to access your computer or device remotely",
      "Never provide your 6-digit code from a security token to anyone over the phone",
      "Do not respond to unsolicited calls, SMS or email asking you for personal information or financial details",
      "Delete spam emails and do not open SMS or email attachments or click on links in SMS or emails from strangers",
      "Be aware of email, internet and telephone hoaxes and scams. If something appears too good to be true, it almost certainly is"
    ]
  },
  {
    title: "Online",
    icon: "fa-solid fa-globe",
    details: [
      "Do not open suspicious texts, pop up windows or click on links or attachments in unsolicited emails. Delete them",
      "Do not enter or provide your card number to unsolicited sites or callers",
      "Do not respond to phone calls about your computer asking for remote access. Hang up",
      "Keep your personal details secure",
      "Choose your passwords carefully",
      "Review your privacy and security settings on social media",
      "Beware of any requests for your personal details or money",
      "If you think you have been a victim of a scam, let us know as soon as possible by calling us or attending your nearest branch"
    ]
  },
  {
    title: "Protecting your children",
    icon: "fa-solid fa-people-group",
    details: [
      "Increasingly, children are being targeted online and can be vulnerable to aggressive behaviour and criminal activity.",
      "Children are soft targets. They use the internet regularly and interact via social media, but they are often too inexperienced to recognise when they are being deceived.",
      "Education is the best way to help protect your children."
    ]
  },
  {
    title: "Cheque fraud",
    icon: "fa-solid fa-money-check-dollar",
    details: [
      "Not many people use cheques these days, but cheque fraud is still prevalent.",
      "Consider the following tips to help reduce cheque fraud:",
      "Keep your chequebook in a safe and secure place",
      "Never pre-sign cheques",
      "When mailing cheques, cross the cheque Not Negotiable and send it in a plain envelope without a window",
      "Use a pen or felt tip pen to write on your cheques, never pencil",
      "Bank Cheques should not be considered as good as cash",
      "Do not accept cheques in excess of the agreed price where you are asked to transfer or deposit the balance to a specific account"
    ]
  }
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div
          className="absolute inset-0 z-0 bg-cover bg-right"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Security
            </h1>
            <p className="text-white text-lg">
              Horizon Ridge Credit Union<br />
              <a href="mailto:contact@horizonridge.cc" className="underline">contact@horizonridge.cc</a> &nbsp;|&nbsp; <a href="tel:+15022095647" className="underline">+1 502 209 5647</a>
            </p>
            <div className="mt-4">
              <Link
                href="/security"
                className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy transition-all duration-300"
              >
                View the latest scam alerts
              </Link>
            </div>
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
              <li className="text-gray-500 dark:text-gray-400">Security</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Feature Tiles */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">Ways to stay safe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureTiles.map((tile, i) => (
              <div
                key={i}
                className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-all duration-300 group h-full"
              >
                <div className="rounded-lg overflow-hidden mb-4 flex justify-center">
                  <img
                    src={tile.img}
                    alt={tile.title}
                    className="w-full h-32 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">{tile.title}</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{tile.details}</p>
                <Link
                  href={tile.link}
                  className="text-brand-sun hover:text-brand-navy transition text-sm font-semibold mt-auto"
                >
                  {tile.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protecting yourself and your family */}
      <section className="pt-8 pb-6 bg-white dark:bg-brand-dark/90">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">
              Protecting yourself and your family
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Protecting yourself and your family from scams and identity theft can save you a lot of inconvenience,
              disruption and money. We have compiled a list of tips to help you protect yourself.
            </p>
          </div>
          <div className="flex-1 flex justify-center md:justify-end" />
        </div>
      </section>

      {/* Highlight Tiles */}
      <section className="py-10 bg-brand-sun/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlightTiles.map((tile, i) => (
              <div
                key={i}
                className="rounded-xl shadow-sm bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-all duration-300 h-full"
              >
                <div className="flex justify-center mb-4">
                  <i className={`${tile.icon} text-5xl text-brand-sun`} />
                </div>
                <h3 className="font-bold text-lg text-brand-navy dark:text-brand-sun mb-3 text-center">{tile.title}</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {tile.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-brand-sun mt-1 shrink-0">
                        <i className="fa-solid fa-circle-check text-xs" />
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Panel */}
      <section className="bg-brand-sun/10 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="text-xl font-bold text-brand-navy dark:text-brand-sun mb-4 md:mb-0">
            Think you have received a scam message?
          </h3>
          <Link
            href="/security"
            className="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300 shrink-0"
          >
            View the latest scam alerts
          </Link>
        </div>
      </section>
    </main>
  );
}
