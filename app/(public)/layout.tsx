import NavbarWrapper from "./_components/navbar-wrapper";

import { CartProvider } from "@/context/cart-provider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartProvider>
        <NavbarWrapper />

        <main>
          <div className="pt-[5.5rem]">
            {children}
          </div>
        </main>
      </CartProvider>
    </>
  );
}
