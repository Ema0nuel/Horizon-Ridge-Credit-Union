"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { createClient } from "@/lib/supabaseClient";

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

interface OtpRecord {
  id: string;
  user_id: string;
  code: string;
  type: string;
  expires_at: string;
  created_at: string;
}

interface TransactionData {
  bankname: string;
  accountName: string;
  amount: number;
  route: string;
  accountNum: string;
  desc: string;
  fee: number;
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
  "E9876567", "G0876578", "8767898H", "K2387651", "456L7890", "1M234567", "987654N3", "O2345678", "98765P43", "Q1987654",
  "R7654321", "567S1234", "T3456789", "876543U1", "V1234567", "345678W9", "X2345678", "9Y876543", "Z3456781", "234567A8",
  "B3456781", "123456C7", "D2345678", "876E5432", "5678F123", "6789G123", "7890H234", "8901I345", "9012J456", "0123K567",
  "K4561237", "L5672348", "M6783459", "N7894560", "O8905671", "P9016782", "Q0127893", "R1238904", "S2349015", "T3450126",
  "U4561237", "V5672348", "W6783459", "X7894560", "Y8905671", "Z9016782", "A0127893", "B1238904", "C2349015", "D3450126",
  "E4561237", "F5672348", "G6783459", "H7894560", "I8905671", "J9016782", "K0127893", "L1238904", "M2349015", "N3450126",
  "O4561237", "P5672348", "Q6783459", "R7894560", "S8905671", "T9016782", "U0127893", "V1238904", "W2349015", "X3450126",
  "Y4561237", "Z5672348", "A6783459", "B7894560", "C8905671", "D9016782", "E0127893", "F1238904", "G2349015", "H3450126",
  "I4561237", "J5672348", "K6783459", "L7894560", "M8905671", "N9016782", "O0127893", "P1238904", "Q2349015", "R3450126",
  "S4561237", "T5672348", "U6783459", "V7894560", "W8905671", "X9016782", "Y0127893", "Z1238904", "A2349015", "B3450126",
  "C4561237", "D5672348", "E6783459", "F7894560", "G8905671", "H9016782", "I0127893", "J1238904", "K2349015", "L3450126",
  "M4561237", "N5672348", "O6783459", "P7894560", "Q8905671", "R9016782", "S0127893", "T1238904", "U2349015", "V3450126",
  "W4561237", "X5672348", "Y6783459", "Z7894560", "A8905671", "B9016782", "C0127893", "D1238904", "E2349015", "F3450126",
  "G4561237", "H5672348", "I6783459", "J7894560", "K8905671", "L9016782", "M0127893", "N1238904", "O2349015", "P3450126"
];

