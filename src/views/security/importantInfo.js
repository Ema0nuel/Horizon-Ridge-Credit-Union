import navbar from '../../components/navbar';
import footer from '../../components/footer';
import { reset } from '../../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

// FontAwesome icon classes for each tile
const infoTiles = [
    {
        title: "Codes of practice",
        icon: "fa-solid fa-scale-balanced",
        details: `
      <p>We comply with a range of codes of practices including:</p>
      <ul>
        <li>Banking Code of Practice</li>
        <li>Code of Operation for the Department of Human Services and the Department of Veterans' Affairs</li>
        <li>Family Law Guidelines</li>
        <li>ePayments Code</li>
      </ul>
    `,
        link: "/",
        linkText: "Learn more about our codes of practice"
    },
    {
        title: "Disclosure documents",
        icon: "fa-solid fa-file-lines",
        details: `
      <p>Access all Horizon Ridge Credit Union disclosure documents, including:</p>
      <ul>
        <li>Terms and conditions for products and services</li>
        <li>Product disclosure statements</li>
        <li>Privacy disclosure statement</li>
        <li>Electronic communication consent</li>
        <li>Financial services guide, and more.</li>
      </ul>
    `,
        link: "/",
        linkText: "View our disclosure documents"
    },
    {
        title: "Financial Claims Scheme (FCS)",
        icon: "fa-solid fa-shield-halved",
        details: `
      <p>An Australian Government scheme that provides protection and quick access to deposits in banks, building societies and credit unions in the unlikely event that one of these financial institutions fails.</p>
    `,
        link: "/",
        linkText: "Learn more about FCS"
    },
    {
        title: "Privacy",
        icon: "fa-solid fa-user-shield",
        details: `
      <p>Learn how we manage personal and credit related information through our:</p>
      <ul>
        <li>Horizon Ridge Credit Union Privacy Policy</li>
        <li>Credit Reporting Policy</li>
        <li>Credit Reporting Statement of Notifiable Matters</li>
        <li>Consumer Data Right</li>
      </ul>
    `,
        link: "/",
        linkText: "View our policies"
    },
    {
        title: "Target Market Determinations (TMD)",
        icon: "fa-solid fa-bullseye",
        details: `
      <p>Target Market Determinations for financial products distributed by Horizon Ridge Credit Union are to ensure that the right products end up in the hands of the right customer. We do this by focusing on our customers in the design and distribution of our financial products.</p>
    `,
        link: "/",
        linkText: "Learn more about TMDs"
    },
    {
        title: "Website terms of use",
        icon: "fa-solid fa-globe",
        details: `
      <p>The terms of use for the Horizon Ridge Credit Union website sets the rules for using our website with our rights in, and restrictions on your use of, the site, product and services information, third party content and jurisdiction.</p>
    `,
        link: "/",
        linkText: "Read our terms of use"
    }
];

const financialDifficultyView = () => {
    const nav = navbar();
    reset("Financial Difficulty");

    function pageEvents() {
        nav.pageEvents();
    }

    return {
        html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/policies/creditreportingpolicy/bannerpoliciesglasses.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/policies/creditreportingpolicy/mobilebannerpoliciesglasses.jpg');"></div>
          <div class="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <img src="${NoLogo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 block dark:hidden" />
              <img src="${Logo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 hidden dark:block" />
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Financial Difficulty</h1>
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
            <li>Financial Difficulty</li>
          </ol>
        </nav>
        <!-- Product Highlight Tiles -->
        <section class="py-10 bg-white dark:bg-brand-dark/90">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">Find information that may be important to you</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${infoTiles.map(tile => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group h-full">
                  <div class="rounded-lg overflow-hidden mb-4 flex justify-center">
                    <i class="${tile.icon} text-5xl text-brand-sun"></i>
                  </div>
                  <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${tile.title}</h3>
                  <div class="mb-4 text-brand-gray dark:text-brand-light">${tile.details}</div>
                  <a href="/" data-nav class="btn btn-outline-primary px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition mt-auto">${tile.linkText}</a>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents
    };
};

export default financialDifficultyView;