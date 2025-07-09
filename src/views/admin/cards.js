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
  if (status === "printing") return `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Printing</span>`;
  if (status === "issued") return `<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Issued</span>`;
  if (status === "declined") return `<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Declined</span>`;
  return `<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">${status}</span>`;
}

function CardTable(cards, users) {
  return `
    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <input type="text" id="card-search" placeholder="Search by user, card number, type..." class="border px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500" />
      <select id="card-status-filter" class="border px-2 py-2 rounded">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="printing">Printing</option>
        <option value="issued">Issued</option>
        <option value="declined">Declined</option>
      </select>
      <button id="card-export-csv" class="ml-auto bg-blue-600 text-white px-3 py-2 rounded">Export CSV</button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Card Number</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="card-table-body">
          ${cards.map(c => {
            const user = users.find(u => u.id === c.user_id);
            return `
              <tr>
                <td>${formatDate(c.issued_at)}</td>
                <td>
                  <span class="font-semibold">${user?.full_name || "Unknown"}</span>
                  <div class="text-xs text-gray-400">${user?.email || ""}</div>
                </td>
                <td>${c.card_number || "-"}</td>
                <td>${c.card_type || "-"}</td>
                <td>${statusBadge(c.status)}</td>
                <td>
                  ${c.status === "pending" ? `
                    <button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded card-approve" data-id="${c.id}">Approve</button>
                    <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded card-decline" data-id="${c.id}">Decline</button>
                  ` : ""}
                  ${c.status === "approved" ? `
                    <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded card-print" data-id="${c.id}">Mark Printing</button>
                  ` : ""}
                  ${c.status === "printing" ? `
                    <button class="btn btn-xs bg-purple-600 text-white px-2 py-1 rounded card-issue" data-id="${c.id}">Issue Card</button>
                  ` : ""}
                  <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded card-view" data-id="${c.id}">View</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function CardDetailModal(card, user) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="card-detail-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-card-detail">&times;</button>
        <h2 class="text-xl font-bold mb-4">Card Details</h2>
        <div class="mb-2"><b>User:</b> ${user?.full_name || "Unknown"} (${user?.email || ""})</div>
        <div class="mb-2"><b>Card Number:</b> ${card.card_number || "-"}</div>
        <div class="mb-2"><b>Type:</b> ${card.card_type || "-"}</div>
        <div class="mb-2"><b>Status:</b> ${statusBadge(card.status)}</div>
        <div class="mb-2"><b>Issued At:</b> ${formatDate(card.issued_at)}</div>
        <div class="mb-2"><b>Brand:</b> ${card.brand || "-"}</div>
        <div class="mb-2"><b>Physical:</b> ${card.is_physical ? "Yes" : "No"}</div>
        <div class="mb-2"><b>Notes:</b> ${card.notes || "-"}</div>
      </div>
    </div>
  `;
}

function DeclineReasonModal(cardId) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="decline-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-decline-modal">&times;</button>
        <h2 class="text-xl font-bold mb-4">Decline Card Request</h2>
        <form id="decline-form">
          <input type="hidden" name="card_id" value="${cardId}" />
          <div class="mb-3">
            <label class="block text-sm mb-1">Reason</label>
            <textarea name="reason" class="w-full border px-3 py-2 rounded" rows="3" required></textarea>
          </div>
          <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded">Decline</button>
        </form>
      </div>
    </div>
  `;
}

