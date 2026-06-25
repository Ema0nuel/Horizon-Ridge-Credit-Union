"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { localAdminLogin } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      if (localAdminLogin(email, password)) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid admin credentials.");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-navy dark:bg-brand-dark">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4"
      >
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo-nobg.png"
            alt="Horizon Ridge"
            width={56}
            height={56}
            className="h-14 w-auto block dark:hidden mb-2"
          />
          <Image
            src="/images/logo.jpg"
            alt="Horizon Ridge"
            width={56}
            height={56}
            className="h-14 w-auto hidden dark:block mb-2"
          />
          <span className="text-sm font-medium text-brand-navy dark:text-brand-light">
            Horizon Ridge Credit Union
          </span>
        </div>

        <h2 className="text-xl font-semibold text-center text-brand-navy dark:text-brand-light mb-6">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-brand-sun text-white font-medium text-sm shadow-md hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner fa-spin" />
                Verifying...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link href="/login" className="text-xs text-brand-sun hover:underline">
            Back to user login
          </Link>
        </div>
      </form>
    </div>
  );
}
