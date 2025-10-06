import { supabase } from '../../utils/supabaseClient';
import navbar from './components/Navbar';
import { reset } from "../../utils/reset";

// Helper: Generate Receipt (custom styled for modal, light/dark theme)
function generateReceipt(options = {}) {
    const defaults = {
        title: "Transaction Receipt",
        receiptId: options.id || "",
        date: options.date || new Date().toLocaleDateString(),
        time: options.time || new Date().toLocaleTimeString(),
        amount: options.amount || "0.00",
        currency: "$",
        description: options.description || "",
        senderName: options.by || "",
        recipientName: options.to || "",
        bankName: options.bankName || "",
        accountNumber: options.accountNumber || "",
        transactionType: options.type || "",
        status: options.status || "Completed",
        referenceNumber: options.id || "",
        fees: options.fees || "0.00",
        totalAmount: options.amount || "",
        companyName: "Horizon Ridge Credit Union",
        companyAddress: "123 Main St, City, Country",
        companyPhone: "+1 (555) 123-4567",
        companyEmail: "horizonridgecreditunion@gmail.com",
        additionalFields: options.additionalFields || {},
        showFooter: true,
        footerText: "Thank you for banking with us!",
    };
    const config = { ...defaults, ...options };
    return `
    <div class="receipt-container font-mono">
      <div class="text-center mb-4">
        <img src="/assets/logo.png" alt="Horizon Ridge Credit Union" class="h-10 mx-auto mb-2" />
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white mb-1">${config.title}</h2>
        <div class="text-base text-gray-700 dark:text-gray-300">${config.companyName}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${config.companyAddress}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${config.companyPhone} | ${config.companyEmail}</div>
      </div>
      <div class="mb-4 border-b border-dashed border-gray-300 dark:border-gray-700 pb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Receipt ID:</span><span>${config.receiptId}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Date:</span><span>${config.date}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Time:</span><span>${config.time}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Type:</span><span>${config.transactionType}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="font-semibold">Status:</span>
          <span class="font-bold" style="color:${config.status === "Completed" ? "#16a34a" : config.status === "Pending" ? "#f59e42" : "#dc2626"};">
            ${config.status}
          </span>
        </div>
      </div>
      <div class="mb-4">
        <h3 class="text-center text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Transaction Details</h3>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">From:</span><span>${config.senderName}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">To:</span><span>${config.recipientName}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span class="font-semibold">Description:</span><span>${config.description}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="font-semibold">Reference:</span><span>${config.referenceNumber}</span>
        </div>
      </div>
      <div class="mb-4 border-t border-dashed border-gray-300 dark:border-gray-700 pt-3">
        <div class="flex justify-between text-sm mb-1">
          <span class="font-semibold">Amount:</span><span>${config.currency}${config.amount}</span>
        </div>
        ${parseFloat(config.fees) > 0
            ? `<div class="flex justify-between text-sm mb-1">
                  <span class="font-semibold">Fees:</span><span>${config.currency}${config.fees}</span>
                </div>`
            : ""
        }
        <div class="flex justify-between text-base font-bold border-t border-gray-300 dark:border-gray-700 pt-2">
          <span>Total:</span><span>${config.currency}${config.totalAmount}</span>
        </div>
      </div>
      ${Object.keys(config.additionalFields).length > 0
            ? `<div class="mb-4 border-t border-dashed border-gray-300 dark:border-gray-700 pt-3">
                ${Object.entries(config.additionalFields)
                    .map(([key, value]) => `
                      <div class="flex justify-between text-xs mb-1">
                        <span class="font-semibold">${key}:</span><span>${value}</span>
                      </div>
                    `).join("")}
              </div>`
            : ""
        }
      ${config.showFooter
            ? `<div class="text-center mt-4 pt-3 border-t-2 border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <div>${config.footerText}</div>
                <div class="mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                  This is a Horizon-generated receipt
                </div>
              </div>`
            : ""
        }
    </div>
    `;
}

