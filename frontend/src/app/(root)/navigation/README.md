# AR Navigation with Nearby POIs

This feature allows users to explore nearby Points of Interest (POIs) within a 5-10 km radius of their current location using both a map view and an Augmented Reality (AR) navigation experience.

## Features

- **Nearby POI Discovery**: Randomly generates POIs within a 5-10 km radius to help users explore new areas
- **Interactive Map**: Displays user location and nearby POIs using Leaflet
- **AR Navigation**: Provides an immersive AR experience for navigating to selected POIs
- **Mobile-First Design**: AR features are optimized for mobile devices with responsive UI

## Technical Implementation

### Map View

- Uses Leaflet for displaying an interactive map
- Shows user's current location with accuracy radius
- Displays nearby POIs with custom markers based on category
- Allows selection of POIs for navigation

### AR Navigation

- Markerless AR implementation using device camera and sensors
- Compass-based navigation with directional arrow pointing to destination
- Real-time distance calculation and bearing to selected POI
- Device orientation tracking for accurate direction guidance

## Requirements

- Modern mobile device with:
  - Camera access
  - GPS/Location services
  - Device orientation sensors (compass, accelerometer)
- Permissions:
  - Camera access
  - Location access
  - Device orientation access (especially on iOS)

## Usage

1. Allow location permissions when prompted
2. Browse the map to see nearby POIs
3. Select a POI by clicking on its marker
4. On mobile devices, tap "AR Navigation" to enter AR mode
5. Follow the on-screen arrow to navigate to the selected POI

## Limitations

- AR navigation is only available on mobile devices
- Requires device orientation sensors for proper functioning
- GPS accuracy may affect navigation precision
- AR experience works best outdoors with clear GPS signal

## Dependencies

- Leaflet for map rendering
- AR.js for augmented reality functionality
- Device orientation and geolocation browser APIs
