import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const quickLinks = [
    {
        title: "Grow your business with a loan",
        icon: "loan",
        href: "/#", // complicated page
    },
    {
        title: "Take and make payments",
        icon: "payments",
        href: "/#", // complicated page
    },
    {
        title: "Manage your business transactions",
        icon: "transactions",
        href: "/#", // complicated page
    },
    {
        title: "Purchase the equipment you need",
        icon: "equipment",
        href: "/#", // complicated page
    },
    {
        title: "Credit and debit cards for your business",
        icon: "cards",
        href: "/#", // complicated page
    },
    {
        title: "Protect against the unexpected",
        icon: "insurance",
        href: "/#", // complicated page
    },
];

const highlights = [
    {
        title: "Managing your cash flow",
        img: "https://westcoastsgroup.com/siteassets/business/business-landing-blocks-and-media/business-solutions/highlightsection-manageyourcashflow.jpg",
        desc: "Ensuring your day-to-day business details run smoothly, we offer a competitive range of transaction and savings accounts specifically designed to help you access your money and take care of business.",
    },
    {
        title: "Growing your business",
        img: "https://westcoastsgroup.com/siteassets/business/business-landing-blocks-and-media/business-solutions/highlightsection-growingyourbusiness.jpg",
        desc: "Big, small, established or new, if you need finance, we have a range of business and commercial loans to suit your unique needs.",
    },
    {
        title: "Trading with confidence",
        img: "https://westcoastsgroup.com/siteassets/business/business-landing-blocks-and-media/business-solutions/highlightsection-tradingwithcofidence.jpg",
        desc: "We offer a range of other financial solutions to allow your business to run smoothly so that you can focus on growing your business and better service your customers.",
    },
    {
        title: "Operating internationally",
        img: "https://westcoastsgroup.com/siteassets/business/business-landing-blocks-and-media/business-solutions/highlightsection-operateinternationally.jpg",
        desc: "We provide secure solutions and competitive rates that allows you to transfer funds or travel overseas with confidence.",
    },
    {
        title: "Building wealth",
        img: "https://westcoastsgroup.com/siteassets/business/business-landing-blocks-and-media/solutions.png",
        desc: "Super that's good for you and your employees. West Coast GroupSmartStart Super® is a low cost, easy to use superannuation solution designed to keep things simple for you and your employees.",
    },
    {
        title: "Protecting my assets",
        img: "https://westcoastsgroup.com/siteassets/business/insuremybusiness/smallbusinessinsurance/highlightsectiontilesmallbusinessinsurance.jpg",
        desc: "We offer a comprehensive range of commercial insurance solutions across business, farm and trade activities.",
    },
];

const profiles = [
    {
        title: "Tips on how you can better manage cash flow",
        img: "https://westcoastsgroup.com/siteassets/blog/business/how-to-manage-cash-flow/profileblockimage-manage-your-cashflow.jpg",
        desc: "What’s the number one issue keeping business owners up at night? Cash flow. Put simply, having money in the bank to cover your business expenses.",
        link: "/#",
        linkText: "Read more",
    },
    {
        title: "How to borrow to grow your business",
        img: "https://westcoastsgroup.com/siteassets/blog/business/how-to-borrow-to-grow-your-business/growyourbusiness.jpg",
        desc: "The thought of growing your business can be daunting. The good news is there are so many options available so you can tailor finance to suit you.",
        link: "/#",
        linkText: "Read more",
    },
    {
        title: "Economic update with David Robertson",
        img: "https://westcoastsgroup.com/siteassets/business/business-insights/image-profileblock-david_robertson.jpg",
        desc: "David Robertson, Head of Economic and Markets Research provides a monthly update on the economy and market. This overview summarizes the primary features of the global news and provides the latest news and views on our domestic economy and interest rates.",
        link: "/#",
        linkText: "View economic updates",
    },
];

