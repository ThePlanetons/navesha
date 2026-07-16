export type Mockup = {
  id: string;
  name: string;
  image_url: string;
};

export type PosterState = {
  file: File | null;
  preview: string;
};

export type EditorFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};