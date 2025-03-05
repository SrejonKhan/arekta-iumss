import config from './config'

// State management
const state = {
    map: null,
    busMarker: null,
    accuracyCircle: null,
    sessionId: null,
    lastPositionId: null,
    tripPath: null,
    tripPoints: [],
    startPoint: null,
    endPoint: null
};

// Map initialization
function initializeMap() {
    state.map = L.map('map', {
        zoomControl: false
    }).setView(
        [config.defaultLocation.lat, config.defaultLocation.lng],
        config.defaultLocation.zoom
    );

    // Add custom-styled zoom control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(state.map);

    // Add OpenStreetMap tiles with custom styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles'
    }).addTo(state.map);

    // Initialize trip path with gradient
    state.tripPath = L.polyline([], {
        color: '#1a73e8',
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'animated-path'
    }).addTo(state.map);

    // Add scale control
    L.control.scale({
        imperial: false,
        position: 'bottomleft'
    }).addTo(state.map);

    addCustomControls();
}

// Custom controls
function addCustomControls() {
    const legendControl = L.control({ position: 'topright' });
    legendControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <div class="legend-item">
                <i class="fas fa-bus" style="color: #1a73e8;"></i> Bus Location
            </div>
            <div class="legend-item">
                <i class="fas fa-play-circle" style="color: #34a853;"></i> Start Point
            </div>
            <div class="legend-item">
                <i class="fas fa-flag-checkered" style="color: #ea4335;"></i> Current Point
            </div>
            <div class="legend-item">
                <div class="accuracy-circle-example"></div> GPS Accuracy
            </div>
        `;
        return div;
    };
    legendControl.addTo(state.map);
}

// Authentication
export async function login() {
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
        state.sessionId = data.id;
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function getAuthHeaders() {
    return {
        'Authorization': `Basic ${btoa(`${config.traccarUsername}:${config.traccarPassword}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}

// Location tracking
export async function getBusLocation() {
    try {
        const headers = {
            'Authorization': `Basic ${btoa(`${config.traccarUsername}:${config.traccarPassword}`)}`,
            'Accept': 'application/json'
        };

        const positionResponse = await fetch(
            `${config.traccarServer}/api/positions?deviceId=${config.busDeviceId}`,
            { headers }
        );

        if (!positionResponse.ok) {
            throw new Error(`Failed to fetch position: ${positionResponse.status}`);
        }

        const positions = await positionResponse.json();
        if (!positions || positions.length === 0) {
            throw new Error('No position data available');
        }

        state.lastPositionId = positions[0].id;

        const deviceResponse = await fetch(
            `${config.traccarServer}/api/devices/${config.busDeviceId}`,
            { headers }
        );

        if (deviceResponse.ok) {
            const device = await deviceResponse.json();
            return formatPositionData(positions[0], device);
        }

        return formatPositionData(positions[0]);
    } catch (error) {
        console.error('Error fetching bus location:', error);
        throw error;
    }
}

// Data formatting
function formatPositionData(position, device = null) {
    return {
        lat: position.latitude,
        lng: position.longitude,
        speed: position.speed * 3.6,
        lastUpdate: new Date(position.fixTime),
        accuracy: position.accuracy,
        altitude: position.altitude,
        battery: position.attributes?.batteryLevel,
        isMoving: position.attributes?.motion || false,
        course: position.course,
        address: position.address || 'Fetching address...',
        deviceName: device?.name || 'University Bus',
        status: device?.status || 'unknown'
    };
}

function getSpeedCategory(speed) {
    if (speed < 20) return 'slow';
    if (speed < 40) return 'medium';
    return 'fast';
}

function formatDuration(date) {
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
}

// Marker management
function createBusIcon(isMoving) {
    return L.divIcon({
        className: isMoving ? 'bus-icon moving' : 'bus-icon',
        html: `
            <i class="fas fa-bus"></i>
            <div class="pulse-ring"></div>
            ${isMoving ? '<div class="motion-trail"></div>' : ''}
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
}

function updateTripPath(point) {
    state.tripPoints.push(point);
    state.tripPath.setLatLngs(state.tripPoints);

    const startIcon = L.divIcon({
        className: 'custom-marker start-marker',
        html: '<i class="fas fa-play-circle"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const endIcon = L.divIcon({
        className: 'custom-marker end-marker',
        html: '<i class="fas fa-flag-checkered"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    if (!state.startPoint && state.tripPoints.length > 0) {
        state.startPoint = L.marker(state.tripPoints[0], {
            icon: startIcon,
            zIndexOffset: 1000
        }).addTo(state.map);
    }

    if (state.endPoint) {
        state.map.removeLayer(state.endPoint);
    }
    state.endPoint = L.marker(point, {
        icon: endIcon,
        zIndexOffset: 1000
    }).addTo(state.map);
}

function animateMarkerMovement(oldLatLng, newLatLng, marker) {
    const frames = 20;
    const latDiff = (newLatLng[0] - oldLatLng.lat) / frames;
    const lngDiff = (newLatLng[1] - oldLatLng.lng) / frames;
    let frame = 0;

    const animate = () => {
        if (frame < frames) {
            const newLat = oldLatLng.lat + (latDiff * frame);
            const newLng = oldLatLng.lng + (lngDiff * frame);
            marker.setLatLng([newLat, newLng]);
            frame++;
            requestAnimationFrame(animate);
        } else {
            marker.setLatLng(newLatLng);
        }
    };
    animate();
}

// UI updates
function updateStatusDisplay(location) {
    const status = location.isMoving ? 'Moving' : 'Stationary';
    const speedCategory = getSpeedCategory(location.speed);
    const deviceName = location.deviceName ? `${location.deviceName}` : 'University Bus';
    const timeAgo = formatDuration(location.lastUpdate);

    const statusHtml = `
        <div class="info-label">🚌 ${deviceName}</div>
        <div class="info-value">
            ${status} 
            <span class="speed-indicator ${speedCategory}">${Math.round(location.speed)} km/h</span>
            ${location.battery ? `<span class="info-label">🔋</span> ${location.battery}%` : ''}
            ${location.accuracy ? `<span class="info-label">📍</span> ±${Math.round(location.accuracy)}m` : ''}
            ${location.altitude ? `<span class="info-label">⛰️</span> ${Math.round(location.altitude)}m` : ''}
        </div>
    `;

    const updateHtml = `
        <div class="info-label">📍 Last Update</div>
        <div class="info-value">
            ${timeAgo} 
            <span class="info-label">🧭</span> Heading: ${Math.round(location.course)}°
            ${location.address ? `<br><span class="info-label">📍</span> ${location.address}` : ''}
        </div>
    `;

    const statusElement = document.getElementById('busStatus');
    statusElement.innerHTML = statusHtml;
    statusElement.className = `status-line${location.isMoving ? ' moving' : ''}`;

    document.getElementById('lastUpdate').innerHTML = updateHtml;
}

function updateBusMarker(location) {
    if (!location) return;

    const point = [location.lat, location.lng];
    updateTripPath(point);

    const busIcon = createBusIcon(location.isMoving);

    if (state.busMarker) {
        const oldLatLng = state.busMarker.getLatLng();
        state.busMarker.setIcon(busIcon);
        animateMarkerMovement(oldLatLng, point, state.busMarker);

        const iconElement = state.busMarker.getElement();
        if (iconElement) {
            const icon = iconElement.querySelector('i');
            if (icon) {
                icon.style.transform = `rotate(${location.course}deg)`;
            }
        }
    } else {
        state.busMarker = L.marker(point, {
            icon: busIcon,
            zIndexOffset: 1001
        }).addTo(state.map);
    }

    updateAccuracyCircle(location, point);
    updateStatusDisplay(location);
    updateMapView(point);
}

function updateAccuracyCircle(location, point) {
    if (!location.accuracy) return;

    if (state.accuracyCircle) {
        state.accuracyCircle.setLatLng(point);
        state.accuracyCircle.setRadius(location.accuracy);
    } else {
        state.accuracyCircle = L.circle(point, {
            radius: location.accuracy,
            color: '#1a73e8',
            fillColor: '#1a73e8',
            fillOpacity: 0.1,
            weight: 1,
            className: 'accuracy-circle'
        }).addTo(state.map);
    }
}

function updateMapView(point) {
    if (state.tripPoints.length > 1) {
        state.map.fitBounds(state.tripPath.getBounds(), {
            padding: [50, 50],
            maxZoom: 16
        });
    } else {
        state.map.setView(point, config.defaultLocation.zoom);
    }
}

// Error handling
function handleError(error) {
    console.error('Error:', error);
    const errorMessage = `Status: Error - ${error.message}`;

    if (error.message.includes('denied') || error.message.includes('SecurityException')) {
        document.getElementById('busStatus').textContent =
            'Status: Access Denied - Please check device permissions in Traccar account';
    } else {
        document.getElementById('busStatus').textContent = errorMessage;
    }
}

// Main tracking function
async function startTracking() {
    try {
        const location = await getBusLocation();
        updateBusMarker(location);

        setInterval(async () => {
            const location = await getBusLocation();
            updateBusMarker(location);
        }, config.updateInterval);
    } catch (error) {
        handleError(error);
    }
}

// Initialize the application
function initializeApp() {
    initializeMap();
    login()
        .then(startTracking)
        .catch(handleError);
}

// Start the application when the page loads
window.addEventListener('load', initializeApp);

export function getState() {
    return state;
}

export function addTripPoint(point) {
    state.tripPoints.push(point);
    return state.tripPoints;
} 
