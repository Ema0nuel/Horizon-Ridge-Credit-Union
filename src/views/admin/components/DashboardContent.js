import { navItems } from "./AdminNavbar.js";

export function StatCard(card) {
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

const statCards = [
  {
    title: "Total Users",
    value: "0",
    change: "+0%",
    changeType: "increase",
    icon: "fas fa-users",
    color: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  {
    title: "Total Revenue",
    value: "$0",
    change: "+0%",
    changeType: "increase",
    icon: "fas fa-credit-card",
    color: "bg-gradient-to-r from-green-500 to-green-600"
  },
  {
    title: "Active Loans",
    value: "0",
    change: "-0%",
    changeType: "decrease",
    icon: "fas fa-file-invoice-dollar",
    color: "bg-gradient-to-r from-orange-500 to-orange-600"
  },
  {
    title: "Transactions",
    value: "0",
    change: "+0%",
    changeType: "increase",
    icon: "fas fa-credit-card",
    color: "bg-gradient-to-r from-purple-500 to-purple-600"
  }
];

const recentTransactionsDemo = [
  { id: 1, user: 'John Doe', type: 'Deposit', amount: 2500, status: 'Completed', time: '2 min ago' },
  { id: 2, user: 'Sarah Smith', type: 'Withdrawal', amount: 1800, status: 'Pending', time: '5 min ago' },
  { id: 3, user: 'Mike Johnson', type: 'Transfer', amount: 3200, status: 'Completed', time: '8 min ago' },
  { id: 4, user: 'Emma Wilson', type: 'Deposit', amount: 950, status: 'Completed', time: '12 min ago' },
  { id: 5, user: 'David Brown', type: 'Withdrawal', amount: 2100, status: 'Failed', time: '15 min ago' }
];

const DashboardContent = ({
  activeItem,
  statCardsData = statCards,
  recentTransactions = recentTransactionsDemo,
  balance = 0,
  txTypes = {},
  txDates = {},
  users = [],
  txCount = 0,
  userCount = 0
}) => {
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
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <button class="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <i class="fas fa-calendar mr-2"></i>
            Today
          </button>
          <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i class="fas fa-arrow-up mr-2"></i>
            Export
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        ${statCardsData.map(StatCard).join("")}
      </div>
      <div class="flex flex-wrap gap-6 mb-8">
        <div class="flex-1 min-w-[220px] bg-gradient-to-tr from-blue-500 to-blue-800 dark:from-brand-navy dark:to-brand-gray rounded-2xl shadow-xl p-6 text-white animate-fade-in">
          <div class="text-xs opacity-80">Total Users</div>
          <div class="text-3xl font-bold">${userCount}</div>
        </div>
        <div class="flex-1 min-w-[220px] bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-xl p-6 text-white animate-fade-in">
          <div class="text-xs opacity-80">Total Transactions</div>
          <div class="text-3xl font-bold">${txCount}</div>
        </div>
        <div class="flex-1 min-w-[220px] bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-2xl shadow-xl p-6 text-white animate-fade-in">
          <div class="text-xs opacity-80">Total Balance</div>
          <div class="text-3xl font-bold">$${balance.toLocaleString()}</div>
        </div>
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
                        <span class="text-white font-medium text-sm">${transaction.user.charAt(0)}</span>
                      </div>
                      <span class="ml-3 text-gray-900 dark:text-white font-medium">${transaction.user}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-gray-600 dark:text-gray-400">${transaction.type}</td>
                  <td class="py-4 px-4 text-gray-900 dark:text-white font-medium">$${transaction.amount.toLocaleString()}</td>
                  <td class="py-4 px-4">
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }">
                      ${transaction.status}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-gray-500 dark:text-gray-400">${transaction.time}</td>
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
};

export default DashboardContent;