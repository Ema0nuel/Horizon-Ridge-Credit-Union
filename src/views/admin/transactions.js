import { supabase } from "/src/utils/supabaseClient.js";
import AdminNavbar, { navItems } from "./components/AdminNavbar.js";
import { requireAdmin } from "./utils/adminAuth.js";
import { showToast } from "/src/components/toast.js";
import { sendEmail } from "/src/views/user/functions/Emailing/sendEmail.js";

// Helper: Format date
function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

// Helper: Status badge
function statusBadge(status) {
  if (status === "completed") return `<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completed</span>`;
  if (status === "pending") return `<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>`;
  if (status === "failed") return `<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Failed</span>`;
  if (status === "reversed") return `<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Reversed</span>`;
  return `<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">${status}</span>`;
}

// Helper: Generate random code
function genCode(prefix = "") {
  return prefix + Math.floor(100000 + Math.random() * 900000);
}

// Codes Modal
function CodesModal({ cot, imf, vat, user }) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="codes-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-codes-modal">&times;</button>
        <h2 class="text-xl font-bold mb-4">Generated Codes</h2>
        <div class="mb-2 flex items-center justify-between">
          <span><b>COT:</b> <span id="cot-code">${cot}</span></span>
          <button class="copy-code-btn" data-code="${cot}">Copy</button>
        </div>
        <div class="mb-2 flex items-center justify-between">
          <span><b>IMF:</b> <span id="imf-code">${imf}</span></span>
          <button class="copy-code-btn" data-code="${imf}">Copy</button>
        </div>
        <div class="mb-4 flex items-center justify-between">
          <span><b>VAT:</b> <span id="vat-code">${vat}</span></span>
          <button class="copy-code-btn" data-code="${vat}">Copy</button>
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded send-codes-email" data-email="${user.email}" data-cot="${cot}" data-imf="${imf}" data-vat="${vat}">Send Codes to User Email</button>
      </div>
    </div>
  `;
}

// Transaction Table
function TransactionTable(transactions, users, accounts) {
  return `
    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <input type="text" id="tx-search" placeholder="Search by user, account, type..." class="border px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500" />
      <select id="tx-type-filter" class="border px-2 py-2 rounded">
        <option value="">All Types</option>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
        <option value="transfer">Transfer</option>
        <option value="manual">Manual</option>
        <option value="reversed">Reversed</option>
      </select>
      <select id="tx-status-filter" class="border px-2 py-2 rounded">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
        <option value="reversed">Reversed</option>
      </select>
      <input type="date" id="tx-date-from" class="border px-2 py-2 rounded" />
      <input type="date" id="tx-date-to" class="border px-2 py-2 rounded" />
      <button id="tx-export-csv" class="ml-auto bg-blue-600 text-white px-3 py-2 rounded">Export CSV</button>
      <button id="tx-create-manual" class="bg-green-600 text-white px-3 py-2 rounded">Manual Transaction</button>
      <button id="tx-generate-codes" class="bg-orange-600 text-white px-3 py-2 rounded">Generate Codes</button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="tx-table-body">
          ${transactions.map(t => {
            const user = users.find(u => u.id === t.user_id);
            const acc = accounts.find(a => a.id === t.account_id);
            return `
              <tr>
                <td>${formatDate(t.created_at)}</td>
                <td>
                  <span class="font-semibold">${user?.full_name || "Unknown"}</span>
                  <div class="text-xs text-gray-400">${user?.email || ""}</div>
                </td>
                <td>
                  <span class="font-mono">${acc?.account_number || "-"}</span>
                  <div class="text-xs text-gray-400">${acc?.account_type || ""}</div>
                </td>
                <td>${t.type}</td>
                <td>$${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>${statusBadge(t.status)}</td>
                <td>
                  <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded tx-view" data-txid="${t.id}">View</button>
                  ${t.status === "pending" ? `<button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded tx-approve" data-txid="${t.id}">Approve</button>` : ""}
                  ${t.status === "failed" ? `<button class="btn btn-xs bg-yellow-600 text-white px-2 py-1 rounded tx-retry" data-txid="${t.id}">Retry</button>` : ""}
                  ${t.status === "completed" && t.type !== "reversed" ? `<button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded tx-reverse" data-txid="${t.id}">Reverse</button>` : ""}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// Transaction Detail Modal
function TransactionDetailModal(tx, user, acc) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="tx-detail-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-tx-detail">&times;</button>
        <h2 class="text-xl font-bold mb-4">Transaction Details</h2>
        <div class="mb-2"><b>User:</b> ${user?.full_name || "Unknown"} (${user?.email || ""})</div>
        <div class="mb-2"><b>Account:</b> ${acc?.account_number || "-"} (${acc?.account_type || ""})</div>
        <div class="mb-2"><b>Type:</b> ${tx.type}</div>
        <div class="mb-2"><b>Amount:</b> $${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div class="mb-2"><b>Status:</b> ${statusBadge(tx.status)}</div>
        <div class="mb-2"><b>Description:</b> ${tx.description || "-"}</div>
        <div class="mb-2"><b>Created:</b> ${formatDate(tx.created_at)}</div>
        <div class="mb-2"><b>Balance Before:</b> $${tx.balance_before || "-"}</div>
        <div class="mb-2"><b>Balance After:</b> $${tx.balance_after || "-"}</div>
        <div class="flex gap-2 mt-4">
          ${tx.status === "pending" ? `<button class="bg-green-600 text-white px-3 py-2 rounded tx-approve" data-txid="${tx.id}">Approve</button>` : ""}
          ${tx.status === "failed" ? `<button class="bg-yellow-600 text-white px-3 py-2 rounded tx-retry" data-txid="${tx.id}">Retry</button>` : ""}
          ${tx.status === "completed" && tx.type !== "reversed" ? `<button class="bg-red-600 text-white px-3 py-2 rounded tx-reverse" data-txid="${tx.id}">Reverse</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

// Manual Transaction Modal
function ManualTransactionModal(users, accounts) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="manual-tx-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-manual-tx">&times;</button>
        <h2 class="text-xl font-bold mb-4">Manual Transaction</h2>
        <form id="manual-tx-form">
          <div class="mb-3">
            <label class="block text-sm mb-1">User</label>
            <select name="user_id" id="manual-user-select" class="w-full border px-3 py-2 rounded" required>
              <option value="">Select user</option>
              ${users.map(u => `<option value="${u.id}">${u.full_name} (${u.email})</option>`).join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Account</label>
            <select name="account_id" id="manual-account-select" class="w-full border px-3 py-2 rounded" required>
              <option value="">Select account</option>
              ${accounts.map(a => `<option value="${a.id}" data-user="${a.user_id}">${a.account_number} (${a.account_type})</option>`).join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Type</label>
            <select name="type" class="w-full border px-3 py-2 rounded" required>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Amount</label>
            <input type="number" name="amount" step="0.01" min="0.01" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Description</label>
            <textarea name="description" class="w-full border px-3 py-2 rounded" rows="2"></textarea>
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </div>
  `;
}

// Export CSV utility
function exportCSV(transactions, users, accounts) {
  const header = ["Date", "User", "Account", "Type", "Amount", "Status", "Description"];
  const rows = transactions.map(t => {
    const user = users.find(u => u.id === t.user_id);
    const acc = accounts.find(a => a.id === t.account_id);
    return [
      formatDate(t.created_at),
      user?.full_name || "",
      acc?.account_number || "",
      t.type,
      t.amount,
      t.status,
      t.description || ""
    ].join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const transactions = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => {} };

  let { data: txs = [] } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(100);
  let { data: users = [] } = await supabase.from("profiles").select("id,full_name,email");
  let { data: accounts = [] } = await supabase.from("accounts").select("*");

  let activeItem = "transactions";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";
  let filteredTxs = txs;

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Transaction Management</h1>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
              ${TransactionTable(filteredTxs, users, accounts)}
            </div>
          </div>
        </div>
      </div>
      <div id="tx-detail-panel"></div>
      <div id="manual-tx-panel"></div>
      <div id="codes-panel"></div>
    `;

    // Sidebar toggle for mobile
    const sidebar = document.getElementById("admin-sidebar");
    const overlay = document.getElementById("admin-sidebar-overlay");
    const openBtn = document.getElementById("admin-sidebar-toggle");
    const closeBtn = document.getElementById("admin-sidebar-close");

    function openSidebar() {
      isCollapsed = false;
      render();
    }
    function closeSidebar() {
      isCollapsed = true;
      render();
    }
    openBtn?.addEventListener("click", openSidebar);
    closeBtn?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    // Theme toggle logic
    document.getElementById("admin-theme-toggle")?.addEventListener("click", () => {
      isDark = !isDark;
      localStorage.setItem("admin_dark", isDark ? "true" : "false");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      render();
    });

    // Nav click
    document.querySelectorAll("[data-nav]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        activeItem = link.getAttribute("data-nav");
        window.location.href = `/admin/${activeItem}`;
      });
    });

    // Logout
    document.getElementById("admin-logout")?.addEventListener("click", () => {
      sessionStorage.removeItem('admin_logged_in');
      window.location.href = "/admin-login";
    });

    // Set theme on load
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Filtering
    const searchInput = document.getElementById("tx-search");
    const typeFilter = document.getElementById("tx-type-filter");
    const statusFilter = document.getElementById("tx-status-filter");
    const dateFrom = document.getElementById("tx-date-from");
    const dateTo = document.getElementById("tx-date-to");
    const tableBody = document.getElementById("tx-table-body");

    function filterTxs() {
      let q = searchInput.value.trim().toLowerCase();
      let type = typeFilter.value;
      let status = statusFilter.value;
      let from = dateFrom.value;
      let to = dateTo.value;
      filteredTxs = txs.filter(t => {
        const user = users.find(u => u.id === t.user_id);
        const acc = accounts.find(a => a.id === t.account_id);
        let match = true;
        if (q) {
          match = (user?.full_name?.toLowerCase().includes(q) || user?.email?.toLowerCase().includes(q) || acc?.account_number?.includes(q) || t.type?.includes(q));
        }
        if (type && t.type !== type) match = false;
        if (status && t.status !== status) match = false;
        if (from && new Date(t.created_at) < new Date(from)) match = false;
        if (to && new Date(t.created_at) > new Date(to + "T23:59:59")) match = false;
        return match;
      });
      tableBody.innerHTML = filteredTxs.map(t => {
        const user = users.find(u => u.id === t.user_id);
        const acc = accounts.find(a => a.id === t.account_id);
        return `
          <tr>
            <td>${formatDate(t.created_at)}</td>
            <td>
              <span class="font-semibold">${user?.full_name || "Unknown"}</span>
              <div class="text-xs text-gray-400">${user?.email || ""}</div>
            </td>
            <td>
              <span class="font-mono">${acc?.account_number || "-"}</span>
              <div class="text-xs text-gray-400">${acc?.account_type || ""}</div>
            </td>
            <td>${t.type}</td>
            <td>$${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td>${statusBadge(t.status)}</td>
            <td>
              <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded tx-view" data-txid="${t.id}">View</button>
              ${t.status === "pending" ? `<button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded tx-approve" data-txid="${t.id}">Approve</button>` : ""}
              ${t.status === "failed" ? `<button class="btn btn-xs bg-yellow-600 text-white px-2 py-1 rounded tx-retry" data-txid="${t.id}">Retry</button>` : ""}
              ${t.status === "completed" && t.type !== "reversed" ? `<button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded tx-reverse" data-txid="${t.id}">Reverse</button>` : ""}
            </td>
          </tr>
        `;
      }).join("");
      attachRowEvents();
    }

    [searchInput, typeFilter, statusFilter, dateFrom, dateTo].forEach(el => {
      if (el) el.addEventListener("input", filterTxs);
      if (el) el.addEventListener("change", filterTxs);
    });

    // Export CSV
    document.getElementById("tx-export-csv").onclick = () => exportCSV(filteredTxs, users, accounts);

    // Manual Transaction
    document.getElementById("tx-create-manual").onclick = () => {
      document.getElementById("manual-tx-panel").innerHTML = ManualTransactionModal(users, accounts);
      document.getElementById("close-manual-tx").onclick = () => {
        document.getElementById("manual-tx-panel").innerHTML = "";
      };
      // Auto-select account when user is chosen
      const userSelect = document.getElementById("manual-user-select");
      const accountSelect = document.getElementById("manual-account-select");
      userSelect.addEventListener("change", function () {
        const userId = this.value;
        const firstAcc = Array.from(accountSelect.options).find(opt => opt.dataset.user === userId);
        if (firstAcc) {
          accountSelect.value = firstAcc.value;
        } else {
          accountSelect.value = "";
        }
      });
      document.getElementById("manual-tx-form").onsubmit = async function (e) {
        e.preventDefault();
        const user_id = this.user_id.value;
        const account_id = this.account_id.value;
        const type = this.type.value;
        const amount = parseFloat(this.amount.value);
        const description = this.description.value;
        if (!user_id || !account_id || !type || !amount) return showToast("Fill all fields", "error");
        const acc = accounts.find(a => a.id === account_id);
        const user = users.find(u => u.id === user_id);
        if (!acc || !user) return showToast("Invalid user/account", "error");
        const balance_before = parseFloat(acc.balance);
        let balance_after = balance_before;
        if (type === "deposit" || type === "manual") balance_after += amount;
        if (type === "withdrawal") balance_after -= amount;
        const { error } = await supabase.from("transactions").insert([{
          user_id, account_id, type, amount, description, balance_before, balance_after, status: "completed"
        }]);
        if (error) return showToast("Failed to create transaction", "error");
        await supabase.from("accounts").update({ balance: balance_after }).eq("id", account_id);
        // Generate codes and show modal
        const cot = genCode("COT-");
        const imf = genCode("IMF-");
        const vat = genCode("VAT-");
        document.getElementById("codes-panel").innerHTML = CodesModal({ cot, imf, vat, user });
        document.querySelectorAll(".copy-code-btn").forEach(btn => {
          btn.onclick = () => {
            navigator.clipboard.writeText(btn.dataset.code);
            showToast("Code copied!", "success");
          };
        });
        document.getElementById("close-codes-modal").onclick = () => {
          document.getElementById("codes-panel").innerHTML = "";
          render();
        };
        document.querySelector(".send-codes-email").onclick = async function () {
          const emailBody = `
            <div style="font-family:sans-serif">
              <h2>Transaction Codes</h2>
              <p>Dear ${user.full_name},</p>
              <p>Your transaction codes:</p>
              <ul>
                <li>COT: <b>${cot}</b></li>
                <li>IMF: <b>${imf}</b></li>
                <li>VAT: <b>${vat}</b></li>
              </ul>
              <p>Keep these codes safe. Contact support if you did not request this.</p>
              <p>Horizon Ridge Credit Union</p>
            </div>
          `;
          try {
            await sendEmail({
              to: user.email,
              subject: "Transaction Codes",
              html: emailBody
            });
            showToast("Codes sent to user email!", "success");
          } catch {
            showToast("Failed to send codes email", "error");
          }
        };
      };
    };

    // Generate codes button (standalone)
    document.getElementById("tx-generate-codes").onclick = () => {
      const user = users[0] || { email: "demo@demo.com", full_name: "Demo User" };
      const cot = genCode("COT-");
      const imf = genCode("IMF-");
      const vat = genCode("VAT-");
      document.getElementById("codes-panel").innerHTML = CodesModal({ cot, imf, vat, user });
      document.querySelectorAll(".copy-code-btn").forEach(btn => {
        btn.onclick = () => {
          navigator.clipboard.writeText(btn.dataset.code);
          showToast("Code copied!", "success");
        };
      });
      document.getElementById("close-codes-modal").onclick = () => {
        document.getElementById("codes-panel").innerHTML = "";
      };
      document.querySelector(".send-codes-email").onclick = async function () {
        const emailBody = `
          <div style="font-family:sans-serif">
            <h2>Transaction Codes</h2>
            <p>Dear ${user.full_name},</p>
            <p>Your transaction codes:</p>
            <ul>
              <li>COT: <b>${cot}</b></li>
              <li>IMF: <b>${imf}</b></li>
              <li>VAT: <b>${vat}</b></li>
            </ul>
            <p>Keep these codes safe. Contact support if you did not request this.</p>
            <p>Horizon Ridge Credit Union</p>
          </div>
        `;
        try {
          await sendEmail({
            to: user.email,
            subject: "Transaction Codes",
            html: emailBody
          });
          showToast("Codes sent to user email!", "success");
        } catch {
          showToast("Failed to send codes email", "error");
        }
      };
    };

    // Row actions (view, approve, retry, reverse)
    function attachRowEvents() {
      document.querySelectorAll('.tx-view').forEach(btn => {
        btn.onclick = () => {
          const txid = btn.getAttribute("data-txid");
          const tx = txs.find(t => t.id === txid);
          const user = users.find(u => u.id === tx.user_id);
          const acc = accounts.find(a => a.id === tx.account_id);
          document.getElementById("tx-detail-panel").innerHTML = TransactionDetailModal(tx, user, acc);
          document.getElementById("close-tx-detail").onclick = () => {
            document.getElementById("tx-detail-panel").innerHTML = "";
          };
          // Approve
          const approveBtn = document.querySelector("#tx-detail-panel .tx-approve");
          if (approveBtn) approveBtn.onclick = async () => {
            await supabase.from("transactions").update({ status: "completed" }).eq("id", txid);
            showToast("Transaction approved", "success");
            render();
          };
          // Retry
          const retryBtn = document.querySelector("#tx-detail-panel .tx-retry");
          if (retryBtn) retryBtn.onclick = async () => {
            await supabase.from("transactions").update({ status: "pending" }).eq("id", txid);
            showToast("Transaction set to pending", "success");
            render();
          };
          // Reverse
          const reverseBtn = document.querySelector("#tx-detail-panel .tx-reverse");
          if (reverseBtn) reverseBtn.onclick = async () => {
            await supabase.from("transactions").update({ status: "reversed", type: "reversed" }).eq("id", txid);
            showToast("Transaction reversed", "success");
            render();
          };
        };
      });
      document.querySelectorAll('.tx-approve').forEach(btn => {
        btn.onclick = async () => {
          const txid = btn.getAttribute("data-txid");
          await supabase.from("transactions").update({ status: "completed" }).eq("id", txid);
          showToast("Transaction approved", "success");
          render();
        };
      });
      document.querySelectorAll('.tx-retry').forEach(btn => {
        btn.onclick = async () => {
          const txid = btn.getAttribute("data-txid");
          await supabase.from("transactions").update({ status: "pending" }).eq("id", txid);
          showToast("Transaction set to pending", "success");
          render();
        };
      });
      document.querySelectorAll('.tx-reverse').forEach(btn => {
        btn.onclick = async () => {
          const txid = btn.getAttribute("data-txid");
          await supabase.from("transactions").update({ status: "reversed", type: "reversed" }).eq("id", txid);
          showToast("Transaction reversed", "success");
          render();
        };
      });
    }
    attachRowEvents();
  }

  return {
    html: "",
    pageEvents: () => render()
  };
};

export default transactions;