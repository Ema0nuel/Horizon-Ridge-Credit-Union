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

  // Supabase client
  const supabase = createClient();

  // Show toast
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Check session and fetch profile/account
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
        showToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Start rates ticker
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

  // Handle gift image change
  const handleGiftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setGiftImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGiftImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setGiftImagePreview(null);
    }
  };

  // Handle deposit form submit
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 200) {
      showToast("Minimum deposit is $200", "error");
      return;
    }

    if (!desc.trim()) {
      showToast("Description is required", "error");
      return;
    }

    if (method === "gift") {
      if (!giftImage) {
        showToast("Gift card image is required", "error");
        return;
      }
      if (!couponCode.trim()) {
        showToast("Coupon code is required", "error");
        return;
      }
    }

    setSubmitting(true);

    try {
      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Prepare pending deposit data
      const balance_before = account?.balance ?? 0;
      const balance_after = balance_before + amountNum;

      let imageUrl = null;
      let finalCouponCode = null;

      if (method === "gift") {
        // Upload gift card image to Supabase storage
        const file = giftImage!;
        const uploadPath = `${profile?.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("gift-cards")
          .upload(uploadPath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          showToast("Failed to upload gift card image", "error");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("gift-cards")
          .getPublicUrl(uploadPath);
        imageUrl = urlData.publicUrl;
        finalCouponCode = couponCode.trim();
      }

      // Send OTP email
      await sendOtpEmail(profile!.email, profile!.full_name, amountNum, desc, otpCode);
      showToast(`OTP sent to ${profile!.email}`, "info");

      // Set pending deposit and show OTP modal
      setPendingDeposit({
        amount: amountNum,
        desc: desc.trim(),
        method,
        imageUrl,
        couponCode: finalCouponCode,
        otp: otpCode,
        balance_before,
        balance_after,
      });
      setOtp("");
      setShowOtpModal(true);
    } catch (err: any) {
      console.error("Deposit error:", err);
      showToast(err.message || "Failed to process deposit", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Send OTP email function
  const sendOtpEmail = async (
    to: string,
    fullName: string,
    amount: number,
    desc: string,
    otp: string
  ) => {
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
      </div>
    `;

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        subject: "Deposit OTP Verification - Horizon Ridge",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send OTP email");
    }
  };

  // Handle OTP form submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp !== pendingDeposit?.otp) {
      showToast("Invalid OTP!", "error");
      return;
    }

    setOtpSubmitting(true);

    // Proceed with deposit
    try {
      // Insert transaction
      const { error: txError } = await supabase.from("transactions").insert([{
        account_id: account?.id,
        user_id: profile?.id,
        type: "deposit",
        amount: pendingDeposit!.amount,
        description: pendingDeposit!.desc,
        balance_before: pendingDeposit!.balance_before,
        balance_after: pendingDeposit!.balance_after,
        status: "pending",
      }]);

      if (txError) throw txError;

      // If gift card, also insert into gift_card_deposits
      if (pendingDeposit!.method === "gift") {
        const { error: giftError } = await supabase.from("gift_card_deposits").insert([{
          user_id: profile?.id,
          image_url: pendingDeposit!.imageUrl,
          coupon_code: pendingDeposit!.couponCode,
          amount: pendingDeposit!.amount,
          status: "pending",
        }]);
        if (giftError) throw giftError;
      }

      // Send success email
      await sendDepositEmail(
        profile!.email,
        profile!.full_name,
        pendingDeposit!.amount,
        pendingDeposit!.desc,
        pendingDeposit!.method,
        pendingDeposit!.imageUrl,
        pendingDeposit!.couponCode
      );

      // Show success
      showToast("Deposit submitted and pending approval.", "success");
      setShowOtpModal(false);
      // Reset form
      setAmount("");
      setDesc("");
      setMethod("bank");
      setGiftImage(null);
      setGiftImagePreview(null);
      setCouponCode("");
      // Optionally reload
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      console.error("Deposit error:", err);
      showToast("Deposit failed: " + err.message, "error");
    } finally {
      setOtpSubmitting(false);
    }
  };

  // Send deposit email function
  const sendDepositEmail = async (
    to: string,
    fullName: string,
    amount: number,
    desc: string,
    method: string,
    imageUrl: string | null,
    couponCode: string | null
  ) => {
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#f9f9f9;padding:24px;border-radius:8px;">
        <h2 style="color:#2563eb;">Deposit Request Initiated</h2>
        <p>Hello <b>${fullName}</b>,</p>
        <p>Your deposit request has been received:</p>
        <ul style="margin:12px 0 16px 18px;padding:0;font-size:15px;">
          <li><b>Amount:</b> ${fmt(amount)}</li>
          <li><b>Description:</b> ${desc}</li>
          <li><b>Account:</b> ${account?.account_number}</li>
          <li><b>Date/Time:</b> ${new Date().toLocaleString()}</li>
        </ul>
        <p style="color:#888;font-size:12px;">We will notify you once your deposit is confirmed.</p>
        <hr style="margin:16px 0;">
        <div style="font-size:11px;color:#aaa;">Horizon Ridge Credit Union</div>
      </div>
    `;

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[80vh]">
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
        <div className="p-6 text-red-500 bg-red-50 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className={`mb-4 p-4 rounded-lg ${toast.type === "success" ? "bg-green-50 dark:bg-green-900/20" : toast.type === "error" ? "bg-red-50 dark:bg-red-900/20" : "bg-brand-navy/5 dark:bg-brand-navy/20"} border ${toast.type === "success" ? "border-green-200 dark:border-green-800" : toast.type === "error" ? "border-red-200 dark:border-red-800" : "border-brand-navy/20 dark:border-brand-navy/50"}`}>
            <div className="flex items-start">
              {toast.type === "success" && <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-3" />}
              {toast.type === "error" && <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5 mr-3" />}
              {toast.type === "info" && <i className="fa-solid fa-circle-info text-brand-sun mt-0.5 mr-3" />}
              <div>
                <p className={`text-sm font-medium ${toast.type === "success" ? "text-green-800 dark:text-green-300" : toast.type === "error" ? "text-red-800 dark:text-red-300" : "text-brand-navy dark:text-brand-light"}`}>
                  {toast.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/">
            <i className="fa-solid fa-house" />
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200">Deposit</span>
        </nav>

        {/* Account info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Balance</p>
                <h3 className="text-lg font-semibold text-brand-sun dark:text-brand-sun">
                  {fmt(account?.balance)}
                </h3>
              </div>
              <div className="p-2.5 rounded-full bg-brand-sun/10 dark:bg-brand-sun/20">
                <i className="fa-solid fa-briefcase text-brand-sun text-lg" />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Status</p>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {account?.is_active ? "Active" : "Inactive"}
                </h3>
              </div>
              <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30">
                <i className="fa-solid fa-circle-check text-green-500 text-lg" />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Type</p>
                <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {account?.account_type || "USD SAVING"}
                </h3>
              </div>
              <div className="p-2.5 rounded-full bg-orange-50 dark:bg-orange-900/30">
                <i className="fa-solid fa-star text-orange-500 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Exchange rates */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white"><i className="fa-solid fa-bank mr-2"></i> Deposit</h3>
          </div>
          <div className="mb-4">
            <div className="flex gap-4 text-xs">
              <div>USD/EUR: <span className="js-rate font-semibold" data-cur="EUR">{rates.EUR}</span></div>
              <div>USD/GBP: <span className="js-rate font-semibold" data-cur="GBP">{rates.GBP}</span></div>
              <div>USD/JPY: <span className="js-rate font-semibold" data-cur="JPY">{rates.JPY}</span></div>
            </div>
          </div>

          {/* Deposit form */}
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    min="200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="$500"
                    required
                  />
                  <span className="absolute right-2 top-2 text-gray-400"><i className="fa-solid fa-money"></i></span>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1">Description</label>
                <div className="relative">
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Description"
                    required
                  />
                  <span className="absolute right-2 top-2 text-gray-400"><i className="fa-solid fa-envelope"></i></span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1">Deposit Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as "bank" | "gift")}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                required
              >
                <option value="bank">Bank Transfer</option>
                <option value="gift">Gift Card Coupon</option>
              </select>
            </div>

            {/* Gift card section */}
            {method === "gift" && (
              <div id="gift-card-section" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">Gift Card Image</label>
                    <input
                      type="file"
                      id="gift-image"
                      accept="image/*"
                      onChange={handleGiftImageChange}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                    {giftImagePreview && (
                      <img
                        src={giftImagePreview}
                        alt="Gift card preview"
                        className="hidden mt-2 rounded w-32 h-20 object-cover border"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Coupon Code</label>
                    <input
                      type="text"
                      name="coupon_code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1 rounded bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-money"></i>
                )} {submitting ? "Processing..." : "Deposit"}
              </button>
              <button
                type="reset"
                className="btn bg-gray-200 text-gray-700 px-4 py-1 rounded text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  setAmount("");
                  setDesc("");
                  setMethod("bank");
                  setGiftImage(null);
                  setGiftImagePreview(null);
                  setCouponCode("");
                }}
              >
                <i className="fa-solid fa-refresh"></i> Refresh
              </button>
            </div>
          </form>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
              <button
                id="close-otp-modal"
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg"
                onClick={() => setShowOtpModal(false)}
              >
                &times;
              </button>
              <h4 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Deposit OTP Verification</h4>
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-300">
                Enter the OTP sent to your email to confirm your deposit.
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-semibold">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={otpSubmitting}
                    className="px-4 py-1 rounded bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpSubmitting ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-check"></i>
                    )} {otpSubmitting ? "Confirming..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1 rounded bg-gray-200 text-gray-700 text-sm"
                    onClick={() => setShowOtpModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 py-4">
          <p>
            <strong>Copyright © {new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
          </p>
        </footer>
      </div>
    </DashboardShell>
  );
}