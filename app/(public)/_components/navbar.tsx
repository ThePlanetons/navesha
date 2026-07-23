"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { CircleUserRound, ShoppingBag } from "lucide-react";

import { Drawer, DrawerTrigger } from "@/components/ui/drawer";

import { useCart } from "@/contexts/cart-provider";

import PillTabs from "./pill-tabs";
import CartDrawer from "./cart-drawer";

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  const router = useRouter();

  const navItems = [
    {
      label: "Home",
      value: "home",
      href: "/",
    },
    {
      label: "Products",
      value: "products",
    },
    {
      label: "Features",
      value: "features",
    },
    {
      label: "Contact",
      value: "contact",
    },
  ];

  const [navActive, setNavActive] = useState("home");

  const { cartCount } = useCart();

  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div
      className="w-full flex justify-center transition-all duration-500 transform py-2.5 md:py-3"
    >
      <div
        className={`flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-3 transition-all duration-500
          ${scrolled
            ? "w-[95%] md:w-[85%] lg:w-[75%] rounded-full backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg"
            : "w-full rounded-none bg-transparent"
          }`
        }
      >
        {/* Logo */}
        <div className="relative h-8 w-32 md:h-11 md:w-44">
          <Image
            src="/logo/navesha_logo_transparent.png"
            alt="Navesha"
            fill
            priority
            sizes="(min-width: 768px) 176px, 128px"
            className="object-contain"
          />
        </div>

        {/* Nav Items */}
        {/* <div className="hidden sm:flex bg-white/60 backdrop-blur-md border border-white/30 p-1 rounded-full shadow-sm"> */}
        <div className="hidden sm:flex">
          <PillTabs
            items={navItems}
            value={navActive}
            onChange={setNavActive}
            size="lg"
            id="navbar"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <Drawer
            direction="right"
            open={cartOpen}
            onOpenChange={setCartOpen}
          >
            <DrawerTrigger asChild>
              <button
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-out
                  ${scrolled
                    ? "border border-white/30 bg-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl"
                    : "border border-white/20 bg-white/30 backdrop-blur-md"
                  }
                  hover:scale-105 hover:bg-white/70 cursor-pointer
                `}
              >
                <ShoppingBag className="h-6 w-6 text-gray-700" />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[12px] font-medium text-white shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </DrawerTrigger>

            <CartDrawer
              onCheckout={() => setCartOpen(false)}
            />
          </Drawer>

          {/* User */}
          <button
            onClick={() => router.push("/auth/login")}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out
              ${scrolled
                ? "bg-white/60 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                : "bg-white/30 backdrop-blur-md border border-white/20"
              }
              hover:scale-105 hover:bg-white/70
            `}
          >
            <CircleUserRound className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
