import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FaUser, FaBox, FaHeart, FaTag, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Account = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const menuItems = [
        { label: t('nav.myAccount'), description: t('account.personalInfo'), icon: FaUser, path: '/account', active: true },
        { label: t('nav.orders'), description: t('account.trackOrders'), icon: FaBox, path: '/account/orders', count: 0 },
        { label: t('nav.wishlist'), description: t('account.savedItems'), icon: FaHeart, path: '/account/wishlist', count: wishlistItems.length },
        { label: t('nav.vouchers'), description: t('account.discounts'), icon: FaTag, path: '/account/vouchers', count: 0 },
    ];

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold">{t('account.title')}</h1>
                    <p className="text-gray-400 mt-2 text-sm">{t('account.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400 flex items-center justify-center text-black text-3xl font-bold">
                                {user.firstName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-lg font-semibold mt-4">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-400 text-sm mt-1">{user.email}</p>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="bg-zinc-800 rounded-xl p-3">
                                    <p className="text-xl font-bold text-yellow-400">{cartItems.length}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('account.inCart')}</p>
                                </div>
                                <div className="bg-zinc-800 rounded-xl p-3">
                                    <p className="text-xl font-bold text-yellow-400">{wishlistItems.length}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{t('account.wishlist')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu & Info */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Navigation Cards */}
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group ${
                                    item.active
                                        ? 'bg-yellow-400/10 border-yellow-400/30'
                                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    item.active ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-gray-400 group-hover:text-yellow-400'
                                }`}>
                                    <item.icon className="text-sm" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                                {item.count > 0 && (
                                    <span className="bg-yellow-400 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                        {item.count}
                                    </span>
                                )}
                                <FaChevronRight className="text-gray-600 text-xs flex-shrink-0" />
                            </Link>
                        ))}

                        {/* Personal Details */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{t('account.personalDetails')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{t('account.firstName')}</p>
                                    <p className="text-sm font-medium">{user.firstName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">{t('account.lastName')}</p>
                                    <p className="text-sm font-medium">{user.lastName}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">{t('account.email')}</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="flex items-center gap-3 w-full p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <FaSignOutAlt className="text-red-400 text-sm" />
                            </div>
                            <p className="text-sm font-semibold text-red-400">{t('nav.signOut')}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