function exportCSV(cards, users) {
  const header = ["Date", "User", "Card Number", "Type", "Status"];
  const rows = cards.map(c => {
    const user = users.find(u => u.id === c.user_id);
    return [
      formatDate(c.issued_at),
      user?.full_name || "",
      c.card_number || "",
      c.card_type || "",
      c.status
    ].join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cards.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const cards = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => {} };

  let { data: cardsArr = [] } = await supabase.from("cards").select("*").order("issued_at", { ascending: false }).limit(100);
  let { data: users = [] } = await supabase.from("profiles").select("id,full_name,email");

  let filteredCards = cardsArr;
  let activeItem = "cards";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Card Management</h1>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
              ${CardTable(filteredCards, users)}
            </div>
          </div>
        </div>
      </div>
      <div id="card-detail-panel"></div>
      <div id="decline-panel"></div>
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
    const searchInput = document.getElementById("card-search");
    const statusFilter = document.getElementById("card-status-filter");
    const tableBody = document.getElementById("card-table-body");
    function filterCards() {
      let q = searchInput.value.trim().toLowerCase();
      let status = statusFilter.value;
      filteredCards = cardsArr.filter(c => {
        const user = users.find(u => u.id === c.user_id);
        let match = true;
        if (q) {
          match = (user?.full_name?.toLowerCase().includes(q) || user?.email?.toLowerCase().includes(q) || (c.card_number || "").includes(q) || (c.card_type || "").toLowerCase().includes(q));
        }
        if (status && c.status !== status) match = false;
        return match;
      });
      tableBody.innerHTML = filteredCards.map(c => {
        const user = users.find(u => u.id === c.user_id);
        return `
          <tr>
            <td>${formatDate(c.issued_at)}</td>
            <td>
              <span class="font-semibold">${user?.full_name || "Unknown"}</span>
              <div class="text-xs text-gray-400">${user?.email || ""}</div>
            </td>
            <td>${c.card_number || "-"}</td>
            <td>${c.card_type || "-"}</td>
            <td>${statusBadge(c.status)}</td>
            <td>
              ${c.status === "pending" ? `
                <button class="btn btn-xs bg-green-600 text-white px-2 py-1 rounded card-approve" data-id="${c.id}">Approve</button>
                <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded card-decline" data-id="${c.id}">Decline</button>
              ` : ""}
              ${c.status === "approved" ? `
                <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded card-print" data-id="${c.id}">Mark Printing</button>
              ` : ""}
              ${c.status === "printing" ? `
                <button class="btn btn-xs bg-purple-600 text-white px-2 py-1 rounded card-issue" data-id="${c.id}">Issue Card</button>
              ` : ""}
              <button class="btn btn-xs bg-gray-600 text-white px-2 py-1 rounded card-view" data-id="${c.id}">View</button>
            </td>
          </tr>
        `;
      }).join("");
      attachRowEvents();
    }
    [searchInput, statusFilter].forEach(el => {
      if (el) el.addEventListener("input", filterCards);
      if (el) el.addEventListener("change", filterCards);
    });

    // Export CSV
    document.getElementById("card-export-csv").onclick = () => exportCSV(filteredCards, users);

    // Row actions
    function attachRowEvents() {
      document.querySelectorAll('.card-view').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          const card = cardsArr.find(c => c.id === id);
          const user = users.find(u => u.id === card.user_id);
          document.getElementById("card-detail-panel").innerHTML = CardDetailModal(card, user);
          document.getElementById("close-card-detail").onclick = () => {
            document.getElementById("card-detail-panel").innerHTML = "";
          };
        };
      });
      document.querySelectorAll('.card-approve').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          // Prompt for type/brand
          const type = prompt("Enter card type (e.g. Debit, Credit):", "Debit");
          const brand = prompt("Enter card brand (e.g. Visa, MasterCard):", "Visa");
          if (!type || !brand) return showToast("Type and brand required", "error");
          await supabase.from("cards").update({ status: "approved", card_type: type, brand }).eq("id", id);
          // Notify user
          const card = cardsArr.find(c => c.id === id);
          const user = users.find(u => u.id === card.user_id);
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              subject: "Card Request Approved",
              message: `<p>Dear ${user.full_name},<br>Your card request has been approved. Type: <b>${type}</b>, Brand: <b>${brand}</b>.<br>We will notify you when your card is ready.</p>`
            })
          });
          showToast("Card approved and user notified.", "success");
          window.location.reload();
        };
      });
      document.querySelectorAll('.card-print').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          await supabase.from("cards").update({ status: "printing" }).eq("id", id);
          showToast("Card marked as printing.", "success");
          window.location.reload();
        };
      });
      document.querySelectorAll('.card-issue').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          const cardNumber = prompt("Enter issued card number (last 4 digits):");
          if (!cardNumber || cardNumber.length < 4) return showToast("Card number required", "error");
          await supabase.from("cards").update({ status: "issued", card_number: cardNumber }).eq("id", id);
          // Notify user
          const card = cardsArr.find(c => c.id === id);
          const user = users.find(u => u.id === card.user_id);
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: user.email,
              subject: "Your Card is Ready",
              message: `<p>Dear ${user.full_name},<br>Your card ending in <b>${cardNumber}</b> is now ready for pickup/use.</p>`
            })
          });
          showToast("Card issued and user notified.", "success");
          window.location.reload();
        };
      });
      document.querySelectorAll('.card-decline').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          document.getElementById("decline-panel").innerHTML = DeclineReasonModal(id);
          document.getElementById("close-decline-modal").onclick = () => {
            document.getElementById("decline-panel").innerHTML = "";
          };
          document.getElementById("decline-form").onsubmit = async function (e) {
            e.preventDefault();
            const reason = this.reason.value.trim();
            if (!reason) return showToast("Reason required", "error");
            await supabase.from("cards").update({ status: "declined", notes: reason }).eq("id", id);
            // Notify user
            const card = cardsArr.find(c => c.id === id);
            const user = users.find(u => u.id === card.user_id);
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: user.email,
                subject: "Card Request Declined",
                message: `<p>Dear ${user.full_name},<br>Your card request was declined. Reason: <b>${reason}</b></p>`
              })
            });
            showToast("Card declined and user notified.", "success");
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

export default cards;