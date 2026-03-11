/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem('fax_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('fax_wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            if (prev.some(item => item.id === product.id && item.category === product.category)) {
                return prev;
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                route: product.route || `/products/${product.id}`,
                category: product.category || 'Collections',
            }];
        });
    };

    const removeFromWishlist = (productId, category) => {
        setWishlistItems(prev => prev.filter(item => !(item.id === productId && item.category === category)));
    };

    const isInWishlist = (productId, category) => {
        return wishlistItems.some(item => item.id === productId && item.category === (category || 'Collections'));
    };

    const clearWishlist = () => setWishlistItems([]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
