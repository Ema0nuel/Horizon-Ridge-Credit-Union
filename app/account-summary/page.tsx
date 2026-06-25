"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import DashboardShell from "@/components/DashboardShell";

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  is_active: boolean;
  interest_rate: number;
}

interface Transaction {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  balance_before: number;
  balance_after: number;
  by?: string;
  sender_name?: string;
  recipient_name?: string;
}

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
  return date.slice(0, 16).replace("T", " ");
};

function generateReceipt(tx: Transaction, senderName: string, recipientName: string) {
  const statusColor =
    ["completed", "success", "approved"].includes(tx.status?.toLowerCase())
      ? "#16a34a"
      : ["pending", "processing"].includes(tx.status?.toLowerCase())
      ? "#f59e42"
      : "#dc2626";

  return `
    <div style="font-family:sans-serif;max-width:420px;margin:auto;background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:16px;">
        <h2 style="margin:0;font-size:18px;color:#1e3a8a;">Transaction Receipt</h2>
        <div style="font-size:11px;color:#888;">#${tx.id?.slice(0, 8).toUpperCase() || "N/A"}</div>
      </div>
      <div style="margin-bottom:16px;text-align:center;">
        <div style="font-size:24px;font-weight:bold;color:#1e3a8a;">${fmt(tx.amount)}</div>
        <div style="font-size:12px;color:#888;">${tx.description || "No description"}</div>
      </div>
      <div style="border-top:1px solid #eee;padding-top:12px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">Status:</span>
          <span style="color:${statusColor};font-weight:600;">${tx.status}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">Type:</span>
          <span>${tx.type}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">Date:</span>
          <span>${fmtDate(tx.created_at)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">From:</span>
          <span>${senderName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">To:</span>
          <span>${recipientName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">Balance Before:</span>
          <span>${fmt(tx.balance_before)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
          <span style="font-weight:600;">Balance After:</span>
          <span>${fmt(tx.balance_after)}</span>
        </div>
      </div>
      <div style="margin-top:16px;padding-top:12px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#aaa;">
        This is a Horizon-generated receipt
      </div>
    </div>
  `;
}

export default function AccountSummaryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

        const [profileRes, accountRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("accounts").select("*").eq("user_id", user.id).single(),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (accountRes.error) throw accountRes.error;

        setProfile(profileRes.data);
        setAccount(accountRes.data);

        // Fetch transactions
        const { data: txs } = await supabase
          .from("transactions")
          .select("*")
          .eq("account_id", accountRes.data.id)
          .order("created_at", { ascending: false });

        setTransactions(txs || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading account summary...</p>
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
      <div className="max-w-5xl mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500"></i>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Account Summary</span>
          </nav>

          {/* Toast */}
          {toast && (
            <div
              className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-sm max-sm:left-4 max-sm:text-center ${
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-brand-navy dark:text-white">Account Summary</h2>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <i className="fa fa-briefcase text-green-700 dark:text-green-400"></i>
              <div>
                <div className="text-sm font-semibold text-green-800 dark:text-green-300">{fmt(account?.balance)}</div>
                <div className="text-[10px] text-green-600 dark:text-green-400">Account Balance</div>
              </div>
            </div>
            <div className="bg-brand-navy/10 dark:bg-brand-navy/30 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <i className="fa fa-refresh text-brand-navy dark:text-brand-light"></i>
              <div>
                <div className="text-sm font-semibold text-brand-navy dark:text-brand-light">{account?.is_active ? "Active" : "Inactive"}</div>
                <div className="text-[10px] text-brand-navy/70 dark:text-brand-light/70">Account Status</div>
              </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <i className="fa fa-star text-orange-700 dark:text-orange-400"></i>
              <div>
                <div className="text-sm font-semibold text-orange-800 dark:text-orange-300">{account?.account_type || "-"}</div>
                <div className="text-[10px] text-orange-600 dark:text-orange-400">Account Type</div>
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <i className="fa fa-hashtag text-purple-700 dark:text-purple-400"></i>
              <div>
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-300">{account?.account_number || "-"}</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400">Account Number</div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                <i className="fa fa-history mr-1"></i> Transaction History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/60">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">#</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Description</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">By</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((tx, i) => (
                      <tr
                        key={tx.id}
                        className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-brand-navy/10"
                        onClick={() => setReceiptTx(tx)}
                      >
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2">{fmtDate(tx.created_at)}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              tx.type === "deposit"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : tx.type === "withdrawal"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-brand-light"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 max-w-[160px] truncate">{tx.description || "-"}</td>
                        <td className="px-3 py-2 font-semibold">{fmt(tx.amount)}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              ["completed", "success", "approved"].includes(tx.status?.toLowerCase())
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : ["pending", "processing"].includes(tx.status?.toLowerCase())
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">{tx.by || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <i className="fa fa-inbox text-2xl mb-2 block"></i>
                        No transactions yet.
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

      {/* Receipt Modal */}
      {receiptTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setReceiptTx(null)}
        >
          <div
            className="bg-white dark:bg-brand-dark rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Receipt header */}
            <div className="text-center pt-6 pb-4 px-6 border-b border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-brand-navy/10 dark:bg-brand-navy/30 flex items-center justify-center mx-auto mb-3">
                <i className="fa fa-receipt text-brand-navy dark:text-brand-light text-lg"></i>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Transaction Receipt</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                #{receiptTx.id?.slice(0, 8).toUpperCase() || "N/A"}
              </p>
            </div>

            {/* Receipt body */}
            <div className="px-6 py-4 space-y-3">
              {/* Amount */}
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(receiptTx.amount)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{receiptTx.description || "No description"}</p>
              </div>

              {/* Detail rows */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">Status</span>
                  <span className={`font-semibold ${
                    ["completed", "success", "approved"].includes(receiptTx.status?.toLowerCase())
                      ? "text-green-600 dark:text-green-400"
                      : ["pending", "processing"].includes(receiptTx.status?.toLowerCase())
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>{receiptTx.status}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">Type</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 uppercase">{receiptTx.type}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">Date</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{fmtDate(receiptTx.created_at)}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">From</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{profile?.full_name || "You"}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">To</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{receiptTx.recipient_name || "N/A"}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">Balance Before</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{fmt(receiptTx.balance_before)}</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 col-span-2">
                  <span className="block text-gray-400 dark:text-gray-500 mb-0.5">Balance After</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{fmt(receiptTx.balance_after)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-center">
              <button
                onClick={() => {
                  const win = window.open("", "_blank");
                  if (win) {
                    win.document.write(generateReceipt(receiptTx, profile?.full_name || "You", receiptTx.recipient_name || "N/A"));
                    win.document.close();
                    win.print();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-brand-sun text-white text-xs font-semibold shadow-sm hover:bg-brand-navy transition-colors"
              >
                <i className="fa fa-print mr-1"></i> Print Receipt
              </button>
              <button
                onClick={() => setReceiptTx(null)}
                className="ml-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
