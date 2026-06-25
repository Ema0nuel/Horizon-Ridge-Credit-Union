"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";

interface Requirement {
  key: string;
  label: string;
  met: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Session expired. Please request a new password reset link.");
      } else {
        setSessionValid(true);
      }
      setSessionChecked(true);
    });
  }, []);

  const requirements: Requirement[] = [
    { key: "length", label: "At least 8 characters", met: password.length >= 8 },
    { key: "uppercase", label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { key: "lowercase", label: "Lowercase letter", met: /[a-z]/.test(password) },
    { key: "number", label: "Number", met: /[0-9]/.test(password) },
    { key: "special", label: "Special character (!@#$%^&*)", met: /[!@#$%^&*]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-brand-sun",
    "text-green-500",
    "text-green-600",
  ];

  const isPasswordStrong = metCount >= 3;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSubmit = isPasswordStrong && !!passwordsMatch && password.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Password is not strong enough.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session || sessionError) {
        setError("Session expired. Please request a new password reset link.");
        setSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message || "Failed to reset password.");
      } else {
        await supabase.auth.signOut();
        router.push("/login");
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3 text-brand-navy dark:text-brand-light">
          <i className="fa-solid fa-spinner fa-spin text-xl" />
          <span className="text-sm">Checking session...</span>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
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
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <i className="fa-regular fa-circle-xmark text-2xl text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-brand-navy dark:text-brand-light mb-2">
              Link Expired
            </h1>
            <p className="text-sm text-brand-gray dark:text-gray-400 mb-6">
              This password reset link has expired. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200"
            >
              Request New Link
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
            Reset Password
          </h1>
          <p className="text-sm text-brand-gray dark:text-gray-400 text-center mb-6">
            Create a new secure password for your account.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1.5">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                autoComplete="new-password"
              />
              {password && (
                <p className={`text-sm font-medium mt-1 ${strengthColors[metCount]}`}>
                  {strengthText[metCount]}
                </p>
              )}
            </div>

            {password && (
              <div className="text-xs space-y-1 text-brand-gray dark:text-brand-light">
                {requirements.map((r) => (
                  <div key={r.key} className={r.met ? "text-green-600" : "text-red-600"}>
                    <i className={`fa-solid fa-${r.met ? "check" : "times"} mr-1`} />
                    {r.label}
                  </div>
                ))}
              </div>
            )}

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-brand-navy dark:text-brand-light mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Confirm your password"
                className={`block w-full rounded-lg border bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
                autoComplete="new-password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                  Updating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Reset Password
                  <i className="fa-regular fa-key text-sm" />
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
