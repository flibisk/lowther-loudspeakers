import type { Metadata } from 'next';
import { ScrollReveal } from '@/components/scroll-reveal';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lowther Loudspeakers',
  description:
    'Learn how Lowther Loudspeaker Systems Ltd collects, uses, and protects your personal information across our website and services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-neutral-900">
      <section data-surface="dark" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-[#c59862]/40 opacity-90"></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <ScrollReveal animation="fade-up">
            <p className="text-sm uppercase tracking-[4px] text-white/70 mb-4">
              Our Commitment To Your Privacy
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Your privacy is important to us. This policy explains how Lowther Loudspeaker Systems Ltd
              collects, uses, and safeguards personal information across our website and connected services.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section data-surface="light" className="py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 space-y-16">
          <ScrollReveal animation="fade-up">
            <article className="space-y-8 text-base leading-7 text-neutral-700">
              <p>
                It is Lowther Loudspeaker Systems Ltd&rsquo;s policy to respect your privacy regarding any
                information we may collect from you across our website,
                {' '}
                <a
                  href="https://lowtherloudspeakers.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c59862] underline underline-offset-4"
                >
                  https://lowtherloudspeakers.com
                </a>
                , and other sites we own and operate.
              </p>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">1. Information We Collect</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Log data</h3>
                    <p>
                      When you visit our website, our servers may automatically log standard data provided by your
                      web browser. This may include your computer&rsquo;s IP address, browser type and version, the
                      pages you visit, the time and date of your visit, the time spent on each page, and other
                      details.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Device data</h3>
                    <p>
                      We may also collect data about the device you&rsquo;re using to access our website. This may
                      include device type, operating system, unique device identifiers, device settings, and
                      geo-location data. What we collect can depend on your device and software settings. Please
                      check your device manufacturer or software provider policies to learn what information they
                      make available to us.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Personal information</h3>
                    <p className="mb-3">
                      We may ask for personal information such as your:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>Name</li>
                      <li>Email</li>
                      <li>Phone or mobile number</li>
                      <li>Home or mailing address</li>
                      <li>Work address</li>
                      <li>Payment information</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">2. Legal Bases For Processing</h2>
                <p>
                  We process your personal information lawfully, fairly, and transparently. We collect and use
                  information only where we have legal bases to do so. These depend on the services you use and how
                  you use them. We collect and use your information only where:
                </p>
                <ul className="list-disc space-y-2 pl-6 mt-4">
                  <li>
                    it&rsquo;s necessary for the performance of a contract to which you are a party, or to take
                    steps at your request before entering into such a contract;
                  </li>
                  <li>
                    it satisfies a legitimate interest (which is not overridden by your data protection interests),
                    such as research and development, marketing and promotion of our services, or protecting our
                    legal rights and interests;
                  </li>
                  <li>
                    you give us consent for a specific purpose (for example, subscribing to our newsletter); or
                  </li>
                  <li>we need to process your data to comply with a legal obligation.</li>
                </ul>
                <p className="mt-4">
                  Where you consent to our use of information for a specific purpose, you may change your mind at
                  any time (without affecting processing that has already taken place).
                </p>
                <p>
                  We do not keep personal information longer than necessary. While retained, we protect it within
                  commercially acceptable means to prevent loss, theft, unauthorised access, disclosure, copying,
                  use, or modification. No method of electronic transmission or storage is 100% secure, and we cannot
                  guarantee absolute data security. We may retain personal information to comply with legal
                  obligations or protect vital interests.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">3. Collection and Use of Information</h2>
                <p>
                  We may collect, hold, use, and disclose information for the following purposes, and personal
                  information will not be further processed in a manner incompatible with these purposes:
                </p>
                <ul className="list-disc space-y-2 pl-6 mt-4">
                  <li>to contact and communicate with you;</li>
                  <li>for internal record keeping and administrative purposes;</li>
                  <li>
                    for analytics, market research, and business development, including operating and improving our
                    website, associated applications, and social media platforms; and
                  </li>
                  <li>to comply with our legal obligations and resolve any disputes.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">
                  4. Disclosure of Personal Information to Third Parties
                </h2>
                <p>
                  We may disclose personal information to third-party service providers to enable them to provide
                  their services. These may include IT service providers, data storage, hosting and server
                  providers, ad networks, analytics, error loggers, debt collectors, maintenance or problem-solving
                  providers, marketing or advertising providers, professional advisors, and payment system operators.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">
                  5. International Transfers of Personal Information
                </h2>
                <p>
                  Personal information we collect is stored and processed in the United Kingdom, or wherever we or
                  our partners, affiliates, and third-party providers maintain facilities. By providing personal
                  information, you consent to disclosure to these overseas third parties.
                </p>
                <p>
                  Transfers from the European Economic Area (EEA) to countries outside the EEA are protected by
                  appropriate safeguards, such as standard data protection clauses approved by the European
                  Commission or other legally accepted means.
                </p>
                <p>
                  Where we transfer personal information from a non-EEA country to another country, you acknowledge
                  that third parties in other jurisdictions may not be subject to similar data protection laws.
                  There is a risk that you may not be able to seek redress under our jurisdiction&rsquo;s privacy
                  laws.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">
                  6. Your Rights and Controlling Your Personal Information
                </h2>
                <div className="space-y-4">
                  <p>
                    <span className="font-semibold">Choice and consent:</span> By providing personal information,
                    you consent to us collecting, holding, using, and disclosing it in accordance with this policy.
                    If you are under 16, you must have your parent or legal guardian&rsquo;s permission. You may
                    choose not to provide personal information, but this may affect your use of the website or
                    services.
                  </p>
                  <p>
                    <span className="font-semibold">Information from third parties:</span> If we receive personal
                    information about you from a third party, we will protect it in accordance with this policy. If
                    you supply personal information about someone else, you confirm that you have that person&rsquo;s
                    consent to do so.
                  </p>
                  <p>
                    <span className="font-semibold">Restrict:</span> You may restrict the collection or use of your
                    personal information. To change your marketing preferences, contact us using the details below.
                    If you limit processing, we will explain how that affects your use of our website or services.
                  </p>
                  <p>
                    <span className="font-semibold">Access and data portability:</span> You may request details or a
                    copy of the personal information we hold about you. Where possible, we will provide it in CSV or
                    another machine-readable format. You may request that we erase personal information or transfer
                    it to another third party.
                  </p>
                  <p>
                    <span className="font-semibold">Correction:</span> If you believe information we hold is
                    inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us. We will
                    take reasonable steps to correct any inaccurate, incomplete, misleading, or out-of-date
                    information.
                  </p>
                  <p>
                    <span className="font-semibold">Notification of data breaches:</span> We will comply with
                    applicable laws in respect of any data breach.
                  </p>
                  <p>
                    <span className="font-semibold">Complaints:</span> If you believe we have breached data
                    protection law, contact us using the details below. Provide full details so we can investigate.
                    We will respond in writing with the outcome and the steps we will take. You also have the right
                    to contact a regulatory body or data protection authority.
                  </p>
                  <p>
                    <span className="font-semibold">Unsubscribe:</span> To unsubscribe from marketing communications,
                    contact us using the details below or use the opt-out facility in our communications.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">7. Business Transfers</h2>
                <p>
                  If we or our assets are acquired, or if we enter bankruptcy, data may be transferred to parties
                  who acquire us. Those parties may continue to use your personal information according to this
                  policy.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">8. Limits of Our Policy</h2>
                <p>
                  Our website may link to external sites not operated by us. We have no control over their content
                  or policies and cannot accept responsibility for their privacy practices.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-neutral-900 mb-4">9. Changes To This Policy</h2>
                <p>
                  We may change this policy to reflect current practices. We will take reasonable steps to inform
                  users via our website. Continued use of this site after updates constitutes acceptance of the
                  revised policy. Significant changes, such as lawful bases for processing, will prompt us to seek
                  renewed consent where required.
                </p>
              </div>

              <div className="border-t border-neutral-200 pt-8 space-y-2">
                <p className="text-sm text-neutral-500">Lowther Loudspeaker Systems Ltd</p>
                <p className="text-sm text-neutral-500">Data Controller &amp; Data Protection Officer: Martin Thornton</p>
                <p className="text-sm text-neutral-500">
                  <a href="mailto:hello@lowtherloudspeakers.com" className="text-[#c59862] underline underline-offset-4">
                    hello@lowtherloudspeakers.com
                  </a>
                </p>
                <p className="text-sm text-neutral-500">This policy is effective as of 17 September 2019.</p>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}


