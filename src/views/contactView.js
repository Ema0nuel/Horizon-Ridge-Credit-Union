import navbar from '../components/navbar';
import footer from '../components/footer';
import { showToast } from '../components/toast';
import { reset } from '../utils/reset';

const EMAIL = "horizonridgecreditunion@gmail.com";
const PHONE = "+15022095647";

const contactView = () => {
  reset("Contact Us")
  function pageEvents() {
    // Navigation events
    navbar().pageEvents?.();

    // Contact form submit
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        // Simple validation
        if (!data.name || !data.email || !data.message) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }
        // Simulate sending (replace with real API call)
        try {
          form.querySelector('button[type="submit"]').disabled = true;
          await new Promise(res => setTimeout(res, 1200));
          showToast('Your message has been sent!', 'success');
          form.reset();
        } catch {
          showToast('Failed to send message. Please try again.', 'error');
        } finally {
          form.querySelector('button[type="submit"]').disabled = false;
        }
      });
    }

    // Previous form submit (if present)
    const prevForm = document.getElementById('prevContactForm');
    if (prevForm) {
      prevForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Form submitted (demo only)', 'info');
        prevForm.reset();
      });
    }
  }

  return {
    html: `
      ${navbar().html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 bg-black/60 dark:bg-brand-navy/80"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Contact Horizon Ridge Credit Union Bank</h1>
              <p class="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">Choose the method that is most convenient for you.</p>
            </div>
          </div>
        </section>
        <section class="py-10">
          <div class="max-w-3xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-4">Contact Form</h2>
            <form id="contactForm" class="space-y-4 bg-white dark:bg-brand-dark rounded-lg shadow p-6">
              <div>
                <label class="block font-semibold mb-1" for="name">Name</label>
                <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="text" id="name" name="name" required>
              </div>
              <div>
                <label class="block font-semibold mb-1" for="email">Email</label>
                <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="email" id="email" name="email" required>
              </div>
              <div>
                <label class="block font-semibold mb-1" for="phone">Phone</label>
                <input class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" type="tel" id="phone" name="phone" placeholder="Optional">
              </div>
              <div>
                <label class="block font-semibold mb-1" for="message">Message</label>
                <textarea class="w-full px-3 py-2 rounded border border-brand-sun/30 focus:outline-none focus:ring-2 focus:ring-brand-sun" id="message" name="message" rows="4" required></textarea>
              </div>
              <button type="submit" class="px-6 py-2 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300">Send Message</button>
            </form>
            <div class="mt-8">
              <h3 class="text-xl font-bold mb-2">Other ways to contact us</h3>
              <p>Email: <a href="mailto:${EMAIL}" class="text-brand-sun hover:underline">${EMAIL}</a></p>
              <p>Phone: <a href="tel:${PHONE.replace(/[^+\d]/g, '')}" class="text-brand-sun hover:underline">${PHONE}</a></p>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
    pageEvents,
  };
};

export default contactView