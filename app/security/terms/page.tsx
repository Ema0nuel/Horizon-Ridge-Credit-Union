"use client"

import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans">
      {/* Header Banner */}
      <section className="relative w-full min-h-[320px] md:min-h-[440px] flex items-center bg-gradient-to-br from-brand-sun/80 to-brand-navy/90">
        <div
          className="absolute inset-0 z-0 hidden md:block bg-cover bg-right"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/termsofuse/bannerpoliciesphone.jpg')",
          }}
        />
        <div
          className="absolute inset-0 z-0 md:hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://westcoastsgroup.com/siteassets/termsofuse/mobilebannerpoliciesphone.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-brand-navy/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Terms of use
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
          <li>Terms of use</li>
        </ol>
      </nav>

      {/* Terms Content */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-brand-navy dark:text-brand-sun">
            1. This website
          </h2>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            This website (&ldquo;<strong>Website</strong>&rdquo;) is owned and
            operated by Horizon Ridge Credit Union (&ldquo;
            <strong>we</strong>&rdquo;/&ldquo;<strong>us</strong>&rdquo;/&ldquo;
            <strong>our</strong>&rdquo;), on our behalf and that of our related
            bodies corporate. Our registered office is in the United States.
            Contact:{" "}
            <a
              href="mailto:contact@horizonridge.cc"
              className="text-brand-sun underline"
            >
              contact@horizonridge.cc
            </a>{" "}
            |{" "}
            <a
              href="tel:+15022095647"
              className="text-brand-sun underline"
            >
              +1 502 209 5647
            </a>
            .
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            These terms of use (the &ldquo;<strong>Terms</strong>&rdquo;)
            govern your use of this Website (the &ldquo;
            <strong>Website Content</strong>&rdquo;). Each time you use this
            Website, your use indicates your acknowledgment and acceptance of
            the Terms, which we may revise periodically without notice. If you
            do not accept these terms and conditions, do not use the Website.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-brand-navy dark:text-brand-sun">
            2. Our rights in, and restrictions on your use of, this Website
          </h2>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            The Website Content (including trade marks and logos) is our
            intellectual property or that of our suppliers. We grant you a
            non-exclusive, non-transferable and limited right to access and use
            this Website, view the Website Content on your screen and print
            copies of such Website Content, solely for your personal,
            non-commercial use, and provided that you comply fully with these
            Terms.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            While we take reasonable steps to ensure that the Website Content is
            free from errors or omissions or is suitable for your intended use,
            we do not represent or warrant the availability, accuracy, adequacy
            or completeness of the Website Content or that the Website and
            Website Content is virus-free. You further acknowledge and agree
            that to the maximum extent permitted by law: (a) this Website and
            the Website Content are provided on an &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; basis; and (b) we cannot guarantee and do
            not promise any specific results from use of this Website and the
            Website Content.
          </p>
          <p className="mb-2 text-brand-gray dark:text-brand-light">
            You acknowledge that:
          </p>
          <ol className="list-decimal pl-6 mb-4 text-brand-gray dark:text-brand-light space-y-1">
            <li>
              we may at any time modify, discontinue, temporarily suspend or
              permanently remove the Website or the Website Content (or any part
              thereof); and
            </li>
            <li>
              we will not be liable to you or any third party for doing so.
            </li>
          </ol>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            If this Website enables you to create and use an online account, you
            agree that such online account is subject to the terms and
            conditions that you agreed to in creating that account, including
            the applicable Disclosure Document.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-brand-navy dark:text-brand-sun">
            3. Product and Services Information
          </h2>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            Products and services displayed or offered on this Website contain
            general information about Horizon Ridge Credit Union products and
            services and can be changed by us at any time at our discretion. In
            the event of any conflict or inconsistency between this Website and
            the applicable disclosure document (such as a Product Disclosure
            Statement), the applicable disclosure document will take precedence.
            The information on this Website:
          </p>
          <ol className="list-decimal pl-6 mb-4 text-brand-gray dark:text-brand-light space-y-1">
            <li>
              is not an offer or solicitation by anyone in any jurisdiction in
              which an offer or solicitation cannot legally be made, or to any
              person to whom it is unlawful to make a solicitation;
            </li>
            <li>
              does not form part of the terms and conditions for Horizon Ridge
              Credit Union products and services; and
            </li>
            <li>
              has been prepared without taking into account your objectives,
              financial situation or needs. Before acting on the basis of this
              information, you should consider (with or without the assistance
              of an adviser) how appropriate the information is having regard to
              your objectives, financial situations and needs. You must read the
              applicable Financial Services Guides (FSG) and our Credit Guide.
            </li>
          </ol>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-brand-navy dark:text-brand-sun">
            4. Third Party Content
          </h2>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            Links from this Website to third party websites, or references to
            products, services or publications other than those of Horizon Ridge
            Credit Union, do not imply the endorsement or approval of such third
            party websites, products, services or publications by Horizon Ridge
            Credit Union. Any access and use you make of such third party
            material is entirely at your own risk.
          </p>
          <p className="mb-4 text-brand-gray dark:text-brand-light">
            The opinions or views that Horizon Ridge Credit Union makes
            available via third party websites or social media providers (such
            as videos or tweets) (each, a &ldquo;
            <strong>Publication</strong>&rdquo;) are not necessarily the
            opinions or views of Horizon Ridge Credit Union, and Horizon Ridge
            Credit Union makes no representation and gives no warranty as to the
            accuracy, currency or completeness of material contained in any
            Publication. Horizon Ridge Credit Union does not accept any
            responsibility to inform you of any matter that subsequently comes
            to their notice which may affect the accuracy, currency or
            completeness of the material in any of the Publications.
          </p>
        </div>
      </section>
    </div>
  )
}
