import { useState } from "react";
import { generateTripPlan } from "../utils/tripEngine";
import { useLocation, useNavigate } from "react-router-dom";
import RouteMap from "../components/RouteMap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { generateTripPDF } from "../utils/generatePDF";

const MOOD_THEMES = {
  relaxed:   { primary: "#0891b2", light: "#ecfeff",  border: "#a5f3fc", badge: "#0e7490", label: "Relaxed",   emoji: "🌿" },
  adventure: { primary: "#ea580c", light: "#fff7ed",  border: "#fed7aa", badge: "#c2410c", label: "Adventure", emoji: "🧗" },
  romantic:  { primary: "#db2777", light: "#fdf2f8",  border: "#f9a8d4", badge: "#be185d", label: "Romantic",  emoji: "❤️" },
  foodie:    { primary: "#d97706", light: "#fffbeb",  border: "#fde68a", badge: "#b45309", label: "Foodie",    emoji: "🍜" },
  nature:    { primary: "#16a34a", light: "#f0fdf4",  border: "#bbf7d0", badge: "#15803d", label: "Nature",    emoji: "🌄" },
  cultural:  { primary: "#7c3aed", light: "#f5f3ff",  border: "#ddd6fe", badge: "#6d28d9", label: "Cultural",  emoji: "🏛️" },
  fast:      { primary: "#dc2626", light: "#fef2f2",  border: "#fecaca", badge: "#b91c1c", label: "Fast",      emoji: "⚡" },
  budget:    { primary: "#059669", light: "#ecfdf5",  border: "#a7f3d0", badge: "#047857", label: "Budget",    emoji: "💰" },
  explore:   { primary: "#2563eb", light: "#eff6ff",  border: "#bfdbfe", badge: "#1d4ed8", label: "Explore",   emoji: "🗺️" },
};
const DEFAULT_THEME = MOOD_THEMES.relaxed;

const SLOT_ICONS = { morning: "🌄", afternoon: "☀️", evening: "🌇" };
const SLOT_TIMES = { morning: "6 AM – 12 PM", afternoon: "12 PM – 5 PM", evening: "5 PM – 9 PM" };

const TYPE_COLORS = {
  nature:   { bg: "#e8f5e9", color: "#2e7d32" },
  cultural: { bg: "#e3f2fd", color: "#1565c0" },
  leisure:  { bg: "#fce4ec", color: "#c62828" },
  food:     { bg: "#fff3e0", color: "#e65100" },
  default:  { bg: "#f3e5f5", color: "#6a1b9a" },
};

function TypeBadge({ type }) {
  const style = TYPE_COLORS[type] || TYPE_COLORS.default;
  return (
    <span style={{
      background: style.bg, color: style.color,
      padding: "2px 10px", borderRadius: "99px",
      fontSize: "0.75rem", fontWeight: 600,
      textTransform: "capitalize"
    }}>
      {type}
    </span>
  );
}

