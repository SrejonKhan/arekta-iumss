"use client";

import { useState, useEffect } from "react";

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by your browser"));
      setLoading(false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      ...options,
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
      geoOptions
    );

    // Set up watch position for continuous updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
      geoOptions
    );

    // Clean up
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return { location, error, loading };
};
