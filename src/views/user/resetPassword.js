import navbar from '../../components/navbar';
import { reset } from '../../utils/reset';
import { showToast } from '../../components/toast';
import { startLogoSpinner, endLogoSpinner } from '../../utils/spinner';
import { supabase } from '../../utils/supabaseClient';
import NoLogo from "/src/images/logo-nobg.png";
import Logo from "/src/images/logo.jpg";

const resetPassword = () => {
    reset("Reset Password");
    const nav = navbar();

    function pageEvents() {
        nav.pageEvents?.();

        // Handle Supabase session from recovery link
        const handleSessionRecovery = async () => {
            try {
                const { data, error } = await supabase.auth.refreshSession();
                if (error) {
                    console.warn("Session recovery attempted:", error.message);
                }
            } catch (err) {
                console.warn("Could not recover session:", err);
            }
        };

        // Call on page load to process URL tokens
        handleSessionRecovery();

        const form = document.getElementById('reset-form');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const submitBtn = form?.querySelector('button[type="submit"]');
        const passwordStrengthDiv = document.getElementById('password-strength');
        const passwordRequirements = document.getElementById('password-requirements');

        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            const requirements = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*]/.test(password),
            };

            Object.values(requirements).forEach(met => {
                if (met) strength++;
            });

            const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
            const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'];

            if (passwordStrengthDiv) {
                passwordStrengthDiv.innerHTML = `<div class="text-sm font-medium ${strengthColors[strength]?.replace('bg-', 'text-')} py-2">${strengthText[strength]}</div>`;
            }

            // Update requirements
            if (passwordRequirements) {
                passwordRequirements.innerHTML = `
                    <div class="text-xs space-y-1 text-brand-gray dark:text-brand-light mt-2">
                        <div class="${requirements.length ? 'text-green-600' : 'text-red-600'}"><i class="fas fa-${requirements.length ? 'check' : 'times'}"></i> At least 8 characters</div>
                        <div class="${requirements.uppercase ? 'text-green-600' : 'text-red-600'}"><i class="fas fa-${requirements.uppercase ? 'check' : 'times'}"></i> Uppercase letter</div>
                        <div class="${requirements.lowercase ? 'text-green-600' : 'text-red-600'}"><i class="fas fa-${requirements.lowercase ? 'check' : 'times'}"></i> Lowercase letter</div>
                        <div class="${requirements.number ? 'text-green-600' : 'text-red-600'}"><i class="fas fa-${requirements.number ? 'check' : 'times'}"></i> Number</div>
                        <div class="${requirements.special ? 'text-green-600' : 'text-red-600'}"><i class="fas fa-${requirements.special ? 'check' : 'times'}"></i> Special character (!@#$%^&*)</div>
                    </div>
                `;
            }

            return strength >= 3; // Good or better
        }

        // Password validation and matching
        function validatePasswords() {
            const password = passwordInput?.value || '';
            const confirmPassword = confirmPasswordInput?.value || '';

            const isStrong = checkPasswordStrength(password);
            const isMatching = password && confirmPassword && password === confirmPassword;

            if (submitBtn) {
                submitBtn.disabled = !(isStrong && isMatching && password.length > 0);
            }

            if (confirmPasswordInput) {
                if (confirmPassword && password !== confirmPassword) {
                    confirmPasswordInput.style.borderColor = 'rgb(239, 68, 68)';
                } else {
                    confirmPasswordInput.style.borderColor = '';
                }
            }
        }

        // Input event listeners
        if (passwordInput) {
            passwordInput.addEventListener('input', validatePasswords);
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswords);
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!submitBtn || submitBtn.disabled) return;

                const password = passwordInput?.value.trim();

                if (!password) {
                    showToast("Please enter a password", "error");
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Updating...`;

                startLogoSpinner();
                try {
                    // Get current session to verify recovery token
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                    if (!session || sessionError) {
                        showToast("Session expired. Please request a new password reset link.", "error");
                        endLogoSpinner();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `Reset Password <i class="fas fa-key text-sm"></i>`;
                        return;
                    }

                    const { error } = await supabase.auth.updateUser({ password });
                    endLogoSpinner();

                    if (error) {
                        showToast(error.message || "Failed to reset password", "error");
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `Reset Password <i class="fas fa-key text-sm"></i>`;
                    } else {
                        showToast("Password reset successfully! Redirecting to login...", "success");
                        // Sign out to clear recovery session
                        await supabase.auth.signOut();
                        setTimeout(() => window.location.href = "/login", 2000);
                    }
                } catch (err) {
                    endLogoSpinner();
                    console.error("Password reset error:", err);
                    showToast("Unexpected error. Please try again.", "error");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `Reset Password <i class="fas fa-key text-sm"></i>`;
                }
            });
        }

        // Initial validation
        validatePasswords();
    }

    return {
        html: /* html */`
            <main class="main min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark transition-colors duration-300" id="top">
                <div id="nav-actions" class="flex items-center gap-2 ml-2 absolute top-4"></div>
                <div class="flex flex-1 items-center justify-center py-12 px-4">
                    <div class="w-full max-w-md space-y-8">
                        <div class="flex flex-col items-center mb-6">
                            <a href="/" data-nav class="flex items-center justify-center mb-4">
                                <img src="${NoLogo}" alt="Horizon Ridge logo" class="h-16 w-auto block dark:hidden" />
                                <img src="${Logo}" alt="Horizon Ridge logo" class="h-16 w-auto hidden dark:block" />
                            </a>
                            <h1 class="flex items-center gap-2 text-2xl font-bold text-brand-navy dark:text-brand-sun">
                                <i class="fa-solid fa-key"></i>
                                Reset Password
                            </h1>
                            <div class="text-sm text-brand-gray dark:text-brand-light mt-2">
                                Create a new secure password for your account
                            </div>
                        </div>
                        <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-8">
                            <form id="reset-form" autocomplete="off" class="space-y-6" novalidate>
                                <div>
                                    <label for="password" class="block text-sm font-medium text-brand-navy dark:text-brand-sun mb-1">New Password</label>
                                    <input class="block w-full rounded-lg border border-brand-gray dark:border-brand-navy bg-brand-light dark:bg-brand-dark px-4 py-3 text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun transition" type="password" name="password" id="password" placeholder="Enter new password" required>
                                    <div id="password-strength"></div>
                                    <div id="password-requirements"></div>
                                </div>
                                <div>
                                    <label for="confirm-password" class="block text-sm font-medium text-brand-navy dark:text-brand-sun mb-1">Confirm Password</label>
                                    <input class="block w-full rounded-lg border border-brand-gray dark:border-brand-navy bg-brand-light dark:bg-brand-dark px-4 py-3 text-brand-navy dark:text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-sun transition" type="password" name="confirm-password" id="confirm-password" placeholder="Confirm your password" required>
                                </div>
                                <button class="w-full py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 mt-2 flex items-center justify-center gap-2" type="submit" name="submit" disabled>
                                    Reset Password
                                    <i class="fas fa-key text-sm"></i>
                                </button>
                            </form>
                            <div class="mt-4 text-center">
                                <p class="text-sm text-brand-gray dark:text-brand-light">
                                    Remember your password?
                                    <a href="/login" data-nav class="text-brand-sun hover:underline">Back to Login</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `,
        pageEvents
    };
};

export default resetPassword;
