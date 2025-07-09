import AdminNavbar from "./components/AdminNavbar.js";
import { requireAdmin } from "./utils/adminAuth.js";
import { showToast } from "/src/components/toast.js";
import { supabase } from "/src/utils/supabaseClient.js";

// Settings groups and fields
const SETTINGS_GROUPS = [
  {
    key: "interest",
    label: "Interest Settings",
    fields: [
      { key: "usd_saving_interest", label: "USD Saving Interest (%)", type: "number", step: "0.01", example: "2.5" },
      { key: "money_market_interest", label: "Money Market Interest (%)", type: "number", step: "0.01", example: "4.0" }
    ]
  },
  {
    key: "tx_limits",
    label: "Transaction Limits",
    fields: [
      { key: "daily_transfer_limit", label: "Daily Transfer Limit ($)", type: "number", example: "10000" },
      { key: "withdrawal_limit", label: "Withdrawal Limit ($)", type: "number", example: "5000" },
      { key: "min_balance_required", label: "Minimum Balance Required ($)", type: "number", step: "0.01", example: "100.00" }
    ]
  },
  {
    key: "loan_defaults",
    label: "Loan Defaults",
    fields: [
      { key: "default_loan_interest", label: "Default Loan Interest (%)", type: "number", step: "0.01", example: "6.5" },
      { key: "max_loan_duration", label: "Max Loan Duration (months)", type: "number", example: "36" },
      { key: "min_loan_amount", label: "Minimum Loan Amount ($)", type: "number", example: "500" }
    ]
  },
  {
    key: "card_management",
    label: "Card Management",
    fields: [
      { key: "card_processing_fee", label: "Card Processing Fee ($)", type: "number", step: "0.01", example: "20.00" },
      { key: "card_auto_issue", label: "Auto-Issue Virtual Cards?", type: "checkbox", example: "true" }
    ]
  },
  {
    key: "system",
    label: "System Settings",
    fields: [
      { key: "system_status", label: "System Status", type: "select", options: ["online", "maintenance"], example: "online" },
      { key: "maintenance_message", label: "Maintenance Message", type: "text", example: "We’ll be back at 3AM." },
      { key: "support_email", label: "Support Email", type: "email", example: "support@yourbank.com" }
    ]
  },
  // DEMO: Add a random settings group for demo purposes
  {
    key: "demo_random",
    label: "Demo Random Settings",
    fields: [
      { key: "random_mode", label: "Enable Random Mode", type: "checkbox", example: "true" },
      { key: "random_factor", label: "Random Factor", type: "number", step: "0.01", example: "1.23" },
      { key: "random_message", label: "Random Message", type: "text", example: "Surprise!" }
    ]
  }
];

// Helper: Render settings form
function SettingsForm(settings) {
  return SETTINGS_GROUPS.map(group => `
    <div class="mb-8">
      <h2 class="font-bold text-lg mb-2">${group.label}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${group.fields.map(field => {
          let value = settings?.[field.key] ?? "";
          if (field.type === "checkbox") {
            return `
              <label class="flex items-center gap-2">
                <input type="checkbox" name="${field.key}" ${value === "true" ? "checked" : ""} />
                ${field.label}
                <span class="text-xs text-gray-400 ml-2">(e.g. ${field.example})</span>
              </label>
            `;
          }
          if (field.type === "select") {
            return `
              <label>
                ${field.label}
                <select name="${field.key}" class="border rounded px-2 py-1 w-full">
                  ${field.options.map(opt => `<option value="${opt}" ${value === opt ? "selected" : ""}>${opt}</option>`).join("")}
                </select>
                <span class="text-xs text-gray-400 ml-2">(e.g. ${field.example})</span>
              </label>
            `;
          }
          return `
            <label>
              ${field.label}
              <input type="${field.type}" name="${field.key}" value="${value}" step="${field.step || ""}" class="border rounded px-2 py-1 w-full" />
              <span class="text-xs text-gray-400 ml-2">(e.g. ${field.example})</span>
            </label>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

const settings = async () => {
  if (!(await requireAdmin())) return { html: "", pageEvents: () => {} };

  // Fetch settings from DB (assume a 'settings' table with key/value)
  let { data: settingsArr } = await supabase.from("settings").select("*");
  if (!Array.isArray(settingsArr)) settingsArr = [];
  let settingsObj = {};
  settingsArr.forEach(s => { settingsObj[s.key] = s.value; });

  let activeItem = "settings";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-3xl mx-auto">
            <h1 class="text-2xl font-bold mb-6">System Settings</h1>
            <form id="settings-form" class="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">
              ${SettingsForm(settingsObj)}
              <button type="submit" class="bg-blue-700 text-white px-6 py-2 rounded mt-4">Save Settings</button>
              <button type="button" id="randomize-settings" class="bg-orange-600 text-white px-6 py-2 rounded mt-4 ml-4">Randomize Demo</button>
            </form>
          </div>
        </div>
      </div>
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

    // Save settings
    document.getElementById("settings-form").onsubmit = async function (e) {
      e.preventDefault();
      const form = new FormData(this);
      let updates = [];
      SETTINGS_GROUPS.forEach(group => {
        group.fields.forEach(field => {
          let value = form.get(field.key);
          if (field.type === "checkbox") value = this[field.key].checked ? "true" : "false";
          updates.push({ key: field.key, value });
        });
      });
      // Upsert all settings
      for (const s of updates) {
        await supabase.from("settings").upsert([s], { onConflict: "key" });
      }
      showToast("Settings saved!", "success");
      window.location.reload();
    };

    // Randomize settings (demo)
    document.getElementById("randomize-settings").onclick = () => {
      // Randomize demo fields only
      const form = document.getElementById("settings-form");
      // Random booleans and numbers for demo
      form.random_mode.checked = Math.random() > 0.5;
      form.random_factor.value = (Math.random() * 10).toFixed(2);
      form.random_message.value = ["Surprise!", "Demo Mode!", "Randomized!", "Banking Rocks!"][Math.floor(Math.random() * 4)];
      showToast("Random demo settings applied! Save to persist.", "info");
    };
  }

  return {
    html: "",
    pageEvents: () => render()
  };
};

export default settings;