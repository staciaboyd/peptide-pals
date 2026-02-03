import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const [peptides, setPeptides] = useState([]);

  useEffect(() => {
    supabase
      .from("peptides")
      .select("id, name, short_description, image_url")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setPeptides(data || []));
  }, []);

  return (
    <>
      <Header />

      <div
        style={{
          padding: "20px 40px 60px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 30
        }}
      >
        {peptides.map(p => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            style={{
              background: "var(--card)",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              transition: "transform 0.2s"
            }}
          >
            <img
              src={p.image_url}
              alt={p.name}
              style={{ width: "100%", marginBottom: 15 }}
            />

            <h3>{p.name}</h3>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              {p.short_description}
            </p>

            <div style={{ marginTop: 12, color: "var(--accent)" }}>
              View options →
            </div>
          </Link>
        ))}
      </div>

      <footer style={{ textAlign: "center", paddingBottom: 40, fontSize: 12 }}>
        Research Use Only. Not for human consumption.
      </footer>
    </>
  );
}
