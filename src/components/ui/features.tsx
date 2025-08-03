
import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="feature">
            <h3 className="text-xl font-bold mb-4">1. Submit Your YC Application</h3>
            <p>Copy and paste your completed YC application into our secure form.</p>
          </div>
          <div className="feature">
            <h3 className="text-xl font-bold mb-4">2. We Handle the Rest</h3>
            <p>Our team manually transcribes your application to over 20 other accelerator forms.</p>
          </div>
          <div className="feature">
            <h3 className="text-xl font-bold mb-4">3. Save Time, Get Funded</h3>
            <p>You save dozens of hours and increase your chances of getting funded.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
