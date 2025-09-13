"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const accelerators = [
  { name: "Conviction", displayName: "Conviction", logo: "/logos/conviction.com.png" },
  { name: "Andreessen Horowitz", displayName: "a16z", logo: "/logos/a16z.com.png" },
  { name: "Accel", displayName: "Accel", logo: "/logos/accel.com.png" },
  { name: "Sequoia", displayName: "Sequoia", logo: "/logos/sequoia.com.png" },
  { name: "500", displayName: "500", logo: "/logos/500.co.png" },
];

type Status = "pending" | "sending" | "success" | "error";

const FreeTrialAnimation = () => {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    accelerators.reduce((acc, curr) => ({ ...acc, [curr.name]: "pending" }), {})
  );
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const randomErrorIndex = Math.floor(Math.random() * accelerators.length);
    setErrorIndex(randomErrorIndex);

    const animate = async () => {
      // Process each accelerator sequentially
      for (let i = 0; i < accelerators.length; i++) {
        setCurrentIndex(i);
        
        // Set to sending state
        setStatuses((prev) => ({
          ...prev,
          [accelerators[i].name]: "sending",
        }));
        
        // Wait for sending animation (1-2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Set final state (error for one random accelerator, success for others)
        if (i === randomErrorIndex) {
          setStatuses((prev) => ({ 
            ...prev, 
            [accelerators[i].name]: "error" 
          }));
        } else {
          setStatuses((prev) => ({
            ...prev,
            [accelerators[i].name]: "success",
          }));
        }
        
        // Brief pause before next accelerator
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      
      setCurrentIndex(-1);
      setIsComplete(true);
    };

    // Start animation after brief delay
    const timer = setTimeout(animate, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = async (name: string) => {
    setStatuses((prev) => ({ ...prev, [name]: "sending" }));
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatuses((prev) => ({ ...prev, [name]: "success" }));
  };

  const getStatusIcon = (status: Status, name: string, index: number) => {
    switch (status) {
      case "sending":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Sending...</span>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm font-medium">Sent</span>
          </div>
        );
      case "error":
        return (
          <button 
            onClick={() => handleRetry(name)} 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-white text-xs">✗</span>
            </div>
            <span className="text-sm font-medium underline">Retry</span>
          </button>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
            <span className="text-sm">Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isComplete ? "Demo Complete!" : "Sending Applications..."}
        </h2>
        <p className="text-gray-600">
          {isComplete 
            ? "This is what the full version does with 32+ accelerators!" 
            : "Watch as we submit to top accelerators"
          }
        </p>
      </div>
      
      <div className="space-y-3">
        {accelerators.map((accelerator, index) => (
          <div
            key={accelerator.name}
            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
              currentIndex === index 
                ? 'border-blue-300 bg-blue-50 shadow-md scale-105' 
                : statuses[accelerator.name] === 'success'
                ? 'border-green-200 bg-green-50'
                : statuses[accelerator.name] === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm">
                <Image
                  src={accelerator.logo}
                  alt={accelerator.displayName}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to initials if logo fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 font-bold text-sm">
                  {accelerator.displayName.charAt(0)}
                </div>
              </div>
              <span className="font-semibold text-gray-900">{accelerator.displayName}</span>
            </div>
            <div>{getStatusIcon(statuses[accelerator.name], accelerator.name, index)}</div>
          </div>
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <p className="text-center text-sm text-gray-700">
              <strong>You just saved 1 hour!</strong> This is what happens with all 32+ accelerators in the full version.
            </p>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Ready to reach 32+ accelerators?</h3>
            <p className="text-sm text-gray-600">Save 15+ hours of manual applications.</p>
            <button 
              onClick={() => {
                // Close the trial modal and trigger payment flow
                const closeButton = document.querySelector('[data-close-trial]') as HTMLButtonElement;
                closeButton?.click();
                
                // Small delay to ensure modal closes, then trigger payment
                setTimeout(() => {
                  const event = new CustomEvent('triggerPayment');
                  window.dispatchEvent(event);
                }, 100);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Full Access - €99
            </button>
            <p className="text-xs text-gray-500">
              ✓ 32+ accelerator applications ✓ Improve your fundraising odds ✓ Full refund if unsatisfied
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeTrialAnimation;
