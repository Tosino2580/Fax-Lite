import { useState, useEffect } from 'react';

const KEY = 'fax_recently_viewed';
const MAX = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addRecentlyViewed = (product) => {
    if (!product?.id) return;
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image || product.images?.[0] || '',
      route: `/products/${product.id}`,
    };
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== item.id);
      return [item, ...filtered].slice(0, MAX);
    });
  };

  return { recentlyViewed, addRecentlyViewed };
}
