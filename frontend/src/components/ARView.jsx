"use client";

import { useEffect, useRef, useState } from "react";
import { calculateDistance, calculateBearing } from "@/utils/poiUtils";

const ARView = ({ userLocation, destination, onBack, isInitialized }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [deviceOrientation, setDeviceOrientation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [arrowDirection, setArrowDirection] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isInitialized) return;

    // Request camera access
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        setError("Camera access denied. Please enable camera permissions.");
        console.error("Camera access error:", err);
      }
    };

    initCamera();

    // Initialize device orientation
    const handleOrientation = (event) => {
      if (!userLocation || !destination) return;

      const targetBearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        destination.latitude,
        destination.longitude
      );

      // Get device compass heading (alpha)
      const compass = event.webkitCompassHeading || Math.abs(event.alpha - 360);
      const relativeBearing = (targetBearing - compass + 360) % 360;
      setBearing(relativeBearing);
    };

    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
          } else {
            setError(
              "Compass access denied. Please enable orientation permissions."
            );
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isInitialized, userLocation, destination]);

  // Update distance and bearing to destination
  const updatePositionData = () => {
    if (!userLocation || !destination) return;

    // Calculate distance
    const dist = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      destination.latitude,
      destination.longitude
    );
    setDistance(dist);

    // Calculate bearing
    const bear = calculateBearing(
      userLocation.latitude,
      userLocation.longitude,
      destination.latitude,
      destination.longitude
    );
    setBearing(bear);
  };

  // Draw AR overlay
  useEffect(() => {
    if (!canvasRef.current || !deviceOrientation || bearing === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match container
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw direction arrow
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const arrowSize = Math.min(canvas.width, canvas.height) * 0.15;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((arrowDirection * Math.PI) / 180);

    // Draw arrow
    ctx.beginPath();
    ctx.moveTo(0, -arrowSize);
    ctx.lineTo(arrowSize / 2, arrowSize / 2);
    ctx.lineTo(0, arrowSize / 4);
    ctx.lineTo(-arrowSize / 2, arrowSize / 2);
    ctx.closePath();

    ctx.fillStyle = "rgba(239, 68, 68, 0.8)"; // Red with transparency
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Draw destination info
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(destination.name, centerX, canvas.height - 120);

    ctx.font = "14px Arial";
    ctx.fillText(
      `Distance: ${distance.toFixed(2)} km`,
      centerX,
      canvas.height - 100
    );

    // Draw compass
    const compassRadius = 40;
    const compassX = canvas.width - compassRadius - 20;
    const compassY = compassRadius + 20;

    ctx.beginPath();
    ctx.arc(compassX, compassY, compassRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();

    // Draw compass directions
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Adjust for device orientation
    const compassRotation = deviceOrientation.alpha || 0;

    ctx.save();
    ctx.translate(compassX, compassY);
    ctx.rotate((-compassRotation * Math.PI) / 180);

    // North
    ctx.fillText("N", 0, -compassRadius + 12);
    // East
    ctx.fillText("E", compassRadius - 12, 0);
    // South
    ctx.fillText("S", 0, compassRadius - 12);
    // West
    ctx.fillText("W", -compassRadius + 12, 0);

    // Draw compass needle
    ctx.beginPath();
    ctx.moveTo(0, -compassRadius + 15);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, 5);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.restore();
  }, [deviceOrientation, bearing, distance, arrowDirection, destination]);

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-red-900 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={onBack}
            className="mt-4 bg-white text-red-900 px-4 py-2 rounded font-bold"
          >
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="animate-pulse mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Requesting Permissions</h2>
        <p className="text-center mb-4">
          Please allow access to your camera and device orientation to use AR
          navigation.
        </p>
        <button
          onClick={onBack}
          className="bg-white text-gray-900 px-4 py-2 rounded font-bold"
        >
          Back to Map
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* AR overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* UI controls */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBack}
          className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Distance indicator */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-3/4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-center">
        <div className="text-sm">
          {distance !== null ? (
            <>
              <span className="font-bold">{destination.name}</span>
              <br />
              <span>{distance.toFixed(2)} km away</span>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.max(0, 100 - distance * 10)}%` }}
                ></div>
              </div>
            </>
          ) : (
            <span>Calculating distance...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARView;
