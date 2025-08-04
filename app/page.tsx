"use client";

import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Checkout failed.");
    } catch {
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-16">
      <header className="text-center space-y-4">
        <span className="badge">One application → 32 accelerators</span>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
          Turn your YC-style application into 32 accelerator-ready submissions
        </h1>
        <p className="meta">
          Pay once (<strong>€50</strong>), upload your application, get a package tailored for <strong>32 accelerators together</strong>.
        </p>
      </header>

      <section className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">1) Pay €50</h3>
          <p className="meta">Secure card payment. VAT invoice available.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">2) Upload your YC application</h3>
          <p className="meta">PDF or DOC/DOCX. We delete files after 30 days.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">3) Receive your 32-accelerator pack</h3>
          <p className="meta">Program-specific edits and submission guidance.</p>
        </div>
      </section>

      <div className="text-center mt-10">
        <button
          className="btn btn-primary text-lg px-6 py-3"
          onClick={startCheckout}
          disabled={loading}
          aria-label="Pay €50 to get started"
        >
          {loading ? "Loading…" : "Pay €50 to get started"}
        </button>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold">We prepare materials that fit 32 accelerators</h2>
        <p className="meta">Your package includes program-specific edits and submission checklists for all 32.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mt-4 opacity-80">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card text-center py-6 text-slate-500">Accelerator {i + 1}</div>
          ))}
          {/* Add the full list of 32 here */}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold">FAQs</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="card">
            <p className="font-semibold">Do you submit on my behalf?</p>
            <p className="meta">By default we deliver materials & instructions. Ask if you want submission handling.</p>
          </div>
          <div className="card">
            <p className="font-semibold">Turnaround</p>
            <p className="meta">3 business days, with one round of revisions within 7 days.</p>
          </div>
          <div className="card">
            <p className="font-semibold">Refunds</p>
            <p className="meta">Full refund before we start; proportional refund if we miss the timeline.</p>
          </div>
        </div>
      </section>

      <footer className="text-center mt-16 text-sm text-slate-600">
        <p>
          <strong>Disclaimer:</strong> Not affiliated with Y Combinator (YC) or any accelerator. No admissions are guaranteed.
        </p>
        <p className="mt-2">
          <a className="underline" href="/legal">Terms, Privacy & GDPR</a>
        </p>
      </footer>
    </main>
  );
} 