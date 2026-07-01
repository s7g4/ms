import React from "react";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom Box (Sage Green - #b7c4a8) */}
      <rect
        x="24"
        y="58"
        width="52"
        height="28"
        rx="5"
        fill="#b7c4a8"
        stroke="#4a4238"
        strokeWidth="3"
      />
      {/* Bottom Box Ribbon */}
      <rect
        x="47"
        y="58"
        width="6"
        height="28"
        fill="#f5e6d3"
        stroke="#4a4238"
        strokeWidth="1.5"
      />

      {/* Middle Box (Pastel Beige - #f5e6d3) */}
      <rect
        x="30"
        y="36"
        width="40"
        height="22"
        rx="4"
        fill="#f5e6d3"
        stroke="#4a4238"
        strokeWidth="3"
      />
      {/* Middle Box Ribbon */}
      <rect
        x="47"
        y="36"
        width="6"
        height="22"
        fill="#f7d6e0"
        stroke="#4a4238"
        strokeWidth="1.5"
      />

      {/* Top Box (Baby Pink - #f7d6e0) */}
      <rect
        x="36"
        y="18"
        width="28"
        height="18"
        rx="3"
        fill="#f7d6e0"
        stroke="#4a4238"
        strokeWidth="3"
      />
      {/* Top Box Ribbon */}
      <rect
        x="47"
        y="18"
        width="6"
        height="18"
        fill="#b7c4a8"
        stroke="#4a4238"
        strokeWidth="1.5"
      />

      {/* Ribbon Bow on top of the stack */}
      <path
        d="M42 12C39 14 42 18 50 18C58 18 61 14 58 12C56 10 52 14 50 18C48 14 44 10 42 12Z"
        fill="#f5e6d3"
        stroke="#4a4238"
        strokeWidth="2.5"
      />

      {/* Magical Sparkles */}
      <path
        d="M80 20L82 25L87 27L82 29L80 34L78 29L73 27L78 25L80 20Z"
        fill="#f7d6e0"
      />
      <path
        d="M18 45L19 48L22 49L19 50L18 53L17 50L14 49L17 48L18 45Z"
        fill="#b7c4a8"
      />
    </svg>
  );
}
