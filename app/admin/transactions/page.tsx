"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  balance_before?: number;
  balance_after?: number;
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
  account_number: string;
  account_type: string;
  balance: number;
}

const complexCodes = [
  "E9876567", "G0876578", "8767898H", "K2387651", "456L7890", "1M234567",
  "987654N3", "O2345678", "98765P43", "Q1987654", "R7654321", "567S1234",
];

function getRandomCode() {
  return complexCodes[Math.floor(Math.random() * complexCodes.length)];
}

export default function AdminTransactions() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showManualTx, setShowManualTx] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [codesModal, setCodesModal] = useState<{
    cot: string;
    imf: string;
    vat: string;
    user: Profile;
  } | null>(null);
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }

    (async () => {
      const [tRes, uRes, aRes] = await Promise.all([
        supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("profiles").select("id,full_name,email"),
        supabase.from("accounts").select("*"),
      ]);
      if (tRes.data) setTxs(tRes.data);
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
  const getAccount = (accId: string) => accounts.find((a) => a.id === accId);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      reversed: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          map[status] || "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredTxs = txs.filter((t) => {
    const user = getUser(t.user_id);
    const acc = getAccount(t.account_id);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (user?.full_name || "").toLowerCase().includes(q) ||
      (user?.email || "").toLowerCase().includes(q) ||
      (acc?.account_number || "").includes(q) ||
      t.type?.includes(q);
    const matchType = !typeFilter || t.type === typeFilter;
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const updateTxStatus = async (id: string, status: string, newType?: string) => {
    const update: any = { status };
    if (newType) update.type = newType;
    await supabase.from("transactions").update(update).eq("id", id);
    setTxs((prev) => prev.map((t) => (t.id === id ? { ...t, ...update } : t)));
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await updateTxStatus(id, "completed");
      setMessage({ type: "success", text: "Transaction approved" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = async (id: string) => {
    setActionLoading(id);
    try {
      await updateTxStatus(id, "pending");
      setMessage({ type: "success", text: "Transaction set to pending" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReverse = async (id: string) => {
    setActionLoading(id);
    try {
      await updateTxStatus(id, "reversed", "reversed");
      setMessage({ type: "success", text: "Transaction reversed" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTx) return;
    setSending(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await supabase
        .from("transactions")
        .update({
          user_id: formData.user_id,
          account_id: formData.account_id,
          type: formData.type,
          amount: parseFloat(formData.amount as string),
          status: formData.status,
          description: formData.description,
          balance_before: formData.balance_before ? parseFloat(formData.balance_before as string) : null,
          balance_after: formData.balance_after ? parseFloat(formData.balance_after as string) : null,
          created_at: formData.created_at ? new Date(formData.created_at as string).toISOString() : editTx.created_at,
        })
        .eq("id", editTx.id);
      setMessage({ type: "success", text: "Transaction updated" });
      setEditTx(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  };

  const handleManualTx = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const user_id = formData.get("user_id") as string;
    const account_id = formData.get("account_id") as string;
    const type = formData.get("type") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const description = (formData.get("description") as string) || "";

    if (!user_id || !account_id || !type || !amount) {
      setMessage({ type: "error", text: "Fill all fields" });
      setSending(false);
      return;
    }

    try {
      const acc = accounts.find((a) => a.id === account_id);
      const user = users.find((u) => u.id === user_id);
      if (!acc || !user) throw new Error("Invalid user/account");

      const balance_before = parseFloat(String(acc.balance));
      let balance_after = balance_before;
      if (type === "deposit" || type === "manual") balance_after += amount;
      if (type === "withdrawal") balance_after -= amount;

      await supabase.from("transactions").insert([
        { user_id, account_id, type, amount, description, balance_before, balance_after, status: "completed" },
      ]);
      await supabase.from("accounts").update({ balance: balance_after }).eq("id", account_id);

      const cot = getRandomCode();
      const imf = getRandomCode();
      const vat = getRandomCode();
      setCodesModal({ cot, imf, vat, user });
      setShowManualTx(false);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create transaction" });
    } finally {
      setSending(false);
    }
  };

  const sendCodesEmail = async () => {
    if (!codesModal || emailSending) return;
    setEmailSending(true);
    const { cot, imf, vat, user } = codesModal;
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          subject: "Transaction Codes",
          html: `
            <div style="font-family:sans-serif">
              <h2>Transaction Codes</h2>
              <p>Dear ${user.full_name},</p>
              <p>Your transaction codes:</p>
              <ul>
                <li>COT: <b>${cot}</b></li>
                <li>IMF: <b>${imf}</b></li>
                <li>VAT: <b>${vat}</b></li>
              </ul>
              <p>Keep these codes safe.</p>
              <p>Horizon Ridge Credit Union</p>
            </div>`,
        }),
      });
      setMessage({ type: "success", text: "Codes sent to user email" });
    } catch {
      setMessage({ type: "error", text: "Failed to send codes email" });
    } finally {
      setEmailSending(false);
    }
  };

  const exportCSV = () => {
    const header = ["Date", "User", "Account", "Type", "Amount", "Status", "Description"];
    const rows = filteredTxs.map((t) =>
      [
        formatDate(t.created_at),
        getUser(t.user_id)?.full_name || "",
        getAccount(t.account_id)?.account_number || "",
        t.type,
        t.amount,
        t.status,
        t.description || "",
      ].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
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
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Transactions</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Transaction Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View, filter, and manage all platform transactions
        </p>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by user, account, type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition w-full md:w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
        >
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
          <option value="manual">Manual</option>
          <option value="reversed">Reversed</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="reversed">Reversed</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-brand-sun hover:bg-brand-navy text-white px-3 py-2 rounded-xl text-sm transition-colors"
        >
          <i className="fa-regular fa-file-export mr-1" />
          Export CSV
        </button>
        <button
          onClick={() => {
            setShowManualTx(true);
            setCodesModal(null);
          }}
          className="bg-brand-sun hover:bg-brand-navy text-white px-3 py-2 rounded-xl text-sm transition-colors"
        >
          <i className="fa-regular fa-plus mr-1" />
          Manual Transaction
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {filteredTxs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Account</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((t) => {
                  const user = getUser(t.user_id);
                  const acc = getAccount(t.account_id);
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(t.created_at)}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user?.full_name || "Unknown"}
                        </span>
                        <div className="text-[10px] text-gray-400">{user?.email || ""}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="font-mono text-gray-600 dark:text-gray-400">
                          {acc?.account_number || "-"}
                        </span>
                        <div className="text-[10px] text-gray-400">{acc?.account_type || ""}</div>
                      </td>
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 uppercase">
                        {t.type}
                      </td>
                      <td className="py-2.5 px-2 text-gray-900 dark:text-white font-medium">
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="py-2.5 px-2">{statusBadge(t.status)}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex gap-1 flex-wrap">
                          <button
                            onClick={() => setDetailTx(t)}
                            className="bg-brand-sun hover:bg-brand-navy text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditTx(t)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                          >
                            Edit
                          </button>
                          {t.status === "pending" && (
                            <button
                              onClick={() => handleApprove(t.id)}
                              disabled={actionLoading === t.id}
                              className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                            >
                              {actionLoading === t.id ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                              Approve
                            </button>
                          )}
                          {t.status === "failed" && (
                            <button
                              onClick={() => handleRetry(t.id)}
                              disabled={actionLoading === t.id}
                              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                            >
                              {actionLoading === t.id ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                              Retry
                            </button>
                          )}
                          {t.status === "completed" && t.type !== "reversed" && (
                            <button
                              onClick={() => handleReverse(t.id)}
                              disabled={actionLoading === t.id}
                              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                            >
                              {actionLoading === t.id ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                              Reverse
                            </button>
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
            {search || typeFilter || statusFilter
              ? "No transactions match your filters"
              : "No transactions found"}
          </p>
        )}
      </div>

      {/* Manual Transaction Modal */}
      {showManualTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setShowManualTx(false)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Manual Transaction
            </h2>
            <form onSubmit={handleManualTx} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
                <select name="user_id" required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
                <select name="account_id" required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  <option value="">Select account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.account_number} ({a.account_type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select name="type" required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                <input type="number" name="amount" step="0.01" min="0.01" required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={2} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <button type="submit" disabled={sending} className="w-full bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm">
                {sending ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-regular fa-check mr-1"></i>}
                {sending ? "Processing..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setEditTx(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Transaction</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
                <select name="user_id" defaultValue={editTx.user_id} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
                <select name="account_id" defaultValue={editTx.account_id} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.account_number} ({a.account_type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select name="type" defaultValue={editTx.type} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="transfer">Transfer</option>
                  <option value="manual">Manual</option>
                  <option value="reversed">Reversed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                <input type="number" name="amount" step="0.01" min="0.01" defaultValue={editTx.amount} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" defaultValue={editTx.status} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="reversed">Reversed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="datetime-local" name="created_at" defaultValue={editTx.created_at ? new Date(editTx.created_at).toISOString().slice(0, 16) : ""} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={2} defaultValue={editTx.description || ""} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Balance Before</label>
                <input type="number" name="balance_before" step="0.01" defaultValue={editTx.balance_before || ""} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Balance After</label>
                <input type="number" name="balance_after" step="0.01" defaultValue={editTx.balance_after || ""} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditTx(null)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={sending} className="bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm transition-colors">
                  {sending ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-regular fa-check mr-1"></i>}
                  {sending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setDetailTx(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Details</h2>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-500 dark:text-gray-400">User:</span> <span className="text-gray-900 dark:text-white ml-2">{getUser(detailTx.user_id)?.full_name || "Unknown"} ({getUser(detailTx.user_id)?.email || ""})</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Account:</span> <span className="text-gray-900 dark:text-white ml-2">{getAccount(detailTx.account_id)?.account_number || "-"} ({getAccount(detailTx.account_id)?.account_type || ""})</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Type:</span> <span className="text-gray-900 dark:text-white ml-2 uppercase">{detailTx.type}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Amount:</span> <span className="text-gray-900 dark:text-white ml-2">{formatCurrency(detailTx.amount)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Status:</span> <span className="ml-2">{statusBadge(detailTx.status)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Description:</span> <span className="text-gray-900 dark:text-white ml-2">{detailTx.description || "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Created:</span> <span className="text-gray-900 dark:text-white ml-2">{formatDate(detailTx.created_at)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Balance Before:</span> <span className="text-gray-900 dark:text-white ml-2">{detailTx.balance_before ? formatCurrency(detailTx.balance_before) : "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Balance After:</span> <span className="text-gray-900 dark:text-white ml-2">{detailTx.balance_after ? formatCurrency(detailTx.balance_after) : "-"}</span></div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {detailTx.status === "pending" && (
                <button onClick={async () => { await handleApprove(detailTx.id); setDetailTx(null); }} disabled={actionLoading === detailTx.id} className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl text-sm">
                  {actionLoading === detailTx.id ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                  Approve
                </button>
              )}
              {detailTx.status === "failed" && (
                <button onClick={async () => { await handleRetry(detailTx.id); setDetailTx(null); }} disabled={actionLoading === detailTx.id} className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl text-sm">
                  {actionLoading === detailTx.id ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                  Retry
                </button>
              )}
              {detailTx.status === "completed" && detailTx.type !== "reversed" && (
                <button onClick={async () => { await handleReverse(detailTx.id); setDetailTx(null); }} disabled={actionLoading === detailTx.id} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl text-sm">
                  {actionLoading === detailTx.id ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : null}
                  Reverse
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Codes Modal */}
      {codesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setCodesModal(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated Codes</h2>
            {["COT", "IMF", "VAT"].map((label) => {
              const code = codesModal[label.toLowerCase() as keyof typeof codesModal] as string;
              return (
                <div key={label} className="flex items-center justify-between mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-sm text-gray-900 dark:text-white">
                    <strong>{label}:</strong> {code}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      setMessage({ type: "success", text: "Code copied" });
                    }}
                    className="text-brand-sun hover:text-brand-navy text-xs font-medium"
                  >
                    Copy
                  </button>
                </div>
              );
            })}
            <button
              onClick={sendCodesEmail}
              disabled={emailSending}
              className="w-full bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm mt-2"
            >
              {emailSending ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-regular fa-envelope mr-1"></i>}
              {emailSending ? "Sending..." : "Send Codes to User Email"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
