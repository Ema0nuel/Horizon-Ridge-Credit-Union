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

const fmt = (v: number | string | undefined | null) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    : v || "$0.00";

const fmtDate = (date: string | undefined | null) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
};

function randomInterest() { return (Math.random() * 4 + 6).toFixed(2); }

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

  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanDuration, setLoanDuration] = useState("6");
  const [submitting, setSubmitting] = useState(false);

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
        if (!user) { router.push("/login"); return; }

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

    if (!amount || amount < 100) { showToast("Enter a valid loan amount (min $100).", "error"); return; }
    if (!reason) { showToast("Enter a purpose for the loan.", "error"); return; }
    if (!duration) { showToast("Select a loan duration.", "error"); return; }

    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async () => {
    if (!loanPassword.trim()) { setPasswordError("Password is required."); return; }
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

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || "", password: loanPassword,
      });

      if (signInError) {
        setPasswordError("Incorrect password. Try again.");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("loan").insert([{
        user_id: user.id, amount, interest_rate: interestRate, status: "pending",
        purpose: reason, duration_months: duration, due_date: dueDate, repaid_amount: 0,
      }]);
      if (error) throw error;

      await supabase.from("notifications").insert([{
        user_id: user.id, title: "Loan Request Submitted",
        message: `Your loan request of ${fmt(amount)} has been submitted for review.`,
      }]);

      showToast("Loan request submitted successfully!", "success");
      setShowPasswordModal(false);
      setLoanPassword("");
      setLoanAmount("");
      setLoanPurpose("");
      setLoanDuration("6");

      const { data: loansRes } = await supabase.from("loan").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setLoans(loansRes || []);
    } catch (err: any) {
      showToast("Loan request failed: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Approved</span>;
      case "pending": return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>;
      case "rejected": return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
      default: return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-brand-light">{status}</span>;
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2" />
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
            <i className="fa fa-exclamation-triangle text-3xl text-red-500 mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy">Retry</button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {/* ===== DESKTOP LAYOUT (md+) ===== */}
      <div className="hidden md:block font-sans min-h-screen">
        <div className="max-w-5xl mx-auto py-6 px-4">
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500" />
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Loan</span>
          </nav>

          {toast && (
            <div className={`fixed top-4 right-4 z-50 max-sm:left-4 max-sm:text-center px-4 py-2 rounded-lg shadow-lg text-sm ${
              toast.type === "success" ? "bg-green-500 text-white" :
              toast.type === "error" ? "bg-red-500 text-white" :
              "bg-brand-sun text-white"
            }`}>
              {toast.message}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-navy dark:text-white">Loan Services</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Apply for a new loan or check the status of existing requests.</p>
          </div>

          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              <i className="fa fa-landmark mr-1" /> Apply for a Loan
            </h3>
            <form id="loan-request-form" onSubmit={handleLoanSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Loan Amount (USD)</label>
                  <input type="number" min="100" step="0.01" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="1000.00"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Purpose</label>
                  <input type="text" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="Business, Education, etc."
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Repayment Term (Months)</label>
                  <select value={loanDuration} onChange={(e) => setLoanDuration(e.target.value)}
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
                <button type="submit" disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <><i className="fa fa-spinner fa-spin mr-1" /> Processing...</> : <><i className="fa fa-paper-plane mr-1" /> Submit Application</>}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200"><i className="fa fa-history mr-1" /> Loan History</h3>
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
                        <td className="px-3 py-2">{getStatusBadge(l.status)}</td>
                        <td className="px-3 py-2 max-w-[120px] truncate">{l.purpose || "-"}</td>
                        <td className="px-3 py-2">{fmtDate(l.created_at)}</td>
                        <td className="px-3 py-2">{fmtDate(l.due_date)}</td>
                        <td className="px-3 py-2">{fmt(l.repaid_amount || 0)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <i className="fa fa-landmark text-2xl mb-2 block" /> No loan requests yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 py-4">
            <p><strong>Copyright &copy; {new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.</p>
          </footer>
        </div>

        {/* Desktop password modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
              <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg"
                onClick={() => { setShowPasswordModal(false); setLoanPassword(""); setPasswordError(""); }}
              >&times;</button>
              <h4 className="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i className="fa fa-lock mr-1" /> Password Verification</h4>
              <div className="mb-3 text-xs text-gray-500 dark:text-gray-300">Enter your password to confirm the loan request.</div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">Password</label>
                  <input type="password" value={loanPassword} onChange={(e) => { setLoanPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Enter your account password"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" autoFocus
                  />
                  {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
                    onClick={() => { setShowPasswordModal(false); setLoanPassword(""); setPasswordError(""); }}
                  >Cancel</button>
                  <button type="button" onClick={handlePasswordConfirm} disabled={submitting}
                    className="px-4 py-1 rounded bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? <><i className="fa fa-spinner fa-spin mr-1" /> Processing...</> : <><i className="fa fa-check" /> Confirm</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MOBILE LAYOUT (below md) ===== */}
      <div className="md:hidden px-4 py-4 max-w-3xl mx-auto">
        {toast && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            toast.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800" :
            toast.type === "error" ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800" :
            "bg-brand-navy/5 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-light border border-brand-navy/20"
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === "success" && <i className="fa-solid fa-circle-check text-green-500" />}
              {toast.type === "error" && <i className="fa-solid fa-circle-exclamation text-red-500" />}
              {toast.type === "info" && <i className="fa-solid fa-circle-info text-brand-sun" />}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Services</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Apply for a loan or check existing requests</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-1.5">
            <i className="fa-solid fa-landmark text-brand-sun" /> Apply for a Loan
          </h3>
          <form onSubmit={handleLoanSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Loan Amount (USD)</label>
              <input type="number" min="100" step="0.01" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="1000.00" required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Purpose</label>
              <input type="text" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)}
                placeholder="Business, Education, etc." required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Repayment Term</label>
              <select value={loanDuration} onChange={(e) => setLoanDuration(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
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
            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {submitting ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Processing...</> : <><i className="fa-solid fa-paper-plane mr-1" /> Submit Application</>}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5"><i className="fa-solid fa-clock-rotate text-gray-400" /> Loan History</h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{loans.length} loan{loans.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {loans.length > 0 ? (
              loans.map((l) => (
                <div key={l.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-navy/10 dark:bg-brand-navy/30 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-landmark text-brand-navy dark:text-brand-light text-xs" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{fmt(l.amount)}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">{l.purpose || "No purpose"}</p>
                      </div>
                    </div>
                    {getStatusBadge(l.status)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 dark:text-gray-500 ml-10">
                    <div><span className="block text-gray-500">Interest</span><span className="font-medium text-gray-700 dark:text-gray-300">{l.interest_rate}%</span></div>
                    <div><span className="block text-gray-500">Due</span><span className="font-medium text-gray-700 dark:text-gray-300">{fmtDate(l.due_date)}</span></div>
                    <div><span className="block text-gray-500">Repaid</span><span className="font-medium text-gray-700 dark:text-gray-300">{fmt(l.repaid_amount || 0)}</span></div>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 ml-10 mt-1">Applied {fmtDate(l.created_at)} &middot; {l.duration_months} months</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
                <i className="fa-solid fa-landmark text-lg mb-2 block" /> No loan requests yet
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4">
          Copyright &copy; {new Date().getFullYear()} All rights reserved | Horizon Ridge Credit Union.
        </footer>
      </div>

      {/* Mobile password bottom sheet */}
      {showPasswordModal && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowPasswordModal(false); setLoanPassword(""); setPasswordError(""); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6">
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /></div>
            <div className="px-6 pt-2 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2"><i className="fa-solid fa-lock text-brand-sun" /> Password Verification</h4>
                <button onClick={() => { setShowPasswordModal(false); setLoanPassword(""); setPasswordError(""); }} className="p-1 text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-lg" /></button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Enter your password to confirm the loan request</p>
              <div className="space-y-3">
                <div>
                  <input type="password" value={loanPassword} onChange={(e) => { setLoanPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Enter your account password" autoFocus
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  />
                  {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setShowPasswordModal(false); setLoanPassword(""); setPasswordError(""); }}
                    className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >Cancel</button>
                  <button onClick={handlePasswordConfirm} disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {submitting ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Processing...</> : <><i className="fa-solid fa-check mr-1" /> Confirm</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
