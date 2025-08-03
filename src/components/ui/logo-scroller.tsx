'use client';

import React from 'react';
import logos from '@/data/logos.json';

const LogoScroller: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Partner Accelerators
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We submit your application to these top accelerators worldwide
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
          
          <div className="flex animate-scroll space-x-16">
            {/* Duplicate logos for seamless loop */}
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex-shrink-0 group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover-lift min-w-[200px]">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img 
                      src={logo.logo} 
                      alt={logo.name} 
                      className="max-h-12 max-w-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {logo.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {logo.funding}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoScroller;
