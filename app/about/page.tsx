import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Our Story | Sick Day Sports Club',
  description: 'Learn about our mission to connect adventurers with local guides and make outdoor experiences more accessible.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Add padding to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <div className="w-full bg-[#2d3748] text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-gray-700 mb-8">
              We're a team of technologists and builders. By day, we've traveled the globe scaling big products alongside some of the leading brands in travel, media and sports – but our hearts have always been on the trails, slopes, and waterways where the best adventures happen.
            </p>
            
            <p className="text-xl text-gray-700 mb-8">
              Sick Day Sports Club was born to help our adventure community friends not only find more time for outdoor adventure but also maximize that time - even if it means calling in "sick" once in a while to meet an incredible local guide and go chase a story worth telling.
            </p>
            
            <p className="text-xl text-gray-700 mb-8">
              We believe in the transformative power of adventure guides. A knowledgeable local can turn a routine outing into an unforgettable experience – whether that's finding untouched powder in the backcountry or discovering a hidden viewpoint on a familiar trail. Regardless of your sport or skill level, magic happens when passionate guides share their favorite spots with the right people.
            </p>
            
            <p className="text-xl text-gray-700 mb-8">
              Our mission is to make those connections effortless. We're building technology that celebrates local guides while making it ridiculously easy for you to step away from your desk and into an adventure – even if just for a few hours.
            </p>
            
            <p className="text-xl text-gray-700">
              We're starting small and focused because we believe in building community-first, but we're dreamers with big plans. This is just the beginning of our journey to build the world's first global adventure club and foster many more of the best kinds of sick days. We'd love for you to join us on the journey.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready for Your Next Adventure?</h2>
            <a 
              href="/beta-signup"
              className="inline-block bg-[#4a7729] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#3d6121] transition-colors"
            >
              Join the Beta Program
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 