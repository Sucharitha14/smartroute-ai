import { useNavigate } from "react-router-dom";

export default function Footer({ theme }) {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: "#1e293b",
      color: "#94a3b8",
      padding: "48px 40px 32px",
      marginTop: "0",
    }}>
      <div style={{
        maxWidth: "1000px", margin: "0 auto",
      }}>

        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "40px",
          marginBottom: "40px",
        }}>

          {/* Brand column */}
          <div>
            <div style={{
              fontWeight: 800, fontSize: "1.2rem",
              color: "white", marginBottom: "12px",
              letterSpacing: "-0.3px"
            }}>
              Smart<span style={{ color: theme?.primary || "#2563eb" }}>Route</span>
            </div>
            <p style={{
              fontSize: "0.85rem", lineHeight: "1.7",
              color: "#64748b", maxWidth: "240px"
            }}>
              AI-powered route intelligence for Indian road trips.
              Plan smarter. Travel better.
            </p>
          </div>

          {/* Features column */}
          <div>
            <div style={{
              fontWeight: 600, color: "white",
              fontSize: "0.85rem", marginBottom: "14px",
              textTransform: "uppercase", letterSpacing: "0.5px"
            }}>
              Features
            </div>
            {[
              "Route Optimization",
              "Budget Planning",
              "Mood Planning",
              "Trip History",
            ].map(f => (
              <div key={f} style={{
                fontSize: "0.83rem", color: "#64748b",
                marginBottom: "8px", cursor: "default"
              }}>
                {f}
              </div>
            ))}
          </div>

          {/* Tech column */}
          <div>
            <div style={{
              fontWeight: 600, color: "white",
              fontSize: "0.85rem", marginBottom: "14px",
              textTransform: "uppercase", letterSpacing: "0.5px"
            }}>
              Built With
            </div>
            {["React", "Node.js", "MongoDB", "Leaflet"].map(t => (
              <div key={t} style={{
                fontSize: "0.83rem", color: "#64748b",
                marginBottom: "8px"
              }}>
                {t}
              </div>
            ))}
          </div>

          {/* Links column */}
          <div>
            <div style={{
              fontWeight: 600, color: "white",
              fontSize: "0.85rem", marginBottom: "14px",
              textTransform: "uppercase", letterSpacing: "0.5px"
            }}>
              Navigate
            </div>
            {[
              { label: "Home",    path: "/" },
              { label: "History", path: "/history" },
              { label: "About",   path: "/about" },
            ].map(link => (
              <div
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  fontSize: "0.83rem", color: "#64748b",
                  marginBottom: "8px", cursor: "pointer",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "white"}
                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
              >
                {link.label}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: "1px solid #334155",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <span style={{ fontSize: "0.8rem", color: "#475569" }}>
            © 2026 SmartRoute. Built for MCA Final Project.
          </span>
          <span style={{ fontSize: "0.8rem", color: "#475569" }}>
            Powered by OpenStreetMap · MongoDB Atlas · Render · Vercel
          </span>
        </div>

      </div>
    </footer>
  );
}