import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const support = () => {
    const nav = navbar();
    reset("Support");

    function pageEvents() {
        nav.pageEvents();
    }

    return {
        html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/support/headerbanner-support.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/support/mobilebanner-support.jpg');"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Support centre</h1>
              <p class="text-lg text-white dark:text-brand-sun mb-4">Providing help and support when you need it.</p>
            </div>
          </div>
        </section>
        <!-- Quick Tiles -->
        <section class="py-6 bg-white dark:bg-brand-dark/90">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <a href="/user/login" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span class="mb-2"><i class="fa-solid fa-link text-2xl text-brand-sun"></i></span>
              <span class="font-semibold text-brand-navy dark:text-brand-sun">Popular links</span>
            </a>
            <a href="/user/login" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span class="mb-2"><i class="fa-solid fa-laptop text-2xl text-brand-sun"></i></span>
              <span class="font-semibold text-brand-navy dark:text-brand-sun">e-banking help</span>
            </a>
            <a href="/user/login" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span class="mb-2"><i class="fa-solid fa-hands-holding-heart text-2xl text-brand-sun"></i></span>
              <span class="font-semibold text-brand-navy dark:text-brand-sun">We're here for you</span>
            </a>
            <a href="/user/login" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span class="mb-2"><i class="fa-solid fa-gear text-2xl text-brand-sun"></i></span>
              <span class="font-semibold text-brand-navy dark:text-brand-sun">Manage your banking</span>
            </a>
            <a href="/user/login" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
              <span class="mb-2"><i class="fa-solid fa-ellipsis text-2xl text-brand-sun"></i></span>
              <span class="font-semibold text-brand-navy dark:text-brand-sun">Other support topics</span>
            </a>
          </div>
        </section>
        <div id="popularlinks"></div>
        <!-- Popular Links -->
        <section class="py-8" id="popularlinks">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">Popular links</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <a href="/user/login" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-id-card text-brand-sun text-2xl mr-4"></i>
                <span>Find my e-banking Access ID</span>
              </a>
              <a href="/user/login" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-key text-brand-sun text-2xl mr-4"></i>
                <span>Reset my e-banking password</span>
              </a>
              <a href="/user/login" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-envelope text-brand-sun text-2xl mr-4"></i>
                <span>Update my postal address</span>
              </a>
              <a href="/user/login" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-credit-card text-brand-sun text-2xl mr-4"></i>
                <span>Report a lost or stolen card</span>
              </a>
            </div>
          </div>
        </section>
        <!-- Scam Spotlight -->
        <section class="py-8 bg-brand-coral/10">
          <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 class="text-xl md:text-2xl font-bold text-brand-navy dark:text-brand-sun">Scams are on the rise so it's never been more important to know how to spot a scam.</h3>
            <a href="/user/login" data-nav class="btn px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg" aria-label="Learn how to spot a scam">Learn how to spot a scam</a>
          </div>
        </section>
        <div id="ebanking"></div>
        <!-- e-banking Support -->
        <section class="py-8" id="ebanking">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">e-banking support</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 shadow">
                <h3 class="text-xl font-bold mb-2">Getting started</h3>
                <p class="mb-2">Everything you need to know when getting started.</p>
                <ul>
                  <li><a href="/user/login" data-nav class="text-brand-sun underline">Accessing e-banking</a></li>
                </ul>
              </div>
              <div class="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 shadow">
                <h3 class="text-xl font-bold mb-2">Managing my accounts</h3>
                <p class="mb-2">Tips on managing your accounts to get the most out of e-banking.</p>
                <ul>
                  <li><a href="/user/login" data-nav class="text-brand-sun underline">Account management</a></li>
                  <li><a href="/user/login" data-nav class="text-brand-sun underline">e-statements</a></li>
                </ul>
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4 mt-8 justify-center">
              <a href="/user/login" data-nav class="btn btn-outline-primary px-6 py-3 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition">e-banking troubleshooting</a>
              <a href="/user/login" data-nav class="btn btn-outline-secondary px-6 py-3 rounded-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition">e-banking feedback</a>
            </div>
          </div>
        </section>
        <div id="support"></div>
        <!-- We're Here For You -->
        <section class="py-8 bg-brand-grape/10" id="support">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">We're here for you</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <a href="/about" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i class="fa-solid fa-hands-holding-heart text-brand-sun text-2xl mb-2"></i>
                <span class="font-semibold text-brand-navy dark:text-brand-sun text-center">Vulnerable customers</span>
              </a>
              <a href="/about" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i class="fa-solid fa-hand-holding-dollar text-brand-sun text-2xl mb-2"></i>
                <span class="font-semibold text-brand-navy dark:text-brand-sun text-center">Financial difficulty assistance</span>
              </a>
              <a href="/about" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i class="fa-solid fa-cloud-bolt text-brand-sun text-2xl mb-2"></i>
                <span class="font-semibold text-brand-navy dark:text-brand-sun text-center">Natural disaster assistance</span>
              </a>
              <a href="/about" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i class="fa-solid fa-user-shield text-brand-sun text-2xl mb-2"></i>
                <span class="font-semibold text-brand-navy dark:text-brand-sun text-center">Financial abuse</span>
              </a>
              <a href="/about" data-nav class="flex flex-col items-center p-4 rounded-xl border border-brand-sun/20 bg-white dark:bg-brand-dark shadow hover:shadow-lg transition">
                <i class="fa-solid fa-virus-covid text-brand-sun text-2xl mb-2"></i>
                <span class="font-semibold text-brand-navy dark:text-brand-sun text-center">COVID-19 hub</span>
              </a>
            </div>
          </div>
        </section>
        <div id="manage"></div>
        <!-- Manage Your Banking -->
        <section class="py-8" id="manage">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">Manage your banking</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl shadow">
                <img src="https://westcoastsgroup.com/siteassets/personal/_promotiles/highlightsection-personal.jpg" alt="" class="w-full h-40 object-cover rounded-t-xl" loading="lazy" />
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-2">Products</h3>
                  <p class="mb-2">Helping you to manage your products.</p>
                  <ul>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">Home loans</a></li>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">Credit and debit cards</a></li>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">Business cards</a></li>
                  </ul>
                </div>
              </div>
              <div class="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl shadow">
                <img src="https://westcoastsgroup.com/siteassets/security/_promotiles/highlightsection-security.jpg" alt="" class="w-full h-40 object-cover rounded-t-xl" loading="lazy" />
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-2">Security</h3>
                  <p class="mb-2">Keeping you and your family safe.</p>
                  <ul>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">Scam alerts</a></li>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">Identity theft</a></li>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">General security</a></li>
                  </ul>
                </div>
              </div>
              <div class="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl shadow">
                <img src="https://westcoastsgroup.com/siteassets/waystobank/_promotiles/highlightsection-waystobank.jpg" alt="" class="w-full h-40 object-cover rounded-t-xl" loading="lazy" />
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-2">Ways to bank</h3>
                  <p class="mb-2">Supporting you to bank the way you want.</p>
                  <ul>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">Internet banking</a></li>
                    <li><a href="/user/login" data-nav class="text-brand-sun underline">All ways to bank</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Contact Us Spotlight -->
        <section class="py-8 bg-brand-sun/10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-6">Contact us</h2>
            <div class="flex flex-col md:flex-row gap-4">
              <a href="/contact" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-envelope-open-text text-brand-sun text-2xl mr-4"></i>
                <span class="font-semibold">Online</span>
              </a>
              <a href="/locate-us" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-location-dot text-brand-sun text-2xl mr-4"></i>
                <span class="font-semibold">Find a branch</span>
              </a>
              <a href="tel:1300236344" data-nav class="flex items-center p-4 border rounded-lg bg-white dark:bg-brand-dark border-brand-sun/20 hover:shadow transition">
                <i class="fa-solid fa-phone text-brand-sun text-2xl mr-4"></i>
                <span class="font-semibold">Call us</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents
    };
};

export default support;