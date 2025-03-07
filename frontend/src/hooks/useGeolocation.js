"use client";

import { useState, useEffect } from "react";

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get position
  const getPosition = async () => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by your browser"));
      setLoading(false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout to 15 seconds
      maximumAge: 0,
      ...options,
    };

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, geoOptions);
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      setError(null);
      setLoading(false);
    } catch (err) {
      console.warn("Error getting location:", err);
      setError(err);
      setLoading(false);

      // Retry after 2 seconds if it's a timeout error
      if (err.code === err.TIMEOUT) {
        setTimeout(() => {
          setLoading(true);
          setError(null);
          getPosition();
        }, 2000);
      }
    }
  };

  useEffect(() => {
    getPosition();

    // Set up watch position for continuous updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.warn("Watch position error:", error);
        setError(error);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        ...options,
      }
    );

    // Clean up
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  // Expose a retry function
  const retry = () => {
    setLoading(true);
    setError(null);
    getPosition();
  };

  return { location, error, loading, retry };
};
