"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import DashboardShell from "@/components/DashboardShell";

interface Profile {
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  occupation?: string;
  dob?: string;
  gender?: string;
  marital_status?: string;
}

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  is_active: boolean;
  branch?: string;
  pin?: string;
}

const ADMIN_EMAIL = "contact@horizonridge.cc";

const fmt = (v: number | string | undefined | null) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      })
    : v || "$0.00";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile-tab");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [msgSubject, setMsgSubject] = useState("");
  const [msgMessage, setMsgMessage] = useState("");
  const [msgSending, setMsgSending] = useState(false);

  // Settings form state
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [password, setPassword] = useState("");
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);

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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject.trim() || !msgMessage.trim()) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setMsgSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          subject: `[${profile?.full_name}] ${msgSubject}`,
          html: `<b>From:</b> ${profile?.full_name} (${profile?.email})<br/><b>Message:</b><br/>${msgMessage.replace(/\n/g, "<br>")}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");

      await supabase.from("notifications").insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          title: "Message Sent",
          message: `Your message "${msgSubject}" was sent to admin.`,
        },
      ]);

      showToast("Message sent successfully!", "success");
      setShowMessageModal(false);
      setMsgSubject("");
      setMsgMessage("");
    } catch (err: any) {
      showToast("Failed to send message.", "error");
    } finally {
      setMsgSending(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates: Record<string, string> = {};
      if (newEmail.trim()) updates.email = newEmail.trim();
      if (newPhone.trim()) updates.phone = newPhone.trim();
      if (password.trim()) updates.password = password.trim();

      if (Object.keys(updates).length === 0) {
        showToast("No changes to save.", "info");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (updateError) throw updateError;
      showToast("Settings updated!", "success");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      showToast("Update failed: " + err.message, "error");
    } finally {
      setSettingsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
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

  if (!profile) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <i className="fa fa-user text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">No profile data found.</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const tabs = [
    { id: "profile-tab", label: "Profile", icon: "fa-user" },
    { id: "settings-tab", label: "Settings", icon: "fa-gear" },
  ];

  return (
    <DashboardShell>
      <div className="font-sans min-h-screen">
        <div className="max-w-4xl mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500"></i>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Profile</span>
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
            <h2 className="text-xl font-semibold text-brand-navy dark:text-white">My Profile</h2>
            <div className="flex gap-2">
              <Link
                href="/edit-profile"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-sun text-white text-xs font-semibold shadow-sm hover:bg-brand-navy"
              >
                <i className="fa fa-pencil"></i> Edit Profile
              </Link>
              <button
                id="open-message-modal"
                onClick={() => setShowMessageModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-sun text-white text-xs font-semibold shadow-sm hover:bg-brand-navy"
              >
                <i className="fa fa-envelope"></i> Send Message
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <ul className="flex flex-wrap gap-4">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-brand-sun text-brand-sun"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <i className={`fa ${tab.icon} mr-1`}></i> {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile-tab" && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex flex-col items-center">
                <img
                  src={profile.avatar_url || "/images/user/user.png"}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-gray-200 dark:border-gray-700"
                />
                <h3 className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{profile.full_name}</h3>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
              <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
                    <i className="fa fa-square mr-1"></i> Personal Information
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-gray-500">Full Name:</span> <span className="font-semibold">{profile.full_name || "-"}</span></div>
                    <div><span className="text-gray-500">Email:</span> <span className="font-semibold">{profile.email || "-"}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-semibold">{profile.phone || "-"}</span></div>
                    <div><span className="text-gray-500">Address:</span> <span className="font-semibold">{profile.address || "-"}</span></div>
                    <div><span className="text-gray-500">City:</span> <span className="font-semibold">{profile.city || "-"}</span></div>
                    <div><span className="text-gray-500">State:</span> <span className="font-semibold">{profile.state || "-"}</span></div>
                    <div><span className="text-gray-500">Zip Code:</span> <span className="font-semibold">{profile.zip_code || "-"}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
                    <i className="fa fa-square mr-1"></i> Account Information
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-gray-500">Account Balance:</span> <span className="font-semibold">{fmt(account?.balance)}</span></div>
                    <div><span className="text-gray-500">Account Number:</span> <span className="font-semibold">{account?.account_number || "-"}</span></div>
                    <div><span className="text-gray-500">Account Type:</span> <span className="font-semibold">{account?.account_type || "-"}</span></div>
                    <div><span className="text-gray-500">Account Status:</span> <span className="font-semibold">{account?.is_active ? "Active" : "Inactive"}</span></div>
                    <div><span className="text-gray-500">Account Pin:</span> <span className="font-semibold">{account?.pin || "-"}</span></div>
                    <div><span className="text-gray-500">Branch:</span> <span className="font-semibold">{account?.branch || "-"}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings-tab" && (
            <form onSubmit={handleSettingsSubmit} className="space-y-4 max-w-xl mx-auto mt-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                <i className="fa fa-square mr-1"></i> Change Detail
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">New Email</label>
                  <input
                    type="email"
                    name="new_email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new@email.com"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">New Phone</label>
                  <input
                    type="text"
                    name="new_phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Current Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password to save changes"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={settingsSubmitting}
                  className="px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingsSubmitting ? (
                    <><i className="fa fa-spinner fa-spin mr-1"></i> Saving...</>
                  ) : (
                    <><i className="fa fa-save mr-1"></i> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 py-4">
            <p>
              <strong>Copyright &copy; {new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
            </p>
          </footer>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg"
              onClick={() => setShowMessageModal(false)}
            >
              &times;
            </button>
            <h4 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
              <i className="fa fa-envelope mr-1"></i> Send Message to Admin
            </h4>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-semibold">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-semibold">Message</label>
                <textarea
                  name="message"
                  value={msgMessage}
                  onChange={(e) => setMsgMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={msgSending}
                  className="px-4 py-1 rounded bg-brand-sun text-white hover:bg-brand-navy text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {msgSending ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    <><i className="fa fa-paper-plane"></i> Send</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
