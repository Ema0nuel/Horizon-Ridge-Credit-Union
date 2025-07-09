import { supabase } from "/src/utils/supabaseClient.js";
import AdminNavbar, { navItems } from "./components/AdminNavbar.js";
import { requireAdmin } from "./utils/adminAuth.js";
import { showToast } from "/src/components/toast.js";
import Chart from "chart.js/auto";

const Spinner = () => `
  <div class="flex justify-center items-center py-16">
    <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
`;

const dashboard = async () => {
  if (!requireAdmin()) return { html: "", pageEvents: () => {} };
  document.getElementById("app").innerHTML = Spinner();

  // Fetch all profiles, accounts, transactions, loans, cards
  let profiles = [], accounts = [], transactions = [], loans = [], cards = [];
  let userCount = 0, txCount = 0, balance = 0, loanCount = 0, cardCount = 0;
  let txTypes = {}, txDates = {};

  try {
    const [
      { data: profilesData },
      { data: accountsData },
      { data: transactionsData },
      { data: loansData },
      { data: cardsData }
    ] = await Promise.all([
      supabase.from("profiles").select("id,full_name,email,avatar_url,created_at"),
      supabase.from("accounts").select("id,user_id,balance,account_type,account_number,is_active"),
      supabase.from("transactions").select("id,user_id,account_id,type,amount,description,status,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("loan").select("id,user_id,amount,status,created_at"),
      supabase.from("cards").select("id,user_id,card_number,card_type,is_active,issued_at")
    ]);
    profiles = profilesData || [];
    accounts = accountsData || [];
    transactions = transactionsData || [];
    loans = loansData || [];
    cards = cardsData || [];

    userCount = profiles.length;
    txCount = transactions.length;
    loanCount = loans.length;
    cardCount = cards.length;
    balance = accounts.reduce((sum, acc) => sum + (parseFloat(acc.balance) || 0), 0);

    transactions.forEach(tx => {
      txTypes[tx.type] = (txTypes[tx.type] || 0) + 1;
      const date = tx.created_at?.slice(0, 10);
      txDates[date] = (txDates[date] || 0) + 1;
    });
  } catch (err) {
    showToast("Failed to load dashboard data", "error");
  }

  // Get recent users and recent transactions with user info
  const recentUsers = profiles.slice(0, 5);
  const recentTransactions = transactions.slice(0, 5).map(tx => {
    const user = profiles.find(u => u.id === tx.user_id);
    return {
      ...tx,
      user: user?.full_name || user?.email || "User"
    };
  });

  let activeItem = "dashboard";
  let isCollapsed = false;
  let isDark = localStorage.getItem("admin_dark") === "true";

  function DashboardContent() {
    if (activeItem !== "dashboard") {
      const nav = navItems.find(item => item.key === activeItem);
      return `
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-gradient-to-tr from-blue-500 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="${nav.icon} text-white text-3xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ${nav.label} Page
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            This section is under development. Click on Dashboard to see the full admin interface.
          </p>
        </div>
      `;
    }
    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          ${StatCard({ title: "Total Users", value: userCount, change: "+12.5%", changeType: "increase", icon: "fas fa-users", color: "bg-gradient-to-r from-blue-500 to-blue-600" })}
          ${StatCard({ title: "Total Balance", value: "$" + balance.toLocaleString(), change: "+8.2%", changeType: "increase", icon: "fas fa-credit-card", color: "bg-gradient-to-r from-green-500 to-green-600" })}
          ${StatCard({ title: "Active Loans", value: loanCount, change: "-2.4%", changeType: "decrease", icon: "fas fa-file-invoice-dollar", color: "bg-gradient-to-r from-orange-500 to-orange-600" })}
          ${StatCard({ title: "Cards Issued", value: cardCount, change: "+3.1%", changeType: "increase", icon: "fas fa-id-card", color: "bg-gradient-to-r from-purple-500 to-purple-600" })}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 animate-fade-in">
            <h2 class="font-semibold mb-2 text-brand-navy dark:text-brand-light">Transaction Types</h2>
            <canvas id="txTypeChart" height="180"></canvas>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 animate-fade-in">
            <h2 class="font-semibold mb-2 text-brand-navy dark:text-brand-light">Transactions Per Day</h2>
            <canvas id="txDayChart" height="180"></canvas>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 mt-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Users</h3>
          </div>
          <ul>
            ${recentUsers.map(u => `
              <li class="flex items-center gap-2 py-1">
                <img src="${u.avatar_url || '/default-user.png'}" class="w-7 h-7 rounded-full border" />
                <span>${u.full_name}</span>
                <span class="text-xs opacity-70">${u.email}</span>
              </li>
            `).join("")}
          </ul>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 mt-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button class="text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-slate-700">
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Time</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${recentTransactions.map(transaction => `
                  <tr class="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td class="py-4 px-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span class="text-white font-medium text-sm">${(transaction.user || "?").charAt(0)}</span>
                        </div>
                        <span class="ml-3 text-gray-900 dark:text-white font-medium">${transaction.user}</span>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-gray-600 dark:text-gray-400">${transaction.type}</td>
                    <td class="py-4 px-4 text-gray-900 dark:text-white font-medium">$${parseFloat(transaction.amount).toLocaleString()}</td>
                    <td class="py-4 px-4">
                      <span class="px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }">
                        ${transaction.status}
                      </span>
                    </td>
                    <td class="py-4 px-4 text-gray-500 dark:text-gray-400">${transaction.created_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td class="py-4 px-4">
                      <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function StatCard(card) {
    return `
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">${card.title}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">${card.value}</p>
            <div class="flex items-center mt-2">
              ${card.changeType === 'increase'
                ? `<i class="fas fa-arrow-up text-green-500 mr-1"></i>`
                : `<i class="fas fa-arrow-down text-red-500 mr-1"></i>`
              }
              <span class="text-sm font-medium ${card.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}">${card.change}</span>
              <span class="text-gray-500 dark:text-gray-400 text-sm ml-1">vs last month</span>
            </div>
          </div>
          <div class="p-3 rounded-full ${card.color}">
            <i class="${card.icon} text-white text-xl"></i>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    document.getElementById("app").innerHTML = `
      ${AdminNavbar({ activeItem, isCollapsed, isDark })}
      <div class="lg:ml-64 min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
        <div class="p-6 lg:p-8">
          <div class="max-w-7xl mx-auto">
            ${DashboardContent()}
          </div>
        </div>
      </div>
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
        render();
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

    // Charts
    setTimeout(() => {
      if (document.getElementById("txTypeChart")) {
        new Chart(document.getElementById("txTypeChart"), {
          type: "pie",
          data: {
            labels: Object.keys(txTypes),
            datasets: [{
              data: Object.values(txTypes),
              backgroundColor: ["#2563eb", "#f59e42", "#10b981", "#ef4444", "#a21caf"]
            }]
          },
          options: {
            plugins: {
              legend: { labels: { color: document.documentElement.classList.contains('dark') ? "#fff" : "#111" } }
            }
          }
        });
      }
      if (document.getElementById("txDayChart")) {
        new Chart(document.getElementById("txDayChart"), {
          type: "bar",
          data: {
            labels: Object.keys(txDates),
            datasets: [{
              label: "Transactions per Day",
              data: Object.values(txDates),
              backgroundColor: "#2563eb"
            }]
          },
          options: {
            plugins: {
              legend: { labels: { color: document.documentElement.classList.contains('dark') ? "#fff" : "#111" } }
            },
            scales: {
              x: { ticks: { color: document.documentElement.classList.contains('dark') ? "#fff" : "#111" } },
              y: { ticks: { color: document.documentElement.classList.contains('dark') ? "#fff" : "#111" } }
            }
          }
        });
      }
    }, 500);
  }

  return {
    html: "",
    pageEvents: () => render()
  };
};

export default dashboard;