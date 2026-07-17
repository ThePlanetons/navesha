import { CartProvider } from "@/contexts/cart-provider";
import { PosterPricesProvider } from "@/contexts/poster-prices-provider";

import NavbarWrapper from "./_components/navbar-wrapper";
import Footer from "./_components/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartProvider>
        <PosterPricesProvider>
          <NavbarWrapper />

          <main>
            <div className="pt-[4rem] md:pt-[5.5rem]">
              {children}
            </div>
          </main>

          <Footer />
        </PosterPricesProvider>
      </CartProvider>
    </>
  );
}

// | Stage                    | status     | paid_at           |
// | ------------------------ | ---------- | ----------------- |
// | Order created            | pending    | null              |
// | Razorpay verified        | paid       | current timestamp |
// | Admin starts fulfillment | processing | existing value    |
// | Shipped                  | shipped    | existing value    |
// | Delivered                | delivered  | existing value    |
// | Refunded                 | refunded   | existing value    |