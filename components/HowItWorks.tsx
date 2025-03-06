import React from 'react';
import Container from './Container';

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50" id="how">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-xl text-gray-700">Optimizing your days off has never been easier</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-[#4a7729] mb-5">1</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Create Your Profile</h3>
            <p className="text-gray-700">Share your adventure preferences including activities, experience level, equipment needs, and availability. Select from solo adventures, guided experiences, or self-guided group activities.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-[#4a7729] mb-5">2</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Get Personalized Recommendations</h3>
            <p className="text-gray-700">Every weekend, we'll offer a menu of adventure options for the week ahead matched to your preferences, skill level, and upcoming conditions. Simply select from your personalized list, book the time and go.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-5xl font-bold text-[#4a7729] mb-5">3</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Enjoy Your Adventure</h3>
            <p className="text-gray-700">If you're headed to a shared adventure, meet your group or guide at the designated spot, send it, then get back to your day. With our focus on mashing up efficiency and epic experiences, you can maximize outdoor time and minimize hassle.</p>
          </div>
        </div>
      </Container>
    </section>
  );
} 