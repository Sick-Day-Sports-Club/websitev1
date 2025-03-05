'use client';

import React from 'react';
import { useState, useEffect } from 'react';

interface CookieConsentProps {}

const CookieConsent: React.FC<CookieConsentProps> = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 shadow-lg backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-700 text-sm">
          We use cookies to analyze site traffic and optimize your experience. By accepting, you agree to our use of cookies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-[#4a7729] text-white text-sm font-semibold rounded-md hover:bg-[#3d6222] transition-colors"
          >
            Accept
          </button>
          <a
            href="/privacy-policy"
            className="px-4 py-2 text-gray-600 text-sm font-semibold hover:text-gray-900 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 