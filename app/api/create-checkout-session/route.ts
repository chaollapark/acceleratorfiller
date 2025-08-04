import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" as any });
    const base = process.env.NEXT_PUBLIC_SITE_URL!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Application Prep for 32 Accelerators" },
            unit_amount: 5000 // €50
          },
          quantity: 1
        }
      ],
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?canceled=1`
    });
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
} 