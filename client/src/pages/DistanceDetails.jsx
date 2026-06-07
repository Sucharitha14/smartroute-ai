import { useLocation, useNavigate } from "react-router-dom";

export default function DistanceDetails() {
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
    source, destination, totalKm,
    travelHours, allPlaces, theme
  } = state;

  const speedMap = {
    car:    { speed: 60,  label: "By Car",    emoji: "🚗" },
    train:  { speed: 80,  label: "By Train",  emoji: "🚆" },
    flight: { speed: 500, label: "By Flight", emoji: "✈️" },
    bike:   { speed: 40,  label: "By Bike",   emoji: "🏍️" },
  };

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
          Route Details
        </p>
        <h1 style={{
          fontSize: "1.8rem", fontWeight: 700,
          color: "#1e293b", marginBottom: "6px"
        }}>
          {source} → {destination}
        </h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>
          Estimated distance across all stops in your itinerary
        </p>

        {/* Main distance card */}
        <div style={{
          background: theme?.light || "#eff6ff",
          border: `2px solid ${theme?.border || "#bfdbfe"}`,
          borderRadius: "14px", padding: "32px",
          textAlign: "center", marginBottom: "24px"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>📍</div>
          <div style={{
            fontSize: "3.5rem", fontWeight: 800,
            color: theme?.primary || "#2563eb", lineHeight: 1
          }}>
            {totalKm} km
          </div>
          <p style={{ color: "#64748b", marginTop: "8px" }}>
            Total estimated driving distance across {allPlaces?.length || 0} stops
          </p>
        </div>

        {/* Travel mode comparison */}
        <h2 style={{
          fontSize: "1rem", fontWeight: 700,
          color: "#1e293b", marginBottom: "16px",
          textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          Travel Time by Mode
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "12px", marginBottom: "32px"
        }}>
          {Object.entries(speedMap).map(([mode, info]) => {
            const hrs = (totalKm / info.speed).toFixed(1);
            return (
              <div key={mode} style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "10px", padding: "18px",
                display: "flex", alignItems: "center", gap: "14px"
              }}>
                <span style={{ fontSize: "1.8rem" }}>{info.emoji}</span>
                <div>
                  <div style={{
                    fontWeight: 700, color: "#1e293b", fontSize: "1.1rem"
                  }}>
                    {hrs} hrs
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {info.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stop list */}
        {allPlaces?.length > 0 && (
          <>
            <h2 style={{
              fontSize: "1rem", fontWeight: 700,
              color: "#1e293b", marginBottom: "16px",
              textTransform: "uppercase", letterSpacing: "0.5px"
            }}>
              Stops on This Route
            </h2>
            <div style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "10px", overflow: "hidden"
            }}>
              {allPlaces.map((place, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center",
                  gap: "14px", padding: "14px 18px",
                  borderBottom: i < allPlaces.length - 1
                    ? "1px solid #f1f5f9" : "none"
                }}>
                  <div style={{
                    width: "28px", height: "28px",
                    background: theme?.primary || "#2563eb",
                    color: "white", borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "0.78rem",
                    fontWeight: 700, flexShrink: 0
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 600, color: "#1e293b",
                      fontSize: "0.92rem"
                    }}>
                      {place.name}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      {place.type}
                    </div>
                  </div>
                  
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: "0.75rem",
                      color: theme?.primary || "#2563eb",
                      textDecoration: "none",
                      background: theme?.light || "#eff6ff",
                      padding: "4px 10px",
                      borderRadius: "99px",
                      fontWeight: 600
                    }}
                  >
                    Maps ↗
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}