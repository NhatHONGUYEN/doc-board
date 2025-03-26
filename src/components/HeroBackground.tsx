import React from "react";

type HeroBackgroundProps = {
  className?: string;
  zIndex?: string;
  backgroundColor?: string;
};

export function HeroBackground({
  className = "",
  zIndex = "-z-10",
  backgroundColor = "bg-background",
}: HeroBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 ${zIndex} size-full ${backgroundColor} ${className}`}
    />
  );
}
