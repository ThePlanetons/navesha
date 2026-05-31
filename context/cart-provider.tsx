// context/cart-provider.tsx

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  sku: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  cartCount: number;

  addToCart: (
    sku: string,
    quantity?: number
  ) => void;

  decreaseQuantity: (
    sku: string
  ) => void;

  removeFromCart: (
    sku: string
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(
    null
  );

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      setCart(
        JSON.parse(savedCart)
      );
    }
  }, []);

  const saveCart = (
    updatedCart: CartItem[]
  ) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const addToCart = (
    sku: string,
    quantity = 1
  ) => {
    const updatedCart = [...cart];

    const existingItem =
      updatedCart.find(
        (item) =>
          item.sku === sku
      );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      updatedCart.push({
        sku,
        quantity,
      });
    }

    saveCart(updatedCart);
  };

  const decreaseQuantity = (
    sku: string
  ) => {
    const updatedCart =
      cart.map((item) =>
        item.sku === sku
          ? {
            ...item,
            quantity:
              item.quantity - 1,
          }
          : item
      );

    saveCart(
      updatedCart.filter(
        (item) =>
          item.quantity > 0
      )
    );
  };

  const removeFromCart = (
    sku: string
  ) => {
    saveCart(
      cart.filter(
        (item) =>
          item.sku !== sku
      )
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

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
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}