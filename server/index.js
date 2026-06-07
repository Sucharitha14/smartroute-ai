// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Trip from "./models/Trip.js";
import fetch from "node-fetch";
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(cors());
app.use(express.json());
 
// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));
 
// --- Trip Logic ---
 
async function getEstimatedDistance(source, destination) {
  try {
    const geocode = async (city) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", India")}&format=json&limit=1`,
        { headers: { "User-Agent": "SmartRouteAI/1.0" } }
      );
      const data = await res.json();
      if (!data[0]) return null;
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    };
 
    const source_coords = await geocode(source);
    const dest_coords   = await geocode(destination);
 
    if (!source_coords || !dest_coords) return "Distance not available";
 
    // Haversine formula
    const R    = 6371;
    const dLat = (dest_coords.lat - source_coords.lat) * Math.PI / 180;
    const dLon = (dest_coords.lon - source_coords.lon) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(source_coords.lat * Math.PI / 180) *
      Math.cos(dest_coords.lat   * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c            = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLine = R * c;
    const roadDistance = Math.round(straightLine * 1.3);
    return `~${roadDistance} km`;
 
  } catch (err) {
    console.error("Distance error:", err.message);
    return "Distance not available";
  }
}
 
function calculateBudgetBreakdown(budget, mood) {
  const total = Number(budget);
 
  // Adjust split based on mood
  const splits = {
    relaxed:   { transport: 0.35, food: 0.25, stay: 0.40 }, // comfort stay priority
    adventure: { transport: 0.45, food: 0.25, stay: 0.30 }, // travel-heavy
    romantic:  { transport: 0.30, food: 0.30, stay: 0.40 }, // stay priority
    cultural:  { transport: 0.40, food: 0.30, stay: 0.30 }, // lots of moving
    foodie:    { transport: 0.30, food: 0.50, stay: 0.20 }, // food-heavy
    nature:    { transport: 0.45, food: 0.25, stay: 0.30 }, // travel-heavy
    fast:      { transport: 0.50, food: 0.25, stay: 0.25 }, // maximum transport
    budget:    { transport: 0.40, food: 0.30, stay: 0.30 }, // balanced economy
    explore:   { transport: 0.45, food: 0.30, stay: 0.25 }, // movement priority
  };
 
  const split = splits[mood?.toLowerCase()] || splits.budget;
 
  return {
    transport: Math.round(total * split.transport),
    food:      Math.round(total * split.food),
    stay:      Math.round(total * split.stay),
  };
}
 
function getMoodSuggestions(mood) {
  const suggestions = {
    relaxed: [
      "Stay at a hillside or lakeside resort",
      "Enjoy slow mornings at a local cafe",
      "Take a sunset walk along a scenic trail",
      "Book a spa or wellness session",
      "Visit peaceful temples or botanical gardens",
    ],
    adventure: [
      "Go trekking or hiking on local trails",
      "Try river rafting or zip-lining",
      "Rent a bike and explore offbeat roads",
      "Camp overnight under the stars",
      "Visit waterfalls and wildlife spots",
    ],
    romantic: [
      "Book a candlelit dinner at a rooftop restaurant",
      "Take a sunrise walk at a scenic viewpoint",
      "Stay at a boutique heritage property",
      "Visit gardens and heritage monuments at dusk",
      "Take a slow boat ride or evening cruise",
    ],
    cultural: [
      "Visit local museums and art galleries",
      "Explore heritage monuments and old quarters",
      "Attend a classical music or dance performance",
      "Take a guided heritage walk through the old city",
      "Shop for traditional crafts at local markets",
    ],
    foodie: [
      "Start with a local street food walk in the morning",
      "Visit a popular regional thali restaurant for lunch",
      "Explore the evening bazaar for local snacks",
      "Take a cooking class to learn a regional dish",
      "End the day at a rooftop restaurant with local cuisine",
    ],
    nature: [
      "Visit a wildlife sanctuary or national park",
      "Trek through a forest trail at sunrise",
      "Birdwatching at a local wetland or lake",
      "Spend an afternoon by a waterfall or river",
      "Stay at a forest or eco-resort for immersion",
    ],
    fast: [
      "Pre-plan your top 3 must-see spots per day",
      "Use cabs or autos between attractions to save time",
      "Visit the main monument first thing in the morning",
      "Eat at popular quick-service local joints",
      "Keep evenings for travel to the next location",
    ],
    budget: [
      "Use local buses or shared autos to get around",
      "Stay at well-rated budget guesthouses or hostels",
      "Eat at local dhabas and street food stalls",
      "Focus on free attractions — forts, beaches, parks",
      "Buy snacks and water from local grocery stores",
    ],
    explore: [
      "Pick one offbeat village or neighbourhood per day",
      "Ask locals for hidden gems not on tourist maps",
      "Wander without a fixed plan for a few hours",
      "Visit smaller temples, lakes, or markets nearby",
      "Document your route — every explore trip is unique",
    ],
  };
 
  return suggestions[mood?.toLowerCase()] || suggestions["relaxed"];
}
 
// --- API Routes ---
 
// POST — Calculate and save a trip
app.post("/api/trip", async (req, res) => {
  const { source, destination, budget, mood, days } = req.body;
 
  if (!source || !destination || !budget || !mood) {
    return res.status(400).json({ error: "All fields are required." });
  }
 
  const distance        = await getEstimatedDistance(source, destination);
  const budgetBreakdown = calculateBudgetBreakdown(budget, mood);
  const suggestions     = getMoodSuggestions(mood);
  const tripDays        = Number(days) || 1;
 
  try {
    const trip = new Trip({
      source,
      destination,
      budget: Number(budget),
      mood,
      days: tripDays,
      distance,
      budgetBreakdown,
      suggestions,
    });
 
    await trip.save();
    console.log("Trip saved to MongoDB!");
 
    res.json({
      source,
      destination,
      budget,
      mood,
      days: tripDays,
      distance,
      budgetBreakdown,
      suggestions,
    });
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ error: "Failed to save trip." });
  }
});
 
// GET — Fetch all saved trips
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trips." });
  }
});
 
// DELETE — Remove a trip by ID
app.delete("/api/trips/:id", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function generateTripPlan(destination, mood, days) {
  const data = {
    Bangalore: {
      relaxed: [
        {
          morning: ["Lalbagh Botanical Garden", "Cubbon Park"],
          afternoon: ["Bangalore Palace", "National Gallery"],
          evening: ["MG Road", "UB City"]
        },
        {
          morning: ["Bannerghatta Park", "Art of Living Ashram"],
          afternoon: ["Orion Mall", "ISKCON Temple"],
          evening: ["Church Street", "Indiranagar"]
        }
      ],

      adventure: [
        {
          morning: ["Nandi Hills", "Skandagiri"],
          afternoon: ["Rock Climbing Ramanagara"],
          evening: ["Camping Site"]
        }
      ]
    }
  };

  const cityData = data[destination] || data["Bangalore"];
  const moodData = cityData[mood] || cityData["relaxed"];

  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    ...moodData[i % moodData.length]
  }));
}