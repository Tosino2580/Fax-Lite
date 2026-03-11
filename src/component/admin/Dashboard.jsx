import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaRedo,
  FaInbox,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
};

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────
const Shimmer = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl bg-zinc-800 ${className}`}
    style={{ backgroundImage: 'linear-gradient(90deg,#27272a 25%,#3f3f46 50%,#27272a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }}
  />
);

const SkeletonCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-10 w-10 rounded-full" />
        </div>
        <Shimmer className="h-8 w-32" />
        <Shimmer className="h-3 w-20" />
      </div>
    ))}
  </div>
);

const SkeletonTable = () => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4">
    <Shimmer className="h-5 w-40 mb-6" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4">
        {[...Array(4)].map((__, j) => (
          <Shimmer key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-400/10', text: 'text-yellow-400',  border: 'border-yellow-400/30'  },
  confirmed: { label: 'Confirmed', bg: 'bg-blue-400/10',   text: 'text-blue-400',    border: 'border-blue-400/30'    },
  shipped:   { label: 'Shipped',   bg: 'bg-purple-400/10', text: 'text-purple-400',  border: 'border-purple-400/30'  },
  delivered: { label: 'Delivered', bg: 'bg-green-400/10',  text: 'text-green-400',   border: 'border-green-400/30'   },
  cancelled: { label: 'Cancelled', bg: 'bg-red-400/10',    text: 'text-red-400',     border: 'border-red-400/30'     },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} capitalize`}>
      {cfg.label}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, iconBg, custom }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    custom={custom}
    whileHover={{ scale: 1.03 }}
    className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 cursor-default select-none
               shadow-lg hover:border-zinc-700 transition-colors"
  >
    <div className="flex items-center justify-between">
      <p className="text-xs sm:text-sm text-zinc-400 font-medium">{label}</p>
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${iconBg}`}>
        <Icon className="text-base sm:text-lg" />
      </div>
    </div>
    <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">{value}</p>
    <div className="h-px bg-zinc-800" />
  </motion.div>
);

// ─── Mobile Order Card ────────────────────────────────────────────────────────
const MobileOrderCard = ({ order, index, formatPrice }) => {
  const orderId = order._id ?? order.id ?? '';
  const customer =
    order.user?.name ??
    order.customerName ??
    order.shippingAddress?.fullName ??
    'Unknown';
  const items =
    Array.isArray(order.items)
      ? order.items.reduce((acc, it) => acc + (it.quantity ?? 1), 0)
      : order.itemCount ?? '-';
  const total = order.totalAmount ?? order.total ?? 0;
  const status = order.status ?? 'pending';
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="bg-zinc-900/50 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-yellow-400/80 text-xs">
          #{orderId ? orderId.slice(-8).toUpperCase() : '—'}
        </span>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white font-medium text-sm truncate max-w-[160px]">{customer}</span>
        <span className="text-zinc-500 text-xs">{date}</span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
        <span className="text-zinc-400 text-xs">
          {items} {typeof items === 'number' ? (items === 1 ? 'item' : 'items') : ''}
        </span>
        <span className="text-white font-semibold text-sm">{formatPrice(total)}</span>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { adminToken } = useAdmin();
  const { formatPrice, currencies, currencyCode, changeCurrency } = useCurrency();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load dashboard');
      setStats(data.stats);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 p-3 sm:p-6">
        <div>
          <Shimmer className="h-7 w-52 mb-2" />
          <Shimmer className="h-4 w-72" />
        </div>
        <SkeletonCards />
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-3">
          <Shimmer className="h-5 w-44 mb-4" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => <Shimmer key={i} className="h-10 flex-1 rounded-xl" />)}
          </div>
        </div>
        <SkeletonTable />
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 p-4 sm:p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
            <FaInbox className="text-red-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-white">Failed to load dashboard</h3>
          <p className="text-sm text-zinc-400">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchDashboard}
            className="mt-2 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            <FaRedo className="text-xs" />
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  const {
    totalUsers = 0,
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
    recentOrders = [],
    ordersByStatus = {},
  } = stats ?? {};

  const statusEntries = Object.entries(ordersByStatus).filter(([, count]) => count > 0);

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      <div className="space-y-5 sm:space-y-8 p-1 sm:p-2 md:p-0">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">Welcome back — here&apos;s what&apos;s happening today.</p>
        </motion.div>

        {/* ── 1. Stats Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          {/* Revenue card — with currency switcher */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            whileHover={{ scale: 1.03 }}
            className="col-span-2 sm:col-span-1 bg-zinc-950 border border-yellow-400/20 rounded-2xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 cursor-default select-none
                       shadow-lg hover:border-yellow-400/40 transition-colors relative"
            style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(250,204,21,0.07) 0%, transparent 60%)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">Total Revenue</p>
              {/* Currency switcher */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCurrencyDropdown(prev => !prev); }}
                  className="flex items-center gap-1 sm:gap-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer"
                >
                  {currencies[currencyCode]?.symbol} {currencyCode}
                  <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCurrencyDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCurrencyDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-20 py-1 min-w-[120px] sm:min-w-[140px] max-h-[200px] overflow-y-auto">
                      {Object.entries(currencies).map(([code, cur]) => (
                        <button
                          key={code}
                          onClick={(e) => {
                            e.stopPropagation();
                            changeCurrency(code);
                            setShowCurrencyDropdown(false);
                          }}
                          className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer ${
                            code === currencyCode
                              ? 'bg-yellow-400/10 text-yellow-400 font-semibold'
                              : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          <span className="w-4 sm:w-5 text-center">{cur.symbol}</span>
                          <span>{code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 tracking-tight leading-none break-all">
              {formatPrice(totalRevenue)}
            </p>
            <div className="h-px bg-zinc-800" />
          </motion.div>

          <StatCard icon={FaBox}        label="Total Orders"    value={totalOrders.toLocaleString()}   iconBg="bg-blue-400/20"   custom={1} />
          <StatCard icon={FaShoppingBag} label="Total Products" value={totalProducts.toLocaleString()} iconBg="bg-purple-400/20" custom={2} />
          <StatCard icon={FaUsers}      label="Total Customers" value={totalUsers.toLocaleString()}    iconBg="bg-green-400/20"  custom={3} />
        </div>

        {/* ── 2. Order Status Breakdown ───────────────────────────────────── */}
        {statusEntries.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6"
          >
            <h2 className="text-sm sm:text-base font-semibold text-white mb-4 sm:mb-5">Order Status Breakdown</h2>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {statusEntries.map(([status, count]) => {
                const cfg = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' };
                return (
                  <motion.div
                    key={status}
                    whileHover={{ scale: 1.06 }}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl border ${cfg.bg} ${cfg.border} cursor-default select-none`}
                  >
                    <span className={`text-xl sm:text-2xl font-bold ${cfg.text}`}>{count}</span>
                    <span className={`text-xs sm:text-sm font-medium ${cfg.text} opacity-80 capitalize`}>{cfg.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── 3. Recent Orders ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-zinc-800">
            <h2 className="text-sm sm:text-base font-semibold text-white">Recent Orders</h2>
            {recentOrders.length > 0 && (
              <Link
                to="/admin/orders"
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                View All
                <FaExternalLinkAlt className="text-[8px] sm:text-[10px]" />
              </Link>
            )}
          </div>

          {recentOrders.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-4 text-center px-4 sm:px-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-800 flex items-center justify-center">
                <FaBox className="text-zinc-600 text-xl sm:text-2xl" />
              </div>
              <p className="text-zinc-400 font-medium text-sm sm:text-base">No orders yet</p>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-xs">Orders placed by customers will appear here once they start coming in.</p>
            </div>
          ) : (
            <>
              {/* Mobile: Card layout */}
              <div className="md:hidden p-3 space-y-3">
                {recentOrders.slice(0, 5).map((order, i) => (
                  <MobileOrderCard key={order._id ?? order.id ?? i} order={order} index={i} formatPrice={formatPrice} />
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="text-left px-6 py-3 font-medium">Order ID</th>
                      <th className="text-left px-6 py-3 font-medium">Customer</th>
                      <th className="text-left px-6 py-3 font-medium">Items</th>
                      <th className="text-left px-6 py-3 font-medium">Total</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {recentOrders.slice(0, 5).map((order, i) => {
                      const orderId = order._id ?? order.id ?? '';
                      const customer =
                        order.user?.name ??
                        order.customerName ??
                        order.shippingAddress?.fullName ??
                        'Unknown';
                      const items =
                        Array.isArray(order.items)
                          ? order.items.reduce((acc, it) => acc + (it.quantity ?? 1), 0)
                          : order.itemCount ?? '-';
                      const total = order.totalAmount ?? order.total ?? 0;
                      const status = order.status ?? 'pending';
                      const date = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—';

                      return (
                        <motion.tr
                          key={orderId || i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.3 }}
                          className="hover:bg-zinc-900/60 transition-colors group"
                        >
                          <td className="px-6 py-4 font-mono text-yellow-400/80 text-xs">
                            #{orderId ? orderId.slice(-8).toUpperCase() : '—'}
                          </td>
                          <td className="px-6 py-4 text-white font-medium truncate max-w-[140px]">
                            {customer}
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {items} {typeof items === 'number' ? (items === 1 ? 'item' : 'items') : ''}
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">
                            {formatPrice(total)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                            {date}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-800">
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  View All Orders
                  <FaExternalLinkAlt className="text-[10px] sm:text-xs" />
                </Link>
              </div>
            </>
          )}
        </motion.div>

      </div>
    </>
  );
}
