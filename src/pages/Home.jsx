import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Home() {
  const [peptides, setPeptides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPeptides() {
      const { data } = await supabase
        .from("peptides")
        .select("id, name, short_description")
        .eq("active", true)
        .order("name");

      setPeptides(data || []);
      setLoading(false);
    }

    loadPeptides();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading products…</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>PeptidePals</h1>

      <p style={{ marginBottom: 30 }}>
        Premium research peptides available in multiple concentrations
        and vial configurations.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24
        }}
      >
        {peptides.map(peptide => (
          <Link
            key={peptide.id}
            to={`/product/${peptide.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 20,
              background: "#fff",
              transition: "transform 0.15s ease, box-shadow 0.15s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h3 style={{ marginBottom: 10 }}>
              {peptide.name}
            </h3>

            <p style={{ fontSize: 14, color: "#555" }}>
              {peptide.short_description ||
                "High-quality research peptide."}
            </p>

            <div
              style={{
                marginTop: 15,
                fontSize: 13,
                color: "#0070f3",
                fontWeight: "bold"
              }}
            >
              View options →
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: 12 }}>
        Research Use Only. Not for human consumption.
      </p>
    </div>
  );
}
