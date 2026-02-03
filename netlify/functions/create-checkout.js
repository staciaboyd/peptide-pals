import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { peptide_id, mg, vials, user_id } = JSON.parse(event.body);

    if (!peptide_id || !mg || !vials || !user_id) {
      return { statusCode: 400, body: "Missing fields" };
    }

    const { data: pricing, error } = await supabase
      .from("pricing")
      .select("price_cents")
      .eq("peptide_id", peptide_id)
      .eq("mg", mg)
      .eq("vials", vials)
      .single();

    if (error || !pricing) {
      return { statusCode: 404, body: "Price not found" };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Peptide ${mg}mg × ${vials} vials`
            },
            unit_amount: pricing.price_cents
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return {
      statusCode: 500,
      body: "Checkout failed"
    };
  }
}
