import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Home() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: peptides } = await supabase
        .from("peptides")
        .select("id,name,description,image_url")
        .order("name");

      const { data: pricing } = await supabase
        .from("pricing")
        .select("peptide_id,mg,vials,price_cents")
        .eq("active", true);

      // compute max savings per peptide
      const savingsById = {};
      for (const p of pricing || []) {
        const key = `${p.peptide_id}:${p.mg}`;
        savingsById[key] ??= {};
        savingsById[key][p.vials] = p.price_cents;
      }
      const maxSave = {};
      Object.entries(savingsById).forEach(([k, tiers]) => {
        if (tiers[1] && tiers[10]) {
          const base = tiers[1] * 10;
          const save = Math.round(((base - tiers[10]) / base) * 100);
          const pid = k.split(":")[0];
          maxSave[pid] = Math.max(maxSave[pid] ?? 0, save);
        }
      });

      setRows((peptides || []).map(p => ({ ...p, save: maxSave[p.id] })));
      setLoading(false);
    })();
  }, []);

  if (loading) return <p style={{ padding: 32 }}>Loading…</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>PeptidePals</h1>
      <div style={grid}>
        {rows.map(p => (
          <div key={p.id} style={card}>
            <img
              src={p.image_url || "/images/placeholder.png"}
              alt={p.name}
              style={img}
              onError={e => (e.currentTarget.src = "/images/placeholder.png")}
            />
            <h3>{p.name}</h3>
            <p style={{ color: "#555", fontSize: 14 }}>{p.description}</p>
            {p.save && <span style={badge}>Save up to {p.save}%</span>}
            <Link to={`/product/${p.id}`} style={link}>View options →</Link>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 40, fontSize: 12 }}>Research Use Only. Not for human consumption.</p>
    </div>
  );
}

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 };
const card = { background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 12px 28px rgba(0,0,0,.08)" };
const img = { width: "100%", height: 220, objectFit: "contain", marginBottom: 12 };
const badge = { display: "inline-block", background: "#16a34a", color: "#fff", padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 8 };
const link = { display: "inline-block", marginTop: 8, color: "#2563eb", fontWeight: 700, textDecoration: "none" };
