import { supabase } from "../../../utils/supabaseClient";
import navbar from "../components/Navbar";
import { showToast } from "../../../components/toast";
import { reset } from "../../../utils/reset";

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

// Helper: Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Get IP and Location
async function getIpLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    return await res.json();
  } catch {
    return {};
  }
}

// Helper: Generate Receipt
function generateReceipt(options = {}) {
  const defaults = {
    title: "Wire Transfer Receipt",
    receiptId: generateReceiptId(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    amount: "0.00",
    currency: "$",
    description: "Wire Transfer",
    senderName: "",
    recipientName: "",
    bankName: "",
    accountNumber: "",
    transactionType: "Wire Transfer",
    status: "Pending",
    referenceNumber: "",
    fees: "0.00",
    totalAmount: "",
    companyName: "Horizon Ridge Credit Union",
    companyAddress: "123 Main St, City, Country",
    companyPhone: "+1 (555) 123-4567",
    companyEmail: "horizonridgecreditunion@gmail.com",
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
  return `
    <div class="receipt-container font-mono">
      <div class="text-center mb-4">
        <img src="https://www.horizonridgecreditunion.com/assets/logo-39I1HVw6.jpg" alt="Horizon Ridge Credit Union" class="h-10 mx-auto mb-2" />
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white mb-1">${config.title}</h2>
        <div class="text-base text-gray-700 dark:text-gray-300">${config.companyName}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${config.companyAddress}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${config.companyPhone} | ${config.companyEmail}</div>
      </div>
      <div class="mb-4 border-b border-dashed border-gray-300 dark:border-gray-700 pb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Receipt ID:</span><span>${config.receiptId}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Date:</span><span>${config.date}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Time:</span><span>${config.time}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Type:</span><span>${config.transactionType}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="font-semibold">Status:</span>
          <span class="font-bold" style="color:${config.status === "Completed" ? "#16a34a" : config.status === "Pending" ? "#f59e42" : "#dc2626"};">
            ${config.status}
          </span>
        </div>
      </div>
      <div class="mb-4">
        <h3 class="text-center text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Transaction Details</h3>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">From:</span><span>${config.senderName}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">To:</span><span>${config.recipientName}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Bank:</span><span>${config.bankName}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Account:</span><span>${config.accountNumber}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Description:</span><span>${config.description}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="font-semibold">Reference:</span><span>${config.referenceNumber}</span>
        </div>
      </div>
      <div class="mb-4 border-t border-dashed border-gray-300 dark:border-gray-700 pt-3">
        <div class="flex justify-between text-sm mb-1">
          <span class="font-semibold">Amount:</span><span>${config.currency}${config.amount}</span>
        </div>
        ${parseFloat(config.fees) > 0
            ? `<div class="flex justify-between text-sm mb-1">
                  <span class="font-semibold">Fees:</span><span>${config.currency}${config.fees}</span>
                </div>`
            : ""
        }
        <div class="flex justify-between text-base font-bold border-t border-gray-300 dark:border-gray-700 pt-2">
          <span>Total:</span><span>${config.currency}${config.totalAmount}</span>
        </div>
      </div>
      ${Object.keys(config.additionalFields).length > 0
            ? `<div class="mb-4 border-t border-dashed border-gray-300 dark:border-gray-700 pt-3">
                ${Object.entries(config.additionalFields)
                    .map(([key, value]) => `
                      <div class="flex justify-between text-xs mb-1">
                        <span class="font-semibold">${key}:</span><span>${value}</span>
                      </div>
                    `).join("")}
              </div>`
            : ""
        }
      ${config.showFooter
            ? `<div class="text-center mt-4 pt-3 border-t-2 border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <div>${config.footerText}</div>
                <div class="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                  This is a Horizon-generated receipt
                </div>
              </div>`
            : ""
        }
    </div>
    `;
}
function generateReceiptId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

// Modal for IMF, COT, VAT
function showCodeModal(type, onSuccess) {
  let modal = document.getElementById("code-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "code-modal";
    document.body.appendChild(modal);
  }
  modal.className = "";
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <button id="close-code-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
        <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white">
          <i class="fa fa-key mr-2"></i>Enter ${type} Code
        </h4>
        <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">
          Please enter your ${type} code to proceed.<br>
          <span class="text-red-500">Contact <a href="/contact" target="_blank" class="underline">Support</a> to get your code or chat with admin live.</span>
        </div>
        <form id="code-form" class="space-y-3">
          <input type="text" name="code" maxlength="12"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            placeholder="Enter ${type} Code" required />
          <button type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            <i class="fa fa-check"></i> Validate
          </button>
        </form>
      </div>
    </div>
  `;
  document.getElementById("close-code-modal").onclick = () => {
    modal.innerHTML = "";
    modal.className = "hidden";
  };
  document.getElementById("code-form").onsubmit = async function (e) {
    e.preventDefault();
    const code = this.code.value.trim();
    if (complexCodes.includes(code)) {
      modal.innerHTML = "";
      modal.className = "hidden";
      onSuccess();
    } else {
      showToast("Invalid code. Please contact support.", "error");
    }
  };
}

// Success Animation Modal
function showSuccessModal() {
  let modal = document.getElementById("success-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "success-modal";
    document.body.appendChild(modal);
  }
  modal.className = "";
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-xs p-8 flex flex-col items-center relative">
        <canvas id="success-canvas" width="120" height="120" style="display:block;margin-bottom:16px;"></canvas>
        <h3 class="text-lg font-bold text-green-700 dark:text-green-400 mb-2">Transfer Successful!</h3>
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-2 text-center">Your transfer was made and is <b>awaiting Admin approval</b>.</p>
        <button id="close-success-modal" class="mt-4 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Close</button>
      </div>
    </div>
    <style>
      #success-canvas { background: transparent; }
    </style>
  `;
  // Draw animated check
  const canvas = document.getElementById("success-canvas");
  const ctx = canvas.getContext("2d");
  let progress = 0;
  function drawCheck() {
    ctx.clearRect(0, 0, 120, 120);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(60, 60, 48, Math.PI * 0.5, Math.PI * (2 * progress), false);
    ctx.stroke();
    if (progress < 1) {
      progress += 0.03;
      requestAnimationFrame(drawCheck);
    } else {
      // Draw check mark
      ctx.beginPath();
      ctx.moveTo(40, 65);
      ctx.lineTo(55, 80);
      ctx.lineTo(85, 45);
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 8;
      ctx.stroke();
    }
  }
  drawCheck();
  document.getElementById("close-success-modal").onclick = () => {
    modal.innerHTML = "";
    modal.className = "hidden";
    window.location.reload();
  };
}

// UI
const wireTransfer = async () => {
  reset("Horizon | Wire Transfer");
  const nav = navbar();

  // Fetch session, profile, account
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    window.location.href = "/login";
    return;
  }
  const { user } = session.data.session;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  let { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Format currency
  const fmt = (v) =>
    typeof v === "number"
      ? v.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        })
      : v || "$0.00";

  function pageEvents() {
    nav.pageEvents?.();

    // Dynamic fee calculation
    const amountInput = document.getElementById("amount");
    const feeInput = document.getElementById("fee");
    amountInput.addEventListener("input", () => {
      const val = parseFloat(amountInput.value) || 0;
      let fee = Math.max(1, Math.min(75, val * 0.02));
      feeInput.value = fee.toFixed(2);
    });

    // Form submit
    document.getElementById("wire-transfer-form").onsubmit = async function (
      e
    ) {
      e.preventDefault();

      try {
        const bankname = this.bankname.value.trim();
        const accountName = this.accountName.value.trim();
        const amount = parseFloat(this.amount.value);
        const swift = this.swift.value.trim();
        const fee = parseFloat(this.fee.value);
        const accountNum = this.accountNum.value.trim();
        const desc = this.desc.value.trim();

        if (
          !bankname ||
          !accountName ||
          !amount ||
          !swift ||
          !accountNum ||
          !desc
        ) {
          showToast("All fields are required.", "error");
          return;
        }
        if (amount <= 0) {
          showToast("Amount must be greater than zero.", "error");
          return;
        }
        if (amount + fee > account.balance) {
          showToast("Insufficient balance.", "error");
          return;
        }

        showToast("Sending OTP...", "info");
        const otp = generateOTP();
        const ipLoc = await getIpLocation();

        // Insert OTP into database
        const { error: otpError } = await supabase.from("otps").insert([
          {
            user_id: user.id,
            code: otp,
            type: "wire",
            expires_at: new Date(Date.now() + 10 * 60000).toISOString(),
          },
        ]);
        if (otpError) {
          showToast("Database error. Please try again.", "error");
          return;
        }

        // Show OTP modal immediately
        showOTPModal({
          amount,
          fee,
          bankname,
          accountName,
          swift,
          accountNum,
          desc,
          profile,
          account,
          otp,
          ipLoc,
        });

        // Fire and forget email sending
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.email,
            subject: "Your OTP for Wire Transfer",
            html: `
              <h2>Transaction OTP</h2>
              <p>Your OTP is: <b>${otp}</b></p>
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
        })
          .then((res) => {
            if (res.ok) showToast("OTP sent to your email.", "success");
            else
              showToast(
                "OTP email failed, but you can still enter the code.",
                "warning"
              );
          })
          .catch(() => {
            showToast(
              "OTP email failed, but you can still enter the code.",
              "warning"
            );
          });
      } catch (error) {
        showToast("An error occurred. Please try again.", "error");
      }
    };

    // OTP Modal
    function showOTPModal(tx) {
      let modal = document.getElementById("otp-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "otp-modal";
        document.body.appendChild(modal);
      }
      modal.className = "";
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button id="close-otp-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
            <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white">
              <i class="fa fa-lock mr-2"></i>Enter OTP
            </h4>
            <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">
              Check your email for the OTP code.
            </div>
            <form id="otp-form" class="space-y-3">
              <input type="text" name="otp" maxlength="6" 
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" 
                placeholder="Enter OTP" required />
              <button type="submit" 
                class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                <i class="fa fa-check"></i> Verify
              </button>
            </form>
          </div>
        </div>
      `;
      document.getElementById("close-otp-modal").onclick = () => {
        modal.innerHTML = "";
        modal.className = "hidden";
      };
      document.getElementById("otp-form").onsubmit = async function (e) {
        e.preventDefault();
        const code = this.otp.value.trim();

        // Validate OTP
        const { data: otpRow, error } = await supabase
          .from("otps")
          .select("*")
          .eq("user_id", tx.profile.id)
          .eq("code", code)
          .eq("type", "wire")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error || !otpRow || new Date(otpRow.expires_at) < new Date()) {
          showToast("Invalid or expired OTP.", "error");
          return;
        }

        // Show receipt modal with status pending and complete button
        showReceiptModal(tx);
      };
    }

    // Receipt Modal
    function showReceiptModal(tx) {
      let modal = document.getElementById("otp-modal");
      modal.className = "";
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div class="receipt-modal-content bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-2 p-0 relative overflow-auto" style="max-height:90vh;">
            <button id="close-receipt-modal" class="absolute top-3 right-4 text-gray-400 hover:text-red-500 dark:hover:text-white text-2xl font-bold z-10" aria-label="Close">&times;</button>
            <div class="p-6">
              ${generateReceipt({
                id: generateReceiptId(),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                amount: tx.amount,
                currency: "$",
                description: tx.desc,
                senderName: tx.profile.full_name,
                recipientName: tx.accountName,
                bankName: tx.bankname,
                accountNumber: tx.accountNum,
                transactionType: "Wire Transfer",
                status: "Pending",
                referenceNumber: tx.accountNum,
                fees: tx.fee,
                totalAmount: (
                  parseFloat(tx.amount) + parseFloat(tx.fee)
                ).toFixed(2),
                additionalFields: {
                  "SWIFT Code": tx.swift,
                  IP: tx.ipLoc.ip || "N/A",
                  Location: `${tx.ipLoc.city || ""}, ${tx.ipLoc.region || ""}, ${tx.ipLoc.country_name || ""}`,
                },
              })}
              <div class="mt-6 flex flex-col gap-2 justify-center">
                <button id="complete-wire-btn" class="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition font-semibold">
                  Complete Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="code-modal" class="hidden"></div>
        <style>
          .receipt-modal-content::-webkit-scrollbar { width: 8px; background: transparent; }
          .receipt-modal-content::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
          .dark .receipt-modal-content::-webkit-scrollbar-thumb { background: #334155; }
          .receipt-container {
            background: repeating-linear-gradient(135deg, #f8fafc 0px, #e0e7ef 80%, #f8fafc 100%);
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.10);
            padding: 0;
          }
          .dark .receipt-container {
            background: linear-gradient(135deg, #1e293b 0px, #334155 80%, #1e293b 100%);
            box-shadow: 0 4px 24px rgba(0,0,0,0.40);
          }
        </style>
      `;

      document.getElementById("close-receipt-modal").onclick = () => {
        modal.innerHTML = "";
        modal.className = "hidden";
      };

      document.getElementById("complete-wire-btn").onclick = () => {
        showCodeModal("IMF", () => {
          showCodeModal("COT", () => {
            showCodeModal("VAT", async () => {
              // Success animation
              showSuccessModal();
              // Save transaction
              try {
                const amountNum = parseFloat(tx.amount);
                const feeNum = parseFloat(tx.fee);
                const total = amountNum + feeNum;
                const balanceBefore = parseFloat(tx.account.balance);
                const balanceAfter = balanceBefore - total;

                await supabase
                  .from("accounts")
                  .update({ balance: balanceAfter })
                  .eq("id", tx.account.id);

                const { data: txn, error: txnError } = await supabase
                  .from("transactions")
                  .insert([
                    {
                      account_id: tx.account.id,
                      user_id: tx.profile.id,
                      type: "wire",
                      description: tx.desc,
                      amount: total,
                      balance_before: balanceBefore,
                      balance_after: balanceAfter,
                      status: "pending",
                    },
                  ])
                  .select()
                  .single();

                await supabase.from("notifications").insert([
                  {
                    user_id: tx.profile.id,
                    title: "Wire Transfer Initiated",
                    message: `Your wire transfer of ${fmt(tx.amount)} to ${tx.accountName} is awaiting admin approval.`,
                    type: "info",
                    read: false,
                  },
                ]);

                fetch("/api/send-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    to: tx.profile.email,
                    subject: "Wire Transfer Receipt",
                    html: generateReceipt({
                      amount: tx.amount,
                      senderName: tx.profile.full_name,
                      recipientName: tx.accountName,
                      bankName: tx.bankname,
                      accountNumber: tx.accountNum,
                      description: tx.desc,
                      fees: tx.fee,
                      status: "Pending",
                      referenceNumber: txn?.id || generateReceiptId(),
                      companyName: "Horizon Ridge Credit Union",
                      companyAddress: "123 Main St, City, Country",
                      companyPhone: "+1 (555) 123-4567",
                      companyEmail: "horizonridgecreditunion@gmail.com",
                    }),
                  }),
                });
              } catch (err) {
                showToast(
                  "Failed to process transaction. Please try again.",
                  "error"
                );
              }
            });
          });
        });
      };
    }
  }

  return {
    html: /*html*/ `
      <div class="relative">
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
          <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
            <div class="p-4">
              <div class="mb-4">
                <nav class="flex items-center space-x-2 text-xs">
                  <i class="fa fa-home text-gray-500 text-xs"></i>
                  <span class="text-gray-500">/</span>
                  <span class="text-gray-700 dark:text-gray-300">Wire Transfer</span>
                </nav>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="p-4 rounded bg-green-100 dark:bg-green-900 transition-all hover:shadow text-xs">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-base font-semibold text-green-800 dark:text-green-300">${fmt(account?.balance)}</h3>
                      <p class="text-xs text-green-600 dark:text-green-400 font-normal">Account Balance</p>
                    </div>
                    <div class="p-2 rounded-full bg-green-200 dark:bg-green-800">
                      <i class="fa fa-briefcase text-green-700 dark:text-green-300 text-sm"></i>
                    </div>
                  </div>
                </div>
                <div class="p-4 rounded bg-blue-100 dark:bg-blue-900 transition-all hover:shadow text-xs">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-base font-semibold text-blue-800 dark:text-blue-300">${account?.is_active ? "Active" : "Inactive"}</h3>
                      <p class="text-xs text-blue-600 dark:text-blue-400 font-normal">Account Status</p>
                    </div>
                    <div class="p-2 rounded-full bg-blue-200 dark:bg-blue-800">
                      <i class="fa fa-refresh text-blue-700 dark:text-blue-300 text-sm"></i>
                    </div>
                  </div>
                </div>
                <div class="p-4 rounded bg-orange-100 dark:bg-orange-900 transition-all hover:shadow text-xs">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-base font-semibold text-orange-800 dark:text-orange-300">${account?.account_type || "USD SAVING"}</h3>
                      <p class="text-xs text-orange-600 dark:text-orange-400 font-normal">Account Type</p>
                    </div>
                    <div class="p-2 rounded-full bg-orange-200 dark:bg-orange-800">
                      <i class="fa fa-star text-orange-700 dark:text-orange-300 text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 rounded bg-white dark:bg-gray-800 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i class="fa fa-globe mr-2"></i> Wire Fund Transfer</h3>
                  <form id="wire-transfer-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold mb-1">Bank Name</label>
                        <div class="relative">
                          <input type="text" name="bankname" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Bank Name" required />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-bank"></i></span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold mb-1">Account Name</label>
                        <div class="relative">
                          <input type="text" name="accountName" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Account Name" required />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-user"></i></span>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold mb-1">Amount</label>
                        <div class="relative">
                          <input type="number" name="amount" id="amount" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Amount" required min="1" step="0.01" />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-money"></i></span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold mb-1">SWIFT Code</label>
                        <div class="relative">
                          <input type="text" name="swift" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="SWIFT Code" required />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-globe"></i></span>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold mb-1">Transfer Fee</label>
                        <div class="relative">
                          <input type="text" name="fee" id="fee" class="w-full px-3 py-2 border rounded bg-gray-100" placeholder="$0.00" readonly />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-percentage"></i></span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold mb-1">Account Number</label>
                        <div class="relative">
                          <input type="text" name="accountNum" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Beneficiary Account Number" required />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-stamp"></i></span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold mb-1">Description</label>
                      <div class="relative">
                        <textarea name="desc" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Description" required></textarea>
                        <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-envelope"></i></span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <button type="submit" class="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-money"></i> Transfer</button>
                      <button type="reset" class="btn btn-default bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"><i class="fa fa-refresh"></i> Clear</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <footer class="p-4 text-center text-gray-600 dark:text-gray-400 text-xs">
              <p>
                <strong>Copyright © ${new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
              </p>
            </footer>
          </div>
        </div>
      </div>
      <div id="otp-modal" class="hidden"></div>
      <div id="success-modal" class="hidden"></div>
    `,
    pageEvents,
  };
};

export default wireTransfer;