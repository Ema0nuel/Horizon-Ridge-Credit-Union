import navbar from '../../components/navbar';
import footer from '../../components/footer';
import { reset } from '../../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const featureTiles = [
    {
        title: "Keeping your identity safe",
        img: "https://westcoastsgroup.com/siteassets/security/identitytheft/_promotiles/highlightimagetile-identitytheft.jpg",
        details: "Identity theft is a type of fraud that involves stealing money or gaining other benefits by pretending to be someone else. Learn how you can protect yourself.",
        link: "/",
        linkText: "Learn more about identity theft"
    },
    {
        title: "Protecting your business",
        img: "https://westcoastsgroup.com/siteassets/security/business/_promotiles/highlightimagetile-business.jpg",
        details: "Businesses can also be targeted by criminals. It's important business owners implement appropriate risk management practices and systems to adequately protect themselves and their customers.",
        link: "/",
        linkText: "Learn more about business security"
    },
    {
        title: "How to spot a scam",
        img: "https://westcoastsgroup.com/siteassets/security/scams/_promotiles/highlightimagetile-scams.jpg",
        details: "Learn about the scams that could impact you, then understand how to protect yourself.",
        link: "/",
        linkText: "Learn more about scams"
    }
];

// SVG icons for highlight tiles
const highlightIcons = [
    // General
    `<svg viewBox="0 0 1024 1024" class="w-12 h-12 mx-auto mb-2"><path fill="#002C41" d="M480 701.269v0 0c-18.643-6.589-32-24.369-32-45.269 0-26.51 21.49-48 48-48s48 21.49 48 48c0 20.9-13.357 38.679-32 45.269v83.019c0 8.42-7.163 15.712-16 15.712-8.578 0-16-7.035-16-15.712v-83.019zM448 720.006v63.941c0 26.539 21.306 48.054 48 48.054 26.51 0 48-21.478 48-48.054v-63.941c19.431-14.595 32-37.833 32-64.006 0-44.183-35.817-80-80-80s-80 35.817-80 80c0 26.173 12.569 49.411 32 64.006v0 0zM256 448v-112.025c0-132.561 107.452-239.976 240-239.976 132.279 0 240 107.441 240 239.976v112.025c53.093 0.152 96 43.21 96 96.303v319.393c0 53.531-43.107 96.303-96.281 96.303h-479.438c-53.222 0-96.281-43.116-96.281-96.303v-319.393c0-53.437 42.955-96.152 96-96.303v0 0zM288 448h32v-111.71c0-97.525 78.798-176.29 176-176.29 97.004 0 176 78.928 176 176.29v111.71h32v-112.21c0-114.759-93.359-207.79-208-207.79-114.875 0-208 93.061-208 207.79v112.21zM352 448h288v-111.973c0-79.544-64.633-144.027-144-144.027-79.529 0-144 64.296-144 144.027v111.973zM255.918 480c-35.301 0-63.918 28.706-63.918 64.187v319.625c0 35.45 28.51 64.187 63.918 64.187h480.165c35.301 0 63.918-28.706 63.918-64.187v-319.625c0-35.45-28.51-64.187-63.918-64.187h-480.165z"></path></svg>`,
    // Phone
    `<svg viewBox="0 0 1024 1024" class="w-12 h-12 mx-auto mb-2"><path fill="#002C41" d="M189.186 275.504l92.228-58.784 17.071 26.783-92.228 58.784-17.071-26.783z"></path><path fill="#002C41" d="M190.615 347.564l150.859-96.304 17.161 26.637-150.859 96.304z"></path><path fill="#002C41" d="M442.902 1023.999c-6.659 0-13.575-0.768-20.234-2.305l-348.59-77.35c-50.201-11.27-81.962-61.214-70.948-111.416l168.788-759.676c9.477-42.261 47.64-73.253 91.182-73.253 6.659 0 13.575 0.768 20.234 2.305l348.59 77.35c50.201 11.27 81.962 61.214 70.948 111.416l-169.043 759.932c-9.221 42.261-47.64 72.996-90.926 72.996 0 0 0 0 0 0z"></path></svg>`,
    // Online
    `<svg viewBox="0 0 1489 1489" class="w-12 h-12 mx-auto mb-2"><path fill="#002C41" d="M746.5,1116.4H557c-6.8,30.8-13.6,61.1-20.5,92.4h230.6C760.1,1177.6,753.5,1147.9,746.5,1116.4L746.5,1116.4z..."></path></svg>`,
    // Children
    `<svg viewBox="0 0 1024 1024" class="w-12 h-12 mx-auto mb-2"><path fill="#002C41" d="M532.48 175.104c0 49.767-40.345 90.112-90.112 90.112s-90.112-40.345-90.112-90.112c0-49.767 40.345-90.112 90.112-90.112s90.112 40.345 90.112 90.112z"></path></svg>`,
    // Cheque fraud
    `<svg viewBox="0 0 1024 1024" class="w-12 h-12 mx-auto mb-2"><path fill="#002C41" d="M84.337 991.229c0 9.831 3.277 18.024 9.831 24.579 3.277 3.277 11.47 8.192 19.662 8.192 3.277 0 6.554 0 11.47-3.277h1.639l231.037-90.12 3.277-3.277c1.639 0 3.277-1.639 6.554-4.916v0l142.555-181.88 86.843-108.145 339.181-439.134 1.639-1.639c0 0 0-1.639 0-1.639 0-3.277 1.639-4.916 1.639-8.192 0-8.192-4.916-16.386-11.47-19.662v0 0l-199.904-155.662c-11.47-9.831-29.494-8.192-40.963 3.277v0l-563.664 719.326c-1.639 1.639-3.277 4.916-3.277 6.554v0c0 0 0 0 0 0 0 1.639-1.639 3.277-1.639 4.916v1.639l-34.41 249.060c0 0 0 0 0 0z"></path></svg>`
];

