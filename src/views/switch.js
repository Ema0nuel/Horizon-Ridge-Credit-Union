import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const exploreTiles = [
  {
    title: "Owner occupied variable",
    subtitle: "Express Home Loan",
    description: "Combines fast online approval with a competitive interest rate and flexible terms.",
    rate: "4.97%",
    comparison: "5.12%",
    link: "/personal",
    eligibility: "/personal",
    img: "https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/campaign-panel-desktop.jpg"
  },
  {
    title: "Owner occupied variable",
    subtitle: "Complete Home Loan",
    description: "Get the flexibility you want, with the features and benefits you need.",
    rate: "5.44%",
    comparison: "5.67%",
    link: "/home",
    eligibility: "/personal/enquiry",
    img: "https://westcoastsgroup.com/siteassets/personal/homeloans/completehomeloan/categorytile---complete-home-loan.jpg"
  },
  {
    title: "Investment variable",
    subtitle: "Complete Home Loan",
    description: "Flexible terms for your investment property.",
    rate: "5.69%",
    comparison: "5.92%",
    link: "/",
    eligibility: "/personal/enquiry",
    img: "https://westcoastsgroup.com/siteassets/personal/homeloans/completehomeloan/categorytile---complete-home-loan.jpg"
  }
];

const categoryTiles = [
  {
    title: "Complete Home Loan",
    link: "/business",
    img: "https://westcoastsgroup.com/siteassets/personal/homeloans/completehomeloan/categorytile---complete-home-loan.jpg"
  },
  {
    title: "Express Home Loan",
    link: "/personal",
    img: "https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/categorytile-expresshl2021.jpg"
  },
  {
    title: "Home Insurance",
    link: "/personal",
    img: "https://westcoastsgroup.com/siteassets/personal/insurance/homeinsurance/promotiles/categorytile-homeinsurance.jpg"
  },
  {
    title: "Credit Cards",
    link: "/personal",
    img: "https://westcoastsgroup.com/siteassets/personal/creditcards/_promotiles/categorytile-creditcards.jpg"
  }
];

const numberedTiles = [
  {
    number: 1,
    text: "Speak to our lending specialists who'll be able to guide you through the process and discuss which home loan best suits your needs."
  },
  {
    number: 2,
    text: "Do you want to bring your everyday banking or credit cards with you? We can help you start this process."
  },
  {
    number: 3,
    text: "Once you've decided on the loan that best suits you we'll get to work and do all the heavy lifting for you."
  }
];


