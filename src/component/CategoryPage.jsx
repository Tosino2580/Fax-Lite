import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaEye, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ProductCard = ({ product, basePath, categoryName }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const category = categoryName || 'Collections';
  const wishlisted = isInWishlist(product.id, category);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id, category);
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, route: `${basePath}/${product.id}`, category });
    }
  };

  return (
    <div className="group">
      <Link to={`${basePath}/${product.id}`}>
        <div
          className="relative overflow-hidden rounded-2xl bg-zinc-900"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] md:h-[480px] object-cover"
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          <motion.img
            src={product.hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-[400px] md:h-[480px] object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          {/* Badge */}
          {product.badge !== false && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {product.badge || 'New'}
            </span>
          )}

          {/* Wishlist Heart */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm p-2 rounded-full cursor-pointer shadow-lg hover:bg-black/60 transition-colors z-10"
          >
            {wishlisted
              ? <FaHeart size={14} className="text-red-500" />
              : <FaRegHeart size={14} className="text-white" />
            }
          </button>

          {/* Hover Actions */}
          <div
            className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 p-4 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors cursor-pointer">
              <FaEye size={14} className="text-gray-800" />
            </button>
            <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors cursor-pointer">
              <FaShoppingCart size={14} className="text-gray-800" />
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm md:text-base font-semibold uppercase tracking-wide">{product.name}</h3>
        <p className="text-yellow-400 font-cinzel font-bold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

const CategoryPage = ({ title, breadcrumbLabel, products = [], basePath, categoryName, apiCategory }) => {
  const [apiProducts, setApiProducts] = useState([]);

  useEffect(() => {
    if (!apiCategory) return;
    fetch(`${API_URL}/api/products?category=${apiCategory}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const localIds = new Set(products.map(p => p.id));
          const fresh = data.products
            .filter(p => !localIds.has(p._id))
            .map(p => ({
              id: p._id,
              name: p.name,
              price: p.price,
              oldPrice: p.oldPrice || null,
              image: p.images?.[0] || '',
              hoverImage: p.images?.[1] || p.images?.[0] || '',
              badge: p.badge || false,
              inStock: p.inStock,
              sizes: p.sizes || [],
            }));
          setApiProducts(fresh);
        }
      })
      .catch(() => {});
  }, [apiCategory]);

  const allProducts = [...products, ...apiProducts];

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        <nav className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <FaChevronRight className="w-2.5 h-2.5" />
          <span className="text-white">{breadcrumbLabel || title}</span>
        </nav>
        <p className="text-gray-500 text-sm">{allProducts.length} product{allProducts.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} basePath={basePath} categoryName={categoryName || title} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
