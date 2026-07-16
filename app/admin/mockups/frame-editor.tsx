"use client";

import { useEffect, useState } from "react";

type Mockup = {
  id: string;
  name: string;
  image_url: string;
  frame_x: number | null;
  frame_y: number | null;
  frame_width: number | null;
  frame_height: number | null;
};

export default function FrameEditor({
  mockupId,
}: {
  mockupId: string;
}) {
  const [mockup, setMockup] = useState<Mockup | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockup();
  }, []);

  const fetchMockup = async () => {
    try {
      const response = await fetch(
        `/api/admin/mockups/${mockupId}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setMockup(result);
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

  if (!mockup) {
    return (
      <div className="p-8">
        Mockup not found
      </div>
    );
  }

  return (
    <div>
      {/* We'll build the editor next */}
      {mockup.name}
    </div>
  );
}