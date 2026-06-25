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

const callAdminApi = async (body: any) => {
  const res = await fetch("/api/admin/transactions", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
};

const formatDate = (dt: string) => {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

const formatCurrency = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const COMPLEX_CODES = [
  "E9876567", "G0876578", "8767898H", "K2387651", "456L7890", "1M234567",
  "987654N3", "O2345678", "98765P43", "Q1987654", "R7654321", "567S1234",
];

function getRandomCode() {
  return COMPLEX_CODES[Math.floor(Math.random() * COMPLEX_CODES.length)];
}

export default function AdminTransactions() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals/panels
  const [showManualTx, setShowManualTx] = useState(false);
  const [manualTxUserId, setManualTxUserId] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [panelMode, setPanelMode] = useState<"view" | "edit">("view");
  const [codesModal, setCodesModal] = useState<{ cot: string; imf: string; vat: string; user: Profile } | null>(null);

  // Action states
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);


  // Edit form fields (for transaction edit)
  const [editFields, setEditFields] = useState<Record<string, any>>({});

  const supabase = createClient();

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) { window.location.href = "/admin-login"; return; }
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

  const getUser = (userId: string) => users.find((u) => u.id === userId);
  const getAccount = (accId: string) => accounts.find((a) => a.id === accId);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      reversed: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      reversal: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
  };

  const filteredTxs = txs.filter((t) => {
    const user = getUser(t.user_id);
    const acc = getAccount(t.account_id);
    const q = search.toLowerCase();
    return (!q || (user?.full_name || "").toLowerCase().includes(q) || (user?.email || "").toLowerCase().includes(q) || (acc?.account_number || "").includes(q) || t.type?.includes(q)) &&
      (!typeFilter || t.type === typeFilter) &&
      (!statusFilter || t.status === statusFilter);
  });

  // Detail panel actions
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      await callAdminApi({ action: "approve", transactionId: id });
      setMessage({ type: "success", text: "Approved and balance updated" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setActionLoading(null); }
  };

  const handleReverse = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      await callAdminApi({ action: "reverse", transactionId: id });
      setMessage({ type: "success", text: "Transaction reversed" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction permanently?")) return;
    setActionLoading(id);
    try {
      await callAdminApi({ action: "delete", transactionId: id });
      setMessage({ type: "success", text: "Transaction deleted" });
      setSelectedTx(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setActionLoading(null); }
  };

  const handleEditSave = async () => {
    if (!selectedTx) return;
    setSending(true);
    setMessage(null);
    try {
      await callAdminApi({ action: "update", transactionId: selectedTx.id, fields: editFields });
      setMessage({ type: "success", text: "Transaction updated" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setSending(false); }
  };

  const openDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setPanelMode("view");
    setEditFields({
      user_id: tx.user_id,
      account_id: tx.account_id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description || "",
      balance_before: tx.balance_before,
      balance_after: tx.balance_after,
      created_at: tx.created_at || "",
    });
  };

  // Manual Transaction
  const handleManualTx = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const user_id = fd.get("user_id") as string;
    const account_id = fd.get("account_id") as string;
    const type = fd.get("type") as string;
    const amount = parseFloat(fd.get("amount") as string);
    const description = (fd.get("description") as string) || "";
    const rawDate = fd.get("created_at") as string;
    const created_at = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString();
    if (!user_id || !account_id || !type || !amount) {
      setMessage({ type: "error", text: "Fill all fields" }); setSending(false); return;
    }
    try {
      const acc = accounts.find((a) => a.id === account_id);
      const user = users.find((u) => u.id === user_id);
      if (!acc || !user) throw new Error("Invalid user/account");
      const balance_before = parseFloat(String(acc.balance));
      let balance_after = balance_before;
      if (type === "deposit" || type === "manual") balance_after += amount;
      if (type === "withdrawal") balance_after -= amount;

      await callAdminApi({ action: "approve", transactionId: null, ...{ user_id, account_id, type, amount, description, balance_before, balance_after } });

      // Create directly via supabase
      await supabase.from("transactions").insert([
        { user_id, account_id, type, amount, description, balance_before, balance_after, status: "completed", created_at },
      ]);
      await supabase.from("accounts").update({ balance: balance_after }).eq("id", account_id);

      const cot = getRandomCode();
      const imf = getRandomCode();
      const vat = getRandomCode();
      setCodesModal({ cot, imf, vat, user });
      setShowManualTx(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setSending(false); }
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
          subject: "Transaction Codes - Horizon Ridge Credit Union",
          html: `<div style="font-family:sans-serif">
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
    } catch { setMessage({ type: "error", text: "Failed to send email" }); }
    finally { setEmailSending(false); }
  };

  const exportCSV = () => {
    const header = ["Date", "User", "Account", "Type", "Amount", "Status", "Description"];
    const rows = filteredTxs.map((t) =>
      [formatDate(t.created_at), getUser(t.user_id)?.full_name || "", getAccount(t.account_id)?.account_number || "", t.type, t.amount, t.status, t.description || ""].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass = "block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition";
  const labelClass = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1";

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Transactions</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Transaction Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View, filter, approve, and manage transactions</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
          {message.text}
        </div>
      )}

      {/* Filters & Actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Search by user, account, type..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm">
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
          <option value="manual">Manual</option>
          <option value="reversal">Reversal</option>
          <option value="reversed">Reversed</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="reversed">Reversed</option>
        </select>
        <button onClick={exportCSV} className="bg-brand-sun hover:bg-brand-navy text-white px-3 py-2 rounded-xl text-sm transition-colors">
          <i className="fa-regular fa-file-export mr-1" /> Export CSV
        </button>
        <button onClick={() => { setShowManualTx(true); setManualTxUserId(""); setCodesModal(null); }}
          className="bg-brand-sun hover:bg-brand-navy text-white px-3 py-2 rounded-xl text-sm transition-colors">
          <i className="fa-regular fa-plus mr-1" /> Manual Tx
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {filteredTxs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500">Date</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500">User</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500">Account</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500">Type</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-2.5 px-2 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((t) => {
                  const user = getUser(t.user_id);
                  const acc = getAccount(t.account_id);
                  return (
                    <tr key={t.id} onClick={() => openDetail(t)}
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-sun/5 dark:hover:bg-brand-sun/10 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(t.created_at)}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium text-gray-900 dark:text-white">{user?.full_name || "Unknown"}</span>
                        <div className="text-[10px] text-gray-400">{user?.email || ""}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="font-mono text-gray-600 dark:text-gray-400">{acc?.account_number || "-"}</span>
                        <div className="text-[10px] text-gray-400">{acc?.account_type || ""}</div>
                      </td>
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 uppercase">{t.type}</td>
                      <td className="py-2.5 px-2 text-gray-900 dark:text-white font-medium">{formatCurrency(t.amount)}</td>
                      <td className="py-2.5 px-2">{statusBadge(t.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            {search || typeFilter || statusFilter ? "No matches" : "No transactions found"}
          </p>
        )}
      </div>

      {/* Detail / Edit Slide-over Panel */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedTx(null)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-slide-up md:animate-fade-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {panelMode === "edit" ? "Edit Transaction" : "Transaction Details"}
              </h2>
              <div className="flex items-center gap-2">
                {panelMode === "view" && (
                  <button onClick={() => setPanelMode("edit")} className="text-sm text-brand-sun hover:text-brand-navy font-medium">
                    <i className="fa-solid fa-pen mr-1" /> Edit
                  </button>
                )}
                <button onClick={() => { setSelectedTx(null); setPanelMode("view"); }} className="p-1 text-gray-400 hover:text-gray-600">
                  <i className="fa-solid fa-xmark text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {panelMode === "view" ? (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-sun to-brand-navy flex items-center justify-center text-white font-semibold">
                      {getUser(selectedTx.user_id)?.full_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{getUser(selectedTx.user_id)?.full_name || "Unknown"}</h3>
                      <p className="text-xs text-gray-500">{getUser(selectedTx.user_id)?.email || ""}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Account", val: getAccount(selectedTx.account_id)?.account_number || "-" },
                      { label: "Type", val: selectedTx.type.toUpperCase() },
                      { label: "Amount", val: formatCurrency(selectedTx.amount), highlight: true },
                      { label: "Status", val: <>{statusBadge(selectedTx.status)}</> },
                      { label: "Balance Before", val: selectedTx.balance_before ? formatCurrency(selectedTx.balance_before) : "-" },
                      { label: "Balance After", val: selectedTx.balance_after ? formatCurrency(selectedTx.balance_after) : "-" },
                      { label: "Created", val: formatDate(selectedTx.created_at) },
                      { label: "Description", val: selectedTx.description || "-", span: true },
                    ].map((f) => (
                      <div key={f.label} className={f.span ? "col-span-2" : f.highlight ? "col-span-2 bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3" : ""}>
                        {f.highlight ? (
                          <><span className="text-[10px] text-gray-500">{f.label}</span><p className="text-xl font-bold text-gray-900 dark:text-white">{f.val}</p></>
                        ) : (
                          <><span className="text-[10px] text-gray-500">{f.label}</span><p className="text-sm text-gray-900 dark:text-white mt-0.5">{f.val}</p></>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Detail action buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {selectedTx.status === "pending" && (
                      <button onClick={() => handleApprove(selectedTx.id)} disabled={actionLoading === selectedTx.id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                        {actionLoading === selectedTx.id ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-check mr-1" />}
                        Approve
                      </button>
                    )}
                    {selectedTx.status === "failed" && (
                      <button onClick={() => handleApprove(selectedTx.id)} disabled={actionLoading === selectedTx.id}
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                        {actionLoading === selectedTx.id ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-solid fa-rotate mr-1" />}
                        Retry
                      </button>
                    )}
                    {selectedTx.status === "completed" && selectedTx.type !== "reversed" && selectedTx.type !== "reversal" && (
                      <button onClick={() => handleReverse(selectedTx.id)} disabled={actionLoading === selectedTx.id}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                        {actionLoading === selectedTx.id ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-solid fa-rotate-left mr-1" />}
                        Reverse
                      </button>
                    )}
                    <button onClick={() => handleDelete(selectedTx.id)} disabled={actionLoading === selectedTx.id}
                      className="bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                      <i className="fa-solid fa-trash-can mr-1" /> Delete
                    </button>
                  </div>
                </>
              ) : (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>User</label>
                    <select value={editFields.user_id || ""} onChange={(e) => setEditFields({ ...editFields, user_id: e.target.value })}
                      className={inputClass}>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Account</label>
                    <select value={editFields.account_id || ""} onChange={(e) => setEditFields({ ...editFields, account_id: e.target.value })}
                      className={inputClass}>
                      {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_number} ({a.account_type})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Type</label>
                      <select value={editFields.type || ""} onChange={(e) => setEditFields({ ...editFields, type: e.target.value })} className={inputClass}>
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="transfer">Transfer</option>
                        <option value="manual">Manual</option>
                        <option value="reversal">Reversal</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Status</label>
                      <select value={editFields.status || ""} onChange={(e) => setEditFields({ ...editFields, status: e.target.value })} className={inputClass}>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="reversed">Reversed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Amount</label>
                      <input type="number" step="0.01" value={editFields.amount || ""}
                        onChange={(e) => setEditFields({ ...editFields, amount: parseFloat(e.target.value) || 0 })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Date</label>
                      <input type="datetime-local" value={editFields.created_at ? new Date(editFields.created_at).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setEditFields({ ...editFields, created_at: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                        className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Balance Before</label>
                      <input type="number" step="0.01" value={editFields.balance_before ?? ""}
                        onChange={(e) => setEditFields({ ...editFields, balance_before: e.target.value ? parseFloat(e.target.value) : null })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Balance After</label>
                      <input type="number" step="0.01" value={editFields.balance_after ?? ""}
                        onChange={(e) => setEditFields({ ...editFields, balance_after: e.target.value ? parseFloat(e.target.value) : null })}
                        className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea rows={2} value={editFields.description || ""}
                      onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                      className={inputClass} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setPanelMode("view")} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm">Cancel</button>
                    <button onClick={handleEditSave} disabled={sending} className="flex-1 bg-brand-sun hover:bg-brand-navy disabled:opacity-50 text-white py-2.5 rounded-xl text-sm">
                      {sending ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-check mr-1" />}
                      {sending ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Transaction Modal */}
      {showManualTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setShowManualTx(false)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Manual Transaction</h2>
            <form onSubmit={handleManualTx} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
                <select name="user_id" required value={manualTxUserId}
                  onChange={(e) => setManualTxUserId(e.target.value)}
                  className={inputClass}>
                  <option value="">Select user</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
                <select name="account_id" required className={inputClass}>
                  <option value="">Select account</option>
                  {accounts
                    .filter((a) => !manualTxUserId || a.user_id === manualTxUserId)
                    .map((a) => <option key={a.id} value={a.id}>{a.account_number} ({a.account_type})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select name="type" required className={inputClass}>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
                <input type="number" name="amount" step="0.01" min="0.01" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="datetime-local" name="created_at" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={2} className={inputClass} />
              </div>
              <button type="submit" disabled={sending} className="w-full bg-brand-sun hover:bg-brand-navy disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm">
                {sending ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-check mr-1" />}
                {sending ? "Processing..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Codes Modal */}
      {codesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setCodesModal(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Transaction Codes</h2>
            <p className="text-xs text-gray-500 mb-4">For {codesModal.user.full_name} ({codesModal.user.email})</p>
            {["COT", "IMF", "VAT"].map((label) => {
              const code = codesModal[label.toLowerCase() as keyof typeof codesModal] as string;
              return (
                <div key={label} className="flex items-center justify-between mb-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                  <div>
                    <span className="text-[10px] text-gray-500">{label}</span>
                    <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">{code}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(code); setMessage({ type: "success", text: `${label} code copied` }); }}
                    className="text-brand-sun hover:text-brand-navy text-xs font-medium px-3 py-1.5 border border-brand-sun/30 rounded-lg hover:bg-brand-sun/5 transition-colors">
                    <i className="fa-regular fa-copy mr-1" /> Copy
                  </button>
                </div>
              );
            })}
            <div className="flex gap-2 mt-4">
              <button onClick={sendCodesEmail} disabled={emailSending}
                className="flex-1 bg-brand-sun hover:bg-brand-navy disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm">
                {emailSending ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-envelope mr-1" />}
                {emailSending ? "Sending..." : "Send to Email"}
              </button>
              <button onClick={() => { setCodesModal(null); }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
