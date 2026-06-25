"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
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
  account_type: string;
  account_number: string;
  balance: number;
  is_active: boolean;
}

interface LoginOtp {
  user_id: string;
  created_at: string;
}

interface MergedUser extends Profile {
  account_type: string;
  account_is_active: boolean;
  balance: number;
  account_number: string;
  last_login: string;
  avatar_url?: string;
}

const formatDate = (dt: string) => {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

const formatCurrency = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const STATUS_ACTIVE = { label: "Active", class: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
const STATUS_SUSPENDED = { label: "Suspended", class: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" };

export default function AdminUsers() {
  const [users, setUsers] = useState<MergedUser[]>([]);
  const [filtered, setFiltered] = useState<MergedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [selectedUser, setSelectedUser] = useState<MergedUser | null>(null);
  const [editMode, setEditMode] = useState<"view" | "edit" | "create">("view");
  const [saving, setSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);

  // Edit form fields
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const callAdminApi = async (body: any) => {
    const res = await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data;
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) { window.location.href = "/admin-login"; return; }
    (async () => {
      const [pRes, aRes, lRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("accounts").select("*"),
        supabase.from("login_otps").select("*"),
      ]);
      const profiles = (pRes.data || []) as Profile[];
      const accounts = (aRes.data || []) as Account[];
      const logins = (lRes.data || []) as LoginOtp[];

      const merged: MergedUser[] = profiles.map((u) => {
        const acc = accounts.find((a) => a.user_id === u.id);
        const userLogins = logins.filter((l) => l.user_id === u.id);
        const lastLogin = userLogins.length > 0
          ? userLogins.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : u.created_at;
        return {
          ...u,
          account_type: acc?.account_type || "-",
          account_is_active: acc?.is_active !== false,
          balance: acc?.balance || 0,
          account_number: acc?.account_number || "-",
          last_login: lastLogin,
          avatar_url: u.avatar_url || undefined,
        };
      });

      setUsers(merged);
      setFiltered(merged);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase()).includes(q) ||
      (u.account_number && u.account_number.includes(q))
    ));
  }, [search, users]);

  const openUser = (user: MergedUser) => {
    setSelectedUser(user);
    setEditMode("view");
    // Populate form fields
    const fields: Record<string, string> = {};
    ["full_name","title","firstname","lastname","phone","country_code","nationality",
     "address","city","state","zip","dob","occupation","ssn","marital_status","gender"].forEach(k => {
      fields[k] = (user as any)[k] || "";
    });
    fields.account_type = user.account_type || "";
    fields.is_active = user.is_active !== false ? "true" : "false";
    setFormData(fields);
    setNewEmail(user.email);
    setNewPassword("");
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const closePanel = () => {
    setSelectedUser(null);
    setEditMode("view");
    setMessage(null);
    setNewPassword("");
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // strip data:image/...;base64,
      };
      reader.readAsDataURL(avatarFile);
    });
    const mimeType = avatarFile.type;
    const data = await callAdminApi({ action: "upload-avatar", userId, imageBase64: base64, mimeType });
    return data.avatar_url || null;
  };

  const handleSaveEmail = async () => {
    if (!selectedUser || newEmail === selectedUser.email) return;
    setEmailSaving(true); setMessage(null);
    try {
      await callAdminApi({ action: "update-email", userId: selectedUser.id, email: newEmail });
      setMessage({ type: "success", text: "Email updated" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setEmailSaving(false); }
  };

  const handleSavePassword = async () => {
    if (!selectedUser || newPassword.length < 6) return;
    setPasswordSaving(true); setMessage(null);
    try {
      await callAdminApi({ action: "update-password", userId: selectedUser.id, password: newPassword });
      setMessage({ type: "success", text: "Password changed" });
      setNewPassword("");
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setPasswordSaving(false); }
  };

  const handleSaveProfile = async () => {
    if (!selectedUser) return;
    setProfileSaving(true); setMessage(null);
    try {
      const profileFields = ["full_name","title","firstname","lastname","phone","country_code","nationality","address","city","state","zip","dob","occupation","ssn","marital_status","gender"];
      const update: Record<string, any> = {};
      profileFields.forEach(k => { if (formData[k] !== undefined) update[k] = formData[k]; });
      await callAdminApi({ action: "update-profile", userId: selectedUser.id, profile: update });
      if (avatarFile) await uploadAvatar(selectedUser.id);
      setMessage({ type: "success", text: "Profile saved" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setProfileSaving(false); }
  };

  const handleSaveAccount = async () => {
    if (!selectedUser) return;
    setAccountSaving(true); setMessage(null);
    try {
      const actActive = formData.is_active === "true";
      await callAdminApi({ action: "update-account", userId: selectedUser.id, account: { account_type: formData.account_type, is_active: actActive } });
      await supabase.from("profiles").update({ is_active: actActive }).eq("id", selectedUser.id);
      setMessage({ type: "success", text: "Account settings saved" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) { setMessage({ type: "error", text: err.message }); }
    finally { setAccountSaving(false); }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          acctype: data.account_type,
          username: `${data.firstname} ${data.lastname}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      setMessage({ type: "success", text: "Profile created" });
      setEditMode("view"); // close create
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: MergedUser) => {
    if (!confirm(`Delete ${user.full_name} permanently?`)) return;
    setSaving(true);
    setMessage(null);
    try {
      await callAdminApi({ action: "delete-user", userId: user.id });
      setMessage({ type: "success", text: "User deleted" });
      closePanel();
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: "Delete failed: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const statusIcon = (active: boolean | string | undefined) => {
    const s = active === true || active === "true" || active === "active" ? STATUS_ACTIVE : STATUS_SUSPENDED;
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${s.class}`}>{s.label}</span>;
  };

  const inputClass = "block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition";
  const labelClass = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1";

  const userFormFields = [
    { label: "Full Name", name: "full_name", type: "text", required: true, colSpan: true },
    { label: "Title", name: "title", type: "text" },
    { label: "First Name", name: "firstname", type: "text" },
    { label: "Last Name", name: "lastname", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Country Code", name: "country_code", type: "text" },
    { label: "Nationality", name: "nationality", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "City", name: "city", type: "text" },
    { label: "State", name: "state", type: "text" },
    { label: "Zip", name: "zip", type: "text" },
    { label: "DOB", name: "dob", type: "date" },
    { label: "Occupation", name: "occupation", type: "text" },
    { label: "SSN", name: "ssn", type: "text" },
    { label: "Marital Status", name: "marital_status", type: "text" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Users</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all registered users</p>
          </div>
          <button onClick={() => { setSelectedUser(null); setEditMode("create"); }} className="bg-brand-sun hover:bg-brand-navy text-white px-4 py-2 rounded-xl text-sm transition-colors">
            <i className="fa-regular fa-plus mr-1" /> Create
          </button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
          {message.text}
        </div>
      )}

      {/* Search */}
      <input type="text" placeholder="Search by name, email or account number..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition max-w-md"
      />

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                  <th className="text-left py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">Acct #</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">Balance</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} onClick={() => openUser(u)}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-sun/5 dark:hover:bg-brand-sun/10 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-navy/10 dark:bg-brand-navy/30 flex items-center justify-center text-[10px] font-medium text-brand-navy dark:text-brand-light shrink-0 overflow-hidden">
                          {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : u.full_name?.charAt(0) || "?"}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="py-3 px-3 font-mono text-gray-600 dark:text-gray-400">{u.account_number}</td>
                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{formatCurrency(u.balance)}</td>
                    <td className="py-3 px-3">{statusIcon(u.account_is_active)}</td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(u.last_login)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">{search ? "No users match" : "No users found"}</p>
        )}
      </div>

      {/* User Detail / Edit Slide-over Panel */}
      {(selectedUser || editMode === "create") && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closePanel} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-slide-up md:animate-fade-in">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editMode === "create" ? "Create User" : selectedUser?.full_name}
              </h2>
              <button onClick={closePanel} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {editMode === "create" ? (
                /* Create Form */
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userFormFields.map((f) => (
                      <div key={f.name} className={f.colSpan ? "md:col-span-2" : ""}>
                        <label className={labelClass}>{f.label}</label>
                        <input type={f.type} name={f.name} required={f.required}
                          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                        />
                      </div>
                    ))}
                    <div>
                      <label className={labelClass}>Gender</label>
                      <select name="gender" className={inputClass}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Account Type</label>
                      <select name="account_type" className={inputClass}>
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
                      <select name="is_active" className={inputClass}>
                        <option value="true">Active</option>
                        <option value="false">Suspended</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Email</label>
                      <input type="email" name="email" required className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Password</label>
                      <input type="password" name="password" required className={inputClass} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={closePanel} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm">Cancel</button>
                    <button type="submit" disabled={saving} className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm transition-colors">
                      {saving ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Creating...</> : "Create"}
                    </button>
                  </div>
                </form>
              ) : editMode === "view" && selectedUser ? (
                /* View Mode */
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-sun to-brand-navy flex items-center justify-center text-white text-xl font-medium shrink-0 overflow-hidden">
                      {selectedUser.avatar_url ? <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" /> : selectedUser.full_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{selectedUser.full_name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{selectedUser.phone || "No phone"}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Account</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{selectedUser.account_number}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Balance</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedUser.balance)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Type</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedUser.account_type}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Status</p>
                      <p>{statusIcon(selectedUser.account_is_active)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode("edit")} className="flex-1 bg-brand-sun hover:bg-brand-navy text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                      <i className="fa-solid fa-pen mr-1" /> Edit Profile
                    </button>
                    <button onClick={() => handleDelete(selectedUser)} className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors">
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </div>
                </div>
              ) : editMode === "edit" && selectedUser ? (
                /* Edit Mode */
                <div className="space-y-5">
                  {/* Avatar Upload */}
                  <div>
                    <label className={labelClass}>Profile Picture</label>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl text-gray-400 shrink-0 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                        {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> :
                          selectedUser.avatar_url ? <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" /> :
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
                      <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      />
                      <button onClick={handleSaveEmail} disabled={emailSaving || newEmail === selectedUser.email}
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
                        placeholder="Min 6 characters" maxLength={100}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      />
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
                      {userFormFields.map((f) => (
                        <div key={f.name} className={f.colSpan ? "md:col-span-2" : ""}>
                          <label className={labelClass}>{f.label}</label>
                          <input type={f.type} value={formData[f.name] || ""} required={f.required}
                            onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                          />
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

                  {/* Cancel / Back */}
                  <button onClick={() => setEditMode("view")} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    Back to View
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
