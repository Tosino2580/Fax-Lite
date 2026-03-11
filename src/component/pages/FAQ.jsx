import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

const faqData = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery within Lagos takes 1-3 business days. Other states in Nigeria take 3-7 business days. International orders typically arrive within 7-14 business days depending on your location.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is confirmed, you can track it using your Order ID on our Track Order page. You\'ll also receive email updates as your order progresses through each stage.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free shipping on all orders above ₦50,000 within Nigeria. International orders above ₦150,000 also qualify for free shipping.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'You can modify or cancel your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Contact us immediately if you need to make changes.',
      },
      {
        q: 'What shipping carriers do you use?',
        a: 'We partner with GIG Logistics, DHL, and FedEx for reliable delivery. The carrier is selected based on your location and order size to ensure the best service.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept card payments (Visa, Mastercard, Verve) via Paystack, bank transfers, and cash on delivery within Lagos. All card transactions are secured with SSL encryption.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use Paystack, a PCI-DSS compliant payment processor. We never store your card details on our servers. All transactions are encrypted end-to-end.',
      },
      {
        q: 'Can I pay in installments?',
        a: 'Currently, we don\'t offer installment payments directly. However, if your bank supports buy-now-pay-later through your card, those options will work with our payment system.',
      },
      {
        q: 'When will I be charged?',
        a: 'For card payments, you\'re charged immediately upon placing your order. For bank transfers, your order is confirmed once we receive the payment (usually within 1-2 hours).',
      },
    ],
  },
  {
    category: 'Products & Sizing',
    items: [
      {
        q: 'How do I find my correct size?',
        a: 'Each product page includes a detailed size guide. We recommend taking your measurements and comparing them with our size chart. If you\'re between sizes, we generally recommend sizing up for a comfortable fit.',
      },
      {
        q: 'Are the colors accurate to what I see online?',
        a: 'We do our best to photograph products under natural lighting for accurate color representation. However, slight variations may occur due to screen settings. If color accuracy is critical, feel free to contact us for additional photos.',
      },
      {
        q: 'Do you offer custom/bespoke orders?',
        a: 'Yes! We offer bespoke tailoring for select pieces. Contact us through our Contact page with your measurements and preferences, and our team will work with you to create your perfect piece.',
      },
      {
        q: 'How do I care for my garments?',
        a: 'Care instructions are included with every garment. Generally, we recommend dry cleaning for embroidered or beaded pieces, and gentle machine wash for simpler cotton items. Always store garments hanging to maintain their shape.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for items in original condition with tags attached. Items must be unworn, unwashed, and in their original packaging. Bespoke/custom orders are not eligible for return.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our support team via the Contact page or email with your order ID. We\'ll provide you with return instructions and a return authorization. Once we receive and inspect the item, your refund will be processed within 3-5 business days.',
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes! Exchanges are free. Contact us within 7 days of delivery, and we\'ll arrange for the exchange. The new item will be shipped once we receive the original.',
      },
      {
        q: 'Who pays for return shipping?',
        a: 'For defective items or our errors, we cover return shipping. For change-of-mind returns, the customer is responsible for return shipping costs.',
      },
    ],
  },
  {
    category: 'Account',
    items: [
      {
        q: 'Do I need an account to shop?',
        a: 'While you can browse our collection without an account, you\'ll need to create one to place orders. This helps us manage your orders, track deliveries, and provide better customer service.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a password reset link. If you don\'t see the email, check your spam folder or contact support.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Contact our support team and we\'ll process your account deletion within 48 hours. Note that this will remove your order history and saved preferences.',
      },
    ],
  },
];

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className="border border-zinc-800 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition-colors cursor-pointer"
    >
      <span className="text-white text-sm sm:text-base font-medium pr-4">{item.q}</span>
      <FaChevronDown className={`text-yellow-400 text-xs flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="px-5 pb-4 pt-0">
            <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const allCategories = ['All', ...faqData.map(c => c.category)];

  const filteredData = faqData
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        (activeCategory === 'All' || cat.category === activeCategory) &&
        (searchQuery === '' || item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Frequently Asked <span className="text-yellow-400">Questions</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            Everything you need to know about shopping with FAX Collections
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredData.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + ci * 0.05 }}
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {cat.category}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item, ii) => {
                  const key = `${ci}-${ii}`;
                  return (
                    <FAQItem
                      key={key}
                      item={item}
                      isOpen={openItem === key}
                      onToggle={() => setOpenItem(openItem === key ? null : key)}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No results found</p>
            <p className="text-zinc-500 text-sm mt-2">Try a different search term</p>
          </div>
        )}

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-zinc-400 text-sm mb-5">We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.</p>
          <a
            href="/contact"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
