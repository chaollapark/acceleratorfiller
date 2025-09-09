"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "../hooks/usePostHog";

const MAX_MB = 15;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function UploadPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "paste">("file");
  const [status, setStatus] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { trackPageView, trackButtonClick, trackFormSubmit, trackFileUpload, trackCheckoutStart } = useAnalytics();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("session_id");
    setSessionId(s);
    
    trackPageView('upload_page', { has_session_id: !!s });
  }, [trackPageView]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    trackFormSubmit('upload_page_form', {
      upload_method: uploadMethod,
      has_session_id: !!sessionId
    });
    
    if (uploadMethod === "file") {
      if (!file) return;
      if (!ALLOWED.includes(file.type)) return alert("Only PDF or DOC/DOCX are allowed.");
      if (file.size > MAX_MB * 1024 * 1024) return alert(`Max size is ${MAX_MB} MB.`);

      trackFileUpload(file.type, file.size, file.name);
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
    } else {
      if (!pastedContent.trim()) return alert("Please paste your application content.");
      
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

  const startCheckout = async () => {
    if (!uploadId) return;
    
    trackCheckoutStart('premium', 99, true);
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

  if (uploaded) {
    return (
      <main className="container py-16">
        <div className="card max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-green-600">✅ Upload Successful!</h1>
          <p className="meta mt-2">Your application has been uploaded. Now complete payment to get your 32-accelerator pack.</p>
          
          <div className="mt-6">
            <button
              className="btn btn-primary text-lg px-6 py-3"
              onClick={() => {
                trackButtonClick('upload_page_pay_button', { price: 99, tier: 'premium' });
                startCheckout();
              }}
              disabled={loading}
            >
              {loading ? "Loading…" : "Pay €99 to get your accelerator pack"}
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
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Upload your YC application</h1>
        <p className="meta mt-2">Upload your application first, then pay to get your 32-accelerator pack.</p>

        <div className="mt-6 mb-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="uploadMethod"
                value="file"
                checked={uploadMethod === "file"}
                onChange={(e) => setUploadMethod(e.target.value as "file" | "paste")}
              />
              Upload file
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="uploadMethod"
                value="paste"
                checked={uploadMethod === "paste"}
                onChange={(e) => setUploadMethod(e.target.value as "file" | "paste")}
              />
              Paste content
            </label>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {uploadMethod === "file" ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">PDF or DOC/DOCX, up to {MAX_MB} MB. We delete files after 30 days.</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required={uploadMethod === "file"}
                className="block w-full text-sm"
              />
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">Paste your application content below:</p>
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your YC application content here..."
                required={uploadMethod === "paste"}
                className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required /> I agree to the{" "}
            <a 
              className="underline" 
              href="/legal" 
              target="_blank"
              onClick={() => trackButtonClick('legal_link', { source: 'upload_page' })}
            >
              Terms & Privacy
            </a>.
          </label>
          <button className="btn btn-primary">
            Upload {uploadMethod === "file" ? "file" : "content"}
          </button>
        </form>

        {status && <p className="meta mt-4">{status}</p>}
      </div>
    </main>
  );
} 