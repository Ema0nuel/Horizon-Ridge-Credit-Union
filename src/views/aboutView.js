import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const goals = [
  {
    title: "Buying a home",
    img: "https://westcoastsgroup.com/siteassets/personal/homeloans/_promotiles/categorytiles-homeloans.jpg",
    details: "Whether you’re a first home buyer or looking to upgrade, we offer flexible home loan solutions, expert advice, and support every step of the way.",
    link: "/personal-home-loans"
  },
  {
    title: "Buying with credit",
    img: "https://westcoastsgroup.com/siteassets/personal/creditcards/_promotiles/categorytile-creditcards.jpg",
    details: "Our credit card options are designed to suit your lifestyle, with competitive rates, rewards, and security for your everyday purchases.",
    link: "/personal-credit-cards"
  },
  {
    title: "Managing your money",
    img: "https://westcoastsgroup.com/siteassets/personal/transactionaccounts/_promotiles/categorytile-transactionaccounts.jpg",
    details: "From everyday accounts to budgeting tools, we help you stay in control of your finances with easy access and smart features.",
    link: "/transaction-accounts"
  },
  {
    title: "Saving for what's important",
    img: "https://westcoastsgroup.com/siteassets/personal/savingsaccounts/promotiles/categorytile-savingsaccounts.jpg",
    details: "Reach your savings goals faster with our range of high-interest savings accounts and flexible deposit options.",
    link: "/savings-accounts"
  },
  {
    title: "Protecting what you love",
    img: "https://westcoastsgroup.com/siteassets/personal/insurance/_promotiles/personal-insurance-category-tile.jpg",
    details: "Safeguard your family, home, and valuables with our comprehensive insurance products tailored to your needs.",
    link: "/personal-insurance"
  }
];

const featureTiles = [
  {
    title: "Solutions that fit everyone",
    subtitle: "Accessibility & inclusion",
    img: "https://westcoastsgroup.com/globalassets/globalresources/aboutus/accessibilityinclusion/highlightimagetile-accessibility.jpg",
    text: "We value all abilities and capabilities. So, we want our products, services and workplace to be accessible to all people.",
    details: "Our commitment to accessibility means we continually improve our services and facilities to ensure everyone can bank with confidence, regardless of ability.",
  },
  {
    title: "Understand our decisions",
    subtitle: "Environment, social & governance",
    img: "https://westcoastsgroup.com/globalassets/globalresources/esg/headerbanner-bablesg.jpg",
    text: "Horizon Ridge Credit Union and Adelaide Bank's ESG reflects our responsibility to customers, shareholders and the communities in which we are part of.",
    details: "We integrate ESG principles into our business, striving for positive environmental impact, social responsibility, and strong governance.",
  },
  {
    title: "Join our team",
    subtitle: "Careers at Horizon Ridge Credit Union and Adelaide Bank",
    img: "https://westcoastsgroup.com/globalassets/globalresources/aboutus/careers/highlightimagetile-careers.jpg",
    text: "Horizon Ridge Credit Union and Adelaide Bank is the bank you can be proud to work at. We're big enough to offer you every opportunity, but not so big that we lose the community feel that we're famous for.",
    details: "Explore rewarding career opportunities and become part of a team that values growth, diversity, and making a difference.",
  },
  {
    title: "Your money is protected",
    subtitle: "Financial Claims Scheme",
    img: "https://westcoastsgroup.com/globalassets/globalresources/financialclaimsscheme/highlightimagetile-fcs.jpg",
    text: "The Financial Claims Scheme (FCS) is an Australian Government scheme that provides protection and quick access to deposits in banks, building societies and credit unions in the unlikely event that one of these financial institutions fails.",
    details: "With the FCS, your deposits are protected up to the government guarantee limit, giving you peace of mind.",
  },
  {
    title: "We have high standards",
    subtitle: "Codes of Practice",
    img: "https://westcoastsgroup.com/siteassets/aboutus/codesofpractice/highlightimagetile-betterbigbank.jpg",
    text: "At Horizon Ridge Credit Union, we pride ourselves on our commitment to conduct business ethically and to the highest possible standard. In line with this commitment, Horizon Ridge Credit Union complies with a range of codes of practices.",
    details: "Our codes of practice ensure transparency, fairness, and integrity in all our dealings with customers and the community.",
  },
  {
    title: "How we’re performing",
    subtitle: "Horizon Ridge Credit Union and Adelaide Bank Investor Centre",
    img: "https://westcoastsgroup.com/globalassets/globalresources/investorcentre/highlightimagetile-investors.jpg",
    text: "Information on our securities, financial results, announcements, sustainability reporting and other disclosures.",
    details: "Stay informed about our financial performance, sustainability initiatives, and investor updates.",
  }
];

