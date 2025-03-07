'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';

interface FormDataObject {
  [key: string]: any;
  activities?: string[];
  availability?: {
    [key: string]: boolean;
  };
}

export default function GuideApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Get form data
      const formData = new FormData(e.currentTarget);
      const formDataObj: FormDataObject = {};
      
      // Process form data
      formData.forEach((value, key) => {
        if (key === 'activities') {
          if (!formDataObj[key]) {
            formDataObj[key] = [];
          }
          formDataObj[key]?.push(value.toString());
        } else if (key === 'availability') {
          if (!formDataObj[key]) {
            formDataObj[key] = {};
          }
          if (formDataObj[key]) {
            formDataObj[key][value.toString()] = true;
          }
        } else {
          formDataObj[key] = value.toString();
        }
      });
      
      // Submit form data to API
      const response = await fetch('/api/guides/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      e.currentTarget.reset();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting your application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Link href="/guides#how-it-works" className="text-gray-300 hover:text-white transition duration-150">How It Works</Link>
              <Link href="/guides#faqs" className="text-gray-300 hover:text-white transition duration-150">FAQs</Link>
              <a href="mailto:guides@sickdaysports.club" className="text-gray-300 hover:text-white transition duration-150">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to account for fixed header */}
      <div className="w-full pt-16">
        {/* Hero Section */}
        <div className="w-full bg-green-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Apply to Become a Guide Partner</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Join our network of independent guides and help people turn their sick days into unforgettable adventures.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Application Submitted!</strong>
              <p className="block sm:inline ml-2">Thank you for your interest in becoming a guide partner. We'll review your application and get back to you within 3-5 business days.</p>
              <div className="mt-4">
                <Link href="/guides" className="text-green-700 font-semibold hover:text-green-800">
                  ← Back to Guide Information
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <p className="block sm:inline ml-2">{submitError}</p>
            </div>
          </div>
        )}

        {/* Application Form */}
        {!submitSuccess && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Location/Area *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        placeholder="e.g., Bend, OR"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience & Qualifications */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Experience & Qualifications</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-3">
                        What activities do you guide? *
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="bike"
                            name="activities"
                            type="checkbox"
                            value="bike"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="bike" className="ml-2 block text-sm text-gray-700">
                            Bike
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="climb"
                            name="activities"
                            type="checkbox"
                            value="climb"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="climb" className="ml-2 block text-sm text-gray-700">
                            Climb
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="fish"
                            name="activities"
                            type="checkbox"
                            value="fish"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="fish" className="ml-2 block text-sm text-gray-700">
                            Fish
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="hike"
                            name="activities"
                            type="checkbox"
                            value="hike"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="hike" className="ml-2 block text-sm text-gray-700">
                            Hike
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="paddle"
                            name="activities"
                            type="checkbox"
                            value="paddle"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="paddle" className="ml-2 block text-sm text-gray-700">
                            Paddle
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="run"
                            name="activities"
                            type="checkbox"
                            value="run"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="run" className="ml-2 block text-sm text-gray-700">
                            Run
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="skate"
                            name="activities"
                            type="checkbox"
                            value="skate"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="skate" className="ml-2 block text-sm text-gray-700">
                            Skate
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="ski"
                            name="activities"
                            type="checkbox"
                            value="ski"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="ski" className="ml-2 block text-sm text-gray-700">
                            Ski
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="snowboard"
                            name="activities"
                            type="checkbox"
                            value="snowboard"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="snowboard" className="ml-2 block text-sm text-gray-700">
                            Snowboard
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="surf"
                            name="activities"
                            type="checkbox"
                            value="surf"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="surf" className="ml-2 block text-sm text-gray-700">
                            Surf
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="wind"
                            name="activities"
                            type="checkbox"
                            value="wind"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="wind" className="ml-2 block text-sm text-gray-700">
                            Wind
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="other"
                            name="activities"
                            type="checkbox"
                            value="other"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="other" className="ml-2 block text-sm text-gray-700">
                            Other
                          </label>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Please select all activities that you guide</p>
                    </div>

                    <div>
                      <label htmlFor="otherActivities" className="block text-sm font-medium text-gray-700 mb-1">
                        If you selected "Other", please specify:
                      </label>
                      <input
                        type="text"
                        id="otherActivities"
                        name="otherActivities"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience as a Guide *
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      >
                        <option value="">Select...</option>
                        <option value="less-than-1">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="more-than-10">More than 10 years</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                        Certifications & Qualifications *
                      </label>
                      <textarea
                        id="certifications"
                        name="certifications"
                        rows={4}
                        required
                        placeholder="List relevant certifications, training, and qualifications (e.g., Wilderness First Responder, AMGA Certification, etc.)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="firstAid" className="block text-sm font-medium text-gray-700 mb-1">
                        Current First Aid Certification *
                      </label>
                      <select
                        id="firstAid"
                        name="firstAid"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      >
                        <option value="">Select...</option>
                        <option value="basic">Basic First Aid</option>
                        <option value="wfa">Wilderness First Aid (WFA)</option>
                        <option value="wfr">Wilderness First Responder (WFR)</option>
                        <option value="emt">EMT or higher</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Business Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name (if applicable)
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website/Social Media (if applicable)
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        placeholder="https://"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      />
                    </div>

                    <div>
                      <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
                        Do you have liability insurance? *
                      </label>
                      <select
                        id="insurance"
                        name="insurance"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      >
                        <option value="">Select...</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="not-sure">Not sure</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Additional Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                        Typical Availability *
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="weekdays"
                            name="availability"
                            value="weekdays"
                            type="checkbox"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="weekdays" className="ml-2 block text-sm text-gray-700">
                            Weekdays
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="weekends"
                            name="availability"
                            value="weekends"
                            type="checkbox"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="weekends" className="ml-2 block text-sm text-gray-700">
                            Weekends
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="mornings"
                            name="availability"
                            value="mornings"
                            type="checkbox"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="mornings" className="ml-2 block text-sm text-gray-700">
                            Mornings
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="afternoons"
                            name="availability"
                            value="afternoons"
                            type="checkbox"
                            className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                          />
                          <label htmlFor="afternoons" className="ml-2 block text-sm text-gray-700">
                            Afternoons
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="aboutYou" className="block text-sm font-medium text-gray-700 mb-1">
                        Tell us about yourself and why you want to join Sick Day Sports Club *
                      </label>
                      <textarea
                        id="aboutYou"
                        name="aboutYou"
                        rows={5}
                        required
                        placeholder="Share your guiding philosophy, what makes you unique as a guide, and why you're interested in partnering with us."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="referral" className="block text-sm font-medium text-gray-700 mb-1">
                        How did you hear about us?
                      </label>
                      <select
                        id="referral"
                        name="referral"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      >
                        <option value="">Select...</option>
                        <option value="social-media">Social Media</option>
                        <option value="friend">Friend or Colleague</option>
                        <option value="search">Search Engine</option>
                        <option value="event">Event or Conference</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Terms and Submission */}
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-green-700 focus:ring-green-700 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        I agree to the <Link href="/terms" className="text-green-700 hover:text-green-800">Terms and Conditions</Link> *
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    We'll review your application and get back to you within 3-5 business days.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-800 text-white p-8 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-gray-400">
            <p>© {new Date().getFullYear()} Sick Day Sports Club. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/" className="text-gray-400 hover:text-white">
                Back to Home
              </Link>
              {' • '}
              <Link href="/guides" className="text-gray-400 hover:text-white">
                Guide Information
              </Link>
              {' • '}
              <a href="mailto:guides@sickdaysports.club" className="text-gray-400 hover:text-white">
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 