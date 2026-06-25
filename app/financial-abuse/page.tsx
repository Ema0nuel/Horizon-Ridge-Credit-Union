"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FinancialAbusePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center font-sans text-sm">
        <div className="animate-pulse text-brand-navy dark:text-brand-sun text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col font-sans text-sm">
      <main id="mainContent" className="main fullWidthPage bg-brand-light dark:bg-brand-dark text-brand-navy dark:text-brand-light" data-pg="FullWidthPage">
        {/* Breadcrumbs */}
        <nav className="py-4 px-4 max-w-5xl mx-auto" aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-sm text-brand-navy dark:text-brand-sun">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li>/</li>
            <li><Link href="/support" className="hover:underline">Support</Link></li>
            <li>/</li>
            <li>Financial abuse support</li>
          </ol>
        </nav>
        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">Financial abuse support</h1>
              <p className="mb-4">Financial abuse occurs when one person manipulates another to control their finances and property without their consent.</p>
              <p className="mb-4">There are many types of financial abuse and it can happen to anyone, no matter how old, or how much money they have.</p>
              <p className="mb-4">If you feel you are in a financially abusive situation, please do not hesitate to speak to any member of our staff.</p>
            </div>
          </div>
        </section>
        {/* How we can help you */}
        <section className="py-4 border-t border-brand-grape/20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl md:text-2xl font-bold mb-4" id="Understanding">How we can help you</h2>
              <p className="mb-4">There are many different ways we can help you to regain control of your banking. Of course this will depend on your personal circumstances as everyone situation will be different.</p>
              <p className="mb-4">Our staff will also ensure that we respect your privacy and confidentiality. We know that telling us about your circumstances may be difficult, and our goal is to minimise you repeating your story.</p>
              <p className="mb-4">We have also established a specialised team who can help you, or your authorised representative, regain control of your finances. Our staff will protect your confidentiality and safety at all times.</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Visit any of our branches</li>
                <li>Email <a href="mailto:contact@horizonridge.cc" className="text-brand-sun underline">contact@horizonridge.cc</a> between 8.30am and 5.00pm, Mon-Fri</li>
                <li>Or complete our online form</li>
              </ul>
            </div>
            <div>
              <Link href="/locate-us" className="inline-block w-full px-4 py-2 rounded-full border-2 border-brand-sun text-brand-sun hover:bg-brand-sun hover:text-white transition font-semibold text-center mb-3">
                Find a branch
              </Link>
            </div>
          </div>
        </section>
        {/* Types of financial abuse */}
        <section className="py-4 border-t border-brand-grape/20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl md:text-2xl font-bold mb-4" id="Types">Are you experiencing financial abuse?</h2>
              <p className="mb-4">Financial abuse can come in the form of Elder, Domestic, Disability and/or Language/Cultural abuse.</p>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Elder</h3>
                <p className="mb-2">Elder financial abuse is a specific form of exploitation. It may also be emotional abuse.</p>
                <p className="mb-2">There are many forms of elder financial abuse, but there is a common thread. In general, it is an effort by unscrupulous person/s to extract money and resources through a variety of devious means from elderly persons.</p>
                <ul className="list-disc pl-6 mb-2">
                  <li>deceit</li>
                  <li>forgery</li>
                  <li>coercion through bullying and intimidation</li>
                  <li>undue influence for personal gain</li>
                  <li>misuse of a person Power of Attorney or Guardianship instructions</li>
                </ul>
                <p>In general, all involve improper use of an older person assets.</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Disability</h3>
                <p className="mb-2">Financial abuse of a disabled person is any act involving the misuse of the person money or property. This is done without their full knowledge, consent or understanding.</p>
                <p>This can be against an individual with a physical and/or mental disability. It deprives them of vital financial resources for their personal needs.</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Domestic</h3>
                <p className="mb-2">Domestic financial abuse may occur when a person uses money as a means to gain power and control over their partner.</p>
                <p className="mb-2">This type of abuse is when a victim can be trapped in an abusive relationship with the person doing such things as:</p>
                <ul className="list-disc pl-6 mb-2">
                  <li>forbidding access to bank accounts</li>
                  <li>providing an inadequate allowance</li>
                  <li>not allowing the victim to work</li>
                  <li>forcing the victim to sign documents or make false declarations</li>
                  <li>denying that the victim has an entitlement to joint property.</li>
                </ul>
                <p className="mb-2">This is not an exhaustive list.</p>
                <p className="mb-2">This type of financial abuse can be subtle. A person gradually takes control over bank accounts and financial transactions. Domestic financial abuse can also be obvious, violent and threatening.</p>
                <p>It may not be until after a relationship has ended that the customer realizes that they are a victim of financial abuse.</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Language/Cultural</h3>
                <p className="mb-2">People who speak little English, including from Indigenous communities, are at an increased risk of financial abuse.</p>
                <p className="mb-2">Due to the difficulties in gaining information about banking services and products, they often trust others to help. This can be a trusted family member or friend, who they use them to interpret for them.</p>
                <p>This can lead to the person becoming a victim of financial abuse without their full understanding of the circumstances.</p>
              </div>
            </div>
          </div>
        </section>
        {/* FAQs */}
        <section className="py-4 border-t border-brand-grape/20" id="FAQs">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Frequently asked questions</h2>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Why is the Bank focusing on Financial Abuse?</h3>
                <p>The community expectations have changed over time and it is now recognised that we all have a part to play in assisting those vulnerable members of our community.</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">What is financial abuse?</h3>
                <p>Financial abuse is when someone takes away your access to money. A person may manipulate your financial decisions or use your money without consent.</p>
                <p>Once you know this, let our staff know, as there are ways to get help and regain your independence.</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">What can the Bank offer customers impacted by financial abuse?</h3>
                <p>Our staff have been trained to recognise and assist a customer who may be a victim of financial abuse. It is important for us to help and support customers to navigate through their situation to financial independence.</p>
                <p>This may include:</p>
                <ul className="list-disc pl-6 mb-2">
                  <li>Arranging new accounts or other banking services.</li>
                  <li>Working with different areas of the bank on the customers behalf.</li>
                  <li>Referring customers to external agencies and financial counsellors.</li>
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Are there some warning signs I should look out for?</h3>
                <p>Yes there are many. Here just a few:</p>
                <ul className="list-disc pl-6 mb-2">
                  <li>Check your transactions regularly and let us know if there are any transactions you do not recognise.</li>
                  <li>Do not let anyone speak for you or make you feel rushed to make a financial decision. Eg. Withdrawing a large amount of cash from your account, or setting up e-banking.</li>
                  <li>Do not allow anyone calling you to access your computer or provide them with your bank account details.</li>
                  <li>Make sure you understand what financial access you are giving to a family member or friend by adding them as a signatory to your account.</li>
                </ul>
                <p>Most importantly, if you suspect you are being financially abused, please let us know so we can help you.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
