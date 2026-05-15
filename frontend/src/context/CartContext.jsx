import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const { token } = useContext(AuthContext);

  // 👉 FETCH CART
  const fetchCart = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart(res.data);
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  // 👉 ADD
  const addToCart = async (product) => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/cart`,
      { product_id: product.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  // 👉 UPDATE
  const updateQuantity = async (item_id, quantity) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/cart`,
      { item_id, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  // 👉 REMOVE
  const removeFromCart = async (item_id) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/cart/${item_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  // 👉 CLEAR
  const clearCart = async () => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/cart/clear/all`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
