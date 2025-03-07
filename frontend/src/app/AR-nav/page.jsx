"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Create a loading component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black/90 text-white flex items-center justify-center">
    <div className="text-center p-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-lg">Loading AR Navigation...</p>
    </div>
  </div>
);

// Dynamically import the AR component with no SSR
const ARNavigationComponent = dynamic(() => import("./ARNavigationComponent"), {
  ssr: false,
});

// Main page component
export default function ARNavigationPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ARNavigationComponent />
    </Suspense>
  );
}
