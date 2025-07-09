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

function typeBadge(type) {
  if (type === "success") return `<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span>`;
  if (type === "warning") return `<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Warning</span>`;
  if (type === "danger") return `<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Danger</span>`;
  return `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Info</span>`;
}

function NotificationTable(notifications, users) {
  return `
    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <input type="text" id="notif-search" placeholder="Search by user, title, message..." class="border px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500" />
      <select id="notif-type-filter" class="border px-2 py-2 rounded">
        <option value="">All Types</option>
        <option value="info">Info</option>
        <option value="success">Success</option>
        <option value="warning">Warning</option>
        <option value="danger">Danger</option>
      </select>
      <button id="notif-export-csv" class="ml-auto bg-blue-600 text-white px-3 py-2 rounded">Export CSV</button>
      <button id="notif-send" class="bg-green-600 text-white px-3 py-2 rounded">Send Notification</button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Title</th>
            <th>Message</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="notif-table-body">
          ${notifications.map(n => {
            const user = users.find(u => u.id === n.user_id);
            return `
              <tr>
                <td>${formatDate(n.created_at)}</td>
                <td>
                  <span class="font-semibold">${user?.full_name || "Unknown"}</span>
                  <div class="text-xs text-gray-400">${user?.email || ""}</div>
                </td>
                <td>${n.title || "-"}</td>
                <td>${n.message.length > 60 ? n.message.slice(0, 60) + "..." : n.message}</td>
                <td>${typeBadge(n.type)}</td>
                <td>${n.read ? `<span class="text-green-600">Read</span>` : `<span class="text-yellow-600">Unread</span>`}</td>
                <td>
                  <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded notif-view" data-id="${n.id}">View</button>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function NotificationDetailModal(notification, user) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="notif-detail-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-notif-detail">&times;</button>
        <h2 class="text-xl font-bold mb-4">Notification Details</h2>
        <div class="mb-2"><b>User:</b> ${user?.full_name || "Unknown"} (${user?.email || ""})</div>
        <div class="mb-2"><b>Title:</b> ${notification.title || "-"}</div>
        <div class="mb-2"><b>Message:</b> ${notification.message}</div>
        <div class="mb-2"><b>Type:</b> ${typeBadge(notification.type)}</div>
        <div class="mb-2"><b>Status:</b> ${notification.read ? "Read" : "Unread"}</div>
        <div class="mb-2"><b>Created:</b> ${formatDate(notification.created_at)}</div>
      </div>
    </div>
  `;
}

function NotificationSendModal(users) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="notif-send-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-notif-send">&times;</button>
        <h2 class="text-xl font-bold mb-4">Send Notification</h2>
        <form id="notif-send-form">
          <div class="mb-3">
            <label class="block text-sm mb-1">User</label>
            <select name="user_id" class="w-full border px-3 py-2 rounded" required>
              <option value="">Select user</option>
              ${users.map(u => `<option value="${u.id}">${u.full_name} (${u.email})</option>`).join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Title</label>
            <input type="text" name="title" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Message</label>
            <textarea name="message" class="w-full border px-3 py-2 rounded" rows="4" required></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Type</label>
            <select name="type" class="w-full border px-3 py-2 rounded" required>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
            </select>
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </div>
  `;
}

function exportCSV(notifications, users) {
  const header = ["Date", "User", "Title", "Message", "Type", "Status"];
  const rows = notifications.map(n => {
    const user = users.find(u => u.id === n.user_id);
    return [
      formatDate(n.created_at),
      user?.full_name || "",
      n.title || "",
      n.message.replace(/[\r\n]+/g, " "),
      n.type,
      n.read ? "Read" : "Unread"
    ].join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notifications.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const notifications = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => {} };

  let { data: notes = [] } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
  let { data: users = [] } = await supabase.from("profiles").select("id,full_name,email");

  let filteredNotes = notes;
  let activeItem = "notifications";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">Notifications</h1>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
              ${NotificationTable(filteredNotes, users)}
            </div>
          </div>
        </div>
      </div>
      <div id="notif-detail-panel"></div>
      <div id="notif-send-panel"></div>
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
    const searchInput = document.getElementById("notif-search");
    const typeFilter = document.getElementById("notif-type-filter");
    const tableBody = document.getElementById("notif-table-body");
    function filterNotes() {
      let q = searchInput.value.trim().toLowerCase();
      let type = typeFilter.value;
      filteredNotes = notes.filter(n => {
        const user = users.find(u => u.id === n.user_id);
        let match = true;
        if (q) {
          match = (user?.full_name?.toLowerCase().includes(q) || user?.email?.toLowerCase().includes(q) || (n.title || "").toLowerCase().includes(q) || (n.message || "").toLowerCase().includes(q));
        }
        if (type && n.type !== type) match = false;
        return match;
      });
      tableBody.innerHTML = filteredNotes.map(n => {
        const user = users.find(u => u.id === n.user_id);
        return `
          <tr>
            <td>${formatDate(n.created_at)}</td>
            <td>
              <span class="font-semibold">${user?.full_name || "Unknown"}</span>
              <div class="text-xs text-gray-400">${user?.email || ""}</div>
            </td>
            <td>${n.title || "-"}</td>
            <td>${n.message.length > 60 ? n.message.slice(0, 60) + "..." : n.message}</td>
            <td>${typeBadge(n.type)}</td>
            <td>${n.read ? `<span class="text-green-600">Read</span>` : `<span class="text-yellow-600">Unread</span>`}</td>
            <td>
              <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded notif-view" data-id="${n.id}">View</button>
            </td>
          </tr>
        `;
      }).join("");
      attachRowEvents();
    }
    [searchInput, typeFilter].forEach(el => {
      if (el) el.addEventListener("input", filterNotes);
      if (el) el.addEventListener("change", filterNotes);
    });

    // Export CSV
    document.getElementById("notif-export-csv").onclick = () => exportCSV(filteredNotes, users);

    // Send Notification
    document.getElementById("notif-send").onclick = () => {
      document.getElementById("notif-send-panel").innerHTML = NotificationSendModal(users);
      document.getElementById("close-notif-send").onclick = () => {
        document.getElementById("notif-send-panel").innerHTML = "";
      };
      document.getElementById("notif-send-form").onsubmit = async function (e) {
        e.preventDefault();
        const user_id = this.user_id.value;
        const title = this.title.value.trim();
        const message = this.message.value.trim();
        const type = this.type.value;
        if (!user_id || !title || !message || !type) return showToast("Fill all fields", "error");
        await supabase.from("notifications").insert([{ user_id, title, message, type }]);
        // Send email
        const user = users.find(u => u.id === user_id);
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.email,
            subject: title,
            message
          })
        });
        showToast("Notification sent and user emailed!", "success");
        window.location.reload();
      };
    };

    // Row actions
    function attachRowEvents() {
      document.querySelectorAll('.notif-view').forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          const notif = notes.find(n => n.id === id);
          const user = users.find(u => u.id === notif.user_id);
          document.getElementById("notif-detail-panel").innerHTML = NotificationDetailModal(notif, user);
          document.getElementById("close-notif-detail").onclick = () => {
            document.getElementById("notif-detail-panel").innerHTML = "";
          };
          // Mark as read
          if (!notif.read) {
            await supabase.from("notifications").update({ read: true }).eq("id", id);
          }
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

export default notifications;