import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") || "";
  if (!sessionId) return NextResponse.json({ paid: false }, { status: 400 });
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" as any });
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = s && (s.payment_status === "paid" || s.status === "complete");
    return NextResponse.json({ paid });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ paid: false }, { status: 500 });
  }
} 