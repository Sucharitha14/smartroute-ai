import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home",     path: "/" },
    { label: "History",  path: "/history" },
    { label: "About",    path: "/about" },
  ];

  return (
    <nav style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky", top: 0, zIndex: 100,
      padding: "0 40px", height: "64px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
    }}>

      {/* Left — Logo */}
      <div
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
      >
        <div style={{
          width: "32px", height: "32px",
          background: theme?.primary || "#2563eb",
          borderRadius: "8px",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem"
        }}>
          🗺️
        </div>
        <span style={{
          fontWeight: 800, fontSize: "1.15rem",
          color: "#1e293b", letterSpacing: "-0.3px"
        }}>
          Smart<span style={{ color: theme?.primary || "#2563eb" }}>Route</span>
        </span>
      </div>

      {/* Center — Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: isActive(link.path)
                ? (theme?.light || "#eff6ff")
                : "transparent",
              color: isActive(link.path)
                ? (theme?.primary || "#2563eb")
                : "#64748b",
              border: "none",
              padding: "7px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.88rem",
              fontWeight: isActive(link.path) ? 600 : 400,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              if (!isActive(link.path)) {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.color = "#1e293b";
              }
            }}
            onMouseLeave={e => {
              if (!isActive(link.path)) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right — CTA */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: theme?.primary || "#2563eb",
          color: "white",
          border: "none",
          padding: "9px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.88rem",
          fontWeight: 600,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Plan a trip
      </button>

    </nav>
  );
}