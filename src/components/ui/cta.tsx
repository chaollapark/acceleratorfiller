
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to save 10+ hours?</h2>
        <p className="text-xl mb-8">Get your application submitted to 20+ accelerators for a flat fee of $50.</p>
        <a href="/apply" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Apply Now for $50
        </a>
        <p className="text-sm mt-4">This is a manual service for a limited time. Automation is coming soon!</p>
      </div>
    </section>
  );
};

export default CTA;
