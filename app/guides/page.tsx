import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Become a Local Guide & Share Your Expertise | Sick Day Sports Club',
  description: 'Join our network of local guides and adventure groups. Share your expertise, connect with outdoor enthusiasts, and help others discover the best local spots.',
  keywords: 'become a guide, local expertise, adventure groups, outdoor community, guide network, share knowledge, outdoor activities',
}

const GuideRecruitmentWireframe = () => {
  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen font-sans">
      {/* Navigation Bar */}
      <div className="fixed top-0 w-full bg-gray-800/95 backdrop-blur-sm text-white z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-xl hover:text-gray-300 transition duration-150">
              Sick Day Sports Club
            </Link>
            <div className="flex space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition duration-150">How It Works</a>
              <a href="#faqs" className="text-gray-300 hover:text-white transition duration-150">FAQs</a>
              <a href="mailto:guides@sickdaysports.club" className="text-gray-300 hover:text-white transition duration-150">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to account for fixed header */}
      <div className="w-full pt-16">
        {/* Hero Section */}
        <div className="w-full bg-[#2d3748] text-white flex flex-col items-center justify-center text-center relative" style={{height: '400px'}}>
          <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Share Your Expertise. Keep 100% of Your Fees.</h1>
            <p className="text-xl mb-8">
              Join our network of independent guides and help people turn their sick days into unforgettable adventures - with zero commission costs.
            </p>
            <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded">
              Partner With Us
            </button>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="w-full p-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Why Partner With Sick Day Sports Club?</h2>
        
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg w-full md:w-1/3 shadow-md border border-gray-100">
            <div className="text-5xl mb-4 text-green-700">💼</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Multiple Revenue Streams</h3>
            <p className="text-gray-700">
              Get paid for recommendations, integrate Sick Day members into your existing trips, and offer custom experiences - all while keeping your existing business intact. A perfect complementary income source.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg w-full md:w-1/3 shadow-md border border-gray-100">
            <div className="text-5xl mb-4 text-green-700">💰</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Zero Commission</h3>
            <p className="text-gray-700">
              Keep 100% of your fees. We don't take any cut from your earnings - you collect payments directly through your own channels or you can post on our global adventure sharing marketplace for 20% commission split 50/50 with the guests: <a href="http://findadventureguides.com/" className="text-green-700 underline hover:text-green-800">FindAdventureGuides.com</a>.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg w-full md:w-1/3 shadow-md border border-gray-100">
            <div className="text-5xl mb-4 text-green-700">🤝</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Pre-Qualified Clients</h3>
            <p className="text-gray-700">
              We match you with members based on experience levels and preferences. No marketing headaches or customer acquisition costs.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="w-full p-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        
        <div className="flex flex-col md:flex-row justify-between max-w-5xl mx-auto gap-4">
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-gray-600 max-w-xs">
              Sign up and showcase your expertise, certifications, and adventures.
            </p>
          </div>
          
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Set Your Schedule</h3>
            <p className="text-gray-600 max-w-xs">
              Tell us when you're available to lead adventures.
            </p>
          </div>
          
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
            <p className="text-gray-600 max-w-xs">
              We connect you with members who match your expertise.
            </p>
          </div>
          
          <div className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2">Lead & Collect Payment</h3>
            <p className="text-gray-600 max-w-xs">
              Lead adventures and collect your fees through the payment system of your choice.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Testimonials */}
      <div className="w-full p-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Guide Partners Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src="https://d17t27i218htgr.cloudfront.net/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWxqTW1WaE5EYzJaUzA1WW1WbExUUmpOakl0WVdZNFppMDJZamxoWWpBeE9Ua3hPVElHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--8e75b104afcc8391b9841cf0141681b9256c946d/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFLQUJ6QTZDbk5oZG1WeWV3YzZDbk4wY21sd1ZEb01jWFZoYkdsMGVXbGEiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1cca388767d511d8884c9fa9b0eb35c8aea0be6b/Headshot_AW_Saveria.jpg"
                alt="Saveria T."
                className="w-16 h-16 object-cover rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">Saveria T.</h3>
                <p className="text-sm text-gray-500">CEO & Founder, AdventurUs Women, Bend</p>
                <a href="https://www.adventuruswomen.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">adventuruswomen.com</a>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "The REI Adventures shutdown was challenging for our business. Thankfully, Sick Day Sports Club has been helpful and proactive as we work to reconnect with our guests who lost bookings and find new revenue streams to fill the gaps."
            </p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/5cd1d23b0490795c10f11256/1586714284658-724WM8LYF7SPC1N13I70/alps+climbing+guides?format=1000w"
                alt="Mark A."
                className="w-16 h-16 object-cover rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">Mark A.</h3>
                <p className="text-sm text-gray-500">Founder, The Mountain Bureau, Winthrop</p>
                <a href="https://www.mountainbureau.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">mountainbureau.com</a>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Staffing shortages have been brutal for us this winter and added a lot of uncertainty but we've been stoked to partner with Sick Day Sports Club to develop new product formats and marketing channels."
            </p>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="w-full p-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">What We Look For</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Skill</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Relevant certifications for your activity</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Minimum 2+ years experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Deep knowledge of local terrain</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Current first aid certification</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Stoke</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Passion for sharing outdoor experiences</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Excellent communication skills</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Reliable and professional attitude</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-700 mr-2">✓</span>
                <span>Safety-first mindset</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div id="faqs" className="w-full p-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How does the payment system work?</h3>
            <p className="text-gray-600">
              You collect payments directly through your own payment system or list your adventures on <a href="http://findadventureguides.com/" className="text-green-700 underline">FindAdventureGuides.com</a> - a traditional marketplace similar to Airbnb where clients can browse and book directly. With your own payment system, we don't take any commission. If you use FindAdventureGuides.com, there's a 20% commission split 50/50 between you and the guests.
            </p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How often will I lead adventures?</h3>
            <p className="text-gray-600">
              This is entirely up to you! You set your own availability and can accept or decline opportunities.
            </p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What about insurance and liability?</h3>
            <p className="text-gray-600">
              As an independent contractor, you must maintain your own professional liability insurance. We can recommend providers if needed.
            </p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How does Sick Day Sports Club make money?</h3>
            <p className="text-gray-600">
              We operate on a membership model where clients pay us directly for access to our platform. This allows us to connect you with clients without taking any cut of your guide fees.
            </p>
          </div>
        </div>
      </div>

      {/* Application CTA */}
      <div className="w-full p-12 bg-green-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Guide Network?</h2>
          <p className="text-xl mb-8">
            We're currently accepting applications for independent guide partners in several adventure towns across North America.
          </p>
          
          <button className="px-8 py-4 bg-white text-green-700 hover:bg-gray-100 font-semibold rounded-md text-lg">
            Apply to Become a Partner
          </button>
          
          <p className="mt-6 text-sm opacity-80">
            Not ready to apply? Email us at <span className="underline">guides@sickdaysports.club</span> with any questions.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-800 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1 - Brand */}
            <div>
              <Link href="/" className="inline-block">
                <div className="font-bold text-xl mb-2">Sick Day Sports Club</div>
              </Link>
              <p className="text-gray-400 mb-4">Connecting adventurers with the best local guides</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/sickdaysports/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.tiktok.com/@sickdaysports" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
                <a href="https://www.facebook.com/people/Sick-Day-Sports-Club/61564984654733/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2 - For Guides */}
            <div>
              <h3 className="font-semibold mb-2">For Guides</h3>
              <ul className="space-y-1 text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Apply Now</a></li>
                <li><a href="#" className="hover:text-white">Partner Portal</a></li>
              </ul>
            </div>

            {/* Column 3 - About */}
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <ul className="space-y-1 text-gray-400">
                <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
                <li><a href="http://findadventureguides.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">FindAdventureGuides.com</a></li>
              </ul>
            </div>

            {/* Column 4 - Other */}
            <div>
              <h3 className="font-semibold mb-2">Other</h3>
              <ul className="space-y-1 text-gray-400">
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><a href="mailto:info@sickdaysportsclub.com" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © {new Date().getFullYear()} Sick Day Sports Club. All rights reserved. We won't tell your boss. Unless your boss is Yvon – in which case you should probably be surfing right now.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRecruitmentWireframe; 