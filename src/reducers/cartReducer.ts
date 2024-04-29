import { db } from "../data/db";
import type { CartItem, Product } from "../type";

export type CartActions =
  | {
      type: "add-to-cart";
      payload: { item: Product };
    }
  | { type: "remove-from-cart"; payload: { id: Product["id"] } }
  | { type: "decrease-quantity"; payload: { id: Product["id"] } }
  | { type: "increase-quantity"; payload: { id: Product["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Product[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");

  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

const MIN_QTY = 1;
const MAX_QTY = 5;

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  const { cart } = state;
  if (action.type === "add-to-cart") {
    const itemExists = cart.find(
      (guitar) => guitar.id === action.payload.item.id
    );
    let updatedCart: CartItem[] = [];

    if (itemExists) {
      updatedCart = cart.map((item) => {
        if (item.id === action.payload.item.id) {
          if (item.quantity < MAX_QTY) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          } else {
            return item;
          }
        } else {
          return item;
        }
      });
    } else {
      const newItem = { ...action.payload.item, quantity: 1 };
      updatedCart = [...cart, newItem];
    }

    return {
      ...state,
      cart: updatedCart,
    };
  }
  if (action.type === "remove-from-cart") {
    const updatedCart = cart.filter((item) => item.id !== action.payload.id);
    return {
      ...state,
      cart: updatedCart,
    };
  }
  if (action.type === "decrease-quantity") {
    const product = cart.find((item) => item.id === action.payload.id);
    let updatedCart: CartItem[] = [];
    if (product && product.quantity <= MIN_QTY) {
      updatedCart = cart.filter((guitar) => guitar.id !== action.payload.id);
    } else {
      updatedCart = cart.map((item) => {
        if (item.id === action.payload.id && item.quantity > MIN_QTY) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
    }

    return {
      ...state,
      cart: updatedCart,
    };
  }

  if (action.type === "increase-quantity") {
    const updatedCart = cart.map((item) => {
      if (item.id === action.payload.id && item.quantity < MAX_QTY) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    return {
      ...state,
      cart: updatedCart,
    };
  }
  if (action.type === "clear-cart") {
    return {
      ...state,
      cart: [],
    };
  }

  return state;
};
