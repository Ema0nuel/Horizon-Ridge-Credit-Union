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

const QUICK_ACTIONS = [
  { href: "/deposit", icon: "fa-arrow-right-to-bracket", label: "Deposit", color: "bg-green-500" },
  { href: "/withdrawal", icon: "fa-money-bill-transfer", label: "Withdraw", color: "bg-red-500" },
  { href: "/loan", icon: "fa-landmark", label: "Loan", color: "bg-blue-500" },
];

function getTxIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "deposit": return "fa-arrow-right-to-bracket text-green-500";
    case "withdrawal": return "fa-money-bill-transfer text-red-500";
    case "transfer": return "fa-arrow-right-arrow-left text-brand-sun";
    default: return "fa-circle text-gray-400";
  }
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "completed": case "success": case "approved": return "text-green-600 dark:text-green-400";
    case "pending": case "processing": return "text-yellow-600 dark:text-yellow-400";
    default: return "text-red-600 dark:text-red-400";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transfers, setTransfers] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

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
    <div className="px-4 py-4 md:p-6 max-w-3xl mx-auto">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back</p>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {profile?.full_name?.split(" ")[0] || "Member"}
          </h1>
        </div>
        <Link
          href="/profile"
          className="h-9 w-9 rounded-full bg-brand-sun/10 flex items-center justify-center hover:bg-brand-sun/20 transition-colors"
        >
          <i className="fa-solid fa-user text-brand-sun text-sm" />
        </Link>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/90 p-5 mb-5 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-white/70 font-medium">Total Balance</p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              <i className={`fa-solid ${showBalance ? "fa-eye" : "fa-eye-slash"} text-white text-xs`} />
            </button>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-0.5">
            {showBalance ? fmt(account?.balance) : "••••••"}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-white/60">
              {account?.account_type || "USD SAVING"}
            </span>
            <span className="text-[11px] text-white/60">•</span>
            <span className={`text-[11px] ${account?.is_active ? "text-green-300" : "text-red-300"}`}>
              {account?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-5">
        {QUICK_ACTIONS.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow hover:border-brand-sun/30 transition-all active:scale-[0.97]"
          >
            <div className={`w-10 h-10 rounded-full ${action.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
              <i className={`fa-solid ${action.icon} text-white text-base`} />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
              {action.label}
            </span>
          </Link>
        ))}
        <Link
          href="/cards"
          className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow hover:border-brand-sun/30 transition-all active:scale-[0.97]"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500 bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
            <i className="fa-solid fa-credit-card text-purple-500 text-base" />
          </div>
          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">Cards</span>
        </Link>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Account Number</p>
            <p className="text-sm font-mono font-medium text-gray-900 dark:text-white tracking-wider mt-0.5">
              {account?.account_number || "---"}
            </p>
          </div>
          <Link
            href="/account-summary"
            className="px-3 py-1.5 rounded-lg bg-brand-sun/10 text-brand-sun text-[11px] font-medium hover:bg-brand-sun/20 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <i className="fa-regular fa-clock text-gray-400" />
              Recent Activity
            </h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{transactions.length} items</span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {transactions.length > 0 ? (
              transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${getTxIcon(tx.type)} text-xs`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900 dark:text-white capitalize truncate">
                        {tx.type}
                      </span>
                      <span className={`text-[10px] font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {tx.description || "No description"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {fmt(tx.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {tx.created_at?.slice(5, 16).replace("T", " ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
                <i className="fa-regular fa-clock text-lg mb-2 block" />
                No recent transactions
              </div>
            )}
          </div>
        </div>

        {/* Latest Transfers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <i className="fa-solid fa-arrow-right-arrow-left text-gray-400" />
              Latest Transfers
            </h3>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {transfers.length > 0 ? (
              transfers.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-sun/10 dark:bg-brand-sun/20 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-building-columns text-brand-sun text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {t.beneficiary_name || "Transfer"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                      {t.beneficiary_bank || ""} {t.created_at?.slice(0, 10)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {fmt(t.amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
                <i className="fa-solid fa-arrow-right-arrow-left text-lg mb-2 block" />
                No transfers yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Financial Statement List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            <i className="fa-regular fa-receipt text-gray-400" />
            Financial Statement
          </h3>
          <Link
            href="/account-summary"
            className="px-3 py-1.5 rounded-lg bg-brand-sun text-white text-[11px] font-medium hover:bg-brand-navy transition-colors"
          >
            <i className="fa-solid fa-eye mr-1" />
            View All
          </Link>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${getTxIcon(tx.type)} text-xs`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-gray-900 dark:text-white capitalize">
                      {tx.type}
                    </span>
                    {tx.status && (
                      <span className={`text-[10px] ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {tx.description || "No description"}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {tx.created_at?.slice(0, 16).replace("T", " ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {fmt(tx.amount)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {fmt(tx.balance_after)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
              <i className="fa-regular fa-receipt text-lg mb-2 block" />
              No transactions found
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4">
        Copyright &copy; {new Date().getFullYear()} All rights reserved | Horizon Ridge Credit Union.
      </footer>
    </div>
  );
}
