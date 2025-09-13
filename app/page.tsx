"use client";

import { useState, useEffect } from "react";
import ShitTierBlasterPopup from "./components/ShitTierBlasterPopup";
import { useAnalytics } from "./hooks/usePostHog";

const MAX_MB = 15;
const VIDEO_MAX_MB = 100;
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const VIDEO_ALLOWED = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/x-ms-wmv",  // .wmv
  "video/x-flv"      // .flv
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [demoVideo, setDemoVideo] = useState<File | null>(null);
  const [presentationVideo, setPresentationVideo] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [showShitTierPopup, setShowShitTierPopup] = useState(false);

  const { trackPageView } = useAnalytics();

  // Show popup after 10 seconds (only if not previously dismissed)
  useEffect(() => {
    trackPageView('home_page');

    try {
      const hasDismissed = localStorage.getItem('shitTierPopupDismissed');
      if (hasDismissed) return;
    } catch {
      // SSR/paranoid try-catch: localStorage might not exist in bizarre universes
    }

    const timer = setTimeout(() => {
      setShowShitTierPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [trackPageView]);


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
          prePayment: true 
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
          prePayment: true 
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { url, key } = await res.json();

      const put = await fetch(url, { method: "PUT", body: demoVideo, headers: { "Content-Type": demoVideo.type } });
      if (!put.ok) return setStatus("Upload failed.");
      
      // Set as primary if no other primary is set
      if (!primaryUploadId) primaryUploadId = key;
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
          prePayment: true 
        })
      });
      if (!res.ok) return setStatus("Upload failed.");
      const { url, key } = await res.json();

      const put = await fetch(url, { method: "PUT", body: presentationVideo, headers: { "Content-Type": presentationVideo.type } });
      if (!put.ok) return setStatus("Upload failed.");
      
      // Set as primary if no other primary is set
      if (!primaryUploadId) primaryUploadId = key;
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
    setStatus("Upload successful! Now complete payment to get your 32-accelerator pack.");
  };

  if (uploaded) {
    return (
      <main className="container py-16">
        <div className="card max-w-xl mx-auto text-center success-animation">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold gradient-text mb-4">Upload Successful!</h1>
          <p className="meta text-lg mb-8">Your application has been uploaded. Now complete payment to get your 32-accelerator pack.</p>
          
          <div className="mb-6">
            <button
              className="btn btn-primary text-lg px-8 py-4"
              onClick={startCheckoutWithUpload}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="loading">⏳</div>
                  Processing...
                </span>
                              ) : (
                  "Pay €99 to get your accelerator pack"
                )}
            </button>
          </div>
          
          <p className="text-sm text-slate-600">
            We'll deliver your 32-accelerator pack in ~3 business days after payment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      {/* Hero Section */}
      <header className="text-center space-y-6 mb-16">
        <div className="badge text-base px-6 py-3">
          One application → 32+ accelerators
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text">
          Turn your YC-application into 32+ applications.
        </h1>
        <p className="meta text-xl max-w-3xl mx-auto">
          Save <strong className="text-blue-600">15 Hours applying</strong> send <strong className="text-blue-600">32+ accelerators applications</strong>.
        </p>
        
        {/* Product Hunt Badge */}
        <div className="flex justify-center mt-8">
          <a href="https://www.producthunt.com/products/one-application-32-startup-accelerators?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-one&#0045;application&#0045;32&#0045;startup&#0045;accelerators" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1001896&theme=light&t=1754400109440" 
              alt="one&#0032;application&#0045;&#0062;32&#0032;startup&#0032;accelerators - Save&#0032;15&#0032;hours&#0032;applying&#0032;to&#0032;startup&#0032;accelerators | Product Hunt" 
              style={{ width: '250px', height: '54px' }} 
              width="250" 
              height="54" 
            />
          </a>
        </div>
      </header>

      {/* Process Steps */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card group">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-3">1) Upload your YC application</h3>
            <p className="meta">PDF, DOC/DOCX, videos, or paste content. We delete files after 30 days.</p>
          </div>
          <div className="card group">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-3">2) Pay €99</h3>
            <p className="meta">Is 15 hours of your time worth €99?</p>
          </div>
          <div className="card group">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3">3) Receive your 32-accelerator pack</h3>
            <p className="meta">Save 15 hours of applying manually - optimize!</p>
          </div>
        </div>
      </section>

      {/* Upload Form */}
      <div className="mb-16">
        <div className="card max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-4">Upload your YC application</h2>
            <p className="meta text-lg">Upload your application and optional videos first, then pay to get your 32-accelerator pack.</p>
          </div>

          <form className="space-y-8" onSubmit={onSubmit}>
            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">Upload your application file</h3>
              <p className="text-slate-600">PDF or DOC/DOCX, up to {MAX_MB} MB. We delete files after 30 days.</p>
              
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
                      {file ? file.name : "Choose your application file"}
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
              <h3 className="text-xl font-bold text-slate-800">Upload videos (optional)</h3>
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
                        {demoVideo ? `${(demoVideo.size / 1024 / 1024).toFixed(1)} MB` : "Optional"}
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
                        {presentationVideo ? `${(presentationVideo.size / 1024 / 1024).toFixed(1)} MB` : "Optional"}
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
              <h3 className="text-xl font-bold text-slate-800">Paste your application content</h3>
              <p className="text-slate-600">Paste your application content below:</p>
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your YC application content here... Don't forget the founder profile!!!"
                className="enhanced-textarea h-64"
              />
            </div>
            
            {/* Terms and Submit */}
            <div className="space-y-6">
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" required className="enhanced-checkbox mt-1" />
                <span className="text-slate-700">
                  I agree to the{" "}
                  <a className="text-blue-600 hover:text-blue-700 underline font-medium" href="/legal" target="_blank">Terms & Privacy</a>.
                </span>
              </label>
              
              <button type="submit" className="btn btn-primary w-full text-lg py-4">
                Submit application
              </button>
            </div>
          </form>

          {status && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-800 font-medium">{status}</p>
            </div>
          )}
        </div>
      </div>

      {/* Accelerators Section */}
      <section className="mb-16">
        <div className="section-header">
          <h2>We send applications to +32 accelerators</h2>
          <p className="meta">Missing your favorite accelerator? <a href="mailto:madan@acceleratorfiller.xyz" className="text-blue-600 hover:text-blue-700 underline">Let us know</a> and we'll add it.</p>
        </div>
        
        <div className="accelerator-grid">
          {[
            { name: "Y Combinator", logo: "/logos/ycombinator.com.png" },
            { name: "Techstars", logo: "/logos/techstars.com.png" },
            { name: "500 Startups", logo: "/logos/500.co.png" },
            { name: "Seedcamp", logo: "/logos/seedcamp.com.png" },
            { name: "Antler", logo: "/logos/antler.co.png" },
            { name: "Entrepreneur First", logo: "/logos/joinef.com.png" },
            { name: "Andreessen Horowitz", logo: "/logos/a16z.com.png" },
            { name: "Accel", logo: "/logos/accel.com.png" },
            { name: "Greylock", logo: "/logos/greylock.com.png" },
            { name: "Sequoia", logo: "/logos/sequoia.com.png" },
            { name: "Boost VC", logo: "/logos/boost.vc.png" },
            { name: "Betaworks", logo: "/logos/betaworks.com.png" },
            { name: "AngelPad", logo: "/logos/angelpad.org.png" },
            { name: "Pear VC", logo: "/logos/pear.vc.png" },
            { name: "NEO", logo: "/logos/neo.com.png" },
            { name: "Launch", logo: "/logos/launch.co.png" },
            { name: "Pioneer", logo: "/logos/pioneer.app.png" },
            { name: "South Park Commons", logo: "/logos/southparkcommons.com.png" },
            { name: "Soma Capital", logo: "/logos/somacap.com.png" },
            { name: "SkyDeck", logo: "/logos/skydeck.berkeley.edu.png" },
            { name: "Startup Wise Guys", logo: "/logos/startupwiseguys.com.png" },
            { name: "Google for Startups", logo: "/logos/startup.google.com.png" },
            { name: "HF0", logo: "/logos/hf0.com.png" },
            { name: "Conviction", logo: "/logos/conviction.com.png" },
            { name: "BTV", logo: "/logos/btv.vc.png" },
            { name: "APX", logo: "/logos/apx.vc.png" },
            { name: "Afore", logo: "/logos/afore.vc.png" },
            { name: "OpenAI", logo: "/logos/openai.com.png" }
          ].map((accelerator, i) => (
            <div key={i} className="accelerator-item">
              <div className="w-10 h-10 mx-auto mb-3">
                <img 
                  src={accelerator.logo} 
                  alt={accelerator.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
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

      {/* FAQs Section */}
      <section className="mb-16">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-2xl mb-3">🤝</div>
            <p className="font-bold text-lg mb-2">Do you submit on my behalf?</p>
            <p className="meta">Yes. We'll send you a link to your application after payment. If it doesn't work, we'll resend it.</p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">⚡</div>
            <p className="font-bold text-lg mb-2">Turnaround</p>
            <p className="meta">3 business days max, usually instantly</p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">💰</div>
            <p className="font-bold text-lg mb-2">Refunds</p>
            <p className="meta">Full refund before we start; proportional refund if we miss the timeline.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-600 space-y-2">
        <p>
          <strong>Disclaimer:</strong> Not affiliated with Y Combinator (YC) or any accelerator. No admissions are guaranteed.
        </p>
        <p>
          <a className="text-blue-600 hover:text-blue-700 underline" href="/legal">Terms, Privacy & GDPR</a>
        </p>
      </footer>

      {/* Shit Tier Blaster Popup */}
      <ShitTierBlasterPopup
        isOpen={showShitTierPopup}
        onClose={() => {
          setShowShitTierPopup(false);
          try {
            localStorage.setItem('shitTierPopupDismissed', 'true');
          } catch {}
        }}
      />
    </main>
  );
} 