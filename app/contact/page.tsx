"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import DashboardShell from "@/components/DashboardShell";

interface Profile {
  full_name: string;
  email: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

const ADMIN_EMAIL = "contact@horizonridge.cc";

export default function ContactPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Contact form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

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

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setNotifications(data || []);
    } catch (err: any) {
      showToast("Failed to load notifications.", "error");
    } finally {
      setNotifLoading(false);
    }
  };

  const handleNotificationsClick = async () => {
    setShowNotifications(true);
    if (notifications.length === 0) {
      await fetchNotifications();
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          subject: `[Contact Us] ${subject}`,
          html: `<p><b>From:</b> ${profile?.full_name} (${profile?.email})<br><b>Message:</b><br>${message}</p>`,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      showToast("Message sent to admin!", "success");
      setSubject("");
      setMessage("");
      setAttachment(null);
    } catch (err: any) {
      showToast("Failed to send message.", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
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
      <div className="font-sans min-h-screen">
        <div className="max-w-2xl mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500"></i>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Contact Us</span>
          </nav>

          {/* Toast */}
          {toast && (
            <div
              className={`fixed top-4 right-4 z-50 max-sm:left-4 max-sm:text-center px-4 py-2 rounded-lg shadow-lg text-sm ${
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
            <div>
              <h2 className="text-xl font-semibold text-brand-navy dark:text-white">Contact Us</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Send a message to our support team.
              </p>
            </div>
            <button
              id="tab-notifications"
              onClick={handleNotificationsClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-sun text-white text-xs font-semibold shadow-sm hover:bg-brand-navy"
            >
              <i className="fa fa-bell"></i> Notifications
            </button>
          </div>

          {/* Main Content / Notifications View */}
          {showNotifications ? (
            <div id="notif-view">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="mr-2 px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs hover:bg-gray-300"
                >
                  <i className="fa fa-arrow-left"></i> Back
                </button>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Notifications</h3>
              </div>

              {notifLoading ? (
                <div className="text-center py-8">
                  <i className="fa fa-spinner fa-spin text-2xl text-brand-sun"></i>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      <div
                        className="flex items-start gap-2"
                        onClick={() => setExpandedNotifId(expandedNotifId === n.id ? null : n.id)}
                      >
                        <div className="pt-1">
                          <i
                            className={`fa ${
                              n.type === "danger"
                                ? "fa-exclamation-circle text-red-600"
                                : "fa-envelope text-brand-sun"
                            }`}
                          ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {n.title}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-300 truncate">
                            {n.message?.slice(0, 60) || ""}
                            {n.message && n.message.length > 60 ? "..." : ""}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {n.created_at?.slice(0, 16).replace("T", " ")}
                          </div>
                        </div>
                        <button className="text-xs bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                          <i className={`fa ${expandedNotifId === n.id ? "fa-minus" : "fa-plus"}`}></i>
                        </button>
                      </div>
                      {expandedNotifId === n.id && (
                        <div className="mt-2 text-xs text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded p-2">
                          {n.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 text-xs p-4 text-center">
                  <i className="fa fa-inbox text-2xl mb-2 block"></i>
                  No notifications yet.
                </div>
              )}
            </div>
          ) : (
            /* Contact Form */
            <div id="contact-main">
              <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  <i className="fa fa-envelope mr-1"></i> Send a Message
                </h3>
                <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help you?"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Message</label>
                    <textarea
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      rows={5}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">
                      Attachment (optional)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-sun file:text-white"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      id="send-contact-btn"
                      disabled={sending}
                      className="inline-flex items-center px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <><i className="fa fa-spinner fa-spin mr-1"></i> Sending...</>
                      ) : (
                        <><i className="fa fa-paper-plane mr-1"></i> Send Message</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 py-4">
            <p>
              <strong>Copyright &copy; {new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
            </p>
          </footer>
        </div>
      </div>
    </DashboardShell>
  );
}
