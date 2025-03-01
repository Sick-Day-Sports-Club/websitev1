'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/images/hero-background.jpg',
    '/images/hero-background2.jpg',
    '/images/hero-background3.jpg',
    '/images/hero-background4.jpg',
    '/images/hero-background5.jpg',
    '/images/hero-background6.jpg',
    '/images/hero-background7.jpg'
  ];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [nextImage]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key >= '1' && e.key <= '7') {
        const index = parseInt(e.key) - 1;
        if (index < images.length) {
          goToImage(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, goToImage, images.length]);

  return (
    <section 
      className="relative h-[90vh] flex items-center justify-start"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero image carousel"
    >
      {/* Background images with fade transition */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of ${images.length}`}
          aria-hidden={index !== currentImageIndex}
        >
          <Image
            src={image}
            alt={`Adventure background ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-0"></div>
      
      {/* Navigation arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2"
        role="tablist"
        aria-label="Choose image to display"
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
              index === currentImageIndex
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            role="tab"
            aria-selected={index === currentImageIndex}
            aria-label={`Go to image ${index + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="max-w-[600px] px-12 text-white relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
          Take That Sick Day. Make It Count.
        </h1>
        <p className="text-xl mb-8 max-w-[500px]">
          Need a break from Zoom? Connect with expert local guides for short but epic action sports missions in your favorite adventure zones.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="#signup" 
            className="bg-[#4a7729] hover:bg-[#3d6222] text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            Get Early Access
          </Link>
          <Link 
            href="#how" 
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
} 