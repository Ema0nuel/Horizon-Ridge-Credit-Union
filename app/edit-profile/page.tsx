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
  country_code?: string;
  nationality?: string;
  title?: string;
  firstname?: string;
  lastname?: string;
  ssn?: string;
}

interface Account {
  id: string;
  balance: number;
  account_number: string;
  account_type: string;
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

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile-tab");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Edit profile form state
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");
  const [dob, setDob] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ssn, setSsn] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);

  // KYC state
  const [kycIdType, setKycIdType] = useState("");
  const [kycIdNumber, setKycIdNumber] = useState("");
  const [kycFrontFile, setKycFrontFile] = useState<File | null>(null);
  const [kycBackFile, setKycBackFile] = useState<File | null>(null);
  const [kycSelfieFile, setKycSelfieFile] = useState<File | null>(null);
  const [kycProofFile, setKycProofFile] = useState<File | null>(null);
  const [kycSubmitting, setKycSubmitting] = useState(false);

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

        const p = profileRes.data;
        setProfile(p);
        setAccount(accountRes.data);

        setFullName(p.full_name || "");
        setTitle(p.title || "");
        setFirstname(p.firstname || "");
        setLastname(p.lastname || "");
        setPhone(p.phone || "");
        setCountryCode(p.country_code || "");
        setNationality(p.nationality || "");
        setAddress(p.address || "");
        setCity(p.city || "");
        setStateVal(p.state || "");
        setZip(p.zip_code || "");
        setDob(p.dob || "");
        setOccupation(p.occupation || "");
        setSsn(p.ssn || "");
        setMaritalStatus(p.marital_status || "");
        setGender(p.gender || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      showToast("No file selected.", "error");
      return;
    }
    setAvatarUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, avatarFile, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(data.path);

      const avatarUrl = urlData?.publicUrl;
      if (!avatarUrl) throw new Error("Failed to get image URL");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      showToast("Profile picture updated!", "success");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      showToast("Failed to upload image: " + err.message, "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates: Record<string, string> = {};

      const fieldMap: [string, string, string][] = [
        ["full_name", fullName, ""],
        ["title", title, ""],
        ["firstname", firstname, ""],
        ["lastname", lastname, ""],
        ["phone", phone, ""],
        ["country_code", countryCode, ""],
        ["nationality", nationality, ""],
        ["address", address, ""],
        ["city", city, ""],
        ["state", stateVal, ""],
        ["zip_code", zip, ""],
        ["dob", dob, ""],
        ["occupation", occupation, ""],
        ["ssn", ssn, ""],
        ["marital_status", maritalStatus, ""],
        ["gender", gender, ""],
      ];

      for (const [key, value] of fieldMap) {
        if (value.trim()) updates[key] = value.trim();
      }

      if (Object.keys(updates).length === 0) {
        showToast("No changes to save.", "info");
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: profile?.email,
          subject: "Profile Updated",
          html: `<p>Hello <b>${updates.full_name || profile?.full_name}</b>,<br>Your profile was successfully updated.</p>`,
        }),
      });

      showToast("Profile updated successfully!", "success");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      showToast("Profile update failed: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycIdType || !kycIdNumber || !kycFrontFile || !kycBackFile || !kycSelfieFile || !kycProofFile) {
      showToast("Please fill all KYC fields and upload all required files.", "error");
      return;
    }
    setKycSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const uploadFile = async (file: File, prefix: string): Promise<string> => {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/kyc/${prefix}_${Date.now()}.${ext}`;
        const { data, error } = await supabase.storage.from("kyc-documents").upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("kyc-documents").getPublicUrl(data.path);
        return urlData?.publicUrl || "";
      };

      const [frontUrl, backUrl, selfieUrl, proofUrl] = await Promise.all([
        uploadFile(kycFrontFile, "front"),
        uploadFile(kycBackFile, "back"),
        uploadFile(kycSelfieFile, "selfie"),
        uploadFile(kycProofFile, "proof"),
      ]);

      const { error: insertError } = await supabase.from("kyc_submissions").insert([
        {
          user_id: user.id,
          id_type: kycIdType,
          id_number: kycIdNumber,
          front_image: frontUrl,
          back_image: backUrl,
          selfie_image: selfieUrl,
          proof_address: proofUrl,
          status: "pending",
        },
      ]);

      if (insertError) throw insertError;

      showToast("KYC submitted successfully!", "success");
    } catch (err: any) {
      showToast("KYC submission failed: " + err.message, "error");
    } finally {
      setKycSubmitting(false);
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

  const tabs = [
    { id: "profile-tab", label: "Profile", icon: "fa-user" },
    { id: "settings-tab", label: "Settings", icon: "fa-gear" },
    { id: "kyc-tab", label: "KYC", icon: "fa-id-card" },
  ];

  return (
    <DashboardShell>
      <div className="font-sans min-h-screen">
        <div className="max-w-4xl mx-auto py-6 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs mb-4">
            <i className="fa fa-home text-gray-500"></i>
            <span className="text-gray-500">/</span>
            <Link href="/profile" className="text-brand-sun hover:underline">Profile</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">Edit Profile</span>
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-brand-navy dark:text-white">Edit Profile</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Manage your personal information and preferences.
            </p>
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
                    <i className={`fa ${tab.icon} mr-2`}></i> {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile-tab" && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex flex-col items-center">
                <div className="relative">
                  <img
                    id="avatar-img"
                    src={avatarPreview || profile?.avatar_url || "/images/user/user.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-gray-200 dark:border-gray-700"
                  />
                  {avatarUploading && (
                    <div id="avatar-spinner" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                      <i className="fa fa-spinner fa-spin text-white text-xl"></i>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-col items-center gap-2">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                  >
                    <i className="fa fa-camera mr-1"></i> Change Photo
                  </button>
                  {avatarFile && (
                    <button
                      onClick={handleAvatarUpload}
                      disabled={avatarUploading}
                      className="px-3 py-1 rounded bg-brand-sun text-white text-xs font-semibold hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {avatarUploading ? <i className="fa fa-spinner fa-spin"></i> : "Upload"}
                    </button>
                  )}
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  <p className="font-semibold">{profile?.full_name}</p>
                  <p>{profile?.email}</p>
                </div>
              </div>
              <div className="md:w-3/4 bg-white dark:bg-brand-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
                  <i className="fa fa-square mr-1"></i> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-500 mb-1">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mr/Mrs/Ms" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">First Name</label>
                    <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="John" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Last Name</label>
                    <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Doe" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Country Code</label>
                    <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="US" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Nationality</label>
                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="American" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">State</label>
                    <input type="text" value={stateVal} onChange={(e) => setStateVal(e.target.value)} placeholder="NY" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">ZIP Code</label>
                    <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="10001" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Occupation</label>
                    <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Engineer" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">SSN</label>
                    <input type="text" value={ssn} onChange={(e) => setSsn(e.target.value)} placeholder="XXX-XX-XXXX" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Marital Status</label>
                    <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                      <option value="">Select...</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    id="save-profile-btn"
                    onClick={handleEditProfileSubmit}
                    disabled={saving}
                    className="inline-flex items-center px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fa fa-save mr-1"></i>
                    <span>Save Changes</span>
                    {saving && <i className="fa fa-spinner fa-spin ml-2"></i>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings-tab" && (
            <form id="edit-profile-form" onSubmit={handleEditProfileSubmit} className="space-y-4 max-w-xl mx-auto mt-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                <i className="fa fa-square mr-1"></i> Change Detail
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa fa-save mr-1"></i>
                  <span>Save Changes</span>
                  {saving && <i className="fa fa-spinner fa-spin ml-2"></i>}
                </button>
              </div>
            </form>
          )}

          {/* KYC Tab */}
          {activeTab === "kyc-tab" && (
            <form id="kyc-form" onSubmit={handleKycSubmit} className="space-y-4 max-w-xl mx-auto mt-6" encType="multipart/form-data" autoComplete="off">
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                <i className="fa fa-id-card mr-1"></i> KYC Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">ID Type</label>
                  <select value={kycIdType} onChange={(e) => setKycIdType(e.target.value)} className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition">
                    <option value="">Select ID Type</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">Driver&apos;s License</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">ID Number</label>
                  <input type="text" value={kycIdNumber} onChange={(e) => setKycIdNumber(e.target.value)} placeholder="Enter ID number" className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Upload Front of ID</label>
                  <input type="file" accept="image/*" onChange={(e) => setKycFrontFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-sun file:text-white" />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Upload Back of ID</label>
                  <input type="file" accept="image/*" onChange={(e) => setKycBackFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-sun file:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Selfie with ID</label>
                  <input type="file" accept="image/*" onChange={(e) => setKycSelfieFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-sun file:text-white" />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-gray-600 dark:text-gray-400">Proof of Address</label>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => setKycProofFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-brand-sun file:text-white" />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  id="kyc-submit-btn"
                  disabled={kycSubmitting}
                  className="px-6 py-2 rounded-lg bg-brand-sun text-white text-sm font-semibold shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa fa-paper-plane mr-1"></i>
                  <span>Submit KYC</span>
                  {kycSubmitting && <i className="fa fa-spinner fa-spin ml-2"></i>}
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
    </DashboardShell>
  );
}
