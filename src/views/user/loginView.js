import navbar from '../../components/navbar';
import { reset } from '../../utils/reset';
import { showToast } from '../../components/toast';
import { startLogoSpinner, endLogoSpinner } from '../../utils/spinner';
import { loginAndSendOtp } from './functions/loginHandler';
import { supabase } from '../../utils/supabaseClient';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const loginView = async () => {
  reset("Login");
  const nav = navbar();

  // Fetch session and user/account data
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    window.location.href = "/dashboard";
    return;
  }

  let otpStep = false;
  let lastAccessID = "";

  async function pageEvents() {
    nav.pageEvents?.();

    // Password show/hide toggle
    const pwdInput = document.getElementById('txt_pwd');
    const showHideBtn = document.getElementById('showHide');
    if (showHideBtn && pwdInput) {
      showHideBtn.addEventListener('click', function () {
        if (pwdInput.type === 'password') {
          pwdInput.type = 'text';
          showHideBtn.textContent = 'HIDE';
        } else {
          pwdInput.type = 'password';
          showHideBtn.textContent = 'SHOW';
        }
      });
    }

    // Login form submit (step 1: credentials, step 2: OTP)
    const form = document.getElementById('login-form');
    if (form) {
      form.noValidate = true; // We'll handle validation manually

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!otpStep) {
          // Step 1: Credentials
          const accessID = form.accessID.value.trim();
          const password = form.txt_pwd.value;
          if (!accessID || !password) {
            showToast("Please enter your Access ID and password.", "error");
            return;
          }
          startLogoSpinner();
          try {
            // Accepts email, username, or account number
            await loginAndSendOtp(accessID, password);
            showToast("OTP sent to your email.", "info");
            otpStep = true;
            lastAccessID = accessID;
            sessionStorage.setItem("lastAccessID", accessID);
            // Hide credentials, show OTP
            document.getElementById('login-credentials').classList.add('hidden');
            document.getElementById('login-otp').classList.remove('hidden');
            // Reset form validation state and focus OTP
            form.reset();
            setTimeout(() => {
              document.getElementById('otp')?.focus();
            }, 100);
          } catch (err) {
            showToast(err.message || "Login failed.", "error");
          } finally {
            endLogoSpinner();
          }
        } else {
          // Step 2: OTP
          const otpInput = document.getElementById('otp');
          const otp = otpInput.value.trim();
          if (otp.length !== 6) {
            showToast("OTP must be 6 digits.", "error");
            otpInput.focus();
            return;
          }
          startLogoSpinner();
          try {
            const { verifyOtp } = await import('./functions/otp');
            await verifyOtp(lastAccessID, otp);
            showToast("Login successful!", "success");
            window.location.href = '/dashboard';
          } catch (err) {
            showToast(err.message || "Invalid OTP.", "error");
            otpInput.focus();
          } finally {
            endLogoSpinner();
          }
        }
      });
    }

    // Resend OTP
    const resendBtn = document.getElementById('resend-otp');
    if (resendBtn) {
      resendBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!lastAccessID) {
          showToast("Please enter your Access ID and password first.", "error");
          return;
        }
        startLogoSpinner();
        try {
          // Accepts email, username, or account number for resend
          await loginAndSendOtp(lastAccessID, ""); // Password not needed for resend if you adjust backend logic
          showToast("OTP resent to your email.", "info");
        } catch (err) {
          showToast(err.message || "Could not resend OTP.", "error");
        } finally {
          endLogoSpinner();
        }
      });
    }
  }

  return {
    html: /* html */`
      <main class="main min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark transition-colors duration-300" id="top">
        <div id="nav-actions" class="flex items-center gap-2 ml-2 absolute top-4"></div>
        <div class="flex flex-1 items-center justify-center py-12 px-4">
          <div class="w-full max-w-md space-y-8">
            <div class="flex flex-col items-center mb-6">
              <a href="/" data-nav class="flex items-center justify-center mb-4">
                <img src="${NoLogo}" alt="Horizon Ridge Credit Union logo" class="h-16 w-auto block dark:hidden" />
                <img src="${Logo}" alt="Horizon Ridge Credit Union logo" class="h-16 w-auto hidden dark:block" />
              </a>
              <h1 class="flex items-center gap-2 text-2xl font-bold text-brand-navy dark:text-brand-sun">
                <i class="fa-solid fa-lock"></i>
                Log in
              </h1>
              <div class="text-sm text-brand-gray dark:text-brand-light mt-2">
                <span class="font-semibold">New User?</span>
                <a href="/register" data-nav class="text-brand-sun hover:underline ml-1">Create account</a>
              </div>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-8">
              <form id="login-form" autocomplete="off" class="space-y-6" novalidate>
                <div id="login-credentials">
                  <div>
                    <label for="accessID" class="block text-sm font-medium text-brand-navy dark:text-brand-sun mb-1">Access ID</label>
                    <input class="block w-full rounded-lg border border-brand-gray dark:border-brand-navy bg-brand-light dark:bg-brand-dark px-4 py-3 text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun transition" type="text" name="accessID" id="accessID" placeholder="Enter your Access ID (email, username, or account number)" required>
                  </div>
                  <div>
                    <label for="txt_pwd" class="block text-sm font-medium text-brand-navy dark:text-brand-sun mb-1">Password</label>
                    <div class="relative">
                      <input type="password" name="txt_pwd" id="txt_pwd" maxlength="16" minlength="8" class="block w-full rounded-lg border border-brand-gray dark:border-brand-navy bg-brand-light dark:bg-brand-dark px-4 py-3 text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun transition pr-16" placeholder="********" required>
                      <button type="button" id="showHide" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-sun hover:text-brand-navy focus:outline-none z-50">SHOW</button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 text-sm text-brand-navy dark:text-brand-light">
                      <input type="checkbox" class="rounded border-brand-gray dark:border-brand-navy focus:ring-brand-sun" id="rememberMe" checked>
                      Remember me
                    </label>
                    <a href="/forgot-password" data-nav class="text-sm text-brand-sun hover:underline">Forgot Password?</a>
                  </div>
                  <button class="w-full py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 mt-2" type="submit" name="login">Log in</button>
                </div>
                <div id="login-otp" class="hidden">
                  <div>
                    <label for="otp" class="block text-sm font-medium text-brand-navy dark:text-brand-sun mb-1">Enter OTP</label>
                    <input type="number" name="otp" id="otp" maxlength="6" minlength="6" inputmode="numeric" pattern="[0-9]*" class="block w-full rounded-lg border border-brand-gray dark:border-brand-navy bg-brand-light dark:bg-brand-dark px-4 py-3 text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun transition" placeholder="Enter 6-digit OTP" required>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <button type="button" id="resend-otp" class="text-sm text-brand-sun hover:underline">Resend OTP</button>
                  </div>
                  <button class="w-full py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 mt-4" type="submit" name="verify-otp">Verify OTP</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    `,
    pageEvents
  };
};

export default loginView;