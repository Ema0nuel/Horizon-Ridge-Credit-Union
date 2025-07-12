import { supabase } from '../../utils/supabaseClient';
import navbar from './components/Navbar';
import { reset } from "../../utils/reset";

// Helper: Generate Receipt (copied and adapted from interbank.js)
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
    <div style="max-width:440px;margin:24px auto;padding:24px;border-radius:12px;background:linear-gradient(135deg,#f8fafc,#e0e7ef 80%);box-shadow:0 4px 24px rgba(0,0,0,0.08);font-family:'Segoe UI',sans-serif;">
      <div style="text-align:center;margin-bottom:18px;">
        <img src="https://www.horizonridgecreditunion.com/assets/logo-39I1HVw6.jpg" alt="Horizon Ridge Credit Union" style="height:40px;margin-bottom:8px;">
        <h2 style="margin:0;font-size:26px;font-weight:700;color:#1e293b;">${config.title}</h2>
        <div style="font-size:16px;color:#475569;">${config.companyName}</div>
        <div style="font-size:12px;color:#64748b;">${config.companyAddress}</div>
        <div style="font-size:12px;color:#64748b;">${config.companyPhone} | ${config.companyEmail}</div>
      </div>
      <div style="margin-bottom:18px;border-bottom:1px dashed #cbd5e1;padding-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Receipt ID:</b></span><span>${config.receiptId}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Date:</b></span><span>${config.date}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Time:</b></span><span>${config.time}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Type:</b></span><span>${config.transactionType}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;">
          <span><b>Status:</b></span>
          <span style="color:${config.status === "Completed" ? "#16a34a" : config.status === "Pending" ? "#f59e42" : "#dc2626"};font-weight:600;">
            ${config.status}
          </span>
        </div>
      </div>
      <div style="margin-bottom:18px;">
        <h3 style="margin:0 0 10px 0;font-size:15px;text-align:center;color:#0f172a;">Transaction Details</h3>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>From:</b></span><span>${config.senderName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>To:</b></span><span>${config.recipientName}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span><b>Description:</b></span><span>${config.description}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;">
          <span><b>Reference:</b></span><span>${config.referenceNumber}</span>
        </div>
      </div>
      <div style="margin-bottom:18px;border-top:1px dashed #cbd5e1;padding-top:12px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
          <span><b>Amount:</b></span><span>${config.currency}${config.amount}</span>
        </div>
        ${parseFloat(config.fees) > 0
            ? `
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
          <span><b>Fees:</b></span><span>${config.currency}${config.fees}</span>
        </div>`
            : ""
        }
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;border-top:1px solid #cbd5e1;padding-top:8px;">
          <span>Total:</span><span>${config.currency}${config.totalAmount}</span>
        </div>
      </div>
      ${Object.keys(config.additionalFields).length > 0
            ? `
      <div style="margin-bottom:18px;border-top:1px dashed #cbd5e1;padding-top:12px;">
        ${Object.entries(config.additionalFields)
                .map(
                    ([key, value]) => `
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
            <span><b>${key}:</b></span><span>${value}</span>
          </div>
        `
                )
                .join("")}
      </div>`
            : ""
        }
      ${config.showFooter
            ? `
      <div style="text-align:center;margin-top:18px;padding-top:10px;border-top:2px dashed #cbd5e1;font-size:12px;color:#64748b;">
        <div>${config.footerText}</div>
        <div style="margin-top:8px;font-size:11px;color:#94a3b8;">
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

    // Show receipt modal
    function showReceiptModal(tx) {
        let modal = document.getElementById("receipt-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "receipt-modal";
            document.body.appendChild(modal);
        }
        modal.className = "";
        modal.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                    <button id="close-receipt-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
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

export default accountSummary; // ensure