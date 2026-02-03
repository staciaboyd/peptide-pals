import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export default function AdminPricing() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin =
    user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;

    async function loadPricing() {
      const { data } = await supabase
        .from("pricing")
        .select(`
          id,
          mg,
          vials,
          website_cents,
          peptides ( name )
        `)
        .order("name", { foreignTable: "peptides" });

      setRows(data || []);
      setLoading(false);
    }

    loadPricing();
  }, [isAdmin]);

  async function updatePrice(id, value) {
    await supabase
      .from("pricing")
      .update({
        website_cents: Math.round(Number(value) * 100),
        price_cents: Math.round(Number(value) * 100)
      })
      .eq("id", id);
  }

  if (!isAdmin) {
    return <p style={{ padding: 40 }}>Access denied.</p>;
  }

  if (loading) {
    return <p style={{ padding: 40 }}>Loading pricing…</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Pricing Editor</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>MG</th>
            <th>Vials</th>
            <th>Website Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.peptides.name}</td>
              <td>{row.mg}</td>
              <td>{row.vials}</td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={(row.website_cents / 100).toFixed(2)}
                  onBlur={e =>
                    updatePrice(row.id, e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
