import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ProductData } from '../productData/ProductData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import RecentlyViewed from './RecentlyViewed';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [apiProduct, setApiProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Try local data first
  const localProduct = ProductData.find(item => item.id === id);

  // If not found locally, fetch from API
  useEffect(() => {
    if (!localProduct) {
      setLoading(true);
      fetch(`${API_URL}/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.product) {
            const p = data.product;
            setApiProduct({
              id: p._id,
              name: p.name,
              description: p.description,
              price: p.price,
              oldPrice: p.oldPrice || null,
              inStock: p.inStock,
              sizes: p.sizes || [],
              image: p.images?.[0] || '',
              hoverImage: p.images?.[1] || p.images?.[0] || '',
              images: p.images || [],
              badge: p.badge ? p.badge.replace(/"/g, '') : 'New',
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, localProduct]);

  const product = localProduct || apiProduct;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const scrollRef = useRef(null);
  const { addToCart, setShowCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { addRecentlyViewed } = useRecentlyViewed();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold text-gray-400">{t('product.notFound')}</p>
          <Link to="/" className="inline-block text-yellow-400 hover:text-yellow-300 underline underline-offset-4">
            {t('product.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.hoverImage].filter(Boolean);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size!", {
        duration: 3000,
        style: {
          border: '1px solid #facc15',
          padding: '16px',
          color: 'black',
          fontWeight: 'bold',
          backgroundColor: '#fef08a',
        },
        iconTheme: { primary: '#facc15', secondary: '#fff' },
      });
      return;
    }

    addToCart(product, selectedSize, quantity);
    setShowCart(false);
    toast.success("Item added to cart!", {
      duration: 3000,
      style: {
        border: '1px solid #4ade80',
        padding: '16px',
        color: '#000',
        backgroundColor: '#bbf7d0',
      },
      iconTheme: { primary: '#22c55e', secondary: '#fff' },
    });
  };

  // Track this product as recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product?.id]);

  const stockPercent = Math.min(100, Math.max(5, (product.inStock / 20) * 100));

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-10">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-yellow-400 transition-colors">{t('product.home')}</Link>
        <FaChevronRight className="w-2.5 h-2.5" />
        <Link to="/collections" className="hover:text-yellow-400 transition-colors">Collections</Link>
        <FaChevronRight className="w-2.5 h-2.5" />
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Left section - Images */}
        <div className="flex gap-4 lg:w-1/2">
          {/* Desktop Thumbnails */}
          <div className="hidden md:flex gap-4">
            <div className="flex flex-col gap-3">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-24 rounded-lg cursor-pointer border-2 object-cover transition-all duration-200 ${
                    currentImageIndex === idx
                      ? 'border-yellow-400 opacity-100'
                      : 'border-zinc-700 opacity-60 hover:opacity-90'
                  }`}
                />
              ))}
            </div>

            <div className="relative w-[400px] h-[500px] md:h-[600px] overflow-hidden rounded-2xl bg-zinc-900">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2.5 rounded-full transition-colors"
              >
                <FaChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2.5 rounded-full transition-colors"
              >
                <FaChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Images */}
          <div
            ref={scrollRef}
            onScroll={() => {
              const el = scrollRef.current;
              if (el) setCurrentImageIndex(Math.round(el.scrollLeft / el.offsetWidth));
            }}
            className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-4 scroll-smooth no-scrollbar"
          >
            {images.map((img, index) => (
              <div key={index} className="flex-shrink-0 w-full snap-center">
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-[500px] object-cover rounded-2xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Dot Indicators */}
        <div className="flex justify-center mt-4 gap-2 md:hidden">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? 'bg-yellow-400 w-6' : 'bg-zinc-600'
              }`}
            />
          ))}
        </div>

        {/* Right section - Product Info */}
        <div className="flex-1 space-y-6 lg:pt-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>

          {/* Stock indicator */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              {t('product.onlyLeft', { count: product.inStock })}
            </p>
            <div className="w-full max-w-xs h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${stockPercent}%` }}
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-yellow-400 font-cinzel">
              {formatPrice(product.price)}
            </span>
            <span className="line-through text-gray-500 text-lg">
              {formatPrice(product.oldPrice)}
            </span>
            <span className="text-sm bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {t('product.off')}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Size selection */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t('product.size')} {selectedSize && <span className="text-yellow-400 normal-case">— {selectedSize}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    selectedSize === size
                      ? 'bg-yellow-400 text-black ring-2 ring-yellow-400/50'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selection */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">{t('product.qty')}</p>
            <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors text-lg cursor-pointer"
              >
                −
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-zinc-700">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors text-lg cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart + Wishlist */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 md:flex-none md:min-w-[280px] bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3.5 px-8 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(250,204,21,0.3)] cursor-pointer text-sm uppercase tracking-wider"
            >
              {t('product.addToCart')} — {formatPrice(product.price * quantity)}
            </button>
            <button
              onClick={() => {
                const wishlisted = isInWishlist(product.id, 'Collections');
                if (wishlisted) {
                  removeFromWishlist(product.id, 'Collections');
                  toast.success(t('product.removedFromWishlist'));
                } else {
                  addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, route: `/products/${product.id}`, category: 'Collections' });
                  toast.success(t('product.addedToWishlist'));
                }
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
                isInWishlist(product.id, 'Collections')
                  ? 'border-red-500/50 bg-red-500/10 text-red-500'
                  : 'border-zinc-700 hover:border-zinc-500 text-gray-400 hover:text-red-400'
              }`}
            >
              {isInWishlist(product.id, 'Collections') ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}

export default ProductDetails;
