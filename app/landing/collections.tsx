"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

import PillTabs from "./pill-tabs ";

type Category = {
  id: string;
  label: string;
  value: string;
};

export default function Collections() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // const categories = [
  //   "Action Packed",
  //   "Featured Universes",
  //   "Korean Wave",
  //   "Editor’s Choice",
  //   "Feel Good",
  //   "Trending Now",
  // ].map((item) => ({
  //   label: item,
  //   value: item.toLowerCase(),
  // }));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/landing/collections/collection-categories");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const formattedCategories = data.map(
        (item: {
          id: string;
          name: string;
          slug: string;
        }) => ({
          id: item.id,
          label: item.name,
          value: item.slug,
        })
      );

      setCategories(formattedCategories);

      if (formattedCategories.length > 0) {
        setCategoryActive(formattedCategories[0].value);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const [categoryActive, setCategoryActive] = useState("");

  const cards = [
    {
      title: "Spider-Man",
      img: "/images/spider-man.jpeg",
      count: "144",
      child: [
        "/images/spider-man-1.jpg",
        "/images/spider-man-2.jpg",
        "/images/spider-man-3.jpg",
        "/images/spider-man-4.jpg"
      ]
    },
    {
      title: "One Piece",
      img: "/images/one-piece.jpg",
      count: "7K",
      child: [
        "/images/one-piece-1.jpg",
        "/images/one-piece-2.png",
        "/images/one-piece-3.jpg",
        "/images/one-piece-4.jpg"
      ]
    },
    {
      title: "Tom & Jerry",
      img: "/images/tom-and-jerry-5.jpg",
      count: "431",
      child: [
        "/images/tom-and-jerry-1.jpg",
        "/images/tom-and-jerry-2.jpg",
        "/images/tom-and-jerry-3.jpg",
        "/images/tom-and-jerry.jpg"
      ]
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToIndex = (index: number) => {
    const el = cardRefs.current[index];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  const next = () => {
    const nextIndex = (currentIndex + 1) % cards.length;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const prev = () => {
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  return (
    <div className="flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6">
      <div className="w-full">
        {/* Header */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
          Popular Collections
        </h2>

        {/* Filters */}
        {loading ? (
          <div className="flex gap-3 mt-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-11 w-36 rounded-full bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (

          <PillTabs
            items={categories}
            value={categoryActive}
            onChange={setCategoryActive}
            size="lg"
            id="collections"
          />
        )}

        {/* Cards Grid */}
        <div
          className="flex gap-5 overflow-x-auto pb-2 mt-6 xl:grid xl:grid-cols-3 xl:overflow-visible no-scrollbar"
        >
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-full shrink-0 lg:w-[49%] xl:w-full bg-gray-200 rounded-2xl p-3 sm:p-4 shadow hover:shadow-md transition"
            >
              {/* Main Image */}
              <div className="relative w-full h-52 md:h-56 lg:h-64 xl:h-72 mb-3">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={i === 0}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mb-3">
                {card.child.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 md:w-44 md:h-44 lg:w-30 lg:h-30 xl:w-28 xl:h-28"
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 640px) 280px, (max-width: 1280px) 320px, 360px"
                      quality={100}
                      priority={i < 2}
                      placeholder="empty"
                      style={{ imageRendering: 'auto' }}
                    />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold tracking-wide">
                  {card.title}
                </span>

                <button
                  onClick={() =>
                    router.push(`/collections?category=${encodeURIComponent(card.title)}`)
                  }
                  className="text-sm font-medium tracking-wide px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                >
                  View All
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex xl:hidden justify-end gap-2 mt-4">
          <button onClick={prev} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronLeft size={20} />
          </button>

          <button onClick={next} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}