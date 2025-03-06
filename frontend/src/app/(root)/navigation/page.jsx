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
    const [hasDevicePermissions, setHasDevicePermissions] = useState(false);
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

    // Add new function to handle device orientation permission
    const requestDeviceOrientationPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && 
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    setHasDevicePermissions(true);
                } else {
                    throw new Error('Device orientation permission denied');
                }
            } catch (err) {
                setError('Please grant device orientation permissions to use AR features');
                setIsLoading(false);
            }
        } else {
            // For non-iOS devices or devices that don't need explicit permission
            setHasDevicePermissions(true);
        }
    };

    // Modify the checkDeviceCompatibility function
    const checkDeviceCompatibility = async () => {
        try {
            // First check if we're on a mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );
            
            if (!isMobile) {
                throw new Error("Please use a mobile device for AR navigation");
            }

            // Request location permission first
            console.log("Requesting location permission...");
            const locationPermission = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position),
                    (error) => reject(error),
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });

            console.log("Location permission granted");
            const currentLat = locationPermission.coords.latitude;
            const currentLon = locationPermission.coords.longitude;

            // Then request camera permission
            console.log("Requesting camera permission...");
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: 'environment'
                },
                audio: false 
            });
            stream.getTracks().forEach(track => track.stop());
            console.log("Camera permission granted");

            // Then check device orientation
            console.log("Checking device orientation...");
            if (!window.DeviceOrientationEvent) {
                throw new Error("Device orientation not supported");
            }

            await requestDeviceOrientationPermission();
            console.log("Device orientation permission granted");

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
            console.error("Device compatibility check failed:", err);
            let errorMessage = err.message;
            
            if (err.name === 'NotAllowedError') {
                errorMessage = 'Camera access denied. Please grant camera permissions and refresh the page.';
            } else if (err.code === 1) { // PERMISSION_DENIED for geolocation
                errorMessage = 'Location access denied. Please grant location permissions and refresh the page.';
            } else if (err.code === 2) { // POSITION_UNAVAILABLE
                errorMessage = 'Location unavailable. Please ensure location services are enabled.';
            } else if (err.code === 3) { // TIMEOUT
                errorMessage = 'Location request timed out. Please try again.';
            }
            
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    // Modify the useEffect to handle permissions
    useEffect(() => {
        checkDeviceCompatibility();
    }, []);

    // Handle A-Frame scene initialization
    useEffect(() => {
        if (!isLoading && !error && sceneRef.current) {
            const scene = sceneRef.current;
            let isInitialized = false;

            const handleSceneLoaded = () => {
                console.log("Scene loaded successfully");
                isInitialized = true;
                setIsSceneReady(true);
                setIsSceneLoading(false);
            };

            const handleSceneError = (error) => {
                console.error("Scene loading error:", error);
                setError("AR scene failed to initialize. Please ensure all permissions are granted and refresh the page.");
                setIsSceneLoading(false);
            };

            // Check if scene is already loaded
            if (scene.hasLoaded) {
                console.log("Scene was already loaded");
                handleSceneLoaded();
                return;
            }

            // Add event listeners
            scene.addEventListener('loaded', handleSceneLoaded);
            scene.addEventListener('error', handleSceneError);

            // More aggressive timeout handling
            const timeoutId = setTimeout(() => {
                if (!isInitialized) {
                    console.log("Scene load timeout - checking scene state");
                    
                    // Check if scene appears to be working despite not firing the loaded event
                    if (scene.hasLoaded || scene.renderStarted) {
                        console.log("Scene appears functional, forcing ready state");
                        handleSceneLoaded();
                    } else {
                        console.error("Scene failed to initialize properly");
                        handleSceneError(new Error("Scene initialization timeout"));
                    }
                }
            }, 5000); // Reduced timeout to 5 seconds

            // Cleanup
            return () => {
                scene.removeEventListener('loaded', handleSceneLoaded);
                scene.removeEventListener('error', handleSceneError);
                clearTimeout(timeoutId);
            };
        }
    }, [isLoading, error]);

    // Add a permission request button for iOS
    if (!hasDevicePermissions && !error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <button 
                        onClick={requestDeviceOrientationPermission}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Enable AR Features
                    </button>
                    <div className="mt-4 text-sm text-gray-500">
                        Please click to enable device orientation for AR
                    </div>
                </div>
            </div>
        );
    }

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
            <Script 
                src="https://aframe.io/releases/1.4.0/aframe.min.js" 
                strategy="beforeInteractive"
                onLoad={() => console.log("A-Frame core loaded")}
                onError={(e) => console.error("A-Frame failed to load:", e)}
            />
            <Script 
                src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" 
                strategy="beforeInteractive"
                onLoad={() => console.log("AR.js loaded")}
                onError={(e) => console.error("AR.js failed to load:", e)}
            />
            
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
                    arjs="sourceType: webcam; debugUIEnabled: true; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best;"
                    vr-mode-ui="enabled: false"
                    renderer="logarithmicDepthBuffer: true; antialias: true; precision: mediump;"
                    inspector="url: https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
                    loading="eager"
                    onError={(e) => console.error("A-Scene error:", e)}
                >
                    <a-camera
                        gps-camera="minDistance: 1; maxDistance: 100000"
                        rotation-reader
                        position="0 1.6 0"
                        look-controls="enabled: true"
                        arjs-look-controls="smoothingFactor: 0.1"
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
