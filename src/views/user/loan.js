import { supabase } from "../../utils/supabaseClient";
import navbar from "./components/Navbar";
import { showToast } from "../../components/toast";
import { reset } from "../../utils/reset";

// Helper: Format date
function fmtDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
}

// Helper: Generate random interest rate
function randomInterest() {
  return (Math.random() * 4 + 6).toFixed(2); // 6% - 10%
}

// Helper: Calculate due date
function calcDueDate(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

// Main UI
const loan = async () => {
  reset("Horizon | Loan");
  const nav = navbar();

  // Fetch session, profile, account, loans
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
  let { data: loans } = await supabase
    .from("loan")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Loan Table Rows
  const loanRows = (loans || []).length
    ? loans
        .map(
          (l) => `
      <tr class="hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer">
        <td class="px-2 py-1 text-xs">${l.amount}</td>
        <td class="px-2 py-1 text-xs">${l.interest_rate}%</td>
        <td class="px-2 py-1 text-xs">${l.status}</td>
        <td class="px-2 py-1 text-xs">${fmtDate(l.created_at)}</td>
        <td class="px-2 py-1 text-xs">${fmtDate(l.due_date)}</td>
        <td class="px-2 py-1 text-xs">${l.repaid_amount || 0}</td>
      </tr>
    `
        )
        .join("")
    : `<tr><td colspan="6" class="text-center text-gray-400 dark:text-gray-500 py-2 text-xs">No loan requests yet.</td></tr>`;

  function pageEvents() {
    nav.pageEvents?.();

    // Loan request
    const loanForm = document.getElementById("loan-request-form");
    const spinner = document.getElementById("loan-spinner");
    const statusMsg = document.getElementById("loan-status-msg");
    const amountInput = document.getElementById("loan-amount");
    const reasonInput = document.getElementById("loan-reason");
    const durationInput = document.getElementById("loan-duration");

    loanForm.onsubmit = async function (e) {
      e.preventDefault();
      const amount = parseFloat(amountInput.value);
      const reason = reasonInput.value.trim();
      const duration = parseInt(durationInput.value, 10);

      if (!amount || amount < 100) {
        showToast("Enter a valid loan amount (min $100).", "error");
        return;
      }
      if (!reason) {
        showToast("Enter a reason for the loan.", "error");
        return;
      }
      if (!duration) {
        showToast("Select a loan duration.", "error");
        return;
      }

      // Password modal
      let password = "";
      const modal = document.createElement("div");
      modal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-xs p-6 relative">
            <button id="close-loan-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
            <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white"><i class="fa fa-lock mr-2"></i>Confirm Password</h4>
            <form id="loan-password-form" class="space-y-3">
              <input type="password" name="password" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Enter your password" required />
              <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-check"></i> Confirm</button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById("close-loan-modal").onclick = () => {
        modal.remove();
      };
      document.getElementById("loan-password-form").onsubmit = async function (ev) {
        ev.preventDefault();
        password = this.password.value;
        if (!password) {
          showToast("Password required.", "error");
          modal.remove();
          return;
        }
        // Optionally: verify password with backend here
        modal.remove();
        spinner.classList.remove("hidden");
        statusMsg.textContent = "Processing loan request...";
        setTimeout(async () => {
          // Simulate approval/reject
          const approved = Math.random() > 0.2;
          const status = approved ? "pending" : "rejected";
          const interest = randomInterest();
          const due_date = calcDueDate(duration);

          // Insert loan request
          const { data: loanRow, error } = await supabase.from("loan").insert([
            {
              user_id: user.id,
              account_id: account.id,
              amount,
              interest_rate: interest,
              status,
              due_date,
              repaid_amount: 0,
            },
          ]).select().single();
          if (error) {
            showToast("Failed to submit loan request.", "error");
            spinner.classList.add("hidden");
            statusMsg.textContent = "";
            return;
          }

          // Notification
          await supabase.from("notifications").insert([
            {
              user_id: user.id,
              title: "Loan Request Submitted",
              message: `Your loan request of $${amount} is ${status === "pending" ? "pending approval" : "rejected"}.`,
              type: status === "pending" ? "info" : "danger",
              read: false,
            },
          ]);

          // Email
          fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: profile.email,
              subject: "Loan Request Status",
              html: `
                <h2>Your Loan Request</h2>
                <p>Dear ${profile.full_name},</p>
                <p>Your loan request of <b>$${amount}</b> for <b>${reason}</b> is <b>${status}</b>.</p>
                <ul>
                  <li>Amount: $${amount}</li>
                  <li>Interest Rate: ${interest}%</li>
                  <li>Duration: ${duration} months</li>
                  <li>Status: ${status}</li>
                </ul>
                <p>We will notify you once your loan is approved and disbursed.</p>
                <br>
                <b>Horizon Ridge Credit Union</b>
              `,
            }),
          });

          spinner.classList.add("hidden");
          statusMsg.textContent = approved
            ? "Loan request submitted! Awaiting approval."
            : "Loan request rejected. Try again later.";
          showToast(
            approved
              ? "Loan request submitted! Awaiting approval."
              : "Loan request rejected.",
            approved ? "success" : "error"
          );
          setTimeout(() => window.location.reload(), 2000);
        }, 1800);
      };
    };
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
                  <span class="text-gray-700 dark:text-gray-300">Loan</span>
                </nav>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i class="fa fa-landmark mr-2"></i> Request a Loan</h3>
                  <form id="loan-request-form" class="space-y-4">
                    <div>
                      <label class="block text-xs font-semibold mb-1">Loan Amount</label>
                      <input type="number" id="loan-amount" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="Enter amount (min $100)" min="100" required />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold mb-1">Purpose / Reason</label>
                      <input type="text" id="loan-reason" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="E.g. Home Renovation" required />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold mb-1">Loan Duration</label>
                      <select id="loan-duration" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring" required>
                        <option value="">Select Duration</option>
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                      </select>
                    </div>
                    <div class="flex space-x-2">
                      <button type="submit" class="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"><i class="fa fa-money"></i> Request Loan</button>
                    </div>
                    <div id="loan-spinner" class="hidden flex items-center space-x-2 mt-2">
                      <span class="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></span>
                      <span class="text-xs text-gray-600 dark:text-gray-300">Processing...</span>
                    </div>
                    <div id="loan-status-msg" class="text-xs text-gray-600 dark:text-gray-300 mt-2"></div>
                  </form>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i class="fa fa-list mr-2"></i> Your Loan Requests</h3>
                  <div class="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
                    <table class="min-w-full text-xs">
                      <thead>
                        <tr class="bg-blue-100 dark:bg-blue-900/30">
                          <th class="px-2 py-1 text-left">Amount</th>
                          <th class="px-2 py-1 text-left">Interest</th>
                          <th class="px-2 py-1 text-left">Status</th>
                          <th class="px-2 py-1 text-left">Requested</th>
                          <th class="px-2 py-1 text-left">Due</th>
                          <th class="px-2 py-1 text-left">Repaid</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${loanRows}
                      </tbody>
                    </table>
                  </div>
                  <div class="text-xs text-gray-400 mt-2">Loan requests are subject to approval. Status will update automatically.</div>
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
    `,
    pageEvents,
  };
};

export default loan;