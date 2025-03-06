'use client';
import { useEffect, useState } from "react";
import Script from 'next/script';

export default function Navigation() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [pois, setPois] = useState([]);

    // Campus POIs with their names and coordinates
    const campusPOIs = [
        { id: 1, name: "Library", lat: 23.810331, lon: 90.412521 }, // Replace with actual coordinates
        { id: 2, name: "Cafeteria", lat: 0, lon: 0 },
        { id: 3, name: "Main Hall", lat: 0, lon: 0 },
        { id: 4, name: "Sports Complex", lat: 0, lon: 0 },
        { id: 5, name: "Parking", lat: 0, lon: 0 }
    ];

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

                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });

                setPois(campusPOIs);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        checkDeviceCompatibility();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading AR Navigation...</div>;
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
                                value={poi.name}
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
