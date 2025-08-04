# Apply to 32 Accelerators — Modern Next.js App

Pay **€50**, upload your YC-style application, receive materials adapted for **32 accelerators together**.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Stripe Checkout** (fixed €50)
- **Google Cloud Storage** signed URLs (compatible with Firebase Storage buckets)
- EU-friendly wording & GDPR stub

## Run locally
```bash
cp env.example .env
# Set STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL, GCS_BUCKET, GOOGLE_APPLICATION_CREDENTIALS
npm install
npm run dev
# Open http://localhost:3000
```

## Notes
- Use an EU region bucket (e.g., eu, europe-west1, or Firebase Storage EU).
- Add a lifecycle rule to auto-delete uploads/ after 30 days.
- For production, add Stripe webhooks + metadata persistence if needed. 