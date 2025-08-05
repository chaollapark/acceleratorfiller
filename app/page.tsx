"use client";

import { useState } from "react";

const MAX_MB = 15;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);

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

  const startCheckoutWithUpload = async () => {
    if (!uploadId) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId })
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Checkout failed.");
    } catch {
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user provided either file or content
    if (!file && !pastedContent.trim()) {
      return alert("Please upload a file or paste your application content.");
    }

    // Handle file upload if provided
    if (file) {
      if (!ALLOWED.includes(file.type)) return alert("Only PDF or DOC/DOCX are allowed.");
      if (file.size > MAX_MB * 1024 * 1024) return alert(`Max size is ${MAX_MB} MB.`);

      setStatus("Uploading file…");
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: file.name, 
          mime: file.type,
          prePayment: true 
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { url, key } = await res.json();

      const put = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!put.ok) return setStatus("Upload failed.");
      
      setUploadId(key);
    }

    // Handle pasted content if provided
    if (pastedContent.trim()) {
      setStatus("Uploading pasted content…");
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: "application.txt", 
          mime: "text/plain",
          content: pastedContent,
          prePayment: true 
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { key } = await res.json();
      setUploadId(key);
    }

    setUploaded(true);
    setStatus("Upload successful! Now complete payment to get your 32-accelerator pack.");
  };

  if (uploaded) {
    return (
      <main className="container py-16">
        <div className="card max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-green-600">✅ Upload Successful!</h1>
          <p className="meta mt-2">Your application has been uploaded. Now complete payment to get your 32-accelerator pack.</p>
          
          <div className="mt-6">
            <button
              className="btn btn-primary text-lg px-6 py-3"
              onClick={startCheckoutWithUpload}
              disabled={loading}
            >
              {loading ? "Loading…" : "Pay €50 to get your accelerator pack"}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            We'll deliver your 32-accelerator pack in ~3 business days after payment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <header className="text-center space-y-4">
        <span className="badge">One application → 32+ accelerators</span>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900">
          Turn your YC-application into 32+ applications.
        </h1>
        <p className="meta">
          Save <strong>15 Hours applying</strong> send <strong>32+ accelerators applications</strong>.
        </p>
      </header>

      <section className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">1) Upload your YC application</h3>
          <p className="meta">PDF, DOC/DOCX, or paste content. We delete files after 30 days.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">2) Pay €50</h3>
          <p className="meta">Is 15 hours of your time worth €50?</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">3) Receive your 32-accelerator pack</h3>
          <p className="meta">Save 15 hours of applying manually - optimize!</p>
        </div>
      </section>

      <div className="mt-10">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-xl font-bold">Upload your YC application</h2>
          <p className="meta mt-2">Upload your application first, then pay to get your 32-accelerator pack.</p>

          <form className="mt-6 space-y-6" onSubmit={onSubmit}>
            {/* File Upload Section */}
            <div>
              <h3 className="font-semibold mb-2">Upload a file</h3>
              <p className="text-sm text-slate-800 font-medium mb-2">PDF or DOC/DOCX, up to {MAX_MB} MB. We delete files after 30 days.</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-700 font-medium">OR</span>
              </div>
            </div>

            {/* Paste Content Section */}
            <div>
              <h3 className="font-semibold mb-2">Paste your application content</h3>
              <p className="text-sm text-slate-800 font-medium mb-2">Paste your application content below:</p>
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your YC application content here... Don't forget the founder profile!!!"
                className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" required /> I agree to the{" "}
              <a className="underline" href="/legal" target="_blank">Terms & Privacy</a>.
            </label>
            <button type="submit" className="btn btn-primary">
              Submit application
            </button>
          </form>

          {status && <p className="meta mt-4">{status}</p>}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold">We send applications to 32+ accelerators</h2>
        <p className="meta">Missing your favorite accelerator? <a href="mailto:madan@acceleratorfiller.xyz">Let us know</a> and we'll add it.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 mt-4 opacity-80">
          {[
            { name: "Y Combinator", logo: "/logos/yc.png" },
            { name: "Techstars", logo: "/logos/techstars.png" },
            { name: "500 Startups", logo: "/logos/500startups.png" },
            { name: "Plug and Play", logo: "/logos/plugandplay.png" },
            { name: "MassChallenge", logo: "/logos/masschallenge.png" },
            { name: "Startupbootcamp", logo: "/logos/startupbootcamp.png" },
            { name: "Seedcamp", logo: "/logos/seedcamp.png" },
            { name: "Founders Factory", logo: "/logos/foundersfactory.png" },
            { name: "Antler", logo: "/logos/antler.png" },
            { name: "Entrepreneur First", logo: "/logos/ef.png" },
            { name: "Station F", logo: "/logos/stationf.png" },
            { name: "Founders Institute", logo: "/logos/foundersinstitute.png" },
            { name: "StartX", logo: "/logos/startx.png" },
            { name: "Alchemist", logo: "/logos/alchemist.png" },
            { name: "Dreamit", logo: "/logos/dreamit.png" },
            { name: "Launchpad LA", logo: "/logos/launchpadla.png" },
            { name: "MuckerLab", logo: "/logos/muckerlab.png" },
            { name: "Amplify.LA", logo: "/logos/amplifyla.png" },
            { name: "Boost VC", logo: "/logos/boostvc.png" },
            { name: "IndieBio", logo: "/logos/indiebio.png" },
            { name: "Y Combinator", logo: "/logos/yc.png" },
            { name: "Techstars", logo: "/logos/techstars.png" },
            { name: "500 Startups", logo: "/logos/500startups.png" },
            { name: "Plug and Play", logo: "/logos/plugandplay.png" },
            { name: "MassChallenge", logo: "/logos/masschallenge.png" },
            { name: "Startupbootcamp", logo: "/logos/startupbootcamp.png" },
            { name: "Seedcamp", logo: "/logos/seedcamp.png" },
            { name: "Founders Factory", logo: "/logos/foundersfactory.png" },
            { name: "Antler", logo: "/logos/antler.png" },
            { name: "Entrepreneur First", logo: "/logos/ef.png" },
            { name: "Station F", logo: "/logos/stationf.png" },
            { name: "Founders Institute", logo: "/logos/foundersinstitute.png" },
            { name: "StartX", logo: "/logos/startx.png" },
            { name: "Alchemist", logo: "/logos/alchemist.png" },
            { name: "Dreamit", logo: "/logos/dreamit.png" },
            { name: "Launchpad LA", logo: "/logos/launchpadla.png" },
            { name: "MuckerLab", logo: "/logos/muckerlab.png" },
            { name: "Amplify.LA", logo: "/logos/amplifyla.png" },
            { name: "Boost VC", logo: "/logos/boostvc.png" },
            { name: "IndieBio", logo: "/logos/indiebio.png" }
          ].map((accelerator, i) => (
            <div key={i} className="card text-center py-4 px-2 text-slate-500 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 mx-auto mb-2">
                <img 
                  src={accelerator.logo} 
                  alt={accelerator.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-xs font-medium">{accelerator.name}</span>
              </div>
              <div className="text-xs font-medium">{accelerator.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-bold">FAQs</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="card">
            <p className="font-semibold">Do you submit on my behalf?</p>
            <p className="meta">Yes. We'll send you a link to your application after payment. If it doesn't work, we'll resend it.</p>
          </div>
          <div className="card">
            <p className="font-semibold">Turnaround</p>
            <p className="meta">3 business days max, usually instantly</p>
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