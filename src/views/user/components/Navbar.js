import { supabase } from "../../../utils/supabaseClient";
import { checkSession } from "../functions/checkSession";
import { showToast } from "../../../components/toast";
import User from "/src/images/user.png";
import Logo from "/src/images/logo.jpg";

const navbar = () => {
    let notifications = [];
    let profile = {};
    let isDarkMode = localStorage.getItem('hrcu_dark') === 'true';
    let sidebarCollapsed = localStorage.getItem('hrcu_sidebar') === 'true';
    let showNotifications = false;

    async function fetchNotifications(userId) {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);
        notifications = data || [];
    }

    function renderNotifications() {
        const notifList = document.getElementById("notif-list");
        if (!notifList) return;
        notifList.innerHTML = notifications.length
            ? notifications.map(n => `
                <div class="p-2 border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors cursor-pointer js-message-item" data-id="${n.id}">
                    <div class="flex items-start space-x-2">
                        <div class="p-1 rounded ${n.type === 'danger' ? (isDarkMode ? 'bg-red-900' : 'bg-red-100') : (isDarkMode ? 'bg-blue-900' : 'bg-blue-100')}">
                            <i class="fa ${n.type === 'danger' ? 'fa-exclamation-circle text-red-600' : 'fa-envelope text-blue-600'} text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}">${n.title || 'Message'}</p>
                            <p class="text-[11px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} truncate">${n.message?.slice(0, 60) || ''}${n.message && n.message.length > 60 ? '...' : ''}</p>
                            <p class="text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5">${n.created_at?.slice(0, 16).replace('T', ' ')}</p>
                        </div>
                        ${!n.read ? `<span class="ml-2 mt-1 inline-block w-2 h-2 rounded-full bg-blue-500"></span>` : ''}
                    </div>
                </div>
            `).join('')
            : `<div class="text-gray-400 dark:text-gray-500 text-xs p-2">No messages yet.</div>`;
        // Badge
        const notifBadge = document.getElementById("notif-badge");
        if (notifBadge) notifBadge.textContent = notifications.length ? notifications.length : "";
    }

    function showMessageModal(messageObj) {
        let modal = document.getElementById('message-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'message-detail-modal';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
                <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                    <button id="close-message-detail-modal" class="absolute top-2 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
                    <h4 class="text-base font-semibold mb-2 text-gray-900 dark:text-white">${messageObj.title || 'Message'}</h4>
                    <div class="mb-2 text-xs text-gray-500 dark:text-gray-300">${messageObj.created_at?.slice(0, 16).replace('T', ' ')}</div>
                    <div class="mb-4 text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">${messageObj.message}</div>
                    <div class="flex justify-end">
                        <button id="close-message-detail-modal-btn" class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs">Close</button>
                    </div>
                </div>
            </div>
        `;
        modal.className = '';
        document.getElementById('close-message-detail-modal').onclick =
            document.getElementById('close-message-detail-modal-btn').onclick = () => {
                modal.innerHTML = '';
                modal.className = 'hidden';
            };
    }

    function renderSidebarText() {
        document.querySelectorAll("#sidebar .sidebar-text").forEach(el => {
            el.style.display = sidebarCollapsed ? "none" : "";
        });
    }

    function setDarkMode(dark) {
        isDarkMode = dark;
        localStorage.setItem('hrcu_dark', dark ? 'true' : 'false');
        document.documentElement.classList.toggle("dark", isDarkMode);
        document.getElementById("navbar-root").className = `fixed top-0 left-0 right-0 z-50 h-12 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm font-sans`;
        document.getElementById("sidebar").className = `fixed left-0 top-12 bottom-0 z-40 ${sidebarCollapsed ? 'w-14' : 'w-56'} ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-sm transition-all duration-300 font-sans`;
        document.getElementById("main-content").className = `${sidebarCollapsed ? 'ml-14' : 'ml-56'} pt-14 transition-all duration-300 font-sans min-h-screen`;
        renderSidebarText();
        renderNotifications();
    }

    function setSidebarCollapsed(collapsed) {
        sidebarCollapsed = collapsed;
        localStorage.setItem('hrcu_sidebar', collapsed ? 'true' : 'false');
        document.getElementById("sidebar").className = `fixed left-0 top-12 bottom-0 z-40 ${sidebarCollapsed ? 'w-14' : 'w-56'} ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-sm transition-all duration-300 font-sans`;
        document.getElementById("main-content").className = `${sidebarCollapsed ? 'ml-14' : 'ml-56'} pt-14 transition-all duration-300 font-sans min-h-screen`;
        renderSidebarText();
    }

    async function pageEvents() {
        // Fetch user session/profile and notifications
        const sessionData = await checkSession();
        if (sessionData && sessionData.profile) {
            profile = sessionData.profile;
            document.querySelector('.user-name').textContent = profile.full_name;
            document.querySelector('.user-img').src = profile.avatar_url || "/src/images/user/user.png";
            await fetchNotifications(sessionData.user.id);
            renderNotifications();
        }

        // Sidebar toggle
        document.getElementById("sidebar-toggle").onclick = () => {
            setSidebarCollapsed(!sidebarCollapsed);
        };

        // Responsive: collapse sidebar on mobile
        function handleResize() {
            if (window.innerWidth < 768) {
                setSidebarCollapsed(true);
            } else {
                setSidebarCollapsed(false);
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();

        // Dropdowns: open sidebar and show submenu
        document.querySelectorAll(".js-sub-menu-toggle").forEach(btn => {
            btn.onclick = function (e) {
                e.preventDefault();
                if (sidebarCollapsed) {
                    setSidebarCollapsed(false);
                }
                const submenu = this.nextElementSibling;
                if (submenu) submenu.classList.toggle("hidden");
                this.querySelector(".toggle-icon")?.classList.toggle("rotate-90");
            };
        });

        // Notifications dropdown (mobile and desktop)
        document.getElementById("notif-btn").onclick = (e) => {
            e.stopPropagation();
            showNotifications = !showNotifications;
            document.getElementById("notif-dropdown").classList.toggle("hidden", !showNotifications);
        };
        document.addEventListener("click", (e) => {
            const notifDropdown = document.getElementById("notif-dropdown");
            if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== document.getElementById("notif-btn")) {
                notifDropdown.classList.add("hidden");
                showNotifications = false;
            }
        });

        // Message click: show modal
        document.getElementById("notif-list").onclick = async function (e) {
            const item = e.target.closest('.js-message-item');
            if (item) {
                const id = item.getAttribute('data-id');
                const msg = notifications.find(n => n.id === id);
                if (msg) {
                    showMessageModal(msg);
                    // Mark as read in DB and update UI
                    if (!msg.read) {
                        await supabase.from('notifications').update({ read: true }).eq('id', id);
                        msg.read = true;
                        renderNotifications();
                    }
                }
            }
        };

        // User dropdown
        document.getElementById("user-menu-btn").onclick = (e) => {
            e.stopPropagation();
            document.getElementById("user-menu-dropdown").classList.toggle("hidden");
        };
        document.addEventListener("click", (e) => {
            if (!document.getElementById("user-menu-dropdown").contains(e.target) && e.target !== document.getElementById("user-menu-btn")) {
                document.getElementById("user-menu-dropdown").classList.add("hidden");
            }
        });

        // Theme toggle
        document.getElementById("theme-toggle").onclick = () => {
            setDarkMode(!isDarkMode);
        };

        // On load, set theme and sidebar from localStorage
        setDarkMode(isDarkMode);
        setSidebarCollapsed(sidebarCollapsed);

        // Logout
        document.getElementById("logout").onclick = async () => {
            await supabase.auth.signOut();
            showToast("You have been logged out.", "success");
            setTimeout(() => window.location.href = "/", 1000);
        };
        document.getElementById("log-out").onclick = async () => {
            await supabase.auth.signOut();
            showToast("You have been logged out.", "success");
            setTimeout(() => window.location.href = "/", 1000);
        };
    }

    return {
        html: /*html*/`
        <div id="navbar-root" class="fixed top-0 left-0 right-0 z-50 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm font-sans">
            <div class="flex items-center justify-between h-full px-3">
                <div class="flex items-center space-x-2">
                    <button id="sidebar-toggle" class="p-1 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base">
                        <i class="fa fa-bars"></i>
                    </button>
                    <img src="${Logo}" alt="Logo" class="h-7 w-auto" />
                </div>
                <div class="flex items-center space-x-2">
                    <div class="relative">
                        <button id="notif-btn" class="relative p-1 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base">
                            <i class="fa fa-envelope text-base"></i>
                            <span id="notif-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center"></span>
                        </button>
                        <div id="notif-dropdown" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 hidden">
                            <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                                <h3 class="font-semibold text-gray-900 dark:text-white text-xs">Recent Messages</h3>
                            </div>
                            <div id="notif-list" class="max-h-80 overflow-y-auto"></div>
                            <div class="p-2 border-t border-gray-200 dark:border-gray-700">
                                <button class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-normal">View All Messages</button>
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <button id="user-menu-btn" class="flex items-center space-x-2 btn btn-link dropdown-toggle focus:outline-none">
                            <img src="${User}" alt="User" class="user-img h-7 w-7 rounded-full object-cover" />
                            <span class="user-name text-xs font-normal text-gray-900 dark:text-gray-100"></span>
                            <i class="fa fa-caret-down text-gray-500 dark:text-gray-300 text-xs"></i>
                        </button>
                        <ul id="user-menu-dropdown" class="dropdown-menu absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 hidden">
                            <li>
                                <a href="/profile" data-nav class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal">
                                    <i class="fa fa-user mr-2"></i> <span class="text">Profile</span>
                                </a>
                            </li>
                            <li>
                                <a class="cursor-pointer flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal" id="log-out">
                                    <i class="fa fa-power-off mr-2"></i> <span class="text">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <button id="theme-toggle" class="p-1 rounded text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base">
                        <span id="theme-icon">🌙</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="sidebar" class="fixed left-0 top-12 bottom-0 z-40 ${sidebarCollapsed ? 'w-14' : 'w-56'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 font-sans">
            <div class="h-full overflow-y-auto">
                <nav class="pt-2">
                    <ul class="space-y-1">
                        <li>
                            <a href="/dashboard" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa fa-home mr-2 text-base"></i>
                                <span class="sidebar-text">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/profile" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa fa-user mr-2 text-base"></i>
                                <span class="sidebar-text">My Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="/account-summary" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa fa-briefcase mr-2 text-base"></i>
                                <span class="sidebar-text">Account Summary</span>
                            </a>
                        </li>
                        <li>
                            <a href="/deposit" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa fa-dollar-sign mr-2 text-base"></i>
                                <span class="sidebar-text">Deposit</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs js-sub-menu-toggle">
                                <i class="fa fa-credit-card mr-2 text-base"></i>
                                <span class="sidebar-text">Funds Transfer</span>
                                <i class="toggle-icon fa fa-angle-left ml-auto transition-transform text-xs"></i>
                            </a>
                            <ul class="sub-menu ml-7 mt-1 space-y-1 hidden">
                                <li>
                                    <a href="/interbank-transfer" data-nav class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal">
                                        <i class="fa fa-bank mr-2 text-xs"></i>
                                        <span class="sidebar-text">Inter-Bank Transfer</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/local-transfer" data-nav class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal">
                                        <i class="fa fa-street-view mr-2 text-xs"></i>
                                        <span class="sidebar-text">Local Transfer</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/wire-transfer" data-nav class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal">
                                        <i class="fa fa-coins mr-2 text-xs"></i>
                                        <span class="sidebar-text">Wire Transfer</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs js-sub-menu-toggle">
                                <i class="fa fa-cog mr-2 text-base"></i>
                                <span class="sidebar-text">Settings</span>
                                <i class="toggle-icon fa fa-angle-left ml-auto transition-transform text-xs"></i>
                            </a>
                            <ul class="sub-menu ml-7 mt-1 space-y-1 hidden">
                                <li>
                                    <a href="/edit-profile" data-nav class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal">
                                        <i class="fa fa-edit mr-2 text-xs"></i>
                                        <span class="sidebar-text">Edit Profile</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs js-sub-menu-toggle">
                                <i class="fa fa-bank mr-2 text-base"></i>
                                <span class="sidebar-text">Personal Banking</span>
                                <i class="toggle-icon fa fa-angle-left ml-auto transition-transform text-xs"></i>
                            </a>
                            <ul class="sub-menu ml-7 mt-1 space-y-1 hidden">
                                <li>
                                    <a href="/contact" data-nav class="flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-normal">
                                        <i class="fa fa-envelope mr-2 text-xs"></i>
                                        <span class="sidebar-text">Contact Us</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="/withdrawal" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa fa-dollar-sign mr-2 text-base"></i>
                                <span class="sidebar-text">Withdrawal</span>
                            </a>
                        </li>
                        <li>
                            <a href="/loan" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa-solid fa-landmark mr-2 text-base"></i>
                                <span class="sidebar-text">Loan</span>
                            </a>
                        </li>
                        <li>
                            <a href="/cards" data-nav class="flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs">
                                <i class="fa-solid fa-credit-card mr-2 text-base"></i>
                                <span class="sidebar-text">Credit Cards</span>
                            </a>
                        </li>
                        <li>
                            <a class="cursor-pointer flex items-center px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-normal text-xs" id="logout">
                                <i class="fa fa-power-off mr-2 text-base"></i>
                                <span class="sidebar-text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        `,
        pageEvents
    };
};

export default navbar;