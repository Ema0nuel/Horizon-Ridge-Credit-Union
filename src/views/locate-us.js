import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const branches = [
  {
    name: "Horizon Ridge Credit Union",
    address: "36 Main Street<br>Box Hill VIC 3128",
    email: "horizonridgecreditunion@gmail.com"
  },
  {
    name: "ATM iStandard GroupMarketplace",
    address: "116 - 120 Mitchell Street<br>Horizon Ridge Credit Union 3550"
  }
];

const locateUs = async () => {
  const nav = navbar();
  reset("Locate Us");

  function pageEvents() {
    nav.pageEvents();
    // No additional JS needed for static Google Map
  }

  return {
    html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main branchListing bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="branchListing">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center">
          <!-- Overlay for darkening the background image -->
          <div class="absolute inset-0 z-0 hidden md:block">
            <div class="w-full h-full bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/_sharedassets/bannerstileimages/betterbigbank/headerbanner-betterbigbank.jpg');"></div>
            <div class="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          </div>
          <div class="absolute inset-0 z-0 md:hidden">
            <div class="w-full h-full bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/_sharedassets/bannerstileimages/betterbigbank/mobilebanner-betterbigbank.jpg');"></div>
            <div class="absolute inset-0 bg-black/60 dark:bg-brand-navy/80"></div>
          </div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Locate a branch, agency or ATM</h1>
            </div>
          </div>
        </section>
        <!-- Branch Listing Block -->
        <section class="py-8">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Branch List -->
            <ul class="space-y-6">
              ${branches.map(branch => `
                <li class="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 shadow">
                  <h5 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${branch.name}</h5>
                  <p class="mb-2 text-brand-gray dark:text-brand-light">${branch.address}</p>
                  ${branch.email ? `<p class="text-sm"><span class="font-semibold">Email:</span> <a href="mailto:${branch.email}" class="text-brand-sun underline">${branch.email}</a></p>` : ''}
                </li>
              `).join('')}
            </ul>
            <!-- Google Map -->
            <div class="w-full h-96 rounded-xl overflow-hidden shadow border border-brand-sun/20 bg-white dark:bg-brand-dark">
              <iframe
                title="New York Street Map"
                width="100%"
                height="100%"
                style="border:0;"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.870759647729!2d-74.0060156845936!3d40.71277597933009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c6b7b2d%3A0x7b8b1b1b1b1b1b1b!2sNew%20York%20St%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1688570000000!5m2!1sen!2sus">
              </iframe>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
    pageEvents
  };
};

export default locateUs;