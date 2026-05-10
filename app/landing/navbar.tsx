"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ShoppingCart, CircleUserRound } from "lucide-react";

import PillTabs from "./pill-tabs ";

export default function Navbar({ scrolled }: { scrolled: boolean }) {
  const router = useRouter();

  const navItems = [
    "Home",
    "About",
    "Features",
    "Product",
  ].map((item) => ({
    label: item,
    value: item.toLowerCase(),
  }));

  const [navActive, setNavActive] = useState("home");

  return (
    <div
      className="w-full flex justify-center transition-all duration-500 transform py-3"
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
        <div className="font-semibold text-lg tracking-wide uppercase">
          Navesha
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
          <button
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out
              ${scrolled
                ? "bg-white/60 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                : "bg-white/30 backdrop-blur-md border border-white/20"
              }
              hover:scale-105 hover:bg-white/70 cur
            `}
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />

            {/* Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-px rounded-full shadow-sm">
              2
            </span>
          </button>

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