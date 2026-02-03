import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [form, setForm] = useState({
    name: "LEO-Net",
    planes: 6,
    sats_per_plane: 8,
    altitude_km: 550,
    inclination_deg: 53,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [constellation, setConstellation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/constellation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setConstellation(data);
    } catch (err) {
      console.error(err);
      setError("Could not build constellation. Is the Python API running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>LEO Constellation Builder</h1>
        <p>Frontend for your Python constellation generator.</p>
      </header>

      <main className="content">
        <section className="card">
          <h2>Parameters</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Planes
              <input
                type="number"
                name="planes"
                min="1"
                value={form.planes}
                onChange={handleChange}
              />
            </label>

            <label>
              Satellites per plane
              <input
                type="number"
                name="sats_per_plane"
                min="1"
                value={form.sats_per_plane}
                onChange={handleChange}
              />
            </label>

            <label>
              Altitude (km)
              <input
                type="number"
                name="altitude_km"
                min="100"
                value={form.altitude_km}
                onChange={handleChange}
              />
            </label>

            <label>
              Inclination (deg)
              <input
                type="number"
                name="inclination_deg"
                min="0"
                max="180"
                value={form.inclination_deg}
                onChange={handleChange}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Building..." : "Build Constellation"}
            </button>

            {error && <p className="error">{error}</p>}
          </form>
        </section>

        <section className="card card-wide">
          <h2>Constellation view</h2>
          {!constellation && <p>No constellation built yet.</p>}
          {constellation && (
            <>
              <p>
                <strong>{constellation.name}</strong> –{" "}
                {constellation.satellites.length} satellites
              </p>
              <div className="vis-layout">
                <div className="orbit-panel">
                  <OrbitDiagram satellites={constellation.satellites} />
                </div>
                <div className="table-panel">
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Alt (km)</th>
                          <th>Incl (°)</th>
                          <th>RAAN (°)</th>
                          <th>TA (°)</th>
                          <th>X</th>
                          <th>Y</th>
                        </tr>
                      </thead>
                      <tbody>
                        {constellation.satellites.map((sat) => (
                          <tr key={sat.name}>
                            <td>{sat.name}</td>
                            <td>{sat.altitude_km}</td>
                            <td>{sat.inclination_deg}</td>
                            <td>{sat.raan_deg}</td>
                            <td>{sat.true_anomaly_deg}</td>
                            <td>{sat.x.toFixed(2)}</td>
                            <td>{sat.y.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function OrbitDiagram({ satellites }) {
  if (!satellites || satellites.length === 0) {
    return null;
  }

  // Compute bounds of x/y to scale nicely into the viewBox
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  satellites.forEach((s) => {
    if (s.x < minX) minX = s.x;
    if (s.x > maxX) maxX = s.x;
    if (s.y < minY) minY = s.y;
    if (s.y > maxY) maxY = s.y;
  });

  // Pad bounds a bit so dots are not on the edges
  const padding = 0.1;
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;

  const scaleX = (x) => ((x - minX) / width) * (1 - 2 * padding) + padding;
  const scaleY = (y) =>
    1 - (((y - minY) / height) * (1 - 2 * padding) + padding);

  return (
    <svg
      className="orbit-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Earth (just a circle in the middle) */}
      <circle cx="50" cy="50" r="8" className="earth-circle" />

      {/* Satellites */}
      {satellites.map((s) => {
        const x = scaleX(s.x) * 100;
        const y = scaleY(s.y) * 100;
        return (
          <g key={s.name}>
            <circle cx={x} cy={y} r="1.8" className="sat-circle" />
          </g>
        );
      })}
    </svg>
  );
}

