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
        lon: parseFloat(data[0].lon)
      };
    };

    const source_coords = await geocode(source);
    const dest_coords = await geocode(destination);

    if (!source_coords || !dest_coords) return "Distance not available";

    // Haversine formula — calculates straight line distance between two coords
    const R = 6371;
    const dLat = (dest_coords.lat - source_coords.lat) * Math.PI / 180;
    const dLon = (dest_coords.lon - source_coords.lon) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(source_coords.lat * Math.PI / 180) *
      Math.cos(dest_coords.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLine = R * c;

    // Road distance is typically 1.3x the straight line distance in India
    const roadDistance = Math.round(straightLine * 1.3);
    return `~${roadDistance} km`;

  } catch (err) {
    console.error("Distance error:", err.message);
    return "Distance not available";
  }
}

function calculateBudgetBreakdown(budget) {
  const total = Number(budget);
  return {
    transport: Math.round(total * 0.4),
    food: Math.round(total * 0.3),
    stay: Math.round(total * 0.3),
  };
}

function getMoodSuggestions(mood) {
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

// --- API Routes ---

// POST - Calculate and save a trip
app.post("/api/trip", async (req, res) => {
  const { source, destination, budget, mood } = req.body;

  if (!source || !destination || !budget || !mood) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const distance = await getEstimatedDistance(source, destination);
  const budgetBreakdown = calculateBudgetBreakdown(budget);
  const suggestions = getMoodSuggestions(mood);

  try {
    const trip = new Trip({
      source,
      destination,
      budget: Number(budget),
      mood,
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
      distance,
      budgetBreakdown,
      suggestions,
    });
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ error: "Failed to save trip." });
  }
});

// GET - Fetch all saved trips
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trips." });
  }
});

// DELETE - Remove a trip by ID
app.delete("/api/trips/:id", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/test-api", async (req, res) => {
  const apiKey = process.env.ORS_API_KEY;
  console.log("API Key loaded:", apiKey ? "YES" : "NO");

  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=Delhi%2C%20India&size=1`;
  console.log("Fetching:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log("Response status:", response.status);
    console.log("Response body:", text.slice(0, 300));
    res.send(text);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).send(err.message);
  }
});

app.get("/test-geocode", async (req, res) => {
  try {
    const response = await fetch(
      "https://nominatim.openstreetmap.org/search?q=Delhi%2C+India&format=json&limit=1",
      { headers: { "User-Agent": "SmartRouteAI/1.0" } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});