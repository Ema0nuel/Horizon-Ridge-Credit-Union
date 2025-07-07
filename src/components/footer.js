import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const footer = () => {
  return {
    /* html*/
    html: `
      <footer class="w-full bg-brand-light dark:bg-brand-dark border-t border-brand-gray dark:border-brand-navy mt-8" style="font-family: 'DM Sans', 'Roboto', sans-serif; font-size: 0.95rem;">
        <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src="${NoLogo}" alt="Horizon Ridge Credit Union logo" class="h-10 mb-2 block dark:hidden" />
            <img src="${Logo}" alt="Horizon Ridge Credit Union logo" class="h-10 mb-2 hidden dark:block" />
            <div class="font-bold text-brand-navy dark:text-brand-sun text-base mb-2">Horizon Ridge Credit Union</div>
            <p class="text-brand-gray dark:text-brand-light text-xs">Empowering your financial future.</p>
            <br />
            <p class="text-brand-gray dark:text-brand-light text-xs"><strong>Email: </strong>horizonridgecreditunion@gmail.com</p>
            <br />
            <p class="text-brand-gray dark:text-brand-light text-xs"><strong>Contact: </strong>: +1 (502) 209-5647</p>
          </div>
          <div>
            <div class="font-semibold text-brand-navy dark:text-brand-sun mb-2">Quick links</div>
            <ul class="space-y-1">
              <li><a href="/contact-us" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Contact us</a></li>
              <li><a href="/locate" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Locate a branch, ATM or Agency</a></li>
              <li><a href="/switch" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Switch your banking to us</a></li>
            </ul>
          </div>
          <div>
            <div class="font-semibold text-brand-navy dark:text-brand-sun mb-2">About us</div>
            <ul class="space-y-1">
              <li><a href="/about" data-nav class="hover:underline text-brand-gray dark:text-brand-light">About Horizon Ridge</a></li>
              <li><a href="/community" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Community</a></li>
              <li><a href="/accessibility" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Accessibility & Inclusion</a></li>
            </ul>
          </div>
          <div>
            <div class="font-semibold text-brand-navy dark:text-brand-sun mb-2">Help & support</div>
            <ul class="space-y-1">
              <li><a href="/financial-abuse" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Financial abuse</a></li>
              <li><a href="/financial-difficulty" data-nav class="hover:underline text-brand-gray dark:text-brand-light">Financial difficulty assistance</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 py-4 border-t border-brand-gray dark:border-brand-navy text-xs text-brand-gray dark:text-brand-light flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            &copy; 2025 Horizon Ridge Credit Union. All rights reserved.
          </div>
          <div class="flex flex-wrap gap-2">
            <a href="/terms" data-nav class="hover:underline">Terms of use</a>
            <a href="/important-info" data-nav class="hover:underline">Important information</a>
            <a href="/privacy" data-nav class="hover:underline">Privacy</a>
            <a href="/security" data-nav class="hover:underline">Security</a>
            <a href="/target-market" data-nav class="hover:underline">Target Market Determinations</a>
          </div>
        </div>
      </footer>
    `
  };
};

export default footer;
