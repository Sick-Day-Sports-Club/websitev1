import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Apply to Become a Guide Partner | Sick Day Sports Club',
  description: 'Join our network of local guides and share your expertise with outdoor enthusiasts. Apply to become a guide partner with Sick Day Sports Club.',
}

export default function GuideApplicationPage() {
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

        {/* Application Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <form className="space-y-8">
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
                    <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-1">
                      What activities do you guide? *
                    </label>
                    <select
                      id="activities"
                      name="activities"
                      multiple
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-700 focus:border-green-700"
                      size={5}
                    >
                      <option value="hiking">Hiking/Backpacking</option>
                      <option value="mountaineering">Mountaineering</option>
                      <option value="rockClimbing">Rock Climbing</option>
                      <option value="skiing">Skiing</option>
                      <option value="snowboarding">Snowboarding</option>
                      <option value="mountainBiking">Mountain Biking</option>
                      <option value="roadCycling">Road Cycling</option>
                      <option value="kayaking">Kayaking</option>
                      <option value="paddleboarding">Paddleboarding</option>
                      <option value="fishing">Fishing</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
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
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 font-medium"
                  >
                    Submit Application
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  We'll review your application and get back to you within 3-5 business days.
                </p>
              </div>
            </form>
          </div>
        </div>
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