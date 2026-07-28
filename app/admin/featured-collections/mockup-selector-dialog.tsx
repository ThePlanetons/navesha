"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Mockup } from "./type";


import { toast } from "sonner";
import { Rnd } from "react-rnd";
import { toBlob } from "html-to-image";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mockups: Mockup[];
  entityId: string;
  entityKey: "collection_id" | "product_id";
  createUrl: string;
  uploadUrl: string;
  // selectedMockup: Mockup | null;
  // onSelect: (mockup: Mockup) => void;
  // onPosterSelected: (mockup: Mockup, file: File) => void;
};

export default function MockupSelectorDialog({
  open,
  onOpenChange,
  mockups,
  entityId,
  entityKey,
  createUrl,
  uploadUrl,
  // selectedMockup,
  // onSelect,
  // onPosterSelected,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posterPreview, setPosterPreview] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);

  const mockupRef = useRef<HTMLDivElement>(null);

  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);

  const INITIAL_WIDTH = 250;
  const INITIAL_HEIGHT = 350;

  const [poster, setPoster] = useState({
    x: 0,
    y: 0,
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
  });

  useEffect(() => {
    if (!mockupRef.current || !posterPreview || !selectedMockup) {
      return;
    }

    const width = mockupRef.current.clientWidth;
    const height = mockupRef.current.clientHeight;

    const initialWidth = 250;
    const initialHeight = 350;

    setPoster({
      x: (width - initialWidth) / 2,
      y: (height - initialHeight) / 2,
      width: initialWidth,
      height: initialHeight,
    });
  }, [selectedMockup, posterPreview]);

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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="flex h-[95vh] flex-col overflow-hidden p-0 sm:max-w-6xl gap-0 [&>button]:top-3 [&>button]:right-4">
        <DialogHeader className="shrink-0 px-4 py-3 text-left">
          <DialogTitle className="text-xl">
            {posterPreview ? "Edit Mockup" : "Choose Mockup"}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        {!posterPreview ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {mockups.map((mockup) => (
                  <button
                    key={mockup.id}
                    type="button"
                    onClick={() => setSelectedMockup(mockup)}
                    className={`overflow-hidden rounded-xl border transition ${selectedMockup?.id === mockup.id
                      ? "border-red-500 ring-2 ring-red-500"
                      : "border-gray-200"
                      }`}
                  >
                    <div className="relative h-[250px]">
                      <Image
                        fill
                        src={mockup.image_url}
                        alt={mockup.name}
                        className="object-cover"
                      />
                    </div>

                    <div className="p-3 font-medium">
                      {mockup.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end px-4 py-3">
              <Button
                disabled={!selectedMockup}
                onClick={() => fileInputRef.current?.click()}
              >
                Continue
              </Button>
            </div>

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file || !selectedMockup) return;

                const reader = new FileReader();

                reader.onload = () => {
                  setPosterPreview(reader.result as string);
                };

                reader.readAsDataURL(file);

                e.target.value = "";
              }}
            />
          </>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-6">
              <div ref={editorRef}>
                <div className="flex justify-center">
                  <div
                    ref={mockupRef}
                    className="relative inline-block"
                  >
                    <Image
                      src={selectedMockup!.image_url}
                      alt={selectedMockup!.name}
                      width={900}
                      height={900}
                      className="max-h-[75vh] w-auto rounded-xl border select-none"
                      draggable={false}
                    />

                    {showVerticalGuide && (
                      <div
                        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-blue-500 w-[2px]"
                      />
                    )}

                    {showHorizontalGuide && (
                      <div
                        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none bg-blue-500 h-[2px]"
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
                        className="object-cover pointer-events-none select-none"
                        draggable={false}
                      />
                    </Rnd>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between px-4 py-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPosterPreview("");
                  setSelectedMockup(null);
                }}
              >
                Back
              </Button>

              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </>
        )}

        {/* <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {mockups.map((mockup) => (
              <button
                key={mockup.id}
                type="button"
                onClick={() => onSelect(mockup)}
                className={`overflow-hidden rounded-xl border transition

                ${selectedMockup?.id === mockup.id
                    ? "border-red-500 ring-2 ring-red-500"
                    : "border-gray-200"
                  }`}
              >
                <div className="relative h-[250px]">
                  <Image
                    fill
                    src={mockup.image_url}
                    alt={mockup.name}
                    className="object-cover"
                  />
                </div>

                <div className="p-3 font-medium">
                  {mockup.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex justify-end px-4 py-3">
          <Button
            disabled={!selectedMockup}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            Continue
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file || !selectedMockup) {
              return;
            }

            onPosterSelected(selectedMockup, file);

            e.target.value = "";
          }}
        /> */}
      </DialogContent>
    </Dialog>
  );
}