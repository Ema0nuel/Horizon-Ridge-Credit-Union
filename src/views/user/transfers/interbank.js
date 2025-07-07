import { supabase } from "../../../utils/supabaseClient";
import navbar from "../components/Navbar";
import { showToast } from "../../../components/toast";
import { reset } from "../../../utils/reset";

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
        title: "Inter-Bank Transfer Receipt",
        receiptId: generateReceiptId(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        amount: "0.00",
        currency: "$",
        description: "Inter-Bank Transfer",
        senderName: "",
        recipientName: "",
        bankName: "",
        accountNumber: "",
        transactionType: "Inter-Bank Transfer",
        status: "Completed",
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
    <div style="max-width:440px;margin:24px auto;padding:24px;border-radius:12px;background:linear-gradient(135deg,#f8fafc,#e0e7ef 80%);box-shadow:0 4px 24px rgba(0,0,0,0.08);font-family:'Segoe UI',sans-serif;">
      <div style="text-align:center;margin-bottom:18px;">
        <img src="https://i.ibb.co/6bQ7Q5z/hrcu-logo.png" alt="Horizon Ridge Credit Union" style="height:40px;margin-bottom:8px;">
        <h2 style="margin:0;font-size:26px;font-weight:700;color:#1e293b;">${config.title}</h2>
        <div style="font-size:16px;color:#475569;">${config.companyName}</div>
        <div style="font-size:12px;color:#64748b;">${config.companyAddress}</div>
        <div style="font-size:12px;color:#64748b;">${config.companyPhone} | ${config.companyEmail}</div>
      </div>
      <div style="margin-bottom:18px;border-bottom:1px dashed #cbd5e1;padding-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Receipt ID:</b></span><span>${config.receiptId}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Date:</b></span><span>${config.date}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Time:</b></span><span>${config.time}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Type:</b></span><span>${config.transactionType}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;">
          <span><b>Status:</b></span>
          <span style="color:${config.status === "Completed" ? "#16a34a" : config.status === "Pending" ? "#f59e42" : "#dc2626"};font-weight:600;">
            ${config.status}
          </span>
        </div>
      </div>
      <div style="margin-bottom:18px;">
        <h3 style="margin:0 0 10px 0;font-size:15px;text-align:center;color:#0f172a;">Transaction Details</h3>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>From:</b></span><span>${config.senderName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>To:</b></span><span>${config.recipientName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Bank:</b></span><span>${config.bankName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Account:</b></span><span>${config.accountNumber}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Description:</b></span><span>${config.description}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;">
          <span><b>Reference:</b></span><span>${config.referenceNumber}</span>
        </div>
      </div>
      <div style="margin-bottom:18px;border-top:1px dashed #cbd5e1;padding-top:12px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
          <span><b>Amount:</b></span><span>${config.currency}${config.amount}</span>
        </div>
        ${parseFloat(config.fees) > 0
            ? `
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
          <span><b>Fees:</b></span><span>${config.currency}${config.fees}</span>
        </div>`
            : ""
        }
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;border-top:1px solid #cbd5e1;padding-top:8px;">
          <span>Total:</span><span>${config.currency}${config.totalAmount}</span>
        </div>
      </div>
      ${Object.keys(config.additionalFields).length > 0
            ? `
      <div style="margin-bottom:18px;border-top:1px dashed #cbd5e1;padding-top:12px;">
        ${Object.entries(config.additionalFields)
                .map(
                    ([key, value]) => `
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
            <span><b>${key}:</b></span><span>${value}</span>
          </div>
        `
                )
                .join("")}
      </div>`
            : ""
        }
      ${config.showFooter
            ? `
      <div style="text-align:center;margin-top:18px;padding-top:10px;border-top:2px dashed #cbd5e1;font-size:12px;color:#64748b;">
        <div>${config.footerText}</div>
        <div style="margin-top:8px;font-size:11px;color:#94a3b8;">
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

// UI
const interbankTransfer = async () => {
    reset("Horizon | Inter-Bank Transfer");
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

        // Dynamic fee calculation (optional for interbank)
        // const amountInput = document.getElementById("amount");
        // const feeInput = document.getElementById("fee");
        // amountInput.addEventListener("input", () => {
        //   const val = parseFloat(amountInput.value) || 0;
        //   let fee = Math.max(5, Math.min(50, val * 0.01));
        //   feeInput.value = fee.toFixed(2);
        // });

        // Form submit
        document.getElementById("interbank-transfer-form").onsubmit =
            async function (e) {
                e.preventDefault();

                try {
                    const amount = parseFloat(this.amount.value);
                    const accounttype = this.accounttype.value.trim();
                    const accountName = this.accountName.value.trim();
                    const accountNum = this.accountNum.value.trim();
                    const desc = this.desc.value.trim();

                    if (!amount || !accounttype || !accountName || !accountNum || !desc) {
                        showToast("All fields are required.", "error");
                        return;
                    }
                    if (amount <= 0) {
                        showToast("Amount must be greater than zero.", "error");
                        return;
                    }
                    if (amount > account.balance) {
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
                            type: "interbank",
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
                        accounttype,
                        accountName,
                        accountNum,
                        desc,
                        profile,
                        account,
                        otp,
                        ipLoc,
                    });

                    // Fire and forget email sending
                    fetch("http://localhost:3001/api/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            to: user.email,
                            subject: "Your OTP for Inter-Bank Transfer",
                            html: `
              <h2>Inter-Bank Transfer OTP</h2>
              <p>Your OTP is: <b>${otp}</b></p>
              <p>IP: ${ipLoc.ip || "N/A"}<br>
              Location: ${ipLoc.city || ""}, ${ipLoc.region || ""}, ${ipLoc.country_name || ""}<br>
              Date: ${new Date().toLocaleString()}</p>
              <hr>
              <h3>Transaction Details</h3>
              <ul>
                <li>Amount: ${fmt(amount)}</li>
                <li>Sender: ${profile.full_name}</li>
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
                    .eq("type", "interbank")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (error || !otpRow || new Date(otpRow.expires_at) < new Date()) {
                    showToast("Invalid or expired OTP.", "error");
                    return;
                }

                try {
                    // Subtract balance
                    const amountNum = parseFloat(tx.amount);
                    const balanceBefore = parseFloat(tx.account.balance);
                    const balanceAfter = balanceBefore - amountNum;

                    await supabase
                        .from("accounts")
                        .update({ balance: balanceAfter })
                        .eq("id", tx.account.id);

                    // Insert transaction (matches your schema)
                    const { data: txn, error: txnError } = await supabase
                        .from("transactions")
                        .insert([
                            {
                                account_id: tx.account.id,
                                user_id: tx.profile.id,
                                type: "interbank",
                                description: tx.desc,
                                amount: amountNum,
                                balance_before: balanceBefore,
                                balance_after: balanceAfter,
                                status: "completed",
                            },
                        ])
                        .select()
                        .single();

                    if (txnError) {
                        showToast("Transaction failed: " + txnError.message, "error");
                        return;
                    }

                    // Insert notification
                    await supabase.from("notifications").insert([
                        {
                            user_id: tx.profile.id,
                            title: "Inter-Bank Transfer Completed",
                            message: `Your inter-bank transfer of ${fmt(tx.amount)} to ${tx.accountName} has been completed.`,
                            type: "info",
                            read: false,
                        },
                    ]);

                    // Send receipt email (fire and forget)
                    fetch("http://localhost:3001/api/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            to: tx.profile.email,
                            subject: "Inter-Bank Transfer Receipt",
                            html: generateReceipt({
                                amount: tx.amount,
                                senderName: tx.profile.full_name,
                                recipientName: tx.accountName,
                                bankName: "",
                                accountNumber: tx.accountNum,
                                description: tx.desc,
                                fees: "0.00",
                                status: "Pending",
                                referenceNumber: txn?.id || generateReceiptId(),
                                companyName: "Horizon Ridge Credit Union",
                                companyAddress: "123 Main St, City, Country",
                                companyPhone: "+1 (555) 123-4567",
                                companyEmail: "horizonridgecreditunion@gmail.com",
                            }),
                        }),
                    });

                    // Update local account balance for UI
                    account.balance = balanceAfter;
                } catch (err) {
                    showToast(
                        "Failed to process transaction. Please try again.",
                        "error"
                    );
                    return;
                }

                // Spinner, then reload page
                modal.innerHTML = `
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-xs p-8 flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50 mb-4"></div>
              <div class="text-gray-700 dark:text-gray-200 text-sm">Processing transfer...</div>
            </div>
          </div>
        `;
                setTimeout(() => showPendingModal(tx), 2500);
            };
        }

        // Pending Modal
        function showPendingModal(tx) {
            let modal = document.getElementById("otp-modal");
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <button id="close-pending-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                        <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i class="fa fa-clock mr-2"></i>Transaction Pending</h4>
                        <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">Your transfer is pending and awaiting approval.</div>
                        <div class="flex justify-end mt-4">
                            <button id="continue-cot" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs">Continue</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("close-pending-modal").onclick = () => {
                modal.innerHTML = "";
                modal.className = "hidden";
            };
            document.getElementById("continue-cot").onclick = () => showCOTModal(tx);
        }

        // COT Modal
        function showCOTModal(tx) {
            let modal = document.getElementById("otp-modal");
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <button id="close-cot-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                        <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i class="fa fa-key mr-2"></i>Enter COT Code</h4>
                        <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">Contact support to get your COT code. <a href="/contact" target="_blank" class="text-blue-600 underline">Contact Support</a></div>
                        <form id="cot-form" class="space-y-3">
                            <input type="text" name="cot" maxlength="8" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Enter COT Code" required />
                            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-check"></i> Submit</button>
                        </form>
                    </div>
                </div>
            `;
            document.getElementById("close-cot-modal").onclick = () => {
                modal.innerHTML = "";
                modal.className = "hidden";
            };
            document.getElementById("cot-form").onsubmit = function (e) {
                e.preventDefault();
                showToast("COT code accepted. Next: VAT code.", "success");
                setTimeout(() => showVATModal(tx), 1000);
            };
        }

        // VAT Modal
        function showVATModal(tx) {
            let modal = document.getElementById("otp-modal");
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <button id="close-vat-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                        <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i class="fa fa-key mr-2"></i>Enter VAT Code</h4>
                        <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">Contact support to get your VAT code. <a href="/contact" target="_blank" class="text-blue-600 underline">Contact Support</a></div>
                        <form id="vat-form" class="space-y-3">
                            <input type="text" name="vat" maxlength="8" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Enter VAT Code" required />
                            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-check"></i> Submit</button>
                        </form>
                    </div>
                </div>
            `;
            document.getElementById("close-vat-modal").onclick = () => {
                modal.innerHTML = "";
                modal.className = "hidden";
            };
            document.getElementById("vat-form").onsubmit = function (e) {
                e.preventDefault();
                showToast("VAT code accepted. Next: IMF code.", "success");
                setTimeout(() => showIMFModal(tx), 1000);
            };
        }

        // IMF Modal
        function showIMFModal(tx) {
            let modal = document.getElementById("otp-modal");
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <button id="close-imf-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                        <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i class="fa fa-key mr-2"></i>Enter IMF Code</h4>
                        <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">Contact support to get your IMF code. <a href="/contact" target="_blank" class="text-blue-600 underline">Contact Support</a></div>
                        <form id="imf-form" class="space-y-3">
                            <input type="text" name="imf" maxlength="8" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Enter IMF Code" required />
                            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-check"></i> Submit</button>
                        </form>
                    </div>
                </div>
            `;
            document.getElementById("close-imf-modal").onclick = () => {
                modal.innerHTML = "";
                modal.className = "hidden";
            };
            document.getElementById("imf-form").onsubmit = function (e) {
                e.preventDefault();
                showToast(
                    "IMF code accepted. Transaction awaiting final approval.",
                    "success"
                );
                setTimeout(() => showFinalApprovalModal(tx), 1000);
            };
        }

        // Final Approval Modal
        function showFinalApprovalModal(tx) {
            let modal = document.getElementById("otp-modal");
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                        <button id="close-final-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                        <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i class="fa fa-clock mr-2"></i>Awaiting Approval</h4>
                        <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">Your transaction is now awaiting final approval. You will be notified once processed.</div>
                    </div>
                </div>
            `;
            document.getElementById("close-final-modal").onclick = () => {
                modal.innerHTML = "";
                modal.className = "hidden";
                window.location.reload();
            };
        }
    }

    // Main UI
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
                  <span class="text-gray-700 dark:text-gray-300">Inter-Bank Transfer</span>
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
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i class="fa fa-bank mr-2"></i> Inter-Bank Fund Transfer</h3>
                  <form id="interbank-transfer-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold mb-1">Amount</label>
                        <div class="relative">
                          <input type="number" name="amount" id="amount" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Amount" required min="1" step="0.01" />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-money"></i></span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold mb-1">Account Type</label>
                        <div class="relative">
                          <select name="accounttype" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring">
                            <option value="">Select Account Type</option>
                            <option value="Checking Account">Checking Account</option>
                            <option value="Current Account">Current Account</option>
                            <option value="Savings Account">Savings Account</option>
                            <option value="Money Market">Money Market</option>
                            <option value="Fixed Deposit Account">Fixed Deposit Account</option>
                          </select>
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-star"></i></span>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-xs font-semibold mb-1">Account Holder</label>
                        <div class="relative">
                          <input type="text" name="accountName" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Beneficiary Account Name" required />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-user"></i></span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold mb-1">Account Number</label>
                        <div class="relative">
                          <input type="text" name="accountNum" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Beneficiary Account Number" required />
                          <span class="absolute right-3 top-2.5 text-gray-400"><i class="fa fa-briefcase"></i></span>
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
    `,
        pageEvents,
    };
};

export default interbankTransfer;
