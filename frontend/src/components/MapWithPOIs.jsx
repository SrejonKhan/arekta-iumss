"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { calculateDistance } from "@/utils/poiUtils";

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const userIcon = createCustomIcon("#4F46E5"); // Primary color for user
const poiIcon = createCustomIcon("#EF4444"); // Red color for POIs
const selectedPoiIcon = createCustomIcon("#059669"); // Green color for selected POI

// Component to handle map center updates
const MapController = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

const MapWithPOIs = ({ userLocation, pois, selectedPoi, onPoiSelect }) => {
  if (!userLocation) return null;

  const center = [userLocation.latitude, userLocation.longitude];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      {/* Modern map style */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapController center={center} />

      {/* User location marker */}
      <Marker position={center} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold">Your Location</p>
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
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{poi.name}</h3>
              <p className="text-gray-600">{poi.description}</p>
              <p className="mt-2 font-medium text-primary">
                {poi.distance.toFixed(2)} km away
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithPOIs;
