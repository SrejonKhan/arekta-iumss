"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useGeolocation } from "@/hooks/useGeolocation";
import { generateRandomPOIs } from "@/utils/poiUtils";

// Import Leaflet map component with dynamic import (no SSR)
const MapWithPOIs = dynamic(() => import("@/components/MapWithPOIs"), {
  ssr: false,
  loading: () => (
    <div className="h-[60vh] flex items-center justify-center bg-gray-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

const MapView = () => {
  const [pois, setPois] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const { location, error: locationError } = useGeolocation();
  const [isMobile, setIsMobile] = useState(false);
  const [poisInitialized, setPoisInitialized] = useState(false);

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

  // Generate POIs only once when location is first available
  useEffect(() => {
    if (location && !poisInitialized) {
      const randomPois = generateRandomPOIs(
        location.latitude,
        location.longitude,
        5,
        10,
        10
      );
      setPois(randomPois);
      setPoisInitialized(true);
    }
  }, [location, poisInitialized]);

  const handlePoiSelect = useCallback((poi) => {
    setSelectedPoi(poi);
  }, []);

  if (locationError) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
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
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          Location Access Required
        </h2>
        <p className="text-gray-600 text-center mb-4">
          {locationError.message}
        </p>
        <p className="text-sm text-gray-500 text-center">
          Please enable location services to use this feature.
        </p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Accessing your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Map Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-[60vh]">
          <MapWithPOIs
            userLocation={location}
            pois={pois}
            selectedPoi={selectedPoi}
            onPoiSelect={handlePoiSelect}
          />
        </div>
      </div>

      {/* POI List Section */}
      {pois.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Points of Interest
            </h2>
            {isMobile && selectedPoi && (
              <Link
                href={`/navigation/ar?poi=${selectedPoi.id}`}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
                <span>Start AR Navigation</span>
              </Link>
            )}
          </div>

          {/* POI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ... Rest of your existing POI cards code ... */}
          </div>
        </div>
      )}

      {/* Selected POI Detail Panel */}
      {selectedPoi && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {/* ... Rest of your existing selected POI detail code ... */}
        </div>
      )}
    </div>
  );
};

export default MapView;
