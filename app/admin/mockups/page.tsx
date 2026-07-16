"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Rnd } from "react-rnd";

type Mockup = {
  id: string;
  name: string;
  image_url: string;
  frame_x: number | null;
  frame_y: number | null;
  frame_width: number | null;
  frame_height: number | null;
};

export default function Page() {
  const [mockups, setMockups] = useState<Mockup[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockups();
  }, []);

  const fetchMockups = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/mockups"
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setMockups(result);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-8 md:grid-cols-2 xl:grid-cols-3">
      {mockups.map((mockup) => (
        <div
          key={mockup.id}
          className="overflow-hidden rounded-2xl border"
        >
          <div className="relative aspect-video">
            <Image
              src={mockup.image_url}
              alt={mockup.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between p-4">
            <h2 className="text-lg font-semibold">
              {mockup.name}
            </h2>

            <Dialog key={mockup.id}>
              <DialogTrigger asChild>
                <Button className="rounded-xl">
                  Configure Frame
                </Button>
              </DialogTrigger>

              <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden gap-0 p-0 sm:max-w-5xl">
                <DialogHeader className="shrink-0 px-4 py-3 text-left">
                  <DialogTitle>
                    Configure Frame
                  </DialogTitle>
                </DialogHeader>

                <Separator />

                <div className="flex-1 overflow-y-auto p-4">
                  <FrameSelector
                    mockup={mockup}
                  />
                  {/* <Image
                    src={mockup.image_url}
                    alt={mockup.name}
                    width={900}
                    height={900}
                    className="h-auto max-h-[70vh] w-auto rounded-xl border"
                  /> */}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
}

function FrameSelector({
  mockup,
}: {
  mockup: Mockup;
}) {
  const imageRef = useRef<HTMLImageElement>(null);


  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });


  useEffect(() => {
    const img = new window.Image();

    img.src = mockup.image_url;

    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  }, [mockup.image_url]);

  const [frame, setFrame] = useState({
    frame_x: mockup.frame_x ?? 100,
    frame_y: mockup.frame_y ?? 100,
    frame_width: mockup.frame_width ?? 300,
    frame_height: mockup.frame_height ?? 300,
  });

  const [saving, setSaving] = useState(false);

  const updateFrame = async () => {
    if (!frame) {
      return;
    }

    try {
      setSaving(true);

      const displayedWidth = imageRef.current!.clientWidth;
      const displayedHeight = imageRef.current!.clientHeight;

      const scaleX = imageSize.width / displayedWidth;
      const scaleY = imageSize.height / displayedHeight;

      const payload = {
        frame_x: Math.round(frame.frame_x * scaleX),
        frame_y: Math.round(frame.frame_y * scaleY),
        frame_width: Math.round(frame.frame_width * scaleX),
        frame_height: Math.round(frame.frame_height * scaleY),
      };

      const response = await fetch(
        `/api/admin/mockups/${mockup.id}/frame`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update frame"
        );
      }

      toast.success(
        "Frame updated successfully"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="mb-4 text-sm text-muted-foreground">
        Click top-left corner and then bottom-right corner of the frame.
      </p>

      <div className="relative mx-auto w-fit">
        <Image
          ref={imageRef}
          src={mockup.image_url}
          alt={mockup.name}
          width={imageSize.width || 1}
          height={imageSize.height || 1}
          className="max-h-[70vh] w-auto rounded-xl border"
        />

        <Rnd
          bounds="parent"
          position={{
            x: frame.frame_x,
            y: frame.frame_y,
          }}
          size={{
            width: frame.frame_width,
            height: frame.frame_height,
          }}
          onDragStop={(e, d) => {
            setFrame((prev) => ({
              ...prev,
              frame_x: d.x,
              frame_y: d.y,
            }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setFrame({
              frame_x: position.x,
              frame_y: position.y,
              frame_width: parseInt(ref.style.width),
              frame_height: parseInt(ref.style.height),
            });
          }}
          enableResizing={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          className="absolute border-2 border-red-500 bg-red-500/10 z-10"
        />
      </div>

      {frame && (
        <div className="mt-4 rounded-xl border p-4 text-sm">
          <p>
            X: {frame.frame_x}
          </p>

          <p>
            Y: {frame.frame_y}
          </p>

          <p>
            Width: {frame.frame_width}
          </p>

          <p>
            Height: {frame.frame_height}
          </p>

          <Button
            className="mt-4"
            onClick={updateFrame}
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Frame"
            }
          </Button>
        </div>
      )}
    </div>
  );
}