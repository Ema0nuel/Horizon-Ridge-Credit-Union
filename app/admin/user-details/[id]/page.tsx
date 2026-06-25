"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

interface Account {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  account_type: string;
  is_active: boolean;
}

interface KYC {
  id: string;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  created_at: string;
}

export default function AdminUserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [kyc, setKyc] = useState<KYC | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }

    (async () => {
      const [pRes, aRes, kRes, tRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("accounts").select("*").eq("user_id", id).single(),
        supabase
          .from("kyc_requests")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      if (pRes.data) setProfile(pRes.data);
      if (aRes.data) setAccount(aRes.data);
      if (kRes.data) setKyc(kRes.data);
      if (tRes.data) setTransactions(tRes.data);
      if (pRes.error || aRes.error) {
        setError("User not found");
      }
      setLoading(false);
    })();
  }, [id, supabase]);

  const formatCurrency = (v: number) =>
    v.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const messageText = (formData.get("message") as string) || "";
    const fundAmount = parseFloat((formData.get("fund") as string) || "0");

    try {
      if (messageText) {
        await supabase.from("notifications").insert([
          { user_id: id, title: "Admin Message", message: messageText, type: "info" },
        ]);
      }

      if (fundAmount > 0) {
        const { data: acc } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", id)
          .single();

        if (acc) {
          const newBal = parseFloat(acc.balance) + fundAmount;
          await supabase.from("accounts").update({ balance: newBal }).eq("id", acc.id);
          await supabase.from("transactions").insert([
            {
              account_id: acc.id,
              user_id: id,
              type: "deposit",
              description: "Admin funding",
              amount: fundAmount,
              balance_before: acc.balance,
              balance_after: newBal,
              status: "completed",
            },
          ]);
        }
      }

      setMessage({ type: "success", text: "Action completed successfully" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Action failed" });
    } finally {
      setSending(false);
    }
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

  if (error || !profile) {
    return (
      <div className="text-center py-16">
        <i className="fa-regular fa-circle-exclamation text-4xl text-red-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{error || "User not found"}</p>
        <a
          href="/admin/users"
          className="inline-block mt-4 text-sm text-brand-sun hover:underline"
        >
          Back to Users
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <a href="/admin/users" className="hover:text-brand-sun">Users</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{profile.full_name}</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          User Details
        </h1>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-sun to-brand-navy flex items-center justify-center text-white text-xl font-medium">
            {profile.full_name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {profile.full_name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.email}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {profile.phone || "No phone"}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Account Number</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {account?.account_number || "-"}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {account ? formatCurrency(account.balance) : "-"}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
            <p>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  account?.is_active
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {account?.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* KYC Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          KYC Status
        </h2>
        {kyc ? (
          <div>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                kyc.status === "verified"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : kyc.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}
            >
              {kyc.status || "Not submitted"}
            </span>
            {kyc.created_at && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Submitted: {new Date(kyc.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">Not submitted</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {tx.created_at?.slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 uppercase">
                      {tx.type}
                    </td>
                    <td className="py-2.5 px-2 text-gray-900 dark:text-white font-medium">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            No transactions yet
          </p>
        )}
      </div>

      {/* Admin Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Send Notification / Fund Account
        </h2>
        <form onSubmit={handleAction} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <input
              type="text"
              name="message"
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              placeholder="Notification message"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fund Amount ($)
            </label>
            <input
              type="number"
              name="fund"
              min="0"
              step="0.01"
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              placeholder="0.00"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm"
          >
            {sending ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-regular fa-paper-plane mr-1"></i>}
            {sending ? "Processing..." : "Send / Fund"}
          </button>
        </form>
      </div>
    </div>
  );
}
