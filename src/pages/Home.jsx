import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("peptides")
      .select("id, name, description, image_url")
      .order("name");

    if (!error) setProducts(data || []);
    setLoading(false);
  }

  if (loading) return <p style={{ padding: 32 }}>Loading…</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PeptidePals</h1>

      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <img
              src={p.image_url || "/images/placeholder.png"}
              alt={p.name}
              style={styles.image}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
            />

            <h3>{p.name}</h3>

            <p style={styles.desc}>
              {p.description || "Research peptide available for laboratory study."}
            </p>

            <Link to={`/product/${p.id}`} style={styles.link}>
              View options →
            </Link>
          </div>
        ))}
      </div>

      <p style={styles.disclaimer}>
        Research Use Only. Not for human consumption.
      </p>
    </div>
  );
}

const styles = {
  container: { padding: 40 },
  title: { fontSize: 32, marginBottom: 30 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 28,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
  },
  image: {
    width: "100%",
    height: 220,
    objectFit: "contain",
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  link: {
    fontWeight: 600,
    textDecoration: "none",
    color: "#2563eb",
  },
  disclaimer: {
    marginTop: 40,
    fontSize: 13,
    color: "#555",
  },
};
