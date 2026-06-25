import HeroCarousel from "../components/HeroCarousel";
import TabSection from "../components/TabSection";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horizon Ridge Credit Union - Secure Online Banking & Financial Services",
  description:
    "Horizon Ridge Credit Union offers personal and business banking, home loans, credit cards, and savings accounts. Secure online banking with competitive rates and trusted service for over 1.9 million members.",
  keywords: [
    "credit union",
    "online banking",
    "Colorado credit union",
    "home loans",
    "personal banking",
    "business banking",
    "savings accounts",
    "mortgage",
    "refinance",
    "Horizon Ridge",
  ],
  openGraph: {
    title: "Horizon Ridge Credit Union - Secure, Trusted Online Banking",
    description:
      "Join over 1.9 million members benefiting from competitive rates, trusted service, and complete banking solutions.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Horizon Ridge Credit Union - Online Banking",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans text-sm">
      <HeroCarousel />

      {/* Banner Carousel (secondary hero) */}
      <section className="relative w-full overflow-hidden">
        <div className="w-full h-[350px] md:h-[500px] flex items-center justify-center bg-gradient-to-r from-brand-sun/80 to-brand-navy/80">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                A better home loan experience starts here.
              </h2>
              <p className="text-lg md:text-xl text-white mb-6">
                Join the 1.9 million USA already benefiting from our competitive rates and trusted services.
              </p>
              <Link
                href="/switch"
                className="inline-block px-6 py-3 rounded-full bg-white text-brand-navy font-medium shadow-lg hover:bg-brand-sun hover:text-white transition-all duration-300"
              >
                Switch today
              </Link>
            </div>
            <div className="flex-1 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop"
                alt="Family standing in front of their new home, representing home loan success"
                className="rounded-2xl shadow-xl w-full h-64 object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proposition Banner */}
      <section className="bg-brand-sun/10 py-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow">
              <i className="fa-solid fa-circle-check text-brand-sun text-2xl"></i>
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-medium">
              One of the United States biggest banks
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow">
              <i className="fa-solid fa-shield-halved text-brand-sun text-2xl"></i>
            </span>
            <span className="text-brand-navy dark:text-brand-sun text-lg font-medium">
              One of the United States most trusted brands
            </span>
          </div>
        </div>
      </section>

      <TabSection />

      {/* Product Highlight Image */}
      <section className="w-full bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 hidden md:block">
            <div className="rounded-2xl shadow-xl overflow-hidden border-4 border-brand-sun bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop"
                alt="Express Home Loan: Fast and flexible mortgage solutions from Horizon Ridge Credit Union"
                className="w-full h-64 md:h-96 object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-brand-sun/10 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-navy dark:text-brand-sun mb-8 text-center">
            What our members say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "https://randomuser.me/api/portraits/men/32.jpg",
                quote: "Switching to Horizon Ridge was the best decision for my family. The process was smooth and the rates are unbeatable.",
                name: "James R.",
              },
              {
                img: "https://randomuser.me/api/portraits/women/44.jpg",
                quote: "I love the online tools and how easy it is to manage my accounts. The support team is always helpful.",
                name: "Maria S.",
              },
              {
                img: "https://randomuser.me/api/portraits/men/65.jpg",
                quote: "Great experience refinancing my home. The team explained everything and I saved a lot!",
                name: "David L.",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                <img src={t.img} alt={`${t.name} - Horizon Ridge Credit Union member`} className="w-16 h-16 rounded-full mb-4 shadow" loading="lazy" />
                <p className="text-brand-gray dark:text-brand-light mb-3">{t.quote}</p>
                <span className="font-medium text-brand-navy dark:text-brand-sun">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-navy dark:text-brand-sun mb-8 text-center">
            Latest from our blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
                title: "5 Tips for First-Time Home Buyers",
                desc: "Buying your first home? Here are five essential tips to help you get started and avoid common mistakes.",
                date: "July 2025",
              },
              {
                img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=400&fit=crop",
                title: "How to Refinance and Save",
                desc: "Refinancing your home loan can save you thousands. Learn how to get the best deal and what to watch for.",
                date: "June 2025",
              },
              {
                img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&h=400&fit=crop",
                title: "Understanding Your Credit Score",
                desc: "Your credit score impacts your loan options. Discover how to improve your score and secure better rates.",
                date: "May 2025",
              },
            ].map((post, i) => (
              <div key={i} className="rounded-xl shadow-lg bg-white dark:bg-brand-dark p-6 flex flex-col">
                <img src={post.img} alt={post.title} className="rounded-lg mb-4 h-40 object-cover object-center" loading="lazy" />
                <h3 className="font-semibold text-lg text-brand-navy dark:text-brand-sun mb-2">{post.title}</h3>
                <p className="text-brand-gray dark:text-brand-light mb-4">{post.desc}</p>
                <span className="text-sm text-brand-sun font-medium">{post.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
