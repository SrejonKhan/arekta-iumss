"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import { generateRandomPOIs } from "@/utils/poiUtils";
import ARView from "@/components/ARView";

// Import Leaflet map component with dynamic import (no SSR)
const MapWithPOIs = dynamic(() => import("@/components/MapWithPOIs"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] flex items-center justify-center bg-gray-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
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
        5, // 5 meters minimum
        10, // 10 meters maximum
        10 // number of POIs
      );
      setPois(randomPois);
      setPoisInitialized(true);
    }
  }, [location, poisInitialized]);

  // Handle POI selection
  const handlePoiSelect = useCallback(
    (poi) => {
      setSelectedPoi(poi);
      if (isMobile) {
        setViewMode("ar");
        setIsARInitialized(true);
      }
    },
    [isMobile]
  );

  // Handle AR navigation
  const handleARNavigation = useCallback(() => {
    if (selectedPoi && isMobile) {
      setViewMode("ar");
      setIsARInitialized(true);
    }
  }, [selectedPoi, isMobile]);

  if (locationError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
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
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Accessing your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Campus Navigation
          </h1>
          <p className="text-gray-600">
            Explore and navigate through points of interest around you
          </p>
        </div>

        {/* View toggle buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
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

        {/* AR availability message */}
        {!isMobile && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
            <div className="flex items-center text-yellow-800">
              <svg
                className="w-5 h-5 mr-2"
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
              <p>AR navigation is only available on mobile devices</p>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[50vh]">
            <MapWithPOIs
              userLocation={location}
              pois={pois}
              selectedPoi={selectedPoi}
              onPoiSelect={handlePoiSelect}
            />
          </div>
        </div>

        {/* POI List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pois.map((poi) => (
            <div
              key={poi.id}
              onClick={() => handlePoiSelect(poi)}
              className={`${
                selectedPoi?.id === poi.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50"
              } cursor-pointer border-2 rounded-xl p-4 transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {poi.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {poi.description}
                  </p>
                </div>
                <div className="bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg">
                  <p className="text-primary font-medium text-sm">
                    {(poi.distance / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-3 text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                {poi.category}
              </div>
            </div>
          ))}
        </div>

        {/* Selected POI Detail Panel */}
        {selectedPoi && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedPoi.name}
                </h2>
                <p className="text-gray-600 mt-2">{selectedPoi.description}</p>
                <div className="flex items-center mt-4 text-gray-500">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {selectedPoi.category}
                </div>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <p className="text-primary font-semibold">
                  {(selectedPoi.distance / 1000).toFixed(2)} km
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
