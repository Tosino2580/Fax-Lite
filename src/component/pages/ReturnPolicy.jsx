import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaBoxOpen, FaExchangeAlt, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Return <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            We want you to be completely satisfied with your purchase
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: FaBoxOpen, label: '7-Day Returns', desc: 'From delivery date' },
            { icon: FaExchangeAlt, label: 'Free Exchanges', desc: 'On all orders' },
            { icon: FaMoneyBillWave, label: '3-5 Day Refunds', desc: 'After inspection' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="text-yellow-400 text-sm" />
              </div>
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Eligible / Not Eligible */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-green-400 font-bold text-sm mb-4 flex items-center gap-2">
              <FaCheckCircle /> Eligible for Return
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              {[
                'Items returned within 7 days of delivery',
                'Unworn and unwashed items',
                'Items with original tags still attached',
                'Items in original packaging',
                'Defective or damaged items (any time)',
                'Wrong item received',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-red-400 font-bold text-sm mb-4 flex items-center gap-2">
              <FaTimesCircle /> Not Eligible
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              {[
                'Custom/bespoke orders',
                'Items worn or washed',
                'Items without original tags',
                'Items returned after 7 days',
                'Sale/clearance items (unless defective)',
                'Undergarments or intimate wear',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-10">
          <h3 className="text-white font-bold text-base mb-5">How to Return</h3>
          <div className="space-y-5">
            {[
              { step: 1, title: 'Contact Us', desc: 'Reach out via our Contact page or email with your Order ID and reason for return.' },
              { step: 2, title: 'Get Authorization', desc: 'We\'ll review your request and provide a Return Authorization (RA) number within 24 hours.' },
              { step: 3, title: 'Ship the Item', desc: 'Pack the item securely in original packaging and ship to the address we provide. Include the RA number.' },
              { step: 4, title: 'Receive Refund', desc: 'Once we receive and inspect the item, your refund will be processed within 3-5 business days to your original payment method.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-zinc-400 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
            <FaHeadset className="text-yellow-400" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold">Need Help with a Return?</p>
            <p className="text-zinc-400 text-sm mt-1">Our support team is here to help. Reach out anytime.</p>
          </div>
          <a href="/contact" className="sm:ml-auto bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex-shrink-0">
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
