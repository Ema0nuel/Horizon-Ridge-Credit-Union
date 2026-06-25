"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { showToast } from "@/components/toast";
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

interface Transaction {
  id: string;
  created_at: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  balance_after: number;
  beneficiary_bank?: string;
  beneficiary_name?: string;
  beneficiary_account?: string;
}

const fmt = (v: number | null | undefined) =>
  typeof v === "number"
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      })
    : "$0.00";

const complexCodes = [
  "AF3K9P2M", "BQ7R4N8L", "CX2J5V1T", "DZ8W6Y3H", "EN4M1K9R",
  "FT5P2L7S", "GV9Q3W8D", "HW6R4T1X", "IJ7N5C2B", "JK8M1V9P",
  "KL2P4R6N", "LM3T5Y7C", "MN8V2B9H", "NP1Q4W6J", "PQ7R3K5L",
  "QR4M8N2T", "RS9P1V5W", "ST2X7C3K", "TV5B8L1M", "VW3N6R9P",
  "WX4T2Y7K", "XY8P5L1N", "YZ1M9V3W", "ZA6Q2R8P", "AB7K4N2T",
  "BC5P9L1V", "CD3R7M4S", "DE8N2T5K", "EF1W6P9L", "FG4X2Y7M",
  "GH9V3C8N", "HI5B1K4T", "IJ2L7P6R", "JK8M3N9W", "KL1T4V2X",
  "LM6Y5P8C", "MN3Q9R1B", "NP7K2L4H", "PQ5T8M1V", "QR2W9P6N",
  "RS4C1X7Y", "ST9L3V5K", "TV6B2P8R", "VW1M4N7C", "WX8T5K2L",
  "XY3P9R1S", "YZ7V4W6N", "ZA2M8P5T", "AB9L1K3X", "BC6R4N2V",
  "CD1T7Y5P", "DE8M2W9C", "EF4K6B1L", "FG3P8V2R", "GH7N1T5S",
  "HI9L4M2K", "IJ2R8Y6P", "JK5V3T7W", "KL1C9N4X", "LM8P2K6V",
  "MN4T1B9R", "NP3W7L5Y", "PQ6M2V8C", "QR9K1P4N", "RS2Y6T3L",
  "ST7V5M1K", "TV8R9L2N", "VW3P1K7T", "WX4Y2C6P", "XY9T5N8R",
  "YZ1L3V7K", "ZA6P2W4X", "AB8R5M9T", "BC2N1K7L", "CD5V8P3Y",
  "DE9T4M2K", "EF1W6C9N", "FG7L3R5T", "GH4P8V2X", "HI2Y1K6M",
  "IJ9N3B7T", "JK5V2T8P", "KL1R4M9W", "LM6C2X5K", "MN8P3Y7L",
  "NP4T1V9R", "PQ7K5L2C", "QR3B8N6M", "RS1P9T4V", "ST5Y2K7L",
  "TV9M3R8P", "VW2C4N1T", "WX7L6P5K", "XY3V8T9R", "YZ4P1K2M",
  "ZA5C8N3L", "AB9T2V7P", "BC1Y4R6K", "CD6L9M3T", "DE2K7P5N",
  "EF8V3C1W", "FG4N6T2P", "GH9R1K5L", "HI3P8M7V", "IJ5T2Y9C",
  "JK7L4V1K", "KL2N8P6R", "LM9C3T5M", "MN4K1W7P", "NP6Y2L8T",
  "PQ1V9R3C", "QR8P5N2M", "RS3T7K4L", "TV6C2Y9V", "VW2M1B8K",
  "WX5P9L3R", "XY7N4T6C", "YZ1K8V2P", "ZA3Y5M7L", "AB8T2C9N",
  "BC4P6R1K", "CD7L3V5M", "DE9N2T8W", "EF5K1Y4P", "FG2R7C6L"
];