const business = () => {
    const nav = navbar();
    reset("Business");

    function pageEvents() {
        nav.pageEvents();
    }

    return {
        html: `
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/business/headerbanner-businessawareness.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/business/mobilebanner-businessawareness.jpg');"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Your business matters</h1>
              <p class="text-lg md:text-2xl text-white dark:text-brand-sun mb-6 max-w-2xl">Everything you need to make business banking easy</p>
            </div>
          </div>
        </section>
        <!-- Proposition Banner -->
        <section class="bg-brand-sun/10 py-6">
          <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-percent text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">Competitive rates</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-layer-group text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">Wide product range</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-handshake text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">Banking made easy</span>
            </div>
          </div>
        </section>
        <!-- Breadcrumbs -->
        <section class="py-4">
          <div class="max-w-6xl mx-auto px-4">
            <nav class="text-sm" aria-label="Breadcrumb">
              <ol class="flex space-x-2 text-brand-navy dark:text-brand-sun">
                <li><a href="/" data-nav class="hover:underline">Home</a></li>
                <li>/</li>
                <li>Business</li>
              </ol>
            </nav>
          </div>
        </section>
        <!-- Quick Links -->
        <section class="py-6">
          <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              ${quickLinks.map(link => `
                <a href="${link.href}" class="flex flex-col items-center p-4 bg-white dark:bg-brand-dark rounded-lg shadow hover:bg-brand-sun/10 transition" data-nav>
                  <span class="mb-2 text-brand-sun text-3xl">
                    <i class="fa-solid ${{
                loan: "fa-sack-dollar",
                payments: "fa-credit-card",
                transactions: "fa-money-check-dollar",
                equipment: "fa-truck-ramp-box",
                cards: "fa-id-card",
                insurance: "fa-shield-halved"
            }[link.icon]}"></i>
                  </span>
                  <span class="text-center">${link.title}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Highlights -->
        <section class="py-10 bg-white dark:bg-brand-dark/90">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">What matters to you, matters to us</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${highlights.map(h => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 flex flex-col">
                  <div class="rounded-lg overflow-hidden mb-4">
                    <img src="${h.img}" alt="${h.title}" class="w-full h-40 object-cover object-center" />
                  </div>
                  <h4 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${h.title}</h4>
                  <div class="mb-2 text-brand-gray dark:text-brand-light">${h.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Section Header -->
        <section class="bg-brand-sun py-8">
          <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">Not sure which solution is right for you?</h2>
              <div class="text-white mb-4">We have a range of specialists who can work with you to tailor the right solution</div>
            </div>
            <div>
              <a href="/personal/enquiry" data-nav class="inline-block px-6 py-3 rounded-full bg-white text-brand-navy font-semibold shadow hover:bg-brand-sun hover:text-white transition-all duration-300">Make an enquiry</a>
            </div>
          </div>
        </section>
        <!-- Profile Cards -->
        <section class="bg-brand-sun/10 py-10">
          <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${profiles.map(profile => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 flex flex-col h-full">
                  <div class="rounded-lg overflow-hidden mb-4">
                    <img src="${profile.img}" alt="${profile.title}" class="w-full h-40 object-cover object-center" />
                  </div>
                  <div class="flex-1 flex flex-col">
                    <h4 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${profile.title}</h4>
                    <div class="mb-4 text-brand-gray dark:text-brand-light">${profile.desc}</div>
                  </div>
                  <div class="mt-auto">
                    <a href="${profile.link}" class="inline-block border-t pt-3 text-brand-sun hover:text-brand-navy font-semibold transition-all duration-200" data-nav>
                      ${profile.linkText}
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Disclaimer -->
        <section class="bg-brand-sun/10 py-10">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-xl font-bold mb-4">Things you should know</h2>
              <div id="disclaimer"></div>
            </div>
            <div>
              <p>Terms, conditions, fees, charges and lending criteria apply. Individual circumstances may vary. You should consult your taxation advisor and read the relevant Terms and Conditions available at horizon ridge credit union before making a decision. Rates are subject to change.</p>
              <p>^ Awards are based on information collected from the DBM Atlas research program – feedback from over 80,000 businesses and/or retail customers January 2021 through December 2021.</p>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents,
    };
};

export default business;