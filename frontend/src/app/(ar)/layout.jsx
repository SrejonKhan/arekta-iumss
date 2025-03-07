"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function ARLayout({ children }) {
  useEffect(() => {
    // Initialize AR.js when the component mounts
    if (typeof window !== "undefined") {
      // AR.js initialization code can go here if needed
    }
  }, []);

  return (
    <>
      {/* AR.js and Three.js Scripts */}
      <Script
        src="https://aframe.io/releases/1.4.0/aframe.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/donmccurdy/aframe-extras/master/dist/aframe-extras.loaders.min.js"
        strategy="beforeInteractive"
      />

      {/* Main Content */}
      <main className="ar-content">{children}</main>

      {/* AR-specific styles */}
      <style jsx global>{`
        .ar-content {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1000;
        }

        /* Hide AR.js debug UI */
        .a-enter-vr,
        .a-enter-ar {
          display: none !important;
        }
      `}</style>
    </>
  );
}
