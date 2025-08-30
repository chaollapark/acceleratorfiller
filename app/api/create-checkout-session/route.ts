import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  uploadId: z.string().optional(),
  shitTier: z.boolean().optional(),
  price: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uploadId, shitTier, price } = Schema.parse(body);
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" as any });
    
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const base = `${protocol}://${host}`
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: shitTier ? "Shit Tier Blaster - 100+ Survival-Mode Accelerators" : "Application Prep for 32 Accelerators" 
            },
            unit_amount: price ? price * 100 : 9900 // Convert to cents, default €99
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