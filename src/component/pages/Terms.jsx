import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Introduction',
    content: 'Welcome to FAX Collections. These Terms & Conditions govern your use of our website and the purchase of products from our store. By accessing our website or placing an order, you agree to be bound by these terms. Please read them carefully before proceeding.',
  },
  {
    title: '2. Account Registration',
    content: 'To make purchases, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 18 years old to create an account and make purchases.',
  },
  {
    title: '3. Products & Pricing',
    content: 'All product descriptions, images, and specifications are provided as accurately as possible. However, we do not guarantee that all descriptions are entirely error-free. Prices are displayed in Nigerian Naira (NGN) and may also be shown in other currencies for convenience. We reserve the right to modify prices at any time without prior notice, but changes will not affect orders already confirmed.',
  },
  {
    title: '4. Orders & Payment',
    content: 'An order is considered confirmed once payment has been received and verified. We accept card payments (via Paystack), bank transfers, and cash on delivery (Lagos only). All card transactions are processed securely through our PCI-compliant payment partner. We reserve the right to refuse or cancel any order at our discretion, including orders suspected of fraud.',
  },
  {
    title: '5. Shipping & Delivery',
    content: 'We aim to process and ship orders within 1-3 business days. Delivery timelines vary by location: 1-3 days within Lagos, 3-7 days for other Nigerian states, and 7-14 days for international orders. Delivery times are estimates and not guarantees. FAX Collections is not liable for delays caused by shipping carriers or customs processing.',
  },
  {
    title: '6. Returns & Refunds',
    content: 'Returns are accepted within 7 days of delivery for items in original condition with tags attached. Items must be unworn, unwashed, and in original packaging. Bespoke/custom orders are non-refundable. Refunds are processed within 3-5 business days after we receive and inspect the returned item. Shipping costs for change-of-mind returns are borne by the customer.',
  },
  {
    title: '7. Intellectual Property',
    content: 'All content on this website, including designs, logos, images, text, and graphics, is the intellectual property of FAX Collections and is protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'FAX Collections shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount paid for the specific product in question.',
  },
  {
    title: '9. Privacy',
    content: 'Your personal data is collected and processed in accordance with our Privacy Policy. By using our website, you consent to our data practices as described in the Privacy Policy.',
  },
  {
    title: '10. Changes to Terms',
    content: 'We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with the updated date. Continued use of our website after changes constitutes acceptance of the revised terms.',
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Terms & <span className="text-yellow-400">Conditions</span>
          </h1>
          <p className="text-zinc-500 mt-3 text-sm">Last updated: March 2026</p>
        </motion.div>

        <div className="space-y-8">
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
