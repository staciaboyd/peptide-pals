import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Product() {
  const { id } = useParams();

  const [peptide, setPeptide] = useState(null);
  const [pricing, setPricing] = useState([]);
  const [mg, setMg] = useState(null);
  const [vials, setVials] = useState(1);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    supabase
      .from("peptides")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setPeptide(data));

    supabase
      .from("pricing")
      .select("mg, vials, website_cents")
      .eq("peptide_id", id)
      .then(({ data }) => {
        setPricing(data || []);
        if (data?.length) setMg(data[0].mg);
      });
  }, [id]);

  useEffect(() => {
    const match = pricing.find(p => p.mg === mg && p.vials === vials);
    setPrice(match?.website_cents ?? null);
  }, [pricing, mg, vials]);

  function savings() {
    const single = pricing.find(p => p.mg === mg && p.vials === 1);
    if (!single || vials === 1 || !price) return null;
    return Math.round(((single.website_cents * vials - price) /
      (single.website_cents * vials)) * 100);
  }

  if (!peptide) return null;

  return (
    <div style={{ padding: 60, maxWidth: 1100, margin: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
      <img src={peptide.image_url} alt={peptide.name} />

      <div>
        <h1>{peptide.name}</h1>
        <p style={{ color: "var(--muted)" }}>{peptide.long_description}</p>

        <div style={{ marginTop: 20 }}>
          <label>MG</label>
          <select value={mg} onChange={e => setMg(Number(e.target.value))}>
            {[...new Set(pricing.map(p => p.mg))].map(m => (
              <option key={m}>{m} mg</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 15 }}>
          <label>Vials</label>
          <select value={vials} onChange={e => setVials(Number(e.target.value))}>
            <option value={1}>1 vial</option>
            <option value={5}>5 vials</option>
            <option value={10}>10 vials</option>
          </select>
        </div>

        <h2 style={{ marginTop: 25 }}>
          {price ? `$${(price / 100).toFixed(2)}` : "Unavailable"}
        </h2>

        {savings() && (
          <div style={{ color: "var(--success)" }}>
            Save {savings()}% vs single vials
          </div>
        )}

        <button style={{ marginTop: 30 }}>Buy Now</button>

        <p style={{ fontSize: 12, marginTop: 30 }}>
          Research Use Only. Not for human consumption.
        </p>
      </div>
    </div>
  );
}
