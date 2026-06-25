"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name: string;
  email: string;
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
  balance: number;
  is_active: boolean;
}

interface LoginOtp {
  user_id: string;
  created_at: string;
}

interface MergedUser extends Profile {
  account_type: string;
  is_active: boolean;
  last_login: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<MergedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<MergedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<MergedUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<MergedUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  useEffect(() => {
    if (!sessionStorage.getItem("admin_logged_in")) {
      window.location.href = "/admin-login";
      return;
    }

    const supabase = createClient();
    (async () => {
      const [pRes, aRes, lRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("accounts").select("*"),
        supabase.from("login_otps").select("*"),
      ]);
      const profilesData = (pRes.data || []) as Profile[];
      const accountsData = (aRes.data || []) as Account[];
      const logins = (lRes.data || []) as LoginOtp[];

      const merged: MergedUser[] = profilesData.map((u) => {
        const acc = accountsData.find((a) => a.user_id === u.id);
        const userLogins = logins.filter((l) => l.user_id === u.id);
        const lastLogin =
          userLogins.length > 0
            ? userLogins.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )[0].created_at
            : u.created_at;
        return {
          ...u,
          account_type: acc?.account_type || "-",
          is_active: acc?.is_active !== false && u.is_active !== false,
          last_login: lastLogin,
        };
      });

      setUsers(merged);
      setFilteredUsers(merged);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const q = search.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            (u.full_name && u.full_name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase()).includes(q)
        )
      );
    }
  }, [search, users]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

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
      setMessage({ type: "success", text: "Profile created and email sent" });
      setShowCreateModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          full_name: data.full_name as string,
          title: data.title as string,
          firstname: data.firstname as string,
          lastname: data.lastname as string,
          phone: data.phone as string,
          country_code: data.country_code as string,
          nationality: data.nationality as string,
          address: data.address as string,
          city: data.city as string,
          state: data.state as string,
          zip: data.zip as string,
          dob: data.dob as string,
          occupation: data.occupation as string,
          ssn: data.ssn as string,
          marital_status: data.marital_status as string,
          gender: data.gender as string,
        })
        .eq("id", editUser.id);

      await supabase
        .from("accounts")
        .update({
          account_type: data.account_type as string,
          is_active: (data.is_active as string) === "true",
        })
        .eq("user_id", editUser.id);

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: editUser.email,
          subject: "Profile Updated",
          html: `<p>Hello <b>${data.full_name}</b>,<br>Your profile was updated by an admin.</p>`,
        }),
      });

      setMessage({ type: "success", text: "Profile updated" });
      setEditUser(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      await supabase.from("login_otps").delete().eq("user_id", deleteUser.id);
      await supabase.from("accounts").delete().eq("user_id", deleteUser.id);
      await supabase.from("profiles").delete().eq("id", deleteUser.id);

      const projectUrl = "https://wcwngxofjczpbfprrsdx.supabase.co";
      const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";
      await fetch(`${projectUrl}/auth/v1/admin/users/${deleteUser.id}`, {
        method: "DELETE",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
      });

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: deleteUser.email,
          subject: "Profile Deleted",
          html: `<p>Hello <b>${deleteUser.full_name}</b>,<br>Your profile has been deleted by an admin.</p>`,
        }),
      });

      setMessage({ type: "success", text: "Profile deleted" });
      setDeleteUser(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to delete user: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
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

  const statusIcon = (status: boolean | string | undefined) => {
    if (status === true || status === "true" || status === "active") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
        Suspended
      </span>
    );
  };

  // Create/Edit modal form fields config
  const userFormFields = [
    { label: "Full Name", name: "full_name", type: "text", required: true },
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

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/admin/dashboard" className="hover:text-brand-sun">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">Users</span>
        </nav>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage all registered users
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
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition w-full md:w-64"
        />
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-brand-sun hover:bg-brand-navy text-white px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <i className="fa-regular fa-plus mr-1" />
          Create Profile
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">#</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Full Name</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Account Type</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Last Login</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="py-2.5 px-2">
                      <a
                        href={`/admin/user-details/${u.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-brand-sun"
                      >
                        {u.full_name}
                      </a>
                    </td>
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="py-2.5 px-2">{statusIcon(u.is_active)}</td>
                    <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400">
                      {u.account_type || "-"}
                    </td>
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(u.last_login)}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditUser(u)}
                          className="bg-brand-sun hover:bg-brand-navy text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteUser(u)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-[10px] transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            {search ? "No users match your search" : "No users found"}
          </p>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create User Profile
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userFormFields.map((f) => (
                  <div key={f.name} className={f.name === "full_name" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Type
                  </label>
                  <select
                    name="account_type"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="">Select</option>
                    <option value="USD SAVING">USD SAVING</option>
                    <option value="USD CURRENT">USD CURRENT</option>
                    <option value="MONEY MARKET">MONEY MARKET</option>
                    <option value="IRA">IRA</option>
                    <option value="INVESTMENT ACCOUNT">INVESTMENT ACCOUNT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="is_active"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm transition-colors"
                >
                  {saving ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Creating...</> : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 p-6 relative animate-fade-in">
            <button
              onClick={() => setEditUser(null)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit User Profile
            </h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userFormFields.map((f) => (
                  <div key={f.name} className={f.name === "full_name" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      defaultValue={(editUser as any)[f.name] || ""}
                      required={f.required}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    defaultValue={editUser.gender || ""}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Type
                  </label>
                  <select
                    name="account_type"
                    defaultValue={editUser.account_type || ""}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="">Select</option>
                    <option value="USD SAVING">USD SAVING</option>
                    <option value="USD CURRENT">USD CURRENT</option>
                    <option value="MONEY MARKET">MONEY MARKET</option>
                    <option value="IRA">IRA</option>
                    <option value="INVESTMENT ACCOUNT">INVESTMENT ACCOUNT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="is_active"
                    defaultValue={editUser.is_active ? "true" : "false"}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  >
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editUser.email || ""}
                    disabled
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-600 px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 placeholder-gray-400 cursor-not-allowed transition"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-sun hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm transition-colors"
                >
                  {saving ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative animate-fade-in">
            <button
              onClick={() => setDeleteUser(null)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Profile
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteUser.full_name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteUser(null)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm transition-colors"
              >
                {saving ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Deleting...</> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
