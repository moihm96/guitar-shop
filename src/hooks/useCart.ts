import { useEffect, useState, useMemo } from "react";
import { db } from "../data/db";
import { Product } from "../components/Guitar";

export const useCart = () => {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");

    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };
  const [data] = useState(db);
  const [cart, setCart] = useState<Product[]>(initialCart);

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
      updatedCart[itemExists] && updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart((prevCart) => [...prevCart, item]);
    }
  }

  function removeFromCart(id: number) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
    return;
  }

  function increaseQuantity(id: number) {
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

  function decreaseQuantity(id: number) {
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
