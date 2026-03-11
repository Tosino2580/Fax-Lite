import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
    FaBox,
    FaChevronDown,
    FaChevronUp,
    FaCircle,
    FaMapMarkerAlt,
    FaCreditCard,
    FaShoppingCart,
    FaSync,
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';

const API_BASE = 'http://localhost:4000';

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        badge: 'bg-amber-400/15 text-amber-400 border border-amber-400/30',
        dot: 'text-amber-400',
    },
    confirmed: {
        label: 'Confirmed',
        badge: 'bg-blue-400/15 text-blue-400 border border-blue-400/30',
        dot: 'text-blue-400',
    },
    shipped: {
        label: 'Shipped',
        badge: 'bg-purple-400/15 text-purple-400 border border-purple-400/30',
        dot: 'text-purple-400',
    },
    delivered: {
        label: 'Delivered',
        badge: 'bg-green-400/15 text-green-400 border border-green-400/30',
        dot: 'text-green-400',
    },
    cancelled: {
        label: 'Cancelled',
        badge: 'bg-red-400/15 text-red-400 border border-red-400/30',
        dot: 'text-red-400',
    },
};

const ALL_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const FILTER_TABS = ['all', ...ALL_STATUSES];

const TERMINAL_STATUSES = ['delivered', 'cancelled'];

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || {
        label: status,
        badge: 'bg-zinc-700 text-zinc-300 border border-zinc-600',
        dot: 'text-zinc-400',
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}
        >
            <FaCircle className={`text-[6px] ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function SkeletonRows() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-800">
                    {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                            <div className="h-4 bg-zinc-800 rounded animate-pulse w-full max-w-[120px]" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

function SkeletonCards() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                        <div className="h-4 bg-zinc-800 rounded animate-pulse w-24" />
                        <div className="h-4 bg-zinc-800 rounded animate-pulse w-16" />
                    </div>
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-40" />
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-32" />
                    <div className="h-8 bg-zinc-800 rounded animate-pulse w-full" />
                </div>
            ))}
        </>
    );
}

function OrderDetail({ order, formatPrice }) {
    return (
        <div className="bg-zinc-900 border-t border-zinc-800 px-4 lg:px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item List */}
                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                        <FaShoppingCart className="text-yellow-400" />
                        Items Ordered
                    </h4>
                    <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 bg-zinc-950 rounded-lg p-3 border border-zinc-800"
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-md border border-zinc-700 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0">
                                            <FaBox className="text-zinc-600 text-lg" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">
                                            {item.name || 'Unnamed product'}
                                        </p>
                                        <p className="text-zinc-500 text-xs mt-0.5">
                                            {item.size && <span>Size: {item.size} · </span>}
                                            Qty: {item.quantity || 1}
                                        </p>
                                    </div>
                                    <p className="text-yellow-400 text-sm font-semibold flex-shrink-0">
                                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-sm">No items found.</p>
                        )}
                    </div>
                </div>

                {/* Shipping & Payment */}
                <div className="space-y-5">
                    {/* Shipping Address */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-yellow-400" />
                            Shipping Address
                        </h4>
                        {order.shippingAddress ? (
                            <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 text-sm text-zinc-300 space-y-1">
                                {order.shippingAddress.fullName && (
                                    <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
                                )}
                                {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                                {(order.shippingAddress.city || order.shippingAddress.state) && (
                                    <p>
                                        {[order.shippingAddress.city, order.shippingAddress.state]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                )}
                                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                                {order.shippingAddress.postalCode && (
                                    <p className="text-zinc-500">{order.shippingAddress.postalCode}</p>
                                )}
                                {order.shippingAddress.phone && (
                                    <p className="text-zinc-400 pt-1">{order.shippingAddress.phone}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                                No shipping address provided.
                            </p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                            <FaCreditCard className="text-yellow-400" />
                            Payment
                        </h4>
                        <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 text-sm">
                            <p className="text-zinc-300">
                                {order.paymentMethod || 'Not specified'}
                            </p>
                            {order.isPaid !== undefined && (
                                <p className={`text-xs mt-1 font-medium ${order.isPaid ? 'text-green-400' : 'text-amber-400'}`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */

export default function AdminOrders() {
    const { adminToken } = useAdmin();
    const { formatPrice } = useCurrency();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    /* ── Fetch Orders ── */
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/orders`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders || []);
            } else {
                toast.error(data.message || 'Failed to load orders');
            }
        } catch {
            toast.error('Network error — could not load orders');
        } finally {
            setLoading(false);
        }
    }, [adminToken]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    /* ── Update Status ── */
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
                );
                toast.success(`Order marked as ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch {
            toast.error('Network error — could not update status');
        } finally {
            setUpdatingId(null);
        }
    };

    /* ── Derived data ── */
    const counts = FILTER_TABS.reduce((acc, tab) => {
        acc[tab] =
            tab === 'all'
                ? orders.length
                : orders.filter((o) => o.status === tab).length;
        return acc;
    }, {});

    const filtered =
        activeFilter === 'all'
            ? orders
            : orders.filter((o) => o.status === activeFilter);

    const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

    /* ── Render ── */
    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Order Management
                    </h2>
                    <p className="text-zinc-500 text-sm mt-0.5">
                        {orders.length} total order{orders.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                    <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* ── Filter Tabs ── */}
            <div className="flex flex-wrap gap-2">
                {FILTER_TABS.map((tab) => {
                    const isActive = activeFilter === tab;
                    const label = tab === 'all' ? 'All' : (STATUS_CONFIG[tab]?.label || tab);
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                                isActive
                                    ? 'bg-yellow-400 text-black border-yellow-400'
                                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                            }`}
                        >
                            {label}
                            <span
                                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                                    isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
                                }`}
                            >
                                {counts[tab] || 0}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden lg:block bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(
                                    (col) => (
                                        <th
                                            key={col}
                                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500"
                                        >
                                            {col}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonRows />
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState filter={activeFilter} />
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order) => {
                                    const isExpanded = expandedId === order._id;
                                    const isTerminal = TERMINAL_STATUSES.includes(order.status);
                                    const isUpdating = updatingId === order._id;
                                    const customerName =
                                        order.user
                                            ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
                                            : 'Guest';
                                    const customerEmail = order.user?.email || '—';

                                    return (
                                        <>
                                            <tr
                                                key={order._id}
                                                onClick={() => toggleExpand(order._id)}
                                                className={`border-b border-zinc-800 cursor-pointer transition-colors ${
                                                    isExpanded
                                                        ? 'bg-zinc-800/40'
                                                        : 'hover:bg-zinc-800/20'
                                                }`}
                                            >
                                                {/* Order ID */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-yellow-400 font-semibold text-xs tracking-wider">
                                                            #{order._id?.slice(0, 8).toUpperCase()}
                                                        </span>
                                                        {isExpanded ? (
                                                            <FaChevronUp className="text-zinc-500 text-[10px]" />
                                                        ) : (
                                                            <FaChevronDown className="text-zinc-500 text-[10px]" />
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="px-4 py-4">
                                                    <p className="text-white font-medium">
                                                        {customerName || 'Unknown'}
                                                    </p>
                                                    <p className="text-zinc-500 text-xs mt-0.5 truncate max-w-[160px]">
                                                        {customerEmail}
                                                    </p>
                                                </td>

                                                {/* Items */}
                                                <td className="px-4 py-4">
                                                    <span className="text-zinc-300">
                                                        {order.items?.length ?? 0}{' '}
                                                        <span className="text-zinc-500 text-xs">
                                                            {order.items?.length === 1 ? 'item' : 'items'}
                                                        </span>
                                                    </span>
                                                </td>

                                                {/* Total */}
                                                <td className="px-4 py-4">
                                                    <span className="text-white font-semibold">
                                                        {formatPrice(order.totalAmount || 0)}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-4">
                                                    <StatusBadge status={order.status} />
                                                </td>

                                                {/* Date */}
                                                <td className="px-4 py-4 text-zinc-400 text-xs whitespace-nowrap">
                                                    {formatDate(order.createdAt)}
                                                </td>

                                                {/* Actions */}
                                                <td
                                                    className="px-4 py-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <StatusSelect
                                                        currentStatus={order.status}
                                                        disabled={isTerminal || isUpdating}
                                                        loading={isUpdating}
                                                        onChange={(s) => handleStatusChange(order._id, s)}
                                                    />
                                                </td>
                                            </tr>

                                            {/* Expandable Detail Row */}
                                            {isExpanded && (
                                                <tr key={`${order._id}-detail`} className="border-b border-zinc-800">
                                                    <td colSpan={7} className="p-0">
                                                        <OrderDetail
                                                            order={order}
                                                            formatPrice={formatPrice}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="lg:hidden space-y-3">
                {loading ? (
                    <SkeletonCards />
                ) : filtered.length === 0 ? (
                    <EmptyState filter={activeFilter} />
                ) : (
                    filtered.map((order) => {
                        const isExpanded = expandedId === order._id;
                        const isTerminal = TERMINAL_STATUSES.includes(order.status);
                        const isUpdating = updatingId === order._id;
                        const customerName =
                            order.user
                                ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
                                : 'Guest';
                        const customerEmail = order.user?.email || '—';

                        return (
                            <div
                                key={order._id}
                                className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
                            >
                                {/* Card Header — tappable */}
                                <button
                                    onClick={() => toggleExpand(order._id)}
                                    className="w-full text-left px-4 py-4 space-y-3 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="font-mono text-yellow-400 font-semibold text-xs tracking-wider">
                                                #{order._id?.slice(0, 8).toUpperCase()}
                                            </span>
                                            <p className="text-white font-medium mt-0.5">
                                                {customerName || 'Unknown'}
                                            </p>
                                            <p className="text-zinc-500 text-xs">{customerEmail}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <StatusBadge status={order.status} />
                                            {isExpanded ? (
                                                <FaChevronUp className="text-zinc-500 text-xs" />
                                            ) : (
                                                <FaChevronDown className="text-zinc-500 text-xs" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">
                                            {order.items?.length ?? 0}{' '}
                                            {order.items?.length === 1 ? 'item' : 'items'}
                                        </span>
                                        <span className="text-white font-semibold">
                                            {formatPrice(order.totalAmount || 0)}
                                        </span>
                                    </div>

                                    <p className="text-zinc-600 text-xs">{formatDate(order.createdAt)}</p>
                                </button>

                                {/* Status Changer */}
                                <div
                                    className="px-4 pb-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <StatusSelect
                                        currentStatus={order.status}
                                        disabled={isTerminal || isUpdating}
                                        loading={isUpdating}
                                        onChange={(s) => handleStatusChange(order._id, s)}
                                        fullWidth
                                    />
                                </div>

                                {/* Expandable Detail */}
                                {isExpanded && (
                                    <OrderDetail order={order} formatPrice={formatPrice} />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

/* ── Status Select Dropdown ── */
function StatusSelect({ currentStatus, disabled, loading, onChange, fullWidth = false }) {
    const [value, setValue] = useState(currentStatus);

    useEffect(() => {
        setValue(currentStatus);
    }, [currentStatus]);

    const handleChange = (e) => {
        const newStatus = e.target.value;
        setValue(newStatus);
        onChange(newStatus);
    };

    return (
        <div className={`relative ${fullWidth ? 'w-full' : 'w-40'}`}>
            <select
                value={value}
                onChange={handleChange}
                disabled={disabled || loading}
                className={`
                    w-full appearance-none text-xs font-medium rounded-lg px-3 py-2 pr-8
                    bg-zinc-800 border border-zinc-700 text-zinc-200
                    focus:outline-none focus:border-yellow-400
                    transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-500'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {ALL_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900">
                        {STATUS_CONFIG[s]?.label || s}
                    </option>
                ))}
            </select>

            {/* Chevron or spinner */}
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                {loading ? (
                    <svg
                        className="animate-spin h-3 w-3 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                ) : (
                    <FaChevronDown className="text-zinc-500 text-[10px]" />
                )}
            </div>
        </div>
    );
}

/* ── Empty State ── */
function EmptyState({ filter }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <FaBox className="text-zinc-600 text-2xl" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">No orders found</h3>
            <p className="text-zinc-500 text-sm max-w-xs">
                {filter === 'all'
                    ? 'No orders have been placed yet. They will appear here once customers start ordering.'
                    : `There are no ${STATUS_CONFIG[filter]?.label?.toLowerCase() || filter} orders at the moment.`}
            </p>
        </div>
    );
}
