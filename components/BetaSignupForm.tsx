'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Activity {
  type: string;
  experienceLevel: string;
}

interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  referralSource: string;
  additionalInfo: string;
  availability: string[];
  activities: Activity[];
}

export default function BetaSignupForm() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    referralSource: '',
    additionalInfo: '',
    availability: [],
    activities: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // For adding new activities
  const [currentActivity, setCurrentActivity] = useState<Activity>({
    type: '',
    experienceLevel: ''
  });

  const activities = [
    'Mountain Biking',
    'Hiking & Trail Running',
    'Rock Climbing',
    'Skiing & Snowboarding',
    'Kayaking & Paddleboarding',
    'Fishing',
    'Other'
  ];

  const experienceLevels = [
    'Beginner - I\'m just starting out',
    'Intermediate - I\'ve done this before',
    'Advanced - I\'m quite experienced',
    'Expert - I could probably guide others'
  ];

  const availabilityOptions = [
    'Weekday mornings',
    'Weekday afternoons',
    'Weekday full days',
    'Weekends'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name as keyof Pick<FormDataType, 'availability'>], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name as keyof Pick<FormDataType, 'availability'>].filter((item: string) => item !== value)
      });
    }
  };

  const handleActivityInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentActivity({
      ...currentActivity,
      [name]: value
    });
  };

  const addActivity = () => {
    if (currentActivity.type && currentActivity.experienceLevel) {
      setFormData({
        ...formData,
        activities: [...formData.activities, { ...currentActivity }]
      });
      
      // Reset current activity form
      setCurrentActivity({
        type: '',
        experienceLevel: ''
      });
    }
  };

  const removeActivity = (index: number) => {
    const updatedActivities = [...formData.activities];
    updatedActivities.splice(index, 1);
    setFormData({
      ...formData,
      activities: updatedActivities
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting form data:', formData);
      
      // Insert into 'beta_applications' table
      const { data, error } = await supabase
        .from('beta_applications')
        .insert([formData])
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Successfully submitted application:', data);
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('There was a problem submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setFormStep(formStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
    window.scrollTo(0, 0);
  };

  // If the form was successfully submitted
  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thanks for applying to be a beta tester for Sick Day Sports Club. We'll review your application and be in touch soon!
          </p>
          <a 
            href="/" 
            className="inline-block py-3 px-6 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map(step => (
            <div 
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                formStep >= step ? 'bg-[#4a7729] text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-[#4a7729] rounded-full" 
            style={{ width: `${(formStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {formStep === 1 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="firstName">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lastName">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="location">
                Location (City, State)*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
                placeholder="e.g., Bend, OR"
              />
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="py-3 px-6 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {formStep === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Adventure Activities</h3>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Your Activities</h4>
                {formData.activities.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {formData.activities.length} {formData.activities.length === 1 ? 'activity' : 'activities'} added
                  </span>
                )}
              </div>
              
              {formData.activities.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-sm text-gray-600">{activity.experienceLevel}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
                  <p className="text-gray-500">No activities added yet. Add at least one activity below.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h4 className="font-medium mb-4">Add a New Activity</h4>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="activityType">
                  Activity Type*
                </label>
                <select
                  id="activityType"
                  name="type"
                  value={currentActivity.type}
                  onChange={handleActivityInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">Select an activity</option>
                  {activities.map(activity => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="experienceLevel">
                  Your Experience Level*
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={currentActivity.experienceLevel}
                  onChange={handleActivityInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">Select your experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="text-right">
                <button
                  type="button"
                  onClick={addActivity}
                  className="py-2 px-4 bg-[#4a7729] text-white rounded hover:bg-opacity-90 transition-colors"
                  disabled={!currentActivity.type || !currentActivity.experienceLevel}
                >
                  Add Activity
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Availability (select all that apply)*
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map(option => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option}
                      name="availability"
                      value={option}
                      checked={formData.availability.includes(option)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-3 px-6 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                disabled={formData.activities.length === 0 || formData.availability.length === 0}
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {formStep === 3 && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Additional Information</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="referralSource">
                How did you hear about us?
              </label>
              <select
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
              >
                <option value="">Select an option</option>
                <option value="Friend or colleague">Friend or colleague</option>
                <option value="Social media">Social media</option>
                <option value="Search engine">Search engine</option>
                <option value="News article">News article</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="additionalInfo">
                Tell us why you'd be a great beta tester:
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                rows={4}
                placeholder="Share your enthusiasm for outdoor sports, previous experience with similar services, etc."
              ></textarea>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 