"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useGeolocation } from "@/hooks/useGeolocation";

const ARNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { location } = useGeolocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isARInitialized, setIsARInitialized] = useState(false);
  const [targetLocation, setTargetLocation] = useState(null);
  const [error, setError] = useState(null);

  // Check if device is mobile
  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    const initializeAR = async () => {
      try {
        const poiId = searchParams.get("poi");
        if (!poiId || !location) return;

        // Fetch POI data from your backend or use mock data
        const mockPOIData = {
          id: poiId,
          name: "Campus Building",
          latitude: location.latitude + 0.001,
          longitude: location.longitude + 0.001,
          altitude: 0,
          description: "Campus destination",
        };

        setTargetLocation(mockPOIData);
        setIsARInitialized(true);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isMobile) {
      initializeAR();
    }
  }, [searchParams, location, isMobile]);

  const handleARScriptLoad = () => {
    if (typeof window !== "undefined" && window.AFRAME) {
      // Custom component for handling GPS-based AR
      AFRAME.registerComponent("ar-location", {
        schema: {
          latitude: { type: "number", default: 0 },
          longitude: { type: "number", default: 0 },
        },

        init: function () {
          this.camera = document.querySelector("[gps-camera]");
          this.updatePosition();

          // Update position every 1 second
          this.interval = setInterval(() => this.updatePosition(), 1000);
        },

        updatePosition: function () {
          if (!this.camera) return;

          const distance = this.calculateDistance(
            this.camera.getAttribute("position"),
            { latitude: this.data.latitude, longitude: this.data.longitude }
          );

          // Update the entity position based on distance and bearing
          const position = this.calculateARPosition(distance);
          this.el.setAttribute("position", position);
        },

        calculateDistance: function (from, to) {
          const R = 6371000; // Earth's radius in meters
          const lat1 = (from.latitude * Math.PI) / 180;
          const lat2 = (to.latitude * Math.PI) / 180;
          const deltaLat = ((to.latitude - from.latitude) * Math.PI) / 180;
          const deltaLon = ((to.longitude - from.longitude) * Math.PI) / 180;

          const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) *
              Math.cos(lat2) *
              Math.sin(deltaLon / 2) *
              Math.sin(deltaLon / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        },

        calculateARPosition: function (distance) {
          // Convert real-world distance to AR world units
          const scale = 0.1; // 1 meter = 0.1 units in AR space
          return {
            x: 0,
            y: 0,
            z: -distance * scale,
          };
        },

        remove: function () {
          if (this.interval) {
            clearInterval(this.interval);
          }
        },
      });
    }
  };

  // Desktop/Laptop warning message
  if (!isMobile) {
    return (
      <div className="fixed inset-0 bg-black/90 text-white flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="bg-yellow-500/20 p-4 rounded-full inline-block mb-4">
            <svg
              className="w-12 h-12 text-yellow-500"
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
          <h2 className="text-2xl font-bold mb-4">Mobile Device Required</h2>
          <p className="text-gray-300 mb-6">
            AR Navigation is only available on mobile devices. Please open this
            page on your smartphone or tablet to use the AR features.
          </p>
          <button
            onClick={() => router.push("/navigation")}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Map View
          </button>
        </div>
      </div>
    );
  }

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
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.4.0/aframe.min.js"
        onLoad={handleARScriptLoad}
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
      />

      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="antialias: true; alpha: true"
        embedded
      >
        <a-camera gps-camera rotation-reader />

        {targetLocation && (
          <a-entity
            ar-location={`latitude: ${targetLocation.latitude}; longitude: ${targetLocation.longitude}`}
          >
            {/* 3D Model for destination marker */}
            <a-entity
              geometry="primitive: cone; radiusBottom: 0.5; radiusTop: 0; height: 1"
              material="color: #4F46E5; opacity: 0.8"
              position="0 0 0"
              rotation="90 0 0"
              animation="property: position; to: 0 0.2 0; dir: alternate; dur: 1000; loop: true"
            />

            {/* Location name and distance */}
            <a-text
              value={targetLocation.name}
              align="center"
              position="0 1.2 0"
              scale="1 1 1"
              color="#FFFFFF"
              background="#000000"
            />
          </a-entity>
        )}
      </a-scene>

      {/* UI Controls */}
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
      {targetLocation && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="container mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {targetLocation.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Follow the 3D arrow to your destination
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ARNavigation;
