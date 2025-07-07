import { supabase } from "../../utils/supabaseClient";
import navbar from "./components/Navbar";
import { sendEmail } from "./functions/Emailing/sendEmail";
import { showToast } from "../../components/toast";
import { reset } from "../../utils/reset"
import User from "/src/images/user/user.png"


const ADMIN_EMAIL = "horizonridgecreditunion@gmail.com";

const profile = async () => {
    reset("Profile")
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
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch account
    const { data: account } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

    // Format currency
    const fmt = (v) =>
        typeof v === "number"
            ? v.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
            })
            : v || "$0.00";

    function pageEvents() {
        nav.pageEvents?.();

        // Tab switching
        document.querySelectorAll(".js-tab-link").forEach((link) => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                document
                    .querySelectorAll(".js-tab-link")
                    .forEach((l) =>
                        l.classList.remove("active", "border-blue-500", "text-blue-600")
                    );
                document
                    .querySelectorAll(".tab-pane")
                    .forEach((tab) => tab.classList.add("hidden"));
                this.classList.add("active", "border-blue-500", "text-blue-600");
                document.getElementById(this.dataset.tab).classList.remove("hidden");
            });
        });

        // Message modal logic
        const modal = document.getElementById("send-message-modal");
        const openBtn = document.getElementById("open-message-modal");
        const closeBtn = document.getElementById("close-message-modal");
        const cancelBtn = document.getElementById("cancel-message-modal");
        const form = document.getElementById("send-message-form");
        if (openBtn)
            openBtn.onclick = () => {
                modal.classList.remove("opacity-0", "pointer-events-none");
                modal.classList.add("opacity-100");
            };
        if (closeBtn) closeBtn.onclick = ifCancel;
        if (cancelBtn) cancelBtn.onclick = ifCancel;
        function ifCancel() {
            modal.classList.add("opacity-0", "pointer-events-none");
            modal.classList.remove("opacity-100");
            form.reset();
        }

        // Send message
        if (form) {
            form.onsubmit = async function (e) {
                e.preventDefault();
                const subject = form.subject.value.trim();
                const message = form.message.value.trim();
                if (!subject || !message) {
                    showToast("Please fill in all fields.", "error");
                    return;
                }
                form.querySelector('button[type="submit"]').disabled = true;
                try {
                    // Send email
                    await sendEmail({
                        to: ADMIN_EMAIL,
                        subject: `[${profile.full_name}] ${subject}`,
                        html: `<b>From:</b> ${profile.full_name} (${profile.email})<br/><b>Message:</b><br/>${message.replace(/\n/g, "<br>")}`,
                    });
                    // Add notification for user
                    await supabase.from("notifications").insert([
                        {
                            user_id: user.id,
                            title: `Message sent: ${subject}`,
                            message: message,
                            type: "info",
                        },
                    ]);
                    showToast("Message sent successfully!", "success");
                    ifCancel();
                } catch (err) {
                    showToast("Failed to send message.", "error");
                }
                form.querySelector('button[type="submit"]').disabled = false;
            };
        }

        // Settings form submit (example, you can expand)
        const settingsForm = document.getElementById("settings-form");
        if (settingsForm) {
            settingsForm.onsubmit = async function (e) {
                e.preventDefault();
                const email = this.new_email.value;
                const phone = this.new_phone.value;
                const password = this.password.value;
                if (!password)
                    return showToast("Password required to update.", "error");
                await supabase
                    .from("profiles")
                    .update({ email, phone })
                    .eq("id", user.id);
                showToast("Profile updated!", "success");
            };
        }
    }

    return {
        html: /*html*/ `
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
            <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
                <div class="p-4 max-w-6xl mx-auto">
                    <nav class="flex items-center space-x-2 text-xs mb-4">
                        <i class="fa fa-home text-gray-500"></i>
                        <span class="text-gray-500">/</span>
                        <span class="text-gray-700 dark:text-gray-300">Profile</span>
                    </nav>
                    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Profile</h2>
                            <em class="text-xs text-gray-500">${profile.full_name}</em>
                        </div>
                        <ul class="flex border-b text-xs font-normal mt-4 md:mt-0">
                            <li>
                                <a href="#" class="js-tab-link active px-3 py-2 border-b-2 border-blue-500 text-blue-600" data-tab="profile-tab">
                                    <i class="fa fa-user mr-1"></i> Profile
                                </a>
                            </li>
                            <li>
                                <a href="#" class="js-tab-link px-3 py-2 border-b-2 border-transparent hover:border-blue-400 text-gray-600 hover:text-blue-600" data-tab="settings-tab">
                                    <i class="fa fa-gear mr-1"></i> Settings
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-content profile-page">
                        <!-- PROFILE TAB -->
                        <div class="tab-pane profile" id="profile-tab">
                            <div class="flex flex-col md:flex-row gap-8">
                                <div class="md:w-1/4 flex flex-col items-center">
                                    <img src="${profile.avatar_url || User}" class="rounded-full mb-2 border border-gray-200 dark:border-gray-700" style="width:120px;height:120px;" alt="Profile Picture">
                                    <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-1">${profile.full_name} <i class="fa fa-circle text-green-500 text-xs"></i></h2>
                                    <button id="open-message-modal" class="btn btn-sm bg-blue-600 text-white px-4 py-1 rounded mt-2 text-xs flex items-center gap-2"><i class="fa fa-envelope-o"></i> Message</button>
                                </div>
                                <div class="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                                    <div>
                                        <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Basic Information</h3>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Full Name:</span> <span class="font-semibold">${profile.full_name}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Birth Date:</span> <span class="font-semibold">${profile.birth_date || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Gender:</span> <span class="font-semibold">${profile.gender || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">SSN:</span> <span class="font-semibold">${profile.ssn || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Routing Number:</span> <span class="font-semibold">${profile.routing_number || "-"}</span></div>
                                    </div>
                                    <div>
                                        <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Contact Information</h3>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Email:</span> <span class="font-semibold">${profile.email}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Phone:</span> <span class="font-semibold">${profile.phone || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Address:</span> <span class="font-semibold">${profile.address || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Country:</span> <span class="font-semibold">${profile.country || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Zip Code:</span> <span class="font-semibold">${profile.zip_code || "-"}</span></div>
                                    </div>
                                    <div>
                                        <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Account Information</h3>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Account Balance:</span> <span class="font-semibold">${fmt(account?.balance)}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Account Number:</span> <span class="font-semibold">${account?.account_number || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Account Type:</span> <span class="font-semibold">${account?.account_type || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Account Status:</span> <span class="font-semibold">${account?.is_active ? "Active" : "Inactive"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Account Pin:</span> <span class="font-semibold">${account?.pin || "-"}</span></div>
                                        <div class="mb-1"><span class="font-normal text-gray-500">Branch:</span> <span class="font-semibold">${account?.branch || "-"}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- SETTINGS TAB -->
                        <div class="tab-pane settings hidden" id="settings-tab">
                            <form id="settings-form" class="max-w-lg mt-4">
                                <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Change Detail</h3>
                                <div class="mb-3">
                                    <label class="block text-xs text-gray-500 mb-1">Email</label>
                                    <input type="email" name="new_email" class="w-full border rounded px-2 py-1 text-xs" placeholder="${profile.email}">
                                </div>
                                <div class="mb-3">
                                    <label class="block text-xs text-gray-500 mb-1">Phone</label>
                                    <input type="text" name="new_phone" class="w-full border rounded px-2 py-1 text-xs" placeholder="${profile.phone || ""}">
                                </div>
                                <hr class="my-3">
                                <div class="mb-3">
                                    <label class="block text-xs text-gray-500 mb-1">Confirm your update with your password</label>
                                    <input type="password" name="password" class="w-full border rounded px-2 py-1 text-xs" placeholder="Enter your password">
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn bg-blue-600 text-white px-4 py-1 rounded text-xs"><i class="fa fa-floppy-o"></i> Save Changes</button>
                                </div>
                            </form>
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
        <!-- Message Modal -->
       <!-- ...existing code... -->
<div id="send-message-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 transform scale-95 transition-transform duration-300">
        <div class="flex items-center justify-between mb-3">
            <h4 class="text-base font-semibold text-gray-900 dark:text-white">Send Message to Admin</h4>
            <button id="close-message-modal" class="text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">&times;</button>
        </div>
        <form id="send-message-form" class="space-y-3">
            <div>
                <label class="block text-xs text-gray-500 mb-1 font-semibold">From</label>
                <input type="text" class="w-full border rounded px-2 py-1 text-xs bg-gray-100" value="${profile.full_name} (${profile.email})" readonly>
            </div>
            <div>
                <label class="block text-xs text-gray-500 mb-1 font-semibold">To</label>
                <input type="text" class="w-full border rounded px-2 py-1 text-xs bg-gray-100" value="${ADMIN_EMAIL}" readonly>
            </div>
            <div>
                <label class="block text-xs text-gray-500 mb-1 font-semibold">Subject</label>
                <input type="text" name="subject" class="w-full border rounded px-2 py-1 text-xs" maxlength="100" required>
            </div>
            <div>
                <label class="block text-xs text-gray-500 mb-1 font-semibold">Message</label>
                <textarea name="message" class="w-full border rounded px-2 py-1 text-xs" rows="6" maxlength="1000" required></textarea>
            </div>
            <div class="flex justify-end gap-2 pt-2">
                <button type="button" id="cancel-message-modal" class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs">Cancel</button>
                <button type="submit" class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"><i class="fa fa-paper-plane"></i> Send</button>
            </div>
        </form>
    </div>
</div>
<!-- ...existing code... -->
        `,
        pageEvents,
    };
};

export default profile;
