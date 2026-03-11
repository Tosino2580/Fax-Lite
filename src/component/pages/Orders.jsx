import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { FaBox, FaArrowLeft, FaCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const statusColors = {
    pending: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
    confirmed: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
    shipped: 'bg-purple-400/10 border-purple-400/20 text-purple-400',
    delivered: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
    cancelled: 'bg-red-400/10 border-red-400/20 text-red-400',
};

const Orders = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/api/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) setOrders(data.orders);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, token, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
                {/* Back + Header */}
                <Link to="/account" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors mb-6">
                    <FaArrowLeft className="text-xs" /> {t('account.backToAccount')}
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('orders.title')}</h1>
                <p className="text-gray-400 text-sm mb-10">{t('orders.subtitle')}</p>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-zinc-800 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-zinc-800 rounded w-1/2 mb-2" />
                                <div className="h-3 bg-zinc-800 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800 flex items-center justify-center mb-5">
                            <FaBox className="text-xl text-gray-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{t('orders.empty')}</h2>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                            {t('orders.emptyDesc')}
                        </p>
                        <Link
                            to="/collections"
                            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider"
                        >
                            {t('orders.startShopping')}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6">
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-800">
                                    <div>
                                        <p className="text-white font-semibold text-sm">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-zinc-500 text-xs mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'long', day: 'numeric', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize w-fit ${statusColors[order.status] || statusColors.pending}`}>
                                        <FaCircle className="text-[5px]" />
                                        {order.status}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="space-y-3 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-zinc-500 text-xs">Size: {item.size} &middot; Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-yellow-400 text-sm font-semibold flex-shrink-0">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                    <p className="text-zinc-400 text-sm">
                                        {order.paymentMethod === 'card' ? 'Card Payment' :
                                         order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                                         'Cash on Delivery'}
                                    </p>
                                    <p className="text-white font-bold text-base">
                                        {formatPrice(order.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
