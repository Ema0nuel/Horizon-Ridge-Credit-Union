"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import DashboardShell from "@/components/DashboardShell";

interface Profile {
  full_name: string;
  email: string;
}

interface Account {
  id: string;
  balance: number;
  account_number: string;
  account_type: string;
}

interface Loan {
  id: string;
  amount: number;
  interest_rate: number;
  status: string;
  purpose: string;
  duration_months: number;
  created_at: string;
  due_date: string;
  repaid_amount: number;
}

// Helpers
const fmt = (v: number | string | undefined | null) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      })
    : v || "$0.00";

const fmtDate = (date: string | undefined | null) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
};

function randomInterest() {
  return (Math.random() * 4 + 6).toFixed(2);
}

function calcDueDate(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export default function LoanPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Loan form state
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanDuration, setLoanDuration] = useState("6");
  const [submitting, setSubmitting] = useState(false);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loanPassword, setLoanPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const [profileRes, accountRes, loansRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("accounts").select("*").eq("user_id", user.id).single(),
          supabase.from("loan").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (accountRes.error) throw accountRes.error;

        setProfile(profileRes.data);
        setAccount(accountRes.data);
        setLoans(loansRes.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    const reason = loanPurpose.trim();
    const duration = parseInt(loanDuration, 10);

    if (!amount || amount < 100) {
      showToast("Enter a valid loan amount (min $100).", "error");
      return;
    }
    if (!reason) {
      showToast("Enter a purpose for the loan.", "error");
      return;
    }
    if (!duration) {
      showToast("Select a loan duration.", "error");
      return;
    }

    // Show password modal
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async () => {
    if (!loanPassword.trim()) {
      setPasswordError("Password is required.");
      return;
    }
    setPasswordError("");
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = parseFloat(loanAmount);
      const reason = loanPurpose.trim();
      const duration = parseInt(loanDuration, 10);
      const interestRate = parseFloat(randomInterest());
      const dueDate = calcDueDate(duration);

      // Verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || "",
        password: loanPassword,
      });

      if (signInError) {
        setPasswordError("Incorrect password. Try again.");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("loan").insert([
        {
          user_id: user.id,
          amount: amount,
          interest_rate: interestRate,
          status: "pending",
          purpose: reason,
          duration_months: duration,
          due_date: dueDate,
          repaid_amount: 0,
        },
      ]);

      if (error) throw error;

      // Send notification
      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          title: "Loan Request Submitted",
          message: `Your loan request of ${fmt(amount)} has been submitted for review.`,
        },
      ]);

      showToast("Loan request submitted successfully!", "success");
      setShowPasswordModal(false);
      setLoanPassword("");
      setLoanAmount("");
      setLoanPurpose("");
      setLoanDuration("6");

      // Refresh loans list
      const { data: loansRes } = await supabase
        .from("loan")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setLoans(loansRes || []);
    } catch (err: any) {
      showToast("Loan request failed: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading loan details...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-red-50 dark:bg-red-900/20 rounded-xl p-8 shadow-sm">
            <i className="fa fa-exclamation-triangle text-3xl text-red-500 mb-2"></i>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="font-sans min-h-screen">
        <div className="max-w-5xl mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500"></i>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Loan</span>
          </nav>

          {/* Toast */}
          {toast && (
            <div
              className={`fixed top-4 right-4 z-50 max-sm:left-4 max-sm:text-center px-4 py-2 rounded-lg shadow-lg text-sm ${
                toast.type === "success"
                  ? "bg-green-500 text-white"
                  : toast.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-brand-sun text-white"
              }`}
            >
              {toast.message}
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-navy dark:text-white">Loan Services</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Apply for a new loan or check the status of existing requests.
            </p>
          </div>

          {/* Loan Application Form */}
          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              <i className="fa fa-landmark mr-1"></i> Apply for a Loan
            </h3>
            <form id="loan-request-form" onSubmit={handleLoanSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Loan Amount (USD)</label>
                  <input
                    id="loan-amount"
                    type="number"
                    min="100"
                    step="0.01"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="1000.00"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Purpose</label>
                  <input
                    id="loan-reason"
                    type="text"
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="Business, Education, etc."
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Repayment Term (Months)</label>
                  <select
                    id="loan-duration"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                    <option value="48">48 Months</option>
                    <option value="60">60 Months</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><i className="fa fa-spinner fa-spin mr-1"></i> Processing...</>
                  ) : (
                    <><i className="fa fa-paper-plane mr-1"></i> Submit Application</>
                  )}
                </button>
              </div>
            </form>
            <div id="loan-status-msg" className="mt-3 text-xs text-gray-500"></div>
          </div>

          {/* Loan History */}
          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                <i className="fa fa-history mr-1"></i> Loan History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/60">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Interest</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Purpose</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Applied</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Due</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Repaid</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.length > 0 ? (
                    loans.map((l) => (
                      <tr key={l.id} className="hover:bg-brand-navy/5 dark:hover:bg-brand-navy/20">
                        <td className="px-3 py-2 font-semibold">{fmt(l.amount)}</td>
                        <td className="px-3 py-2">{l.interest_rate}%</td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              l.status === "approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : l.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : l.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-brand-light"
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 max-w-[120px] truncate">{l.purpose || "-"}</td>
                        <td className="px-3 py-2">{fmtDate(l.created_at)}</td>
                        <td className="px-3 py-2">{fmtDate(l.due_date)}</td>
                        <td className="px-3 py-2">{fmt(l.repaid_amount || 0)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <i className="fa fa-landmark text-2xl mb-2 block"></i>
                        No loan requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 py-4">
            <p>
              <strong>Copyright &copy; {new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
            </p>
          </footer>
        </div>
      </div>

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg"
              onClick={() => {
                setShowPasswordModal(false);
                setLoanPassword("");
                setPasswordError("");
              }}
            >
              &times;
            </button>
            <h4 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
              <i className="fa fa-lock mr-1"></i> Password Verification
            </h4>
            <div className="mb-3 text-xs text-gray-500 dark:text-gray-300">
              Enter your password to confirm the loan request.
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  value={loanPassword}
                  onChange={(e) => {
                    setLoanPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter your account password"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setLoanPassword("");
                    setPasswordError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordConfirm}
                  disabled={submitting}
                  className="px-4 py-1 rounded bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><i className="fa fa-spinner fa-spin mr-1"></i> Processing...</>
                  ) : (
                    <><i className="fa fa-check"></i> Confirm</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
