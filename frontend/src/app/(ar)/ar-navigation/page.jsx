"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGeolocation } from "@/hooks/useGeolocation";
import dynamic from "next/dynamic";

const ARNavigationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { location } = useGeolocation();
  const [destination, setDestination] = useState(null);
  const [arReady, setArReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAR = async () => {
      try {
        const poiId = searchParams.get("poi");
        if (!poiId) {
          throw new Error("No POI selected");
        }

        // Here you would fetch the actual POI data
        // For now using mock data
        setDestination({
          id: poiId,
          name: "Sample POI",
          latitude: location?.latitude + 0.001,
          longitude: location?.longitude + 0.001,
          distance: 100, // meters
        });

        // Check if device supports WebXR
        if (!navigator.xr) {
          throw new Error("WebXR not supported");
        }

        setArReady(true);
      } catch (err) {
        setError(err.message);
      }
    };

    if (location) {
      initAR();
    }
  }, [location, searchParams]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="bg-red-500/20 p-4 rounded-full inline-block mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">AR Navigation Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => router.push("/navigation")}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  if (!location || !destination || !arReady) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Initializing AR Navigation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* AR Scene */}
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="antialias: true; alpha: true"
        embedded
      >
        {/* Camera */}
        <a-camera gps-camera rotation-reader></a-camera>

        {/* POI Marker */}
        <a-entity
          look-at="[gps-camera]"
          gps-entity-place={`latitude: ${destination.latitude}; longitude: ${destination.longitude};`}
        >
          {/* Custom 3D marker */}
          <a-sphere
            radius="0.5"
            color="#4F46E5"
            opacity="0.8"
            animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; dur: 1000; loop: true"
          ></a-sphere>
          {/* Direction Arrow */}
          <a-triangle
            color="#4F46E5"
            position="0 1 0"
            scale="0.5 0.5 0.5"
            rotation="0 0 180"
            animation="property: position; to: 0 1.2 0; dir: alternate; dur: 1000; loop: true"
          ></a-triangle>
        </a-entity>
      </a-scene>

      {/* UI Overlay */}
      <div className="fixed inset-x-0 top-0 z-50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/navigation")}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Info Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {destination.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Point your camera in the direction of the marker
                </p>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <p className="text-primary font-semibold">
                  {(destination.distance / 1000).toFixed(2)} km
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ARNavigationPage;
