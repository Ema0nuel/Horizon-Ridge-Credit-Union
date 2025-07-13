import { supabase } from "/src/utils/supabaseClient.js";
import AdminNavbar from "./components/AdminNavbar.js";
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


// Complex codes array for COT, IMF, VAT
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

function getRandomComplexCode() {
  return complexCodes[Math.floor(Math.random() * complexCodes.length)];
}

// Codes Modal (centered, scrollable, always visible)
function CodesModal({ cot, imf, vat, user }) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="codes-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in">
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
        <button class="bg-blue-600 text-white px-4 py-2 rounded send-codes-email w-full mt-2" data-email="${user.email}" data-cot="${cot}" data-imf="${imf}" data-vat="${vat}">Send Codes to User Email</button>
      </div>
    </div>
  `;
}

// Transaction Edit Modal (centered, scrollable, always visible)
function TransactionEditModal({ tx, users, accounts }) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="tx-edit-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-tx-edit">&times;</button>
        <h2 class="text-xl font-bold mb-4">Edit Transaction</h2>
        <form id="tx-edit-form">
          <div class="mb-3">
            <label class="block text-sm mb-1">User</label>
            <select name="user_id" class="w-full border px-3 py-2 rounded" required>
              ${users.map(u => `<option value="${u.id}" ${tx.user_id === u.id ? "selected" : ""}>${u.full_name} (${u.email})</option>`).join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Account</label>
            <select name="account_id" class="w-full border px-3 py-2 rounded" required>
              ${accounts.map(a => `<option value="${a.id}" ${tx.account_id === a.id ? "selected" : ""}>${a.account_number} (${a.account_type})</option>`).join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Type</label>
            <select name="type" class="w-full border px-3 py-2 rounded" required>
              <option value="deposit" ${tx.type === "deposit" ? "selected" : ""}>Deposit</option>
              <option value="withdrawal" ${tx.type === "withdrawal" ? "selected" : ""}>Withdrawal</option>
              <option value="transfer" ${tx.type === "transfer" ? "selected" : ""}>Transfer</option>
              <option value="manual" ${tx.type === "manual" ? "selected" : ""}>Manual</option>
              <option value="reversed" ${tx.type === "reversed" ? "selected" : ""}>Reversed</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Amount</label>
            <input type="number" name="amount" step="0.01" min="0.01" class="w-full border px-3 py-2 rounded" value="${tx.amount}" required />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Status</label>
            <select name="status" class="w-full border px-3 py-2 rounded" required>
              <option value="completed" ${tx.status === "completed" ? "selected" : ""}>Completed</option>
              <option value="pending" ${tx.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="failed" ${tx.status === "failed" ? "selected" : ""}>Failed</option>
              <option value="reversed" ${tx.status === "reversed" ? "selected" : ""}>Reversed</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Date</label>
            <input type="datetime-local" name="created_at" class="w-full border px-3 py-2 rounded" value="${tx.created_at ? new Date(tx.created_at).toISOString().slice(0, 16) : ""}" required />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Description</label>
            <textarea name="description" class="w-full border px-3 py-2 rounded" rows="2">${tx.description || ""}</textarea>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Balance Before</label>
            <input type="number" name="balance_before" step="0.01" class="w-full border px-3 py-2 rounded" value="${tx.balance_before || ""}" />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Balance After</label>
            <input type="number" name="balance_after" step="0.01" class="w-full border px-3 py-2 rounded" value="${tx.balance_after || ""}" />
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full">Save Changes</button>
        </form>
      </div>
    </div>
  `;
}

