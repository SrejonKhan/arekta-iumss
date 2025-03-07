"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import { generateRandomPOIs } from "@/utils/poiUtils";
import ARView from "@/components/ARView";

// Import Leaflet map component with dynamic import (no SSR)
const MapWithPOIs = dynamic(() => import("@/components/MapWithPOIs"), {
  ssr: false,
  loading: () => (
    <div className="h-[50vh] flex items-center justify-center">
      Loading map...
    </div>
  ),
});

const NavigationPage = () => {
  const [viewMode, setViewMode] = useState("map");
  const [pois, setPois] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const { location, error: locationError } = useGeolocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isARInitialized, setIsARInitialized] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate random POIs when location changes
  useEffect(() => {
    if (location) {
      // Generate 10 random POIs within 5-10km radius
      const randomPois = generateRandomPOIs(
        location.latitude,
        location.longitude,
        5,
        10,
        10
      );
      setPois(randomPois);
    }
  }, [location]);

  const handlePoiSelect = (poi) => {
    setSelectedPoi(poi);
    if (isMobile) {
      setViewMode("ar");
    }
  };

  if (locationError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error accessing your location: {locationError.message}</p>
          <p>Please enable location services to use this feature.</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Accessing your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Campus Navigation
        </h1>

        {/* View toggle buttons */}
        <div className="flex mb-6 space-x-3">
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-semibold ${
              viewMode === "map"
                ? "bg-primary text-white shadow-lg transform scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Map View
            </span>
          </button>

          {isMobile && (
            <button
              onClick={() => {
                setViewMode("ar");
                setIsARInitialized(true);
              }}
              className={`px-6 py-3 rounded-lg transition-all duration-200 font-semibold ${
                viewMode === "ar"
                  ? "bg-primary text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
              disabled={!selectedPoi}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                AR Navigation
              </span>
            </button>
          )}
        </div>

        {/* Display message if AR is not available */}
        {!isMobile && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>AR navigation is only available on mobile devices.</p>
            </div>
          </div>
        )}

        {/* Map or AR view based on selected mode */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {viewMode === "map" ? (
            <div className="h-[70vh] relative">
              <MapWithPOIs
                userLocation={location}
                pois={pois}
                selectedPoi={selectedPoi}
                onPoiSelect={handlePoiSelect}
              />
            </div>
          ) : (
            <div className="h-[70vh] relative">
              {selectedPoi ? (
                <ARView
                  userLocation={location}
                  destination={selectedPoi}
                  onBack={() => setViewMode("map")}
                  isInitialized={isARInitialized}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-600">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      Select a POI from the map first
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Return to map view to choose a destination
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* POI information panel */}
        {selectedPoi && (
          <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedPoi.name}
                </h2>
                <p className="text-gray-600 mt-2">{selectedPoi.description}</p>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <p className="text-primary font-semibold">
                  {selectedPoi.distance.toFixed(2)} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationPage;
