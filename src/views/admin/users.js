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

// Helper: Status icon
function statusIcon(status) {
  if (status === "active" || status === true) return `<span title="Active" class="text-green-600 text-lg">✅</span>`;
  if (status === "suspended" || status === false) return `<span title="Suspended" class="text-red-600 text-lg">❌</span>`;
  return `<span title="Pending" class="text-yellow-600 text-lg">⏸</span>`;
}

// Main Users Table
function UserTable(users) {
  return `
    <div class="mb-4 flex justify-between items-center">
      <input type="text" id="user-search" placeholder="Search users by name or email..." class="border px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500" />
    </div>
    <table class="min-w-full text-xs table-auto">
      <thead>
        <tr class="bg-blue-100">
          <th class="px-2 py-1 text-left">#</th>
          <th class="px-2 py-1 text-left">Avatar</th>
          <th class="px-2 py-1 text-left">Full Name</th>
          <th class="px-2 py-1 text-left">Email</th>
          <th class="px-2 py-1 text-left">Account Status</th>
          <th class="px-2 py-1 text-left">Account Type</th>
          <th class="px-2 py-1 text-left">Balance</th>
          <th class="px-2 py-1 text-left">Last Login</th>
          <th class="px-2 py-1 text-left">Actions</th>
        </tr>
      </thead>
      <tbody id="user-table-body">
        ${users.map((u, i) => `
          <tr>
            <td class="px-2 py-1">${i + 1}</td>
            <td class="px-2 py-1"><img src="${u.avatar_url || '/default-user.png'}" class="w-7 h-7 rounded-full border" /></td>
            <td class="px-2 py-1">${u.full_name}</td>
            <td class="px-2 py-1">${u.email}</td>
            <td class="px-2 py-1">${statusIcon(u.is_active)}</td>
            <td class="px-2 py-1">${u.account_type || "-"}</td>
            <td class="px-2 py-1">$${(u.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="px-2 py-1">${formatDate(u.last_login)}</td>
            <td class="px-2 py-1">
              <button data-userid="${u.id}" class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded user-view">View</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// User Detail Panel
function UserDetailView(user, accounts, kyc, lastLogin, otps, notifications) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="user-detail-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-user-detail">&times;</button>
        <div class="flex gap-6 mb-6">
          <img src="${user.avatar_url || '/default-user.png'}" class="w-20 h-20 rounded-full border" />
          <div>
            <h2 class="text-2xl font-bold mb-1">${user.full_name}</h2>
            <div class="text-gray-500">${user.title || ""} ${user.gender ? "• " + user.gender : ""}</div>
            <div class="text-sm text-gray-400">${user.email}</div>
            <div class="text-xs text-gray-400">${user.phone || ""}</div>
            <div class="mt-2">${statusIcon(user.is_active)} <span class="ml-1">${user.is_active ? "Active" : "Suspended"}</span></div>
            <div class="mt-1 text-xs text-gray-400">Last login: ${formatDate(lastLogin)}</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 class="font-semibold mb-1">Profile Info</h3>
            <div><b>Address:</b> ${user.address || "-"}, ${user.city || ""}, ${user.country_code || ""}</div>
            <div><b>DOB:</b> ${user.dob || "-"}</div>
            <div><b>Occupation:</b> ${user.occupation || "-"}</div>
            <div><b>Marital Status:</b> ${user.marital_status || "-"}</div>
            <div><b>KYC:</b> ${kyc ? kyc.status : "Not submitted"}</div>
          </div>
          <div>
            <h3 class="font-semibold mb-1">Account Info</h3>
            ${accounts.length === 0 ? "<div>No accounts</div>" : accounts.map(acc => `
              <div class="mb-2 border-b pb-1">
                <div><b>Account #:</b> ${acc.account_number}</div>
                <div><b>Type:</b> ${acc.account_type}</div>
                <div><b>Balance:</b> $${parseFloat(acc.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div><b>Interest:</b> ${acc.interest_rate || "-"}%</div>
                <div><b>Created:</b> ${formatDate(acc.created_at)}</div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 class="font-semibold mb-1">Security</h3>
            <div><b>2FA:</b> ${otps.length > 0 ? "Enabled" : "Not enabled"}</div>
            <div><b>Last OTP:</b> ${otps[0]?.created_at ? formatDate(otps[0].created_at) : "-"}</div>
            <div><b>PIN:</b> <span class="text-gray-400">Hidden</span></div>
            <div><b>Suspicious:</b> <span class="text-gray-400">-</span></div>
          </div>
          <div>
            <h3 class="font-semibold mb-1">Notifications</h3>
            <ul class="text-xs">
              ${notifications.slice(0, 3).map(n => `<li>${n.title || "Notification"}: ${n.message}</li>`).join("") || "<li>No notifications</li>"}
            </ul>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="bg-blue-600 text-white px-3 py-2 rounded user-send-notification" data-userid="${user.id}"><i class="fas fa-paper-plane mr-1"></i>Send Notification</button>
        </div>
      </div>
    </div>
  `;
}

// Contact form modal for sending email
function NotificationFormModal(user) {
  return `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center" id="notification-modal">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-notification-modal">&times;</button>
        <h2 class="text-xl font-bold mb-4">Send Email to ${user.full_name}</h2>
        <form id="send-notification-form">
          <div class="mb-3">
            <label class="block text-sm mb-1">Subject</label>
            <input type="text" name="subject" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block text-sm mb-1">Message</label>
            <textarea name="message" class="w-full border px-3 py-2 rounded" rows="5" required></textarea>
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Send Email</button>
        </form>
      </div>
    </div>
  `;
}

const users = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => {} };

  let { data: profiles = [] } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  let { data: accounts = [] } = await supabase.from("accounts").select("*");
  let { data: otps = [] } = await supabase.from("otps").select("*");
  let { data: kycRequests = [] } = await supabase.from("kyc_requests").select("*");
  let { data: notifications = [] } = await supabase.from("notifications").select("*");
  let { data: logins = [] } = await supabase.from("login_otps").select("*");

  let usersArr = profiles.map(u => {
    const userAccounts = accounts.filter(a => a.user_id === u.id);
    const userKyc = kycRequests.find(k => k.user_id === u.id);
    const userOtps = otps.filter(o => o.user_id === u.id);
    const userNotifications = notifications.filter(n => n.user_id === u.id);
    const userLogins = logins.filter(l => l.user_id === u.id);
    const lastLogin = userLogins.length > 0
      ? userLogins.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at
      : u.created_at;
    return {
      ...u,
      account_type: userAccounts[0]?.account_type || "-",
      balance: userAccounts.reduce((sum, a) => sum + (parseFloat(a.balance) || 0), 0),
      last_login: lastLogin,
      is_active: userAccounts.some(a => a.is_active !== false) && u.is_active !== false,
      _accounts: userAccounts,
      _kyc: userKyc,
      _otps: userOtps,
      _notifications: userNotifications,
      _logins: userLogins
    };
  });

  let filteredUsers = usersArr;
  let activeItem = "users";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">User Management</h1>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
              ${UserTable(filteredUsers)}
            </div>
          </div>
        </div>
      </div>
      <div id="user-detail-panel"></div>
      <div id="notification-form-panel"></div>
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

    // Search users
    const searchInput = document.getElementById("user-search");
    const tableBody = document.getElementById("user-table-body");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const q = this.value.trim().toLowerCase();
        filteredUsers = usersArr.filter(u =>
          (u.full_name && u.full_name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
        );
        tableBody.innerHTML = filteredUsers.map((u, i) => `
          <tr>
            <td class="px-2 py-1">${i + 1}</td>
            <td class="px-2 py-1"><img src="${u.avatar_url || '/default-user.png'}" class="w-7 h-7 rounded-full border" /></td>
            <td class="px-2 py-1">${u.full_name}</td>
            <td class="px-2 py-1">${u.email}</td>
            <td class="px-2 py-1">${statusIcon(u.is_active)}</td>
            <td class="px-2 py-1">${u.account_type || "-"}</td>
            <td class="px-2 py-1">$${(u.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="px-2 py-1">${formatDate(u.last_login)}</td>
            <td class="px-2 py-1">
              <button data-userid="${u.id}" class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded user-view">View</button>
            </td>
          </tr>
        `).join("");
        attachViewEvents();
      });
    }

    function attachViewEvents() {
      document.querySelectorAll('.user-view').forEach(btn => {
        btn.onclick = async () => {
          const userId = btn.getAttribute('data-userid');
          const user = usersArr.find(u => u.id === userId);
          if (!user) return;
          document.getElementById("user-detail-panel").innerHTML = UserDetailView(
            user,
            user._accounts,
            user._kyc,
            user.last_login,
            user._otps,
            user._notifications
          );
          document.getElementById("close-user-detail").onclick = () => {
            document.getElementById("user-detail-panel").innerHTML = "";
          };
          document.querySelector("#user-detail-panel .user-send-notification").onclick = async () => {
            document.getElementById("notification-form-panel").innerHTML = NotificationFormModal(user);
            document.getElementById("close-notification-modal").onclick = () => {
              document.getElementById("notification-form-panel").innerHTML = "";
            };
            document.getElementById("send-notification-form").onsubmit = async function (e) {
              e.preventDefault();
              const subject = this.subject.value.trim();
              const message = this.message.value.trim();
              if (!subject || !message) return showToast("Please fill all fields", "error");
              try {
                await sendEmail({
                  to: user.email,
                  subject,
                  html: message
                });
                showToast("Email sent!", "success");
                document.getElementById("notification-form-panel").innerHTML = "";
              } catch (err) {
                showToast("Failed to send email", "error");
              }
            };
          };
        };
      });
    }

    attachViewEvents();
  }

  return {
    html: "",
    pageEvents: () => render()
  };
};

export default users;