const SwitchPage = () => {
  const nav = navbar();
  reset("Switch");

  function pageEvents() {
    nav.pageEvents();
  }

  return {
    html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/switchnow/headerbanner-switchnow.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/switchnow/mobilebanner-switchnow.jpg');"></div>
          <div class="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <img src="${NoLogo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 block dark:hidden" />
              <img src="${Logo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 hidden dark:block" />
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Moving to Horizon Ridge Credit Union is easier than ever</h1>
              <p class="text-lg md:text-2xl text-white mb-6 max-w-2xl">Refinance with a bank you can feel better about and join 1.9 million Aussies already benefiting from our competitive rates and trusted services.</p>
            </div>
          </div>
        </section>
        <!-- Proposition Banner -->
        <section class="bg-brand-grape/10 py-6">
          <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-users text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">Caring for 1.9 million customers</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-hand-holding-dollar text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">$272 million reinvested back into local communities</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-house-chimney-user text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">Australia’s most satisfied home loan customers*</span>
            </div>
          </div>
        </section>
        <!-- Breadcrumbs -->
        <nav class="py-4 px-4 max-w-5xl mx-auto" aria-label="Breadcrumb">
          <ol class="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
            <li><a href="/" data-nav class="hover:underline">Home</a></li>
            <li>/</li>
            <li>Switch now</li>
          </ol>
        </nav>
        <!-- Campaign Panel -->
        <section class="py-8">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/campaign-panel-desktop.jpg" alt="Refinance Home Loan" class="rounded-xl shadow-lg w-full object-cover mb-6 md:mb-0" loading="lazy" />
            </div>
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">Refinance your home loan</h2>
              <div class="flex flex-col md:flex-row gap-4 mb-4">
                <div class="bg-white dark:bg-brand-dark rounded-xl p-4 flex-1 shadow">
                  <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-brand-navy dark:text-brand-sun">4.97%</span>
                    <span class="text-brand-navy dark:text-brand-sun">p.a.</span>
                  </div>
                  <div class="text-brand-gray dark:text-brand-light text-sm">Variable rate<sup>4</sup></div>
                </div>
                <div class="bg-white dark:bg-brand-dark rounded-xl p-4 flex-1 shadow">
                  <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-bold text-brand-navy dark:text-brand-sun">5.12%</span>
                    <span class="text-brand-navy dark:text-brand-sun">p.a.</span>
                  </div>
                  <div class="text-brand-gray dark:text-brand-light text-sm">Comparison rate<sup>1</sup></div>
                </div>
              </div>
              <ul class="mb-4 space-y-2">
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-sun"></i> Offset available on variable and fixed loans<sup>3</sup></li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-sun"></i> Access additional repayments using online redraw</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-sun"></i> Apply online - full online experience</li>
              </ul>
              <div class="flex flex-col md:flex-row gap-4">
                <a href="/personal" data-nav class="btn btn-primary px-6 py-3 rounded-full font-semibold shadow hover:bg-brand-navy hover:text-white transition">Learn more</a>
                <a href="/personal" data-nav class="btn btn-outline-primary px-6 py-3 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition">Check my eligibility</a>
              </div>
            </div>
          </div>
        </section>
        <!-- Two Column Content -->
        <section class="py-8 bg-brand-grape/10">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">Great reasons to refinance your home loan with Horizon Ridge Credit Union</h2>
              <p class="mb-4 text-brand-gray dark:text-brand-light">Our competitive rates, simplified home loan products, and personalized customer service. Just some of the reasons why our customers choose to bank with us. We're also one of Australia's most trusted brands.<sup>^</sup></p>
              <p class="mb-4 text-brand-gray dark:text-brand-light">See for yourself when you switch your home loan to Horizon Ridge Credit Union, the better big bank.</p>
              <a href="/personal/enquiry" data-nav class="btn btn-primary px-6 py-3 rounded-full font-semibold shadow hover:bg-brand-navy hover:text-white transition">Make an enquiry</a>
            </div>
            <div>
              <div class="bg-white dark:bg-brand-dark border rounded-xl shadow p-6">
                <h3 class="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Move other banking</h3>
                <p class="mb-4 text-brand-gray dark:text-brand-light">Also interested in moving your other banking to us? Learn how to easily switch your transaction account or personal loan today.</p>
                <div class="flex flex-col gap-2">
                  <a href="/user/login" data-nav class="btn btn-outline-primary px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition">Transaction account</a>
                  <a href="/user/login" data-nav class="btn btn-outline-secondary px-4 py-2 rounded-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition">Personal loan</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Explore Tiles -->
        <section class="py-10 bg-brand-grape/10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">Great loans for you</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${exploreTiles.map(tile => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group">
                  <div class="rounded-lg overflow-hidden mb-4">
                    <img src="${tile.img}" alt="${tile.title}" class="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${tile.title}</h3>
                  <div class="mb-2 text-brand-sun font-semibold">${tile.subtitle}</div>
                  <div class="mb-4 text-brand-gray dark:text-brand-light">${tile.description}</div>
                  <div class="flex flex-col gap-2 mb-4">
                    <div class="flex items-baseline gap-2">
                      <span class="text-2xl font-bold text-brand-navy dark:text-brand-sun">${tile.rate}</span>
                      <span class="text-brand-navy dark:text-brand-sun">p.a.</span>
                    </div>
                    <div class="text-brand-gray dark:text-brand-light text-sm">Comparison rate: <span class="font-semibold">${tile.comparison}</span> p.a.</div>
                  </div>
                  <div class="flex flex-col gap-2 mt-auto">
                    <a href="${tile.link}" data-nav class="btn btn-outline-primary px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition">Learn more</a>
                    <a href="${tile.eligibility}" data-nav class="btn btn-primary px-4 py-2 rounded-full font-semibold shadow hover:bg-brand-navy hover:text-white transition">Check my eligibility</a>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="text-center mt-8">
              <a href="/personal" data-nav class="btn btn-secondary px-6 py-3 rounded-full font-semibold shadow hover:bg-brand-navy hover:text-white transition">View all home loan rates</a>
            </div>
          </div>
        </section>
        <!-- Numbered Tiles: How to Switch -->
        <section class="py-10 bg-brand-grape/10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">Explore how to switch to Horizon Ridge Credit Union</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${numberedTiles.map(tile => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col items-center text-center">
                  <div class="w-12 h-12 flex items-center justify-center rounded-full bg-brand-sun text-white text-2xl font-bold mb-4">${tile.number}</div>
                  <div class="text-brand-navy dark:text-brand-sun font-semibold">${tile.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Category Tiles -->
        <section class="py-10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">You may also be interested in</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              ${categoryTiles.map(tile => `
                <a href="${tile.link}" data-nav class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 flex flex-col transition-all duration-300 hover:shadow-xl group">
                  <div class="rounded-t-xl overflow-hidden">
                    <img src="${tile.img}" alt="${tile.title}" class="w-full h-32 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div class="flex-1 flex flex-col justify-between p-4">
                    <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${tile.title}</h3>
                    <span class="inline-block mt-auto text-brand-sun font-semibold">Learn more <i class="fa-solid fa-arrow-right ml-1"></i></span>
                  </div>
                </a>
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

export default SwitchPage;