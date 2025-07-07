import navbar from '../../components/navbar';
import footer from '../../components/footer';
import { reset } from '../../utils/reset';
import NoLogo from "/src/images/logo-nobg.png"
import Logo from "/src/images/logo.jpg"

const termsView = () => {
    const nav = navbar();
    reset("Terms of Use");

    function pageEvents() {
        nav.pageEvents();
    }

    return {
        html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Header Banner -->
        <section class="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
          <div class="absolute inset-0 z-0 hidden md:block bg-cover bg-right" style="background-image: url('https://westcoastsgroup.com/siteassets/termsofuse/bannerpoliciesphone.jpg');"></div>
          <div class="absolute inset-0 z-0 md:hidden bg-cover bg-center" style="background-image: url('https://westcoastsgroup.com/siteassets/termsofuse/mobilebannerpoliciesphone.jpg');"></div>
          <div class="absolute inset-0 bg-black/50 dark:bg-brand-navy/70"></div>
          <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
            <div class="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <img src="${NoLogo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 block dark:hidden" />
              <img src="${Logo}" alt="Horizon Ridge Credit Union" class="h-16 w-auto mb-4 hidden dark:block" />
              <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Terms of use</h1>
            </div>
          </div>
        </section>
        <!-- Breadcrumbs -->
        <nav class="py-4 px-4 max-w-5xl mx-auto" aria-label="Breadcrumb">
          <ol class="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
            <li><a href="/" class="hover:underline">Home</a></li>
            <li>/</li>
            <li>Terms of use</li>
          </ol>
        </nav>
        <!-- Terms Content -->
        <section class="py-8">
          <div class="max-w-5xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-4">1. This website</h2>
            <p>This website (“<strong>Website</strong>") is owned and operated by Horizon Ridge Credit Union (“<strong>we</strong>”/“<strong>us</strong>”/“<strong>our</strong>”), on our behalf and that of our related bodies corporate. Our registered office is in the United States. Contact: <a href="mailto:horizonridgecreditunion@gmail.com" class="text-brand-sun underline">horizonridgecreditunion@gmail.com</a> | <a href="tel:+15022095647" class="text-brand-sun underline">+1 502 209 5647</a>.</p>
            <p>These terms of use (the “<strong>Terms</strong>”) govern your use of this Website (the “<strong>Website Content</strong>”). Each time you use this Website, your use indicates your acknowledgment and acceptance of the Terms, which we may revise periodically without notice. If you do not accept these terms and conditions, do not use the Website.</p>
            <h2 class="text-2xl font-bold mt-8 mb-4">2. Our rights in, and restrictions on your use of, this Website</h2>
            <p>The Website Content (including trade marks and logos) is our intellectual property or that of our suppliers. We grant you a non-exclusive, non-transferable and limited right to access and use this Website, view the Website Content on your screen and print copies of such Website Content, solely for your personal, non-commercial use, and provided that you comply fully with these Terms.</p>
            <p>While we take reasonable steps to ensure that the Website Content is free from errors or omissions or is suitable for your intended use, we do not represent or warrant the availability, accuracy, adequacy or completeness of the Website Content or that the Website and Website Content is virus-free. You further acknowledge and agree that to the maximum extent permitted by law: (a) this Website and the Website Content are provided on an "as is" and "as available" basis; and (b) we cannot guarantee and do not promise any specific results from use of this Website and the Website Content.</p>
            <p>You acknowledge that:</p>
            <ol class="list-decimal pl-6 mb-4">
              <li>we may at any time modify, discontinue, temporarily suspend or permanently remove the Website or the Website Content (or any part thereof); and</li>
              <li>we will not be liable to you or any third party for doing so.</li>
            </ol>
            <p>If this Website enables you to create and use an online account, you agree that such online account is subject to the terms and conditions that you agreed to in creating that account, including the applicable Disclosure Document.</p>
            <h2 class="text-2xl font-bold mt-8 mb-4">3. Product and Services Information</h2>
            <p>Products and services displayed or offered on this Website contain general information about Horizon Ridge Credit Union products and services and can be changed by us at any time at our discretion. In the event of any conflict or inconsistency between this Website and the applicable disclosure document (such as a Product Disclosure Statement), the applicable disclosure document will take precedence. The information on this Website:</p>
            <ol class="list-decimal pl-6 mb-4">
              <li>is not an offer or solicitation by anyone in any jurisdiction in which an offer or solicitation cannot legally be made, or to any person to whom it is unlawful to make a solicitation;</li>
              <li>does not form part of the terms and conditions for Horizon Ridge Credit Union products and services; and</li>
              <li>has been prepared without taking into account your objectives, financial situation or needs. Before acting on the basis of this information, you should consider (with or without the assistance of an adviser) how appropriate the information is having regard to your objectives, financial situations and needs. You must read the applicable Financial Services Guides (FSG) and our Credit Guide.</li>
            </ol>
            <h2 class="text-2xl font-bold mt-8 mb-4">4. Third Party Content</h2>
            <p>Links from this Website to third party websites, or references to products, services or publications other than those of Horizon Ridge Credit Union, do not imply the endorsement or approval of such third party websites, products, services or publications by Horizon Ridge Credit Union. Any access and use you make of such third party material is entirely at your own risk.</p>
            <p>The opinions or views that Horizon Ridge Credit Union makes available via third party websites or social media providers (such as videos or tweets) (each, a “<strong>Publication</strong>”) are not necessarily the opinions or views of Horizon Ridge Credit Union, and Horizon Ridge Credit Union makes no representation and gives no warranty as to the accuracy, currency or completeness of material contained in any Publication. Horizon Ridge Credit Union does not accept any responsibility to inform you of any matter that subsequently comes to their notice which may affect the accuracy, currency or completeness of the material in any of the Publications.</p>
          </div>
        </section>
      </main>
      ${footer().html}
    `,
        pageEvents
    };
};

export default termsView;