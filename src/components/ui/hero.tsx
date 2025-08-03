
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">One YC Application, 20 Accelerators, 10 hours saved.</h1>
        <p className="text-xl mb-8">Fill in your YC application once, and we submit your application to 20 accelerators.</p>
        <a href="/apply" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Apply Now
        </a>
      </div>
    </section>
  );
};

export default Hero;
