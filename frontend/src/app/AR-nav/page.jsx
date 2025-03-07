"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useGeolocation } from "@/hooks/useGeolocation";

const ARNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { location } = useGeolocation();
  const [isARReady, setIsARReady] = useState(false);
  const [targetPOI, setTargetPOI] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAR = async () => {
      try {
        const poiId = searchParams.get("poi");
        if (!poiId || !location) return;

        // Mock POI data - replace with actual POI data in production
        const poi = {
          id: poiId,
          name: "Target Location",
          latitude: location.latitude + 0.001, // Slightly offset for testing
          longitude: location.longitude + 0.001,
          distance: 100, // meters
          description: "Your destination",
        };

        setTargetPOI(poi);
        setIsARReady(true);
      } catch (err) {
        setError(err.message);
      }
    };

    initializeAR();
  }, [searchParams, location]);

  // Handle AR.js initialization
  const handleARScriptLoad = () => {
    if (typeof window !== "undefined" && window.AFRAME) {
      // Register custom A-Frame components
      AFRAME.registerComponent("gps-camera", {
        init: function () {
          // Initialize GPS camera
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              this.el.setAttribute("position", {
                x: 0,
                y: 1.6,
                z: 0,
              });
            });
          }
        },
      });

      AFRAME.registerComponent("distance-marker", {
        schema: {
          targetLatitude: { type: "number", default: 0 },
          targetLongitude: { type: "number", default: 0 },
        },
        init: function () {
          // Initialize distance marker
          this.updatePosition();
        },
        updatePosition: function () {
          if (!location) return;

          // Calculate distance and direction to target
          const distance = this.calculateDistance(
            location.latitude,
            location.longitude,
            this.data.targetLatitude,
            this.data.targetLongitude
          );

          // Update marker position
          this.el.setAttribute("position", {
            x: 0,
            y: 0,
            z: -distance,
          });
        },
        calculateDistance: function (lat1, lon1, lat2, lon2) {
          // Haversine formula for distance calculation
          const R = 6371e3; // Earth's radius in meters
          const φ1 = (lat1 * Math.PI) / 180;
          const φ2 = (lat2 * Math.PI) / 180;
          const Δφ = ((lat2 - lat1) * Math.PI) / 180;
          const Δλ = ((lon2 - lon1) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return R * c;
        },
      });
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 text-white flex items-center justify-center">
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

  if (!isARReady || !targetPOI) {
    return (
      <div className="fixed inset-0 bg-black/90 text-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Initializing AR Navigation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* AR.js Scripts */}
      <Script
        src="https://aframe.io/releases/1.4.0/aframe.min.js"
        onLoad={handleARScriptLoad}
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
      />

      {/* AR Scene */}
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="antialias: true; alpha: true"
        embedded
      >
        {/* Camera */}
        <a-camera gps-camera rotation-reader />

        {/* POI Marker */}
        {targetPOI && (
          <a-entity
            distance-marker={`targetLatitude: ${targetPOI.latitude}; targetLongitude: ${targetPOI.longitude}`}
          >
            {/* Direction Arrow */}
            <a-cone
              position="0 0 0"
              rotation="90 0 0"
              radius-bottom="0.5"
              radius-top="0"
              height="1"
              color="#4F46E5"
              opacity="0.8"
              animation="property: position; to: 0 0.2 0; dir: alternate; dur: 1000; loop: true"
            />

            {/* Distance Text */}
            <a-text
              value={`${targetPOI.name}\n${(targetPOI.distance / 1000).toFixed(
                2
              )}km`}
              align="center"
              position="0 1 0"
              scale="1 1 1"
              color="#FFFFFF"
              background="#000000"
              width="4"
            />
          </a-entity>
        )}
      </a-scene>

      {/* UI Overlay */}
      <div className="fixed inset-x-0 top-0 z-50 p-4">
        <div className="container mx-auto">
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

      {/* Info Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {targetPOI.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Point your camera to follow the arrow
                </p>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <p className="text-primary font-semibold">
                  {(targetPOI.distance / 1000).toFixed(2)} km
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ARNavigation;
