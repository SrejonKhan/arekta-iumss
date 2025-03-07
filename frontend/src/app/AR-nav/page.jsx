"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

const ARNavigation = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [destination, setDestination] = useState(null);

  // Check if device is mobile and has necessary capabilities
  useEffect(() => {
    const checkDeviceCapabilities = async () => {
      try {
        const isMobileDevice =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        setIsMobile(isMobileDevice);

        if (!isMobileDevice) {
          setError("Please use a mobile device to access AR navigation.");
          return;
        }

        // Check for device orientation and geolocation support
        if (!window.DeviceOrientationEvent) {
          setError("Your device doesn't support AR features.");
          return;
        }

        // Get destination from localStorage
        const storedDestination = localStorage.getItem("currentDestination");
        if (!storedDestination) {
          setError(
            "No destination selected. Please select a destination from the map."
          );
          return;
        }

        const parsedDestination = JSON.parse(storedDestination);
        setDestination(parsedDestination);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to initialize AR navigation");
      }
    };

    checkDeviceCapabilities();
  }, []);

  // Initialize AR scene
  const initializeAR = () => {
    if (typeof window !== "undefined" && window.AFRAME) {
      // Register custom A-Frame component for handling AR markers
      AFRAME.registerComponent("ar-marker", {
        schema: {
          name: { type: "string" },
          latitude: { type: "number" },
          longitude: { type: "number" },
        },

        init: function () {
          this.setupMarker();
          this.startPositionUpdates();
        },

        setupMarker: function () {
          // Set up the marker
          this.el.setAttribute("geometry", {
            primitive: "cylinder",
            height: 0.5,
            radius: 0.2,
          });
          this.el.setAttribute("material", {
            color: "#4F46E5",
            opacity: 0.8,
          });

          // Add floating animation
          this.el.setAttribute("animation", {
            property: "position",
            dir: "alternate",
            dur: 1000,
            easing: "easeInOutSine",
            loop: true,
            to: "0 0.2 0",
          });
        },

        startPositionUpdates: function () {
          // Update position based on GPS
          this.updatePosition();
          this.positionInterval = setInterval(
            () => this.updatePosition(),
            1000
          );
        },

        updatePosition: function () {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
              const distance = this.calculateDistance(
                position.coords.latitude,
                position.coords.longitude,
                this.data.latitude,
                this.data.longitude
              );

              // Convert real-world distance to AR space
              const scale = 0.1; // 1 meter = 0.1 units
              this.el.setAttribute("position", {
                x: 0,
                y: 0,
                z: -distance * scale,
              });
            });
          }
        },

        calculateDistance: function (lat1, lon1, lat2, lon2) {
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

        remove: function () {
          if (this.positionInterval) {
            clearInterval(this.positionInterval);
          }
        },
      });
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 text-white flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="bg-red-500/20 p-4 rounded-full inline-block mb-4">
            <svg
              className="w-12 h-12 text-red-500"
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
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push("/navigation")}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !destination) {
    return (
      <div className="fixed inset-0 bg-black/90 text-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading AR Navigation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.4.0/aframe.min.js"
        onLoad={initializeAR}
        strategy="afterInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="afterInteractive"
      />

      {/* AR Scene */}
      <a-scene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix;"
      >
        {/* Camera */}
        <a-entity
          camera
          position="0 1.6 0"
          look-controls
          wasd-controls
        ></a-entity>

        {/* Destination Marker */}
        <a-entity
          ar-marker={`name: ${destination.name}; latitude: ${destination.latitude}; longitude: ${destination.longitude}`}
        >
          <a-text
            value={destination.name}
            align="center"
            position="0 1 0"
            scale="0.5 0.5 0.5"
            color="#FFFFFF"
            background="#000000"
          ></a-text>
        </a-entity>
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
                  {destination.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Point your camera to follow the AR marker
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