const accountSummary = async () => {
    reset("Account Summary");
    const nav = navbar();

    // Fetch session and user/account data
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        window.location.href = "/login";
        return;
    }
    const { user } = session.data.session;

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch account
    const { data: account } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

    // Fetch all transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', account?.id)
        .order('created_at', { ascending: false });

    // Format currency
    const fmt = v => typeof v === 'number' ? v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }) : v || '$0.00';

    // Transaction table rows with clickable receipt
    const transactionRows = transactions && transactions.length
        ? transactions.map((t, i) => `
            <tr class="cursor-pointer hover:bg-yellow-50 dark:hover:bg-blue-900/20" data-txid="${t.id}">
                <td class="px-2 py-1 text-xs">${i + 1}</td>
                <td class="px-2 py-1 text-xs">${t.created_at?.slice(0, 16).replace('T', ' ')}</td>
                <td class="px-2 py-1 text-xs">${t.description || '-'}</td>
                <td class="px-2 py-1 text-xs font-semibold text-yellow-500">${fmt(t.amount)}</td>
                <td class="px-2 py-1 text-xs">${t.type || '-'}</td>
                <td class="px-2 py-1 text-xs">${t.by || '-'}</td>
                <td class="px-2 py-1 text-xs">${t.to || '-'}</td>
                <td class="px-2 py-1 text-xs">${t.reason || '-'}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="8" class="text-center text-gray-400 dark:text-gray-500 py-2 text-xs">No transactions found.</td></tr>`;

    function pageEvents() {
        nav.pageEvents?.();

        // Attach click event to transaction rows
        document.querySelectorAll('tr[data-txid]').forEach(row => {
            row.addEventListener('click', () => {
                const txid = row.getAttribute('data-txid');
                const tx = transactions.find(t => t.id === txid);
                if (!tx) return;
                showReceiptModal(tx);
            });
        });
    }

    // Show receipt modal (custom, responsive, themed)
    function showReceiptModal(tx) {
        let modal = document.getElementById("receipt-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "receipt-modal";
            document.body.appendChild(modal);
        }
        modal.className = "";
        modal.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                <div class="receipt-modal-content bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-2 p-0 relative overflow-auto" style="max-height:90vh;">
                    <button id="close-receipt-modal" class="absolute top-3 right-4 text-gray-400 hover:text-red-500 dark:hover:text-white text-2xl font-bold z-10" aria-label="Close">&times;</button>
                    <div class="p-6">
                        ${generateReceipt({
                            id: tx.id,
                            date: tx.created_at?.slice(0, 10),
                            time: tx.created_at?.slice(11, 16),
                            amount: fmt(tx.amount).replace('$', ''),
                            currency: '$',
                            description: tx.description,
                            by: tx.by,
                            to: tx.to,
                            type: tx.type,
                            status: tx.status,
                            referenceNumber: tx.id,
                            fees: tx.fees || "0.00",
                            totalAmount: fmt(tx.amount).replace('$', ''),
                            additionalFields: {
                                Reason: tx.reason || '-',
                                "Balance Before": fmt(tx.balance_before),
                                "Balance After": fmt(tx.balance_after)
                            }
                        })}
                    </div>
                </div>
            </div>
            <style>
                .receipt-modal-content::-webkit-scrollbar { width: 8px; background: transparent; }
                .receipt-modal-content::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
                .dark .receipt-modal-content::-webkit-scrollbar-thumb { background: #334155; }
                .receipt-container {
                    background: repeating-linear-gradient(135deg, #f8fafc 0px, #e0e7ef 80%, #f8fafc 100%);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
                    padding: 0;
                }
                .dark .receipt-container {
                    background: linear-gradient(135deg, #1e293b 0px, #334155 80%, #1e293b 100%);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.40);
                }
            </style>
        `;
        document.getElementById("close-receipt-modal").onclick = () => {
            modal.innerHTML = "";
            modal.className = "hidden";
        };
    }

    return {
        html: /*html*/`
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
            <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
                <div class="p-4">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <nav class="flex items-center space-x-2 text-xs mb-2 md:mb-0">
                            <i class="fa fa-home text-gray-500"></i>
                            <span class="text-gray-500">/</span>
                            <span class="text-gray-700 dark:text-gray-300">Account Summary</span>
                        </nav>
                        <div class="flex flex-wrap gap-2">
                            <div class="bg-green-100 rounded px-4 py-2 flex items-center gap-2">
                                <i class="fa fa-briefcase text-green-700"></i>
                                <div>
                                    <div class="text-xs font-semibold text-green-800">${fmt(account?.balance)}</div>
                                    <div class="text-[10px] text-green-600">Account Balance</div>
                                </div>
                            </div>
                            <div class="bg-blue-100 rounded px-4 py-2 flex items-center gap-2">
                                <i class="fa fa-refresh text-blue-700"></i>
                                <div>
                                    <div class="text-xs font-semibold text-blue-800">${account?.is_active ? 'Active' : 'Inactive'}</div>
                                    <div class="text-[10px] text-blue-600">Account Status</div>
                                </div>
                            </div>
                            <div class="bg-orange-100 rounded px-4 py-2 flex items-center gap-2">
                                <i class="fa fa-star text-orange-700"></i>
                                <div>
                                    <div class="text-xs font-semibold text-orange-800">${account?.account_type || '-'}</div>
                                    <div class="text-[10px] text-orange-600">Account Type</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded shadow-sm p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-base font-semibold text-gray-900 dark:text-white"><i class="fa fa-money mr-2"></i> Account Statement</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full text-xs table-auto">
                                <thead>
                                    <tr class="bg-yellow-100 dark:bg-blue-900/30">
                                        <th class="px-2 py-1 text-left">#</th>
                                        <th class="px-2 py-1 text-left">Date</th>
                                        <th class="px-2 py-1 text-left">Description</th>
                                        <th class="px-2 py-1 text-left">Amount</th>
                                        <th class="px-2 py-1 text-left">Transaction</th>
                                        <th class="px-2 py-1 text-left">By</th>
                                        <th class="px-2 py-1 text-left">To</th>
                                        <th class="px-2 py-1 text-left">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${transactionRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <footer class="p-4 text-center text-gray-600 dark:text-gray-400 text-xs">
                    <p>
                        <strong>Copyright © ${new Date().getFullYear()}</strong> All rights reserved | Horizon Ridge Credit Union.
                    </p>
                </footer>
            </div>
        </div>
        <div id="receipt-modal" class="hidden"></div>
        `,
        pageEvents
    };
};

export default accountSummary;