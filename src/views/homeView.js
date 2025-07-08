import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const homeView = () => {
  reset("Home");
  const nav = navbar();

  function pageEvents() {
    nav.pageEvents();

    // Hero Banner Animation & Rotation
    const hero = document.getElementById('hero-highlight-title');
    const desc = document.getElementById('hero-highlight-desc');
    const img = document.getElementById('hero-highlight-img');
    const cta = document.getElementById('hero-highlight-cta');
    const imgWrap = document.getElementById('hero-highlight-img-wrap');
    let heroIndex = 0;
    const heroBanners = [
      {
        title: "Express Home Loan: Fast, Flexible, Yours.",
        desc: "Get approved in as little as 24 hours. Enjoy competitive rates, flexible repayments, and a dedicated team to guide you home.",
        img: "https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/headerbanner-express-hl.jpg",
        cta: "Apply Now",
        ctaLink: "/login"
      },
      {
        title: "Your Dream Home Awaits.",
        desc: "Unlock exclusive member rates and personalized support. Start your journey with Horizon Ridge Credit Union today.",
        img: "https://westcoastsgroup.com/siteassets/homepage/carousel/headerbanner-mostsatisfiedhlcusts.jpg",
        cta: "Start Now",
        ctaLink: "/signup"
      },
      {
        title: "Refinance & Save Big.",
        desc: "Switch your home loan and save with our low rates and zero application fees. See how much you could save in minutes.",
        img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
        cta: "See Savings",
        ctaLink: "/login"
      }
    ];
    function animateHeroBanner(next = true) {
      if (!hero || !desc || !img || !cta || !imgWrap) return;
      // Animate out
      hero.classList.add('opacity-0', '-translate-y-4');
      desc.classList.add('opacity-0', '-translate-y-4');
      img.classList.add('opacity-0', 'scale-95');
      imgWrap.classList.add('shadow-none');
      cta.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        // Change content
        heroIndex = next ? (heroIndex + 1) % heroBanners.length : (heroIndex - 1 + heroBanners.length) % heroBanners.length;
        const banner = heroBanners[heroIndex];
        hero.textContent = banner.title;
        desc.textContent = banner.desc;
        img.src = banner.img;
        cta.textContent = banner.cta;
        cta.href = banner.ctaLink;
        // Animate in
        hero.classList.remove('opacity-0', '-translate-y-4');
        desc.classList.remove('opacity-0', '-translate-y-4');
        img.classList.remove('opacity-0', 'scale-95');
        imgWrap.classList.remove('shadow-none');
        cta.classList.remove('opacity-0', 'scale-95');
      }, 500);
    }
    setInterval(() => animateHeroBanner(true), 7000);

    // Animate CTA and text for secondary hero (if present)
    const heroText = document.getElementById('hero-text');
    if (heroText) {
      heroText.classList.add('opacity-0', 'translate-y-8');
      setTimeout(() => {
        heroText.classList.remove('opacity-0', 'translate-y-8');
        heroText.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
    const cta2 = document.getElementById('hero-cta');
    if (cta2) {
      cta2.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        cta2.classList.remove('scale-95', 'opacity-0');
        cta2.classList.add('scale-100', 'opacity-100');
      }, 400);
    }

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Remove active from all
        tabBtns.forEach(b => b.classList.remove('active', 'bg-brand-sun', 'text-white'));
        tabPanes.forEach(pane => pane.classList.add('hidden'));
        // Add active to clicked
        this.classList.add('active', 'bg-brand-sun', 'text-white');
        const tab = this.getAttribute('data-tab');
        const pane = document.getElementById(tab);
        if (pane) pane.classList.remove('hidden');
      });
    });
    // Set default tab (products)
    if (tabBtns.length && tabPanes.length) {
      tabBtns[0].classList.add('active', 'bg-brand-sun', 'text-white');
      tabPanes[0].classList.remove('hidden');
    }
  }

  return {
    html: /* html */`
${nav.html}
<main id="mainContent" class="main homePage min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans text-sm" data-pg="HomePage">
  <!-- Animated Hero Section -->
  <section class="relative w-full bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12 transition-all duration-500 overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img src="/assets/logo.png" alt="Horizon Ridge Credit Union Logo" class="absolute left-1/2 top-1/2 w-96 max-w-full opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none transition-all duration-1000" id="hero-bg-logo" />
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Home Background" class="w-full h-full object-cover object-center opacity-40 md:opacity-60 transition-all duration-1000" id="hero-bg-img" />
      <div class="absolute inset-0 bg-gradient-to-r from-brand-sun/60 to-brand-navy/80"></div>
    </div>
    <div class="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
      <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h2 id="hero-highlight-title" class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg transition-all duration-700">Express Home Loan: Fast, Flexible, Yours.</h2>
        <p id="hero-highlight-desc" class="text-lg md:text-2xl text-white mb-6 max-w-xl transition-all duration-700">
          Get approved in as little as 24 hours. Enjoy competitive rates, flexible repayments, and a dedicated team to guide you home.
        </p>
        <a id="hero-highlight-cta" href="/express-home-loan" class="inline-block px-8 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy hover:scale-105 transition-all duration-300 text-lg">Apply Now</a>
      </div>
      <div class="flex-1 flex justify-center md:justify-end w-full">
        <div class="rounded-2xl shadow-2xl overflow-hidden border-4 border-brand-sun bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg transition-all duration-700 scale-100" id="hero-highlight-img-wrap">
          <img id="hero-highlight-img" src="https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/headerbanner-express-hl.jpg" alt="Express Home Loan" class="w-full h-64 md:h-96 object-cover object-center transition-all duration-700" />
        </div>
      </div>
    </div>
  </section>
  <style>
    @media (max-width: 768px) {
      #hero-bg-logo { width: 60vw; }
      #hero-highlight-title { font-size: 2rem; }
      #hero-highlight-desc { font-size: 1.1rem; }
      #hero-highlight-img { height: 180px; }
    }
  </style>
  <!-- Banner Carousel (secondary hero) -->
  <section class="relative w-full overflow-hidden">
    <div class="w-full h-[350px] md:h-[500px] flex items-center justify-center bg-gradient-to-r from-brand-sun/80 to-brand-navy/80 transition-all duration-500">
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        <div class="flex-1 text-center md:text-left">
          <h2 class="sr-only">Slideshow</h2>
          <p class="sr-only">The "Previous" button changes the content below the button and the "Next" button changes the content above. The numbered buttons also change the content above.</p>
          <h1 id="hero-text" class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg transition-all duration-500">A better home loan experience starts here.</h1>
          <p class="text-lg md:text-xl text-white mb-6 transition-all duration-500">Join the 1.9 million USA already benefiting from our competitive rates and trusted services.</p>
          <a id="hero-cta" href="/user/login" data-nav class="inline-block px-6 py-3 rounded-full bg-white text-brand-navy font-semibold shadow-lg hover:bg-brand-sun hover:text-white transition-all duration-300 scale-100 opacity-100">Switch today</a>
        </div>
        <div class="flex-1 hidden md:block">
          <img src="https://westcoastsgroup.com/siteassets/homepage/carousel/headerbanner-mostsatisfiedhlcusts.jpg" alt="Home Loan Banner" class="rounded-2xl shadow-xl w-full h-64 object-cover object-center transition-all duration-500" />
        </div>
      </div>
    </div>
  </section>
  <!-- Proposition Banner -->
  <section class="bg-brand-sun/10 py-6 transition-all duration-500">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
      <div class="flex items-center gap-4">
        <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
          <i class="fa-solid fa-circle-check text-brand-sun text-2xl"></i>
        </span>
        <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold transition-all duration-300">One of the United States biggest banks</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
          <i class="fa-solid fa-shield-halved text-brand-sun text-2xl"></i>
        </span>
        <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold transition-all duration-300">One of the United States most trusted brands</span>
      </div>
    </div>
  </section>
  <!-- Tabs Horizontal Block -->
  <section class="w-full bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12 transition-all duration-500">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <div class="flex-1">
          <ul class="flex flex-wrap gap-2 justify-center lg:justify-start">
            <li>
              <button class="tab-btn active flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300" data-tab="products">
                <i class="fa-solid fa-box-open"></i>
                <span>Products</span>
              </button>
            </li>
            <li>
              <button class="tab-btn flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300" data-tab="rates">
                <i class="fa-solid fa-percent"></i>
                <span>Interest rates</span>
              </button>
            </li>
            <li>
              <button class="tab-btn flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy text-white font-semibold shadow hover:bg-brand-sun transition-all duration-300" data-tab="tools">
                <i class="fa-solid fa-calculator"></i>
                <span>Calculators &amp; tools</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <!-- Products Tab -->
        <div class="tab-pane" id="products">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-house-chimney text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Loans</h3>
              </div>
              <ul class="space-y-1 text-brand-gray dark:text-brand-light text-base">
                <li><a href="#" class="hover:text-brand-sun transition">Home Loans</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Pre-qualify for a home loan</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Personal Loans</a></li>
              </ul>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-piggy-bank text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Accounts</h3>
              </div>
              <ul class="space-y-1 text-brand-gray dark:text-brand-light text-base">
                <li><a href="#" class="hover:text-brand-sun transition">Savings Accounts</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Transaction Accounts</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Term Deposits</a></li>
              </ul>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-chart-line text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Investing &amp; Super</h3>
              </div>
              <ul class="space-y-1 text-brand-gray dark:text-brand-light text-base">
                <li><a href="#" class="hover:text-brand-sun transition">Investing</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Superannuation and retirement</a></li>
              </ul>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-briefcase text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Business</h3>
              </div>
              <ul class="space-y-1 text-brand-gray dark:text-brand-light text-base">
                <li><a href="/business" class="hover:text-brand-sun transition">All business products</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Talk to a business specialist</a></li>
              </ul>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-user-shield text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Insurance</h3>
              </div>
              <ul class="space-y-1 text-brand-gray dark:text-brand-light text-base">
                <li><a href="#" class="hover:text-brand-sun transition">Personal Insurance</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Commercial Insurance</a></li>
                <li><a href="#" class="hover:text-brand-sun transition">Life Insurance</a></li>
              </ul>
            </div>
          </div>
          <div class="text-center mt-8">
            <a href="/finder" class="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow-lg hover:bg-brand-navy hover:scale-105 transition-all duration-300">View all products and services</a>
          </div>
        </div>
        <!-- Interest Rates Tab -->
        <div class="tab-pane hidden" id="rates">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <h4 class="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Complete Home Loan - variable</h4>
              <div class="text-brand-gray dark:text-brand-light mb-2">Home Loan</div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Get the flexibility you want, with the features and benefits you need.</div>
              <div class="text-brand-sun font-bold text-2xl mb-2">5.44% <span class="text-base">p.a.</span></div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Comparison rate: <span class="font-bold">5.67% p.a.</span></div>
              <a href="/home-loans-complete" class="mt-4 px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300">Learn more</a>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <h4 class="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">iStandard GroupReady Credit Card</h4>
              <div class="text-brand-gray dark:text-brand-light mb-2">Credit card</div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Enjoy $0 annual fee with platinum travel perks.</div>
              <div class="text-brand-sun font-bold text-2xl mb-2">19.99% <span class="text-base">p.a.</span></div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Annual fee: <span class="font-bold">$0</span></div>
              <a href="/credit-cards-ready" class="mt-4 px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300">Learn more</a>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <h4 class="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Secured Personal Loan</h4>
              <div class="text-brand-gray dark:text-brand-light mb-2">Personal Loan</div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Perfect for that new or used car you're after, or to refinance an existing car loan.</div>
              <div class="text-brand-sun font-bold text-2xl mb-2">7.79% <span class="text-base">p.a.</span></div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Comparison rate: <span class="font-bold">8.51% p.a.</span></div>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <h4 class="text-lg font-bold text-brand-navy dark:text-brand-sun mb-2">Special Offer</h4>
              <div class="text-brand-gray dark:text-brand-light mb-2">Term Deposit</div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Great rates so you can watch your money grow.</div>
              <div class="text-brand-sun font-bold text-2xl mb-2">3.75% <span class="text-base">p.a.</span></div>
              <div class="text-brand-gray dark:text-brand-light mb-2">Minimum deposit: <span class="font-bold">$5,000</span></div>
            </div>
          </div>
        </div>
        <!-- Calculators & Tools Tab -->
        <div class="tab-pane hidden" id="tools">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-clipboard-check text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Pre-qualify for a home loan</h3>
              </div>
              <a href="#" class="mt-2 px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300">Start now</a>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-calculator text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Check your borrowing power</h3>
              </div>
              <a href="#" class="mt-2 px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300">Calculate</a>
            </div>
            <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-start transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <i class="fa-solid fa-money-bill-trend-up text-brand-sun text-3xl"></i>
                <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun">Foreign exchange calculator</h3>
              </div>
              <a href="#" class="mt-2 px-4 py-2 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy transition-all duration-300">Try now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Product Highlight Image -->
  <section class="w-full bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12 transition-all duration-500">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
      <div class="flex-1 hidden md:block">
        <div class="rounded-2xl shadow-xl overflow-hidden border-4 border-brand-sun bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg transition-all duration-500">
          <img src="https://westcoastsgroup.com/siteassets/personal/homeloans/expresshomeloan/headerbanner-express-hl.jpg" alt="Express Home Loan" class="w-full h-64 md:h-96 object-cover object-center" />
        </div>
      </div>
    </div>
  </section>
  <!-- Testimonial Section -->
  <section class="bg-brand-sun/10 py-10">
    <div class="max-w-5xl mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">What our members say</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Testimonial" class="w-16 h-16 rounded-full mb-4 shadow">
          <p class="text-brand-gray dark:text-brand-light mb-3">“Switching to Horizon Ridge was the best decision for my family. The process was smooth and the rates are unbeatable.”</p>
          <span class="font-semibold text-brand-navy dark:text-brand-sun">James R.</span>
        </div>
        <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Testimonial" class="w-16 h-16 rounded-full mb-4 shadow">
          <p class="text-brand-gray dark:text-brand-light mb-3">“I love the online tools and how easy it is to manage my accounts. The support team is always helpful.”</p>
          <span class="font-semibold text-brand-navy dark:text-brand-sun">Maria S.</span>
        </div>
        <div class="bg-white dark:bg-brand-dark rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
          <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Testimonial" class="w-16 h-16 rounded-full mb-4 shadow">
          <p class="text-brand-gray dark:text-brand-light mb-3">“Great experience refinancing my home. The team explained everything and I saved a lot!”</p>
          <span class="font-semibold text-brand-navy dark:text-brand-sun">David L.</span>
        </div>
      </div>
    </div>
  </section>
  <!-- Blog/News Section -->
  <section class="bg-white dark:bg-brand-dark/90 py-12 px-4 md:px-12">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8 text-center">Latest from our blog</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark p-6 flex flex-col">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Blog" class="rounded-lg mb-4 h-40 object-cover object-center">
          <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">5 Tips for First-Time Home Buyers</h3>
          <p class="text-brand-gray dark:text-brand-light mb-4">Buying your first home? Here are five essential tips to help you get started and avoid common mistakes.</p>
          <span class="text-sm text-brand-sun font-semibold">July 2025</span>
        </div>
        <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark p-6 flex flex-col">
          <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt="Blog" class="rounded-lg mb-4 h-40 object-cover object-center">
          <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">How to Refinance and Save</h3>
          <p class="text-brand-gray dark:text-brand-light mb-4">Refinancing your home loan can save you thousands. Learn how to get the best deal and what to watch for.</p>
          <span class="text-sm text-brand-sun font-semibold">June 2025</span>
        </div>
        <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark p-6 flex flex-col">
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="Blog" class="rounded-lg mb-4 h-40 object-cover object-center">
          <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">Understanding Your Credit Score</h3>
          <p class="text-brand-gray dark:text-brand-light mb-4">Your credit score impacts your loan options. Discover how to improve your score and secure better rates.</p>
          <span class="text-sm text-brand-sun font-semibold">May 2025</span>
        </div>
      </div>
    </div>
  </section>
</main>
${footer().html}
        `,
    pageEvents
  };
};

export default homeView;