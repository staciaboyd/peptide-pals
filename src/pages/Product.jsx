import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    setProduct(data);
  }

  if (!product) return <p style={{ padding: 32 }}>Loading…</p>;

  return (
    <div style={{ padding: 40 }}>
      <img
        src={product.image_url || "/images/placeholder.png"}
        alt={product.name}
        style={{ width: 300, marginBottom: 20 }}
      />

      <h1>{product.name}</h1>

      <p style={{ maxWidth: 600, marginTop: 12 }}>
        {product.description}
      </p>

      <p style={{ marginTop: 32, fontSize: 13 }}>
        Research Use Only. Not for human consumption.
      </p>
    </div>
  );
}
