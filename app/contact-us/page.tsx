"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

const contactMethods = [
  {
    icon: "fa-phone",
    title: "Phone",
    details: ["1-800-555-0199", "Mon-Fri 8am-8pm", "Sat 9am-5pm EST"],
  },
  {
    icon: "fa-envelope",
    title: "Email",
    details: ["support@horizonridge.cc", "We respond within 24 hours"],
  },
  {
    icon: "fa-location-dot",
    title: "Visit us",
    details: ["123 Main Street", "Denver, CO 80202", "United States"],
  },
];

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "contact@horizonridge.cc",
          subject: `[Website Contact] ${subject}`,
          html: `
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b><br>${message}</p>
          `,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Could not send message. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light font-sans">
      {/* Hero */}
      <section className="relative w-full min-h-[300px] md:min-h-[400px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=500&fit=crop')" }} />
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Contact us
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto">
            We are here to help. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm" aria-label="Breadcrumb">
            <ol className="flex space-x-2 text-brand-gray dark:text-gray-400">
              <li><Link href="/" className="hover:text-brand-sun">Home</Link></li>
              <li>/</li>
              <li className="text-brand-navy dark:text-brand-sun font-medium">Contact us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Contact methods + Form */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact methods */}
            <div className="lg:col-span-1 space-y-6">
              {contactMethods.map((method, i) => (
                <div key={i} className="flex items-start gap-4 bg-white dark:bg-brand-dark/60 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-brand-sun/10 flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${method.icon} text-brand-sun text-base`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-navy dark:text-brand-sun">{method.title}</h3>
                    {method.details.map((d, j) => (
                      <p key={j} className="text-sm text-brand-gray dark:text-gray-400">{d}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Existing members CTA */}
              <div className="rounded-xl bg-brand-sun/10 dark:bg-brand-dark/60 border border-brand-sun/20 p-5">
                <h3 className="font-semibold text-brand-navy dark:text-brand-sun mb-2">Existing member?</h3>
                <p className="text-sm text-brand-gray dark:text-gray-400 mb-4">
                  Log in to your account for priority support and direct messaging.
                </p>
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 rounded-full bg-brand-sun text-white text-sm font-medium hover:bg-brand-navy transition"
                >
                  Log in
                </Link>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-brand-dark/60 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <h2 className="text-xl font-semibold text-brand-navy dark:text-brand-sun mb-2">
                  Send us a message
                </h2>
                <p className="text-sm text-brand-gray dark:text-gray-400 mb-6">
                  Fill in the form below and we will get back to you as soon as possible.
                </p>

                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-check text-green-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-brand-navy dark:text-brand-sun mb-2">Message sent</h3>
                    <p className="text-sm text-brand-gray dark:text-gray-400 mb-6">
                      Thank you. We will respond within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                      className="px-4 py-2 rounded-full bg-brand-sun text-white text-sm font-medium hover:bg-brand-navy transition"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="c-name" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1">
                          Your name
                        </label>
                        <input
                          id="c-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="c-email" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1">
                          Email address
                        </label>
                        <input
                          id="c-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="c-subject" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1">
                        Subject
                      </label>
                      <input
                        id="c-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="How can we help?"
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="c-message" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1">
                        Message
                      </label>
                      <textarea
                        id="c-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message..."
                        rows={5}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                        <i className="fa-solid fa-circle-exclamation mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={sending}
                        className="px-6 py-2.5 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <span className="flex items-center gap-2">
                            <i className="fa-solid fa-spinner fa-spin" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <i className="fa-solid fa-paper-plane" />
                            Send message
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
