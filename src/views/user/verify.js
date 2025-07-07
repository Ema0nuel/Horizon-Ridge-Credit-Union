import navbar from "../../components/navbar";
import { reset } from "../../utils/reset";
import { showToast } from "../../components/toast";
import { verifyOtp } from "./functions/otp";

const verifyView = async () => {
  reset("Verify Login");
  const nav = navbar();

  async function pageEvents() {
    nav.pageEvents?.();

    const form = document.getElementById("verifyotp");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const otp = form.otp.value.trim();
        const accessID = sessionStorage.getItem("lastAccessID") || ""; // Store this during login step 1
        if (otp.length !== 6) {
          showToast("OTP must be 6 digits.", "error");
          return;
        }
        try {
          await verifyOtp(accessID, otp);
          showToast("Login successful!", "success");
          window.location.href = "/dashboard";
        } catch (err) {
          showToast(err.message || "Invalid or expired OTP.", "error");
        }
        form.reset();
      });
    }

    const resendBtn = document.getElementById("resendBtn");
    if (resendBtn) {
      resendBtn.addEventListener("click", async () => {
        const accessID = sessionStorage.getItem("lastAccessID") || "";
        if (!accessID) {
          showToast("Please login again to resend OTP.", "error");
          return;
        }
        try {
          // Reuse loginAndSendOtp to resend OTP
          const { loginAndSendOtp } = await import("./functions/loginHandler");
          await loginAndSendOtp(accessID, ""); // Password not needed for resend if you adjust backend logic
          showToast("OTP resent to your email.", "info");
        } catch (err) {
          showToast("Could not resend OTP. Please try again.", "error");
        }
      });
    }
  }

  return {
    html: /*html*/ `
      <main id="top" class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-brand-dark transition-colors duration-300 px-4 py-12">
        <div id="nav-actions" class="absolute top-4 left-4"></div>
        <div class="max-w-md w-full space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-8">
          <div class="flex justify-center">
            <a href="/" data-nav class="block">
              <img src="/src/images/logo-nobg.png" alt="Horizon Ridge Credit Union" class="h-12 w-auto block dark:hidden" />
              <img src="/src/images/logo.jpg" alt="Horizon Ridge Credit Union" class="h-12 w-auto hidden dark:block" />
            </a>
          </div>
          <div class="text-center space-y-1">
            <h1 class="text-2xl font-bold flex items-center justify-center gap-2">
              <i class="fa fa-lock text-yellow-400"></i>
              Verify Login
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Kindly enter the One-Time Password sent to your email address.
            </p>
          </div>
          <form id="verifyotp" class="space-y-4">
            <input
              type="number"
              name="otp"
              id="otp"
              maxlength="6"
              minlength="6"
              placeholder="Enter OTP"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <a href="/" data-nav class="text-brand-teal underline">Home</a>
              &nbsp;|&nbsp; Didn’t receive OTP?
              <button type="button" id="resendBtn" class="text-brand-yellow underline ml-1">Resend OTP</button>
            </div>
            <button
              type="submit"
              id="login"
              name="login"
              class="w-full bg-brand-yellow hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition"
            >
              Log in
            </button>
            <div id="overlay" class="hidden"></div>
            <div id="spoke" class="mt-4"></div>
            <div id="speak" class="mt-4"></div>
          </form>
        </div>
      </main>
    `,
    pageEvents
  };
};

export default verifyView;