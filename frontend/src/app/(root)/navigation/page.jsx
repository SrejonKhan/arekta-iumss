'use client';
import { useEffect, useState } from "react";
import Script from 'next/script';

export default function Navigation() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [pois, setPois] = useState([]);

    // Function to calculate offset coordinates
    const calculateOffsetCoordinates = (baseLat, baseLon, offsetMeters) => {
        // Earth's radius in meters
        const R = 6371000;
        
        // Convert offset from meters to degrees
        const latOffset = (offsetMeters.north / R) * (180 / Math.PI);
        const lonOffset = (offsetMeters.east / (R * Math.cos(baseLat * Math.PI / 180))) * (180 / Math.PI);
        
        return {
            lat: baseLat + latOffset,
            lon: baseLon + lonOffset
        };
    };

    useEffect(() => {
        // Check if running on mobile and has necessary permissions
        const checkDeviceCompatibility = async () => {
            try {
                // Check for device orientation API
                if (!window.DeviceOrientationEvent) {
                    throw new Error("Device orientation not supported");
                }

                // Request location permission
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true
                    });
                });

                const currentLat = position.coords.latitude;
                const currentLon = position.coords.longitude;

                setUserLocation({
                    lat: currentLat,
                    lon: currentLon
                });

                // Define POIs relative to user's location
                const relativePOIs = [
                    { 
                        id: 1, 
                        name: "Library", 
                        ...calculateOffsetCoordinates(currentLat, currentLon, { north: 50, east: 30 })
                    },
                    { 
                        id: 2, 
                        name: "Cafeteria", 
                        ...calculateOffsetCoordinates(currentLat, currentLon, { north: -20, east: 40 })
                    },
                    { 
                        id: 3, 
                        name: "Main Hall", 
                        ...calculateOffsetCoordinates(currentLat, currentLon, { north: 30, east: -25 })
                    },
                    { 
                        id: 4, 
                        name: "Sports Complex", 
                        ...calculateOffsetCoordinates(currentLat, currentLon, { north: -40, east: -35 })
                    },
                    { 
                        id: 5, 
                        name: "Parking", 
                        ...calculateOffsetCoordinates(currentLat, currentLon, { north: 15, east: 60 })
                    }
                ];

                setPois(relativePOIs);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        checkDeviceCompatibility();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="mb-4">Loading AR Navigation...</div>
                    <div className="text-sm text-gray-500">Please allow location access when prompted</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                Error: {error}. Please ensure location services are enabled and you're using a mobile device.
            </div>
        );
    }

    return (
        <>
            <Script src="https://aframe.io/releases/1.4.0/aframe.min.js" />
            <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" />
            
            <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
                <div className="absolute top-0 left-0 z-10 bg-black bg-opacity-50 text-white p-2 m-2 rounded">
                    Your Location: {userLocation?.lat.toFixed(6)}, {userLocation?.lon.toFixed(6)}
                </div>
                
                <a-scene
                    embedded
                    arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
                    vr-mode-ui="enabled: false"
                    renderer="logarithmicDepthBuffer: true;"
                    inspector="url: https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
                >
                    <a-camera
                        gps-camera="minDistance: 1; maxDistance: 100000"
                        rotation-reader
                        position="0 1.6 0"
                    ></a-camera>

                    {pois.map((poi) => (
                        <a-entity
                            key={poi.id}
                            gps-entity-place={`latitude: ${poi.lat}; longitude: ${poi.lon}`}
                            look-at="[gps-camera]"
                            scale="15 15 15"
                        >
                            <a-box
                                color="#FF0000"
                                position="0 0 0"
                                scale="1 1 1"
                            ></a-box>
                            <a-text
                                value={`${poi.name}\n(${(poi.lat - userLocation.lat).toFixed(6)}, ${(poi.lon - userLocation.lon).toFixed(6)})`}
                                look-at="[gps-camera]"
                                scale="10 10 10"
                                align="center"
                                position="0 1.5 0"
                                color="#FFFFFF"
                            ></a-text>
                        </a-entity>
                    ))}
                </a-scene>
            </div>
        </>
    );
}
