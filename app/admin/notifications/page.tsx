"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }

    const supabase = createClient();
    (async () => {
      const [nRes, uRes] = await Promise.all([
        supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase.from("profiles").select("id,full_name,email"),
      ]);
      if (nRes.data) setNotifications(nRes.data);
      if (uRes.data) setUsers(uRes.data);
      setLoading(false);
    })();
  }, []);

  const formatDate = (dt: string) => {
    if (!dt) return "";
    const d = new Date(dt);
    return (
      d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.full_name || "Unknown";
  };

  const getUserEmail = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || "";
  };

  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          map[type] ||
          "bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-brand-light"
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const filteredNotifs = notifications.filter((n) => {
    const userName = getUserName(n.user_id).toLowerCase();
    const userEmail = getUserEmail(n.user_id).toLowerCase();
    const matchesSearch =
      !search ||
      userName.includes(search.toLowerCase()) ||
      userEmail.includes(search.toLowerCase()) ||
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.message || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || n.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSendNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSending(true);
    const formData = new FormData(e.currentTarget);
    const userId = formData.get("user_id") as string;
    const title = formData.get("title") as string;
    const msg = formData.get("message") as string;
    const type = formData.get("type") as string;

    if (!userId || !title || !msg || !type) {
      setMessage({ type: "error", text: "All fields required" });
      setSending(false);
      return;
    }

    try {
      const supabase = createClient();
      await supabase.from("notifications").insert([{ user_id: userId, title, message: msg, type }]);
      const user = users.find((u) => u.id === userId);

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user?.email,
          subject: title,
          html: msg,
        }),
      });

      setMessage({ type: "success", text: "Notification sent and user emailed" });
      setShowSendModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send" });
    } finally {
      setSending(false);
    }
  };

  const handleViewNotif = async (n: Notification) => {
    setSelectedNotif(n);
    if (!n.read) {
      const supabase = createClient();
      await supabase.from("notifications").update({ read: true }).eq("id", n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
      );
    }
  };

  const exportCSV = () => {
    const header = ["Date", "User", "Title", "Message", "Type", "Status"];
    const rows = filteredNotifs.map((n) =>
      [
        formatDate(n.created_at),
        getUserName(n.user_id),
        n.title || "",
        n.message.replace(/[\r\n]+/g, " "),
        n.type,
        n.read ? "Read" : "Unread",
      ].join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notifications.csv";
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
          <span className="text-gray-700 dark:text-gray-300">Notifications</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Platform Notifications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage all platform notifications
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
          placeholder="Search by user, title, message..."
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
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="danger">Danger</option>
        </select>
        <button
          onClick={exportCSV}
          className="ml-auto bg-brand-sun hover:bg-brand-navy text-white px-3 py-2 rounded-xl text-sm transition-colors"
        >
          <i className="fa-regular fa-file-export mr-1" />
          Export CSV
        </button>
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-brand-sun hover:bg-brand-navy text-white px-3 py-2 rounded-xl text-sm transition-colors"
        >
          <i className="fa-regular fa-bell mr-1" />
          Send Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {filteredNotifs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Title</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Message</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifs.map((n) => (
                  <tr
                    key={n.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(n.created_at)}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getUserName(n.user_id)}
                      </span>
                      <div className="text-[10px] text-gray-400">
                        {getUserEmail(n.user_id)}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-gray-900 dark:text-white">
                      {n.title || "-"}
                    </td>
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                      {n.message.length > 60
                        ? n.message.slice(0, 60) + "..."
                        : n.message}
                    </td>
                    <td className="py-2.5 px-2">{typeBadge(n.type)}</td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`text-xs font-medium ${
                          n.read ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {n.read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <button
                        onClick={() => handleViewNotif(n)}
                        className="bg-brand-sun hover:bg-brand-navy text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            No notifications found
          </p>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setShowSendModal(false)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Send Notification
            </h2>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User
                </label>
                <select
                  name="user_id"
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Danger</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                {sending ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-regular fa-bell mr-1"></i>}
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">User:</span>
                <span className="text-gray-900 dark:text-white ml-2">
                  {getUserName(selectedNotif.user_id)} ({getUserEmail(selectedNotif.user_id)})
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Title:</span>
                <span className="text-gray-900 dark:text-white ml-2">
                  {selectedNotif.title || "-"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Message:</span>
                <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">
                  {selectedNotif.message}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Type:</span>
                <span className="ml-2">{typeBadge(selectedNotif.type)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Status:</span>
                <span
                  className={`ml-2 text-xs font-medium ${
                    selectedNotif.read ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {selectedNotif.read ? "Read" : "Unread"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white ml-2">
                  {formatDate(selectedNotif.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