// Responsive Transaction Table (cards on mobile, table on desktop)
function TransactionTable(transactions, users, accounts) {
  return `
    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <input type="text" id="tx-search" placeholder="Search by user, account, type..." class="border px-3 py-2 rounded w-full sm:w-64 focus:ring-2 focus:ring-blue-500" />
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
    <div>
      <div class="block sm:hidden">
        ${transactions.map(t => {
    const user = users.find(u => u.id === t.user_id);
    const acc = accounts.find(a => a.id === t.account_id);
    return `
            <div class="bg-white dark:bg-slate-900 rounded-xl shadow p-4 mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold">${user?.full_name || "Unknown"}</span>
                ${statusBadge(t.status)}
              </div>
              <div class="text-xs text-gray-400 mb-1">${user?.email || ""}</div>
              <div class="mb-1"><b>Account:</b> <span class="font-mono">${acc?.account_number || "-"}</span> <span class="text-xs text-gray-400">(${acc?.account_type || ""})</span></div>
              <div class="mb-1"><b>Type:</b> ${t.type}</div>
              <div class="mb-1"><b>Amount:</b> $${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div class="mb-1"><b>Date:</b> ${formatDate(t.created_at)}</div>
              <div class="flex flex-wrap gap-2 mt-2">
                <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded tx-view" data-txid="${t.id}">View</button>
                <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded tx-edit" data-txid="${t.id}">Edit</button>
                ${t.status === "pending" ? `<button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded tx-approve" data-txid="${t.id}">Approve</button>` : ""}
                ${t.status === "failed" ? `<button class="btn btn-xs bg-yellow-600 text-white px-2 py-1 rounded tx-retry" data-txid="${t.id}">Retry</button>` : ""}
                ${t.status === "completed" && t.type !== "reversed" ? `<button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded tx-reverse" data-txid="${t.id}">Reverse</button>` : ""}
              </div>
            </div>
          `;
  }).join("")}
      </div>
      <div class="hidden sm:block overflow-x-auto">
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
                    <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded tx-edit" data-txid="${t.id}">Edit</button>
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
    </div>
  `;
}

// Transaction Detail Modal (centered, scrollable, always visible)
function TransactionDetailModal(tx, user, acc) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="tx-detail-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in">
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
        <div class="flex gap-2 mt-4 flex-wrap">
          ${tx.status === "pending" ? `<button class="bg-green-600 text-white px-3 py-2 rounded tx-approve" data-txid="${tx.id}">Approve</button>` : ""}
          ${tx.status === "failed" ? `<button class="bg-yellow-600 text-white px-3 py-2 rounded tx-retry" data-txid="${tx.id}">Retry</button>` : ""}
          ${tx.status === "completed" && tx.type !== "reversed" ? `<button class="bg-red-600 text-white px-3 py-2 rounded tx-reverse" data-txid="${tx.id}">Reverse</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

// Manual Transaction Modal (centered, scrollable, always visible)
function ManualTransactionModal(users, accounts) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="manual-tx-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in">
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
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full">Send</button>
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
  if (!(await requireAdmin())) return { html: "", pageEvents: () => { } };

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
        <div class="p-4 sm:p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Transaction Management</h1>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 sm:p-6">
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
      if (isDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
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
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

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
      // For mobile, re-render the whole table
      if (window.innerWidth < 640) {
        document.querySelector(".block.sm\\:hidden").innerHTML = filteredTxs.map(t => {
          const user = users.find(u => u.id === t.user_id);
          const acc = accounts.find(a => a.id === t.account_id);
          return `
            <div class="bg-white dark:bg-slate-900 rounded-xl shadow p-4 mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold">${user?.full_name || "Unknown"}</span>
                ${statusBadge(t.status)}
              </div>
              <div class="text-xs text-gray-400 mb-1">${user?.email || ""}</div>
              <div class="mb-1"><b>Account:</b> <span class="font-mono">${acc?.account_number || "-"}</span> <span class="text-xs text-gray-400">(${acc?.account_type || ""})</span></div>
              <div class="mb-1"><b>Type:</b> ${t.type}</div>
              <div class="mb-1"><b>Amount:</b> $${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div class="mb-1"><b>Date:</b> ${formatDate(t.created_at)}</div>
              <div class="flex flex-wrap gap-2 mt-2">
                <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded tx-view" data-txid="${t.id}">View</button>
                <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded tx-edit" data-txid="${t.id}">Edit</button>
                ${t.status === "pending" ? `<button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded tx-approve" data-txid="${t.id}">Approve</button>` : ""}
                ${t.status === "failed" ? `<button class="btn btn-xs bg-yellow-600 text-white px-2 py-1 rounded tx-retry" data-txid="${t.id}">Retry</button>` : ""}
                ${t.status === "completed" && t.type !== "reversed" ? `<button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded tx-reverse" data-txid="${t.id}">Reverse</button>` : ""}
              </div>
            </div>
          `;
        }).join("");
      } else if (tableBody) {
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
                <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded tx-edit" data-txid="${t.id}">Edit</button>
                ${t.status === "pending" ? `<button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded tx-approve" data-txid="${t.id}">Approve</button>` : ""}
                ${t.status === "failed" ? `<button class="btn btn-xs bg-yellow-600 text-white px-2 py-1 rounded tx-retry" data-txid="${t.id}">Retry</button>` : ""}
                ${t.status === "completed" && t.type !== "reversed" ? `<button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded tx-reverse" data-txid="${t.id}">Reverse</button>` : ""}
              </td>
            </tr>
          `;
        }).join("");
      }
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
        // Generate codes from complexCodes array and show modal
        const cot = getRandomComplexCode();
        const imf = getRandomComplexCode();
        const vat = getRandomComplexCode();
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
      const cot = getRandomComplexCode();
      const imf = getRandomComplexCode();
      const vat = getRandomComplexCode();
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

    // Row actions (view, approve, retry, reverse, edit)
    function attachRowEvents() {
      // Edit transaction handler
      document.querySelectorAll('.tx-edit').forEach(btn => {
        btn.onclick = () => {
          const txid = btn.getAttribute("data-txid");
          const tx = txs.find(t => t.id === txid);
          document.getElementById("tx-detail-panel").innerHTML = TransactionEditModal({ tx, users, accounts });
          document.getElementById("close-tx-edit").onclick = () => {
            document.getElementById("tx-detail-panel").innerHTML = "";
          };
          document.getElementById("tx-edit-form").onsubmit = async function (e) {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(this));
            // Parse numbers and date
            const amount = parseFloat(formData.amount);
            const balance_before = formData.balance_before ? parseFloat(formData.balance_before) : null;
            const balance_after = formData.balance_after ? parseFloat(formData.balance_after) : null;
            const created_at = formData.created_at ? new Date(formData.created_at).toISOString() : tx.created_at;
            // Update transaction
            await supabase.from("transactions").update({
              user_id: formData.user_id,
              account_id: formData.account_id,
              type: formData.type,
              amount,
              status: formData.status,
              description: formData.description,
              balance_before,
              balance_after,
              created_at
            }).eq("id", txid);
            showToast("Transaction updated!", "success");
            document.getElementById("tx-detail-panel").innerHTML = "";
            location.reload();
          };
        };
      });
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
    attachRowEvents(); //
  }

  return {
    html: "",
    pageEvents: () => render()
  };
};

export default transactions;