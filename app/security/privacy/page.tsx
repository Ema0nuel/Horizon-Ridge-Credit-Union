"use client"

import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div
          className="absolute inset-0 z-0 hidden md:block bg-cover bg-right"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/policies/privacypolicy/bannerpoliciescoffee.jpg')",
          }}
        />
        <div
          className="absolute inset-0 z-0 md:hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/policies/privacypolicy/mobilebannerpoliciescoffee.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Privacy Policy
            </h1>
            <p className="text-white text-lg">
              Horizon Ridge Credit Union
              <br />
              <a
                href="mailto:contact@horizonridge.cc"
                className="underline"
              >
                contact@horizonridge.cc
              </a>{" "}
              &nbsp;|&nbsp;{" "}
              <a href="tel:+15022095647" className="underline">
                +1 502 209 5647
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav
        className="py-4 px-4 max-w-5xl mx-auto w-full"
        aria-label="Breadcrumb"
      >
        <ol className="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>Privacy policy</li>
        </ol>
      </nav>

      {/* Privacy Policy Content */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>

          {/* Table of Contents */}
          <div className="bg-white dark:bg-brand-dark border border-brand-sun/20 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg text-brand-navy dark:text-brand-sun mb-3">
              Contents
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about-this-policy"
                  className="text-brand-sun hover:underline"
                >
                  About this policy
                </a>
              </li>
              <li>
                <a
                  href="#collection"
                  className="text-brand-sun hover:underline"
                >
                  Collection
                </a>
              </li>
              <li>
                <a
                  href="#use-and-disclosure"
                  className="text-brand-sun hover:underline"
                >
                  Use and disclosure
                </a>
              </li>
              <li>
                <a
                  href="#disclosure-to-overseas-recipients"
                  className="text-brand-sun hover:underline"
                >
                  Disclosure to overseas recipients
                </a>
              </li>
              <li>
                <a
                  href="#access-and-correction"
                  className="text-brand-sun hover:underline"
                >
                  Access and correction
                </a>
              </li>
              <li>
                <a
                  href="#opting-out-of-product-promotions"
                  className="text-brand-sun hover:underline"
                >
                  Opting out of product promotions
                </a>
              </li>
              <li>
                <a
                  href="#storage-and-security-of-your-personal-information"
                  className="text-brand-sun hover:underline"
                >
                  Storage and security of your personal information
                </a>
              </li>
              <li>
                <a
                  href="#our-website-and-the-use-of-cookies"
                  className="text-brand-sun hover:underline"
                >
                  Our websites and the use of cookies
                </a>
              </li>
              <li>
                <a
                  href="#changes-to-this-policy"
                  className="text-brand-sun hover:underline"
                >
                  Changes to this policy
                </a>
              </li>
              <li>
                <a
                  href="#contacting-us"
                  className="text-brand-sun hover:underline"
                >
                  Contacting us
                </a>
              </li>
              <li>
                <a
                  href="#privacy-queries-or-complaints"
                  className="text-brand-sun hover:underline"
                >
                  Privacy queries or complaints
                </a>
              </li>
            </ul>
          </div>

          {/* About this policy */}
          <h3
            id="about-this-policy"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            About this policy
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            This document sets out how Horizon Ridge Credit Union safeguards
            your privacy.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We recognise the importance of protecting your privacy and are
            committed to ensuring the continued integrity and security of the
            personal information you entrust to us.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            Our aim is to comply at all times with the privacy laws
            (incorporating the Australian Privacy Principles) that apply to us.
            If you have a comment, query or complaint regarding a privacy
            matter, we encourage you to discuss it with us.
          </p>

          {/* Collection */}
          <h3
            id="collection"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Collection
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We usually collect personal information directly from you. Sometimes
            we collect or confirm this information from a third party. We will
            use reasonable efforts to obtain your consent prior to contacting a
            third party for this purpose.
          </p>
          <p className="mb-2 text-brand-gray dark:text-brand-light">
            We collect personal information that includes details such as your:
          </p>
          <ul className="list-disc pl-6 mb-4 text-brand-gray dark:text-brand-light space-y-1">
            <li>Identity information (Name, Date of Birth)</li>
            <li>
              Contact information (such as phone numbers, address, and e-mail
              addresses)
            </li>
            <li>
              Financial information such as information about your use of
              financial products and services which you acquire from or through
              us
            </li>
          </ul>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            In some cases, we may need to collect sensitive information about
            you (such as health related information). We will first seek your
            consent to collect such information where we are required to do so.
          </p>

          {/* Use and disclosure */}
          <h3
            id="use-and-disclosure"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Use and disclosure
          </h3>
          <p className="mb-2 text-brand-gray dark:text-brand-light">
            We use your personal information in order to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-brand-gray dark:text-brand-light space-y-1">
            <li>Provide you with financial products and services</li>
            <li>Assist you with your queries or concerns</li>
            <li>Comply with any legal or regulatory obligations imposed on us</li>
            <li>Perform our necessary business functions</li>
            <li>Identify and prevent fraud, scams and other unauthorised activity</li>
          </ul>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            To do this, we may disclose your personal information to
            organisations that carry out functions on our behalf. This may
            include mailing and printing houses, cheque and electronic
            transaction processors, information technology service providers,
            fraud detection and prevention providers, professional advisers,
            valuers, introducers and debt collection agencies. Our agreements
            with these entities ensure this information is only used to carry
            out functions on our behalf.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We may also disclose your personal information to regulators and
            government authorities as required by law.
          </p>

          {/* Disclosure to overseas recipients */}
          <h3
            id="disclosure-to-overseas-recipients"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Disclosure to overseas recipients
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            In some cases we may need to share some of your information with
            organisations outside Australia. For example, when we use service
            providers located overseas to perform a function on our behalf.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We may share your information with overseas organisations that are
            located in the following countries: Belgium, Bulgaria, Canada, Fiji,
            France, Germany, India, Indonesia, Ireland, Israel, Nauru, The
            Netherlands, New Zealand, Philippines, Singapore, Spain.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            When we share your information with organisations overseas we ensure
            appropriate data handling and security measures are in place.
          </p>

          {/* Access and correction */}
          <h3
            id="access-and-correction"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Access and correction
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            In most cases you can access your personal information held by us.
            If you believe that personal information we hold about you is
            inaccurate, out of date or incomplete, you should contact us.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We will promptly update your personal information that is
            inaccurate, out of date or incomplete. In some cases we may request
            you provide us with supporting documentation to amend the personal
            information we hold about you.
          </p>

          {/* Opting out of product promotions */}
          <h3
            id="opting-out-of-product-promotions"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Opting out of product promotions
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            You can opt out of receiving direct marketing material at any time
            by contacting us. If you do opt out, we will continue to provide
            information in relation to your existing accounts or facilities only
            (including new features or products related to these accounts or
            facilities).
          </p>

          {/* Storage and security */}
          <h3
            id="storage-and-security-of-your-personal-information"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Storage and security of your personal information
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We will take reasonable steps to keep the personal information we
            hold about you secure to ensure that it is protected from misuse,
            interference, loss, unauthorised access, modification or disclosure.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            Your personal information is stored within secure systems that are
            protected in controlled facilities. Our employees and authorised
            agents are obliged to respect the confidentiality of any personal
            information held by us.
          </p>

          {/* Cookies */}
          <h3
            id="our-website-and-the-use-of-cookies"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Our websites and the use of cookies
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We use our best efforts to ensure that information received via our
            Websites remains secured within our systems. We are regularly
            reviewing developments in online security. However, you should be
            aware that there are inherent risks in transmitting information
            across the internet.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            We use cookies on our Websites. Cookies can make using our Websites
            easier by storing information about your preferences and enabling
            you to take full advantage of our services. Cookies are very small
            text files that a Website can transfer to your computer hard drive
            or portable electronic device memory for record keeping.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            Most internet web browsers are pre-set to accept cookies to enable
            full use of websites that employ them. However, if you do not wish
            to receive any cookies on an internet web browser you may configure
            your browser to reject them or receive a warning when cookies are
            being used. In some instances, this may mean that you will not be
            able to use some or all of the services provided on our Websites.
            However you may still be able to access information-only pages.
          </p>

          {/* Changes */}
          <h3
            id="changes-to-this-policy"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Changes to this policy
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            From time to time, it may be necessary for us to review this policy
            and the information contained in this document. We will notify you
            of any changes by posting an updated version on our website(s).
          </p>

          {/* Contacting us */}
          <h3
            id="contacting-us"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Contacting us
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            If you have any questions about this policy, what personal
            information or credit related information we may hold in relation to
            you, or about the way we manage your personal information or credit
            related information you can contact us.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            Email:{" "}
            <a
              href="mailto:contact@horizonridge.cc"
              className="text-brand-sun underline"
            >
              contact@horizonridge.cc
            </a>
            <br />
            Phone:{" "}
            <a
              href="tel:+15022095647"
              className="text-brand-sun underline"
            >
              +1 502 209 5647
            </a>
          </p>

          {/* Privacy queries or complaints */}
          <h3
            id="privacy-queries-or-complaints"
            className="text-xl font-semibold mt-8 mb-2 text-brand-navy dark:text-brand-sun"
          >
            Privacy queries or complaints
          </h3>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            If you have a query or wish to make a complaint regarding the
            handling of your personal information, including your credit related
            information, by us, please contact our Customer Feedback Team. We
            will promptly investigate your complaint and notify you of the
            outcome.
          </p>
          <div className="mt-6">
            <Link
              href="/contact-us"
              className="inline-block px-6 py-3 rounded-full border-2 border-brand-sun text-brand-sun font-semibold hover:bg-brand-sun hover:text-white transition-all duration-300"
            >
              Resolve a complaint
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
