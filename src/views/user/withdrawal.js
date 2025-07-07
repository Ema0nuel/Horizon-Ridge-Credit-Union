import { supabase } from '../../utils/supabaseClient';
import navbar from './components/Navbar';
import { showToast } from '../../components/toast';
import { sendEmail } from './functions/Emailing/sendEmail';
import { reset } from '../../utils/reset';

const withdrawal = async () => {
    const nav = navbar();
    reset("Horizon | Withdrawal");

    // Fetch session and user/account data
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        window.location.href = "/login";
        return;
    }
    const { user } = session.data.session;

    // Fetch profile and account
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: account } = await supabase.from('accounts').select('*').eq('user_id', user.id).single();

    const fmt = v => typeof v === 'number' ? v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }) : v || '$0.00';

    async function sendNotification(title, message, type = "info") {
        await supabase.from('notifications').insert([{
            user_id: user.id,
            title,
            message,
            type,
            read: false
        }]);
    }

    function pageEvents() {
        nav.pageEvents?.();

        const withdrawalForm = document.getElementById('withdrawal-form');
        if (withdrawalForm) {
            withdrawalForm.onsubmit = async function (e) {
                e.preventDefault();
                const amount = parseFloat(this.amount.value);
                const desc = this.desc.value.trim();
                const bank = this.bank.value.trim();
                const accNum = this.account_number.value.trim();
                const accName = this.account_name.value.trim();
                const type = this.type.value;

                if (amount < 200) return showToast("Minimum withdrawal is $200", "error");
                if (!bank || !accNum || !accName) return showToast("All bank details required.", "error");

                // Get balances for transaction record
                const balance_before = account.balance || 0;
                const balance_after = balance_before - amount;

                // Generate OTP and send email
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                window.__withdrawOtp = otp;

                await sendEmail({
                    to: profile.email,
                    subject: "Withdrawal OTP Verification",
                    html: `
                        <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#f9f9f9;padding:24px;border-radius:8px;">
                            <h2 style="color:#2563eb;">Withdrawal OTP Verification</h2>
                            <p>Hello <b>${profile.full_name}</b>,</p>
                            <p>Your OTP for withdrawal of <b>${fmt(amount)}</b> is:</p>
                            <div style="font-size:2rem;font-weight:bold;letter-spacing:4px;color:#16a34a;margin:16px 0;">${otp}</div>
                            <p>For: <b>${desc}</b></p>
                            <p>Account: <b>${account.account_number}</b></p>
                            <p style="color:#888;font-size:12px;">If you did not initiate this, please contact support immediately.</p>
                            <hr style="margin:16px 0;">
                            <div style="font-size:11px;color:#aaa;">Horizon Ridge Credit Union</div>
                        </div>
                    `
                });

                await sendNotification(
                    "Withdrawal OTP Verification",
                    `Your OTP for withdrawal of ${fmt(amount)} is: ${otp}`,
                    "info"
                );

                showOtpModal({ amount, desc, bank, accNum, accName, type, otp, balance_before, balance_after });
            };
        }
    }

    function showOtpModal({ amount, desc, bank, accNum, accName, type, otp, balance_before, balance_after }) {
        let modal = document.getElementById('withdrawal-otp-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'withdrawal-otp-modal';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                    <button id="close-otp-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                    <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white">Withdrawal OTP Verification</h4>
                    <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">Enter the OTP sent to your email to confirm your withdrawal.</div>
                    <form id="otp-form" class="space-y-3">
                        <div>
                            <label class="block text-xs text-gray-500 mb-1 font-semibold">OTP</label>
                            <input type="text" name="otp" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" maxlength="6" required>
                        </div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"><i class="fa fa-check"></i> Confirm</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        modal.className = '';
        document.getElementById('close-otp-modal').onclick = () => {
            modal.innerHTML = '';
            modal.className = 'hidden';
        };
        document.getElementById('otp-form').onsubmit = async function (e) {
            e.preventDefault();
            const enteredOtp = this.otp.value.trim();
            if (enteredOtp !== window.__withdrawOtp) {
                showToast("Invalid OTP!", "error");
                return;
            }
            // Insert into transactions table
            const { error: txError } = await supabase.from('transactions').insert([{
                account_id: account.id,
                user_id: user.id,
                type: 'withdrawal',
                amount: amount,
                description: desc,
                balance_before,
                balance_after,
                status: 'pending'
            }]);
            if (txError) {
                showToast("Withdrawal failed: " + txError.message, "error");
                return;
            }

            await sendEmail({
                to: profile.email,
                subject: "Withdrawal Request Initiated",
                html: `
                    <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#f9f9f9;padding:24px;border-radius:8px;">
                        <h2 style="color:#2563eb;">Withdrawal Request Initiated</h2>
                        <p>Hello <b>${profile.full_name}</b>,</p>
                        <p>Your withdrawal request has been received:</p>
                        <ul style="margin:12px 0 16px 18px;padding:0;font-size:15px;">
                            <li><b>Amount:</b> ${fmt(amount)}</li>
                            <li><b>Description:</b> ${desc}</li>
                            <li><b>Bank:</b> ${bank}</li>
                            <li><b>Account Number:</b> ${accNum}</li>
                            <li><b>Account Name:</b> ${accName}</li>
                            <li><b>Type:</b> ${type}</li>
                            <li><b>Date/Time:</b> ${new Date().toLocaleString()}</li>
                        </ul>
                        <p style="color:#888;font-size:12px;">We will notify you once your withdrawal is confirmed.</p>
                        <hr style="margin:16px 0;">
                        <div style="font-size:11px;color:#aaa;">Horizon Ridge Credit Union</div>
                    </div>
                `
            });

            await sendNotification(
                "Withdrawal Request Initiated",
                `Your withdrawal request of ${fmt(amount)} has been received and is pending approval.`,
                "info"
            );

            showToast("Withdrawal submitted and pending approval.", "success");
            modal.innerHTML = '';
            modal.className = 'hidden';
            setTimeout(() => window.location.reload(), 1200);
        };
    }

    return {
        html: /*html*/`
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
            <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
                <div class="p-4 max-w-6xl mx-auto">
                    <nav class="flex items-center space-x-2 text-xs mb-4">
                        <i class="fa fa-home text-gray-500"></i>
                        <span class="text-gray-500">/</span>
                        <span class="text-gray-700 dark:text-gray-300">Withdrawal</span>
                    </nav>
                    <div class="flex flex-wrap gap-2 mb-6">
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
                    <div class="bg-white dark:bg-gray-800 rounded shadow-sm p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-base font-semibold text-gray-900 dark:text-white"><i class="fa fa-bank mr-2"></i> Withdrawal</h3>
                        </div>
                        <form id="withdrawal-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs mb-1">Amount</label>
                                    <div class="relative">
                                        <input type="number" min="200" name="amount" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" placeholder="$500" required>
                                        <span class="absolute right-2 top-2 text-gray-400"><i class="fa fa-money"></i></span>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs mb-1">Description</label>
                                    <div class="relative">
                                        <textarea name="desc" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" placeholder="Description" required></textarea>
                                        <span class="absolute right-2 top-2 text-gray-400"><i class="fa fa-envelope"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs mb-1">Bank</label>
                                    <input type="text" name="bank" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" required>
                                </div>
                                <div>
                                    <label class="block text-xs mb-1">Account Number</label>
                                    <input type="text" name="account_number" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" required>
                                </div>
                                <div>
                                    <label class="block text-xs mb-1">Account Name</label>
                                    <input type="text" name="account_name" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" required>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs mb-1">Account Type</label>
                                <select name="type" class="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:border-blue-500" required>
                                    <option value="local">Local Account</option>
                                    <option value="foreign">Foreign Account</option>
                                </select>
                            </div>
                            <div class="flex gap-2">
                                <button type="submit" class="btn bg-blue-600 text-white px-4 py-1 rounded text-xs"><i class="fa fa-donate"></i> Withdraw</button>
                                <button type="reset" class="btn bg-gray-200 text-gray-700 px-4 py-1 rounded text-xs"><i class="fa fa-refresh"></i> Refresh</button>
                            </div>
                        </form>
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

export default withdrawal;