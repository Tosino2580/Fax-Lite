import { useState, useEffect } from 'react'
import { ProductData } from '../productData/ProductData'
import { FaEye, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWishlist } from '../context/WishlistContext'
import { useCurrency } from '../context/CurrencyContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { formatPrice } = useCurrency();
    const wishlisted = isInWishlist(product.id, 'Collections');

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
            removeFromWishlist(product.id, 'Collections');
        } else {
            addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, route: `/products/${product.id}`, category: 'Collections' });
        }
    };

    return (
        <div className="group">
            <Link to={`/products/${product.id}`}>
                <div
                    className="relative overflow-hidden rounded-xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Main Image */}
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-60 md:h-96 object-cover"
                        animate={{ opacity: isHovered ? 0 : 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    />

                    {/* Hover Image */}
                    <motion.img
                        src={product.hoverImage || product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-60 md:h-96 object-cover"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    />

                    {/* Badge */}
                    {product.badge && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-yellow-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {product.badge}
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
                    <div className={`absolute bottom-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-yellow-500 transition-colors">
                            <FaEye size={14} className="text-gray-800" />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-yellow-500 transition-colors">
                            <FaShoppingCart size={14} className="text-gray-800" />
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="mt-3 space-y-1">
                <h3 className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wide truncate">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-yellow-400 font-bold text-sm md:text-base">
                        {formatPrice(product.price)}
                    </p>
                    {product.oldPrice && (
                        <p className="text-gray-500 line-through text-xs">
                            {formatPrice(product.oldPrice)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

const ProductList = () => {
    const [apiProducts, setApiProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                if (data.success && data.products) {
                    const mapped = data.products
                        .filter(p => p.isActive)
                        .map(p => ({
                            id: p._id,
                            name: p.name,
                            price: p.price,
                            oldPrice: p.oldPrice || null,
                            inStock: p.inStock,
                            sizes: p.sizes || [],
                            image: p.images?.[0] || '',
                            hoverImage: p.images?.[1] || p.images?.[0] || '',
                            badge: p.badge ? p.badge.replace(/"/g, '') : 'New',
                            source: 'api',
                        }));
                    setApiProducts(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        };
        fetchProducts();
    }, []);

    const localProducts = ProductData.map(p => ({ ...p, badge: p.badge || 'New', source: 'local' }));
    const allProducts = [...apiProducts, ...localProducts];

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 md:px-6">
            {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default ProductList
