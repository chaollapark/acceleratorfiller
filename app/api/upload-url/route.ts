import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import Stripe from "stripe";
import crypto from "node:crypto";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  session_id: z.string().min(1),
  filename: z.string().min(1),
  mime: z.string().min(1)
});

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, filename, mime } = Schema.parse(body);

    // Verify Stripe session is paid
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" as any });
    const s = await stripe.checkout.sessions.retrieve(session_id);
    const paid = s && (s.payment_status === "paid" || s.status === "complete");
    if (!paid) return NextResponse.json({ error: "Payment required" }, { status: 403 });

    if (!ALLOWED.has(mime)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = (filename.split(".").pop() || "bin").toLowerCase();
    const key = `uploads/${session_id}/${crypto.randomUUID()}.${ext}`;

    // Initialize Firebase Storage
    const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
    const storage = new Storage({
      credentials: serviceAccountKey,
      projectId: serviceAccountKey.project_id
    });
    
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET!;
    const [url] = await storage
      .bucket(bucketName)
      .file(key)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: mime
      });

    return NextResponse.json({ url, key, bucket: bucketName });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
} 