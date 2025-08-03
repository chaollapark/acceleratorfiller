
import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            One YC Application,{' '}
            <span className="text-gradient">20 Accelerators</span>,{' '}
            <span className="text-yellow-300">10 hours saved</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Fill in your YC application once, and we submit your application to 20+ top accelerators worldwide. 
            Save time, increase your chances, and focus on building your startup.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/apply" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover-lift transition-all duration-300 hover:bg-white/30 hover:scale-105"
            >
              <span className="relative z-10">Apply Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border border-white/30 rounded-full hover-lift transition-all duration-300 hover:bg-white/10">
              <span>Learn More</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="text-3xl font-bold text-yellow-300 mb-2">20+</div>
              <div className="text-gray-300">Top Accelerators</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="text-3xl font-bold text-green-300 mb-2">10hrs</div>
              <div className="text-gray-300">Time Saved</div>
            </div>
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="text-3xl font-bold text-blue-300 mb-2">$2M+</div>
              <div className="text-gray-300">Total Funding Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
