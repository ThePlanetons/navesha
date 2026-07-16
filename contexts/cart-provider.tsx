// contexts/cart-provider.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type PosterSize = | "A3" | "A4" | "A5";

export type CartItem = {
  sku: string;
  size: PosterSize;
  quantity: number;
};

export type CheckoutCartItem = CartItem & {
  name: string;
  price: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];

  cartCount: number;

  addToCart: (
    sku: string,
    size: PosterSize,
    quantity?: number
  ) => void;

  decreaseQuantity: (
    sku: string,
    size: PosterSize
  ) => void;

  removeFromCart: (
    sku: string,
    size: PosterSize
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(
    null
  );

export function CartProvider({ children }: { children: React.ReactNode; }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = (
    sku: string,
    size: PosterSize,
    quantity = 1
  ) => {
    const updatedCart = [...cart];

    const existingItem = updatedCart.find((item) => item.sku === sku && item.size === size);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      updatedCart.push({
        sku,
        size,
        quantity,
      });
    }

    saveCart(updatedCart);
  };

  const decreaseQuantity = (
    sku: string,
    size: PosterSize
  ) => {
    const updatedCart =
      cart
        .map((item) =>
          item.sku === sku && item.size === size
            ? {
              ...item,
              quantity: item.quantity - 1,
            }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        );

    saveCart(updatedCart);
  };

  const removeFromCart = (sku: string, size: PosterSize) => {
    saveCart(
      cart.filter(
        (item) => !(item.sku === sku && item.size === size)
      )
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
