import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

import { ProductData } from '../productData/ProductData';
import { JalabiyaDatas } from '../productData/JalabiyaDatas';
import { agbadaDatas } from '../productData/agbadaDatas';
import { KaftanData } from '../productData/KaftanData';

// Build a unified product list with correct detail routes
const allProducts = [
  ...ProductData.map(p => ({ ...p, route: `/products/${p.id}`, category: 'Collections' })),
  ...JalabiyaDatas.map(p => ({ ...p, route: `/jalabiya/${p.id}`, category: 'Jalabiya' })),
  ...agbadaDatas.map(p => ({ ...p, route: `/agbada/${p.id}`, category: 'Agbada' })),
  ...KaftanData.map(p => ({ ...p, route: `/kafans-shirts/${p.id}`, category: 'Kaftan' })),
];

const SearchOverlay = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-[70] bg-zinc-950 border-b border-zinc-800 shadow-2xl"
          >
            <div className="max-w-3xl mx-auto px-4 py-6">
              {/* Search Input */}
              <div className="flex items-center gap-3">
                <FaSearch className="text-gray-500 text-lg flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-500"
                />
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {/* Results */}
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {query.trim() === '' && (
                  <p className="text-gray-500 text-sm text-center py-8">
                    {t('search.startTyping')}
                  </p>
                )}

                {query.trim() !== '' && results.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-lg">{t('search.noResults')} &ldquo;{query}&rdquo;</p>
                    <p className="text-gray-600 text-sm mt-2">{t('search.tryDifferent')}</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">
                      {results.length} {results.length !== 1 ? t('search.results') : t('search.result')}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {results.map((product) => (
                        <Link
                          key={`${product.category}-${product.id}`}
                          to={product.route}
                          onClick={onClose}
                          className="group block rounded-xl overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-colors"
                        >
                          <div className="aspect-[3/4] overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <span className="text-[10px] uppercase tracking-wider text-yellow-400/70">{product.category}</span>
                            <h4 className="text-sm font-medium text-white mt-0.5 leading-tight">{product.name}</h4>
                            <p className="text-yellow-400 text-sm font-semibold font-cinzel mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
