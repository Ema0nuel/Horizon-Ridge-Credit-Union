"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    try {
      const redirectUrl =
        (typeof window !== "undefined" ? window.location.origin : "https://www.horizonridge.cc") +
        "/reset-password";
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (supabaseError) {
        const isRateLimited =
          supabaseError?.status === 429 ||
          /too many requests/i.test(supabaseError.message || "");
        setError(
          isRateLimited
            ? "Too many requests. Please wait a minute and try again."
            : supabaseError.message || "Failed to send reset instructions."
        );
        if (!isRateLimited) setCooldown(10);
      } else {
        setSent(true);
      }
    } catch {
      setError("Unexpected error. Try again later.");
      setCooldown(10);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || submitting) return;
    setError("");
    setSubmitting(true);
    setCooldown(60);
    const supabase = createClient();
    try {
      const redirectUrl =
        (typeof window !== "undefined" ? window.location.origin : "https://www.horizonridge.cc") +
        "/reset-password";
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (supabaseError) {
        setError(supabaseError.message || "Failed to resend.");
        setCooldown(10);
      }
    } catch {
      setError("Unexpected error.");
      setCooldown(10);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/images/logo-nobg.png"
                alt="Horizon Ridge"
                width={64}
                height={64}
                className="h-16 w-auto block dark:hidden"
              />
              <Image
                src="/images/logo.jpg"
                alt="Horizon Ridge"
                width={64}
                height={64}
                className="h-16 w-auto hidden dark:block"
              />
            </Link>
          </div>
          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <i className="fa-regular fa-circle-check text-2xl text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-brand-navy dark:text-brand-light mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-brand-gray dark:text-gray-400 mb-6">
              Password reset instructions were sent to <strong className="text-brand-navy dark:text-brand-light">{email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <p className="text-xs text-brand-gray dark:text-gray-400 mb-6">
              Did not receive the email? Check your spam folder or{" "}
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || submitting}
                className="text-brand-sun hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "resend"}
              </button>
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo-nobg.png"
              alt="Horizon Ridge"
              width={64}
              height={64}
              className="h-16 w-auto block dark:hidden"
            />
            <Image
              src="/images/logo.jpg"
              alt="Horizon Ridge"
              width={64}
              height={64}
              className="h-16 w-auto hidden dark:block"
            />
          </Link>
        </div>

        <div className="bg-white dark:bg-brand-dark rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 p-8">
          <h1 className="text-xl font-semibold text-brand-navy dark:text-brand-light text-center mb-1">
            Forgot Password
          </h1>
          <p className="text-sm text-brand-gray dark:text-gray-400 text-center mb-6">
            Enter your email and we will send you reset instructions.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={!isValidEmail || submitting || cooldown > 0}
              className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                  Sending...
                </span>
              ) : cooldown > 0 ? (
                `Please wait ${cooldown}s`
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Instructions
                  <i className="fa-regular fa-paper-plane text-sm" />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-sm text-brand-gray dark:text-gray-400 text-center mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-brand-sun font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
