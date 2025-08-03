# Accelerator Filler

A Next.js application for managing accelerator applications.

## Environment Variables

The following environment variables are required for deployment:

### MongoDB
- `MONGODB_URI` - Your MongoDB connection string

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (client-side)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (server-side)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Make sure to set the required environment variables in your deployment platform (Vercel, Netlify, etc.).

### Vercel Deployment

1. Connect your repository to Vercel
2. Add the environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
3. Deploy

## Features

- YC-style application form
- Stripe payment integration
- MongoDB data storage
- Modern Next.js 14 with App Router 