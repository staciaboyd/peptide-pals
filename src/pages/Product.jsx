import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Product() {
  const { id } = useParams();
  const [peptide, setPeptide] = useState(null);
  const [pricing, setPricing] = useState([]);
  const [mg, setMg] = useState(null);
  const [vials, setVials] = useState(1);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("peptides")
        .select("id,name,description,image_url")
        .eq("id", id)
        .single();
      setPeptide(p);

      const { data: pr } = await supabase
        .from("pricing")
        .select("mg,vials,price_cents")
        .eq("peptide_id", id)
        .eq("active", true)
        .order("mg");
      setPricing(pr || []);
      if (pr?.length) setMg(pr[0].mg);
    })();
  }, [id]);

  useEffect(() => {
    const match = pricing.find(p => p.mg === mg && p.vials === vials);
    setPrice(match?.price_cents ?? null);
  }, [pricing, mg, vials]);

  const savingsPct = (() => {
    const single = pricing.find(p => p.mg === mg && p.vials === 1);
    if (!single || !price || vials === 1) return null;
    const baseline = single.price_cents * vials;
    return Math.round(((baseline - price) / baseline) * 100);
  })();

  if (!peptide) return <p style={{ padding: 32 }}>Loading…</p>;

  return (
    <div style={styles.wrap}>
      <img
        src={peptide.image_url || "/images/placeholder.png"}
        alt={peptide.name}
        style={styles.image}
        onError={e => (e.currentTarget.src = "/images/placeholder.png")}
      />

      <div>
        <h1>{peptide.name}</h1>
        <p style={styles.desc}>{peptide.description}</p>

        <div style={styles.controls}>
          <label>MG</label>
          <select value={mg ?? ""} onChange={e => setMg(+e.target.value)}>
            {[...new Set(pricing.map(p => p.mg))].map(m => (
              <option key={m} value={m}>{m} mg</option>
            ))}
          </select>

          <label>Vials</label>
          <select value={vials} onChange={e => setVials(+e.target.value)}>
            <option value={1}>1 vial</option>
            <option value={5}>5 vials</option>
            <option value={10}>10 vials</option>
          </select>
        </div>

        <div style={styles.priceRow}>
          <h2>{price ? `$${(price / 100).toFixed(2)}` : "Unavailable"}</h2>
          {savingsPct && <span style={styles.badge}>Save {savingsPct}%</span>}
        </div>

        <button style={styles.cta} disabled={!price}>Buy Now</button>

        <p style={styles.disclaimer}>
          Research Use Only. Not for human consumption.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: 40, maxWidth: 1100, margin: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 },
  image: { width: "100%", maxWidth: 420 },
  desc: { color: "#555", maxWidth: 560 },
  controls: { display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, marginTop: 20 },
  priceRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 16 },
  badge: { background: "#16a34a", color: "#fff", padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  cta: { marginTop: 20, padding: "12px 18px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700 },
  disclaimer: { marginTop: 24, fontSize: 12, color: "#555" }
};
