import { useLocation, useNavigate } from "react-router-dom";
import RouteMap from "../components/RouteMap";

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trip = state?.tripData;

  if (!trip) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-logo">Smart<span>Route</span></div>
          </div>
        </nav>
        <div className="page-sm">
          <div className="panel" style={{ padding: "48px", textAlign: "center" }}>
            <p className="body-text" style={{ marginBottom: "20px" }}>No trip data found.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Go back
            </button>
          </div>
        </div>
      </>
    );
  }

  const { source, destination, budget, distance, budgetBreakdown, suggestions, mood } = trip;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">Smart<span>Route</span></div>
          <div className="navbar-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/")}>
              Back
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("/history")}>
              Trip History
            </button>
          </div>
        </div>
      </nav>

      <div className="page" style={{ maxWidth: "780px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "36px" }}>
          <p className="heading-sm" style={{ marginBottom: "8px" }}>Trip Summary</p>
          <h1 className="heading-xl" style={{ marginBottom: "6px" }}>
            {source} → {destination}
          </h1>
          <p className="body-text">
            {mood.charAt(0).toUpperCase() + mood.slice(1)} style &nbsp;·&nbsp; ₹{Number(budget).toLocaleString()} total budget
          </p>
        </div>

        {/* Stat strip */}
        <div className="stat-row" style={{ marginBottom: "40px" }}>
          <div className="stat-cell">
            <div className="label">Distance</div>
            <div className="value">{distance || "N/A"}</div>
          </div>
          <div className="stat-cell">
            <div className="label">Total Budget</div>
            <div className="value">₹{Number(budget).toLocaleString()}</div>
          </div>
          <div className="stat-cell">
            <div className="label">Travel Style</div>
            <div className="value">{mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
          </div>
        </div>

        {/* Budget breakdown */}
        <div className="section">
          <div className="section-header">
            <h2 className="heading-lg">Budget breakdown</h2>
          </div>

          <div className="budget-item">
            <div className="budget-label">Transport</div>
            <div className="budget-track">
              <div className="budget-fill" style={{ width: "40%" }} />
            </div>
            <div className="budget-amount">₹{budgetBreakdown.transport.toLocaleString()}</div>
            <div style={{ width: "36px", textAlign: "right", fontSize: "0.78rem", color: "var(--muted)" }}>40%</div>
          </div>

          <div className="budget-item">
            <div className="budget-label">Food</div>
            <div className="budget-track">
              <div className="budget-fill" style={{ width: "30%", background: "#60a5fa" }} />
            </div>
            <div className="budget-amount">₹{budgetBreakdown.food.toLocaleString()}</div>
            <div style={{ width: "36px", textAlign: "right", fontSize: "0.78rem", color: "var(--muted)" }}>30%</div>
          </div>

          <div className="budget-item">
            <div className="budget-label">Stay</div>
            <div className="budget-track">
              <div className="budget-fill" style={{ width: "30%", background: "#93c5fd" }} />
            </div>
            <div className="budget-amount">₹{budgetBreakdown.stay.toLocaleString()}</div>
            <div style={{ width: "36px", textAlign: "right", fontSize: "0.78rem", color: "var(--muted)" }}>30%</div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="section">
          <div className="section-header">
            <h2 className="heading-lg">
              {mood.charAt(0).toUpperCase() + mood.slice(1)} travel suggestions
            </h2>
            <p className="body-text" style={{ marginTop: "4px", fontSize: "0.85rem" }}>
              Curated for your travel style
            </p>
          </div>

          <div className="panel">
            {suggestions.map((s, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "16px 20px",
                borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  minWidth: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "var(--blue-light)",
                  color: "var(--blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  fontFamily: "Sora, sans-serif",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ fontSize: "0.92rem", color: "var(--text)", lineHeight: "1.5" }}>{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="section">
          <div className="section-header">
            <h2 className="heading-lg">Route map</h2>
            <p className="body-text" style={{ marginTop: "4px", fontSize: "0.85rem" }}>
              {source} to {destination}
            </p>
          </div>
          <div className="map-wrap">
            <RouteMap source={source} destination={destination} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Plan another trip
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/history")}>
            View history
          </button>
        </div>

      </div>
    </>
  );
}