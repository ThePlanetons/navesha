"use client";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-muted/30">
      <div className="px-3 py-6 sm:px-4 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/logo/navesha_logo.png"
              alt="Navesha"
              width={170}
              height={48}
              priority
              className="h-24 w-auto"
            />

            <p className="text-muted-foreground text-sm leading-6">
              Curated posters and artwork that bring your favorite stories,
              characters, and moments to life with timeless aesthetics
              to elevate every space.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 font-semibold">
              Shop
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/featured-collections" className="hover:text-foreground">
                  Featured Collections
                </Link>
              </li>

              <li>
                <Link href="/cart" className="hover:text-foreground">
                  Cart
                </Link>
              </li>

              <li>
                <Link href="/checkout" className="hover:text-foreground">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">
              Support
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/shipping-policy" className="hover:text-foreground">
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link href="/return-refund-policy" className="hover:text-foreground">
                  Return & Refund Policy
                </Link>
              </li>

              <li>
                <Link href="/privacy-policy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms-and-conditions" className="hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Have a question or need help with an order?
              </p>

              <p>
                Email:
                <br />
                <a
                  href="mailto:support@navesha.com"
                  className="hover:text-foreground"
                >
                  support@navesha.com
                </a>
              </p>

              <p>
                Mon – Fri
                <br />
                9:00 AM – 6:00 PM IST
              </p>
            </div>
          </div>
        </div>

        <div className="my-8 border-t" />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
          <p>© {year ?? 2026} Navesha. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with
            <span className="text-red-500">❤️</span>
            by
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              The Planet 9
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}