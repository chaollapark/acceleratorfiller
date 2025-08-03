
import React from 'react';
import Link from 'next/link';

const CTA: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
      
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Limited Time Offer
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Ready to save{' '}
            <span className="text-yellow-300">10+ hours</span>?
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Get your application submitted to 20+ accelerators for a flat fee of{' '}
            <span className="text-white font-bold">$50</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link 
              href="/apply" 
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-blue-600 bg-white rounded-full hover-lift transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10">Apply Now for $50</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold text-yellow-300 mb-1">$50</div>
              <div className="text-blue-200 text-sm">One-time fee</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center text-blue-100 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">This is a manual service for a limited time</span>
            </div>
            <p className="text-blue-200 text-sm">
              Automation is coming soon! Get in early while we handle each application personally.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-effect rounded-xl p-6">
              <div className="text-2xl font-bold text-yellow-300 mb-2">20+</div>
              <div className="text-blue-200 text-sm">Accelerators</div>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <div className="text-2xl font-bold text-green-300 mb-2">10hrs</div>
              <div className="text-blue-200 text-sm">Time Saved</div>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <div className="text-2xl font-bold text-purple-300 mb-2">$2M+</div>
              <div className="text-blue-200 text-sm">Funding Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
