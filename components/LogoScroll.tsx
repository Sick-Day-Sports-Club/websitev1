'use client';

import React, { useState, useEffect } from 'react';

const LogoScroll = () => {
  const logos = [
    {
      name: "AdventurUs Women",
      url: "https://www.adventuruswomen.com/",
      image: "/images/partner-logos/adventurus-women.png"
    },
    {
      name: "The Mountain Bureau",
      url: "https://www.mountainbureau.com/",
      image: "/images/partner-logos/mountain-bureau.png",
      darkMode: true
    },
    {
      name: "AW Expeditions",
      url: "https://awexpeditions.org/",
      image: "/images/partner-logos/awexpeditions.png",
      darkMode: true
    },
    {
      name: "Big Backyard Adventures",
      url: "https://www.bigbackyardadventures.com/",
      image: "/images/partner-logos/big-backyard.png"
    },
    {
      name: "Bitterroot Backpacking",
      url: "https://bitterrootbackpacking.com/",
      image: "/images/partner-logos/bitter-root.png"
    },
    {
      name: "Casaval Physical Therapy",
      url: "https://www.casavalpt.com/",
      image: "/images/partner-logos/casaval.png"
    },
    {
      name: "Dreamland Tours",
      url: "https://dreamlandtours.net/",
      image: "/images/partner-logos/dreamland.png"
    },
    {
      name: "Saveur The Journey",
      url: "https://www.saveurthejourney.com/",
      image: "/images/partner-logos/saveur-journey.png"
    },
    {
      name: "Trillium Alpine Guides",
      url: "https://www.trilliumalpineguides.com/",
      image: "/images/partner-logos/trillium-guides.png"
    },
    {
      name: "Brave Endeavors",
      url: "https://www.bravendeavors.com/",
      image: "/images/partner-logos/brave-endeavors.png"
    }
  ];

  const [visibleLogos, setVisibleLogos] = useState(logos.slice(0, 6));
  const [transitioningIndex, setTransitioningIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Only proceed if no transition is in progress
      if (transitioningIndex === -1) {
        // Pick a random index to replace
        const indexToReplace = Math.floor(Math.random() * 6);
        
        // Get array of currently visible logo names
        const visibleLogoNames = visibleLogos.map(logo => logo.name);
        
        // Find all available logos that aren't currently visible
        const availableLogos = logos.filter(logo => !visibleLogoNames.includes(logo.name));
        
        if (availableLogos.length > 0) {
          // Start fade out
          setTransitioningIndex(indexToReplace);
          
          // After fade out, update the logo
          setTimeout(() => {
            const randomNewLogo = availableLogos[Math.floor(Math.random() * availableLogos.length)];
            setVisibleLogos(prevLogos => {
              const newLogos = [...prevLogos];
              newLogos[indexToReplace] = randomNewLogo;
              return newLogos;
            });
            
            // Start fade in
            setTimeout(() => {
              setTransitioningIndex(-1);
            }, 50); // Small delay to ensure DOM update
          }, 500); // Match the fade-out transition duration
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [transitioningIndex, visibleLogos, logos]);

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Partnered with Top Local Guides
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {visibleLogos.map((logo, index) => (
            <a
              key={`${logo.name}-${index}`}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-32"
            >
              <img
                src={logo.image}
                alt={`${logo.name} logo`}
                className={`h-16 object-contain transition-opacity duration-500 ${
                  index === transitioningIndex ? 'logo-fade-out' : 'logo-fade-in'
                } ${
                  logo.darkMode 
                    ? 'invert brightness-[0.4] hover:brightness-[0.2] transition-all duration-300' 
                    : 'grayscale hover:grayscale-0 transition-all duration-300'
                }`}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoScroll; 