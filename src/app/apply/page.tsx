'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const ApplyPage: React.FC = () => {
  const [formData, setFormData] = React.useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Save application to DB
    const response = await fetch('/api/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      // Stripe checkout
      const stripe = await stripePromise;
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });
      const session = await response.json();
      const result = await stripe?.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result?.error) {
        alert(result.error.message);
      }
    } else {
      alert('There was an error saving your application.');
    }
  };

  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-8">YC Application Form</h1>
      <p className="mb-8">Please fill out the form below with your YC application answers. We will use this information to apply to the other accelerators on your behalf.</p>
      <form>
        <div className="mb-4">
          <label htmlFor="company_name" className="block text-gray-700 font-bold mb-2">Company Name</label>
          <input type="text" id="company_name" name="company_name" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="company_url" className="block text-gray-700 font-bold mb-2">Company URL</label>
          <input type="text" id="company_url" name="company_url" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="company_description" className="block text-gray-700 font-bold mb-2">Describe what your company is going to make in 50 characters or less.</label>
          <input type="text" id="company_description" name="company_description" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="founder_video" className="block text-gray-700 font-bold mb-2">Please provide a link to a 1-minute unlisted (not private) YouTube video introducing the founder(s).</label>
          <input type="text" id="founder_video" name="founder_video" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="progress" className="block text-gray-700 font-bold mb-2">How far along are you?</label>
          <textarea id="progress" name="progress" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="idea" className="block text-gray-700 font-bold mb-2">What is your idea?</label>
          <textarea id="idea" name="idea" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="users" className="block text-gray-700 font-bold mb-2">How do you know people need what you're making?</label>
          <textarea id="users" name="users" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="competitors" className="block text-gray-700 font-bold mb-2">Who are your competitors and who do you fear the most?</label>
          <textarea id="competitors" name="competitors" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="advantage" className="block text-gray-700 font-bold mb-2">What do you understand about your business that other companies in it just don't get?</label>
          <textarea id="advantage" name="advantage" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="revenue" className="block text-gray-700 font-bold mb-2">How will you make money?</label>
          <textarea id="revenue" name="revenue" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <button type="submit" onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Pay with Stripe
        </button>
      </form>
    </div>
  );
};

export default ApplyPage;