import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { FaCheckCircle, FaBox, FaTruck, FaCreditCard } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const formatPaymentMethod = (method) => {
    if (!method) return 'N/A';
    const map = {
        cod: 'Cash on Delivery',
        cash_on_delivery: 'Cash on Delivery',
        card: 'Card Payment',
        card_payment: 'Card Payment',
        bank_transfer: 'Bank Transfer',
        bank: 'Bank Transfer',
    };
    return map[method.toLowerCase()] || method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const OrderSuccess = () => {
    const { orderId } = useParams();
    const { token } = useAuth();
    const { formatPrice } = useCurrency();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success && data.order) {
                    setOrder(data.order);
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (orderId && token) {
            fetchOrder();
        } else {
            setLoading(false);
            setError(true);
        }
    }, [orderId, token]);

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen pt-28 pb-16 px-4 md:px-10 bg-black text-white">
                <div className="max-w-2xl mx-auto">
                    {/* Checkmark skeleton */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-20 h-20 rounded-full bg-zinc-800 animate-pulse mb-6" />
                        <div className="h-8 w-72 bg-zinc-800 rounded animate-pulse mb-3" />
                        <div className="h-5 w-64 bg-zinc-800 rounded animate-pulse mb-2" />
                        <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    {/* Card skeleton */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-16 h-16 bg-zinc-800 rounded-lg animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
                                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2" />
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-zinc-800 pt-4 space-y-3">
                            <div className="h-4 bg-zinc-800 rounded animate-pulse w-full" />
                            <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3" />
                            <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2" />
                        </div>
                    </div>
                    {/* Buttons skeleton */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <div className="h-12 bg-zinc-800 rounded-lg animate-pulse flex-1" />
                        <div className="h-12 bg-zinc-800 rounded-lg animate-pulse flex-1" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !order) {
        return (
            <div className="min-h-screen pt-28 pb-16 px-4 md:px-10 bg-black text-white">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <FaBox className="text-3xl text-red-400" />
                    </div>
                    <h1
                        className="text-2xl md:text-3xl font-bold mb-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Order Not Found
                    </h1>
                    <p className="text-zinc-400 mb-8">
                        We couldn&apos;t find the order you&apos;re looking for. It may have been removed or the link is
                        invalid.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    const shippingAddress = order.shippingAddress || order.address || {};

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-10 bg-black text-white">
            <div className="max-w-2xl mx-auto">
                {/* Success header */}
                <div className="flex flex-col items-center text-center mb-10">
                    {/* Animated checkmark */}
                    <div className="relative w-20 h-20 mb-6">
                        <div
                            className="absolute inset-0 rounded-full bg-green-500 animate-[scaleIn_0.4s_ease-out_forwards] opacity-0"
                            style={{
                                animation: 'scaleIn 0.4s ease-out forwards',
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white"
                                style={{
                                    animation: 'drawCheck 0.5s ease-out 0.3s forwards',
                                    strokeDasharray: 50,
                                    strokeDashoffset: 50,
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <style>{`
                        @keyframes scaleIn {
                            0% { transform: scale(0); opacity: 0; }
                            60% { transform: scale(1.15); opacity: 1; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        @keyframes drawCheck {
                            to { stroke-dashoffset: 0; }
                        }
                    `}</style>

                    <h1
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Order Placed Successfully!
                    </h1>
                    <p className="text-zinc-400 mb-1">Thank you for shopping with FAX Collections</p>
                    <p className="text-sm text-zinc-500">
                        Order Reference:{' '}
                        <span className="text-yellow-400 font-mono font-semibold">
                            #{orderId.slice(-8).toUpperCase()}
                        </span>
                    </p>
                </div>

                {/* Order details card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
                    {/* Items list */}
                    <div className="flex items-center gap-2 mb-4">
                        <FaBox className="text-yellow-400" />
                        <h2 className="text-lg font-semibold">Order Items</h2>
                    </div>
                    <div className="space-y-4 mb-6">
                        {(order.items || order.products || []).map((item, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                {(item.image || item.productImage) && (
                                    <img
                                        src={item.image || item.productImage}
                                        alt={item.name || item.productName || 'Product'}
                                        className="w-16 h-16 object-cover rounded-lg border border-zinc-800 flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white truncate">
                                        {item.name || item.productName}
                                    </p>
                                    <div className="flex gap-3 text-sm text-zinc-400 mt-0.5">
                                        {item.size && <span>Size: {item.size}</span>}
                                        <span>Qty: {item.quantity || item.qty || 1}</span>
                                    </div>
                                </div>
                                <p className="font-semibold text-yellow-400 flex-shrink-0">
                                    {formatPrice(item.price * (item.quantity || item.qty || 1))}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-zinc-800 my-4" />

                    {/* Shipping address */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaTruck className="text-yellow-400 text-sm" />
                            <h3 className="text-sm font-semibold text-zinc-300">Shipping Address</h3>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed pl-6">
                            {shippingAddress.fullName || shippingAddress.name || ''}
                            {(shippingAddress.fullName || shippingAddress.name) && <br />}
                            {shippingAddress.address || shippingAddress.street || ''}
                            {(shippingAddress.address || shippingAddress.street) && ', '}
                            {shippingAddress.city || ''}
                            {shippingAddress.city && ', '}
                            {shippingAddress.state || ''}
                            {shippingAddress.state && ' '}
                            {shippingAddress.zip || shippingAddress.postalCode || ''}
                            {(shippingAddress.zip || shippingAddress.postalCode) && <br />}
                            {shippingAddress.country || ''}
                            {shippingAddress.phone && (
                                <>
                                    <br />
                                    {shippingAddress.phone}
                                </>
                            )}
                        </p>
                    </div>

                    {/* Payment method */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCreditCard className="text-yellow-400 text-sm" />
                            <h3 className="text-sm font-semibold text-zinc-300">Payment Method</h3>
                        </div>
                        <p className="text-sm text-zinc-400 pl-6">
                            {formatPaymentMethod(order.paymentMethod)}
                        </p>
                    </div>

                    {/* Order status */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCheckCircle className="text-yellow-400 text-sm" />
                            <h3 className="text-sm font-semibold text-zinc-300">Order Status</h3>
                        </div>
                        <div className="pl-6">
                            <span
                                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                                    statusColors[order.status?.toLowerCase()] ||
                                    'bg-zinc-800 text-zinc-300 border-zinc-700'
                                }`}
                            >
                                {order.status
                                    ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
                                    : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 my-4" />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-300 font-semibold">Total Amount</span>
                        <span className="text-xl font-bold text-yellow-400">
                            {formatPrice(order.totalAmount || order.total || 0)}
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/account/orders"
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <FaTruck />
                        Track My Order
                    </Link>
                    <Link
                        to="/collections"
                        className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 hover:border-yellow-500/50 hover:text-yellow-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
