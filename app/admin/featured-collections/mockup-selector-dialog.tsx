"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Mockup } from "./type";
import { useRef } from "react";

type Props = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  mockups: Mockup[];

  selectedMockup: Mockup | null;

  onSelect: (mockup: Mockup) => void;

  onPosterSelected: (
    mockup: Mockup,
    file: File
  ) => void;
};

export default function MockupSelectorDialog({
  open,
  onOpenChange,
  mockups,
  selectedMockup,
  onSelect,
  onPosterSelected,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="flex h-[95vh] flex-col overflow-hidden p-0 sm:max-w-6xl">

        <DialogHeader className="px-6 py-4">
          <DialogTitle>
            Choose Mockup
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-6">

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

        <div className="flex justify-end p-4">

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

            onPosterSelected(
              selectedMockup,
              file
            );

            e.target.value = "";
          }}
        />

      </DialogContent>
    </Dialog>
  );
}