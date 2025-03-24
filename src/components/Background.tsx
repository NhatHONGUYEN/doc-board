"use client";

import React from "react";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      {/* Clean unified gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #f0f9ff 0%, #e6f1f9 25%, #f8fafc 50%, #e6f5ff 75%, #f0f7ff 100%)",
        }}
      ></div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20"></div>

      {/* Clean fade at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}
