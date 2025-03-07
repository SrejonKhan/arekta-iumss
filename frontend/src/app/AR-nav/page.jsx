"use client";
import { useEffect, useState } from "react";

const ARNavigation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [pois, setPois] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setUserLocation({ lat: userLat, lon: userLon });

        const numPOIs = 5;
        const poiOffsets = [
          [0.0002, 0.0003],
          [-0.0003, 0.0002],
          [0.0001, -0.0002],
          [-0.0002, -0.0003],
          [0.0004, 0.0001],
        ];

        const generatedPOIs = poiOffsets.map(
          ([latOffset, lonOffset], index) => ({
            id: index,
            lat: userLat + latOffset,
            lon: userLon + lonOffset,
          })
        );

        setPois(generatedPOIs);
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: true;">
      <a-camera gps-camera rotation-reader></a-camera>
      {pois.map((poi) => (
        <a-entity
          key={poi.id}
          gps-entity-place={`latitude: ${poi.lat}; longitude: ${poi.lon}`}
          geometry="primitive: box; height: 2; width: 2; depth: 2"
          material="color: red"
          scale="3 3 3"
        >
          <a-text
            value={`POI ${poi.id + 1}`}
            position="0 2.5 0"
            align="center"
            color="white"
          ></a-text>
        </a-entity>
      ))}
    </a-scene>
  );
};

export default ARNavigation;