const highlightTiles = [
    {
        title: "General",
        icon: highlightIcons[0],
        details: `
      <ul>
        <li>Keep your computer up to date by installing the latest security software and patches for your operating system</li>
        <li>Ensure you have installed anti-virus/spyware software along with a firewall – and keep them up to date</li>
        <li>Make sure you have a current backup of your important personal information/files</li>
        <li>Delete spam emails and do not open email attachments or click on links in emails from strangers</li>
        <li>Do not respond to an unsolicited email asking you for personal information or financial details</li>
        <li>Be aware of email, internet and telephone hoaxes and scams – if something appears too good to be true, it almost certainly is</li>
        <li>If possible avoid using shared computers, such as those at internet cafes, hotels and airports</li>
      </ul>
    `
    },
    {
        title: "Phone",
        icon: highlightIcons[1],
        details: `
      <ul>
        <li>Criminals use phones as the number one delivery method for scams</li>
        <li>Never allow anyone to access your computer/device remotely</li>
        <li>Never provide your 6-digit code from a security token to anyone over the phone</li>
        <li>Do not respond to unsolicited calls, SMS or email asking you for personal information or financial details</li>
        <li>Delete spam emails and do not open SMS or email attachments or click on links in SMS or emails from strangers</li>
        <li>Be aware of email, internet and telephone hoaxes and scams - if something appears too good to be true, it almost certainly is</li>
      </ul>
    `
    },
    {
        title: "Online",
        icon: highlightIcons[2],
        details: `
      <ul>
        <li>Don’t open suspicious texts, pop up windows or click on links or attachments in unsolicited emails – delete them</li>
        <li>Don’t enter or provide your card number to unsolicited sites or callers</li>
        <li>Don’t respond to phone calls about your computer asking for remote access – hang up</li>
        <li>Keep your personal details secure</li>
        <li>Choose your passwords carefully</li>
        <li>Review your privacy and security settings on social media</li>
        <li>Beware of any requests for your personal details or money</li>
        <li>If you think you have been a victim of a scam, you need to let us know as soon as possible by calling us or by attending your nearest branch</li>
      </ul>
    `
    },
    {
        title: "Protecting your children",
        icon: highlightIcons[3],
        details: `
      <p>Increasingly, children are being targeted online and can be vulnerable to aggressive behaviour and criminal activity.</p>
      <p>Children are soft targets – they use the internet regularly and interact via social media, but they're often too inexperienced to recognise when they are being deceived.</p>
      <p>Education is the best way to help protect your children.</p>
    `
    },
    {
        title: "Cheque fraud",
        icon: highlightIcons[4],
        details: `
      <p>Not many people use cheques these days, but cheque fraud is still prevalent.</p>
      <p>Consider the following tips to help reduce cheque fraud:</p>
      <ul>
        <li>Keep your chequebook in a safe and secure place</li>
        <li>Never pre-sign cheques</li>
        <li>When mailing cheques, cross the cheque 'Not Negotiable' and send it in a plain envelope without a window</li>
        <li>Use a pen or felt tip pen to write on your cheques, never pencil</li>
        <li>Bank Cheques should not be considered as good as cash</li>
        <li>Don't accept cheques in excess of the agreed price where you are asked to transfer/deposit the balance to a specific account</li>
      </ul>
    `
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
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/security/headerbanner-security.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/security/mobilebanner-security.jpg');"></div>
          <div class="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <img src="${NoLogo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 block dark:hidden" />
              <img src="${Logo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 hidden dark:block" />
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Financial Difficulty</h1>
              <p class="text-white text-lg">Horizon Ridge Credit Union<br>
                <a href="mailto:horizonridgecreditunion@gmail.com" data-nav class="underline">horizonridgecreditunion@gmail.com</a> &nbsp;|&nbsp; <a href="tel:+15022095647" data-nav class="underline">+1 502 209 5647</a>
              </p>
              <div class="mt-4">
                <a href="/" data-nav class="btn btn-tertiary w-full md:w-auto">View the latest scam alerts</a>
              </div>
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
        <!-- Feature Tiles -->
        <section class="py-8">
          <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-8">Ways to stay safe</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${featureTiles.map(tile => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group h-full">
                  <div class="rounded-lg overflow-hidden mb-4 flex justify-center">
                    <img src="${tile.img}" alt="${tile.title}" class="w-full h-32 object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${tile.title}</h3>
                  <div class="mb-4 text-brand-gray dark:text-brand-light">${tile.details}</div>
                  <a href="/" data-nav class="btn btn-link px-0 text-brand-sun hover:text-brand-navy transition mt-auto">${tile.linkText}</a>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Two Column Content -->
        <section class="pt-8 pb-6">
          <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div class="flex-1">
              <h2 class="text-2xl md:text-3xl font-bold text-brand-navy dark:text-brand-sun mb-4">Protecting yourself and your family</h2>
              <p class="text-base md:text-lg text-brand-gray dark:text-brand-light mb-4">
                Protecting yourself and your family from scams and identity theft can save you a lot of inconvenience, disruption and money. We have compiled a list of tips to help you protect yourself.
              </p>
            </div>
            <div class="flex-1 flex justify-center md:justify-end"></div>
          </div>
        </section>
        <!-- Highlight Tiles (SVG icons) -->
        <section class="py-10 bg-white dark:bg-brand-dark/90">
          <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              ${highlightTiles.map(tile => `
                <div class="rounded-xl shadow-lg bg-white dark:bg-brand-dark border border-brand-sun/20 p-6 flex flex-col transition-all duration-300 group h-full">
                  <div class="rounded-lg overflow-hidden mb-4 flex justify-center">
                    ${tile.icon}
                  </div>
                  <h3 class="font-bold text-lg text-brand-navy dark:text-brand-sun mb-2">${tile.title}</h3>
                  <div class="mb-4 text-brand-gray dark:text-brand-light">${tile.details}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        <!-- Spotlight Panel -->
        <section class="bg-brand-sun/10 py-8">
          <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 class="text-xl font-bold text-brand-navy dark:text-brand-sun mb-4 md:mb-0">Think you've received a scam message?</h3>
            <a href="/" data-nav class="btn btn-tertiary w-full md:w-auto">View the latest scam alerts</a>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents
    };
};

export default financialDifficultyView;