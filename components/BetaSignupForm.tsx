'use client';

import { useState } from 'react';
import { trackBetaSignup } from '@/utils/analytics';

interface FormData {
  name: string;
  email: string;
  phone: string;
  activities: string[];
  experience: string;
  availability: string[];
  referral: string;
  comments: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  activities: [],
  experience: '',
  availability: [],
  referral: '',
  comments: '',
};

const activityOptions = [
  'Rock Climbing',
  'Mountain Biking',
  'Skiing',
  'Snowboarding',
  'Trail Running',
  'Hiking',
  'Whitewater',
];

const availabilityOptions = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekends',
];

const experienceLevels = [
  'Beginner - I\'m new to outdoor sports',
  'Intermediate - I have some experience',
  'Advanced - I\'m comfortable in most conditions',
  'Expert - I\'m highly skilled and experienced',
];

export default function BetaSignupForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...prev[name as keyof Pick<FormData, 'activities' | 'availability'>], value]
        : prev[name as keyof Pick<FormData, 'activities' | 'availability'>].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      trackBetaSignup(formData.email);
      setSubmitStatus('success');
      setFormData(initialFormData);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
      {/* Basic Information */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
          />
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Activities & Experience</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which activities interest you? *
          </label>
          <div className="space-y-2">
            {activityOptions.map(activity => (
              <label key={activity} className="flex items-center">
                <input
                  type="checkbox"
                  name="activities"
                  value={activity}
                  checked={formData.activities.includes(activity)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#4a7729] focus:ring-[#4a7729] border-gray-300 rounded"
                />
                <span className="ml-2">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            What's your experience level? *
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
          >
            <option value="">Select your experience level</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Availability</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When are you typically available? *
          </label>
          <div className="space-y-2">
            {availabilityOptions.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  value={option}
                  checked={formData.availability.includes(option)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#4a7729] focus:ring-[#4a7729] border-gray-300 rounded"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
        
        <div>
          <label htmlFor="referral" className="block text-sm font-medium text-gray-700 mb-1">
            How did you hear about us?
          </label>
          <input
            type="text"
            id="referral"
            name="referral"
            value={formData.referral}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
          />
        </div>

        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
            Anything else you'd like us to know?
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4a7729] focus:border-[#4a7729]"
          />
        </div>
      </div>

      {/* Form Status */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          Thanks for applying! We'll be in touch soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 text-white font-semibold rounded-md transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#4a7729] hover:bg-[#3d6222]'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
} 