"use client";

import { useState } from "react";

import PillTabs from "./pill-tabs";

export default function PillTabsHero() {
  const [active, setActive] = useState("explore");

  return (
    <PillTabs
      items={[
        {
          label: "Explore",
          value: "explore",
        },
      ]}
      value={active}
      onChange={setActive}
      size="lg"
      id="heros"
    />
  );
}
