'use client';
import Link from 'next/link';
import { useState } from 'react';
import Container from './Container';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-[#2c2c2c]">
      <Container>
        <nav className="flex justify-between items-center py-5">
          <Link href="/" className="text-2xl font-bold text-white hover:text-[#4a7729] transition-colors">
            Sick Day Sports Club
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex">
            <Link href="#how" className="text-white font-semibold ml-8 hover:text-[#4a7729] transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-white font-semibold ml-8 hover:text-[#4a7729] transition-colors">
              Testimonials
            </Link>
            <Link href="#signup" className="text-white font-semibold ml-8 hover:text-[#4a7729] transition-colors">
              Early Access
            </Link>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-[#2c2c2c] shadow-md p-4 md:hidden z-10">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="#how" 
                  className="text-white font-semibold hover:text-[#4a7729] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="#testimonials" 
                  className="text-white font-semibold hover:text-[#4a7729] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link 
                  href="#signup" 
                  className="text-white font-semibold hover:text-[#4a7729] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Early Access
                </Link>
              </div>
            </div>
          )}
        </nav>
      </Container>
    </div>
  );
} 