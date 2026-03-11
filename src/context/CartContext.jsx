/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
// import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false); 

  const toggleCartDrawer = () => {
    setShowCart(prev => !prev);
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = (product, selectedSize, quantity) => {
    console.log("Adding to cart:", product, selectedSize, quantity);
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize,
      quantity,
    };

   
    

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === newItem.id && item.selectedSize === newItem.selectedSize
      );

      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += quantity;
        return updatedItems;
      }

      return [...prevItems, newItem];
    });

   
  setShowCart(true); 
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        showCart,
        removeFromCart,
        clearCart,
        setShowCart,
        toggleCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
