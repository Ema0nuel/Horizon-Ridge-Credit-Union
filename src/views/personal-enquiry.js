import navbar from '../components/navbar';
import footer from '../components/footer';
import { showToast } from '../components/toast';
import { reset } from '../utils/reset';

const personalEnquiry = () => {
  reset("Personal Enquiry")
  function pageEvents() {
    navbar().pageEvents?.();

    const form = document.getElementById('personalEnquiryForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        // Simple validation
        if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.postcode) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }
        try {
          form.querySelector('button[type="submit"]').disabled = true;
          await new Promise(res => setTimeout(res, 1200));
          showToast('Your enquiry has been submitted!', 'success');
          form.reset();
        } catch {
          showToast('Failed to submit. Please try again.', 'error');
        } finally {
          form.querySelector('button[type="submit"]').disabled = false;
        }
      });
    }
  }

  return {
    html: `
      ${navbar().html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 bg-black/60 dark:bg-brand-navy/40"></div>
          <div class="relative z-10 max-w-4xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Home Loan Enquiry</h1>
              <p class="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">Whether you're looking to buy or refinance, we'll be able to assist you in your home buying journey.</p>
            </div>
          </div>
        </section>
        <!-- Breadcrumbs -->
        <nav class="bg-brand-sun/10 py-3 px-4 text-sm" aria-label="Breadcrumb">
          <ol class="max-w-4xl mx-auto flex flex-wrap gap-2 text-brand-navy dark:text-brand-sun">
            <li><a href="/" data-nav class="hover:underline">Home</a></li>
            <li>/</li>
            <li><a href="/personal" data-nav class="hover:underline">Personal banking</a></li>
            <li>/</li>
            <li class="font-semibold">Home loan enquiry</li>
          </ol>
        </nav>
        <!-- Enquiry Form -->
        <section class="py-10">
          <div class="max-w-2xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-2">Home loan enquiry</h2>
            <aside class="mb-6 text-brand-gray dark:text-brand-light text-sm">For your security, we do not provide information of a personal or account-specific nature by email.</aside>
            <form id="personalEnquiryForm" class="space-y-4 bg-white dark:bg-brand-dark rounded-lg shadow p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold mb-1" for="firstName">First name</label>
                  <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="text" id="firstName" name="firstName" required placeholder="Your first name">
                </div>
                <div>
                  <label class="block font-semibold mb-1" for="lastName">Last name</label>
                  <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="text" id="lastName" name="lastName" required placeholder="Your last name">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold mb-1" for="phone">Phone number</label>
                  <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="tel" id="phone" name="phone" required placeholder="Example: 0400 123 456">
                </div>
                <div>
                  <label class="block font-semibold mb-1" for="email">Email address</label>
                  <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="email" id="email" name="email" required placeholder="Example: you@email.com">
                </div>
              </div>
              <div>
                <label class="block font-semibold mb-1" for="contactMethod">Preferred contact method</label>
                <div class="flex gap-6 mt-1">
                  <label class="inline-flex items-center">
                    <input type="radio" name="contactMethod" value="Phone" class="form-radio text-brand-sun" checked>
                    <span class="ml-2">Phone</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" name="contactMethod" value="Email" class="form-radio text-brand-sun">
                    <span class="ml-2">Email</span>
                  </label>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold mb-1" for="postcode">Postcode</label>
                  <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="text" id="postcode" name="postcode" required placeholder="Example: 3550" maxlength="4">
                </div>
                <div>
                  <label class="block font-semibold mb-1" for="helpWith">What can we help you with?</label>
                  <select id="helpWith" name="helpWith" class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun dark:text-brand-dark">
                  <option selected>Select option</option>
                    <option value="I've found my dream home, all I need is a loan">I've found my dream home, all I need is a loan</option>
                    <option value="I want to switch my loan over to Horizon Ridge Credit Union">I want to switch my loan over to Horizon Ridge Credit Union</option>
                    <option value="I'm actively house hunting">I'm actively house hunting</option>
                    <option value="I'd like to review my current loan and offset account">I'd like to review my current loan and offset account</option>
                    <option value="I'm just starting out and need some advice">I'm just starting out and need some advice</option>
                  </select>
                </div>
              </div>
              <div class="text-xs text-brand-gray dark:text-brand-light mt-2">
                We collect your personal information in order to respond to your enquiry and contact you; your personal information may be shared within the Group. This includes subsidiaries, related companies, agencies and franchises. To request access to your personal information, please contact your <a href="/locate" data-nav class="text-brand-sun hover:underline">nearest branch</a> or <a href="mailto:horizonridgecreditunion@gmail.com" class="text-brand-sun hover:underline">horizonridgecreditunion@gmail.com</a>. For more information, please read our <a href="/privacy" data-nav class="text-brand-sun hover:underline">Privacy Policy</a>.
              </div>
              <button type="submit" class="mt-4 px-6 py-2 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300">Submit</button>
            </form>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
    pageEvents,
  };
};

export default personalEnquiry;