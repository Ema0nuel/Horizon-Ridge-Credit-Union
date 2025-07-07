import { supabase } from '../../utils/supabaseClient';
import { showToast } from '../../components/toast';
import { sendEmail } from './functions/Emailing/sendEmail';
import { reset } from '../../utils/reset';
import navbar from './components/Navbar';

const ADMIN_EMAIL = "horizonridgecreditunion@gmail.com";

const contact = async () => {
    const nav = navbar();
    reset("Horizon | Contact Us");

    // Fetch session and user/account data
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
        window.location.href = "/login";
        return;
    }
    const { user } = session.data.session;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    let notifications = [];

    async function fetchNotifications() {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);
        notifications = data || [];
    }

    function renderNotificationsView() {
        const notifView = document.getElementById('notif-view');
        if (!notifView) return;
        notifView.innerHTML = `
  <div class="px-4 sm:px-0">
    <div class="flex items-center mb-4">
        <button id="back-to-contact" class="mr-2 px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">
          <i class="fa fa-arrow-left"></i> Back
        </button>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Recent Notifications</h3>
    </div>
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
        ${notifications.length ? notifications.map(n => `
            <div class="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 js-notif-item rounded-md" data-id="${n.id}">
                <div class="flex items-start gap-2">
                    <div class="pt-1">
                        <i class="fa ${n.type === 'danger' ? 'fa-exclamation-circle text-red-600' : 'fa-envelope text-blue-600'}"></i>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="text-xs font-semibold truncate">${n.title || 'Message'}</div>
                        <div class="text-[11px] text-gray-600 dark:text-gray-300 truncate">${n.message?.slice(0, 60) || ''}${n.message && n.message.length > 60 ? '...' : ''}</div>
                        <div class="text-[10px] text-gray-400 mt-0.5">${n.created_at?.slice(0, 16).replace('T', ' ')}</div>
                    </div>
                    <button class="notif-toggle-btn text-xs bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
                <div class="notif-details hidden mt-2 text-xs text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded p-2">${n.message}</div>
            </div>
        `).join('') : `<div class="text-gray-400 dark:text-gray-500 text-xs p-2">No notifications yet.</div>`}
    </div>
  </div>
`;

        // Back button
        const backBtn = document.getElementById('back-to-contact');
        if (backBtn) {
            backBtn.onclick = () => {
                const notifView = document.getElementById('notif-view');
                const contactMain = document.getElementById('contact-main');
                if (notifView) notifView.classList.add('hidden');
                if (contactMain) contactMain.classList.remove('hidden');
            };
        }
        // Notification expand/collapse
        notifView.querySelectorAll('.js-notif-item').forEach(item => {
            const btn = item.querySelector('.notif-toggle-btn');
            const details = item.querySelector('.notif-details');
            if (btn && details) {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const isOpen = !details.classList.contains('hidden');
                    notifView.querySelectorAll('.notif-details').forEach(d => d.classList.add('hidden'));
                    notifView.querySelectorAll('.notif-toggle-btn i').forEach(i => { i.className = 'fa fa-plus'; });
                    if (!isOpen) {
                        details.classList.remove('hidden');
                        btn.querySelector('i').className = 'fa fa-minus';
                        // Mark as read
                        const id = item.getAttribute('data-id');
                        const notif = notifications.find(n => n.id === id);
                        if (notif && !notif.read) {
                            await supabase.from('notifications').update({ read: true }).eq('id', id);
                            notif.read = true;
                        }
                    } else {
                        details.classList.add('hidden');
                        btn.querySelector('i').className = 'fa fa-plus';
                    }
                };
            }
        });
    }

    function pageEvents() {
        nav.pageEvents?.();

        // Tab switching
        const notifTab = document.getElementById('tab-notifications');
        if (notifTab) {
            notifTab.onclick = async () => {
                await fetchNotifications();
                const contactMain = document.getElementById('contact-main');
                const notifView = document.getElementById('notif-view');
                if (contactMain) contactMain.classList.add('hidden');
                if (notifView) notifView.classList.remove('hidden');
                renderNotificationsView();
            };
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.onsubmit = async function (e) {
                e.preventDefault();
                const btn = document.getElementById('send-contact-btn');
                const spinner = document.getElementById('contact-spinner');
                btn.disabled = true;
                spinner.classList.remove('hidden');
                const subject = this.subject.value.trim();
                const message = this.message.value.trim();
                if (!subject || !message) {
                    showToast("Please fill in all fields.", "error");
                    btn.disabled = false;
                    spinner.classList.add('hidden');
                    return;
                }
                await sendEmail({
                    to: ADMIN_EMAIL,
                    subject: `[Contact Us] ${subject}`,
                    html: `<p><b>From:</b> ${profile.full_name} (${profile.email})<br><b>Message:</b><br>${message}</p>`
                });
                showToast("Message sent to admin!", "success");
                this.reset();
                btn.disabled = false;
                spinner.classList.add('hidden');
            };
        }
    }

    return {
        html: /*html*/`
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
            <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
                <div class="max-w-2xl mx-auto py-8 px-2">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
                        <button id="tab-notifications" class="btn bg-blue-600 text-white px-3 py-1 rounded text-xs"><i class="fa fa-bell"></i> Notifications</button>
                    </div>
                    <div id="contact-main">
                        <form id="contact-form" class="bg-white dark:bg-gray-800 rounded shadow-sm p-4 space-y-4">
                            <div>
                                <label class="block text-xs mb-1">Subject</label>
                                <input type="text" name="subject" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" required>
                            </div>
                            <div>
                                <label class="block text-xs mb-1">Message</label>
                                <textarea name="message" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" rows="5" required></textarea>
                            </div>
                            <div class="flex justify-end">
                                <button type="submit" id="send-contact-btn" class="btn bg-green-600 text-white px-4 py-1 rounded text-xs flex items-center gap-2">
                                    <span>Send</span>
                                    <span id="contact-spinner" class="hidden ml-2"><i class="fa fa-spinner fa-spin"></i></span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div id="notif-view" class="hidden"></div>
                </div>
            </div>
        </div>
        `,
        pageEvents
    };
};

export default contact;