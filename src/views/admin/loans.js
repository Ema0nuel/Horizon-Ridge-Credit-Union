import { supabase } from "/src/utils/supabaseClient.js";
import AdminNavbar from "./components/AdminNavbar.js";
import { requireAdmin } from "./utils/adminAuth.js";
import { showToast } from "/src/components/toast.js";

// Helper: Format date
function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function statusBadge(status) {
  if (status === "pending") return `<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>`;
  if (status === "approved") return `<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Approved</span>`;
  if (status === "disbursed") return `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Disbursed</span>`;
  if (status === "rejected") return `<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Rejected</span>`;
  if (status === "closed") return `<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Closed</span>`;
  return `<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">${status}</span>`;
}

function LoanTable(loans, users) {
  return `
    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <input type="text" id="loan-search" placeholder="Search by user, amount, status..." class="border px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500" />
      <select id="loan-status-filter" class="border px-2 py-2 rounded">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="disbursed">Disbursed</option>
        <option value="rejected">Rejected</option>
        <option value="closed">Closed</option>
      </select>
      <button id="loan-export-csv" class="ml-auto bg-blue-600 text-white px-3 py-2 rounded">Export CSV</button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Amount</th>
            <th>Interest</th>
            <th>Total Repayable</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="loan-table-body">
          ${loans.map(l => {
            const user = users.find(u => u.id === l.user_id);
            return `
              <tr>
                <td>${formatDate(l.created_at)}</td>
                <td>
                  <span class="font-semibold">${user?.full_name || "Unknown"}</span>
                  <div class="text-xs text-gray-400">${user?.email || ""}</div>
                </td>
                <td>$${parseFloat(l.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>${l.interest_rate ? l.interest_rate + "%" : "-"}</td>
                <td>$${l.total_repayable ? parseFloat(l.total_repayable).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}</td>
                <td>${statusBadge(l.status)}</td>
                <td>
                  ${l.status === "pending" ? `
                    <button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded loan-approve" data-id="${l.id}">Approve</button>
                    <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded loan-reject" data-id="${l.id}">Reject</button>
                  ` : ""}
                  ${l.status === "approved" ? `
                    <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded loan-disburse" data-id="${l.id}">Disburse</button>
                  ` : ""}
                  <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded loan-view" data-id="${l.id}">View</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function LoanDetailModal(loan, user) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="loan-detail-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-loan-detail">&times;</button>
        <h2 class="text-xl font-bold mb-4">Loan Details</h2>
        <div class="mb-2"><b>User:</b> ${user?.full_name || "Unknown"} (${user?.email || ""})</div>
        <div class="mb-2"><b>Amount:</b> $${parseFloat(loan.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div class="mb-2"><b>Interest:</b> ${loan.interest_rate ? loan.interest_rate + "%" : "-"}</div>
        <div class="mb-2"><b>Total Repayable:</b> $${loan.total_repayable ? parseFloat(loan.total_repayable).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}</div>
        <div class="mb-2"><b>Status:</b> ${statusBadge(loan.status)}</div>
        <div class="mb-2"><b>Reason:</b> ${loan.reason || "-"}</div>
        <div class="mb-2"><b>Created:</b> ${formatDate(loan.created_at)}</div>
      </div>
    </div>
  `;
}

function RejectReasonModal(loanId) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="reject-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-reject-modal">&times;</button>
        <h2 class="text-xl font-bold mb-4">Reject Loan Request</h2>
        <form id="reject-form">
          <input type="hidden" name="loan_id" value="${loanId}" />
          <div class="mb-3">
            <label class="block text-sm mb-1">Reason</label>
            <textarea name="reason" class="w-full border px-3 py-2 rounded" rows="3" required></textarea>
          </div>
          <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
        </form>
      </div>
    </div>
  `;
}

function exportCSV(loans, users) {
  const header = ["Date", "User", "Amount", "Interest", "Total Repayable", "Status"];
  const rows = loans.map(l => {
    const user = users.find(u => u.id === l.user_id);
    return [
      formatDate(l.created_at),
      user?.full_name || "",
      l.amount,
      l.interest_rate || "",
      l.total_repayable || "",
      l.status
    ].join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "loans.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const loans = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => {} };

  let { data: loansArr = [] } = await supabase.from("loan").select("*").order("created_at", { ascending: false }).limit(100);
  let { data: users = [] } = await supabase.from("profiles").select("id,full_name,email");
  let { data: accounts = [] } = await supabase.from("accounts").select("*");

  let filteredLoans = loansArr;
  let activeItem = "loans";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Loan Management</h1>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
              ${LoanTable(filteredLoans, users)}
            </div>
          </div>
        </div>
      </div>
      <div id="loan-detail-panel"></div>
      <div id="reject-panel"></div>
    `;

    // Sidebar, theme, nav, logout logic (same as dashboard.js)
    const sidebar = document.getElementById("admin-sidebar");
    const overlay = document.getElementById("admin-sidebar-overlay");
    const openBtn = document.getElementById("admin-sidebar-toggle");
    const closeBtn = document.getElementById("admin-sidebar-close");
    function openSidebar() { isCollapsed = false; render(); }
    function closeSidebar() { isCollapsed = true; render(); }
    openBtn?.addEventListener("click", openSidebar);
    closeBtn?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);
    document.getElementById("admin-theme-toggle")?.addEventListener("click", () => {
      isDark = !isDark;
      localStorage.setItem("admin_dark", isDark ? "true" : "false");
      if (isDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      render();
    });
    document.querySelectorAll("[data-nav]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        activeItem = link.getAttribute("data-nav");
        window.location.href = `/admin/${activeItem}`;
      });
    });
    document.getElementById("admin-logout")?.addEventListener("click", () => {
      sessionStorage.removeItem('admin_logged_in');
      window.location.href = "/admin-login";
    });
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    // Filtering
    const searchInput = document.getElementById("loan-search");
    const statusFilter = document.getElementById("loan-status-filter");
    const tableBody = document.getElementById("loan-table-body");
    function filterLoans() {
      let q = searchInput.value.trim().toLowerCase();
      let status = statusFilter.value;
      filteredLoans = loansArr.filter(l => {
        const user = users.find(u => u.id === l.user_id);
        let match = true;
        if (q) {
          match = (user?.full_name?.toLowerCase().includes(q) || user?.email?.toLowerCase().includes(q) || (l.amount + "").includes(q) || (l.status || "").toLowerCase().includes(q));
        }
        if (status && l.status !== status) match = false;
        return match;
      });
      tableBody.innerHTML = filteredLoans.map(l => {
        const user = users.find(u => u.id === l.user_id);
        return `
          <tr>
            <td>${formatDate(l.created_at)}</td>
            <td>
              <span class="font-semibold">${user?.full_name || "Unknown"}</span>
              <div class="text-xs text-gray-400">${user?.email || ""}</div>
            </td>
            <td>$${parseFloat(l.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td>${l.interest_rate ? l.interest_rate + "%" : "-"}</td>
            <td>$${l.total_repayable ? parseFloat(l.total_repayable).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}</td>
            <td>${statusBadge(l.status)}</td>
            <td>
              ${l.status === "pending" ? `
                <button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded loan-approve" data-id="${l.id}">Approve</button>
                <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded loan-reject" data-id="${l.id}">Reject</button>
              ` : ""}
              ${l.status === "approved" ? `
                <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded loan-disburse" data-id="${l.id}">Disburse</button>
              ` : ""}
              <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded loan-view" data-id="${l.id}">View</button>
            </td>
          </tr>
        `;
      }).join("");
      attachRowEvents();
    }
    [searchInput, statusFilter].forEach(el => {
      if (el) el.addEventListener("input", filterLoans);
      if (el) el.addEventListener("change", filterLoans);
    });

    // Export CSV
    document.getElementById("loan-export-csv").onclick = () => exportCSV(filteredLoans, users);

    // Row actions
    function attachRowEvents() {
      document.querySelectorAll('.loan-view').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          const loan = loansArr.find(l => l.id === id);
          const user = users.find(u => u.id === loan.user_id);
          document.getElementById("loan-detail-panel").innerHTML = LoanDetailModal(loan, user);
          document.getElementById("close-loan-detail").onclick = () => {
            document.getElementById("loan-detail-panel").innerHTML = "";
          };
        };
      });
      document.querySelectorAll('.loan-approve').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          const interest = prompt("Enter interest rate (%)", "5");
          if (!interest || isNaN(interest)) return showToast("Interest rate required", "error");
          const loan = loansArr.find(l => l.id === id);
          const total = parseFloat(loan.amount) + (parseFloat(loan.amount) * parseFloat(interest) / 100);
          await supabase.from("loan").update({ status: "approved", interest_rate: interest, total_repayable: total }).eq("id", id);
          // Notify user
          const user = users.find(u => u.id === loan.user_id);
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              subject: "Loan Approved",
              message: `<p>Dear ${user.full_name},<br>Your loan request has been approved. Amount: <b>$${loan.amount}</b>, Interest: <b>${interest}%</b>, Total Repayable: <b>$${total}</b>.</p>`
            })
          });
          showToast("Loan approved and user notified.", "success");
          window.location.reload();
        };
      });
      document.querySelectorAll('.loan-disburse').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          const loan = loansArr.find(l => l.id === id);
          // Find user's main account
          const userAcc = accounts.find(a => a.user_id === loan.user_id);
          if (!userAcc) return showToast("No account found for user", "error");
          // Update account balance
          const newBalance = parseFloat(userAcc.balance) + parseFloat(loan.amount);
          await supabase.from("accounts").update({ balance: newBalance }).eq("id", userAcc.id);
          // Update loan status
          await supabase.from("loan").update({ status: "disbursed" }).eq("id", id);
          // Log transaction
          await supabase.from("transactions").insert([{
            user_id: loan.user_id,
            account_id: userAcc.id,
            type: "loan_disbursement",
            amount: loan.amount,
            description: "Loan disbursed",
            balance_before: userAcc.balance,
            balance_after: newBalance,
            status: "completed"
          }]);
          // Notify user
          const user = users.find(u => u.id === loan.user_id);
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              subject: "Loan Disbursed",
              message: `<p>Dear ${user.full_name},<br>Your loan of <b>$${loan.amount}</b> has been disbursed to your account.</p>`
            })
          });
          showToast("Loan disbursed, transaction logged, user notified.", "success");
          window.location.reload();
        };
      });
      document.querySelectorAll('.loan-reject').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          document.getElementById("reject-panel").innerHTML = RejectReasonModal(id);
          document.getElementById("close-reject-modal").onclick = () => {
            document.getElementById("reject-panel").innerHTML = "";
          };
          document.getElementById("reject-form").onsubmit = async function (e) {
            e.preventDefault();
            const reason = this.reason.value.trim();
            if (!reason) return showToast("Reason required", "error");
            await supabase.from("loan").update({ status: "rejected", reason }).eq("id", id);
            // Notify user
            const loan = loansArr.find(l => l.id === id);
            const user = users.find(u => u.id === loan.user_id);
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: user.email,
                subject: "Loan Request Rejected",
                message: `<p>Dear ${user.full_name},<br>Your loan request was rejected. Reason: <b>${reason}</b></p>`
              })
            });
            showToast("Loan rejected and user notified.", "success");
            window.location.reload();
          };
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

export default loans;