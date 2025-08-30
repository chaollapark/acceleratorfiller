"use client";

import { useState } from "react";
import Link from "next/link";

const MAX_MB = 15;
const VIDEO_MAX_MB = 100;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const VIDEO_ALLOWED = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/flv",
  "video/webm"
];

export default function ShitTierBlasterPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [demoVideo, setDemoVideo] = useState<File | null>(null);
  const [presentationVideo, setPresentationVideo] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);

  const startShitTierCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          shitTier: true,
          price: 69
        })
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

  const startShitTierCheckoutWithUpload = async () => {
    if (!uploadId) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          uploadId,
          shitTier: true,
          price: 69
        })
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
    if (!file && !pastedContent.trim() && !demoVideo && !presentationVideo) {
      return alert("Please upload a file, paste your application content, or upload videos.");
    }

    let primaryUploadId: string | null = null;

    // Handle application file upload if provided
    if (file) {
      if (!ALLOWED.includes(file.type)) return alert("Only PDF or DOC/DOCX are allowed for application files.");
      if (file.size > MAX_MB * 1024 * 1024) return alert(`Max size is ${MAX_MB} MB for application files.`);

      setStatus("Uploading application file…");
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: file.name, 
          mime: file.type,
          prePayment: true,
          shitTier: true
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { url, key } = await res.json();

      const put = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!put.ok) return setStatus("Upload failed.");
      
      primaryUploadId = key;
    }

    // Handle demo video upload if provided
    if (demoVideo) {
      if (!VIDEO_ALLOWED.includes(demoVideo.type)) return alert("Only MP4, MOV, AVI, WMV, FLV, or WebM are allowed for videos.");
      if (demoVideo.size > VIDEO_MAX_MB * 1024 * 1024) return alert(`Max size is ${VIDEO_MAX_MB} MB for videos.`);

      setStatus("Uploading demo video…");
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: `demo_${demoVideo.name}`, 
          mime: demoVideo.type,
          prePayment: true,
          shitTier: true
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { url, key } = await res.json();

      const put = await fetch(url, { method: "PUT", body: demoVideo, headers: { "Content-Type": demoVideo.type } });
      if (!put.ok) return setStatus("Upload failed.");
    }

    // Handle presentation video upload if provided
    if (presentationVideo) {
      if (!VIDEO_ALLOWED.includes(presentationVideo.type)) return alert("Only MP4, MOV, AVI, WMV, FLV, or WebM are allowed for videos.");
      if (presentationVideo.size > VIDEO_MAX_MB * 1024 * 1024) return alert(`Max size is ${VIDEO_MAX_MB} MB for videos.`);

      setStatus("Uploading presentation video…");
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filename: `presentation_${presentationVideo.name}`, 
          mime: presentationVideo.type,
          prePayment: true,
          shitTier: true
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { url, key } = await res.json();

      const put = await fetch(url, { method: "PUT", body: presentationVideo, headers: { "Content-Type": presentationVideo.type } });
      if (!put.ok) return setStatus("Upload failed.");
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
          prePayment: true,
          shitTier: true
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { key } = await res.json();
      
      // If no file was uploaded, use the text content as primary upload
      if (!primaryUploadId) {
        primaryUploadId = key;
      }
    }

    // Set the primary upload ID (file takes precedence over text)
    if (primaryUploadId) {
      setUploadId(primaryUploadId);
    }

    setUploaded(true);
    setStatus("Upload successful! Now complete payment to get blasted to 100+ survival-mode accelerators.");
  };

  if (uploaded) {
    return (
      <main className="container py-16">
        <div className="card max-w-xl mx-auto text-center success-animation">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Ready to Get Blasted!</h1>
          <p className="meta text-lg mb-8">Your application has been uploaded. Now complete payment to get shotgunned to 100+ survival-mode accelerators.</p>
          
          <div className="mb-6">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200"
              onClick={startShitTierCheckoutWithUpload}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="loading">⏳</div>
                  Processing...
                </span>
              ) : (
                "Pay €69 to get blasted 💥"
              )}
            </button>
          </div>
          
          <p className="text-sm text-slate-600">
            We'll blast your app to 100+ questionable accelerators in ~3 business days after payment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      {/* Top Navigation */}
      <div className="text-center mb-8">
        <Link href="/" aria-label="Back to landing" className="inline-block">
          <div className="text-6xl animate-bounce hover:scale-110 transition-transform">💥</div>
        </Link>
      </div>
      
      {/* Hero Section */}
      <header className="text-center space-y-6 mb-16">
        <div className="badge text-base px-6 py-3 bg-red-100 text-red-800 border-red-200">
          Shit Tier Blaster - €69 Special
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-red-600">
          Got Rejected? We Got You.
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-700">
          We'll <strong className="text-red-600">shotgun your app to 100+ survival-mode accelerators</strong> around the globe. Sure, most are questionable, but all it takes is <strong className="text-red-600">one yes to keep you alive another 6 months</strong>.
        </p>
      </header>

      {/* Process Steps */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card group border-red-200">
            <div className="text-3xl mb-4">💸</div>
            <h3 className="text-xl font-bold mb-3 text-red-600">1) Upload your desperate pitch</h3>
            <p className="meta">PDF, DOC/DOCX, videos, or paste content. We'll make it work somehow.</p>
          </div>
          <div className="card group border-red-200">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-3 text-red-600">2) Pay €69 (30% off!)</h3>
            <p className="meta">Cheaper than ramen for a month. What do you have to lose?</p>
          </div>
          <div className="card group border-red-200">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3 text-red-600">3) Get blasted everywhere</h3>
            <p className="meta">100+ accelerators that probably exist. Quantity over quality!</p>
          </div>
        </div>
      </section>

      {/* Upload Form */}
      <div className="mb-16">
        <div className="card max-w-4xl mx-auto border-red-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Upload your desperate application</h2>
            <p className="meta text-lg">Upload your application and optional videos first, then pay €69 to get blasted to 100+ questionable accelerators.</p>
          </div>

          <form className="space-y-8" onSubmit={onSubmit}>
            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Upload your application file</h3>
              <p className="text-slate-600">PDF or DOC/DOCX, up to {MAX_MB} MB. We delete files after 30 days (if we remember).</p>
              
              <div className="file-upload">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  id="application-file"
                />
                <label htmlFor="application-file" className="file-upload-label">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📁</div>
                    <div className="font-semibold text-slate-700">
                      {file ? file.name : "Choose your desperate pitch"}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "PDF, DOC, or DOCX up to 15MB"}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Video Upload Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Upload videos (optional but recommended)</h3>
              <p className="text-slate-600">Upload your demo video and/or presentation video. MP4, MOV, AVI, WMV, FLV, or WebM, up to {VIDEO_MAX_MB} MB each.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".mp4,.mov,.avi,.wmv,.flv,.webm"
                    onChange={(e) => setDemoVideo(e.target.files?.[0] || null)}
                    id="demo-video"
                  />
                  <label htmlFor="demo-video" className="file-upload-label">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎬</div>
                      <div className="font-semibold text-slate-700">
                        {demoVideo ? demoVideo.name : "Demo Video"}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        {demoVideo ? `${(demoVideo.size / 1024 / 1024).toFixed(1)} MB` : "Show them what you got"}
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".mp4,.mov,.avi,.wmv,.flv,.webm"
                    onChange={(e) => setPresentationVideo(e.target.files?.[0] || null)}
                    id="presentation-video"
                  />
                  <label htmlFor="presentation-video" className="file-upload-label">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎥</div>
                      <div className="font-semibold text-slate-700">
                        {presentationVideo ? presentationVideo.name : "Presentation Video"}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        {presentationVideo ? `${(presentationVideo.size / 1024 / 1024).toFixed(1)} MB` : "Pitch like your life depends on it"}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">OR</span>
              </div>
            </div>

            {/* Paste Content Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Paste your desperate plea</h3>
              <p className="text-slate-600">Paste your application content below:</p>
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your desperate startup pitch here... Include everything - your dreams, your fears, your bank balance..."
                className="enhanced-textarea h-64"
              />
            </div>
            
            {/* Terms and Submit */}
            <div className="space-y-6">
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" required className="enhanced-checkbox mt-1" />
                <span className="text-slate-700">
                  I agree to the{" "}
                  <a className="text-red-600 hover:text-red-700 underline font-medium" href="/legal" target="_blank">Terms & Privacy</a> and understand this is a questionable decision.
                </span>
              </label>
              
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold w-full text-lg py-4 rounded-lg transition-colors duration-200">
                💥 Submit for Shit Tier Blasting
              </button>
            </div>
          </form>

          {status && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">{status}</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning Section */}
      <section className="mb-16">
        <div className="card max-w-4xl mx-auto bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <div className="text-3xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Fair Warning</h2>
            <p className="text-yellow-700 leading-relaxed">
              We're sending your application to 100+ shit tier accelerators (we'll also send it to normal accelerators), may or may not be legitimate, and may or may not respond. Some might be run out of someone's garage. Others might be pyramid schemes. But hey, you're desperate, right? At least one of them might say yes and keep you alive for another 6 months.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-600 space-y-2">
        <p>
          <strong>Disclaimer:</strong> Not affiliated with any legitimate accelerator. No admissions are guaranteed. Most accelerators in this list are questionable at best.
        </p>
        <p className="space-x-4">
          <a className="text-red-600 hover:text-red-700 underline" href="/">Back to Normal Service</a>
          <span>•</span>
          <a className="text-red-600 hover:text-red-700 underline" href="/legal">Terms, Privacy & GDPR</a>
        </p>
      </footer>
    </main>
  );
}
