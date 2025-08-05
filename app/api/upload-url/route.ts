import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import Stripe from "stripe";
import crypto from "node:crypto";
import { z } from "zod";

export const runtime = "nodejs";

const Schema = z.object({
  session_id: z.string().optional(),
  filename: z.string().min(1),
  mime: z.string().min(1),
  content: z.string().optional(),
  prePayment: z.boolean().optional()
});

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
]);

const VIDEO_ALLOWED = new Set([
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/flv",
  "video/webm"
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, filename, mime, content, prePayment } = Schema.parse(body);

    // If session_id is provided, verify payment
    if (session_id && !prePayment) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" as any });
      const s = await stripe.checkout.sessions.retrieve(session_id);
      const paid = s && (s.payment_status === "paid" || s.status === "complete");
      if (!paid) return NextResponse.json({ error: "Payment required" }, { status: 403 });
    }

    if (!ALLOWED.has(mime) && !VIDEO_ALLOWED.has(mime)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = (filename.split(".").pop() || "bin").toLowerCase();
    const uploadId = crypto.randomUUID();
    const key = prePayment 
      ? `pre-payment/${uploadId}.${ext}`
      : `uploads/${session_id}/${crypto.randomUUID()}.${ext}`;

    // Initialize Firebase Storage
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set");
      return NextResponse.json({ error: "Firebase configuration missing" }, { status: 500 });
    }

    let serviceAccountKey;
    try {
      // First try to parse as regular JSON
      serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (parseError) {
      // If that fails, try base64 decoding first
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
        serviceAccountKey = JSON.parse(decoded);
      } catch (base64Error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON or base64:", parseError);
        console.error("Key value starts with:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY.substring(0, 50));
        return NextResponse.json({ error: "Invalid Firebase service account configuration" }, { status: 500 });
      }
    }

    const storage = new Storage({
      credentials: serviceAccountKey,
      projectId: serviceAccountKey.project_id
    });
    
    if (!process.env.FIREBASE_STORAGE_BUCKET) {
      console.error("FIREBASE_STORAGE_BUCKET environment variable is not set");
      return NextResponse.json({ error: "Firebase bucket configuration missing" }, { status: 500 });
    }
    
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(key);

    if (content && mime === "text/plain") {
      // Handle pasted content - upload directly
      await file.save(content, {
        metadata: {
          contentType: mime
        }
      });
      return NextResponse.json({ key, bucket: bucketName, uploaded: true, uploadId: prePayment ? uploadId : undefined });
    } else {
      // Handle file upload - return signed URL
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: mime
      });
      return NextResponse.json({ url, key, bucket: bucketName, uploadId: prePayment ? uploadId : undefined });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
} 