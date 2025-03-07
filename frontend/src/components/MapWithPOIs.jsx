"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useCallback, memo } from "react";
import { calculateDistance } from "@/utils/poiUtils";

// Custom marker icons with enhanced design and labels
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-container">
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          position: relative;
          transform-origin: center;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 70%;
            height: 70%;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
          "></div>
        </div>
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${color};
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
        "></div>
        ${
          label
            ? `
          <div style="
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 255, 255, 0.9);
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            color: #374151;
          ">${label}</div>
        `
            : ""
        }
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -34],
  });
};

const userIcon = createCustomIcon("#4F46E5", "You are here");
const poiIcon = createCustomIcon("#EF4444"); // No label for regular POIs
const selectedPoiIcon = createCustomIcon("#059669"); // No label for selected POI

// Memoized POI marker component
const POIMarker = memo(({ poi, isSelected, onSelect }) => (
  <Marker
    position={[poi.latitude, poi.longitude]}
    icon={createCustomIcon(isSelected ? "#059669" : "#EF4444", poi.name)}
    eventHandlers={{
      click: () => onSelect(poi),
    }}
  >
    <Popup className="custom-popup">
      <div className="p-3">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{poi.name}</h3>
        <p className="text-gray-600 text-sm">{poi.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-primary font-medium flex items-center text-sm">
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
            {poi.distance.toFixed(1)} m
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(poi);
            }}
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            Navigate
          </button>
        </div>
      </div>
    </Popup>
  </Marker>
));

POIMarker.displayName = "POIMarker";

// Map controller for handling initial bounds
const MapController = ({ userLocation, pois }) => {
  const map = useMap();
  const [hasSetInitialBounds, setHasSetInitialBounds] = useState(false);

  useEffect(() => {
    if (!userLocation || !pois.length || hasSetInitialBounds) return;

    // Create bounds including user location and POIs
    const bounds = L.latLngBounds([
      [userLocation.latitude, userLocation.longitude],
      ...pois.map((poi) => [poi.latitude, poi.longitude]),
    ]);

    // Only set bounds once on initial load with higher max zoom
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 22, // Increased max zoom for initial view
    });

    setHasSetInitialBounds(true);
  }, [map, userLocation, pois, hasSetInitialBounds]);

  return null;
};

// Memoized map component
const MapWithPOIs = memo(({ userLocation, pois, selectedPoi, onPoiSelect }) => {
  const [map, setMap] = useState(null);

  const handleMapCreated = useCallback((mapInstance) => {
    setMap(mapInstance);

    // Disable automatic zoom reset
    mapInstance.options.bounceAtZoomLimits = false;

    // Enable smooth zoom
    mapInstance.options.smoothZoom = true;
  }, []);

  const handleCenterMap = useCallback(() => {
    if (map && userLocation) {
      const currentZoom = map.getZoom();
      map.setView(
        [userLocation.latitude, userLocation.longitude],
        Math.max(currentZoom, 19), // Use current zoom or minimum of 19 for better detail
        { animate: true, duration: 1 }
      );
    }
  }, [map, userLocation]);

  if (!userLocation) return null;

  const center = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={17} // Start with a closer zoom
        minZoom={3}
        maxZoom={22} // Increased maximum zoom level
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        zoomControl={false}
        whenCreated={handleMapCreated}
        doubleClickZoom={true}
        scrollWheelZoom={true}
      >
        {/* Modern styled map layer with multiple tile servers for better zoom */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={19}
          maxZoom={22}
          tileSize={256}
          zoomOffset={0}
        />

        {/* Additional detailed layer for high zoom levels */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxNativeZoom={19}
          maxZoom={22}
          tileSize={256}
          zoomOffset={0}
          opacity={0.7}
        />

        <ZoomControl position="bottomright" />
        <MapController userLocation={userLocation} pois={pois} />

        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="text-center p-2">
              <p className="font-semibold text-gray-800">Your Location</p>
            </div>
          </Popup>
        </Marker>

        {/* POI markers */}
        {pois.map((poi) => (
          <POIMarker
            key={poi.id}
            poi={poi}
            isSelected={poi === selectedPoi}
            onSelect={onPoiSelect}
          />
        ))}
      </MapContainer>

      {/* Map controls with zoom buttons */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 z-[400] flex flex-col gap-2">
        <button
          onClick={handleCenterMap}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Center on your location"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Enhanced styles */}
      <style jsx global>{`
        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          background-color: white;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
        .custom-popup .leaflet-popup-tip-container {
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          margin-bottom: 4px !important;
          background-color: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(4px);
          color: #374151 !important;
          transition: all 0.2s ease;
        }
        .leaflet-control-zoom a:hover {
          background-color: rgba(255, 255, 255, 1) !important;
          color: #111827 !important;
        }
        .leaflet-touch .leaflet-bar {
          border: none !important;
        }
        .leaflet-touch .leaflet-control-zoom-in,
        .leaflet-touch .leaflet-control-zoom-out {
          font-size: 16px !important;
        }
        .marker-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
});

MapWithPOIs.displayName = "MapWithPOIs";

export default MapWithPOIs;
