
'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const config = {
    traccarServer: 'https://demo.traccar.org',
    traccarUsername: 'knownaskawsar@gmail.com',
    traccarPassword: 'k@wch@r#',
    busDeviceId: '3497',
    defaultLocation: {
        lat: 23.4613464,
        lng: 91.1890411,
        zoom: 15
    },
    updateInterval: 10000,
    addressUpdateInterval: 10000
};

export default function TransportMap() {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [busMarker, setBusMarker] = useState(null);
    const [accuracyCircle, setAccuracyCircle] = useState(null);
    const [tripPath, setTripPath] = useState(null);
    const [tripPoints, setTripPoints] = useState([]);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        // Fix for Leaflet icon issue in Next.js
        const fixLeafletIcons = () => {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        };

        if (typeof window !== 'undefined' && !map && mapRef.current) {
            const L = require('leaflet');
            fixLeafletIcons();

            // Initialize map
            const mapInstance = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: true
            }).setView(
                [config.defaultLocation.lat, config.defaultLocation.lng],
                config.defaultLocation.zoom
            );

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                className: 'map-tiles'
            }).addTo(mapInstance);

            // Initialize trip path
            const path = L.polyline([], {
                color: '#1a73e8',
                weight: 4,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'animated-path'
            }).addTo(mapInstance);

            setMap(mapInstance);
            setTripPath(path);

            // Add zoom control
            L.control.zoom({
                position: 'bottomright'
            }).addTo(mapInstance);

            // Add scale control
            L.control.scale({
                imperial: false,
                position: 'bottomleft'
            }).addTo(mapInstance);

            // Force a resize to ensure the map renders properly
            setTimeout(() => {
                mapInstance.invalidateSize();
            }, 100);

            return () => {
                mapInstance.remove();
            };
        }
    }, []);

    // Function to fetch address using OpenStreetMap Nominatim
    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': 'University-Bus-Tracker'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }

            const data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Address not available';
        }
    };

    // Authentication
    const login = async () => {
        try {
            const formData = new URLSearchParams();
            formData.append('email', config.traccarUsername);
            formData.append('password', config.traccarPassword);

            const response = await fetch(`${config.traccarServer}/api/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: formData.toString()
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const data = await response.json();
            setSessionId(data.id);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const getAuthHeaders = () => ({
        'Authorization': `Basic ${btoa(`${config.traccarUsername}:${config.traccarPassword}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    const getBusLocation = async () => {
        try {
            if (!sessionId) {
                await login();
            }

            const positionResponse = await fetch(
                `${config.traccarServer}/api/positions?deviceId=${config.busDeviceId}`,
                { headers: getAuthHeaders() }
            );

            if (!positionResponse.ok) {
                if (positionResponse.status === 401) {
                    await login();
                    return getBusLocation();
                }
                throw new Error(`Failed to fetch position: ${positionResponse.status}`);
            }

            const positions = await positionResponse.json();
            if (!positions || positions.length === 0) {
                throw new Error('No position data available');
            }

            const deviceResponse = await fetch(
                `${config.traccarServer}/api/devices/${config.busDeviceId}`,
                { headers: getAuthHeaders() }
            );

            let deviceData = null;
            if (deviceResponse.ok) {
                deviceData = await deviceResponse.json();
            }

            const formattedData = formatPositionData(positions[0], deviceData);
            setCurrentLocation(formattedData);
            return formattedData;
        } catch (error) {
            console.error('Error fetching bus location:', error);
            return null;
        }
    };

    const formatPositionData = (position, device = null) => {
        return {
            lat: position.latitude,
            lng: position.longitude,
            speed: position.speed * 3.6,
            lastUpdate: new Date(position.fixTime),
            accuracy: position.accuracy,
            altitude: position.altitude,
            battery: position.attributes?.batteryLevel,
            motion: position.attributes?.motion || false,
            course: position.course,
            valid: position.valid,
            distance: position.attributes?.distance || 0,
            id: position.id,
            address: position.address || 'Fetching address...',
            ...(device && {
                name: device.name,
                status: device.status,
                lastUpdate: new Date(device.lastUpdate)
            })
        };
    };

    // Update address separately from location updates
    useEffect(() => {
        let addressInterval;

        const updateAddress = async () => {
            if (currentLocation) {
                const address = await fetchAddress(currentLocation.lat, currentLocation.lng);
                const updatedLocation = { ...currentLocation, address };
                setCurrentLocation(updatedLocation);
                updateStatusDisplay(updatedLocation);
            }
        };

        if (currentLocation) {
            // Initial address fetch
            updateAddress();

            // Set up interval for address updates
            addressInterval = setInterval(updateAddress, config.addressUpdateInterval);
        }

        return () => {
            if (addressInterval) {
                clearInterval(addressInterval);
            }
        };
    }, [currentLocation?.lat, currentLocation?.lng]);

    const updateBusMarker = (location) => {
        if (!location || !map) return;

        const L = require('leaflet');
        const point = [location.lat, location.lng];

        // Update trip path
        setTripPoints(prev => [...prev, point]);
        tripPath?.setLatLngs(tripPoints);

        // Create or update bus marker
        const busIcon = L.divIcon({
            className: location.motion ? 'bus-icon moving' : 'bus-icon',
            html: `
        <i class="fas fa-bus" style="transform: rotate(${location.course}deg)"></i>
        <div class="pulse-ring"></div>
        ${location.motion ? '<div class="motion-trail"></div>' : ''}
      `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        if (busMarker) {
            busMarker.setLatLng(point);
            busMarker.setIcon(busIcon);
        } else {
            const newMarker = L.marker(point, {
                icon: busIcon,
                zIndexOffset: 1001
            }).addTo(map);
            setBusMarker(newMarker);
        }

        // Update accuracy circle
        if (location.accuracy) {
            if (accuracyCircle) {
                accuracyCircle.setLatLng(point);
                accuracyCircle.setRadius(location.accuracy);
            } else {
                const newCircle = L.circle(point, {
                    radius: location.accuracy,
                    color: '#1a73e8',
                    fillColor: '#1a73e8',
                    fillOpacity: 0.1,
                    weight: 1,
                    className: 'accuracy-circle'
                }).addTo(map);
                setAccuracyCircle(newCircle);
            }
        }

        // Update status display
        updateStatusDisplay(location);

        // Update map view
        if (tripPoints.length > 1) {
            map.fitBounds(tripPath.getBounds(), {
                padding: [50, 50],
                maxZoom: 16
            });
        } else {
            map.setView(point, config.defaultLocation.zoom);
        }
    };

    const updateStatusDisplay = (location) => {
        const status = location.motion ? 'Moving' : 'Stationary';
        const speedCategory = location.speed < 20 ? 'slow' : location.speed < 40 ? 'medium' : 'fast';
        const deviceName = location.name || 'University Bus';
        const timeAgo = formatDuration(location.lastUpdate);

        const statusElement = document.getElementById('busStatus');
        const updateElement = document.getElementById('lastUpdate');

        if (statusElement) {
            statusElement.innerHTML = `
        <div class="text-gray-700">
          <span class="font-medium">🚌 ${deviceName}</span><br>
          ${status} 
          <span class="inline-block px-2 py-1 text-sm rounded ${speedCategory === 'slow' ? 'bg-blue-100 text-blue-700' :
                    speedCategory === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                }">${Math.round(location.speed)} km/h</span>
          ${location.battery ? `<span class="ml-2">🔋 ${location.battery}%</span>` : ''}
          ${location.accuracy ? `<span class="ml-2">📍 ±${Math.round(location.accuracy)}m</span>` : ''}
        </div>
      `;
        }

        if (updateElement) {
            updateElement.innerHTML = `
        <div class="text-gray-700">
          <span class="font-medium">Last Update: ${timeAgo}</span><br>
          <span class="text-sm">🧭 Heading: ${Math.round(location.course)}°</span>
          ${location.address ? `<br><span class="text-sm mt-2 block">📍 ${location.address}</span>` : ''}
        </div>
      `;
        }
    };

    const formatDuration = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        if (minutes < 60) return `${minutes} minutes ago`;

        const hours = Math.floor(minutes / 60);
        if (hours === 1) return '1 hour ago';
        if (hours < 24) return `${hours} hours ago`;

        const days = Math.floor(hours / 24);
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    };

    useEffect(() => {
        let interval;

        const startTracking = async () => {
            try {
                const location = await getBusLocation();
                updateBusMarker(location);

                interval = setInterval(async () => {
                    const location = await getBusLocation();
                    updateBusMarker(location);
                }, config.updateInterval);
            } catch (error) {
                console.error('Error starting tracking:', error);
            }
        };

        if (map) {
            startTracking();
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [map]);

    return (
        <div ref={mapRef} className="w-full h-[500px] rounded-lg" />
    );
}