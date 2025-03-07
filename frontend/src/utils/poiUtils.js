// Function to generate a random point within a radius range in meters
const generateRandomPoint = (lat, lng, minRadiusMeters, maxRadiusMeters) => {
  // Convert meters to kilometers for calculation
  const minRadius = minRadiusMeters / 1000;
  const maxRadius = maxRadiusMeters / 1000;

  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Convert radius from kilometers to radians
  const minRadiusInRadian = minRadius / earthRadius;
  const maxRadiusInRadian = maxRadius / earthRadius;

  // Random radius between min and max
  const randomRadius =
    Math.random() * (maxRadiusInRadian - minRadiusInRadian) + minRadiusInRadian;

  // Random angle in radians
  const randomAngle = Math.random() * Math.PI * 2;

  // Convert latitude and longitude to radians
  const latRad = lat * (Math.PI / 180);
  const lngRad = lng * (Math.PI / 180);

  // Calculate new point
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(randomRadius) +
      Math.cos(latRad) * Math.sin(randomRadius) * Math.cos(randomAngle)
  );

  const newLngRad =
    lngRad +
    Math.atan2(
      Math.sin(randomAngle) * Math.sin(randomRadius) * Math.cos(latRad),
      Math.cos(randomRadius) - Math.sin(latRad) * Math.sin(newLatRad)
    );

  // Convert back to degrees
  const newLat = newLatRad * (180 / Math.PI);
  const newLng = newLngRad * (180 / Math.PI);

  // Calculate actual distance using Haversine formula
  const actualDistance = calculateDistance(lat, lng, newLat, newLng);

  return { lat: newLat, lng: newLng, distance: actualDistance };
};

// Calculate distance between two points using Haversine formula (returns distance in kilometers)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in km

  return distance;
};

// Convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// POI categories with icons
const poiCategories = [
  { name: "Restaurant", icon: "restaurant" },
  { name: "Cafe", icon: "cafe" },
  { name: "Park", icon: "park" },
  { name: "Museum", icon: "museum" },
  { name: "Shopping", icon: "shopping" },
  { name: "Hotel", icon: "hotel" },
  { name: "Landmark", icon: "landmark" },
  { name: "Entertainment", icon: "entertainment" },
  { name: "Beach", icon: "beach" },
  { name: "Sports", icon: "sports" },
];

// POI name prefixes for random generation
const poiNamePrefixes = [
  "Grand",
  "Royal",
  "Golden",
  "Blue",
  "Green",
  "Red",
  "Silver",
  "Crystal",
  "Sunny",
  "Happy",
  "Cozy",
  "Elegant",
  "Modern",
  "Classic",
  "Vintage",
  "Urban",
];

// Generate a random POI name
const generatePoiName = (category) => {
  const prefix =
    poiNamePrefixes[Math.floor(Math.random() * poiNamePrefixes.length)];
  return `${prefix} ${category.name}`;
};

// Generate random POI description
const generatePoiDescription = (category) => {
  const descriptions = {
    Restaurant:
      "A lovely place to enjoy delicious meals with a great atmosphere.",
    Cafe: "A cozy spot to relax with coffee and pastries.",
    Park: "A beautiful green space perfect for relaxation and outdoor activities.",
    Museum:
      "An interesting collection of exhibits showcasing history and culture.",
    Shopping: "A variety of shops offering everything you need and more.",
    Hotel: "Comfortable accommodation with excellent amenities and service.",
    Landmark: "A notable location with historical or cultural significance.",
    Entertainment: "A fun venue offering various activities and performances.",
    Beach: "A scenic shoreline perfect for swimming and sunbathing.",
    Sports: "A venue for sports activities and events.",
  };

  return descriptions[category.name] || "An interesting place to visit.";
};

// Generate random POIs within a radius range
export const generateRandomPOIs = (
  lat,
  lng,
  minDistanceMeters,
  maxDistanceMeters,
  count
) => {
  const pois = [];

  for (let i = 0; i < count; i++) {
    const category =
      poiCategories[Math.floor(Math.random() * poiCategories.length)];
    const point = generateRandomPoint(
      lat,
      lng,
      minDistanceMeters,
      maxDistanceMeters
    );

    pois.push({
      id: `poi-${i}`,
      name: generatePoiName(category),
      category: category.name,
      icon: category.icon,
      latitude: point.lat,
      longitude: point.lng,
      distance: point.distance * 1000, // Convert to meters
      description: generatePoiDescription(category),
    });
  }

  return pois;
};

// Calculate bearing between two points using their coordinates
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  // Convert to radians
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  // Calculate bearing
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  // Convert to degrees
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return bearing;
};
