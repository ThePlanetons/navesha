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
    .order("sort_order", { ascending: true });

  const images = slides?.map((slide) => slide.image_url) ?? [];

  if (!images.length) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full bg-white">
        {/* Hero Section */}
        <div className="mx-auto max-w-[90rem] px-6 pt-5 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-500">
            ✨ Premium Posters • Crafted for Every Space
          </div>

          <h1 className="mx-auto max-w-6xl text-xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            <span className="inline-block mb-2.5 md:mb-2">The Art of Human Expression, Uncover</span>
            <br />
            <span className="italic font-normal">
              The Stories
            </span>{" "}
            Behind the Poster
          </h1>

          {/* <p className="text-muted-foreground mx-auto mt-6 max-w-4xl text-base leading-8 md:text-lg">
            Discover premium posters inspired by iconic movies, anime, games,
            superheroes, TV series, and timeless pop culture. Designed with
            exceptional print quality and vibrant colors to transform every wall
            into a statement piece that reflects your passion and personality.
          </p> */}

          <div className="my-5 md:my-6 flex justify-center">
            <PillTabsHero />
          </div>

          {/* Highlights */}
          <div className="mx-6 md:mx-auto pt-1.5 md:pt-3 grid max-w-5xl grid-cols-2 md:grid-cols-4 gap-y-4">
            <div>
              <p className="text-xl md:text-3xl font-bold text-red-500">
                500+
              </p>

              <p className="text-muted-foreground mt-1 text-sm">
                Exclusive Designs
              </p>
            </div>

            <div>
              <p className="text-xl md:text-3xl font-bold text-red-500">
                Premium
              </p>

              <p className="text-muted-foreground mt-1 text-sm">
                High Quality Prints
              </p>
            </div>

            <div>
              <p className="text-xl md:text-3xl font-bold text-red-500">
                Fast
              </p>

              <p className="text-muted-foreground mt-1 text-sm">
                Secure Shipping
              </p>
            </div>

            <div>
              <p className="text-xl md:text-3xl font-bold text-red-500">
                100%
              </p>

              <p className="text-muted-foreground mt-1 text-sm">
                Passion Crafted
              </p>
            </div>
          </div>

          {/* Trust Row */}
          <div className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <span>🎨 Curated Collections</span>

            <span>🖨️ Premium Print Quality</span>

            <span>🚚 Fast & Secure Delivery</span>

            <span>❤️ Designed for Collectors</span>
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
