import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  const features = [
    { emoji: "🗺️", title: "Smart Itinerary", desc: "Day-wise morning, afternoon, and evening plans tailored to your mood and number of days." },
    { emoji: "📍", title: "Route Optimization", desc: "Nearest-neighbour algorithm sequences your stops to minimize travel distance and backtracking." },
    { emoji: "💰", title: "Budget Intelligence", desc: "Automatic allocation across transport, food, stay, and activities with real-time budget health." },
    { emoji: "⭐", title: "Match Score", desc: "Quantifies how well the generated plan aligns with your selected mood and budget constraints." },
    { emoji: "🧭", title: "Mood-Based Themes", desc: "The entire UI adapts its color palette and feel to your travel mood — from relaxed teal to adventure orange." },
    { emoji: "📂", title: "Trip History", desc: "Every trip is saved to MongoDB Atlas. Review, compare, and delete past plans anytime." },
  ];

  const stack = [
    { label: "Frontend",  value: "React 18 + Vite + React Router" },
    { label: "Backend",   value: "Node.js + Express REST API" },
    { label: "Database",  value: "MongoDB Atlas (cloud)" },
    { label: "Map",       value: "Leaflet.js + OpenStreetMap" },
    { label: "Hosting",   value: "Vercel (frontend) + Render (backend)" },
    { label: "Distance",  value: "Haversine formula + Nominatim API" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{
            fontSize: "0.78rem", fontWeight: 600,
            color: "#2563eb", textTransform: "uppercase",
            letterSpacing: "1px", marginBottom: "12px"
          }}>
            About SmartRoute
          </p>
          <h1 style={{
            fontSize: "2.4rem", fontWeight: 800,
            color: "#1e293b", lineHeight: 1.2,
            marginBottom: "20px", letterSpacing: "-0.5px"
          }}>
            A smarter way to plan<br />Indian road trips
          </h1>
          <p style={{
            fontSize: "1.05rem", color: "#64748b",
            maxWidth: "560px", margin: "0 auto",
            lineHeight: 1.7
          }}>
            SmartRoute is a full-stack travel decision assistant built as an
            MCA final project. It replaces fragmented, manual trip planning
            with a single intelligent interface.
          </p>
        </div>

        {/* Problem + Solution */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "20px", marginBottom: "64px"
        }}>
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "14px", padding: "28px"
          }}>
            <div style={{
              fontWeight: 700, color: "#991b1b",
              fontSize: "0.85rem", textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: "12px"
            }}>
              The Problem
            </div>
            <p style={{ color: "#7f1d1d", fontSize: "0.92rem", lineHeight: 1.7 }}>
              Planning an Indian road trip means juggling Google Maps for
              distance, multiple blogs for activity ideas, spreadsheets for
              budget, and booking sites for stays — across 5+ tabs.
            </p>
          </div>
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px", padding: "28px"
          }}>
            <div style={{
              fontWeight: 700, color: "#166534",
              fontSize: "0.85rem", textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: "12px"
            }}>
              The Solution
            </div>
            <p style={{ color: "#14532d", fontSize: "0.92rem", lineHeight: 1.7 }}>
              SmartRoute consolidates everything — distance, itinerary,
              budget, route map, and suggestions — into one intelligent
              dashboard, personalised by mood in under 10 seconds.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "1.4rem", fontWeight: 700,
            color: "#1e293b", marginBottom: "6px"
          }}>
            What SmartRoute does
          </h2>
          <p style={{
            color: "#64748b", marginBottom: "28px", fontSize: "0.92rem"
          }}>
            Six core features that make trip planning genuinely intelligent
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px", padding: "22px"
              }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>
                  {f.emoji}
                </div>
                <div style={{
                  fontWeight: 700, color: "#1e293b",
                  marginBottom: "6px", fontSize: "0.95rem"
                }}>
                  {f.title}
                </div>
                <div style={{
                  fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6
                }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "1.4rem", fontWeight: 700,
            color: "#1e293b", marginBottom: "6px"
          }}>
            Technology stack
          </h2>
          <p style={{
            color: "#64748b", marginBottom: "28px", fontSize: "0.92rem"
          }}>
            Built entirely with open-source and free-tier tools
          </p>
          <div style={{
            background: "white", border: "1px solid #e2e8f0",
            borderRadius: "12px", overflow: "hidden"
          }}>
            {stack.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                padding: "14px 22px",
                borderBottom: i < stack.length - 1
                  ? "1px solid #f1f5f9" : "none"
              }}>
                <div style={{
                  width: "110px", fontWeight: 600,
                  color: "#94a3b8", fontSize: "0.8rem",
                  textTransform: "uppercase", letterSpacing: "0.4px"
                }}>
                  {s.label}
                </div>
                <div style={{ color: "#1e293b", fontSize: "0.9rem" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: "#1e293b", borderRadius: "16px",
          padding: "40px", textAlign: "center"
        }}>
          <h2 style={{
            fontSize: "1.6rem", fontWeight: 700,
            color: "white", marginBottom: "10px"
          }}>
            Ready to plan your trip?
          </h2>
          <p style={{
            color: "#94a3b8", marginBottom: "24px", fontSize: "0.92rem"
          }}>
            Enter your source, destination, budget, and mood — we handle the rest.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2563eb", color: "white",
              border: "none", padding: "12px 32px",
              borderRadius: "10px", cursor: "pointer",
              fontWeight: 600, fontSize: "0.95rem"
            }}
          >
            Plan a trip now
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}