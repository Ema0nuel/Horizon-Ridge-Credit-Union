import NoLogo from "/src/images/logo-nobg.png";
import Logo from "/src/images/logo.jpg";

export const navItems = [
  { label: "Dashboard", icon: "fas fa-tv", key: "dashboard", color: "text-blue-500" },
  { label: "Users", icon: "fas fa-users", key: "users", color: "text-orange-500" },
  { label: "Transactions", icon: "fas fa-credit-card", key: "transactions", color: "text-emerald-500" },
  { label: "Notifications", icon: "fas fa-bell", key: "notifications", color: "text-cyan-500" },
  { label: "Loans", icon: "fas fa-file-invoice-dollar", key: "loans", color: "text-red-600" },
  { label: "Cards", icon: "fas fa-id-card", key: "cards", color: "text-orange-500" },
  { label: "Settings", icon: "fas fa-cog", key: "settings", color: "text-slate-700" }
];

const AdminNavbar = ({ activeItem, isCollapsed, isDark }) => `
  <div id="admin-navbar-root">
    <div id="admin-sidebar-overlay" class="fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden transition-opacity duration-300${isCollapsed ? ' hidden opacity-0' : ' opacity-100'}"></div>
    <aside id="admin-sidebar" class="fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-slate-900 shadow-2xl border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col
      ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}">
      <div class="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-slate-800">
        <div class="flex items-center">
          <img src="${NoLogo}" class="h-10 dark:hidden" alt="logo" />
          <img src="${Logo}" class="h-10 hidden dark:inline" alt="logo" />
          <span class="ml-3 font-bold text-lg text-slate-700 dark:text-white">Horizon Ridge Credit Union</span>
        </div>
        <button id="admin-sidebar-close" class="lg:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-2xl focus:outline-none">&times;</button>
      </div>
      <nav class="flex-1 overflow-y-auto py-6 px-4">
        <ul class="space-y-2">
          ${navItems.map(item => `
            <li>
              <a href="/admin/${item.key}" data-nav="${item.key}"
                class="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${activeItem === item.key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:scale-105"}
                ">
                <i class="${item.icon} ${item.color} text-lg mr-3"></i>
                <span class="font-semibold text-left">${item.label}</span>
                ${activeItem === item.key ? `<div class="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>` : ""}
              </a>
            </li>
          `).join("")}
        </ul>
      </nav>
      <div class="p-6 border-t border-gray-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">Theme</span>
          <button id="admin-theme-toggle"
            class="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-white transition-all hover:scale-110"
            title="Toggle theme">
            <i class="fas fa-moon${isDark ? ' hidden' : ''}"></i>
            <i class="fas fa-sun${isDark ? '' : ' hidden'}"></i>
          </button>
        </div>
        <button id="admin-logout"
          class="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center">
          <i class="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
    </aside>
    <button id="admin-sidebar-toggle"
      class="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-slate-900 p-3 rounded-full shadow-lg border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-white transition-all hover:scale-110 focus:outline-none">
      <i class="fas fa-bars"></i>
    </button>
    <script>
      // Mobile sidebar open
      document.getElementById("admin-sidebar-toggle")?.addEventListener("click", () => {
        document.getElementById("admin-sidebar").classList.remove("-translate-x-full");
        document.getElementById("admin-sidebar-overlay").classList.remove("hidden");
        document.getElementById("admin-sidebar-overlay").classList.add("opacity-100");
      });
      // Mobile sidebar close (X button)
      document.getElementById("admin-sidebar-close")?.addEventListener("click", () => {
        document.getElementById("admin-sidebar").classList.add("-translate-x-full");
        document.getElementById("admin-sidebar-overlay").classList.add("hidden");
        document.getElementById("admin-sidebar-overlay").classList.remove("opacity-100");
      });
      // Overlay click closes sidebar
      document.getElementById("admin-sidebar-overlay")?.addEventListener("click", () => {
        document.getElementById("admin-sidebar").classList.add("-translate-x-full");
        document.getElementById("admin-sidebar-overlay").classList.add("hidden");
        document.getElementById("admin-sidebar-overlay").classList.remove("opacity-100");
      });
      // Animate sidebar transitions
      document.getElementById("admin-sidebar")?.addEventListener("transitionend", () => {
        // Optionally handle focus or accessibility here
      });
    </script>
  </div>
`;

export default AdminNavbar;