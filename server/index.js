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
    const apiKey = process.env.ORS_API_KEY;

    // Step 1: Convert city names to coordinates
    const geocode = async (city) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", India")}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "SmartRouteAI/1.0"
        }
      }
    );
    const data = await res.json();
    if (!data[0]) return null;
    // Nominatim returns [lat, lon] — ORS needs [lon, lat]
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  };

    const sourceCoords = await geocode(source);
    const destCoords = await geocode(destination);

    if (!sourceCoords || !destCoords) {
      return "Distance not available";
    }

    // Step 2: Get driving distance between coordinates
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          coordinates: [sourceCoords, destCoords],
        }),
      }
    );

    const data = await res.json();
    const metres = data.routes?.[0]?.summary?.distance;

    if (!metres) return "Distance not available";

    const km = Math.round(metres / 1000);
    return `~${km} km`;

  } catch (err) {
    console.error("Distance API error:", err.message);
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});