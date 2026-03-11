import { motion } from 'framer-motion';
import { FaTruck, FaGlobeAfrica, FaBoxOpen, FaShieldAlt } from 'react-icons/fa';

export default function DeliveryPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Delivery <span className="text-yellow-400">Policy</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            Fast, reliable delivery across Nigeria and worldwide
          </p>
        </motion.div>

        {/* Delivery Zones */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-zinc-800">
            <h2 className="text-white font-bold text-base flex items-center gap-2"><FaTruck className="text-yellow-400" /> Delivery Timelines & Rates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <th className="text-left px-6 py-3 font-medium">Zone</th>
                  <th className="text-left px-6 py-3 font-medium">Timeline</th>
                  <th className="text-left px-6 py-3 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr className="hover:bg-zinc-900/80 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">Lagos</td>
                  <td className="px-6 py-4 text-zinc-400">1-3 business days</td>
                  <td className="px-6 py-4 text-zinc-400">₦2,000 - ₦3,500</td>
                </tr>
                <tr className="hover:bg-zinc-900/80 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">Other Nigerian States</td>
                  <td className="px-6 py-4 text-zinc-400">3-7 business days</td>
                  <td className="px-6 py-4 text-zinc-400">₦3,500 - ₦5,000</td>
                </tr>
                <tr className="hover:bg-zinc-900/80 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">West Africa</td>
                  <td className="px-6 py-4 text-zinc-400">5-10 business days</td>
                  <td className="px-6 py-4 text-zinc-400">₦8,000 - ₦15,000</td>
                </tr>
                <tr className="hover:bg-zinc-900/80 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">International</td>
                  <td className="px-6 py-4 text-zinc-400">7-14 business days</td>
                  <td className="px-6 py-4 text-zinc-400">₦15,000 - ₦30,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Free Shipping Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-2xl p-6 mb-8 text-center">
          <p className="text-yellow-400 font-bold text-lg">Free Shipping</p>
          <p className="text-zinc-400 text-sm mt-1">On all Nigerian orders above ₦50,000 & international orders above ₦150,000</p>
        </motion.div>

        {/* Info Sections */}
        <div className="space-y-6">
          {[
            {
              icon: FaBoxOpen,
              title: 'Order Processing',
              content: 'Orders are processed within 1-2 business days (Monday - Friday). Orders placed on weekends or public holidays will be processed the next business day. You\'ll receive a confirmation email once your order is shipped with tracking information.',
            },
            {
              icon: FaGlobeAfrica,
              title: 'International Shipping',
              content: 'We ship to over 30 countries worldwide through our trusted partners DHL and FedEx. International orders may be subject to customs duties and taxes, which are the responsibility of the buyer. We ensure all items are properly documented to minimize customs issues.',
            },
            {
              icon: FaTruck,
              title: 'Tracking Your Order',
              content: 'Once shipped, you\'ll receive tracking details via email. You can also track your order at any time on our Track Order page using your Order ID. Our system updates in real-time as your package moves through each delivery stage.',
            },
            {
              icon: FaShieldAlt,
              title: 'Delivery Issues',
              content: 'If your package is damaged during delivery, please take photos and contact us immediately. We\'ll arrange a replacement or refund. If your package hasn\'t arrived within the expected timeframe, reach out to us and we\'ll investigate with the shipping carrier.',
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6"
            >
              <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                <section.icon className="text-yellow-400 text-sm" /> {section.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
