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
import { useEffect, useState } from "react";
import { calculateDistance } from "@/utils/poiUtils";

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
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
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const userIcon = createCustomIcon("#4F46E5"); // Primary color for user
const poiIcon = createCustomIcon("#EF4444"); // Red color for POIs
const selectedPoiIcon = createCustomIcon("#059669"); // Green color for selected POI

const MapWithPOIs = ({ userLocation, pois, selectedPoi, onPoiSelect }) => {
  const [map, setMap] = useState(null);

  if (!userLocation) return null;

  const center = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        zoomControl={false}
        whenCreated={setMap}
      >
        {/* Modern map style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />

        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="text-center p-3">
              <p className="font-semibold text-gray-800 text-lg">
                Your Location
              </p>
              <p className="text-sm text-gray-500 mt-1">Current Position</p>
            </div>
          </Popup>
        </Marker>

        {/* POI markers */}
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.latitude, poi.longitude]}
            icon={poi === selectedPoi ? selectedPoiIcon : poiIcon}
            eventHandlers={{
              click: () => onPoiSelect(poi),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {poi.name}
                </h3>
                <p className="text-gray-600 text-sm">{poi.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary font-medium flex items-center">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {poi.distance.toFixed(2)} km
                  </span>
                  <button
                    onClick={() => onPoiSelect(poi)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Navigate
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map overlay controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-[400]">
        <button
          onClick={() => map?.setView(center, 14)}
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

      {/* Custom styles */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 240px;
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
        }
      `}</style>
    </div>
  );
};

export default MapWithPOIs;
