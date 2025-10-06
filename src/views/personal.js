import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const personal = () => {
  const nav = navbar();
  reset("Personal");

  function pageEvents() {
    nav.pageEvents();
    // Add any interactive JS here if needed in the future
  }

  return {
    html: `
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=600&fit=crop');"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-gray-500 mb-4 drop-shadow-lg">Personal loans</h1>
              <p class="text-lg md:text-2xl text-gray-500 mb-6 max-w-2xl">Bringing your plans to life.</p>
              <a href="/personal/enquiry" data-nav class="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg">Make an enquiry</a>
            </div>
          </div>
        </section>
        <!-- Quicklinks -->
        <section class="bg-brand-sun/10 py-8">
          <div class="max-w-6xl mx-auto px-4">
            <h4 class="text-xl font-bold text-brand-navy dark:text-brand-sun mb-6">Apply for your personal loan</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <a href="#" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-lock"></i></span>
                <span>Secured personal loan</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-unlock"></i></span>
                <span>Unsecured personal loan</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-leaf"></i></span>
                <span>Secured green personal loan</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-leaf"></i></span>
                <span>Unsecured green personal loan</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-user-graduate"></i></span>
                <span>Secured student personal loan</span>
              </a>
              <a href="#" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-user-graduate"></i></span>
                <span>Unsecured student personal loan</span>
              </a>
            </div>
          </div>
        </section>
        <!-- Product Highlights -->
        <section class="py-10 bg-white dark:bg-brand-dark/90">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">Our personal loans come with a range of benefits</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="border h-100 bg-white dark:bg-brand-dark rounded-xl shadow-lg flex flex-col items-stretch justify-between border-brand-sun/20 p-6">
                <div class="mb-4">
                  <span class="text-brand-sun text-4xl"><i class="fa-solid fa-sliders"></i></span>
                  <h5 class="mt-3 mb-2 text-black dark:text-brand-sun font-bold text-lg">Flexible options</h5>
                  <p>Choose from weekly, fortnightly or monthly repayments, secured or unsecured loans with terms up to 7 years.</p>
                </div>
              </div>
              <div class="border h-100 bg-white dark:bg-brand-dark rounded-xl shadow-lg flex flex-col items-stretch justify-between border-brand-sun/20 p-6">
                <div class="mb-4">
                  <span class="text-brand-sun text-4xl"><i class="fa-solid fa-arrows-up-down-left-right"></i></span>
                  <h5 class="mt-3 mb-2 text-black dark:text-brand-sun font-bold text-lg">Big or small</h5>
                  <p>Choose a loan size to suit your needs. Whether for a holiday, a car, a boat or something completely different, just ask us.</p>
                </div>
              </div>
              <div class="border h-100 bg-white dark:bg-brand-dark rounded-xl shadow-lg flex flex-col items-stretch justify-between border-brand-sun/20 p-6">
                <div class="mb-4">
                  <span class="text-brand-sun text-4xl"><i class="fa-solid fa-bolt"></i></span>
                  <h5 class="mt-3 mb-2 text-black dark:text-brand-sun font-bold text-lg">Quick response</h5>
                  <p>We know you want to hear about your application quickly. You will have a response from us within 48 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Secured Personal Loan Comparison -->
        <section class="bg-brand-sun/5 py-10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-2">Secured personal loan comparison</h2>
            <p class="mb-8 text-brand-navy dark:text-brand-light">A secured personal loan is a loan guaranteed by an asset, such as a car. Having security means we can offer a lower interest rate for the loan.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col">
                <h5 class="font-bold text-lg mb-2">Personal Loan</h5>
                <p class="mb-4">Whether it's for a car, a boat, a holiday or something completely different.</p>
                <div class="mb-2 text-brand-sun font-semibold">Rate: 7.79% p.a.</div>
                <div class="mb-2 text-brand-sun font-semibold">Comparison rate*: 8.51% p.a.</div>
              </div>
              <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col">
                <h5 class="font-bold text-lg mb-2">Green Personal Loan</h5>
                <p class="mb-4">This loan rewards you for your environmentally friendly purchases.</p>
                <div class="mb-2 text-brand-sun font-semibold">Rate: 4.99% p.a.</div>
                <div class="mb-2 text-brand-sun font-semibold">Comparison rate*: 5.35% p.a.</div>
              </div>
              <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col">
                <h5 class="font-bold text-lg mb-2">Student Personal Loan</h5>
                <p class="mb-4">A loan for all higher education students and apprentices.</p>
                <div class="mb-2 text-brand-sun font-semibold">Rate: 6.79% p.a.</div>
                <div class="mb-2 text-brand-sun font-semibold">Comparison rate*: 6.95% p.a.</div>
              </div>
            </div>
          </div>
        </section>
        <!-- Unsecured Personal Loan Comparison -->
        <section class="py-10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-2">Unsecured personal loan comparison</h2>
            <p class="mb-8 text-brand-navy dark:text-brand-light">An unsecured loan means that you don't need to provide any security.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col">
                <h5 class="font-bold text-lg mb-2">Personal Loan</h5>
                <p class="mb-4">Great for your dream holiday or any number of needs where you don’t offer security.</p>
                <div class="mb-2 text-brand-sun font-semibold">Rate: 12.79% p.a.</div>
                <div class="mb-2 text-brand-sun font-semibold">Comparison rate*: 14.89% p.a.</div>
              </div>
              <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col">
                <h5 class="font-bold text-lg mb-2">Green Personal Loan</h5>
                <p class="mb-4">Ideal for solar hot water, grey water treatment systems or energy saving white goods.</p>
                <div class="mb-2 text-brand-sun font-semibold">Rate: 6.99% p.a.</div>
                <div class="mb-2 text-brand-sun font-semibold">Comparison rate*: 8.01% p.a.</div>
              </div>
              <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col">
                <h5 class="font-bold text-lg mb-2">Student Personal Loan</h5>
                <p class="mb-4">A loan for your dream holiday or any number of needs where you don’t have security.</p>
                <div class="mb-2 text-brand-sun font-semibold">Rate: 9.99% p.a.</div>
                <div class="mb-2 text-brand-sun font-semibold">Comparison rate*: 9.99% p.a.</div>
              </div>
            </div>
          </div>
        </section>
        <!-- Calculators & Tools -->
        <section class="bg-brand-sun/10 py-10">
          <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-3">Calculators &amp; tools</h3>
              <p class="mb-4 text-brand-navy dark:text-brand-light">Use our tools and calculators to help compare and select the right personal loan for you.</p>
              <a href="/personal/enquiry" data-nav class="inline-block px-6 py-3 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun hover:text-white transition-all duration-300">Make an enquiry</a>
            </div>
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href="#" class="border h-100 text-decoration-none bg-white dark:bg-brand-dark border-brand-sun/20 rounded-lg p-4 flex flex-col items-center hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-calculator"></i></span>
                <span>Personal loan repayments calculator</span>
              </a>
              <a href="#" class="border h-100 text-decoration-none bg-white dark:bg-brand-dark border-brand-sun/20 rounded-lg p-4 flex flex-col items-center hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-percent"></i></span>
                <span>Personal loan interest rates</span>
              </a>
              <a href="#" class="border h-100 text-decoration-none bg-white dark:bg-brand-dark border-brand-sun/20 rounded-lg p-4 flex flex-col items-center hover:bg-brand-sun/10 transition">
                <span class="mb-2 text-brand-sun text-3xl"><i class="fa-solid fa-money-bill-trend-up"></i></span>
                <span>Check your borrowing power</span>
              </a>
            </div>
          </div>
        </section>
        <!-- How to apply & Accordion -->
        <section class="py-10">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-xl font-bold mb-4">How to apply for a loan</h2>
              <ul class="list-disc pl-6 mb-4">
                <li>Select the loan that is most suited to you</li>
                <li><a href="/login" class="text-brand-sun hover:underline">Apply online</a> or <a href="/contact" class="text-brand-sun hover:underline">contact us</a></li>
                <li>Send supporting documentation so that we can finalsize your application</li>
                <li>Receive a response to your application and you'll be one step closer to getting that new car, holiday, caravan, home improvements, whatever in no time at all.</li>
              </ul>
            </div>
            <div>
              <h2 class="text-xl font-bold mb-4">Personal loan pre application</h2>
              <div class="mb-2">
                <button class="accordion-toggle w-full text-left py-2 px-4 bg-brand-sun/10 rounded font-semibold mb-2" type="button" aria-expanded="false" aria-controls="accordion-content">Show details</button>
                <div id="accordion-content" class="hidden bg-white dark:bg-brand-dark rounded p-4 mt-2">
                  <p>Desperate for a holiday? Or to dive into an adventure? Driven to buy your next car? Or dreaming of a home makeover? Or home comforts? A Horizon Ridge Credit Union personal loan can make it happen. Applying online is quick and easy. Here's how it works. To be eligible, you need to be over 18, a US citizen or permanent resident, employed, or have a regular income, not bankrupt or in financial hardship. If you receive government benefits, it's best to call us.</p>
                  <p>You'll need identification, income and employment details, asset details, expenses, and details around any debts you have. Now you've got your info, it's time to apply. It's fast. Taking around 10 to 20 minutes to complete online. We'll call you as soon as possible to go over your application, so you can dive, drive and make your dream come true. Apply now.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Spotlight Panel -->
        <section class="bg-brand-sun/20 py-8">
          <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-2">Looking to switch your personal loan to Horizon Ridge Credit Union?</h3>
            </div>
            <div>
              <a href="/switch" class="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300">Switch now</a>
            </div>
          </div>
        </section>
        <!-- Insurance Banner -->
        <section class="relative w-full min-h-[220px] md:min-h-[330px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop');"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 class="text-2xl font-bold text-gray-500 mb-2">Car insurance</h3>
              <p class="text-gray-500 mb-4">Insurance is about protecting your future. Get cover for what you love today.</p>
              <a href="/personal-insurance" class="inline-block px-6 py-3 rounded-full bg-white text-brand-navy font-semibold shadow hover:bg-brand-sun hover:text-white transition-all duration-300">Learn more</a>
            </div>
          </div>
        </section>
        <!-- Disclaimers -->
        <section class="bg-brand-sun/10 py-8">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-xl font-bold mb-4">Things you should know</h2>
              <div id="disclaimer"></div>
            </div>
            <div>
              <p><a href="/disclosure-documents#PersonalLoans" class="text-brand-sun hover:underline">Terms and conditions, fees and charges</a> apply. All information including interest rate is subject to change without notice. Full details available on application. Lending criteria apply.</p>
              <p><sup>*</sup><strong>Important information about comparison rate:</strong> The comparison rates displayed are calculated for secured personal loans with a loan amount of $30,000 and a term of 5 years, for unsecured personal loans the loan amount is $10,000 with a term of 3 years.</p>
              <p><strong>WARNING:</strong> This comparison rate is true only for the examples given and may not include all fees and charges. Different terms, fees or other loan amounts might result in a different comparison rate.</p>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
    pageEvents
  };
};

export default personal;