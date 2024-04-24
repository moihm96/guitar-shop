import { useEffect, useState } from "react";

import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./data/db";
import { Product } from "./components/Guitar";

function App() {
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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((product) => (
            <Guitar key={product.id} guitar={product} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