// ── Circular progress ring ────────────────────────────────────────
function CircleScore({ score, primary, size = 100 }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={primary} strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={fill}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill={primary}>{score}</text>
      <text x="50" y="58" textAnchor="middle" fontSize="9" fill="#94a3b8">/100</text>
    </svg>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </h2>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748b" }}>{subtitle}</p>}
    </div>
  );
}

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trip = state?.tripData;

  if (!trip) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>No trip data found.</p>
        <button onClick={() => navigate("/")} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer" }}>
          Plan a trip
        </button>
      </div>
    );
  }

  const { source, destination, budget, mood, days = 2 } = trip;
  const theme = MOOD_THEMES[mood?.toLowerCase()] || DEFAULT_THEME;
  const [itineraryOpen, setItineraryOpen] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState("mood");

  let plan;
  try {
    plan = generateTripPlan(days, mood, destination, budget);
  } catch (err) {
    return <div style={{ padding: "40px", color: "red" }}><h2>Trip engine crashed</h2><p>{err.message}</p></div>;
  }

  if (!plan || !plan.success) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <h2 style={{ color: "#1e293b" }}>City not supported yet</h2>
        <p style={{ color: "#64748b", margin: "8px 0 24px" }}>{plan?.error || "Try Bangalore as destination"}</p>
        <button onClick={() => navigate("/")} style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer" }}>Go back</button>
      </div>
    );
  }

  const { itinerary, total_places, estimated_activity_cost, match_score, summary } = plan;
  const allPlaces = itinerary.flatMap(day => Object.values(day.slots).flat());

  const totalBudget = Number(budget) || 0;
  const travelCost  = Math.round(totalBudget * 0.35);
  const foodCost    = Math.round(totalBudget * 0.25);
  const stayCost    = Math.round(totalBudget * 0.25);
  const actCost     = estimated_activity_cost;
  const totalSpend  = travelCost + foodCost + stayCost + actCost;
  const remaining   = totalBudget - totalSpend;

  const routeMap = {
    relaxed:   { type: "Scenic",    reason: "Groups nearby places and avoids highways for a calm experience." },
    adventure: { type: "Offbeat",   reason: "Includes terrain roads and nature spots away from crowds." },
    romantic:  { type: "Scenic",    reason: "Prioritises sunset viewpoints and quiet roads." },
    foodie:    { type: "City Loop", reason: "Connects restaurants and markets in a tight city circuit." },
    nature:    { type: "Scenic",    reason: "Maximises time in natural areas with minimal backtracking." },
    cultural:  { type: "Heritage",  reason: "Links historical sites in chronological visit order." },
    fast:      { type: "Fastest",   reason: "Shortest total distance, minimises travel time between stops." },
    budget:    { type: "Budget",    reason: "Avoids toll roads and selects free or low-cost attractions." },
    explore:   { type: "Mixed",     reason: "Balances coverage and comfort across the destination." },
  };
  const route = routeMap[mood?.toLowerCase()] || routeMap.relaxed;

  const totalKm     = Math.round(allPlaces.length * 4.5 + 12);
  const travelHours = (totalKm / 28).toFixed(1);

  // ── Scores ──────────────────────────────────────────────────
  const distanceScore   = Math.max(0, 100 - Math.round((totalKm / 50) * 10));
  const budgetScore     = remaining >= 0 ? 100 : Math.max(0, 100 - Math.round((Math.abs(remaining) / totalBudget) * 100));
  const timeScore       = travelHours <= 2 ? 100 : travelHours <= 4 ? 80 : travelHours <= 6 ? 60 : 40;
  const efficiencyScore = Math.round((distanceScore * 0.3) + (budgetScore * 0.4) + (timeScore * 0.2) + (match_score * 0.1));

  // ── Fatigue ─────────────────────────────────────────────────
  const stopsPerDay  = allPlaces.length / days;
  const fatigueLevel = stopsPerDay > 4 ? "high" : stopsPerDay > 2 ? "moderate" : "low";
  const fatigueColor = fatigueLevel === "high" ? "#dc2626" : fatigueLevel === "moderate" ? "#d97706" : "#16a34a";
  const fatigueBg    = fatigueLevel === "high" ? "#fef2f2" : fatigueLevel === "moderate" ? "#fffbeb" : "#f0fdf4";
  const fatigueMsg   = fatigueLevel === "high"
    ? `${allPlaces.length} stops in ${days} days is demanding. Consider removing 1–2 locations.`
    : fatigueLevel === "moderate"
    ? `${allPlaces.length} stops in ${days} days is a comfortable pace.`
    : `${allPlaces.length} stops in ${days} days is relaxed and easy.`;
  const fatiguePct   = fatigueLevel === "high" ? 85 : fatigueLevel === "moderate" ? 55 : 25;

  // ── Route strategies ────────────────────────────────────────
  const routeStrategies = [
    { id: "fastest", label: "Fastest", emoji: "⚡", desc: "Shortest travel time", distance: totalKm, time: travelHours, cost: travelCost },
    { id: "cheapest", label: "Cheapest", emoji: "💰", desc: "Minimises transport costs", distance: Math.round(totalKm * 1.12), time: (totalKm * 1.12 / 28).toFixed(1), cost: Math.round(travelCost * 0.78) },
    { id: "scenic", label: "Scenic", emoji: "🌄", desc: "Prioritises views", distance: Math.round(totalKm * 1.2), time: (totalKm * 1.2 / 28).toFixed(1), cost: Math.round(travelCost * 1.1) },
    { id: "mood", label: route.type, emoji: theme.emoji, desc: "Based on your mood", distance: Math.round(totalKm * 1.05), time: (totalKm * 1.05 / 28).toFixed(1), cost: Math.round(travelCost * 0.95) },
  ];

  // ── Score breakdown ─────────────────────────────────────────
  const scoreBreakdown = [
    { label: "Budget Fit",          score: budgetScore,   reason: remaining >= 0 ? "Trip stays within budget" : "Trip exceeds budget" },
    { label: "Travel Time",         score: timeScore,     reason: travelHours <= 4 ? "Comfortable travel duration" : "Long travel duration" },
    { label: "Distance Efficiency", score: distanceScore, reason: totalKm < 150 ? "Compact route" : "More travel required" },
    { label: "Mood Match",          score: match_score,   reason: `${theme.label} attractions found` },
  ];

  // ── Smart insights ──────────────────────────────────────────
  const busiestDay = itinerary.reduce((max, d) =>
    Object.values(d.slots).flat().length > Object.values(max.slots).flat().length ? d : max
  , itinerary[0]);

  const insights = [
    `Day ${busiestDay.day} is your busiest day with ${Object.values(busiestDay.slots).flat().length} stops.`,
    `You are spending ${Math.round((travelCost / totalBudget) * 100)}% of your budget on transport.`,
    remaining >= 0
      ? `You have ₹${remaining.toLocaleString()} remaining after all estimated expenses.`
      : `Consider reducing activities — you are ₹${Math.abs(remaining).toLocaleString()} over budget.`,
    `Match score of ${match_score}% means this plan aligns ${match_score >= 80 ? "excellently" : match_score >= 60 ? "well" : "moderately"} with your ${mood} mood.`,
    `This route covers ${total_places} curated locations across ${days} days.`,
  ];

  const cardStyle = {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <Navbar theme={theme} />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

          {/* ── PAGE HEADER ── */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.primary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
              {theme.emoji} Trip Summary
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
              {source} → {destination}
            </h1>
            <p style={{ color: "#64748b", margin: "0 0 20px", fontSize: "0.95rem" }}>
              {days}-day {mood} trip · ₹{Number(budget).toLocaleString()} budget
            </p>

            {/* ── 4 STAT CARDS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
              {[
                { emoji: "📍", value: `${totalKm} km`, label: "Total Distance", path: "/distance-details", state: { tripData: trip, source, destination, totalKm, travelHours, allPlaces, theme } },
                { emoji: "💰", value: `₹${Number(budget).toLocaleString()}`, label: "Total Budget", path: "/budget-details", state: { tripData: trip, budget, travelCost, foodCost, stayCost, actCost, totalSpend, remaining, theme } },
                { emoji: "⏱️", value: `${travelHours} hrs`, label: "Travel Time", path: "/time-details", state: { tripData: trip, travelHours, totalKm, days, source, destination, theme, mood } },
                { emoji: "⭐", value: `${match_score}%`, label: "Match Score", path: null },
              ].map((s, i) => (
                <div
                  key={i}
                  onClick={() => s.path && navigate(s.path, { state: s.state })}
                  style={{
                    background: "white", border: `2px solid ${s.path ? theme.border : "#e2e8f0"}`,
                    borderRadius: "12px", padding: "18px 16px",
                    cursor: s.path ? "pointer" : "default",
                    textAlign: "center", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { if (s.path) { e.currentTarget.style.background = theme.light; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                  onMouseLeave={e => { if (s.path) { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(0)"; }}}
                >
                  <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{s.emoji}</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: theme.primary, marginBottom: "2px" }}>{s.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{s.label}</div>
                  {s.path && <div style={{ fontSize: "0.68rem", color: theme.badge, marginTop: "4px" }}>tap to explore →</div>}
                </div>
              ))}
            </div>

            {/* Smart insight bar */}
            <div style={{ padding: "12px 18px", background: theme.light, borderRadius: "8px", borderLeft: `4px solid ${theme.primary}`, fontSize: "0.88rem", color: theme.badge }}>
              {summary.budget_status === "Within budget"
                ? `✓ This plan stays within your ₹${Number(budget).toLocaleString()} budget. ${summary.recommendation}.`
                : `⚠ Activity costs may exceed budget. Consider reducing days or activities.`}
            </div>
          </div>

          {/* ── TWO COLUMN LAYOUT ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

            {/* ════ LEFT COLUMN ════ */}
            <div>

              {/* ITINERARY */}
              <div style={{ ...cardStyle, padding: "0", overflow: "hidden" }}>
                <div
                  onClick={() => setItineraryOpen(p => !p)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", cursor: "pointer", borderBottom: itineraryOpen ? "1px solid #f1f5f9" : "none" }}
                >
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Smart Itinerary</h2>
                    <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#64748b" }}>Day-wise plan for your {mood} trip to {destination}</p>
                  </div>
                  <div style={{ background: theme.light, border: `1px solid ${theme.border}`, color: theme.primary, padding: "5px 12px", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 600, userSelect: "none" }}>
                    {itineraryOpen ? "Hide ▲" : "View Trip Plan ▼"}
                  </div>
                </div>

                {itineraryOpen && (
                  <div style={{ padding: "16px 20px" }}>
                    {itinerary.map((day) => (
                      <div key={day.day} style={{ marginBottom: "24px" }}>
                        <div style={{ background: "#1e293b", color: "white", padding: "8px 16px", borderRadius: "8px 8px 0 0", fontWeight: 600, fontSize: "0.9rem" }}>
                          Day {day.day}
                        </div>
                        <div style={{ border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                          {Object.entries(day.slots).map(([slot, places]) => {
                            if (places.length === 0) return null;
                            return (
                              <div key={slot} style={{ borderBottom: "1px solid #f1f5f9", padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                                  <span style={{ fontSize: "1rem" }}>{SLOT_ICONS[slot]}</span>
                                  <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem", textTransform: "capitalize" }}>{slot}</span>
                                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{SLOT_TIMES[slot]}</span>
                                </div>
                                {places.map((place, i) => (
                                  <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 14px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", marginBottom: "5px" }}>{place.name}</div>
                                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                                        <TypeBadge type={place.type} />
                                        <a
                                          href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + " " + destination)}`}
                                          target="_blank" rel="noreferrer"
                                          onClick={e => e.stopPropagation()}
                                          style={{ fontSize: "0.68rem", color: theme.primary, textDecoration: "none", background: theme.light, padding: "2px 7px", borderRadius: "99px", fontWeight: 600, border: `1px solid ${theme.border}` }}
                                        >
                                          Open in Maps ↗
                                        </a>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
                                      <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>{place.cost === 0 ? "Free" : `₹${place.cost}`}</div>
                                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>entry</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SMART ROUTE */}
              <div style={cardStyle}>
                <SectionTitle title="Smart Route" subtitle="Choose your route strategy" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  {routeStrategies.map((rs) => (
                    <div
                      key={rs.id}
                      onClick={() => setSelectedStrategy(rs.id)}
                      style={{ border: `2px solid ${selectedStrategy === rs.id ? theme.primary : "#e2e8f0"}`, background: selectedStrategy === rs.id ? theme.light : "white", borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "all 0.15s" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "1rem" }}>{rs.emoji}</span>
                          <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>{rs.label}</span>
                        </div>
                        {rs.id === "mood" && <span style={{ fontSize: "0.62rem", background: theme.primary, color: "white", padding: "1px 7px", borderRadius: "99px", fontWeight: 600 }}>Best Match</span>}
                        {selectedStrategy === rs.id && rs.id !== "mood" && <span style={{ fontSize: "0.62rem", background: theme.primary, color: "white", padding: "1px 7px", borderRadius: "99px", fontWeight: 600 }}>Selected</span>}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "10px" }}>{rs.desc}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
                        {[{ label: "km", value: rs.distance }, { label: "hrs", value: rs.time }, { label: "cost", value: `₹${rs.cost.toLocaleString()}` }].map((s, i) => (
                          <div key={i} style={{ background: "rgba(0,0,0,0.03)", borderRadius: "4px", padding: "4px", textAlign: "center" }}>
                            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b" }}>{s.value}</div>
                            <div style={{ fontSize: "0.6rem", color: "#94a3b8" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.82rem", color: "#475569" }}>
                  <strong style={{ color: "#1e293b" }}>Why {routeStrategies.find(r => r.id === selectedStrategy)?.label}?</strong>{" "}
                  {selectedStrategy === "mood" ? route.reason : selectedStrategy === "fastest" ? "Takes the most direct path, minimising total travel time." : selectedStrategy === "cheapest" ? "Avoids toll roads and selects fuel-efficient paths." : "Takes hillside or coastal roads for maximum scenic value."}
                </div>
              </div>

              {/* MAP */}
              <div style={cardStyle}>
                <SectionTitle title="Route Map" subtitle={`${source} → all stops → ${destination}`} />
                <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <RouteMap source={source} destination={destination} places={allPlaces} />
                </div>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "8px", textAlign: "center" }}>Click any marker to see place details</p>
              </div>

              {/* MATCH SCORE EXPLAINED */}
              <div style={cardStyle}>
                <SectionTitle title="Why this score?" subtitle={`Your trip scores ${match_score}% overall`} />
                {scoreBreakdown.map((item, i) => (
                  <div key={i} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <div>
                        <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem" }}>{item.label}</span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "8px" }}>{item.reason}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: theme.primary, fontSize: "0.9rem" }}>{item.score}%</span>
                    </div>
                    <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ width: `${item.score}%`, height: "100%", background: theme.primary, borderRadius: "99px" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* SMART INSIGHTS */}
              <div style={cardStyle}>
                <SectionTitle title="SmartRoute Insights" subtitle="Generated from your itinerary data" />
                {insights.map((insight, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: i < insights.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.primary, flexShrink: 0, marginTop: "6px" }} />
                    <p style={{ fontSize: "0.88rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>{insight}</p>
                  </div>
                ))}
              </div>

              {/* BUDGET SUMMARY */}
              <div style={cardStyle}>
                <SectionTitle title="Budget Summary" subtitle="Estimated spend across all categories" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden", marginBottom: "12px" }}>
                  {[
                    { label: "Transport", amount: travelCost, emoji: "🚗" },
                    { label: "Food",      amount: foodCost,   emoji: "🍽️" },
                    { label: "Stay",      amount: stayCost,   emoji: "🏨" },
                    { label: "Activities",amount: actCost,    emoji: "🎯" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "white", padding: "14px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{item.emoji}</div>
                      <div style={{ fontWeight: 700, color: theme.primary, fontSize: "0.95rem", marginBottom: "2px" }}>₹{item.amount.toLocaleString()}</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 16px", background: remaining >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: remaining >= 0 ? "#166534" : "#991b1b", fontSize: "0.85rem" }}>
                    {remaining >= 0 ? `✓ Within budget — ₹${remaining.toLocaleString()} remaining` : `⚠ Over budget by ₹${Math.abs(remaining).toLocaleString()}`}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#64748b", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/budget-details", { state: { tripData: trip, budget, travelCost, foodCost, stayCost, actCost, totalSpend, remaining, theme } })}>
                    Full breakdown →
                  </span>
                </div>
              </div>

              {/* FINAL INSIGHT */}
              <div style={{ background: "#1e293b", borderRadius: "12px", padding: "28px", color: "white", marginBottom: "16px" }}>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Final Insight</p>
                <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "#e2e8f0", margin: "0 0 20px" }}>
                  This itinerary covers <strong style={{ color: "white" }}>{total_places} locations</strong> across <strong style={{ color: "white" }}>{days} days</strong> in <strong style={{ color: "white" }}>{destination}</strong> with an optimised <strong style={{ color: "white" }}>{route.type}</strong> route.{" "}
                  {summary.budget_status === "Within budget" ? `The plan stays within your ₹${Number(budget).toLocaleString()} budget with ₹${remaining.toLocaleString()} to spare.` : "Consider trimming activities to stay within budget."}{" "}
                  Match score: <strong style={{ color: "white" }}>{match_score}%</strong>.
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button onClick={() => navigate("/")} style={{ background: theme.primary, color: "white", border: "none", padding: "10px 22px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem" }}>
                    Plan another trip
                  </button>
                  <button onClick={() => navigate("/history")} style={{ background: "transparent", color: "#94a3b8", border: "1px solid #334155", padding: "10px 22px", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem" }}>
                    View history
                  </button>
                  <button
                    onClick={() => generateTripPDF({ source, destination, budget, mood, days, itinerary, total_places, estimated_activity_cost, match_score, summary, totalKm, travelHours, travelCost, foodCost, stayCost, actCost, totalSpend, remaining, route, theme })}
                    style={{ background: "white", color: "#1e293b", border: "none", padding: "10px 22px", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600 }}
                  >
                    Download PDF ↓
                  </button>
                </div>
              </div>

            </div>

            {/* ════ RIGHT SIDEBAR ════ */}
            <div style={{ position: "sticky", top: "80px" }}>

              {/* Route Efficiency — circular */}
              <div style={{ ...cardStyle, textAlign: "center" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Route Efficiency</h3>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <CircleScore score={efficiencyScore} primary={theme.primary} size={110} />
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: efficiencyScore >= 80 ? "#16a34a" : efficiencyScore >= 60 ? "#d97706" : "#dc2626", marginBottom: "16px" }}>
                  {efficiencyScore >= 80 ? "✓ Excellent" : efficiencyScore >= 60 ? "~ Good" : "↑ Needs work"}
                </div>
                {[
                  { label: "Budget efficiency",  pct: budgetScore },
                  { label: "Distance optimised", pct: distanceScore },
                  { label: "Time efficiency",    pct: timeScore },
                  { label: "Mood match",         pct: match_score },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "8px", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", marginBottom: "3px" }}>
                      <span>{item.label}</span>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{item.pct}%</span>
                    </div>
                    <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ width: `${item.pct}%`, height: "100%", background: theme.primary, borderRadius: "99px" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Travel Fatigue */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Travel Fatigue</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: fatigueColor, flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, color: fatigueColor, fontSize: "0.95rem", textTransform: "capitalize" }}>{fatigueLevel}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "12px", lineHeight: 1.5 }}>{fatigueMsg}</p>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", marginBottom: "4px" }}>
                    <span>Fatigue Level</span>
                    <span style={{ fontWeight: 600, color: fatigueColor }}>{fatiguePct}%</span>
                  </div>
                  <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ width: `${fatiguePct}%`, height: "100%", background: fatigueColor, borderRadius: "99px" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {[{ label: "Avg stops/day", value: stopsPerDay.toFixed(1) }, { label: "Total stops", value: allPlaces.length }].map((s, i) => (
                    <div key={i} style={{ background: fatigueBg, borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: fatigueColor }}>{s.value}</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {fatigueLevel === "high" && (
                  <div style={{ marginTop: "10px", padding: "8px 12px", background: "#fef2f2", borderRadius: "6px", fontSize: "0.75rem", color: "#991b1b" }}>
                    💡 Reduce to {Math.floor(allPlaces.length * 0.7)} stops for a comfortable pace.
                  </div>
                )}
              </div>

              {/* Trip Difficulty */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Trip Difficulty</h3>
                {[
                  { label: "Easy",      color: "#16a34a", bg: "#f0fdf4", active: fatigueLevel === "low" },
                  { label: "Moderate",  color: "#d97706", bg: "#fffbeb", active: fatigueLevel === "moderate" },
                  { label: "Intensive", color: "#dc2626", bg: "#fef2f2", active: fatigueLevel === "high" },
                ].map((d) => (
                  <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: d.active ? d.bg : "transparent", border: d.active ? `1px solid ${d.color}40` : "1px solid transparent", marginBottom: "6px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: d.active ? 700 : 400, color: d.active ? d.color : "#94a3b8", fontSize: "0.88rem" }}>{d.label}</span>
                    {d.active && <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: d.color, color: "white", padding: "1px 8px", borderRadius: "99px", fontWeight: 600 }}>Your trip</span>}
                  </div>
                ))}
              </div>

              {/* Why SmartRoute chose this */}
              <div style={{ ...cardStyle, background: theme.light, border: `1px solid ${theme.border}` }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Why we chose this</h3>
                {[
                  `₹${Number(budget).toLocaleString()} budget`,
                  `${theme.label} travel mood`,
                  `${days}-day duration`,
                  `${destination} attractions`,
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ color: theme.primary, fontWeight: 700, fontSize: "0.9rem" }}>✓</span>
                    <span style={{ fontSize: "0.82rem", color: "#475569" }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${theme.border}` }}>
                  <p style={{ fontSize: "0.78rem", color: "#475569", margin: "0 0 4px", fontWeight: 600 }}>SmartRoute prioritised:</p>
                  {[
                    fatigueLevel === "low" ? "Low travel fatigue" : "Balanced activity pace",
                    `${theme.label} attractions`,
                    "Budget-friendly activities",
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "4px" }}>
                      {i + 1}. {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}