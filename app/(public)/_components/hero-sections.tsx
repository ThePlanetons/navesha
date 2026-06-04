import Image from "next/image";

import PillTabsHero from "./pill-tabs-hero";

import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function HeroSection() {
  const { data: slides } = await supabaseAdmin
    .from("hero_slides")
    .select(`
      id,
      image_url,
      sort_order
    `)
    .eq("is_active", true)
    .order("sort_order");

  const images = slides?.map((slide) => slide.image_url) ?? [];

  if (!images.length) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full bg-white">
        {/* Hero Section */}
        <div className="px-6 pt-9 text-center">
          <h1 className="text-2xl font-semibold leading-snug md:text-4xl">
            The Art of Human Expression, Uncover
            <br />
            <span className="font-normal italic">
              The Stories
            </span>{" "}
            Behind the Poster
          </h1>

          <div className="mt-5 flex justify-center">
            <PillTabsHero />
          </div>
        </div>

        {/* Images */}
        <div className="relative overflow-hidden">
          {/* Curved Top Effect */}
          <div className="absolute top-0 left-0 z-10 h-6 w-full rounded-bl-[50%_100%] rounded-br-[50%_100%] bg-white md:h-10" />

          <div className="flex w-max animate-scroll gap-1 will-change-transform sm:gap-2">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative h-72 w-72 shrink-0 overflow-hidden md:h-[22rem] md:w-80 lg:h-[26rem] lg:w-[22rem]"
              >
                <Image
                  src={src}
                  alt="art"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Bottom Base Curve */}
          <div className="absolute bottom-0 left-0 h-6 w-full rounded-tl-[50%_100%] rounded-tr-[50%_100%] bg-white md:h-10" />

          {/* Center Concave Cut */}
          <div className="pointer-events-none absolute -bottom-6 left-1/2 z-20 h-24 w-[140%] -translate-x-1/2 rounded-[50%] sm:-bottom-8 sm:h-32 sm:w-[130%] md:-bottom-10 md:h-40 md:w-[120%]" />
        </div>
      </div>
    </div>
  );
}
