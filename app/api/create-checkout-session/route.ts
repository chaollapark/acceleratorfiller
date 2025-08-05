import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  uploadId: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uploadId } = Schema.parse(body);
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" as any });
    
    // Get the site URL with fallback
    let base = process.env.NEXT_PUBLIC_SITE_URL;
    if (!base) {
      // Fallback for development
      base = "http://localhost:3000";
    }
    
    // Ensure the URL has a scheme
    if (!base.startsWith('http://') && !base.startsWith('https://')) {
      base = `https://${base}`;
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Application Prep for 32 Accelerators" },
            unit_amount: 9900 // €99
          },
          quantity: 1
        }
      ],
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}${uploadId ? `&upload_id=${uploadId}` : ''}`,
      cancel_url: `${base}/?canceled=1`,
      metadata: uploadId ? { uploadId } : undefined
    });
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
} 