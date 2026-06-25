"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";
import { verifyOtp, resendOtp } from "@/lib/auth";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  const accessID =
    typeof window !== "undefined"
      ? sessionStorage.getItem("lastAccessID") || ""
      : "";

  useEffect(() => {
    if (!accessID) {
      setError("Session not found. Please login again.");
    }
    setTimeout(() => otpRef.current?.focus(), 100);
  }, [accessID]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    if (!accessID) {
      setError("Session expired. Please login again.");
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp(accessID, otp);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || submitting) return;
    setError("");

    if (!accessID) {
      setError("Session expired. Please login again.");
      return;
    }

    setSubmitting(true);
    try {
      await resendOtp(accessID);
      setResendTimer(30);
    } catch (err: any) {
      setError(err.message || "Could not resend OTP.");
    } finally {
      setSubmitting(false);
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
          <h1 className="text-xl font-semibold text-brand-navy dark:text-brand-light text-center mb-1">
            Verify Login
          </h1>
          <p className="text-sm text-brand-gray dark:text-gray-400 text-center mb-6">
            Enter the one-time password sent to your email.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1.5">
                One-Time Password
              </label>
              <input
                ref={otpRef}
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                }}
                placeholder="000000"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-center text-2xl tracking-[0.3em] font-mono text-brand-navy dark:text-brand-light placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6 || submitting}
              className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                  Verifying...
                </span>
              ) : (
                "Log in"
              )}
            </button>

            <div className="text-center text-sm text-brand-gray dark:text-gray-400">
              {resendTimer > 0 ? (
                <span>Resend code in {resendTimer}s</span>
              ) : (
                <span>
                  Did not receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={submitting}
                    className="text-brand-sun hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                </span>
              )}
            </div>
          </form>
        </div>

        <p className="text-sm text-brand-gray dark:text-gray-400 text-center mt-6">
          <Link href="/login" className="text-brand-sun font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
