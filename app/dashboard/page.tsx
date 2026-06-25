"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface Account {
  id: string;
  account_type: string;
  account_number: string;
  balance: number;
  is_active: boolean;
  interest_rate: number;
}

interface Transaction {
  id: string;
  created_at: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  balance_after: number;
  beneficiary_bank?: string;
  beneficiary_name?: string;
  beneficiary_account?: string;
}

const fmt = (v: number | null | undefined) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      })
    : "$0.00";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transfers, setTransfers] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const [profileRes, accountRes, txRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("accounts").select("*").eq("user_id", user.id).single(),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (profileRes.data) setProfile(profileRes.data);

      let accountData: Account | null = null;
      if (accountRes.data) {
        accountData = accountRes.data;
        setAccount(accountData);
      }

      if (txRes.data) setTransactions(txRes.data);

      // Fetch transfers using account ID
      if (accountData) {
        const { data: transferData } = await supabase
          .from("transactions")
          .select("*")
          .eq("account_id", accountData.id)
          .eq("type", "transfer")
          .order("created_at", { ascending: false })
          .limit(5);
        if (transferData) setTransfers(transferData);
      }

      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <i className="fa-solid fa-house" />
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200">Dashboard</span>
      </nav>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Status</p>
              <h3 className="text-lg font-medium text-green-600 dark:text-green-400">
                {account?.is_active ? "Active" : "Inactive"}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30">
              <i className="fa-solid fa-circle-check text-green-500 text-lg" />
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Type</p>
              <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400">
                {account?.account_type || "USD SAVING"}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-orange-50 dark:bg-orange-900/30">
              <i className="fa-solid fa-star text-orange-500 text-lg" />
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Interest Rate</p>
              <h3 className="text-lg font-medium text-brand-sun dark:text-brand-sun">
                {account?.interest_rate || 0}%
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-brand-sun/10 dark:bg-brand-sun/20">
              <i className="fa-solid fa-percentage text-brand-sun text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Account holder info */}
      <div className="p-4 md:p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Holder</p>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {profile?.full_name}
            </h2>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Number</p>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white font-mono tracking-wider">
              {account?.account_number || ""}
            </h2>
          </div>
        </div>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-brand-sun/10 flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-briefcase text-brand-sun text-lg" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {fmt(account?.balance)}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-house text-red-500 text-lg" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mortgage Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-credit-card text-purple-500 text-lg" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Loan Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$0.00</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Notifications / recent transactions */}
        <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            <i className="fa-regular fa-bell mr-2" />
            Recent Transactions
          </h3>
          <div className="space-y-2">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-800 dark:text-green-300 uppercase">
                      {tx.type}
                    </span>
                    <span
                      className={`text-[11px] font-normal ${
                        tx.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400">
                    {tx.description || ""}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {tx.created_at?.slice(0, 16).replace("T", " ")}
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {fmt(tx.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
                <i className="fa-regular fa-clock text-lg mb-2 block" />
                No transactions yet
              </div>
            )}
          </div>
        </div>

        {/* Latest transfers */}
        <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            <i className="fa-solid fa-arrow-right-arrow-left mr-2" />
            Latest Transfers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left pb-2 font-normal text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left pb-2 font-normal text-gray-500 dark:text-gray-400">Bank</th>
                  <th className="text-left pb-2 font-normal text-gray-500 dark:text-gray-400">Beneficiary</th>
                  <th className="text-right pb-2 font-normal text-gray-500 dark:text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transfers.length > 0 ? (
                  transfers.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 dark:border-gray-800">
                      <td className="py-2 text-gray-600 dark:text-gray-400">
                        {t.created_at?.slice(0, 10)}
                      </td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">
                        {t.beneficiary_bank || "-"}
                      </td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">
                        {t.beneficiary_name || "-"}
                      </td>
                      <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                        {fmt(t.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-400 dark:text-gray-500"
                    >
                      No transfers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Financial statement */}
      <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            <i className="fa-solid fa-receipt mr-2" />
            Financial Statement
          </h3>
          <Link
            href="/account-summary"
            className="px-3 py-1.5 rounded-lg bg-brand-sun text-white text-xs font-medium hover:bg-brand-navy transition-colors"
          >
            <i className="fa-solid fa-eye mr-1" />
            View Statement
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-2 py-2 text-left font-normal text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-2 py-2 text-left font-normal text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-2 py-2 text-left font-normal text-gray-500 dark:text-gray-400">Description</th>
                <th className="px-2 py-2 text-right font-normal text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-2 py-2 text-right font-normal text-gray-500 dark:text-gray-400">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-2 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {tx.created_at?.slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-normal uppercase">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                      {tx.description || "-"}
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium text-gray-900 dark:text-white">
                      {fmt(tx.amount)}
                    </td>
                    <td className="px-2 py-2.5 text-right text-gray-600 dark:text-gray-400">
                      {fmt(tx.balance_after)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-400 dark:text-gray-500"
                  >
                    <i className="fa-regular fa-receipt text-lg mb-2 block" />
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 py-4">
        Copyright &copy; {new Date().getFullYear()} All rights reserved | Horizon Ridge Credit Union.
      </footer>
    </div>
  );
}
