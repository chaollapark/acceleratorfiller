"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ShitTierBlasterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShitTierBlasterPopup({ isOpen, onClose }: ShitTierBlasterPopupProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleBlastMeNow = () => {
    router.push("/shit-tier-blaster");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-8 text-center animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
        
        {/* Content */}
        <div className="space-y-6">
          <div className="text-3xl font-black text-red-600 animate-pulse">
            💥 NEW: Shit Tier Blaster 💥
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed">
            "Too broke for YC? Too weird for Techstars? We'll shotgun your app to 100+ survival-mode accelerators around the globe. Sure, most are questionable, but all it takes is one yes to keep you alive another 6 months."
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleBlastMeNow}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              🔥 Blast Me Now
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Nah, Bootstrap me to the bed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
