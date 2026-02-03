import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  const { peptide_id, mg, vials } = JSON.parse(event.body);

  const { data: peptide } = await supabase
    .from("peptides")
    .select("name,image_url")
    .eq("id", peptide_id)
    .single();

  const { data: priceRow } = await supabase
    .from("pricing")
    .select("price_cents")
    .eq("peptide_id", peptide_id)
    .eq("mg", mg)
    .eq("vials", vials)
    .eq("active", true)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.SITE_URL}/success`,
    cancel_url: `${process.env.SITE_URL}/`,
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: `${peptide.name} — ${mg}mg (${vials} vial${vials>1?"s":""})`,
          images: peptide.image_url ? [`${process.env.SITE_URL}${peptide.image_url}`] : []
        },
        unit_amount: priceRow.price_cents
      },
      quantity: 1
    }]
  });

  return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
};
