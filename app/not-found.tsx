import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <div className="relative w-full h-64 mb-8">
          <Image
            src="/images/trail-maintenance.jpg"
            alt="Trail maintenance worker fixing a trail"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! This Feature Needs Some TLC
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Our trail crew is shaping the berm and this path should be back open soon. Thanks for your patience!
        </p>
        
        <Link 
          href="/" 
          className="inline-block bg-[#4a7729] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#3d6121] transition-colors"
        >
          Back to the Trail Head
        </Link>
      </div>
    </div>
  );
} 