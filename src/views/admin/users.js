import { supabase } from "/src/utils/supabaseClient.js";
import AdminNavbar from "./components/AdminNavbar.js";
import { requireAdmin } from "./utils/adminAuth.js";
import { showToast } from "/src/components/toast.js";
import { sendEmail } from "/src/views/user/functions/Emailing/sendEmail.js";
import { signupUser } from "/src/views/user/functions/signupHandler.js";

// --- Only for local testing! ---
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjd25neG9mamN6cGJmcHJyc2R4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ4ODU1OSwiZXhwIjoyMDY3MDY0NTU5fQ.ZTe_zDnZ4DOC0eqC2OIZbTeYnIIR57DeWoVfl0jsxKk";
const SUPABASE_PROJECT_URL = "https://wcwngxofjczpbfprrsdx.supabase.co";
async function deleteSupabaseUser(user_id) {
  const res = await fetch(`${SUPABASE_PROJECT_URL}/auth/v1/admin/users/${user_id}`, {
    method: "DELETE",
    headers: {
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json"
    }
  });
  return res.ok;
}
// --------------------------------

function Spinner() {
  return `<div class="flex justify-center items-center py-16 animate-fade-in">
    <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>`;
}

function formatDate(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
function statusIcon(status) {
  if (status === "active" || status === true) return `<span title="Active" class="text-green-600 text-lg">✅</span>`;
  if (status === "suspended" || status === false) return `<span title="Suspended" class="text-red-600 text-lg">❌</span>`;
  return `<span title="Pending" class="text-yellow-600 text-lg">⏸</span>`;
}

// User Create/Edit Modal (mobile-friendly, animated)
function UserFormModal({ mode, user = {} }) {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in" style="backdrop-filter: blur(2px)">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto p-6 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-user-form">&times;</button>
        <h2 class="text-xl font-bold mb-4">${mode === "edit" ? "Edit" : "Create"} User Profile</h2>
        <form id="user-form">
          <input type="hidden" name="id" value="${user.id || ""}">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs mb-1">Full Name</label>
              <input type="text" name="full_name" class="w-full border px-2 py-1 rounded" value="${user.full_name || ""}" required>
            </div>
            <div>
              <label class="block text-xs mb-1">Title</label>
              <input type="text" name="title" class="w-full border px-2 py-1 rounded" value="${user.title || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">First Name</label>
              <input type="text" name="firstname" class="w-full border px-2 py-1 rounded" value="${user.firstname || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Last Name</label>
              <input type="text" name="lastname" class="w-full border px-2 py-1 rounded" value="${user.lastname || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Phone</label>
              <input type="text" name="phone" class="w-full border px-2 py-1 rounded" value="${user.phone || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Country Code</label>
              <input type="text" name="country_code" class="w-full border px-2 py-1 rounded" value="${user.country_code || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Nationality</label>
              <input type="text" name="nationality" class="w-full border px-2 py-1 rounded" value="${user.nationality || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Address</label>
              <input type="text" name="address" class="w-full border px-2 py-1 rounded" value="${user.address || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">City</label>
              <input type="text" name="city" class="w-full border px-2 py-1 rounded" value="${user.city || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">State</label>
              <input type="text" name="state" class="w-full border px-2 py-1 rounded" value="${user.state || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Zip</label>
              <input type="text" name="zip" class="w-full border px-2 py-1 rounded" value="${user.zip || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">DOB</label>
              <input type="date" name="dob" class="w-full border px-2 py-1 rounded" value="${user.dob || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Occupation</label>
              <input type="text" name="occupation" class="w-full border px-2 py-1 rounded" value="${user.occupation || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">SSN</label>
              <input type="text" name="ssn" class="w-full border px-2 py-1 rounded" value="${user.ssn || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Marital Status</label>
              <input type="text" name="marital_status" class="w-full border px-2 py-1 rounded" value="${user.marital_status || ""}">
            </div>
            <div>
              <label class="block text-xs mb-1">Gender</label>
              <select name="gender" class="w-full border px-2 py-1 rounded">
                <option value="">Select</option>
                <option value="Male" ${user.gender === "Male" ? "selected" : ""}>Male</option>
                <option value="Female" ${user.gender === "Female" ? "selected" : ""}>Female</option>
                <option value="Other" ${user.gender === "Other" ? "selected" : ""}>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs mb-1">Account Type</label>
              <select name="account_type" class="w-full border px-2 py-1 rounded">
                <option value="">Select</option>
                <option value="USD SAVING" ${user.account_type === "USD SAVING" ? "selected" : ""}>USD SAVING</option>
                <option value="USD CURRENT" ${user.account_type === "USD CURRENT" ? "selected" : ""}>USD CURRENT</option>
                <option value="MONEY MARKET" ${user.account_type === "MONEY MARKET" ? "selected" : ""}>MONEY MARKET</option>
                <option value="IRA" ${user.account_type === "IRA" ? "selected" : ""}>IRA</option>
                <option value="INVESTMENT ACCOUNT" ${user.account_type === "INVESTMENT ACCOUNT" ? "selected" : ""}>INVESTMENT ACCOUNT</option>
              </select>
            </div>
            <div>
              <label class="block text-xs mb-1">Status</label>
              <select name="is_active" class="w-full border px-2 py-1 rounded">
                <option value="true" ${user.is_active ? "selected" : ""}>Active</option>
                <option value="false" ${user.is_active === false ? "selected" : ""}>Suspended</option>
              </select>
            </div>
            ${mode === "create" ? `
            <div class="md:col-span-2">
              <label class="block text-xs mb-1">Email</label>
              <input type="email" name="email" class="w-full border px-2 py-1 rounded" required>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs mb-1">Password</label>
              <input type="password" name="password" class="w-full border px-2 py-1 rounded" required>
            </div>
            ` : `
            <div class="md:col-span-2">
              <label class="block text-xs mb-1">Email</label>
              <input type="email" name="email" class="w-full border px-2 py-1 rounded bg-gray-100 dark:bg-slate-800" value="${user.email || ""}" disabled>
            </div>
            `}
          </div>
          <div class="flex justify-end mt-6">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">${mode === "edit" ? "Save Changes" : "Create Profile"}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function ConfirmDeleteModal({ name }) {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in" style="backdrop-filter: blur(2px)">
      <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500" id="close-delete-modal">&times;</button>
        <h2 class="text-xl font-bold mb-4">Delete Profile</h2>
        <p class="mb-6">Are you sure you want to delete <b>${name}</b>? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button id="cancel-delete" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button id="confirm-delete" class="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  `;
}

// Responsive User Table (cards on mobile, table on desktop)
function UserTable(users) {
  return `
    <div class="mb-4 flex flex-wrap gap-2 items-center justify-between">
      <input type="text" id="user-search" placeholder="Search users..." class="border px-3 py-2 rounded w-full md:w-64" />
      <button id="add-user-btn" class="bg-green-600 text-white px-4 py-2 rounded ml-auto">+ Create Profile</button>
    </div>
    <div>
      <div class="block md:hidden">
        ${users.map((u, i) => `
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow p-4 mb-4 animate-fade-in">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">${u.full_name}</span>
              ${statusIcon(u.is_active)}
            </div>
            <div class="text-xs text-gray-400 mb-1">${u.email}</div>
            <div class="mb-1"><b>Account Type:</b> ${u.account_type || "-"}</div>
            <div class="mb-1"><b>Last Login:</b> ${formatDate(u.last_login)}</div>
            <div class="flex flex-wrap gap-2 mt-2">
              <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded user-edit" data-id="${u.id}">Edit</button>
              <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded user-delete" data-id="${u.id}">Delete</button>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full text-xs">
          <thead>
            <tr class="bg-blue-100">
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Account Type</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="user-table-body">
            ${users.map((u, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${u.full_name}</td>
                <td>${u.email}</td>
                <td>${statusIcon(u.is_active)}</td>
                <td>${u.account_type || "-"}</td>
                <td>${formatDate(u.last_login)}</td>
                <td>
                  <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded user-edit" data-id="${u.id}">Edit</button>
                  <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded user-delete" data-id="${u.id}">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

const users = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => { } };

  let { data: profiles = [] } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  let { data: accounts = [] } = await supabase.from("accounts").select("*");
  let { data: logins = [] } = await supabase.from("login_otps").select("*");

  let usersArr = profiles.map(u => {
    const acc = accounts.find(a => a.user_id === u.id) || {};
    const userLogins = logins.filter(l => l.user_id === u.id);
    const lastLogin = userLogins.length > 0
      ? userLogins.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at
      : u.created_at;
    return {
      ...u,
      account_type: acc.account_type || "-",
      is_active: acc.is_active !== false && u.is_active !== false,
      last_login: lastLogin
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
      <div class="p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold mb-6">User Management</h1>
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 md:p-6">
            ${UserTable(filteredUsers)}
          </div>
        </div>
      </div>
    </div>
    <div id="user-modal-panel"></div>
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

    document.getElementById("user-search").addEventListener("input", function () {
      const q = this.value.trim().toLowerCase();
      filteredUsers = usersArr.filter(u =>
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      );
      // For mobile, re-render the whole table
      if (window.innerWidth < 768) {
        document.querySelector(".block.md\\:hidden").innerHTML = filteredUsers.map((u, i) => `
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow p-4 mb-4 animate-fade-in">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">${u.full_name}</span>
              ${statusIcon(u.is_active)}
            </div>
            <div class="text-xs text-gray-400 mb-1">${u.email}</div>
            <div class="mb-1"><b>Account Type:</b> ${u.account_type || "-"}</div>
            <div class="mb-1"><b>Last Login:</b> ${formatDate(u.last_login)}</div>
            <div class="flex flex-wrap gap-2 mt-2">
              <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded user-edit" data-id="${u.id}">Edit</button>
              <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded user-delete" data-id="${u.id}">Delete</button>
            </div>
          </div>
        `).join("");
      } else {
        document.getElementById("user-table-body").innerHTML = filteredUsers.map((u, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${u.full_name}</td>
            <td>${u.email}</td>
            <td>${statusIcon(u.is_active)}</td>
            <td>${u.account_type || "-"}</td>
            <td>${formatDate(u.last_login)}</td>
            <td>
              <button class="btn btn-xs bg-blue-600 text-white px-2 py-1 rounded user-edit" data-id="${u.id}">Edit</button>
              <button class="btn btn-xs bg-red-600 text-white px-2 py-1 rounded user-delete" data-id="${u.id}">Delete</button>
            </td>
          </tr>
        `).join("");
      }
      attachRowEvents();
    });

    document.getElementById("add-user-btn").onclick = () => {
      document.getElementById("user-modal-panel").innerHTML = UserFormModal({ mode: "create" });
      document.getElementById("close-user-form").onclick = () => {
        document.getElementById("user-modal-panel").innerHTML = "";
      };
      document.getElementById("user-form").onsubmit = async function (e) {
        e.preventDefault();
        document.getElementById("user-modal-panel").innerHTML += Spinner();
        const formData = Object.fromEntries(new FormData(this));
        try {
          // Use the signupUser handler for admin creation (simulate IP as 'admin')
          await signupUser(
            {
              ...formData,
              acctype: formData.account_type,
              username: `${formData.firstname} ${formData.lastname}`,
            },
            "admin"
          );
          showToast("Profile created and email sent!", "success");
          location.reload();
        } catch (err) {
          showToast(err.message, "error");
          document.querySelector(".flex.justify-center.items-center.py-16")?.remove();
        }
      };
    };

    function attachRowEvents() {
      document.querySelectorAll(".user-edit").forEach(btn => {
        btn.onclick = () => {
          const user = usersArr.find(u => u.id === btn.dataset.id);
          document.getElementById("user-modal-panel").innerHTML = UserFormModal({ mode: "edit", user });
          document.getElementById("close-user-form").onclick = () => {
            document.getElementById("user-modal-panel").innerHTML = "";
          };
          document.getElementById("user-form").onsubmit = async function (e) {
            e.preventDefault();
            document.getElementById("user-modal-panel").innerHTML += Spinner();
            const formData = Object.fromEntries(new FormData(this));
            try {
              await supabase.from("profiles").update({
                full_name: formData.full_name,
                title: formData.title,
                firstname: formData.firstname,
                lastname: formData.lastname,
                phone: formData.phone,
                country_code: formData.country_code,
                nationality: formData.nationality,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                dob: formData.dob,
                occupation: formData.occupation,
                ssn: formData.ssn,
                marital_status: formData.marital_status,
                gender: formData.gender
              }).eq("id", user.id);
              await supabase.from("accounts").update({
                account_type: formData.account_type,
                is_active: formData.is_active === "true"
              }).eq("user_id", user.id);
              await sendEmail({
                to: user.email,
                subject: "Profile Updated",
                html: `<p>Hello <b>${formData.full_name}</b>,<br>Your profile was updated by an admin.</p>`
              });
              showToast("Profile updated!", "success");
              location.reload();
            } catch (err) {
              showToast(err.message, "error");
              document.querySelector(".flex.justify-center.items-center.py-16")?.remove();
            }
          };
        };
      });
      document.querySelectorAll(".user-delete").forEach(btn => {
        btn.onclick = async () => {
          const user = usersArr.find(u => u.id === btn.dataset.id);
          document.getElementById("user-modal-panel").innerHTML = ConfirmDeleteModal({ name: user.full_name });
          document.getElementById("close-delete-modal").onclick = () => {
            document.getElementById("user-modal-panel").innerHTML = "";
          };
          document.getElementById("cancel-delete").onclick = () => {
            document.getElementById("user-modal-panel").innerHTML = "";
          };
          document.getElementById("confirm-delete").onclick = async () => {
            document.getElementById("user-modal-panel").innerHTML += Spinner();
            try {
              // 1. Delete from Supabase Auth (admin)
              await deleteSupabaseUser(user.id);
              // 2. Delete from accounts (CASCADE)
              await supabase.from("accounts").delete().eq("user_id", user.id);
              // 3. Delete from profiles (CASCADE)
              await supabase.from("profiles").delete().eq("id", user.id);
              await sendEmail({
                to: user.email,
                subject: "Profile Deleted",
                html: `<p>Hello <b>${user.full_name}</b>,<br>Your profile has been deleted by an admin.</p>`
              });
              showToast("Profile deleted!", "success");
              location.reload();
            } catch (err) {
              showToast("Failed to delete user: " + err.message, "error");
              document.querySelector(".flex.justify-center.items-center.py-16")?.remove();
            }
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

export default users;