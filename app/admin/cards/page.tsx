"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Card {
  id: string;
  user_id: string;
  card_number?: string;
  card_type?: string;
  status: string;
  is_active: boolean;
  expiry_date?: string;
  cvv?: string;
  notes?: string;
  issued_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailCard, setDetailCard] = useState<Card | null>(null);
  const [declineCard, setDeclineCard] = useState<Card | null>(null);
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
      const [cRes, uRes] = await Promise.all([
        supabase.from("cards").select("*").order("issued_at", { ascending: false }).limit(100),
        supabase.from("profiles").select("id,full_name,email"),
      ]);
      if (cRes.data) setCards(cRes.data);
      if (uRes.data) setUsers(uRes.data);
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

  const getUser = (userId: string) => users.find((u) => u.id === userId);

  const statusBadge = (status: string | null | undefined) => {
    const s = status || "pending";
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      printing: "bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-brand-light",
      issued: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      declined: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          map[s] || "bg-gray-100 text-gray-700"
        }`}
      >
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  const filteredCards = cards.filter((c) => {
    const user = getUser(c.user_id);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (user?.full_name || "").toLowerCase().includes(q) ||
      (user?.email || "").toLowerCase().includes(q) ||
      (c.card_number || "").includes(q) ||
      (c.card_type || "").toLowerCase().includes(q);
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = async (card: Card) => {
    const cardNumber = window.prompt("Enter card number (16 digits):");
    if (!cardNumber || cardNumber.length < 12) {
      setMessage({ type: "error", text: "Card number required (min 12 digits)" });
      return;
    }
    const cardType = window.prompt("Enter card type (debit/credit):", "debit");
    if (!cardType) {
      setMessage({ type: "error", text: "Card type required" });
      return;
    }
    const expiryDate = window.prompt("Enter expiry date (YYYY-MM-DD):");
    if (!expiryDate) {
      setMessage({ type: "error", text: "Expiry date required" });
      return;
    }
    const cvv = window.prompt("Enter CVV (3 digits):");
    if (!cvv || cvv.length < 3) {
      setMessage({ type: "error", text: "CVV required" });
      return;
    }

    setActionLoading(card.id);
    try {
      await supabase
        .from("cards")
        .update({
          status: "approved",
          card_number: cardNumber,
          card_type: cardType,
          expiry_date: expiryDate,
          cvv,
          is_active: true,
          issued_at: new Date().toISOString(),
        })
        .eq("id", card.id);

      const user = getUser(card.user_id);
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          subject: "Card Request Approved",
          html: `<p>Dear ${user?.full_name},<br>Your card request has been approved. Card Number: <b>${cardNumber}</b>, Type: <b>${cardType}</b>.<br>We will notify you when your card is ready.</p>`,
        }),
      });

      setMessage({ type: "success", text: "Card approved and user notified" });
      window.location.reload();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrint = async (card: Card) => {
    setActionLoading(card.id);
    await supabase.from("cards").update({ status: "printing" }).eq("id", card.id);
    setMessage({ type: "success", text: "Card marked as printing" });
    setActionLoading(null);
    window.location.reload();
  };

  const handleIssue = async (card: Card) => {
    setActionLoading(card.id);
    await supabase.from("cards").update({ status: "issued" }).eq("id", card.id);
    const user = getUser(card.user_id);
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: user?.email,
        subject: "Your Card is Ready",
        html: `<p>Dear ${user?.full_name},<br>Your card is now ready for pickup/use.</p>`,
      }),
    });
    setMessage({ type: "success", text: "Card issued and user notified" });
    setActionLoading(null);
    window.location.reload();
  };

  const handleDecline = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!declineCard) return;
    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    if (!reason) {
      setMessage({ type: "error", text: "Reason required" });
      return;
    }

    setSubmitting(true);
    try {
      await supabase.from("cards").update({ status: "declined", notes: reason }).eq("id", declineCard.id);
      const user = getUser(declineCard.user_id);
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          subject: "Card Request Declined",
          html: `<p>Dear ${user?.full_name},<br>Your card request was declined. Reason: <b>${reason}</b></p>`,
        }),
      });
      setMessage({ type: "success", text: "Card declined and user notified" });
      setDeclineCard(null);
      window.location.reload();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const exportCSV = () => {
    const header = ["Date", "User", "Card Number", "Type", "Status"];
    const rows = filteredCards.map((c) =>
      [formatDate(c.issued_at), getUser(c.user_id)?.full_name || "", c.card_number || "", c.card_type || "", c.status].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cards.csv";
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
          <span className="text-gray-700 dark:text-gray-300">Cards</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Card Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage card requests and issuance
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
          placeholder="Search by user, card number, type..."
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
          <option value="printing">Printing</option>
          <option value="issued">Issued</option>
          <option value="declined">Declined</option>
        </select>
        <button onClick={exportCSV} className="ml-auto bg-brand-navy hover:bg-brand-navy/90 text-white px-3 py-2 rounded-xl text-sm transition-colors">
          <i className="fa-regular fa-file-export mr-1" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {filteredCards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Card Number</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((c) => {
                  const user = getUser(c.user_id);
                  return (
                    <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(c.issued_at)}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium text-gray-900 dark:text-white">{user?.full_name || "Unknown"}</span>
                        <div className="text-[10px] text-gray-400">{user?.email || ""}</div>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-gray-600 dark:text-gray-400">{c.card_number || "-"}</td>
                      <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 uppercase">{c.card_type || "-"}</td>
                      <td className="py-2.5 px-2">{statusBadge(c.status)}</td>
                      <td className="py-2.5 px-2">
                        <div className="flex gap-1 flex-wrap">
                          <button onClick={() => setDetailCard(c)} className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-lg text-[10px] transition-colors"><i className="fa-regular fa-eye mr-0.5" /> View</button>
                          {c.status === "pending" && (
                            <>
                              <button onClick={() => handleApprove(c)} disabled={actionLoading === c.id} className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors">{actionLoading === c.id ? <i className="fa-solid fa-spinner fa-spin mr-0.5" /> : <i className="fa-regular fa-check mr-0.5" />} {actionLoading === c.id ? "Processing..." : "Approve"}</button>
                              <button onClick={() => setDeclineCard(c)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-[10px] transition-colors"><i className="fa-regular fa-ban mr-0.5" /> Decline</button>
                            </>
                          )}
                          {c.status === "approved" && (
                            <button onClick={() => handlePrint(c)} disabled={actionLoading === c.id} className="bg-brand-navy hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors">{actionLoading === c.id ? <i className="fa-solid fa-spinner fa-spin mr-0.5" /> : <i className="fa-regular fa-print mr-0.5" />} {actionLoading === c.id ? "Processing..." : "Mark Printing"}</button>
                          )}
                          {c.status === "printing" && (
                            <button onClick={() => handleIssue(c)} disabled={actionLoading === c.id} className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 py-1 rounded-lg text-[10px] transition-colors">{actionLoading === c.id ? <i className="fa-solid fa-spinner fa-spin mr-0.5" /> : <i className="fa-regular fa-id-card mr-0.5" />} {actionLoading === c.id ? "Processing..." : "Issue Card"}</button>
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
            {search || statusFilter ? "No cards match your filters" : "No card requests found"}
          </p>
        )}
      </div>

      {/* Detail Modal */}
      {detailCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setDetailCard(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Card Details</h2>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-500 dark:text-gray-400">User:</span> <span className="text-gray-900 dark:text-white ml-2">{getUser(detailCard.user_id)?.full_name || "Unknown"} ({getUser(detailCard.user_id)?.email || ""})</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Card Number:</span> <span className="text-gray-900 dark:text-white ml-2">{detailCard.card_number || "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Type:</span> <span className="text-gray-900 dark:text-white ml-2">{detailCard.card_type || "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Status:</span> <span className="ml-2">{statusBadge(detailCard.status)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Issued At:</span> <span className="text-gray-900 dark:text-white ml-2">{formatDate(detailCard.issued_at)}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Expiry Date:</span> <span className="text-gray-900 dark:text-white ml-2">{detailCard.expiry_date ? formatDate(detailCard.expiry_date) : "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">CVV:</span> <span className="text-gray-900 dark:text-white ml-2">{detailCard.cvv || "-"}</span></div>
              <div><span className="font-medium text-gray-500 dark:text-gray-400">Active:</span> <span className="text-gray-900 dark:text-white ml-2">{detailCard.is_active ? "Yes" : "No"}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {declineCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button onClick={() => setDeclineCard(null)} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decline Card Request</h2>
            <form onSubmit={handleDecline} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                <textarea name="reason" rows={3} required className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setDeclineCard(null)} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm transition-colors">{submitting ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-ban mr-1" />}{submitting ? "Processing..." : "Decline"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
