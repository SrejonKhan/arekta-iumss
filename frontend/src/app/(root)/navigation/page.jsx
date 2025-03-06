'use client';
import { useEffect, useState, useRef } from "react";
import Script from 'next/script';

export default function Navigation() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [pois, setPois] = useState([]);
    const [isSceneReady, setIsSceneReady] = useState(false);
    const [isSceneLoading, setIsSceneLoading] = useState(true);
    const sceneRef = useRef(null);

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
                        ...calculateOffsetCoordinates(currentLat, currentLon, { north: 2, east: 2 })
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

    // Handle A-Frame scene initialization
    useEffect(() => {
        if (!isLoading && sceneRef.current) {
            const scene = sceneRef.current;

            const handleSceneLoaded = () => {
                console.log("Scene loaded successfully");
                setIsSceneReady(true);
                setIsSceneLoading(false);
            };

            const handleSceneError = (error) => {
                console.error("Scene loading error:", error);
                setError("Failed to initialize AR scene. Please refresh the page.");
                setIsSceneLoading(false);
            };

            // Add event listeners
            scene.addEventListener('loaded', handleSceneLoaded);
            scene.addEventListener('error', handleSceneError);

            // Fallback timeout after 10 seconds
            const timeoutId = setTimeout(() => {
                if (!isSceneReady) {
                    console.log("Scene load timeout - forcing ready state");
                    setIsSceneReady(true);
                    setIsSceneLoading(false);
                }
            }, 10000);

            // Cleanup
            return () => {
                scene.removeEventListener('loaded', handleSceneLoaded);
                scene.removeEventListener('error', handleSceneError);
                clearTimeout(timeoutId);
            };
        }
    }, [isLoading, isSceneReady]);

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
            <Script src="https://aframe.io/releases/1.4.0/aframe.min.js" strategy="beforeInteractive" />
            <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" strategy="beforeInteractive" />
            
            <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
                {/* Scene Loading Overlay */}
                {isSceneLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 z-20 flex items-center justify-center">
                        <div className="text-white text-center">
                            <div className="mb-4 text-xl">Initializing AR Scene...</div>
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                            <div className="mt-4 text-sm text-gray-300">Please wait while we prepare the AR experience</div>
                            <div className="mt-2 text-xs text-gray-400">This may take a few seconds</div>
                        </div>
                    </div>
                )}

                {/* Location Display */}
                <div className="absolute top-0 left-0 z-10 bg-black bg-opacity-50 text-white p-2 m-2 rounded">
                    Your Location: {userLocation?.lat.toFixed(6)}, {userLocation?.lon.toFixed(6)}
                </div>
                
                <a-scene
                    ref={sceneRef}
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
                    />
                    
                    {isSceneReady && pois.map((poi) => (
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
                            />
                            <a-text
                                value={`${poi.name}\n(${(poi.lat - userLocation.lat).toFixed(6)}, ${(poi.lon - userLocation.lon).toFixed(6)})`}
                                look-at="[gps-camera]"
                                scale="10 10 10"
                                align="center"
                                position="0 1.5 0"
                                color="#FFFFFF"
                            />
                        </a-entity>
                    ))}
                </a-scene>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-bold mb-2">Available Locations:</h3>
                <div className="grid grid-cols-2 gap-2">
                    {pois.map((poi) => (
                        <div key={poi.id} className="text-sm">
                            <strong>{poi.name}</strong>
                            <div>Lat: {poi.lat.toFixed(6)}</div>
                            <div>Lon: {poi.lon.toFixed(6)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
