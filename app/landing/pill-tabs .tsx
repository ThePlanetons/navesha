"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type NavItem = {
  label: string;
  value: string;
};

type Props = {
  items: NavItem[];
  value?: string;
  onChange?: (val: string) => void;
  size?: "sm" | "md" | "lg";
  id?: string;
};

export default function PillTabs({
  items,
  value,
  onChange,
  size = "md",
  id
}: Props) {
  const [internalActive, setInternalActive] = useState(items[0]?.value);

  const active = value ?? internalActive;

  const handleChange = (val: string) => {
    if (value === undefined) setInternalActive(val);
    onChange?.(val);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <MagneticPill
          key={item.value}
          item={item}
          active={active}
          onClick={handleChange}
          size={size}
          layoutId={`pill-${id}`}
        />
      ))}
    </div>
  );
}

type MagneticPillProps = {
  item: NavItem;
  active: string;
  onClick: (val: string) => void;
  size: "sm" | "md" | "lg";
  layoutId: string
};

function MagneticPill({ item, active, onClick, size, layoutId }: MagneticPillProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const activeSizeStyles = {
    sm: "px-3 py-1",
    md: "px-4 py-1.5",
    lg: "px-[18px] py-2",
  };

  // const sizeStyles = {
  //   sm: "px-2.5 py-1",
  //   md: "px-3 py-1.5",
  //   lg: "px-3.5 py-2",
  // };

  return (
    <motion.button
      onClick={() => onClick(item.value)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left - rect.width / 2) * 0.2);
        const y = Math.round((e.clientY - rect.top - rect.height / 2) * 0.2);
        setPos({ x, y });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={
        `
          relative rounded-full text-sm md:text-[15px] font-medium tracking-wider cursor-pointer will-change-transform antialiased 
          ${activeSizeStyles[size]}
          ${active === item.value ? "" : "bg-gray-200 hover:bg-gray-200"}
        `
      }
    >
      {/* Sliding Pill */}
      {active === item.value && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 bg-red-500 rounded-full z-0"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Text */}
      <span className={`relative z-10 transition-colors ${active === item.value ? "text-white" : ""}`}>
        {item.label}
      </span>
    </motion.button>
  );
}