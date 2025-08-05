"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
    setUploadId(params.get("upload_id"));
  }, []);

  return (
    <main className="container py-16">
      <div className="card max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold">Thanks! 🎉</h1>
        {uploadId ? (
          <>
            <p className="meta mt-2">Payment confirmed. We'll process your uploaded application and deliver your 32-accelerator pack in ~3 business days.</p>
            <p className="text-sm text-gray-600 mt-4">
              We'll email you when your accelerator pack is ready.
            </p>
          </>
        ) : (
          <>
            <p className="meta mt-2">Payment confirmed. You can now upload your YC application.</p>
            <a
              className="btn btn-primary mt-6"
              href={`/upload?session_id=${encodeURIComponent(sessionId || "")}`}
            >
              Go to Upload
            </a>
          </>
        )}
      </div>
    </main>
  );
} 