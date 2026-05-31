"use client";

export default function TopBanner({ scrolled }: { scrolled: boolean }) {
  return (
    <div 
      className={`w-full h-10 bg-red-500 text-white flex items-center justify-center text-sm md:text-base font-medium transition-all duration-500
      ${scrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      How to apply offer?
    </div>
  );
}