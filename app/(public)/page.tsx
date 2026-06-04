import { Suspense } from "react";

import HeroSection from "./_components/hero-sections";
import Collections from "./_components/collections";

export default function Home() {
  return (
    <>
      <Suspense>
        <HeroSection />
      </Suspense>

      <Suspense>
        <Collections />
      </Suspense>
    </>
  );
}