const generateReceiptId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "HRCU-";
  for (let i = 0; i < 12; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const generateReceiptHtml = (tx: any, profileName: string) => {
  const { amount, description, receiptId, date, bank, accountName, accountNumber, type, balanceBefore, balanceAfter, status } = tx;
  return `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:20px;">
        <h2 style="margin:0;color:#1e3a8a;font-size:20px;">Withdrawal Receipt</h2>
        <p style="color:#888;font-size:12px;margin:4px 0 0;">${receiptId}</p>
      </div>
      <div style="text-align:center;margin:16px 0;">
        <div style="font-size:28px;font-weight:bold;color:#1e3a8a;">${fmt(amount)}</div>
        <p style="color:#666;font-size:13px;">${description || "Withdrawal"}</p>
      </div>
      <table style="width:100%;font-size:13px;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#888;">Status</td><td style="text-align:right;font-weight:600;color:#16a34a;">${status}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Date</td><td style="text-align:right;">${date}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">From</td><td style="text-align:right;">${profileName}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Bank</td><td style="text-align:right;">${bank}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Account</td><td style="text-align:right;">${accountName} (${accountNumber})</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Type</td><td style="text-align:right;">${type}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Balance Before</td><td style="text-align:right;">${fmt(balanceBefore)}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Balance After</td><td style="text-align:right;">${fmt(balanceAfter)}</td></tr>
      </table>
      <div style="margin-top:16px;padding-top:12px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#aaa;">
        Horizon Ridge Credit Union - Generated Receipt
      </div>
    </div>`;
};

export default function WithdrawalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState<{
    amount: number; desc: string; bank: string; accNum: string; accName: string; type: string;
    otp: string; balance_before: number; balance_after: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    amount: number; description: string; bank: string; accName: string; accNum: string;
    type: string; balanceBefore: number; balanceAfter: number; receiptId: string; date: string; otpRef: string;
  } | null>(null);
  const [codeStep, setCodeStep] = useState<"imf" | "cot" | "vat" | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ amount: number; description: string; receiptId: string; date: string } | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showOtpModal && otpInputRef.current) setTimeout(() => otpInputRef.current?.focus(), 100);
  }, [showOtpModal]);

  useEffect(() => {
    if (codeStep && codeInputRef.current) setTimeout(() => codeInputRef.current?.focus(), 100);
  }, [codeStep]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      try {
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
        showToast("Failed to load profile", "error");
      } finally { setLoading(false); }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const amount = parseFloat((form as any).amount.value);
      const desc = (form as any).desc.value.trim();
      const bank = (form as any).bank.value.trim();
      const accNum = (form as any).account_number.value.trim();
      const accName = (form as any).account_name.value.trim();
      const type = (form as any).type.value;

      if (amount < 200) { showToast("Minimum withdrawal is $200", "error"); return; }
      if (!bank || !accNum || !accName) { showToast("All bank details required.", "error"); return; }

      const balance_before = account?.balance || 0;
      const balance_after = balance_before - amount;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      setOtpData({ amount, desc, bank, accNum, accName, type, otp, balance_before, balance_after });

      try {
        await fetch("/api/send-email", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: profile!.email, subject: "Withdrawal OTP Code - Horizon Ridge",
            html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;background:#f9f9f9;padding:24px;border-radius:8px;">
              <h2 style="color:#1e3a8a;">Withdrawal OTP</h2>
              <p>Dear <b>${profile!.full_name}</b>,</p>
              <p>Use the OTP below to verify your withdrawal:</p>
              <div style="text-align:center;margin:24px 0;">
                <span style="font-size:28px;font-weight:bold;color:#1e3a8a;letter-spacing:6px;background:#f0f0f0;padding:12px 24px;border-radius:8px;">${otp}</span>
              </div>
              <p style="color:#888;font-size:12px;">This OTP expires in 10 minutes.</p>
              <hr style="margin:16px 0;">
              <div style="font-size:11px;color:#aaa;">Horizon Ridge Credit Union</div>
            </div>`,
          }),
        });
      } catch { console.warn("OTP email send failed"); }

      showToast("OTP sent to your email", "info");
      setShowOtpModal(true);
    } finally { setSubmitting(false); }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpData) return;
    const form = e.currentTarget as HTMLFormElement;
    const userOtp = (form as any).otp.value.trim();
    if (userOtp !== otpData.otp) { showToast("Invalid OTP", "error"); return; }

    setShowOtpModal(false);
    const receiptId = generateReceiptId();
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

    setReceiptData({
      amount: otpData.amount, description: otpData.desc, bank: otpData.bank,
      accName: otpData.accName, accNum: otpData.accNum, type: otpData.type,
      balanceBefore: otpData.balance_before, balanceAfter: otpData.balance_after,
      receiptId, date, otpRef: userOtp,
    });
    setShowReceipt(true);
  };

  const verifyCode = async (step: "imf" | "cot" | "vat", inputCode: string): Promise<boolean> => {
    const upperCode = inputCode.toUpperCase().trim();
    if (!upperCode) { setCodeError("No code provided"); return false; }
    const codeIndex = complexCodes.indexOf(upperCode);
    if (codeIndex === -1) { setCodeError(`Invalid ${step.toUpperCase()} code entered`); return false; }
    complexCodes.splice(codeIndex, 1);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
    return true;
  };

  const processTransaction = async () => {
    if (!otpData || !receiptData) return;
    setShowReceipt(false);
    setCodeStep(null);

    try {
      const supabase = createClient();
      const { error: txError } = await supabase.from("transactions").insert({
        user_id: profile!.id, account_id: account!.id, type: "withdrawal",
        description: otpData.desc, amount: otpData.amount, status: "pending",
        balance_after: otpData.balance_after,
      });
      if (txError) throw txError;

      const { error: updateError } = await supabase.from("accounts").update({ balance: otpData.balance_after }).eq("id", account!.id);
      if (updateError) throw updateError;

      await supabase.from("notifications").insert([{
        user_id: profile!.id, title: "Withdrawal Request Submitted",
        message: `Your withdrawal request of ${fmt(otpData.amount)} has been submitted and is pending approval.`,
        type: "info", read: false,
      }]);

      setAccount(prev => ({ ...prev!, balance: otpData.balance_after }));
      setSuccessData({ amount: otpData.amount, description: otpData.desc, receiptId: receiptData.receiptId, date: receiptData.date });
      setShowSuccess(true);
    } catch (err: any) {
      showToast("Failed to process withdrawal: " + err.message, "error");
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeStep || !code.trim()) { setCodeError("Please enter a code"); return; }
    setCodeLoading(true);
    setCodeError(null);
    try {
      const isValid = await verifyCode(codeStep, code);
      if (!isValid) { setCodeLoading(false); return; }
      setCode(""); setCodeLoading(false);
      if (codeStep === "imf") { setCodeStep("cot"); showToast("IMF code verified. Enter COT code.", "success"); }
      else if (codeStep === "cot") { setCodeStep("vat"); showToast("COT code verified. Enter VAT code.", "success"); }
      else if (codeStep === "vat") { setCodeStep(null); showToast("All codes verified. Processing withdrawal.", "success"); await processTransaction(); }
    } catch (err: any) { setCodeError(err.message || "Verification failed"); setCodeLoading(false); }
  };

  const handleReceiptContinue = () => {
    setShowReceipt(false);
    setCodeStep("imf");
    showToast("Enter IMF code to proceed", "info");
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setOtpData(null); setReceiptData(null); setSuccessData(null);
  };

  const codeStepLabel = codeStep === "imf" ? "IMF" : codeStep === "cot" ? "COT" : "VAT";
  const codeStepTitle = codeStep === "imf" ? "International Monetary Fund"
    : codeStep === "cot" ? "Currency Off-shore Transfer" : "Value Added Tax";

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[60vh]">
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
        <div className="p-4 text-center text-red-500 dark:text-red-400">
          <p>{error}</p>
          <Link href="/" className="mt-4 inline-block text-brand-sun hover:text-brand-navy text-sm">Go Home</Link>
        </div>
      </DashboardShell>
    );
  }

  if (!profile || !account) {
    return (
      <DashboardShell>
        <div className="p-4 text-center text-gray-500 dark:text-gray-400"><p>Loading profile...</p></div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="px-4 py-4 md:p-6 max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Withdraw Funds</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Send money to your external bank account</p>
        </div>

        {/* Compact Account Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-sun/10 dark:bg-brand-sun/20 flex items-center justify-center">
                <i className="fa-solid fa-wallet text-brand-sun text-sm" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Available Balance</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">{fmt(account.balance)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{account.account_type}</p>
              <p className={`text-[10px] font-medium ${account.is_active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {account.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Amount (USD)</label>
              <input type="number" name="amount" required min="200" step="0.01"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <input type="text" name="desc" required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                placeholder="Reason for withdrawal"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Bank Name</label>
              <input type="text" name="bank" required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Account Number</label>
                <input type="text" name="account_number" required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Account Name</label>
                <input type="text" name="account_name" required
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Account Type</label>
              <select name="type" required
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              >
                <option value="local">Local Account</option>
                <option value="foreign">Foreign Account</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {submitting ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Processing...</> : <><i className="fa-solid fa-check mr-1" /> Withdraw</>}
              </button>
              <button type="reset"
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* OTP Bottom Sheet */}
        {showOtpModal && otpData && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowOtpModal(false)} />
            <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6 md:pb-4">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="px-6 pt-2 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">OTP Verification</h4>
                  <button onClick={() => setShowOtpModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-xmark text-lg" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Enter the code sent to {profile.email}
                </p>
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <input ref={otpInputRef} type="text" name="otp" required minLength={6} maxLength={6}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-lg text-center tracking-[0.5em] font-mono text-brand-navy dark:text-brand-light placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      placeholder="000000"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowOtpModal(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy disabled:opacity-50"
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Bottom Sheet */}
        {showReceipt && receiptData && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-lg mx-auto shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto pb-6 md:pb-4">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="px-6 pt-2 pb-4">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-brand-sun/10 flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-receipt text-brand-sun text-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Withdrawal Receipt</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{receiptData.receiptId}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(receiptData.amount)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{receiptData.description || "Withdrawal"}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Status</p>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">Pending</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Date</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{receiptData.date}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">From</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{profile.full_name}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Bank</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{receiptData.bank}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Account</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{receiptData.accName} ({receiptData.accNum})</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Bal Before</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{fmt(receiptData.balanceBefore)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 col-span-2">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Bal After</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{fmt(receiptData.balanceAfter)}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={handleReceiptContinue}
                    className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors"
                  >
                    Continue <i className="fa-solid fa-arrow-right ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Verification Bottom Sheet */}
        {codeStep && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6 md:pb-4">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="px-6 pt-2 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${["imf","cot","vat"].includes(codeStep) ? "bg-brand-sun" : "bg-gray-300"}`} />
                    <span className={`w-2 h-2 rounded-full ${["cot","vat"].includes(codeStep) ? "bg-brand-sun" : "bg-gray-300"}`} />
                    <span className={`w-2 h-2 rounded-full ${codeStep === "vat" ? "bg-brand-sun" : "bg-gray-300"}`} />
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-auto">
                    Step {codeStep === "imf" ? "1" : codeStep === "cot" ? "2" : "3"} of 3
                  </span>
                </div>

                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-navy/10 dark:bg-brand-navy/30 flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-shield-halved text-brand-navy dark:text-brand-light text-lg" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">{codeStepLabel} Verification</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{codeStepTitle}</p>
                </div>

                <form onSubmit={handleCodeSubmit} className="space-y-3">
                  <div>
                    <input ref={codeInputRef} type="text" value={code}
                      onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(null); }}
                      required placeholder="e.g. AF3K9P2M"
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-3 text-sm text-center font-mono tracking-widest text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                    {codeError && <p className="text-xs text-red-500 mt-1">{codeError}</p>}
                  </div>
                  <button type="submit" disabled={codeLoading || !code.trim()}
                    className="w-full py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 active:scale-[0.98]"
                  >
                    {codeLoading ? <><i className="fa-solid fa-spinner fa-spin mr-1" /> Verifying...</> : <>Verify {codeStepLabel} Code</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && successData && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl w-full max-w-md mx-auto shadow-2xl animate-slide-up pb-6 md:pb-4">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="px-6 pt-2 pb-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-circle-check text-green-500 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Withdrawal Successful!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Your withdrawal request has been submitted and is pending approval.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4 space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{fmt(successData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Description</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{successData.description || "Withdrawal"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Receipt</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{successData.receiptId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{successData.date}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSuccessClose}
                    className="flex-1 py-3 rounded-xl bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors"
                  >
                    Close
                  </button>
                </div>
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
