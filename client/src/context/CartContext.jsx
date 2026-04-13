import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (service) => {
    if (cart.find(item => item._id === service._id)) return;
    setCart([...cart, service]);
  };

  const removeFromCart = (serviceId) => {
    setCart(cart.filter(item => item._id !== serviceId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (serviceId) => {
    return cart.some(item => item._id === serviceId);
  };

  const getTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const fee = subtotal * 0.05;
    return { subtotal, fee, total: subtotal + fee };
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};