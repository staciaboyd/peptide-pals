import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();

  const [mg, setMg] = useState(5);
  const [vials, setVials] = useState(1);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function loadPrice() {
      const { data } = await supabase
        .from("pricing")
        .select("price_cents")
        .eq("peptide_id", id)
        .eq("mg", mg)
        .eq("vials", vials)
        .single();

      setPrice(data?.price_cents ?? null);
    }

    loadPrice();
  }, [id, mg, vials]);

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
    <div style={{ padding: 40 }}>
      <h2>Peptide</h2>

      <div>
        <label>MG:</label>
        <select value={mg} onChange={e => setMg(Number(e.target.value))}>
          <option value={5}>5mg</option>
          <option value={10}>10mg</option>
          <option value={15}>15mg</option>
        </select>
      </div>

      <div>
        <label>Vials:</label>
        <select value={vials} onChange={e => setVials(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      <p>
        Price:{" "}
        {price ? `$${(price / 100).toFixed(2)}` : "Not available"}
      </p>

      <button onClick={handleCheckout} disabled={!price}>
        Buy Now
      </button>

      <p style={{ marginTop: 20 }}>
        Research Use Only. Not for human consumption.
      </p>
    </div>
  );
}
