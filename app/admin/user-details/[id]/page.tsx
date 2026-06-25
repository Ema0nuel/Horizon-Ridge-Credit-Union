"use client";

import { useState, useEffect, use, useRef } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  firstname?: string;
  lastname?: string;
  title?: string;
  country_code?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  dob?: string;
  occupation?: string;
  ssn?: string;
  marital_status?: string;
  gender?: string;
  is_active?: boolean;
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

const callAdminApi = async (body: any) => {
  const res = await fetch("/api/admin/users", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
};

const formatCurrency = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function AdminUserDetails({ params }: { params: Promise<{ id: string }> }) {
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

  // Edit panel state
  const [editPanel, setEditPanel] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }
    (async () => {
      const [pRes, aRes, kRes, tRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("accounts").select("*").eq("user_id", id).single(),
        supabase.from("kyc_requests").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(1).single(),
        supabase.from("transactions").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(10),
      ]);
      if (pRes.data) setProfile(pRes.data);
      if (aRes.data) setAccount(aRes.data);
      if (kRes.data) setKyc(kRes.data);
      if (tRes.data) setTransactions(tRes.data);
      if (pRes.error || aRes.error) setError("User not found");
      setLoading(false);
    })();
  }, [id, supabase]);

  const openEditPanel = () => {
    if (!profile) return;
    const fields: Record<string, string> = {};
    ["full_name","title","firstname","lastname","phone","country_code","nationality",
     "address","city","state","zip","dob","occupation","ssn","marital_status","gender"].forEach(k => {
      fields[k] = (profile as any)[k] || "";
    });
    fields.account_type = account?.account_type || "";
    fields.is_active = account?.is_active !== false ? "true" : "false";
    setFormData(fields);
    setNewEmail(profile.email);
    setNewPassword("");
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditPanel(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else setAvatarPreview(null);
  };

  const handleSaveEmail = async () => {
    if (!profile || newEmail === profile.email) return;
    setEmailSaving(true); setMessage(null);
    try {
      await callAdminApi({ action: "update-email", userId: id, email: newEmail });
      setMessage({ type: "success", text: "Email updated" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setEmailSaving(false); }
  };

  const handleSavePassword = async () => {
    if (!profile || newPassword.length < 6) return;
    setPasswordSaving(true); setMessage(null);
    try {
      await callAdminApi({ action: "update-password", userId: id, password: newPassword });
      setMessage({ type: "success", text: "Password changed" });
      setNewPassword("");
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setPasswordSaving(false); }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setProfileSaving(true); setMessage(null);
    try {
      const profileFields = ["full_name","title","firstname","lastname","phone","country_code","nationality","address","city","state","zip","dob","occupation","ssn","marital_status","gender"];
      const update: Record<string, any> = {};
      profileFields.forEach(k => { if (formData[k] !== undefined) update[k] = formData[k]; });
      await callAdminApi({ action: "update-profile", userId: id, profile: update });
      if (avatarFile) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => { const r = reader.result as string; resolve(r.split(",")[1]); };
          reader.readAsDataURL(avatarFile);
        });
        await callAdminApi({ action: "upload-avatar", userId: id, imageBase64: base64, mimeType: avatarFile.type });
      }
      setMessage({ type: "success", text: "Profile saved" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setProfileSaving(false); }
  };

  const handleSaveAccount = async () => {
    if (!profile) return;
    setAccountSaving(true); setMessage(null);
    try {
      const actActive = formData.is_active === "true";
      await callAdminApi({ action: "update-account", userId: id, account: { account_type: formData.account_type, is_active: actActive } });
      await supabase.from("profiles").update({ is_active: actActive }).eq("id", id);
      setMessage({ type: "success", text: "Account settings saved" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setAccountSaving(false); }
  };

  const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const messageText = (fd.get("message") as string) || "";
    const fundAmount = parseFloat((fd.get("fund") as string) || "0");
    try {
      if (messageText) {
        await supabase.from("notifications").insert([
          { user_id: id, title: "Admin Message", message: messageText, type: "info" },
        ]);
      }
      if (fundAmount > 0) {
        const { data: acc } = await supabase.from("accounts").select("*").eq("user_id", id).single();
        if (acc) {
          const newBal = parseFloat(acc.balance) + fundAmount;
          await supabase.from("accounts").update({ balance: newBal }).eq("id", acc.id);
          await supabase.from("transactions").insert([{
            account_id: acc.id, user_id: id, type: "deposit",
            description: "Admin funding", amount: fundAmount,
            balance_before: acc.balance, balance_after: newBal, status: "completed",
          }]);
        }
      }
      setMessage({ type: "success", text: "Action completed successfully" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Action failed" });
    } finally { setSending(false); }
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

  if (error || !profile) {
    return <div className="text-center py-16">
      <i className="fa-regular fa-circle-exclamation text-4xl text-red-400 mb-4" />
      <p className="text-gray-500 dark:text-gray-400">{error || "User not found"}</p>
      <a href="/admin/users" className="inline-block mt-4 text-sm text-brand-sun hover:underline">Back to Users</a>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <a href="/admin/users" className="hover:text-brand-sun">Users</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{profile.full_name}</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Details</h1>
          <button onClick={openEditPanel} className="bg-brand-sun hover:bg-brand-navy text-white px-4 py-2 rounded-xl text-sm transition-colors">
            <i className="fa-solid fa-pen mr-1" /> Edit
          </button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        }`}>{message.text}</div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-sun to-brand-navy flex items-center justify-center text-white text-xl font-medium shrink-0 overflow-hidden">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : profile.full_name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.full_name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{profile.phone || "No phone"}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Account Number</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{account?.account_number || "-"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{account ? formatCurrency(account.balance) : "-"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
            <p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                account?.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}>{account?.is_active ? "Active" : "Inactive"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* KYC Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">KYC Status</h2>
        {kyc ? (
          <div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
              kyc.status === "verified"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : kyc.status === "pending"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            }`}>{kyc.status || "Not submitted"}</span>
            {kyc.created_at && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Submitted: {new Date(kyc.created_at).toLocaleDateString()}</p>}
          </div>
        ) : <p className="text-sm text-gray-400 dark:text-gray-500">Not submitted</p>}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
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
                  <tr key={tx.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">{tx.created_at?.slice(0, 16).replace("T", " ")}</td>
                    <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 uppercase">{tx.type}</td>
                    <td className="py-2.5 px-2 text-gray-900 dark:text-white font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        tx.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : tx.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No transactions yet</p>}
      </div>

      {/* Admin Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Send Notification / Fund Account</h2>
        <form onSubmit={handleAction} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <input type="text" name="message" className={inputClass} placeholder="Notification message" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fund Amount ($)</label>
            <input type="number" name="fund" min="0" step="0.01" className={inputClass} placeholder="0.00" />
          </div>
          <button type="submit" disabled={sending}
            className="bg-brand-sun hover:bg-brand-navy disabled:bg-brand-sun/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm">
            {sending ? <i className="fa-solid fa-spinner fa-spin mr-1" /> : <i className="fa-regular fa-paper-plane mr-1" />}
            {sending ? "Processing..." : "Send / Fund"}
          </button>
        </form>
      </div>

      {/* Edit Panel */}
      {editPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditPanel(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-slide-up md:animate-fade-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit {profile.full_name}</h2>
              <button onClick={() => setEditPanel(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Avatar Upload */}
              <div>
                <label className={labelClass}>Profile Picture</label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl text-gray-400 shrink-0 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                    {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> :
                      profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> :
                      <i className="fa-solid fa-user" />}
                  </div>
                  <div>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-brand-sun hover:text-brand-navy font-medium">
                      <i className="fa-solid fa-upload mr-1" /> Upload new picture
                    </button>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG up to 2MB</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                </div>
              </div>

              {/* Email - independent save */}
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4">
                <label className={labelClass}>Email</label>
                <div className="flex gap-2">
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  <button onClick={handleSaveEmail} disabled={emailSaving || newEmail === profile.email}
                    className="bg-brand-sun hover:bg-brand-navy disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    {emailSaving ? <i className="fa-solid fa-spinner fa-spin" /> : "Save Email"}
                  </button>
                </div>
              </div>

              {/* Password - independent save */}
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4">
                <label className={labelClass}>New Password</label>
                <div className="flex gap-2">
                  <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters" maxLength={100} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  <button onClick={handleSavePassword} disabled={passwordSaving || newPassword.length < 6}
                    className="bg-brand-sun hover:bg-brand-navy disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    {passwordSaving ? <i className="fa-solid fa-spinner fa-spin" /> : "Save Password"}
                  </button>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Profile Details</h4>
                  <button onClick={handleSaveProfile} disabled={profileSaving}
                    className="bg-brand-sun hover:bg-brand-navy disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    {profileSaving ? <i className="fa-solid fa-spinner fa-spin" /> : "Save Profile"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "Full Name", name: "full_name", type: "text", colspan: true },
                    { label: "Title", name: "title", type: "text" },
                    { label: "First Name", name: "firstname", type: "text" },
                    { label: "Last Name", name: "lastname", type: "text" },
                    { label: "Phone", name: "phone", type: "text" },
                    { label: "Country Code", name: "country_code", type: "text" },
                    { label: "Nationality", name: "nationality", type: "text" },
                    { label: "Address", name: "address", type: "text", colspan: true },
                    { label: "City", name: "city", type: "text" },
                    { label: "State", name: "state", type: "text" },
                    { label: "Zip", name: "zip", type: "text" },
                    { label: "DOB", name: "dob", type: "date" },
                    { label: "Occupation", name: "occupation", type: "text" },
                    { label: "SSN", name: "ssn", type: "text" },
                    { label: "Marital Status", name: "marital_status", type: "text" },
                  ].map((f) => (
                    <div key={f.name} className={f.colspan ? "md:col-span-2" : ""}>
                      <label className={labelClass}>{f.label}</label>
                      <input type={f.type} value={formData[f.name] || ""}
                        onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={formData.gender || ""} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputClass}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Account Settings</h4>
                  <button onClick={handleSaveAccount} disabled={accountSaving}
                    className="bg-brand-sun hover:bg-brand-navy disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    {accountSaving ? <i className="fa-solid fa-spinner fa-spin" /> : "Save Account"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Account Type</label>
                    <select value={formData.account_type || ""} onChange={(e) => setFormData({ ...formData, account_type: e.target.value })} className={inputClass}>
                      <option value="">Select</option>
                      <option value="USD SAVING">USD SAVING</option>
                      <option value="USD CURRENT">USD CURRENT</option>
                      <option value="MONEY MARKET">MONEY MARKET</option>
                      <option value="IRA">IRA</option>
                      <option value="INVESTMENT ACCOUNT">INVESTMENT ACCOUNT</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select value={formData.is_active || "true"} onChange={(e) => setFormData({ ...formData, is_active: e.target.value })} className={inputClass}>
                      <option value="true">Active</option>
                      <option value="false">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cancel */}
              <button onClick={() => setEditPanel(false)} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
