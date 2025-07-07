import { supabase } from '../../utils/supabaseClient';
import navbar from './components/Navbar';
import {reset} from "../../utils/reset"


const accountSummary = async () => {
    reset("Account Summary")
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

    // Transaction table rows
    const transactionRows = transactions && transactions.length
        ? transactions.map((t, i) => `
            <tr>
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
        `,
        pageEvents
    };
};

export default accountSummary;