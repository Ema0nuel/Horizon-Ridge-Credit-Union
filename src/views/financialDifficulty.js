import navbar from '../components/navbar';
import footer from '../components/footer';
import { reset } from '../utils/reset';

const financialDifficultyView = () => {
    const nav = navbar();
    reset("Financial Difficulty Assistance");

    function pageEvents() {
        nav.pageEvents();
    }

    return {
        html: /* html */`
      ${nav.html}
      <main id="mainContent" class="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        <!-- Breadcrumbs -->
        <nav class="py-4 px-4 max-w-5xl mx-auto" aria-label="Breadcrumb">
          <ol class="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
            <li><a href="/" data-nav class="hover:underline">Home</a></li>
            <li>/</li>
            <li><a href="/support" data-nav class="hover:underline">Support</a></li>
            <li>/</li>
            <li>Financial difficulty assistance</li>
          </ol>
        </nav>
        <!-- Main Content -->
        <section class="py-8">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h1 class="text-2xl md:text-4xl font-bold mb-4">Financial difficulty assistance</h1>
              <p class="mb-4">We understand there may be times when your personal circumstances change. You may experience an unexpected event or changes outside of your control like losing your job, suffering an illness or injury, being affected by a natural disaster, or a downturn in your business.</p>
              <p class="mb-4">As a result, if you can’t afford the minimum repayment on your loan or credit card, and would like us to consider if we can provide financial difficulty assistance, please contact us immediately. The sooner you contact us the sooner we can try to help you.</p>
              <p class="mb-4">In many instances help can be provided quickly and efficiently over the phone.</p>
              <p class="mb-4">Otherwise we may need to do a more detailed assessment of your personal and financial circumstances to identify how we might be able to help.</p>
              <p class="mb-4">Financial difficulty assistance is available to you, whether you are an individual, joint account holder, guarantor or small business customer. If you have a joint account and are experiencing financial difficulty, we can assist you individually if you request it.</p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="Apply">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Apply for assistance</h2>
              <p class="mb-4">If you would like to apply for assistance, please contact:</p>
              <p class="mb-4"><strong>Mortgage Help Centre<br></strong>Email: <a href="mailto: horizonridgecreditunion@gmail.com" class="text-brand-sun underline"> horizonridgecreditunion@gmail.com</a></p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="Options">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Assistance options</h2>
              <p class="mb-4">This will depend on your personal circumstances and financial situation, and may include:</p>
              <ul class="list-disc pl-6 mb-4">
                <li>Tailoring a payment arrangement</li>
                <li>Deferring or reducing loan payments for a defined period of time</li>
                <li>Extending the loan term</li>
                <li>Capitalising loan arrears</li>
                <li>Product conversion</li>
                <li>Debt consolidation</li>
                <li>Interest only period</li>
              </ul>
              <p class="mb-4">It is important to contact us early so that we can discuss your situation and provide the best options available to you.</p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="Process">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Application process</h2>
              <p class="mb-4">If you think you are, or will be, unable to meet your debt obligations please contact us as soon as possible.</p>
              <p class="mb-4">Depending on your situation we may be able to provide assistance quickly and efficiently over the phone.</p>
              <p class="mb-4">Alternatively we may require further information and documentation to help us understand your financial position and determine whether assistance is appropriate, such as:</p>
              <ul class="list-disc pl-6 mb-4">
                <li>A statement of financial position to be completed summarising your current income, expenditure, assets and liabilities</li>
                <li>An employment contract and/or payslips</li>
                <li>Your account statements</li>
                <li>Centrelink statement and/or social security payment details</li>
                <li>A medical certificate from a qualified medical practitioner</li>
                <li>An employment separation statement</li>
                <li>A contract of sale/ sales agency agreement</li>
                <li>Other documents which support your request</li>
              </ul>
              <p class="mb-4">Once you have provided us with all the requested information necessary to review your financial situation, we will provide you with a decision within 21 days.</p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="Assessment">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Assessing your application</h2>
              <p class="mb-4">Our dedicated team will contact you. When assessing your request they will take into account factors including:</p>
              <ul class="list-disc pl-6 mb-4">
                <li>The reason for financial difficulty</li>
                <li>Your current financial position</li>
                <li>Your ability to meet the commitments under the proposed arrangement and future repayments under the contract</li>
                <li>The ability to rehabilitate your circumstances (based on whether the financial difficulty assistance will offer genuine relief to restore your financial situation)</li>
              </ul>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="LettingYouKnow">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Letting you know</h2>
              <p class="mb-4">We will tell you in writing if we can assist you, the reason for our decision to provide assistance and the main details of the proposed new arrangements.</p>
              <p class="mb-4">You’ll need to ensure that you meet the terms of the new arrangement.</p>
              <p class="mb-4">If you are subsequently unable to meet these terms, you should contact us as soon as possible to discuss your situation.</p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="CreditReport">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Will my credit report be impacted?</h2>
              <p class="mb-4">If your hardship assistance application is approved, a record that your payment obligations under your loans have been affected by an agreed financial hardship arrangement, will be recorded with the repayment history information on your credit report. If you follow all the terms of the arrangement, we will report your repayment history information as up to date. Once your financial hardship arrangement concludes, we will resume reporting your repayment history information against your contractual repayment obligations.</p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="Declined">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">If your application is declined</h2>
              <p class="mb-4">There may be a number of reasons why we decide not to provide financial difficulty assistance. If this is the case the reason for the decision will be explained to you in writing. We’ll also seek to discuss the next steps we will take and other available options with you.</p>
            </div>
          </div>
        </section>
        <section class="py-4 border-t border-brand-grape/20" id="NotSatisfied">
          <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-xl md:text-2xl font-bold mb-4">Not satisfied with the outcome?</h2>
              <p class="mb-4">Please contact our team who will promptly investigate your complaint and notify you the outcome.</p>
            </div>
            <div>
              <a href="/contact" data-nav class="btn btn-outline-primary w-full mb-3">Resolve a complaint</a>
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