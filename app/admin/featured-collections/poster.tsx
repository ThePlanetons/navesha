"use client";

import { useState } from "react";

import Image from "next/image";

import { Rnd } from "react-rnd";
import { Mockup } from "./type";
import Draggable from "react-draggable";

type Props = {
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
  mockup,
  posterPreview,
}: Props) {
  const [poster, setPoster] = useState({
    x: 100,
    y: 100,
    width: 250,
    height: 350,
  });

  const [posterImage, setPosterImage] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });

  const [posterTransform, setPosterTransform] = useState({
    x: 100,
    y: 100,
    width: 300,
    height: 400,
  });

  return (
    <Draggable
      position={{
        x: posterImage.x,
        y: posterImage.y,
      }}
      onDrag={(e, data) => {

        setPosterImage(prev => ({
          ...prev,
          x: data.x,
          y: data.y,
        }));

      }}
    >
      <div className="flex justify-center">
        <div className="relative inline-block">

          <Image
            src={mockup.image_url}
            alt={mockup.name}
            width={900}
            height={900}
            className="max-h-[75vh] w-auto rounded-xl border select-none"
            draggable={false}
          />

          <Rnd
            bounds="parent"
            position={{
              x: poster.x,
              y: poster.y,
            }}
            size={{
              width: poster.width,
              height: poster.height,
            }}
            onDragStop={(e, d) => {
              setPoster((prev) => ({
                ...prev,
                x: d.x,
                y: d.y,
              }));
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
            className="border-2 border-red-500 bg-red-500/10 overflow-hidden"
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={posterPreview}
                alt=""
                width={1000}
                height={1000}
                draggable={false}
                className="absolute select-none pointer-events-none"
                style={{
                  left: posterImage.x,
                  top: posterImage.y,
                  transform: `scale(${posterImage.scale})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </Rnd>
        </div>

        {/* Debug */}

        <div className="ml-6 w-64 rounded-xl border p-4 text-sm space-y-2">

          <h3 className="font-semibold">
            Poster Position
          </h3>

          <p>X : {poster.x}</p>

          <p>Y : {poster.y}</p>

          <p>Width : {poster.width}</p>

          <p>Height : {poster.height}</p>

        </div>

      </div>
    </Draggable>
  );
}