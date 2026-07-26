import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('zenvy_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('zenvy_cart', JSON.stringify(cart));
  }, [cart]);

  // Unified function to trigger UI toasts from anywhere in the app
  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const cleanPrice = typeof product.price === 'string' 
        ? parseFloat(product.price.replace('$', '')) 
        : product.price;

      const existing = prev.find(item => item.orderId === product.orderId);
      if (existing) {
        return prev.map(item => 
          item.orderId === product.orderId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, price: cleanPrice, qty: 1 }];
    });

    triggerNotification('🚀 Product added to your bag!');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };                    

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, notification, triggerNotification }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);