import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MOODS = [
  { id: "relaxed",   label: "Relaxed",   sub: "Slow pace, comfort",    emoji: "🌿", color: "#0891b2" },
  { id: "adventure", label: "Adventure", sub: "Thrills, outdoors",      emoji: "🧗", color: "#ea580c" },
  { id: "romantic",  label: "Romantic",  sub: "Scenic, intimate",       emoji: "❤️", color: "#db2777" },
  { id: "cultural",  label: "Cultural",  sub: "History, heritage",      emoji: "🏛️", color: "#7c3aed" },
  { id: "foodie",    label: "Foodie",    sub: "Cuisine, markets",       emoji: "🍜", color: "#d97706" },
  { id: "nature",    label: "Nature",    sub: "Wildlife, trails",       emoji: "🌄", color: "#16a34a" },
  { id: "fast",      label: "Fast",      sub: "Efficient, packed",      emoji: "⚡", color: "#dc2626" },
  { id: "budget",    label: "Budget",    sub: "Value-first",            emoji: "💰", color: "#059669" },
  { id: "explore",   label: "Explore",   sub: "Off the beaten path",    emoji: "🗺️", color: "#2563eb" },
];

const STATS = [
  { value: "11+",    label: "Indian cities" },
  { value: "100+",   label: "Curated places" },
  { value: "9",      label: "Travel moods" },
  { value: "Free",   label: "No sign-up needed" },
];

export default function HomePage() {
  const [form, setForm] = useState({
    source: "", destination: "", budget: "",
    days: "2", mood: "relaxed",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      navigate("/results", { state: { tripData: { ...data, days: Number(form.days), mood: form.mood } } });
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  const activeMood = MOODS.find(m => m.id === form.mood);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <Navbar />

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1e293b 100%)",
        padding: "80px 24px 100px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.3)",
            padding: "6px 14px", borderRadius: "99px",
            marginBottom: "24px"
          }}>
            <span style={{ fontSize: "0.75rem" }}>🗺️</span>
            <span style={{ fontSize: "0.78rem", color: "#93c5fd", fontWeight: 600, letterSpacing: "0.5px" }}>
              AI-Powered Route Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800, color: "white",
            lineHeight: 1.15, margin: "0 0 20px",
            letterSpacing: "-1px", maxWidth: "680px"
          }}>
            Travel smarter.<br />
            <span style={{ color: "#60a5fa" }}>Not farther.</span>
          </h1>

          <p style={{
            fontSize: "1.1rem", color: "#94a3b8",
            maxWidth: "520px", lineHeight: 1.7,
            marginBottom: "36px"
          }}>
            Enter your route, budget, and travel mood.
            SmartRoute builds your complete day-wise itinerary,
            optimises your stops, and maps your journey — instantly.
          </p>

          {/* Hero CTA buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
            <a
              href="#plan-form"
              style={{
                background: "#2563eb", color: "white",
                padding: "13px 28px", borderRadius: "10px",
                fontWeight: 700, fontSize: "0.95rem",
                textDecoration: "none", display: "inline-block",
                transition: "opacity 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Plan a Route ↓
            </a>
            <button
              onClick={() => navigate("/history")}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "13px 28px", borderRadius: "10px",
                fontWeight: 600, fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              Explore Trips
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px", background: "rgba(255,255,255,0.08)",
            borderRadius: "12px", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.04)",
                padding: "18px 16px", textAlign: "center"
              }}>
                <div style={{
                  fontSize: "1.5rem", fontWeight: 800,
                  color: "white", marginBottom: "2px"
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── PLAN FORM SECTION ──────────────────────────────── */}
      <div
        id="plan-form"
        style={{
          maxWidth: "860px", margin: "-32px auto 0",
          padding: "0 24px 60px", position: "relative", zIndex: 10
        }}
      >

        {/* Form card */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          padding: "36px",
          border: "1px solid #e2e8f0"
        }}>

          <h2 style={{
            fontSize: "1.1rem", fontWeight: 700,
            color: "#1e293b", marginBottom: "4px"
          }}>
            Plan your trip
          </h2>
          <p style={{
            fontSize: "0.85rem", color: "#94a3b8",
            marginBottom: "28px"
          }}>
            Fill in your details and we'll build your itinerary
          </p>

          <form onSubmit={handleSubmit}>

            {/* Route row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                  From
                </label>
                <input
                  name="source"
                  placeholder="e.g. Mumbai"
                  value={form.source}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    fontSize: "0.95rem", color: "#1e293b",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                  To
                </label>
                <input
                  name="destination"
                  placeholder="e.g. Bangalore"
                  value={form.destination}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    fontSize: "0.95rem", color: "#1e293b",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            </div>

            {/* Budget + Days row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                  Budget (INR)
                </label>
                <input
                  name="budget"
                  type="number"
                  placeholder="e.g. 8000"
                  value={form.budget}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    fontSize: "0.95rem", color: "#1e293b",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                  Number of Days
                </label>
                <select
                  name="days"
                  value={form.days}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    fontSize: "0.95rem", color: "#1e293b",
                    outline: "none", boxSizing: "border-box",
                    background: "white", cursor: "pointer"
                  }}
                >
                  {[1,2,3].map(d => (
                    <option key={d} value={d}>{d} {d === 1 ? "Day" : "Days"}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mood selector */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                Travel Mood
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {MOODS.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setForm({ ...form, mood: m.id })}
                    style={{
                      border: `2px solid ${form.mood === m.id ? m.color : "#e2e8f0"}`,
                      background: form.mood === m.id ? `${m.color}12` : "white",
                      borderRadius: "10px", padding: "12px 14px",
                      cursor: "pointer", transition: "all 0.15s"
                    }}
                  >
                    <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{m.emoji}</div>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.88rem" }}>{m.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "#94a3b8" : (activeMood?.color || "#2563eb"),
                color: "white", border: "none",
                borderRadius: "10px", fontSize: "1rem",
                fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.15s"
              }}
            >
              {loading ? "Planning your route..." : `Plan my ${form.mood} trip →`}
            </button>

          </form>
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <div style={{ marginTop: "64px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
            How SmartRoute works
          </h2>
          <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "0.92rem" }}>
            From form to full itinerary in three steps
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { step: "01", title: "Enter your details", desc: "Source, destination, budget, days, and travel mood.", emoji: "✏️" },
              { step: "02", title: "We build your plan", desc: "Day-wise itinerary, route optimisation, and budget breakdown.", emoji: "🧠" },
              { step: "03", title: "Explore and go", desc: "Interactive map, place details, Google Maps links, and insights.", emoji: "🗺️" },
            ].map((item, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px" }}>
                <div style={{
                  fontSize: "0.72rem", fontWeight: 700,
                  color: "#2563eb", letterSpacing: "1px",
                  marginBottom: "12px"
                }}>
                  STEP {item.step}
                </div>
                <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{item.emoji}</div>
                <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>{item.title}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}