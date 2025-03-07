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
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'ar'
  const [pois, setPois] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const { location, error: locationError } = useGeolocation();
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Explore Nearby</h1>

      {/* View toggle buttons */}
      <div className="flex mb-4 space-x-2">
        <button
          onClick={() => setViewMode("map")}
          className={`px-4 py-2 rounded ${
            viewMode === "map" ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          Map View
        </button>

        {isMobile && (
          <button
            onClick={() => setViewMode("ar")}
            className={`px-4 py-2 rounded ${
              viewMode === "ar" ? "bg-primary text-white" : "bg-gray-200"
            }`}
            disabled={!selectedPoi}
          >
            AR Navigation
          </button>
        )}
      </div>

      {/* Display message if AR is not available */}
      {!isMobile && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          <p>AR navigation is only available on mobile devices.</p>
        </div>
      )}

      {/* Map or AR view based on selected mode */}
      {viewMode === "map" ? (
        <div className="h-[70vh] rounded-lg overflow-hidden shadow-lg">
          <MapWithPOIs
            userLocation={location}
            pois={pois}
            selectedPoi={selectedPoi}
            onPoiSelect={handlePoiSelect}
          />
        </div>
      ) : (
        <div className="h-[70vh] rounded-lg overflow-hidden shadow-lg">
          {selectedPoi ? (
            <ARView
              userLocation={location}
              destination={selectedPoi}
              onBack={() => setViewMode("map")}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p>Please select a POI from the map first</p>
            </div>
          )}
        </div>
      )}

      {/* POI information panel */}
      {selectedPoi && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">{selectedPoi.name}</h2>
          <p className="text-gray-600">{selectedPoi.description}</p>
          <p className="mt-2">
            <span className="font-medium">Distance:</span>{" "}
            {selectedPoi.distance.toFixed(2)} km
          </p>
        </div>
      )}
    </div>
  );
};

export default NavigationPage;
