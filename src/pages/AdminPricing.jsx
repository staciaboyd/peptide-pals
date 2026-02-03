import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const MG_TIERS = [5, 10, 15, 20, 30, 40, 60];

export default function AdminPricing() {
  const [peptides, setPeptides] = useState([]);

  useEffect(() => {
    loadPeptides();
  }, []);

  async function loadPeptides() {
    const { data } = await supabase
      .from("peptides")
      .select("id, name")
      .order("name");

    setPeptides(data || []);
  }

  async function generatePricing(peptideId, wholesaleByMg) {
    for (const mg of MG_TIERS) {
      const wholesale10 = wholesaleByMg[mg];
      if (!wholesale10) continue;

      const base = wholesale10 / 10;

      const tiers = [
        { vials: 1, price: base * 1.6 },
        { vials: 5, price: (wholesale10 / 2) * 1.55 },
        { vials: 10, price: wholesale10 * 1.5 },
      ];

      for (const tier of tiers) {
        await supabase.from("pricing").upsert({
          peptide_id: peptideId,
          mg,
          vials: tier.vials,
          price_cents: Math.round(tier.price * 100),
          active: true,
        });
      }
    }

    alert("All MG pricing generated");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin – Auto Pricing Generator</h1>

      {peptides.map((p) => (
        <PricingBlock key={p.id} peptide={p} onGenerate={generatePricing} />
      ))}
    </div>
  );
}

function PricingBlock({ peptide, onGenerate }) {
  const [wholesale, setWholesale] = useState({});

  return (
    <div style={card}>
      <h3>{peptide.name}</h3>

      {MG_TIERS.map((mg) => (
        <div key={mg} style={row}>
          <label>{mg}mg – 10 vial wholesale ($)</label>
          <input
            type="number"
            onChange={(e) =>
              setWholesale({ ...wholesale, [mg]: +e.target.value })
            }
          />
        </div>
      ))}

      <button onClick={() => onGenerate(peptide.id, wholesale)}>
        Generate All Pricing
      </button>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: 16,
  borderRadius: 10,
  marginBottom: 32,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 8,
};
