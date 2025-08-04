"use client";

import { useEffect, useState } from "react";

const MAX_MB = 15;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function UploadPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("session_id");
    setSessionId(s);
    (async () => {
      if (!s) return setAllowed(false);
      const r = await fetch(`/api/verify-session?session_id=${encodeURIComponent(s)}`);
      const j = await r.json();
      setAllowed(!!j?.paid);
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !file) return;
    if (!ALLOWED.includes(file.type)) return alert("Only PDF or DOC/DOCX are allowed.");
    if (file.size > MAX_MB * 1024 * 1024) return alert(`Max size is ${MAX_MB} MB.`);

    setStatus("Requesting upload URL…");
    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, filename: file.name, mime: file.type })
    });
    if (!res.ok) return setStatus("Upload URL request failed.");
    const { url, key } = await res.json();

    setStatus("Uploading file…");
    const put = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    if (!put.ok) return setStatus("Upload failed.");

    setStatus("Upload received ✅ We'll deliver your 32-accelerator pack in ~3 business days.");
  };

  if (allowed === false) {
    return (
      <main className="container py-16">
        <div className="card max-w-xl mx-auto text-center">
          <h1 className="text-xl font-bold">Payment required</h1>
          <p className="meta">Please complete payment first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Upload your YC application</h1>
        <p className="meta mt-2">PDF or DOC/DOCX, up to {MAX_MB} MB. We delete files after 30 days.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="block w-full text-sm"
          />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required /> I agree to the{" "}
            <a className="underline" href="/legal" target="_blank">Terms & Privacy</a>.
          </label>
          <button className="btn btn-primary" disabled={!allowed || !sessionId}>
            Submit file
          </button>
        </form>

        {status && <p className="meta mt-4">{status}</p>}
      </div>
    </main>
  );
} 