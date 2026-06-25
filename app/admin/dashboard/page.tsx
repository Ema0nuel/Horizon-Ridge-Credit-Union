"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

interface Account {
  id: string;
  user_id: string;
  balance: number;
  account_type: string;
  account_number: string;
  is_active: boolean;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
}

interface Loan {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Card {
  id: string;
  user_id: string;
  card_number: string;
  card_type: string;
  is_active: boolean;
  issued_at: string;
}

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("profiles").select("id,full_name,email,avatar_url,created_at"),
      supabase.from("accounts").select("id,user_id,balance,account_type,account_number,is_active"),
      supabase.from("transactions").select("id,user_id,type,amount,description,status,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("loan").select("id,user_id,amount,status,created_at"),
      supabase.from("cards").select("id,user_id,card_number,card_type,is_active,issued_at"),
    ])
      .then(([pRes, aRes, tRes, lRes, cRes]) => {
        if (pRes.data) setProfiles(pRes.data);
        if (aRes.data) setAccounts(aRes.data);
        if (tRes.data) setTransactions(tRes.data);
        if (lRes.data) setLoans(lRes.data);
        if (cRes.data) setCards(cRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const userCount = profiles.length;
  const txCount = transactions.length;
  const loanCount = loans.length;
  const cardCount = cards.length;
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (parseFloat(String(acc.balance)) || 0),
    0
  );

  // Aggregate transaction types
  const txTypeMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    txTypeMap[tx.type] = (txTypeMap[tx.type] || 0) + 1;
  });
  const txTypes = Object.entries(txTypeMap).sort((a, b) => b[1] - a[1]);

  // Aggregate transactions per day
  const txDayMap: Record<string, number> = {};
  transactions.forEach((tx) => {
    const date = tx.created_at?.slice(0, 10);
    if (date) txDayMap[date] = (txDayMap[date] || 0) + 1;
  });
  const txDays = Object.entries(txDayMap).sort((a, b) => a[0].localeCompare(b[0]));

  const recentUsers = profiles.slice(0, 5);
  const recentTx = transactions.slice(0, 5).map((tx) => {
    const user = profiles.find((u) => u.id === tx.user_id);
    return { ...tx, userName: user?.full_name || user?.email || "User" };
  });

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

  const StatCard = ({
    title,
    value,
    icon,
    bgColor,
    iconColor,
    change,
    up,
  }: {
    title: string;
    value: string | number;
    icon: string;
    bgColor: string;
    iconColor: string;
    change?: string;
    up?: boolean;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <i
                className={`fa-solid ${
                  up ? "fa-arrow-up text-success" : "fa-arrow-down text-danger"
                } text-xs`}
              />
              <span className={`text-xs font-medium ${up ? "text-success" : "text-danger"}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <i className={`fa-solid ${icon} ${iconColor} text-xl`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back. Here is an overview of the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={userCount}
          icon="fa-users"
          bgColor="bg-brand-navy/10"
          iconColor="text-brand-navy"
          change="+12.5%"
          up
        />
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString()}`}
          icon="fa-credit-card"
          bgColor="bg-teal-50 dark:bg-teal-900/20"
          iconColor="text-teal-600 dark:text-teal-400"
          change="+8.2%"
          up
        />
        <StatCard
          title="Active Loans"
          value={loanCount}
          icon="fa-file-invoice-dollar"
          bgColor="bg-brand-sun/10"
          iconColor="text-brand-sun"
          change="-2.4%"
          up={false}
        />
        <StatCard
          title="Cards Issued"
          value={cardCount}
          icon="fa-id-card"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
          change="+3.1%"
          up
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Transaction Types
          </h3>
          {txTypes.length > 0 ? (
            <div className="space-y-2">
              {txTypes.map(([type, count]) => {
                const pct = txCount > 0 ? Math.round((count / txCount) * 100) : 0;
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate uppercase">
                      {type}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-sun"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
              No transaction data yet
            </p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Transactions Per Day
          </h3>
          {txDays.length > 0 ? (
            <div className="space-y-1">
              {txDays.slice(-10).map(([date, count]) => {
                const max = Math.max(...txDays.map(([, c]) => c));
                const height = max > 0 ? (count / max) * 100 : 0;
                return (
                  <div key={date} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 w-20">
                      {date?.slice(5)}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full rounded bg-brand-navy transition-all duration-500"
                        style={{ width: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
              No transaction data yet
            </p>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Recent Users</h3>
          <a
            href="/admin/users"
            className="text-xs text-brand-sun hover:underline"
          >
            View all
          </a>
        </div>
        {recentUsers.length > 0 ? (
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-brand-navy flex items-center justify-center text-white text-xs font-medium">
                  {u.full_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {u.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {u.created_at?.slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            No registered users yet
          </p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
          <a
            href="/admin/transactions"
            className="text-xs text-brand-sun hover:underline"
          >
            View all
          </a>
        </div>
        {recentTx.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">
                    User
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-navy flex items-center justify-center text-white text-[10px] font-medium">
                          {tx.userName?.charAt(0) || "?"}
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[120px]">
                          {tx.userName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 uppercase">
                      {tx.type}
                    </td>
                    <td className="py-2.5 px-2 text-gray-900 dark:text-white font-medium">
                      ${parseFloat(String(tx.amount)).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 text-success dark:bg-green-900/40 dark:text-green-300"
                            : tx.status === "pending"
                              ? "bg-yellow-100 text-warning dark:bg-yellow-900/40 dark:text-yellow-300"
                              : "bg-red-100 text-danger dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {tx.created_at?.slice(0, 16).replace("T", " ")}
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
    </div>
  );
}
