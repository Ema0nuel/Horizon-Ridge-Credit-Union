import navbar from '../../components/navbar';
import footer from '../../components/footer';
import { reset } from '../../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const privacyView = () => {
    const nav = navbar();
    reset("Privacy Policy");

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
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Privacy Policy</h1>
              <p class="text-white text-lg">Horizon Ridge Credit Union<br>
                <a href="mailto:horizonridgecreditunion@gmail.com" class="underline">horizonridgecreditunion@gmail.com</a> &nbsp;|&nbsp; <a href="tel:+15022095647" class="underline">+1 502 209 5647</a>
              </p>
            </div>
          </div>
        </section>
        <!-- Breadcrumbs -->
        <nav class="py-4 px-4 max-w-5xl mx-auto" aria-label="Breadcrumb">
          <ol class="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
            <li><a href="/" data-nav class="hover:underline">Home</a></li>
            <li>/</li>
            <li>Privacy policy</li>
          </ol>
        </nav>
        <!-- Privacy Policy Content -->
        <section class="py-8">
          <div class="max-w-5xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-4">Privacy Policy</h2>
            <ul class="list-disc pl-6 mb-4">
              <li><a href="#about-this-policy" data-nav>About this policy</a></li>
              <li><a href="#privacy-policy" data-nav>Privacy Policy</a></li>
              <li><a href="#collection" data-nav>Collection</a></li>
              <li><a href="#use-and-disclosure" data-nav>Use and disclosure</a></li>
              <li><a href="#disclosure-to-overseas-recipients" data-nav>Disclosure to overseas recipients</a></li>
              <li><a href="#access-and-correction" data-nav>Access and correction</a></li>
              <li><a href="#opting-out-of-product-promotions" data-nav>Opting out of product promotions</a></li>
              <li><a href="#storage-and-security-of-your-personal-information" data-nav>Storage and security of your personal information</a></li>
              <li><a href="#our-website-and-the-use-of-cookies" data-nav>Our websites and the use of cookies</a></li>
              <li><a href="#changes-to-this-policy" data-nav>Changes to this policy</a></li>
              <li><a href="#contacting-us" data-nav>Contacting us</a></li>
            </ul>
            <h3 id="about-this-policy" class="text-xl font-semibold mt-8 mb-2">About this policy</h3>
            <p>This document sets out how Horizon Ridge Credit Union safeguards your privacy.</p>
            <p>We recognise the importance of protecting your privacy and are committed to ensuring the continued integrity and security of the personal information you entrust to us.</p>
            <p>Our aim is to comply at all times with the privacy laws (incorporating the Australian Privacy Principles) that apply to us. If you have a comment, query or complaint regarding a privacy matter, we encourage you to discuss it with us.</p>
            <h3 id="collection" class="text-xl font-semibold mt-8 mb-2">Collection</h3>
            <p>We usually collect personal information directly from you. Sometimes we collect or confirm this information from a third party. We will use reasonable efforts to obtain your consent prior to contacting a third party for this purpose.</p>
            <p>We collect personal information that includes details such as your:</p>
            <ul class="list-disc pl-6 mb-4">
              <li>Identity information (Name, Date of Birth)</li>
              <li>Contact information (such as phone numbers, address, and e-mail addresses)</li>
              <li>Financial information such as information about your use of financial products and services which you acquire from or through us</li>
            </ul>
            <p>In some cases, we may need to collect sensitive information about you (such as health related information). We will first seek your consent to collect such information where we are required to do so.</p>
            <h3 id="use-and-disclosure" class="text-xl font-semibold mt-8 mb-2">Use and disclosure</h3>
            <p>We use your personal information in order to:</p>
            <ul class="list-disc pl-6 mb-4">
              <li>Provide you with financial products and services</li>
              <li>Assist you with your queries or concerns</li>
              <li>Comply with any legal or regulatory obligations imposed on us</li>
              <li>Perform our necessary business functions</li>
              <li>Identify and prevent fraud, scams and other unauthorised activity</li>
            </ul>
            <p>To do this, we may disclose your personal information to organisations that carry out functions on our behalf. This may include mailing and printing houses, cheque and electronic transaction processors, information technology service providers, fraud detection and prevention providers, professional advisers, valuers, introducers and debt collection agencies. Our agreements with these entities ensure this information is only used to carry out functions on our behalf.</p>
            <p>We may also disclose your personal information to regulators and government authorities as required by law.</p>
            <h3 id="disclosure-to-overseas-recipients" class="text-xl font-semibold mt-8 mb-2">Disclosure to overseas recipients</h3>
            <p>In some cases we may need to share some of your information with organisations outside Australia. For example, when we use service providers located overseas to perform a function on our behalf.</p>
            <p>We may share your information with overseas organisations that are located in the following countries: Belgium, Bulgaria, Canada, Fiji, France, Germany, India, Indonesia, Ireland, Israel, Nauru, The Netherlands, New Zealand, Philippines, Singapore, Spain.</p>
            <p>When we share your information with organisations overseas we ensure appropriate data handling and security measures are in place.</p>
            <h3 id="access-and-correction" class="text-xl font-semibold mt-8 mb-2">Access and correction</h3>
            <p>In most cases you can access your personal information held by us. If you believe that personal information we hold about you is inaccurate, out of date or incomplete, you should contact us.</p>
            <p>We will promptly update your personal information that is inaccurate, out of date or incomplete. In some cases we may request you provide us with supporting documentation to amend the personal information we hold about you.</p>
            <h3 id="opting-out-of-product-promotions" class="text-xl font-semibold mt-8 mb-2">Opting out of product promotions</h3>
            <p>You can opt out of receiving direct marketing material at any time by contacting us. If you do opt out, we will continue to provide information in relation to your existing accounts or facilities only (including new features or products related to these accounts/facilities).</p>
            <h3 id="storage-and-security-of-your-personal-information" class="text-xl font-semibold mt-8 mb-2">Storage and security of your personal information</h3>
            <p>We will take reasonable steps to keep the personal information we hold about you secure to ensure that it is protected from misuse, interference, loss, unauthorised access, modification or disclosure.</p>
            <p>Your personal information is stored within secure systems that are protected in controlled facilities. Our employees and authorised agents are obliged to respect the confidentiality of any personal information held by us.</p>
            <h3 id="our-website-and-the-use-of-cookies" class="text-xl font-semibold mt-8 mb-2">Our websites and the use of cookies</h3>
            <p>We use our best efforts to ensure that information received via our Websites remains secured within our systems. We are regularly reviewing developments in online security; however, you should be aware that there are inherent risks in transmitting information across the internet.</p>
            <p>We use cookies on our Websites. Cookies can make using our Websites easier by storing information about your preferences and enabling you to take full advantage of our services. Cookies are very small text files that a Website can transfer to your computer’s hard drive or portable electronic device’s memory for record keeping.</p>
            <p>Most internet web browsers are pre-set to accept cookies to enable full use of websites that employ them. However, if you do not wish to receive any cookies on an internet web browser you may configure your browser to reject them or receive a warning when cookies are being used. In some instances, this may mean that you will not be able to use some or all of the services provided on our Websites. However you may still be able to access information-only pages.</p>
            <h3 id="changes-to-this-policy" class="text-xl font-semibold mt-8 mb-2">Changes to this policy</h3>
            <p>From time to time, it may be necessary for us to review this policy and the information contained in this document. We will notify you of any changes by posting an updated version on our website(s).</p>
            <h3 id="contacting-us" class="text-xl font-semibold mt-8 mb-2">Contacting us</h3>
            <p>If you have any questions about this policy, what personal information or credit related information we may hold in relation to you, or about the way we manage your personal information or credit related information you can contact us.</p>
            <p>Email: <a href="mailto:horizonridgecreditunion@gmail.com" class="underline">horizonridgecreditunion@gmail.com</a><br>
            Phone: <a href="tel:+15022095647" class="underline">+1 502 209 5647</a></p>
            <h3 id="privacy-queries-or-complaints" class="text-xl font-semibold mt-8 mb-2">Privacy queries or complaints</h3>
            <p>If you have a query or wish to make a complaint regarding the handling of your personal information, including your credit related information, by us, please contact our Customer Feedback Team. We will promptly investigate your complaint and notify you of the outcome.</p>
            <div class="mt-6">
              <a href="/contact-us" class="btn btn-outline-primary px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition">Resolve a complaint</a>
            </div>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents
    };
};

export default privacyView;