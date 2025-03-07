import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Partner Portal | Sick Day Sports Club',
  description: 'Access the partner portal for guides and partners of Sick Day Sports Club.',
}

export default function PartnerPortal() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-[#4a7729]">Sick Day Sports Club</h1>
            </Link>
            <h2 className="text-2xl font-bold mt-6 mb-2">Partner Portal</h2>
            <p className="text-gray-600">
              Access your guide dashboard and manage your adventures.
            </p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#4a7729] focus:ring-[#4a7729] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="text-[#4a7729] hover:text-[#3d6222]">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#4a7729] hover:bg-[#3d6222] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a7729]"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/guides#apply" className="text-[#4a7729] hover:text-[#3d6222]">
                Apply to become a guide
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This portal is currently in development. Full functionality coming soon.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <Link href="/" className="text-[#4a7729] hover:text-[#3d6222]">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 