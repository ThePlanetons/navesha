"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";

import PillTabs from "./pill-tabs";

type Category = {
  id: string;
  label: string;
  value: string;
};

type Collection = {
  id: string;
  title: string;
  slug: string;
  collection_images: {
    id: string;
    image_url: string;
    image_role: string;
  }[];
};

type Props = {
  categories: Category[];
  collections: Collection[];
};

export default function CollectionsView({ categories, collections }: Props) {
  const [categoryActive, setCategoryActive] = useState(
    categories[0]?.value ?? ""
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToIndex = (index: number) => {
    const el = cardRefs.current[index];

    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const next = () => {
    const nextIndex = (currentIndex + 1) % collections.length;

    setCurrentIndex(nextIndex);

    scrollToIndex(nextIndex);
  };

  const prev = () => {
    const prevIndex = (currentIndex - 1 + collections.length) % collections.length;

    setCurrentIndex(prevIndex);

    scrollToIndex(prevIndex);
  };

  return (
    <div className="flex items-center justify-center px-3 py-6 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl md:text-2xl">
          Featured Collections
        </h2>

        {categories.length > 0 && (
          <PillTabs
            items={categories}
            value={categoryActive}
            onChange={setCategoryActive}
            size="lg"
            id="collections"
          />
        )}

        <div className="mt-6 flex gap-5 overflow-x-auto pb-2 no-scrollbar xl:grid xl:grid-cols-3 xl:overflow-visible">
          {collections.map((collection, i) => {
            const thumbnailImage = collection.collection_images?.find(
              (image) => image.image_role === "thumbnail"
            )?.image_url;

            const galleryImages = collection.collection_images?.filter(
              (image) => image.image_role === "gallery"
            ) || [];

            return (
              <div
                key={collection.id}
                ref={(el) => { cardRefs.current[i] = el }}
                className="w-full shrink-0 rounded-2xl bg-gray-200 p-3 shadow transition hover:shadow-md sm:p-4 lg:w-[49%] xl:w-full"
              >
                <div className="relative mb-3 h-52 w-full md:h-56 lg:h-64 xl:h-72">
                  {thumbnailImage && (
                    <Image
                      src={thumbnailImage}
                      alt={collection.title}
                      fill
                      className="rounded-xl object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={i === 0}
                    />
                  )}
                </div>

                <div className="mb-3 flex gap-2">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-24 w-24 md:h-44 md:w-44 lg:h-30 lg:w-30 xl:h-28 xl:w-28"
                    >
                      <Image
                        src={image.image_url}
                        alt="thumb"
                        fill
                        className="rounded-lg object-cover"
                        sizes="(max-width: 640px) 280px, (max-width: 1280px) 320px, 360px"
                        quality={100}
                        priority={i < 2}
                        placeholder="empty"
                        style={{ imageRendering: "auto" }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold tracking-wide sm:text-lg">
                    {collection.title}
                  </span>

                  <Link
                    href={`/featured-collections/${collection.slug}`}
                    className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm font-medium tracking-wide transition hover:bg-gray-200"
                  >
                    View All
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {collections.length > 1 && (
          <div className="mt-4 flex justify-end gap-2 xl:hidden">
            <button
              onClick={prev}
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={next}
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}