"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import DashboardShell from "@/components/DashboardShell";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface Account {
  id: string;
  account_type: string;
  account_number: string;
  balance: number;
  is_active: boolean;
  interest_rate: number;
}

const fmt = (v: number | null | undefined) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      })
    : "$0.00";

export default function DepositPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deposit form state
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [method, setMethod] = useState<"bank" | "gift">("bank");
  const [giftImage, setGiftImage] = useState<File | null>(null);
  const [giftImagePreview, setGiftImagePreview] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingDeposit, setPendingDeposit] = useState<{
    amount: number;
    desc: string;
    method: string;
    imageUrl: string | null;
    couponCode: string | null;
    otp: string;
    balance_before: number;
    balance_after: number;
  } | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Exchange rates state
  const [rates, setRates] = useState<{ USD: number; EUR: number; GBP: number; JPY: number }>({
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 157.2,
  });

  const supabase = createClient();

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

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
        showToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setRates((prev) => ({
        ...prev,
        EUR: +(0.90 + Math.random() * 0.04).toFixed(4),
        GBP: +(0.76 + Math.random() * 0.04).toFixed(4),
        JPY: +(155 + Math.random() * 5).toFixed(2),
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [router, supabase]);

  const handleGiftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setGiftImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGiftImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setGiftImagePreview(null);
    }
  };

  const sendOtpEmail = async (to: string, fullName: string, amount: number, desc: string, otp: string) => {
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#f9f9f9;padding:24px;border-radius:8px;">
        <h2 style="color:#2563eb;">Deposit OTP Verification</h2>
        <p>Hello <b>${fullName}</b>,</p>
        <p>Your OTP for deposit of <b>${fmt(amount)}</b> is:</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:4px;color:#16a34a;margin:16px 0;">${otp}</div>
        <p>For: <b>${desc}</b></p>
        <p>Account: <b>${account?.account_number}</b></p>
        <p style="color:#888;font-size:12px;">If you did not initiate this, please contact support immediately.</p>
        <hr style="margin:16px 0;">
        <div style="font-size:11px;color:#aaa;">Horizon Ridge Credit Union</div>
      </div>`;
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject: "Deposit OTP Verification - Horizon Ridge", html }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to send OTP email"); }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 200) { showToast("Minimum deposit is $200", "error"); return; }
    if (!desc.trim()) { showToast("Description is required", "error"); return; }
    if (method === "gift") {
      if (!giftImage) { showToast("Gift card image is required", "error"); return; }
      if (!couponCode.trim()) { showToast("Coupon code is required", "error"); return; }
    }

    setSubmitting(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const balance_before = account?.balance ?? 0;
      const balance_after = balance_before + amountNum;
      let imageUrl = null, finalCouponCode = null;

      if (method === "gift") {
        const file = giftImage!;
        const uploadPath = `${profile?.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from("gift-cards").upload(uploadPath, file);
        if (uploadError) { showToast("Failed to upload gift card image", "error"); return; }
        const { data: urlData } = supabase.storage.from("gift-cards").getPublicUrl(uploadPath);
        imageUrl = urlData.publicUrl;
        finalCouponCode = couponCode.trim();
      }

      await sendOtpEmail(profile!.email, profile!.full_name, amountNum, desc, otpCode);
      showToast(`OTP sent to ${profile!.email}`, "info");

      setPendingDeposit({ amount: amountNum, desc: desc.trim(), method, imageUrl, couponCode: finalCouponCode, otp: otpCode, balance_before, balance_after });
      setOtp("");
      setShowOtpModal(true);
    } catch (err: any) {
      showToast(err.message || "Failed to process deposit", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== pendingDeposit?.otp) { showToast("Invalid OTP!", "error"); return; }
    setOtpSubmitting(true);
    try {
      const { error: txError } = await supabase.from("transactions").insert([{
        account_id: account?.id, user_id: profile?.id, type: "deposit",
        amount: pendingDeposit!.amount, description: pendingDeposit!.desc,
        balance_before: pendingDeposit!.balance_before, balance_after: pendingDeposit!.balance_after, status: "pending",
      }]);
      if (txError) throw txError;

      if (pendingDeposit!.method === "gift") {
        const { error: giftError } = await supabase.from("gift_card_deposits").insert([{
          user_id: profile?.id, image_url: pendingDeposit!.imageUrl,
          coupon_code: pendingDeposit!.couponCode, amount: pendingDeposit!.amount, status: "pending",
        }]);
        if (giftError) throw giftError;
      }

      showToast("Deposit submitted and pending approval.", "success");
      setShowOtpModal(false);
      setAmount(""); setDesc(""); setMethod("bank"); setGiftImage(null); setGiftImagePreview(null); setCouponCode("");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      showToast("Deposit failed: " + err.message, "error");
    } finally {
      setOtpSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <i className="fa fa-spinner fa-spin text-3xl text-brand-sun mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg mx-4 mt-4"><p>{error}</p></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="px-4 py-4 md:p-6 max-w-3xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            toast.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800" :
            toast.type === "error" ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800" :
            "bg-brand-navy/5 dark:bg-brand-navy/20 text-brand-navy dark:text-brand-light border border-brand-navy/20 dark:border-brand-navy/50"
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === "success" && <i className="fa-solid fa-circle-check text-green-500" />}
              {toast.type === "error" && <i className="fa-solid fa-circle-exclamation text-red-500" />}
              {toast.type === "info" && <i className="fa-solid fa-circle-info text-brand-sun" />}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Deposit Funds</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add money to your account</p>
        </div>

        {/* Compact Account Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-sun/10 dark:bg-brand-sun/20 flex items-center justify-center">
                <i className="fa-solid fa-briefcase text-brand-sun text-sm" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Available Balance</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">{fmt(account?.balance)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{account?.account_type || "USD SAVING"}</p>
              <p className={`text-[10px] font-medium ${account?.is_active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {account?.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Rates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white">Deposit</h3>
            <div className="flex gap-3 text-[10px] text-gray-500 dark:text-gray-400">
              <span>EUR: <span className="font-semibold text-gray-700 dark:text-gray-200">{rates.EUR}</span></span>
              <span>GBP: <span className="font-semibold text-gray-700 dark:text-gray-200">{rates.GBP}</span></span>
              <span>JPY: <span className="font-semibold text-gray-700 dark:text-gray-200">{rates.JPY}</span></span>
            </div>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (USD)</label>
              <input
                type="number" min="200" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                placeholder="$500" required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <textarea
                value={desc} onChange={(e) => setDesc(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition resize-none"
                placeholder="What is this deposit for?" rows={2} required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Method</label>
              <select
                value={method} onChange={(e) => setMethod(e.target.value as "bank" | "gift")}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              >
                <option value="bank">Bank Transfer</option>
                <option value="gift">Gift Card Coupon</option>
              </select>
            </div>

            {method === "gift" && (
              <div className="space-y-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gift Card Image</label>
                  <input
                    type="file" accept="image/*" onChange={handleGiftImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-brand-sun/10 file:text-brand-sun hover:file:bg-brand-sun/20"
                  />
                  {giftImagePreview && (
                    <img src={giftImagePreview} alt="Gift card preview" className="mt-2 rounded-lg w-24 h-16 object-cover border border-gray-200 dark:border-gray-700" />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Coupon Code</label>
                  <input
                    type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Enter code" maxLength={50}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {submitting ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Processing...</> : <><i className="fa-solid fa-check mr-1" /> Deposit</>}
              </button>
              <button type="reset"
                onClick={() => { setAmount(""); setDesc(""); setMethod("bank"); setGiftImage(null); setGiftImagePreview(null); setCouponCode(""); }}
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* OTP Bottom Sheet */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowOtpModal(false)} />
            <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6 md:pb-4">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="px-6 pt-2 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">OTP Verification</h4>
                  <button onClick={() => setShowOtpModal(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <i className="fa-solid fa-xmark text-lg" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Enter the 6-digit code sent to {profile?.email || "your email"}
                </p>
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-lg text-center tracking-[0.5em] font-mono text-brand-navy dark:text-brand-light placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      placeholder="000000" maxLength={6} required autoFocus
                    />
                  </div>
                  <button type="submit" disabled={otpSubmitting || otp.length !== 6}
                    className="w-full py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {otpSubmitting ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Confirming...</> : "Confirm Deposit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-4">
          Copyright &copy; {new Date().getFullYear()} All rights reserved | Horizon Ridge Credit Union.
        </footer>
      </div>
    </DashboardShell>
  );
}
