import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FaHeart, FaArrowLeft, FaTimes, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const Wishlist = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleMoveToCart = (item) => {
        addToCart(
            { id: item.id, name: item.name, price: item.price, image: item.image },
            'M',
            1
        );
        removeFromWishlist(item.id, item.category);
        toast.success(t('wishlistPage.movedToCart'));
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">
                {/* Back + Header */}
                <Link to="/account" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors mb-6">
                    <FaArrowLeft className="text-xs" /> {t('account.backToAccount')}
                </Link>
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('wishlistPage.title')}</h1>
                        <p className="text-gray-400 text-sm">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
                    </div>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800 flex items-center justify-center mb-5">
                            <FaHeart className="text-xl text-gray-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{t('wishlistPage.empty')}</h2>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                            {t('wishlistPage.emptyDesc')}
                        </p>
                        <Link
                            to="/collections"
                            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider"
                        >
                            {t('wishlistPage.explore')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wishlistItems.map((item) => (
                            <div key={`${item.category}-${item.id}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
                                <Link to={item.route} className="block">
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <span className="text-[10px] uppercase tracking-wider text-yellow-400/70">{item.category}</span>
                                    <h3 className="text-sm font-semibold mt-1">{item.name}</h3>
                                    <p className="text-yellow-400 font-cinzel font-bold text-sm mt-1">
                                        {formatPrice(item.price)}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <FaShoppingCart className="text-xs" /> Add to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id, item.category)}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-700 hover:border-red-500/50 hover:bg-red-500/10 transition-colors cursor-pointer"
                                        >
                                            <FaTimes className="text-xs text-gray-400 hover:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
