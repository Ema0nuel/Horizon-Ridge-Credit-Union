import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const stats = [
  {
    icon: "fa-trophy",
    value: "$4.6m",
    desc: "towards sport & recreation"
  },
  {
    icon: "fa-building-columns",
    value: "$4.1m",
    desc: "towards facilities & infrastructure"
  },
  {
    icon: "fa-graduation-cap",
    value: "$3.6m",
    desc: "towards education & research"
  },
  {
    icon: "fa-heart-pulse",
    value: "$3m",
    desc: "towards health & wellbeing"
  },
  {
    icon: "fa-palette",
    value: "$2.9m",
    desc: "towards art, culture & heritage"
  },
  {
    icon: "fa-leaf",
    value: "$300k",
    desc: "towards environment & animal welfare"
  },
  {
    icon: "fa-truck-medical",
    value: "$600k",
    desc: "towards emergency services & support"
  }
];

const community = () => {
  const nav = navbar();
  reset("Community");

  function pageEvents() {
    nav.pageEvents();
  }

  return {
    html: `
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop');"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 class="text-3xl md:text-5xl font-extrabold text-white dark:text-brand-sun mb-4 drop-shadow-lg">Be part of the Horizon Ridge Credit Union community</h1>
              <div class="mb-6">
                <a href="/locate-us" class="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg">Find a branch</a>
              </div>
            </div>
          </div>
        </section>
        <!-- Proposition Banner -->
        <section class="bg-brand-sun/10 py-6">
          <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-hand-holding-dollar text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">$292 million reinvested back into local communities</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-store text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">Over 300 Community Bank branches</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow transition-all duration-300">
                <i class="fa-solid fa-building-columns text-brand-sun text-2xl"></i>
              </span>
              <span class="text-brand-navy dark:text-brand-sun text-lg font-semibold">One of Australia's biggest banks</span>
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
                <li>Community</li>
              </ol>
            </nav>
          </div>
        </section>
        <!-- Section Header -->
        <section class="py-8">
          <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-3">Every day our customers help change and save lives, simply by banking with us.</h2>
              <div class="text-brand-navy dark:text-brand-sun mb-4">Community banking is based on a 'profit-with-purpose' model, which means our profits are returned directly to the community that has generated them.</div>
            </div>
          </div>
        </section>
        <!-- Stats Block -->
        <section class="bg-brand-sun/10 py-10">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-xl md:text-2xl font-bold text-brand-navy dark:text-brand-sun mb-8">This year contributions included</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              ${stats.map(s => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 flex flex-col items-center p-6">
                  <span class="mb-2 text-brand-sun text-4xl">
                    <i class="fa-solid ${s.icon}"></i>
                  </span>
                  <div class="text-2xl font-bold text-brand-navy dark:text-brand-sun mb-2">${s.value}</div>
                  <div class="text-brand-gray dark:text-brand-light text-center">${s.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Banner Block -->
        <section class="relative w-full min-h-[220px] md:min-h-[320px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90 mt-10">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop');"></div>
          <div class="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h3 class="text-2xl md:text-3xl font-bold text-white dark:text-brand-sun mb-2">Switch to Horizon Ridge Credit Union</h3>
              <p class="text-white dark:text-brand-sun mb-4">Be part of something bigger. See below for more information about our in-person, phone, online or on the go services.</p>
              <a href="/switch-now" class="inline-block px-6 py-3 rounded-full bg-brand-sun text-white font-semibold shadow hover:bg-brand-navy hover:text-white transition-all duration-300 text-lg">Learn more</a>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
    pageEvents
  };
};

export default community;