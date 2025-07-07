import navbar from "../../components/navbar";
import { reset } from "../../utils/reset";
import { showToast } from "../../components/toast";

const authenticationView = async () => {
    reset("Email Verification Required");
    const nav = navbar();

    async function pageEvents() {
        nav.pageEvents?.();

        const form = document.getElementById("resendemail");
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                // TODO: Add your resend verification email logic here (API call)
                showToast("Verification email resent! (Implement backend logic)", "info");
            });
        }
    }

    return {
        html: /*html*/`
        <main class="main min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark transition-colors duration-300" id="top">
            <div id="nav-actions" class="flex items-center gap-2 ml-2 absolute top-4"></div>
            <div class="flex flex-1 items-center justify-center py-12 px-4">
                <div class="w-full max-w-md space-y-8">
                    <div class="flex flex-col items-center mb-6">
                        <a href="/" data-nav class="flex items-center justify-center mb-4">
                            <img src="/src/images/logo.jpg" alt="Horizon Ridge Credit Union logo" class="h-16 w-auto block dark:hidden" />
                            <img src="/src/images/logo.jpg" alt="Horizon Ridge Credit Union logo" class="h-16 w-auto hidden dark:block" />
                        </a>
                        <h1 class="text-xl font-bold text-warning text-center mb-2">
                            Email Verification Required
                        </h1>
                    </div>
                    <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-8">
                        <form id="resendemail" autocomplete="off" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-brand-navy dark:text-brand-sun mb-2">
                                    We sent an email to your email address.<br>
                                    Please check your inbox to complete this process.<br><br>
                                    Please also check your spam folder.
                                </label>
                            </div>
                            <div class="border-dashed border-b border-gray-300 dark:border-brand-navy my-3"></div>
                            <div class="flex flex-col items-center mt-4">
                                <span class="text-sm text-brand-navy dark:text-brand-light">
                                    <a href="/" data-nav class="text-brand-sun hover:underline">Home</a>
                                    <span class="mx-1 text-gray-400">|</span>
                                    Already have an account?
                                    <a href="/login" data-nav class="text-brand-sun hover:underline ml-1">Login</a>
                                </span>
                            </div>
                            <div id="overlay"></div>
                            <div id="workings" style="margin-top:10px"></div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
        `,
        pageEvents
    };
};

export default authenticationView;