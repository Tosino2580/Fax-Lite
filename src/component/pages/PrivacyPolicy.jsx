import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly to us when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, shipping address, and payment information. We also automatically collect certain information when you visit our site, including your IP address, browser type, and browsing behavior through cookies.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to: process and fulfill orders, communicate with you about your orders and account, send promotional emails (with your consent), improve our website and services, prevent fraud and ensure security, and comply with legal obligations. We never sell your personal information to third parties.',
  },
  {
    title: '3. Payment Security',
    content: 'All payment transactions are processed through Paystack, a PCI-DSS compliant payment gateway. We do not store your credit card details on our servers. Payment information is encrypted using industry-standard SSL technology during transmission.',
  },
  {
    title: '4. Data Sharing',
    content: 'We may share your information with: shipping partners (to deliver your order), payment processors (to complete transactions), and service providers who assist our operations (such as email services). These third parties are obligated to protect your data and may only use it for the specific purpose we\'ve authorized.',
  },
  {
    title: '5. Cookies',
    content: 'We use cookies to enhance your browsing experience, remember your preferences (such as currency and language), maintain your shopping cart, and analyze site traffic. You can control cookies through your browser settings, but disabling them may affect some website functionality.',
  },
  {
    title: '6. Data Retention',
    content: 'We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Account information is kept as long as your account is active. Order records are retained for 5 years for accounting and legal compliance purposes.',
  },
  {
    title: '7. Your Rights',
    content: 'You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal obligations), opt out of marketing communications at any time, and request a copy of your data in a portable format.',
  },
  {
    title: '8. Children\'s Privacy',
    content: 'Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we discover that we have collected data from a minor, we will promptly delete it.',
  },
  {
    title: '9. Security Measures',
    content: 'We implement industry-standard security measures including SSL encryption, secure server infrastructure, regular security audits, and access controls. While we take every reasonable precaution, no method of electronic transmission is 100% secure.',
  },
  {
    title: '10. Changes to This Policy',
    content: 'We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. We encourage you to review this policy regularly. Continued use of our services after changes constitutes acceptance of the updated policy.',
  },
  {
    title: '11. Contact Us',
    content: 'If you have questions about this Privacy Policy or wish to exercise your data rights, contact us at support@faxcollections.com or through our Contact page.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Privacy <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-zinc-500 mt-3 text-sm">Last updated: March 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-5 mb-10 text-center">
          <p className="text-zinc-300 text-sm leading-relaxed">
            At FAX Collections, we are committed to protecting your privacy. This policy explains how we collect,
            use, and safeguard your personal information when you use our website and services.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6"
            >
              <h2 className="text-white font-bold text-base sm:text-lg mb-3">{section.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
