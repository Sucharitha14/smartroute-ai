import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [form, setForm] = useState({
    source: "",
    destination: "",
    budget: "",
    mood: "relaxed",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
   const res = await fetch("https://smartroute-ai-7rh4.onrender.com/api/trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    navigate("/results", { state: { tripData: data } });
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            Smart<span>Route</span>
          </div>
          <div className="navbar-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/history")}>
              Trip History
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="page-sm">
        <div style={{ marginBottom: "32px" }}>
          <h1 className="heading-xl" style={{ marginBottom: "8px" }}>
            Plan your next trip
          </h1>
          <p className="body-text">
            Enter your route and budget — we'll handle the rest.
          </p>
        </div>

        {/* Form panel */}
        <div className="panel" style={{ padding: "28px" }}>
          <form onSubmit={handleSubmit}>

            <div className="field-row">
              <div className="field">
                <label>From</label>
                <input
                  name="source"
                  placeholder="e.g. Mumbai"
                  value={form.source}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>To</label>
                <input
                  name="destination"
                  placeholder="e.g. Goa"
                  value={form.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Budget (INR)</label>
                <input
                  name="budget"
                  type="number"
                  placeholder="e.g. 8000"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Travel style</label>
                <select name="mood" value={form.mood} onChange={handleChange}>
                  <option value="relaxed">Relaxed</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary full"
              disabled={loading}
            >
              {loading ? <><span className="spinner" /> Planning route...</> : "Plan route"}
            </button>

          </form>
        </div>

        {/* Footer note */}
        <p className="body-text" style={{ marginTop: "20px", fontSize: "0.82rem", textAlign: "center" }}>
          Covers 50+ Indian city routes — distance, budget, and travel suggestions.
        </p>
      </div>
    </>
  );
}