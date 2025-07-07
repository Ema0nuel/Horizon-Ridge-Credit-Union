import { supabase } from '../../utils/supabaseClient';
import { showToast } from '../../components/toast';
import { sendEmail } from './functions/Emailing/sendEmail';
import { reset } from '../../utils/reset';
import navbar from './components/Navbar';
import User from "/src/images/user/user.png"


const ADMIN_EMAIL = "horizonridgecreditunion@gmail.com";

const editProfile = async () => {
    reset("Edit Profile");
    const nav = navbar();

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
        document.querySelectorAll(".tw-tabs li").forEach((li) => {
            li.addEventListener("click", function (e) {
                e.preventDefault();
                document.querySelectorAll(".tw-tabs li").forEach((l) => l.classList.remove("tw-active", "border-b-2", "border-blue-600"));
                this.classList.add("tw-active", "border-b-2", "border-blue-600");
                document.querySelectorAll(".tw-tab-pane").forEach((tab) => tab.classList.add("hidden"));
                const tabId = this.querySelector("a").getAttribute("href").replace("#", "");
                document.getElementById(tabId).classList.remove("hidden");
            });
        });

        // Edit Profile Form
        const editForm = document.getElementById("edit-profile-form");
        if (editForm) {
            editForm.onsubmit = async function (e) {
                e.preventDefault();
                const btn = document.getElementById("save-profile-btn");
                const spinner = document.getElementById("profile-spinner");
                btn.disabled = true;
                spinner.classList.remove("hidden");

                // Only send allowed fields and skip empty/invalid dates
                const formData = new FormData(this);
                const updates = {};
                [
                    "full_name", "title", "firstname", "lastname", "phone", "country_code", "nationality",
                    "address", "city", "state", "zip", "dob", "occupation", "ssn", "marital_status", "gender"
                ].forEach(key => {
                    let val = formData.get(key);
                    if (key === "dob" && (!val || val === "")) return; // skip empty dob
                    if (typeof val === "string" && val.trim() !== "") updates[key] = val;
                });

                const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
                spinner.classList.add("hidden");
                btn.disabled = false;
                if (error) {
                    showToast("Profile update failed: " + error.message, "error");
                    return;
                }
                await sendEmail({
                    to: profile.email,
                    subject: "Profile Updated",
                    html: `<p>Hello <b>${updates.full_name || profile.full_name}</b>,<br>Your profile was successfully updated.</p>`
                });
                showToast("Profile updated successfully!", "success");
                setTimeout(() => window.location.reload(), 1200);
            };
        }

        // KYC Form
        const kycForm = document.getElementById("kyc-form");
        if (kycForm) {
            kycForm.onsubmit = async function (e) {
                e.preventDefault();
                const btn = document.getElementById("kyc-submit-btn");
                const spinner = document.getElementById("kyc-spinner");
                btn.disabled = true;
                spinner.classList.remove("hidden");
                const formData = new FormData(this);

                // Only send valid date
                let dob = formData.get("dob");
                if (!dob || dob === "") dob = null;

                async function uploadFile(file, folder) {
                    if (!file || file.size === 0) return null;
                    const path = `${user.id}/${folder}_${Date.now()}_${file.name}`;
                    const { data, error } = await supabase.storage.from('kyc').upload(path, file, { upsert: true });
                    if (error || !data?.path) return null;
                    const { data: urlData } = supabase.storage.from('kyc').getPublicUrl(data.path);
                    return urlData?.publicUrl || null;
                }
                // Validate files before upload
                const legalIdFile = formData.get('legal_id_image');
                const addressFile = formData.get('proof_of_address');
                const bankFile = formData.get('bank_statement');
                if (!legalIdFile || !addressFile || !bankFile) {
                    showToast("All KYC files are required.", "error");
                    spinner.classList.add("hidden");
                    btn.disabled = false;
                    return;
                }
                const legal_id_image_url = await uploadFile(legalIdFile, 'legal_id');
                const proof_of_address_url = await uploadFile(addressFile, 'address');
                const bank_statement_url = await uploadFile(bankFile, 'bank');

                if (!legal_id_image_url || !proof_of_address_url || !bank_statement_url) {
                    showToast("File upload failed. Please check your files and try again.", "error");
                    spinner.classList.add("hidden");
                    btn.disabled = false;
                    return;
                }

                const kycData = {
                    user_id: user.id,
                    full_name: formData.get('full_name'),
                    birth_date: dob,
                    gender: formData.get('gender'),
                    ssn: formData.get('ssn'),
                    address: formData.get('address'),
                    country: formData.get('nationality'),
                    zip_code: formData.get('zip'),
                    phone: formData.get('phone'),
                    email: profile.email,
                    legal_id_type: formData.get('legal_id_type'),
                    legal_id_number: formData.get('legal_id_number'),
                    legal_id_image_url,
                    proof_of_address_url,
                    bank_statement_url,
                    status: 'pending'
                };
                if (!kycData.birth_date) delete kycData.birth_date;

                const { error } = await supabase.from('kyc_requests').insert([kycData]);
                spinner.classList.add("hidden");
                btn.disabled = false;
                if (error) {
                    showToast("KYC submission failed: " + error.message, "error");
                    return;
                }
                await sendEmail({
                    to: profile.email,
                    subject: "KYC Submitted",
                    html: `<p>Hello <b>${kycData.full_name}</b>,<br>Your KYC request has been submitted and is under review.</p>`
                });
                showToast("KYC submitted successfully!", "success");
                setTimeout(() => window.location.reload(), 1200);
            };
        }
    }

    return {
        html: /*html*/`
        <div class="relative">
        ${nav.html}
        <div class="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen pt-12">
            <div id="main-content" class="ml-56 pt-14 transition-all duration-300 font-sans min-h-screen">
                <div class="p-4 max-w-5xl mx-auto">
                    <nav class="flex items-center text-xs mb-4 space-x-2">
                        <i class="fa fa-home text-gray-500"></i>
                        <a href="/" class="text-blue-600 hover:underline">Home</a>
                        <span class="text-gray-500">/</span>
                        <span class="text-gray-700 dark:text-gray-300">Profile</span>
                    </nav>
                    <div class="mb-6">
                        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Profile</h2>
                        <em class="text-xs text-gray-500">${profile.full_name}</em>
                    </div>
                    <div class="bg-white dark:bg-gray-800 rounded shadow-sm p-4">
                        <ul class="tw-tabs flex border-b mb-6">
                            <li class="tw-active border-b-2 border-blue-600 -mb-px">
                                <a href="#profile-tab" class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600"><i class="fa fa-user mr-2"></i>Profile</a>
                            </li>
                            <li>
                                <a href="#settings-tab" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600"><i class="fa fa-gear mr-2"></i>Settings</a>
                            </li>
                            <li>
                                <a href="#kyc-tab" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600"><i class="fa fa-id-card mr-2"></i>KYC</a>
                            </li>
                        </ul>
                        <div class="tab-content profile-page">
                            <!-- PROFILE TAB CONTENT -->
                            <div class="tw-tab-pane" id="profile-tab">
                                <div class="flex flex-col md:flex-row gap-8">
                                    <div class="md:w-1/4 flex flex-col items-center">
                                        <img src="${profile.avatar_url || User}" class="rounded-full mb-2 border border-gray-200 dark:border-gray-700 w-40 h-40 object-cover" alt="Profile Picture">
                                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">${profile.full_name} <i class="fa fa-circle text-green-500 text-xs"></i></h2>
                                        <a href="mailto:${profile.email}" class="btn bg-blue-600 text-white px-4 py-1 rounded text-xs mt-2"><i class="fa fa-envelope-o"></i> Send Message</a>
                                    </div>
                                    <div class="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                                        <div>
                                            <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Basic Information</h3>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Full Name:</span> <span class="font-semibold">${profile.full_name}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Birth Date:</span> <span class="font-semibold">${profile.dob || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Gender:</span> <span class="font-semibold">${profile.gender || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">SSN:</span> <span class="font-semibold">${profile.ssn || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Occupation:</span> <span class="font-semibold">${profile.occupation || "-"}</span></div>
                                        </div>
                                        <div>
                                            <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Contact Information</h3>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Email:</span> <span class="font-semibold">${profile.email || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Phone:</span> <span class="font-semibold">${profile.phone || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Address:</span> <span class="font-semibold">${profile.address || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Country:</span> <span class="font-semibold">${profile.nationality || "-"}</span></div>
                                            <div class="mb-1"><span class="font-normal text-gray-500">Zip:</span> <span class="font-semibold">${profile.zip || "-"}</span></div>
                                        </div>
                                        <div class="col-span-2 mt-4">
                                            <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Account Information</h3>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                <div><span class="font-normal text-gray-500">Account Balance:</span> <span class="font-semibold">${fmt(account?.balance)}</span></div>
                                                <div><span class="font-normal text-gray-500">Account Number:</span> <span class="font-semibold">${account?.account_number || "-"}</span></div>
                                                <div><span class="font-normal text-gray-500">Account Type:</span> <span class="font-semibold">${account?.account_type || "-"}</span></div>
                                                <div><span class="font-normal text-gray-500">Account Status:</span> <span class="font-semibold">${account?.is_active ? "Active" : "Inactive"}</span></div>
                                                <div><span class="font-normal text-gray-500">Account Pin:</span> <span class="font-semibold">${account?.pin || "-"}</span></div>
                                                <div><span class="font-normal text-gray-500">Branch:</span> <span class="font-semibold">${account?.branch || "-"}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- SETTINGS TAB CONTENT -->
                            <div class="tw-tab-pane hidden" id="settings-tab">
                                <form id="edit-profile-form" class="space-y-4 max-w-xl mx-auto mt-6">
                                    <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-square mr-1"></i> Change Detail</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs mb-1">Full Name</label>
                                            <input type="text" name="full_name" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.full_name || ""}" required>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">DOB</label>
                                            <input type="date" name="dob" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.dob || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Gender</label>
                                            <select name="gender" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                                                <option value="">Select</option>
                                                <option value="Male" ${profile.gender === "Male" ? "selected" : ""}>Male</option>
                                                <option value="Female" ${profile.gender === "Female" ? "selected" : ""}>Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Phone</label>
                                            <input type="text" name="phone" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.phone || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Address</label>
                                            <input type="text" name="address" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.address || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Country</label>
                                            <input type="text" name="nationality" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.nationality || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Zip</label>
                                            <input type="text" name="zip" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.zip || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Occupation</label>
                                            <input type="text" name="occupation" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.occupation || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">SSN</label>
                                            <input type="text" name="ssn" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.ssn || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Marital Status</label>
                                            <input type="text" name="marital_status" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.marital_status || ""}">
                                        </div>
                                    </div>
                                    <div class="flex justify-center mt-4">
                                        <button type="submit" id="save-profile-btn" class="btn bg-blue-600 text-white px-4 py-1 rounded text-xs flex items-center gap-2">
                                            <span>Save Changes</span>
                                            <span id="profile-spinner" class="hidden ml-2"><i class="fa fa-spinner fa-spin"></i></span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <!-- KYC TAB CONTENT -->
                            <div class="tw-tab-pane hidden" id="kyc-tab">
                                <form id="kyc-form" class="space-y-4 max-w-xl mx-auto mt-6" enctype="multipart/form-data" autocomplete="off">
                                    <h3 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"><i class="fa fa-id-card mr-1"></i> KYC Verification</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs mb-1">Full Name</label>
                                            <input type="text" name="full_name" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.full_name || ""}" required>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">DOB</label>
                                            <input type="date" name="dob" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.dob || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Gender</label>
                                            <select name="gender" class="w-full border border-gray-300 rounded px-2 py-1 text-xs">
                                                <option value="">Select</option>
                                                <option value="Male" ${profile.gender === "Male" ? "selected" : ""}>Male</option>
                                                <option value="Female" ${profile.gender === "Female" ? "selected" : ""}>Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Phone</label>
                                            <input type="text" name="phone" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.phone || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Address</label>
                                            <input type="text" name="address" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.address || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Country</label>
                                            <input type="text" name="nationality" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.nationality || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Zip</label>
                                            <input type="text" name="zip" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" value="${profile.zip || ""}">
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Legal ID Type</label>
                                            <select name="legal_id_type" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" required>
                                                <option value="">Select</option>
                                                <option value="Passport">Passport</option>
                                                <option value="Driver's License">Driver's License</option>
                                                <option value="National ID">National ID</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Legal ID Number</label>
                                            <input type="text" name="legal_id_number" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" required>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Legal ID Image</label>
                                            <input type="file" name="legal_id_image" accept="image/*" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" required>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Proof of Address (Utility Bill, etc.)</label>
                                            <input type="file" name="proof_of_address" accept="image/*,application/pdf" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" required>
                                        </div>
                                        <div>
                                            <label class="block text-xs mb-1">Recent Bank Statement</label>
                                            <input type="file" name="bank_statement" accept="image/*,application/pdf" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" required>
                                        </div>
                                    </div>
                                    <div class="flex justify-center mt-4">
                                        <button type="submit" id="kyc-submit-btn" class="btn bg-green-600 text-white px-4 py-1 rounded text-xs flex items-center gap-2">
                                            <span>Submit KYC</span>
                                            <span id="kyc-spinner" class="hidden ml-2"><i class="fa fa-spinner fa-spin"></i></span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <footer class="footer mt-8 text-center text-xs text-gray-400">
                        <strong>&copy;${new Date().getFullYear()} West Coast Group.</strong> All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
        </div>
        `,
        pageEvents,
    };
};

export default editProfile;