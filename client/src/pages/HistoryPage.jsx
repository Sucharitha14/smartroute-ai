import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HistoryPage() {
  const [trips, setTrips] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://smartroute-ai-7rh4.onrender.com/api/trips")
      .then((res) => res.json())
      .then((data) => setTrips(data));
  }, []);

  async function handleDelete(id) {
    setDeletingId(id);

    await fetch(
      `https://smartroute-ai-7rh4.onrender.com/api/trips/${id}`,
      {
        method: "DELETE",
      }
    );

    setTrips((prev) => prev.filter((t) => t._id !== id));
    setDeletingId(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <div
        className="page"
        style={{
          maxWidth: "780px",
          flex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p
            className="heading-sm"
            style={{ marginBottom: "8px" }}
          >
            Your account
          </p>

          <h1
            className="heading-xl"
            style={{ marginBottom: "6px" }}
          >
            Trip history
          </h1>

          <p className="body-text">
            {trips.length}{" "}
            {trips.length === 1 ? "trip" : "trips"} saved
          </p>
        </div>

        {/* Trips Panel */}
        {trips.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <p>No trips yet</p>
              <p>Plan your first trip to see it here.</p>
            </div>
          </div>
        ) : (
          <div className="panel">
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr auto",
                gap: "12px",
                padding: "10px 24px",
                background: "var(--bg)",
                borderBottom:
                  "1px solid var(--border)",
                borderRadius: "7px 7px 0 0",
              }}
            >
              {[
                "Route",
                "Budget",
                "Style",
                "Date",
                "",
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {trips.map((trip) => (
              <div
                key={trip._id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "2fr 1fr 1fr 1fr auto",
                  gap: "12px",
                  padding: "16px 24px",
                  borderBottom:
                    "1px solid var(--border)",
                  alignItems: "center",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "transparent")
                }
              >
                <div>
                  <div
                    style={{
                      fontFamily:
                        "Sora, sans-serif",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "var(--text)",
                    }}
                  >
                    {trip.source} → {trip.destination}
                  </div>

                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--muted)",
                      marginTop: "2px",
                    }}
                  >
                    {trip.distance || "—"}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text)",
                    fontWeight: "500",
                  }}
                >
                  ₹{trip.budget.toLocaleString()}
                </div>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--muted)",
                  }}
                >
                  {trip.mood.charAt(0).toUpperCase() +
                    trip.mood.slice(1)}
                </div>

                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                  }}
                >
                  {new Date(
                    trip.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                <button
                  className="btn btn-danger-ghost"
                  onClick={() =>
                    handleDelete(trip._id)
                  }
                  disabled={
                    deletingId === trip._id
                  }
                >
                  {deletingId === trip._id
                    ? "..."
                    : "Delete"}
                </button>
              </div>
            ))}

            {/* Footer Row */}
            <div
              style={{
                padding: "12px 24px",
                fontSize: "0.78rem",
                color: "var(--muted)",
              }}
            >
              Showing {trips.length}{" "}
              {trips.length === 1
                ? "record"
                : "records"}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}