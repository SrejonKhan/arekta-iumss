"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { calculateDistance } from "@/utils/poiUtils";

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Custom POI icon based on category
const createPoiIcon = (category) => {
  // Map category to a color
  const categoryColors = {
    Restaurant: "#FF5733",
    Cafe: "#C70039",
    Park: "#44BD32",
    Museum: "#7158E2",
    Shopping: "#3498DB",
    Hotel: "#F1C40F",
    Landmark: "#E74C3C",
    Entertainment: "#9B59B6",
    Beach: "#3498DB",
    Sports: "#2ECC71",
  };

  const color = categoryColors[category] || "#3498DB";

  return L.divIcon({
    className: "custom-poi-icon",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const MapWithPOIs = ({ userLocation, pois, selectedPoi, onPoiSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Initialize map
  useEffect(() => {
    if (!userLocation) return;

    // Fix Leaflet icon issues
    fixLeafletIcon();

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [userLocation.latitude, userLocation.longitude],
        14
      );

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add user marker
      const userMarker = L.marker(
        [userLocation.latitude, userLocation.longitude],
        {
          icon: L.divIcon({
            className: "user-location-icon",
            html: `<div style="background-color: #2563EB; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #2563EB;"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        }
      ).addTo(mapInstanceRef.current);

      userMarker.bindPopup("Your Location").openPopup();

      // Add accuracy circle
      if (userLocation.accuracy) {
        L.circle([userLocation.latitude, userLocation.longitude], {
          radius: userLocation.accuracy,
          color: "#2563EB",
          fillColor: "#60A5FA",
          fillOpacity: 0.15,
        }).addTo(mapInstanceRef.current);
      }
    } else {
      // Update map view if user location changes
      mapInstanceRef.current.setView(
        [userLocation.latitude, userLocation.longitude],
        mapInstanceRef.current.getZoom()
      );
    }

    // Clean up function
    return () => {
      if (mapInstanceRef.current) {
        // We don't actually remove the map here to prevent re-initialization issues
        // mapInstanceRef.current.remove();
        // mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  // Add/update POI markers
  useEffect(() => {
    if (!mapInstanceRef.current || !pois || pois.length === 0) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    pois.forEach((poi) => {
      const marker = L.marker([poi.latitude, poi.longitude], {
        icon: createPoiIcon(poi.category),
      }).addTo(mapInstanceRef.current);

      // Add popup with POI info
      marker.bindPopup(`
        <div class="poi-popup">
          <h3 class="font-bold">${poi.name}</h3>
          <p class="text-sm">${poi.category}</p>
          <p class="text-sm">${poi.distance.toFixed(2)} km away</p>
          <button class="select-poi-btn bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2">
            Navigate Here
          </button>
        </div>
      `);

      // Add click event to marker
      marker.on("click", () => {
        onPoiSelect(poi);
      });

      // Add click event to button in popup
      marker.getPopup().on("add", (event) => {
        const selectBtn =
          event.target._contentNode.querySelector(".select-poi-btn");
        if (selectBtn) {
          selectBtn.addEventListener("click", () => {
            onPoiSelect(poi);
          });
        }
      });

      // Store marker reference
      markersRef.current[poi.id] = marker;
    });

    // Highlight selected POI if any
    if (selectedPoi && markersRef.current[selectedPoi.id]) {
      const marker = markersRef.current[selectedPoi.id];
      marker.setIcon(
        L.divIcon({
          className: "selected-poi-icon",
          html: `<div style="background-color: #EF4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #EF4444;"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        })
      );
      marker.openPopup();

      // Draw line from user to selected POI
      const line = L.polyline(
        [
          [userLocation.latitude, userLocation.longitude],
          [selectedPoi.latitude, selectedPoi.longitude],
        ],
        {
          color: "#EF4444",
          weight: 3,
          opacity: 0.7,
          dashArray: "10, 10",
          lineCap: "round",
        }
      ).addTo(mapInstanceRef.current);

      // Store line reference for cleanup
      markersRef.current["route-line"] = line;
    }
  }, [pois, selectedPoi, userLocation, onPoiSelect]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default MapWithPOIs;
