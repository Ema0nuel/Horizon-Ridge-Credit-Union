"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Loan {
  id: string;
  user_id: string;
  amount: number;
  interest_rate?: number;
  status: string;
  reason?: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Account {
  id: string;
  user_id: string;
  balance: number;
}

export default function AdminLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailLoan, setDetailLoan] = useState<Loan | null>(null);
  const [rejectLoan, setRejectLoan] = useState<Loan | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }

    (async () => {
      const [lRes, uRes, aRes] = await Promise.all([
        supabase.from("loan").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("profiles").select("id,full_name,email"),
        supabase.from("accounts").select("*"),
      ]);
      if (lRes.data) setLoans(lRes.data);
      if (uRes.data) setUsers(uRes.data);
      if (aRes.data) setAccounts(aRes.data);
      setLoading(false);
    })();
  }, []);

  const formatDate = (dt: string) => {
    if (!dt) return "";
    const d = new Date(dt);
    return (
      d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const getUser = (userId: string) => users.find((u) => u.id === userId);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      disbursed: "bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-brand-light",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          map[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredLoans = loans.filter((l) => {
    const user = getUser(l.user_id);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (user?.full_name || "").toLowerCase().includes(q) ||
      (user?.email || "").toLowerCase().includes(q) ||
      String(l.amount).includes(q) ||
      (l.status || "").toLowerCase().includes(q);
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = async (loan: Loan) => {
    const rate = window.prompt("Enter interest rate (%)", "5");
    if (!rate || isNaN(Number(rate))) {
      setMessage({ type: "error", text: "Interest rate required" });
      return;
    }
    setActionLoading(loan.id);
    try {
      await supabase
        .from("loan")
        .update({ status: "approved", interest_rate: parseFloat(rate) })
        .eq("id", loan.id);
      const user = getUser(loan.user_id);
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          subject: "Loan Approved",
          html: `<p>Dear ${user?.full_name},<br>Your loan request has been approved. Amount: <b>${formatCurrency(loan.amount)}</b>, Interest: <b>${rate}%</b>.</p>`,
        }),
      });
      setMessage({ type: "success", text: "Loan approved and user notified" });
      window.location.reload();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisburse = async (loan: Loan) => {
    setActionLoading(loan.id);
    try {
      const userAcc = accounts.find((a) => a.user_id === loan.user_id);
      if (!userAcc) {
        setMessage({ type: "error", text: "No account found for user" });
        return;
      }
      const newBalance = parseFloat(String(userAcc.balance)) + parseFloat(String(loan.amount));
      await supabase.from("accounts").update({ balance: newBalance }).eq("id", userAcc.id);
      await supabase.from("loan").update({ status: "disbursed" }).eq("id", loan.id);
      await supabase.from("transactions").insert([
        {
          user_id: loan.user_id,
          account_id: userAcc.id,
          type: "loan_disbursement",
          amount: loan.amount,
          description: "Loan disbursed",
          balance_before: userAcc.balance,
          balance_after: newBalance,
          status: "completed",
        },
      ]);
      const user = getUser(loan.user_id);
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          subject: "Loan Disbursed",
          html: `<p>Dear ${user?.full_name},<br>Your loan of <b>${formatCurrency(loan.amount)}</b> has been disbursed to your account.</p>`,
        }),
      });
      setMessage({ type: "success", text: "Loan disbursed, transaction logged, user notified" });
      window.location.reload();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rejectLoan) return;
    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    if (!reason) {
      setMessage({ type: "error", text: "Reason required" });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("loan").update({ status: "rejected", reason }).eq("id", rejectLoan.id);
      const user = getUser(rejectLoan.user_id);
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          subject: "Loan Request Rejected",
          html: `<p>Dear ${user?.full_name},<br>Your loan request was rejected. Reason: <b>${reason}</b></p>`,
        }),
      });
      setMessage({ type: "success", text: "Loan rejected and user notified" });
      setRejectLoan(null);
      window.location.reload();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const exportCSV = () => {
    const header = ["Date", "User", "Amount", "Interest", "Status"];
    const rows = filteredLoans.map((l) =>
      [formatDate(l.created_at), getUser(l.user_id)?.full_name || "", l.amount, l.interest_rate || "", l.status].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loans.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-navy dark:hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Loans</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Loan Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage all loan requests and disbursements
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by user, amount, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition w-full md:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="disbursed">Disbursed</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={exportCSV} className="ml-auto bg-brand-navy hover:bg-brand-navy/90 text-white px-3 py-2 rounded-xl text-sm transition-colors">
          <i className="fa-regular fa-file-export mr-1" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {filteredLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Interest</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((l) => {
                  const user = getUser(l.user_id);
                  return (
                    <tr key={l.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(l.created_at)}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium text-gray-900 dark:text-white">{user?.full_name || "Unknown"}</span>
                        <div className="text-[10px] text-gray-400">{user?.email || ""}</div>
                      </td>
                      <td className="py-2.5 px-2 text-gray-900 dark:text-white font-medium">{formatCurrency(l.amount)}</td>
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400">{l.interest_rate ? l.interest_rate + "%" : "-"}</td>
                      <td className="py-2.5 px-2">{statusBadge(l.status)}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex gap-1 flex-wrap">
                          <button onClick={() => setDetailLoan(l)} className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-lg text-[10px] transition-colors"><i className="fa-regular fa-eye mr-0.5" /> View</button>
                          {l.status === "pending" && (
                            <>
                              <button onClick={() => handleApprove(l)} disabled={actionLoading === l.id} className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors">{actionLoading === l.id ? <i className="fa-solid fa-spinner fa-spin mr-0.5" /> : <i className="fa-regular fa-check mr-0.5" />} {actionLoading === l.id ? "Processing..." : "Approve"}</button>
                              <button onClick={() => setRejectLoan(l)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-[10px] transition-colors"><i className="fa-regular fa-xmark mr-0.5" /> Reject</button>
                            </>
                          )}
                          {l.status === "approved" && (
                            <button onClick={() => handleDisburse(l)} disabled={actionLoading === l.id} className="bg-brand-navy hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors">{actionLoading === l.id ? <i className="fa-solid fa-spinner fa-spin mr-0.5" /> : <i className="fa-regular fa-hand-holding-dollar mr-0.5" />} {actionLoading === l.id ? "Processing..." : "Disburse"}</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            {search || statusFilter ? "No loans match your filters" : "No loan requests found"}
          </p>
        )}
      </div>

      {/* Detail Modal */}
      {detailLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setDetailLoan(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Loan Details</h2>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-500 dark:text-gray-400">User:</span> <span className="text-gray-900 dark:text-white ml-2">{getUser(detailLoan.user_id)?.full_name || "Unknown"} ({getUser(detailLoan.user_id)?.email || ""})</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Amount:</span> <span className="text-gray-900 dark:text-white ml-2">{formatCurrency(detailLoan.amount)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Interest:</span> <span className="text-gray-900 dark:text-white ml-2">{detailLoan.interest_rate ? detailLoan.interest_rate + "%" : "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Status:</span> <span className="ml-2">{statusBadge(detailLoan.status)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Created:</span> <span className="text-gray-900 dark:text-white ml-2">{formatDate(detailLoan.created_at)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setRejectLoan(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Loan Request</h2>
            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                <textarea name="reason" rows={3} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setRejectLoan(null)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm transition-colors">{submitting ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-xmark mr-1" />}{submitting ? "Processing..." : "Reject"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
