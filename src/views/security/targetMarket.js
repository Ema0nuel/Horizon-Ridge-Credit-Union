import navbar from '../../components/navbar';
import footer from '../../components/footer';
import { reset } from '../../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const targetMarketView = () => {
    const nav = navbar();
    reset("Target Market Determinations");

    function pageEvents() {
        nav.pageEvents();
    }

    return {
        html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/policies/privacypolicy/bannerpoliciescoffee.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/policies/privacypolicy/mobilebannerpoliciescoffee.jpg');"></div>
          <div class="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <img src="${NoLogo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 block dark:hidden" />
              <img src="${Logo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 hidden dark:block" />
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Target Market Determinations</h1>
              <p class="text-white text-lg">Horizon Ridge Credit Union<br>
                <a href="mailto:horizonridgecreditunion@gmail.com" data-nav class="underline">horizonridgecreditunion@gmail.com</a> &nbsp;|&nbsp; <a href="tel:+15022095647" data-nav class="underline">+1 502 209 5647</a>
              </p>
            </div>
          </div>
        </section>
        <!-- Breadcrumbs -->
        <nav class="py-4 px-4 max-w-5xl mx-auto" aria-label="Breadcrumb">
          <ol class="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
            <li><a href="/" data-nav class="hover:underline">Home</a></li>
            <li>/</li>
            <li><a href="/" data-nav class="hover:underline">Important information</a></li>
            <li>/</li>
            <li>Target Market Determinations</li>
          </ol>
        </nav>
        <!-- Main Content -->
        <section class="py-8">
          <div class="max-w-5xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-4">Delivering better customer outcomes</h2>
          </div>
        </section>
        <section class="pt-0 pb-8">
          <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <p>
                We are required to make Target Market Determinations available under the <em>Treasury Laws Amendment (Design and Distribution Obligations and Product Intervention Powers) Act (Cth) 2019</em>.
              </p>
              <p>
                This is to ensure that the right products end up in the hands of the right customer by focusing on our customers in the design and distribution of our financial products.
              </p>
              <h3 class="text-lg font-semibold mt-6 mb-2">What is a Target Market Determination (TMD)?</h3>
              <p>A TMD is a document which describes:</p>
              <ul class="list-disc pl-6 mb-4">
                <li>the persons for which the product has been designed,</li>
                <li>the conditions around the product’s distribution,</li>
                <li>when this TMD will be reviewed, and</li>
                <li>record keeping and reporting obligations of distributors.</li>
              </ul>
              <p>
                Please note a TMD is not intended to provide financial advice. When making a decision about a product always make sure you refer to the Terms and Conditions and any supplementary document(s). These will outline the relevant terms and conditions being provided under that product.
              </p>
            </div>
            <div class="flex-1 bg-brand-light dark:bg-brand-dark border rounded-xl p-6">
              <p>This page includes the Target Market Determinations for financial products issued and/or distributed by Horizon Ridge Credit Union.</p>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents
    };
};

export default targetMarketView;