import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();

  const [mg, setMg] = useState(10);
  const [vials, setVials] = useState(1);
  const [pricing, setPricing] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    async function loadPricing() {
      const { data } = await supabase
        .from("pricing")
        .select("vials, website_cents")
        .eq("peptide_id", id)
        .eq("mg", mg);

      setPricing(data || []);
    }

    loadPricing();
  }, [id, mg]);

  useEffect(() => {
    const match = pricing.find(p => p.vials === vials);
    setCurrentPrice(match?.website_cents ?? null);
  }, [pricing, vials]);

  function getBaselineUnitPrice() {
    const oneVial = pricing.find(p => p.vials === 1);
    return oneVial ? oneVial.website_cents : null;
  }

  function getSavingsPercent() {
    const base = getBaselineUnitPrice();
    if (!base || !currentPrice || vials === 1) return null;

    const baseTotal = base * vials;
    const savings = ((baseTotal - currentPrice) / baseTotal) * 100;
    return Math.round(savings);
  }

  async function handleCheckout() {
    const res = await fetch("/.netlify/functions/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        peptide_id: id,
        mg,
        vials,
        user_id: user.id
      })
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h2>Peptide</h2>

      <div>
        <label>MG:</label>
        <select value={mg} onChange={e => setMg(Number(e.target.value))}>
          <option value={5}>5mg</option>
          <option value={10}>10mg</option>
          <option value={20}>20mg</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Vials:</label>
        <select value={vials} onChange={e => setVials(Number(e.target.value))}>
          <option value={1}>1 vial</option>
          <option value={5}>5 vials</option>
          <option value={10}>10 vials</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>
          Price:{" "}
          {currentPrice
            ? `$${(currentPrice / 100).toFixed(2)}`
            : "Unavailable"}
        </strong>
      </div>

      {getSavingsPercent() !== null && (
        <div style={{ marginTop: 10, color: "green", fontWeight: "bold" }}>
          Save {getSavingsPercent()}% vs single vials
        </div>
      )}

      <button
        style={{ marginTop: 30 }}
        onClick={handleCheckout}
        disabled={!currentPrice}
      >
        Buy Now
      </button>

      <p style={{ marginTop: 30, fontSize: 12 }}>
        Research Use Only. Not for human consumption.
      </p>
    </div>
  );
}
