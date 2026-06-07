import { useLocation, useNavigate } from "react-router-dom";

export default function BudgetDetails() {
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
    budget, travelCost, foodCost,
    stayCost, actCost, totalSpend,
    remaining, theme
  } = state;

  const items = [
    { label: "Transport", amount: travelCost, pct: 35, emoji: "🚗",
      tip: "Covers fuel, toll, or ticket costs between stops." },
    { label: "Food",      amount: foodCost,   pct: 25, emoji: "🍽️",
      tip: "Meals, snacks, and beverages across all days." },
    { label: "Stay",      amount: stayCost,   pct: 25, emoji: "🏨",
      tip: "Accommodation per night based on your budget tier." },
    { label: "Activities",amount: actCost,    pct: null, emoji: "🎯",
      tip: "Entry fees and activity costs from your itinerary." },
  ];

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
          Budget Details
        </p>
        <h1 style={{
          fontSize: "1.8rem", fontWeight: 700,
          color: "#1e293b", marginBottom: "6px"
        }}>
          ₹{Number(budget).toLocaleString()} Budget
        </h1>
        <p style={{ color: "#64748b", marginBottom: "32px" }}>
          How your budget is distributed across this trip
        </p>

        {/* Status banner */}
        <div style={{
          background: remaining >= 0 ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${remaining >= 0 ? "#bbf7d0" : "#fecaca"}`,
          borderRadius: "12px", padding: "20px 24px",
          marginBottom: "24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{
              fontWeight: 700,
              color: remaining >= 0 ? "#166534" : "#991b1b",
              fontSize: "1.1rem"
            }}>
              {remaining >= 0
                ? `✓ Within budget`
                : `⚠ Over budget`}
            </div>
            <div style={{
              fontSize: "0.85rem",
              color: remaining >= 0 ? "#166534" : "#991b1b",
              marginTop: "2px"
            }}>
              {remaining >= 0
                ? `₹${remaining.toLocaleString()} remaining after all expenses`
                : `₹${Math.abs(remaining).toLocaleString()} over your budget`}
            </div>
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: remaining >= 0 ? "#16a34a" : "#dc2626"
          }}>
            {remaining >= 0 ? "✓" : "✗"}
          </div>
        </div>

        {/* Breakdown items */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0",
          borderRadius: "12px", overflow: "hidden",
          marginBottom: "24px"
        }}>
          {items.map((item, i) => {
            const pct = item.pct ?? Math.round((item.amount / Number(budget)) * 100);
            return (
              <div key={i} style={{
                padding: "20px 24px",
                borderBottom: i < items.length - 1 ? "1px solid #f1f5f9" : "none"
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: "10px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.3rem" }}>{item.emoji}</span>
                    <div>
                      <div style={{
                        fontWeight: 600, color: "#1e293b", fontSize: "0.95rem"
                      }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                        {item.tip}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontWeight: 700, color: "#1e293b", fontSize: "1rem"
                    }}>
                      ₹{item.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {pct}%
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: "6px", background: "#f1f5f9",
                  borderRadius: "99px", overflow: "hidden"
                }}>
                  <div style={{
                    width: `${Math.min(pct, 100)}%`,
                    height: "100%",
                    background: theme?.primary || "#2563eb",
                    borderRadius: "99px"
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total row */}
        <div style={{
          background: theme?.light || "#eff6ff",
          border: `1px solid ${theme?.border || "#bfdbfe"}`,
          borderRadius: "10px", padding: "16px 24px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{
            fontWeight: 700, color: "#1e293b", fontSize: "0.95rem"
          }}>
            Total Estimated Spend
          </span>
          <span style={{
            fontWeight: 800,
            color: theme?.primary || "#2563eb",
            fontSize: "1.2rem"
          }}>
            ₹{totalSpend.toLocaleString()} / ₹{Number(budget).toLocaleString()}
          </span>
        </div>

      </div>
    </div>
  );
}