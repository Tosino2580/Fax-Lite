import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaCheckCircle, FaBox, FaTruck, FaHome, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: FaClock, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: FaCheckCircle, desc: 'Order confirmed & being prepared' },
  { key: 'shipped', label: 'Shipped', icon: FaTruck, desc: 'Your order is on its way' },
  { key: 'delivered', label: 'Delivered', icon: FaHome, desc: 'Order delivered successfully' },
];

function getStepIndex(status) {
  const idx = STEPS.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function TrackOrder() {
  const { formatPrice } = useCurrency();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async () => {
    const id = orderId.trim().replace(/^#/, '');
    if (!id) {
      setError('Please enter an order ID');
      return;
    }
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`${API_URL}/api/orders/track/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Order not found');
      setOrder(data.order);
    } catch (err) {
      setError(err.message || 'Could not find that order. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = order?.status === 'cancelled';
  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Track Your <span className="text-yellow-400">Order</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            Enter your order ID to see real-time status updates
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-8"
        >
          <label className="text-zinc-300 text-sm font-medium mb-3 block">Order ID</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. 6789abcd or #6789ABCD"
              className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-colors"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <FaSearch className="text-xs" />
              )}
              Track
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

          <p className="text-zinc-600 text-xs mt-4">
            You can find your order ID in your order confirmation email or on your Orders page.
          </p>
        </motion.div>

        {/* Order Result */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Order Info Card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Order ID</p>
                  <p className="text-yellow-400 font-mono font-bold">#{(order._id || order.id || '').slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Placed On</p>
                  <p className="text-white text-sm font-medium">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              {isCancelled ? (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <FaTimesCircle className="text-red-400 text-xl flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Order Cancelled</p>
                    <p className="text-zinc-500 text-xs mt-0.5">This order has been cancelled. Contact support for more details.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-zinc-800 sm:hidden" />
                  <div className="hidden sm:block absolute top-5 left-5 right-5 h-0.5 bg-zinc-800" />

                  {/* Mobile: Vertical Timeline */}
                  <div className="sm:hidden space-y-0">
                    {STEPS.map((step, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isCompleted ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-600'
                          } ${isCurrent ? 'ring-4 ring-yellow-400/20' : ''}`}>
                            <step.icon className="text-sm" />
                          </div>
                          <div className="pb-8">
                            <p className={`font-semibold text-sm ${isCompleted ? 'text-white' : 'text-zinc-600'}`}>{step.label}</p>
                            <p className={`text-xs mt-0.5 ${isCompleted ? 'text-zinc-400' : 'text-zinc-700'}`}>{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop: Horizontal Timeline */}
                  <div className="hidden sm:grid grid-cols-4 gap-2 relative">
                    {/* Completed progress line */}
                    <div
                      className="absolute top-5 left-5 h-0.5 bg-yellow-400 transition-all duration-700"
                      style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 20px)` }}
                    />
                    {STEPS.map((step, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-600'
                          } ${isCurrent ? 'ring-4 ring-yellow-400/20' : ''}`}>
                            <step.icon className="text-sm" />
                          </div>
                          <p className={`font-semibold text-xs mt-3 ${isCompleted ? 'text-white' : 'text-zinc-600'}`}>{step.label}</p>
                          <p className={`text-[10px] mt-0.5 ${isCompleted ? 'text-zinc-400' : 'text-zinc-700'}`}>{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Order Items</h3>
              <div className="space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-zinc-800/30 rounded-xl p-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-zinc-500 text-xs">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 mt-4 pt-4 flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Total</span>
                <span className="text-yellow-400 font-bold text-lg">{formatPrice(order.totalAmount || order.total || 0)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-sm mb-3">Shipping Address</h3>
                <div className="text-zinc-400 text-sm space-y-1">
                  <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Help text when no order searched */}
        {!order && !loading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-8">
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-zinc-600 text-2xl" />
            </div>
            <p className="text-zinc-500 text-sm">Enter your order ID above to track your package</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
