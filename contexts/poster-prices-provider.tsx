// contexts/poster-prices-provider.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

export type PosterPrices = {
  A3: number;
  A4: number;
  A5: number;
};

type PosterPricesContextType = {
  prices: PosterPrices;
  loading: boolean;
  refreshPrices: () => Promise<void>;
};

const DEFAULT_PRICES: PosterPrices = {
  A3: 0,
  A4: 0,
  A5: 0,
};

const PosterPricesContext = createContext<PosterPricesContextType | null>(null);

export function PosterPricesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const [prices, setPrices] = useState<PosterPrices>(DEFAULT_PRICES);

  const [loading, setLoading] = useState(true);

  const loadPrices = async () => {
    const { data, error } = await supabase
      .from("poster_prices")
      .select("size, price");

    if (!error && data) {
      const mapped: PosterPrices = {
        A3: 0,
        A4: 0,
        A5: 0,
      };

      data.forEach((row) => {
        mapped[row.size as keyof PosterPrices] = Number(row.price);
      });

      setPrices(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <PosterPricesContext.Provider
      value={{
        prices,
        loading,
        refreshPrices: loadPrices,
      }}
    >
      {children}
    </PosterPricesContext.Provider>
  );
}

export function usePosterPrices() {
  const context = useContext(PosterPricesContext);

  if (!context) {
    throw new Error(
      "usePosterPrices must be used inside PosterPricesProvider"
    );
  }

  return context;
}