"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  return (
    <main className="container py-16">
      <div className="card max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold">Thanks! 🎉</h1>
        <p className="meta mt-2">Payment confirmed. You can now upload your YC application.</p>
        <a
          className="btn btn-primary mt-6"
          href={`/upload?session_id=${encodeURIComponent(sessionId || "")}`}
        >
          Go to Upload
        </a>
      </div>
    </main>
  );
} 