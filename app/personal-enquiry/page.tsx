"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";

export default function PersonalEnquiryPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    postcode: "", contactMethod: "Phone", helpWith: "Select option"
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.postcode) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((res) => setTimeout(res, 1200));
      setToast({ message: "Your enquiry has been submitted!", type: "success" });
      setFormData({ firstName: "", lastName: "", phone: "", email: "", postcode: "", contactMethod: "Phone", helpWith: "Select option" });
    } catch {
      setToast({ message: "Failed to submit. Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center font-sans text-sm">
        <div className="animate-pulse text-brand-navy dark:text-brand-sun text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans text-sm">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold text-sm transition-all duration-300"
          style={{ backgroundColor: toast.type === "success" ? "#16a34a" : toast.type === "error" ? "#dc2626" : "#2563eb" }}
        >
          {toast.message}
        </div>
      )}

      <main id="mainContent" className="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        {/* Header Banner */}
        <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div className="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop')" }}></div>
          <div className="absolute inset-0 z-0 md:hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-black/60 dark:bg-brand-navy/40"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Home Loan Enquiry</h1>
              <p className="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">Whether you are looking to buy or refinance, we will be able to assist you in your home buying journey.</p>
            </div>
          </div>
        </section>
        {/* Breadcrumbs */}
        <nav className="bg-brand-sun/10 py-3 px-4 text-sm" aria-label="Breadcrumb">
          <ol className="max-w-4xl mx-auto flex flex-wrap gap-2 text-brand-navy dark:text-brand-sun">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li>/</li>
            <li><Link href="/personal" className="hover:underline">Personal banking</Link></li>
            <li>/</li>
            <li className="font-semibold">Home loan enquiry</li>
          </ol>
        </nav>
        {/* Enquiry Form */}
        <section className="py-10">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Home loan enquiry</h2>
            <aside className="mb-6 text-brand-gray dark:text-brand-light text-sm">For your security, we do not provide information of a personal or account-specific nature by email.</aside>
            <form onSubmit={handleSubmit} id="personalEnquiryForm" className="space-y-4 bg-white dark:bg-brand-dark rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" htmlFor="firstName">First name</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun"
                    type="text" id="firstName" name="firstName" required placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="lastName">Last name</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun"
                    type="text" id="lastName" name="lastName" required placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" htmlFor="phone">Phone number</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun"
                    type="tel" id="phone" name="phone" required placeholder="Example: 0400 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="email">Email address</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun"
                    type="email" id="email" name="email" required placeholder="Example: you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Preferred contact method</label>
                <div className="flex gap-6 mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio" name="contactMethod" value="Phone" className="form-radio text-brand-sun"
                      checked={formData.contactMethod === "Phone"}
                      onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                    />
                    <span className="ml-2">Phone</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio" name="contactMethod" value="Email" className="form-radio text-brand-sun"
                      checked={formData.contactMethod === "Email"}
                      onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                    />
                    <span className="ml-2">Email</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" htmlFor="postcode">Postcode</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun"
                    type="text" id="postcode" name="postcode" required placeholder="Example: 3550" maxLength={4}
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" htmlFor="helpWith">What can we help you with?</label>
                  <select
                    id="helpWith" name="helpWith"
                    className="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun"
                    value={formData.helpWith}
                    onChange={(e) => setFormData({ ...formData, helpWith: e.target.value })}
                  >
                    <option value="Select option" disabled>Select option</option>
                    <option value="I have found my dream home, all I need is a loan">I have found my dream home, all I need is a loan</option>
                    <option value="I want to switch my loan over to Horizon Ridge Credit Union">I want to switch my loan over to Horizon Ridge Credit Union</option>
                    <option value="I am actively house hunting">I am actively house hunting</option>
                    <option value="I would like to review my current loan and offset account">I would like to review my current loan and offset account</option>
                    <option value="I am just starting out and need some advice">I am just starting out and need some advice</option>
                  </select>
                </div>
              </div>
              <div className="text-xs text-brand-gray dark:text-brand-light mt-2">
                We collect your personal information in order to respond to your enquiry and contact you; your personal information may be shared within the Group. This includes subsidiaries, related companies, agencies and franchises. To request access to your personal information, please contact your <Link href="/locate" className="text-brand-sun hover:underline">nearest branch</Link> or <a href="mailto:contact@horizonridge.cc" className="text-brand-sun hover:underline">contact@horizonridge.cc</a>. For more information, please read our <Link href="/privacy" className="text-brand-sun hover:underline">Privacy Policy</Link>.
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 px-6 py-2 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
