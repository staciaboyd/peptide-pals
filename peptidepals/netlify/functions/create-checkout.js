
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  const body = new URLSearchParams(event.body);
  const peptide = body.get("peptide_id");
  const mg = body.get("mg");
  const vials = body.get("vials");

  const price = 5000; // placeholder, connect Supabase pricing table

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Peptide ${peptide} - ${mg}mg x ${vials}`
          },
          unit_amount: price
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.URL}/success`,
    cancel_url: `${process.env.URL}`
  });

  return {
    statusCode: 303,
    headers: { Location: session.url }
  };
}
