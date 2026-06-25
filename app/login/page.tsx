"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";
import { loginAndSendOtp, verifyOtp, resendOtp } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [accessID, setAccessID] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Restore OTP state from sessionStorage if pending
    const pendingAccessID = sessionStorage.getItem("hrcu_otp_pending");
    if (pendingAccessID) {
      setAccessID(pendingAccessID);
      setOtpStep(true);
      setResendTimer(30);
      setTimeout(() => otpRef.current?.focus(), 100);
      return;
    }

    // Only redirect to dashboard if no OTP pending
    const hasOtpCookie = document.cookie.includes("login_otp_pending=true");
    if (!hasOtpCookie) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) router.push("/dashboard");
      });
    }
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpStep) {
      if (!accessID || !password) {
        setError("Please enter your Access ID and password.");
        return;
      }
      setSubmittingLogin(true);
      try {
        await loginAndSendOtp(accessID, password);
        // Persist OTP state across refresh
        sessionStorage.setItem("hrcu_otp_pending", accessID);
        document.cookie = "login_otp_pending=true; path=/; max-age=600";
        setOtpStep(true);
        setResendTimer(30);
        setTimeout(() => otpRef.current?.focus(), 100);
      } catch (err: any) {
        setError(err.message || "Login failed.");
      } finally {
        setSubmittingLogin(false);
      }
    } else {
      if (otp.length !== 6) {
        setError("OTP must be 6 digits.");
        return;
      }
      setSubmittingOtp(true);
      try {
        await verifyOtp(accessID, otp);
        // Clear OTP pending state
        sessionStorage.removeItem("hrcu_otp_pending");
        document.cookie = "login_otp_pending=; path=/; max-age=0";
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Invalid OTP.");
      } finally {
        setSubmittingOtp(false);
      }
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    try {
      await resendOtp(accessID);
      setResendTimer(30);
    } catch (err: any) {
      setError(err.message || "Could not resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
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

        {/* Card */}
        <div className="bg-white dark:bg-brand-dark rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 p-8">
          <h1 className="text-xl font-medium text-brand-navy dark:text-brand-light text-center mb-1">
            {otpStep ? "Enter OTP" : "Log in"}
          </h1>
          <p className="text-sm text-brand-gray dark:text-gray-400 text-center mb-6">
            {otpStep
              ? `A code was sent to your email`
              : "Access your account securely"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {!otpStep ? (
              <>
                <div>
                  <label htmlFor="accessID" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1.5">
                    Access ID
                  </label>
                  <input
                    id="accessID"
                    type="text"
                    value={accessID}
                    onChange={(e) => setAccessID(e.target.value)}
                    placeholder="Email, username, or account number"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 pr-14 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-sun hover:text-brand-navy dark:hover:text-brand-light transition"
                    >
                      {showPwd ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-brand-gray dark:text-gray-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 dark:border-gray-600 text-brand-sun focus:ring-brand-sun"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-brand-sun hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={submittingLogin}
                  className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-medium text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingLogin ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </button>
              </>
            ) : (
              <>
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
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingOtp}
                  className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-medium text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingOtp ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                <div className="text-center text-sm text-brand-gray dark:text-gray-400">
                  {resendTimer > 0 ? (
                    <span>Resend code in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-brand-sun hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        </div>

        {/* Signup link */}
        <p className="text-sm text-brand-gray dark:text-gray-400 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-sun font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