export default function LocalTransferPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainLoading, setMainLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<TransactionData>({
    bankname: "",
    accountName: "",
    amount: 0,
    route: "",
    accountNum: "",
    desc: "",
    fee: 0,
  });

  // OTP state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Receipt state
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionData & { ipLoc: any } | null>(null);

  // Code verification state (IMF, COT, VAT)
  const [codeStep, setCodeStep] = useState<'imf' | 'cot' | 'vat' | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs for modals (to manage focus, etc.)
  const otpRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

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
        setError(err.message || "Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Calculate fee based on amount (1.5% min 1 max 50)
  const calculateFee = (amount: number) => {
    const fee = Math.max(1, Math.min(50, amount * 0.015));
    return parseFloat(fee.toFixed(2));
  };

  // Update fee when amount changes
  useEffect(() => {
    if (formData.amount) {
      setFormData(prev => ({ ...prev, fee: calculateFee(formData.amount) }));
    } else {
      setFormData(prev => ({ ...prev, fee: 0 }));
    }
  }, [formData.amount]);

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
        <div className="p-6 text-center text-red-500 dark:text-red-400">
          <p>{error}</p>
          <Link href="/" className="mt-4 inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-brand-sun text-white hover:bg-brand-navy">
            <i className="fa-solid fa-house mr-2" /> Back to Dashboard
          </Link>
        </div>
      </DashboardShell>
    );
  }

  if (!profile || !account) {
    return (
      <DashboardShell>
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>Loading profile...</p>
        </div>
      </DashboardShell>
    );
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "amount" || name === "fee" ? (type === "number" ? parseFloat(value) || 0 : parseFloat(value) || 0) : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { bankname, accountName, amount, route, accountNum, desc } = formData;

    if (!bankname || !accountName || !amount || !route || !accountNum || !desc) {
      setError("All fields are required.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const total = amount + formData.fee;
    if (total > account.balance) {
      setError("Insufficient balance.");
      return;
    }

    setMainLoading(true);
    try {
      setOtpLoading(true);
      const supabase = createClient();

      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Insert OTP into database
      const { error: otpError } = await supabase.from("otps").insert([
        {
          user_id: profile.id,
          code: otpCode,
          type: "transfer",
          expires_at: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes
        },
      ]);

      if (otpError) throw otpError;

      // Get IP location
      const ipLoc = await fetchIpLocation();

      // Send OTP email (fire and forget)
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: profile.email,
          subject: "Your OTP for Local Transfer",
          html: `
            <h2>Transaction OTP</h2>
            <p>Your OTP is: <b>${otpCode}</b></p>
            <p>IP: ${ipLoc.ip || "N/A"}<br>
            Location: ${ipLoc.city || ""}, ${ipLoc.region || ""}, ${ipLoc.country_name || ""}<br>
            Date: ${new Date().toLocaleString()}</p>
            <hr>
            <h3>Transaction Details</h3>
            <ul>
              <li>Amount: ${fmt(amount)}</li>
              <li>Sender: ${profile.full_name}</li>
              <li>Bank: ${bankname}</li>
              <li>Beneficiary: ${accountName}</li>
              <li>Account Number: ${accountNum}</li>
              <li>Description: ${desc}</li>
            </ul>
          `,
        }),
      }).catch(err => {
        console.warn("Failed to send OTP email", err);
        // Continue anyway
      });

      setOtpSent(true);
      setOtpLoading(false);
      setReceiptData({ ...formData, ipLoc });
    } catch (err: any) {
      setOtpLoading(false);
      setError(err.message || "Failed to initiate OTP");
      console.error(err);
    } finally {
      setMainLoading(false);
    }
  };

  // Fetch IP location
  const fetchIpLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      return await res.json();
    } catch (err) {
      console.warn("Failed to fetch IP location", err);
      return {};
    }
  };

  // Verify OTP
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpLoading(true);

    try {
      const supabase = createClient();
      const { data: otpRow, error } = await supabase
        .from("otps")
        .select("*")
        .eq("user_id", profile.id)
        .eq("code", otp)
        .eq("type", "transfer")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !otpRow || new Date(otpRow.expires_at) < new Date()) {
        setOtpError("Invalid or expired OTP.");
        setOtpLoading(false);
        return;
      }

      // OTP valid, show receipt
      setOtpLoading(false);
      setShowReceipt(true);
    } catch (err: any) {
      setOtpLoading(false);
      setOtpError(err.message || "Failed to verify OTP");
      console.error(err);
    }
  };

  // Verify code (IMF, COT, VAT)
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    setCodeLoading(true);

    try {
      const isValid = complexCodes.includes(code.trim());
      if (!isValid) {
        setCodeError("Invalid code. Please contact support.");
        setCodeLoading(false);
        return;
      }

      // Move to next step
      if (codeStep === "imf") {
        setCodeStep("cot");
      } else if (codeStep === "cot") {
        setCodeStep("vat");
      } else if (codeStep === "vat") {
        // All codes verified, process transaction
        await processTransaction();
      }

      setCode("");
      setCodeLoading(false);
    } catch (err: any) {
      setCodeLoading(false);
      setCodeError(err.message || "Verification failed");
      console.error(err);
    }
  };

  // Process transaction after all codes verified
  const processTransaction = async () => {
    if (!receiptData) return;

    try {
      setCodeLoading(true);
      const supabase = createClient();

      const amountNum = receiptData.amount;
      const feeNum = receiptData.fee;
      const total = amountNum + feeNum;
      const balanceBefore = account.balance;
      const balanceAfter = balanceBefore - total;

      // Update account balance
      await supabase
        .from("accounts")
        .update({ balance: balanceAfter })
        .eq("id", account.id);

      // Insert transaction
      const { data: txn, error: txnError } = await supabase
        .from("transactions")
        .insert([
          {
            account_id: account.id,
            user_id: profile.id,
            type: "transfer",
            description: receiptData.desc,
            amount: total,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            status: "pending",
            beneficiary_bank: receiptData.bankname,
            beneficiary_name: receiptData.accountName,
            beneficiary_account: receiptData.accountNum,
          },
        ])
        .select()
        .single();

      if (txnError) throw txnError;

      // Insert notification
      await supabase.from("notifications").insert([
        {
          user_id: profile.id,
          title: "Local Transfer Initiated",
          message: `Your local transfer of ${fmt(amountNum)} to ${receiptData.accountName} is awaiting admin approval.`,
          type: "info",
          read: false,
        },
      ]);

      // Send receipt email (fire and forget)
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: profile.email,
          subject: "Local Transfer Receipt",
          html: generateReceiptHtml({
            ...receiptData,
            status: "Pending",
            referenceNumber: txn?.id || generateReceiptId(),
          }),
        }),
      }).catch(err => {
        console.warn("Failed to send receipt email", err);
      });

      setCodeLoading(false);
      setShowSuccess(true);
    } catch (err: any) {
      setCodeLoading(false);
      setCodeError(err.message || "Failed to process transaction");
      console.error(err);
    }
  };

  // Generate receipt ID (same as in original)
  const generateReceiptId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `RCP-${timestamp}-${random}`;
  };

  // Generate receipt HTML (simplified version)
  const generateReceiptHtml = (options: any) => {
    const defaults = {
      title: "Local Transfer Receipt",
      receiptId: generateReceiptId(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      amount: "0.00",
      currency: "$",
      description: "Local Transfer",
      senderName: "",
      recipientName: "",
      bankName: "",
      accountNumber: "",
      transactionType: "Local Transfer",
      status: "Pending",
      referenceNumber: "",
      fees: "0.00",
      totalAmount: "",
      companyName: "Horizon Ridge Credit Union",
      companyAddress: "123 Main St, City, Country",
      companyPhone: "+1 (555) 123-4567",
      companyEmail: "contact@horizonridge.cc",
      additionalFields: {},
      showFooter: true,
      footerText: "Thank you for banking with us!",
    };

    const config = { ...defaults, ...options };
    if (!config.totalAmount) {
      const amount = parseFloat(config.amount) || 0;
      const fees = parseFloat(config.fees) || 0;
      config.totalAmount = (amount + fees).toFixed(2);
    }

    // Simplified HTML for email
    return `
      <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #1e40af;">${config.title}</h2>
          <p style="color: #64748b;">${config.companyName}</p>
          <p style="color: #64748b; font-size: 14px;">${config.companyAddress}</p>
          <p style="color: #64748b; font-size: 14px;">${config.companyPhone} | ${config.companyEmail}</p>
        </div>
        <div style="border-top: 1px dashed #e2e8f0; padding-bottom: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Receipt ID:</span><span>${config.receiptId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Date:</span><span>${config.date}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Time:</span><span>${config.time}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Type:</span><span>${config.transactionType}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Status:</span><span style="color: ${config.status === "Completed" ? "#16a34a" : config.status === "Pending" ? "#f59e42" : "#dc2626"}; font-weight: bold;">
              ${config.status}
            </span>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <h3 style="text-align: center; color: #334155; margin-bottom: 10px;">Transaction Details</h3>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>From:</span><span>${config.senderName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>To:</span><span>${config.recipientName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Bank:</span><span>${config.bankName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Account:</span><span>${config.accountNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Description:</span><span>${config.description}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Reference:</span><span>${config.referenceNumber}</span>
          </div>
        </div>
        <div style="border-top: 1px dashed #e2e8f0; padding-top: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Amount:</span><span>${config.currency}${config.amount}</span>
          </div>
          ${parseFloat(config.fees) > 0 ? `
          <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
            <span>Fees:</span><span>${config.currency}${config.fees}</span>
          </div>` : ""}
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
            <span>Total:</span><span>${config.currency}${config.totalAmount}</span>
          </div>
        </div>
        ${Object.keys(config.additionalFields).length > 0 ? `
        <div style="border-top: 1px dashed #e2e8f0; padding-top: 15px; margin-bottom: 15px;">
          ${Object.entries(config.additionalFields)
            .map(([key, value]: [string, any]) => `
              <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                <span>${key}:</span><span>${value}</span>
              </div>
            `).join("")}
        </div>` : ""}
        ${config.showFooter ? `
        <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #e2e8f0; font-size: 14px; color: #64748b;">
          <div>${config.footerText}</div>
          <div style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
            This is a Horizon-generated receipt
          </div>
        </div>` : ""}
      </div>
    `;
  };

  // Close modals and reset state
  const resetForm = () => {
    setFormData({
      bankname: "",
      accountName: "",
      amount: 0,
      route: "",
      accountNum: "",
      desc: "",
      fee: 0,
    });
    setOtp("");
    setOtpError(null);
    setOtpSent(false);
    setShowReceipt(false);
    setCodeStep(null);
    setCode("");
    setCodeError(null);
    setShowSuccess(false);
  };

  // Handle closing success modal (reload page)
  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetForm();
    // Optionally reload to reflect new balance
    window.location.reload();
  };

  // Breadcrumb
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <i className="fa-solid fa-house" />
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200">Local Transfer</span>
      </nav>

      {/* Account balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Balance</p>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">{fmt(account.balance)}</h3>
            </div>
            <div className="p-2.5 rounded-full bg-green-50 dark:bg-green-900/30">
              <i className="fa-solid fa-credit-card text-green-500 text-lg" />
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Account Status</p>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                {account.is_active ? "Active" : "Inactive"}
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
                {account.account_type || "USD SAVING"}
              </h3>
            </div>
            <div className="p-2.5 rounded-full bg-orange-50 dark:bg-orange-900/30">
              <i className="fa-solid fa-star text-orange-500 text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main form or steps */}
      {!showReceipt && !showSuccess && codeStep === null ? (
        // Transfer form
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <i className="fa-solid fa-street-view mr-2" /> Local Fund Transfer
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Bank Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="bankname"
                    value={formData.bankname}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Bank of America"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-bank"></i></span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Jake Chris"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-user"></i></span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Amount"
                    required
                    min="1"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-money-bill-wave"></i></span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Routing Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Routing Number"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-route"></i></span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Transfer Fee</label>
                <div className="relative">
                  <input
                    type="text"
                    name="fee"
                    id="fee"
                    value={fmt(formData.fee)}
                    readOnly
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-percentage"></i></span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Account Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountNum"
                    value={formData.accountNum}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    placeholder="Beneficiary Account Number"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-stamp"></i></span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <div className="relative">
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  placeholder="Description"
                  required
                />
                <span className="absolute right-3 top-2.5 text-gray-400"><i className="fa-solid fa-envelope"></i></span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={mainLoading}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mainLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-money-bill-wave mr-2"></i>}
                {mainLoading ? "Processing..." : "Transfer"}
              </button>
              <button
                type="reset"
                onClick={resetForm}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors"
              >
                <i className="fa-solid fa-rotate-left mr-2" /> Clear
              </button>
            </div>
          </form>
        </div>
      ) : otpSent && !showReceipt && codeStep === null ? (
        // OTP verification
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <i className="fa-solid fa-lock mr-2" /> Enter OTP
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Check your email for the OTP code.
          </p>
          {otpError && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{otpError}</p>
            </div>
          )}
          <form onSubmit={verifyOtp} className="space-y-3">
            <input
              type="text"
              name="otp"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              ref={otpRef}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              placeholder="Enter OTP"
              required
            />
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full px-4 py-2 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {otpLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-check mr-2"></i>}
              {otpLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
          <button
            onClick={() => {
              setOtpSent(false);
              setOtp("");
              setOtpError(null);
            }}
            className="mt-4 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Resend OTP
          </button>
        </div>
      ) : showReceipt && codeStep === null ? (
        // Receipt preview
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <i className="fa-solid fa-receipt mr-2" /> Transaction Review
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">From</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.full_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">To</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receiptData?.accountName}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{fmt(receiptData?.amount ?? 0)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Fee</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{fmt(receiptData?.fee ?? 0)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bank</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receiptData?.bankname}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Account</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receiptData?.accountNum}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Description</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{receiptData?.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Routing Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receiptData?.route}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">IP Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {(receiptData?.ipLoc?.ip || "N/A")}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowReceipt(false)}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors"
              >
                <i className="fa-solid fa-arrow-left mr-2" /> Back
              </button>
              <button
                onClick={() => setCodeStep("imf")}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors"
              >
                <i className="fa-solid fa-key mr-2" /> Continue
              </button>
            </div>
          </div>
        </div>
      ) : codeStep !== null ? (
        // Code verification (IMF, COT, VAT)
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            <i className="fa-solid fa-key mr-2" />
            {codeStep === "imf" ? "Enter IMF Code" : codeStep === "cot" ? "Enter COT Code" : "Enter VAT Code"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please enter your {codeStep === "imf" ? "IMF" : codeStep === "cot" ? "COT" : "VAT"} code to proceed.
            <br />
            <span className="text-xs text-red-500 dark:text-red-400">
              Contact <a href="/contact" className="underline">Support</a> to get your code or chat with admin live.
            </span>
          </p>
          {codeError && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{codeError}</p>
            </div>
          )}
          <form onSubmit={verifyCode} className="space-y-3">
            <input
              type="text"
              name="code"
              maxLength={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              ref={codeRef}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
              placeholder="Enter Code"
              required
            />
            <button
              type="submit"
              disabled={codeLoading}
              className="w-full px-4 py-2 rounded-lg bg-brand-sun text-white font-semibold text-sm shadow-sm hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {codeLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-check mr-2"></i>}
              {codeLoading ? "Validating..." : "Validate"}
            </button>
          </form>
          <button
            onClick={() => {
              setCodeStep(null);
              setCode("");
              setCodeError(null);
            }}
            className="mt-4 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        // Success modal
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-xs mx-4 p-8 flex flex-col items-center relative">
            <div className="mb-6">
              {/* Simple checkmark animation */}
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <i className="fa-solid fa-circle-check text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Transfer Successful!</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 text-center">
                Your transfer was made and is <b>awaiting Admin approval</b>.
              </p>
              <button
                onClick={handleSuccessClose}
                className="mt-4 px-5 py-2 rounded bg-brand-sun text-white hover:bg-brand-navy transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardShell>
  );
}