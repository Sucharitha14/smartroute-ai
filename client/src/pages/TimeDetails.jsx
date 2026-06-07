import { useLocation, useNavigate } from "react-router-dom";

export default function TimeDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>No data found.</p>
        <button onClick={() => navigate("/")}>Go home</button>
      </div>
    );
  }

  const {
    travelHours, totalKm, days,
    source, destination, theme, mood
  } = state;

  const schedule = [
    { time: "6:00 AM",  activity: "Start journey from " + source },
    { time: "7:30 AM",  activity: "Morning slot — first place visit" },
    { time: "12:00 PM", activity: "Afternoon slot — second visit + lunch" },
    { time: "3:30 PM",  activity: "Continue to next stop" },
    { time: "5:30 PM",  activity: "Evening slot — leisure or viewpoint" },
    { time: "8:00 PM",  activity: "Dinner and check-in to stay" },
  ];

  const travelModeRec =
    totalKm < 150  ? { mode: "Car / Bike", emoji: "🚗", reason: "Short distance — road trip is ideal" } :
    totalKm < 500  ? { mode: "Car / Train", emoji: "🚆", reason: "Medium distance — train is comfortable" } :
                     { mode: "Flight", emoji: "✈️", reason: "Long distance — flight saves time" };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        background: "white", borderBottom: "1px solid #e2e8f0",
        padding: "0 32px", height: "60px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>
          Smart<span style={{ color: theme?.primary || "#2563eb" }}>Route</span>
        </span>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "1px solid #e2e8f0",
            padding: "8px 16px", borderRadius: "7px",
            cursor: "pointer", fontSize: "0.88rem", color: "#64748b"
          }}
        >
          ← Back to Results
        </button>
      </nav>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <p style={{
          fontSize: "0.78rem", fontWeight: 600,
          color: theme?.primary || "#2563eb",
          textTransform: "uppercase", letterSpacing: "1px",
          marginBottom: "6px"
        }}>
          Time Plan
        </p>
        <h1 style={{
          fontSize: "1.8rem", fontWeight: 700,
          color: "#1e293b", marginBottom: "6px"
        }}>
          {days}-Day Time Breakdown
        </h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>
          {source} → {destination} · {travelHours} hrs estimated travel
        </p>

        {/* Summary cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px", marginBottom: "28px"
        }}>
          {[
            { label: "Travel Time", value: `${travelHours} hrs`, emoji: "⏱️" },
            { label: "Total Days",  value: `${days} days`,       emoji: "📅" },
            { label: "Distance",    value: `${totalKm} km`,      emoji: "📍" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "10px", padding: "16px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>
                {s.emoji}
              </div>
              <div style={{
                fontSize: "1.2rem", fontWeight: 700,
                color: theme?.primary || "#2563eb"
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Travel mode recommendation */}
        <div style={{
          background: theme?.light || "#eff6ff",
          border: `2px solid ${theme?.border || "#bfdbfe"}`,
          borderRadius: "12px", padding: "20px 24px",
          marginBottom: "28px",
          display: "flex", alignItems: "center", gap: "16px"
        }}>
          <span style={{ fontSize: "2.5rem" }}>{travelModeRec.emoji}</span>
          <div>
            <div style={{
              fontWeight: 700, color: "#1e293b",
              fontSize: "1rem", marginBottom: "2px"
            }}>
              Recommended: {travelModeRec.mode}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {travelModeRec.reason}
            </div>
          </div>
        </div>

        {/* Daily schedule */}
        <h2 style={{
          fontSize: "1rem", fontWeight: 700,
          color: "#1e293b", marginBottom: "16px",
          textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          Suggested Daily Schedule
        </h2>
        <div style={{
          background: "white", border: "1px solid #e2e8f0",
          borderRadius: "12px", overflow: "hidden"
        }}>
          {schedule.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start",
              gap: "16px", padding: "14px 20px",
              borderBottom: i < schedule.length - 1
                ? "1px solid #f1f5f9" : "none"
            }}>
              <div style={{
                width: "70px", fontSize: "0.78rem",
                fontWeight: 700, color: theme?.primary || "#2563eb",
                flexShrink: 0, paddingTop: "2px"
              }}>
                {item.time}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#475569" }}>
                {item.activity}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}