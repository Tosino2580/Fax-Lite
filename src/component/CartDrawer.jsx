import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrashAlt, FaTimes } from 'react-icons/fa';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { useCurrency } from '../context/CurrencyContext';

const CartDrawer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, showCart, setShowCart, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showCart]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${showCart ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setShowCart(false)}
      />

      {/* Cart Panel */}
      <div
        ref={cartRef}
        className={`fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-black border-l border-white/10 text-white z-50 transition-transform duration-300 ease-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MdOutlineShoppingBag className="text-yellow-400 text-xl" />
              <h2 className="text-lg font-bold">{t('cart.title')}</h2>
              <span className="text-xs text-gray-400">({cartItems.length})</span>
            </div>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close cart"
            >
              <FaTimes />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MdOutlineShoppingBag className="text-gray-600 text-5xl mb-4" />
                <p className="text-gray-400 text-lg font-medium">{t('cart.empty')}</p>
                <p className="text-gray-500 text-sm mt-1">{t('cart.emptyHint')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
                    <img src={item.image} alt={item.name} className="w-18 h-18 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{t('cart.size')}: {item.selectedSize} &middot; {t('cart.qty')}: {item.quantity}</p>
                      <p className="text-yellow-400 font-bold text-sm mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer p-2"
                      title="Remove item"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm">{t('cart.subtotal')}</span>
                <span className="text-xl font-bold text-yellow-400">{formatPrice(subtotal)}</span>
              </div>
              <button
                onClick={() => { setShowCart(false); navigate('/checkout'); }}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3.5 font-bold rounded-md transition-colors cursor-pointer uppercase text-sm tracking-wider"
              >
                {t('cart.checkout')}
              </button>
              <button
                onClick={() => setShowCart(false)}
                className="w-full text-gray-400 hover:text-white py-2 mt-2 text-sm transition-colors cursor-pointer"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
