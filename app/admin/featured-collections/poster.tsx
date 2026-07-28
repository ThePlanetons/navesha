"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { toBlob } from "html-to-image";

import { Rnd } from "react-rnd";

import { Mockup } from "./type";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  entityId: string;
  entityKey: "collection_id" | "product_id";
  createUrl: string;
  uploadUrl: string;

  mockup: Mockup;

  posterPreview: string;
  transform: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  onTransformChange: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>
  >;
};

export default function PosterEditor({
  entityId,
  entityKey,
  createUrl,
  uploadUrl,
  mockup,
  posterPreview,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  const mockupRef = useRef<HTMLDivElement>(null);

  const INITIAL_WIDTH = 250;
  const INITIAL_HEIGHT = 350;

  const [poster, setPoster] = useState({
    x: 0,
    y: 0,
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
  });

  useEffect(() => {
    if (!mockupRef.current || !posterPreview) return;

    const centerPoster = () => {
      const width = mockupRef.current!.clientWidth;
      const height = mockupRef.current!.clientHeight;

      const initialWidth = 250;
      const initialHeight = 350;

      setPoster({
        x: (width - initialWidth) / 2,
        y: (height - initialHeight) / 2,
        width: initialWidth,
        height: initialHeight,
      });
    };

    requestAnimationFrame(centerPoster);
  }, [mockup.image_url, posterPreview]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    try {
      // setUploading(true);

      for (const file of Array.from(files)) {
        const formData = new FormData();

        formData.append("file", file);

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error);
        }

        const imageResponse = await fetch(createUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              [entityKey]: entityId,
              image_url: uploadResult.url
            })
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          throw new Error(imageResult.error);
        }
      }

      toast.success("Images uploaded successfully");

      // fetchImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      // setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const blob = await toBlob(editorRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: undefined,
    });

    if (!blob) return;

    const file = new File(
      [blob],
      `mockup-${Date.now()}.png`,
      {
        type: "image/png",
      }
    );

    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    await handleUpload(dataTransfer.files);
  };

  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);

  return (
    <>
      <div ref={editorRef}>
        <div className="flex justify-center">
          <div
            ref={mockupRef}
            className="relative inline-block"
          >
            <Image
              src={mockup.image_url}
              alt={mockup.name}
              width={900}
              height={900}
              className="max-h-[75vh] w-auto rounded-xl border select-none"
              draggable={false}
              crossOrigin="anonymous"
            />

            {/* Vertical center line */}
            {showVerticalGuide && (
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-50"
                style={{
                  width: 2,
                  background: "#3b82f6",
                }}
              />
            )}

            {/* Horizontal center line */}
            {showHorizontalGuide && (
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-50"
                style={{
                  height: 2,
                  background: "#3b82f6",
                }}
              />
            )}

            <Rnd
              bounds="parent"
              lockAspectRatio
              position={{
                x: poster.x,
                y: poster.y,
              }}
              size={{
                width: poster.width,
                height: poster.height,
              }}
              onDrag={(e, d) => {
                if (!mockupRef.current) return;

                const parentWidth = mockupRef.current.clientWidth;
                const parentHeight = mockupRef.current.clientHeight;

                const centerX = d.x + poster.width / 2;
                const centerY = d.y + poster.height / 2;

                const targetX = parentWidth / 2;
                const targetY = parentHeight / 2;

                const SNAP = 5;

                let x = d.x;
                let y = d.y;

                const verticalMatch = Math.abs(centerX - targetX) <= SNAP;
                const horizontalMatch = Math.abs(centerY - targetY) <= SNAP;

                if (verticalMatch) {
                  x = targetX - poster.width / 2;
                }

                if (horizontalMatch) {
                  y = targetY - poster.height / 2;
                }

                setShowVerticalGuide(verticalMatch);
                setShowHorizontalGuide(horizontalMatch);

                setPoster((prev) => ({
                  ...prev,
                  x,
                  y,
                }));
              }}
              onDragStop={() => {
                setShowVerticalGuide(false);
                setShowHorizontalGuide(false);
              }}
              onResizeStop={(
                e,
                direction,
                ref,
                delta,
                position
              ) => {
                setPoster({
                  x: position.x,
                  y: position.y,
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                });
              }}
            >
              <Image
                src={posterPreview}
                alt="Poster"
                fill
                draggable={false}
                className="object-cover select-none pointer-events-none"
                crossOrigin="anonymous"
              />
            </Rnd>
          </div>
        </div>
      </div>

      <Button onClick={handleSave}>
        Save
      </Button>
    </>
  );
}