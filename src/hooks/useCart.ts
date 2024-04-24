import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";
import { CartItem, Product } from "../type";

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");

    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MIN_QTY = 1;
  const MAX_QTY = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: Product) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExists >= 0) {
      const updatedCart = [...cart];
      if (cart[itemExists].quantity >= MAX_QTY) return;
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      const newItem = { ...item, quantity: 1 };
      setCart((prevCart) => [...prevCart, newItem]);
    }
  }

  function removeFromCart(id: Product["id"]) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
    return;
  }

  function increaseQuantity(id: Product["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity <= MAX_QTY) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
    return;
  }

  function decreaseQuantity(id: Product["id"]) {
    const product = cart.find((item) => item.id === id);

    if (product && product.quantity <= MIN_QTY) {
      setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
      return;
    }
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_QTY) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
    return;
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