const aboutView = async () => {
  const nav = navbar()
  reset("About")

  function pageEvents() {
    nav.pageEvents()

    // Feature tile toggle
    document.querySelectorAll('.feature-tile-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-tile');
        const details = this.parentElement.querySelector('.feature-tile-details');
        if (details.classList.contains('hidden')) {
          details.classList.remove('hidden');
          this.querySelector('span').textContent = '-';
          this.querySelector('span + span').textContent = 'Hide details';
        } else {
          details.classList.add('hidden');
          this.querySelector('span').textContent = '+';
          this.querySelector('span + span').textContent = 'Show details';
        }
      });
    });
    // Goal tile toggle
    document.querySelectorAll('.goal-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-goal');
        const details = this.parentElement.parentElement.querySelector('.goal-details');
        if (details.classList.contains('hidden')) {
          details.classList.remove('hidden');
          this.querySelector('span').textContent = '-';
        } else {
          details.classList.add('hidden');
          this.querySelector('span').textContent = '+';
        }
      });
    });
  }
  return {
    html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/aboutus/headerbanner-desktop-aboutus.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/aboutus/headerbanner-mobile-aboutus.jpg');"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <img src="${NoLogo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 block dark:hidden" />
              <img src="${Logo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 hidden dark:block" />
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">The better big bank</h1>
              <p class="text-lg md:text-2xl text-white mb-6 max-w-2xl">When you’re a big bank, you have big responsibilities. The biggest of which is to do the right thing. It’s something we’ve always been good at.</p>
            </div>
          </div>
        </section>
        <!-- Proposition Banner -->
        <section class="bg-brand-sun/10 py-6">
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
        <!-- Highlight Section -->
        <section class="pt-8 pb-6">
          <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div class="flex-1">
              <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">Welcome to Horizon Ridge Credit Union</h2>
              <p class="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
                We're a credit union that's good with money but we're more interested in the good that money can do.<br><br>
                Since we first opened our doors, every decision we’ve made, every product we’ve created, every service we’ve provided, has been in the best interests of our members, partners and people.<br><br>
                Throughout this time, we have been innovative, competitive, and accessible. Providing you with everything you need to achieve your financial goals, while supporting the communities in which we live.
              </p>
            </div>
            <div class="flex-1 flex justify-center md:justify-end">
              <a href="/switch-now" class="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg">Try Horizon Ridge Credit Union</a>
            </div>
          </div>
        </section>
        <!-- Our Story -->
        <section class="bg-brand-sun/10 py-8">
          <div class="max-w-4xl mx-auto px-4">
            <h2 class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-4">A history of firsts</h2>
            <p class="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
              As one of the region's most trusted credit unions, we've delivered many firsts over the years.
            </p>
            <ul class="list-disc pl-6 text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
              <li>First to introduce green loans and home loan offset accounts.</li>
              <li>First globally to offer a digital home loan application in partnership with online fintechs.</li>
              <li>First to introduce Community Banking, returning profits to the people and communities that generate them.</li>
            </ul>
            <p class="text-base md:text-lg text-brand-gray dark:text-brand-light">
              As we continue to grow, we continue to innovate—investing in technology, accessibility, and service to create a better banking experience for you.
            </p>
          </div>
        </section>
        <!-- Feature Tiles -->
        <section class="py-10 bg-white dark:bg-brand-dark/90">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">Learn more about us</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${featureTiles.map((tile, i) => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group">
                  <div class="rounded-lg overflow-hidden mb-4">
                    <img src="${tile.img}" alt="${tile.title}" class="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${tile.title}</h3>
                  <div class="mb-2 text-brand-sun font-semibold">${tile.subtitle}</div>
                  <div class="mb-4 text-brand-gray dark:text-brand-light">${tile.text}</div>
                  <button class="flex items-center gap-2 mt-auto text-brand-sun hover:text-brand-navy font-semibold transition-all duration-200 focus:outline-none feature-tile-toggle" data-tile="${i}">
                    <span class="inline-block w-6 h-6 rounded-full border border-brand-sun items-center justify-center text-xl bg-white dark:bg-brand-dark">+</span>
                    <span>Show details</span>
                  </button>
                  <div class="feature-tile-details mt-3 hidden text-brand-gray dark:text-brand-light text-sm">${tile.details}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- What's your goal? -->
        <section class="py-10 bg-brand-sun/5">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">What's your goal?</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              ${goals.map((goal, i) => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group">
                  <div class="rounded-lg overflow-hidden mb-4">
                    <img src="${goal.img}" alt="${goal.title}" class="w-full h-40 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div class="flex items-center justify-between">
                    <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${goal.title}</h3>
                    <button class="goal-toggle flex items-center justify-center w-8 h-8 rounded-full border border-brand-sun text-brand-sun bg-white dark:bg-brand-dark hover:bg-brand-sun hover:text-white transition-all duration-200 focus:outline-none" data-goal="${i}">
                      <span class="text-xl font-bold">+</span>
                    </button>
                  </div>
                  <div class="goal-details mt-3 hidden text-brand-gray dark:text-brand-light text-sm">${goal.details}</div>
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

export default aboutView;