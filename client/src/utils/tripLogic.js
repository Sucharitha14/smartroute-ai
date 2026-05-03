// src/utils/tripLogic.js

// Step 1: Estimate distance between common Indian city pairs
export function getEstimatedDistance(source, destination) {
  const key = (a, b) =>
    [a.toLowerCase().trim(), b.toLowerCase().trim()].sort().join("_");

  const distances = {
    [key("bengaluru", "goa")]: 600,
    [key("bengaluru", "ooty")]: 270,
    [key("bengaluru", "mysuru")]: 150,
    [key("bengaluru", "chennai")]: 350,
    [key("bengaluru", "hyderabad")]: 570,
    [key("bengaluru", "mumbai")]: 980,
    [key("bengaluru", "coorg")]: 250,
    [key("mumbai", "goa")]: 590,
    [key("mumbai", "pune")]: 150,
    [key("mumbai", "delhi")]: 1400,
    [key("delhi", "agra")]: 230,
    [key("delhi", "jaipur")]: 280,
    [key("delhi", "shimla")]: 350,
    [key("chennai", "pondicherry")]: 170,
    [key("chennai", "ooty")]: 540,
  };

  return distances[key(source, destination)] || null;
}

// Step 2: Split budget into transport / food / stay
export function calculateBudgetBreakdown(budget) {
  const total = Number(budget);
  return {
    transport: Math.round(total * 0.4),
    food: Math.round(total * 0.3),
    stay: Math.round(total * 0.3),
  };
}

// Step 3: Return suggestions based on mood
export function getMoodSuggestions(mood) {
  const suggestions = {
    Relax: [
      "Stay at a beachside or hillside resort",
      "Enjoy a sunset cruise or nature walk",
      "Book a spa or wellness session",
      "Try local cafes and slow mornings",
      "Visit peaceful temples or gardens",
    ],
    Adventure: [
      "Go trekking or hiking on local trails",
      "Try river rafting or zip-lining",
      "Rent a bike and explore offbeat roads",
      "Camp overnight under the stars",
      "Visit waterfalls and wildlife spots",
    ],
  };

  return suggestions[mood] || suggestions["Relax"];
}

// src/utils/tripLogic.js — add this at the bottom

export function getCityCoords(cityName) {
  const coords = {
    "bengaluru": [12.9716, 77.5946],
    "bangalore": [12.9716, 77.5946],
    "goa": [15.2993, 74.1240],
    "ooty": [11.4102, 76.6950],
    "mysuru": [12.2958, 76.6394],
    "mysore": [12.2958, 76.6394],
    "chennai": [13.0827, 80.2707],
    "hyderabad": [17.3850, 78.4867],
    "mumbai": [19.0760, 72.8777],
    "pune": [18.5204, 73.8567],
    "delhi": [28.6139, 77.2090],
    "agra": [27.1767, 78.0081],
    "jaipur": [26.9124, 75.7873],
    "shimla": [31.1048, 77.1734],
    "pondicherry": [11.9416, 79.8083],
    "coorg": [12.3375, 75.8069],
  };

  return coords[cityName.toLowerCase().trim()] || null;
}

