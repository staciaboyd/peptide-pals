import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPeptides() {
  const [peptides, setPeptides] = useState([]);

  useEffect(() => {
    loadPeptides();
  }, []);

  async function loadPeptides() {
    const { data } = await supabase
      .from("peptides")
      .select("id, name, description, image_url")
      .order("name");

    setPeptides(data || []);
  }

  async function updateField(id, field, value) {
    await supabase.from("peptides").update({ [field]: value }).eq("id", id);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin – Peptides</h1>

      {peptides.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <strong>{p.name}</strong>

          <div style={{ marginTop: 10 }}>
            <label>Image URL</label>
            <input
              style={input}
              defaultValue={p.image_url || ""}
              onBlur={(e) =>
                updateField(p.id, "image_url", e.target.value)
              }
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Description</label>
            <textarea
              style={{ ...input, height: 80 }}
              defaultValue={p.description || ""}
              onBlur={(e) =>
                updateField(p.id, "description", e.target.value)
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const input = {
  width: "100%",
  padding: 8,
  marginTop: 4,
};
