"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";

export default function AuthenticationPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setError("No authenticated user found. Please login again.");
        setLoading(false);
        return;
      }

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      if (resendError) {
        setError(resendError.message || "Failed to resend verification email.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <i className="fa-regular fa-circle-check text-2xl text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-brand-navy dark:text-brand-light mb-2">
                Email Sent
              </h1>
              <p className="text-sm text-brand-gray dark:text-gray-400 mb-6">
                Verification email has been resent. Please check your inbox.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                  <i className="fa-regular fa-envelope text-2xl text-amber-600" />
                </div>
                <h1 className="text-xl font-semibold text-brand-navy dark:text-brand-light mb-2">
                  Email Verification Required
                </h1>
                <p className="text-sm text-brand-gray dark:text-gray-400">
                  We sent a verification email to your email address. Please check your inbox to complete this process.
                </p>
                <p className="text-sm text-brand-gray dark:text-gray-400 mt-1">
                  Also check your spam folder.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                  <i className="fa-solid fa-circle-exclamation mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResend} className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Resend Verification Email
                      <i className="fa-regular fa-paper-plane text-sm" />
                    </span>
                  )}
                </button>
              </form>

              <div className="border-dashed border-t border-gray-300 dark:border-brand-navy my-6" />

              <div className="flex items-center justify-center gap-2 text-sm text-brand-gray dark:text-gray-400">
                <Link href="/" className="text-brand-sun hover:underline">
                  Home
                </Link>
                <span className="text-gray-400">|</span>
                <span>
                  Already have an account?{" "}
                  <Link href="/login" className="text-brand-sun hover:underline">
                    Login
                  </Link>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
