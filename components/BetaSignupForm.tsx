'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, UseFormSetValue } from 'react-hook-form';
import supabase from '../utils/supabase';
import PaymentForm from './PaymentForm';
import { useMemo } from 'react';

// Add this function to check the connection
const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('beta_applications')
      .select('*')
      .limit(1);
    
    console.log('Supabase connection test:', { data, error });
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
};

// Call it once when component loads
if (typeof window !== 'undefined') {
  checkSupabaseConnection();
}

interface Activity {
  type: string;
  experienceLevel: string;
}

interface ActivitySelection {
  category: string;
  subcategory: string;
}

interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  location: string;
  activities: Array<{ category: string; subcategory: string }>;
  activityExperience: Record<string, string>;
  adventureStyle: string;
  adventureStyleNotes: string;
  socialPreferences: {
    groupSize: 'tiny' | 'small' | 'medium' | 'large' | 'no-preference';
    pace: number;
    socialVibe: 'quiet' | 'casual' | 'social' | 'no-preference';
  };
  equipmentStatus: Record<string, string>;
  availability: string[];
  weekdayPreference: string[];
  timeOfDay: string[];
  referralSource: string;
  additionalInfo: string;
  joinType?: 'beta-basic' | 'beta-better' | 'beta-bomber' | 'waitlist';
}

interface FieldErrors {
  [key: string]: string;
}

// Step definitions
const STEPS = [
  'personal', 
  'adventure-preferences', 
  'equipment-experience', 
  'scheduling'
] as const;

type Step = typeof STEPS[number];

// Step labels for display
const stepLabels: Record<Step, string> = {
  'personal': 'Personal Info',
  'adventure-preferences': 'Adventure Preferences',
  'equipment-experience': 'Equipment & Experience',
  'scheduling': 'Scheduling & Services'
};

// Step progress mapping
const stepProgress: Record<Step, number> = {
  'personal': 25,
  'adventure-preferences': 50,
  'equipment-experience': 75,
  'scheduling': 100
};

// Step titles and descriptions
const stepInfo: Record<Step, { title: string; description: string }> = {
  'personal': {
    title: 'Personal Information',
    description: 'Tell us about yourself'
  },
  'adventure-preferences': {
    title: 'Adventure Preferences',
    description: 'Tell us about the adventure recommendations you\'d like to receive from our guide network. You can change these once a week.'
  },
  'equipment-experience': {
    title: 'Equipment & Experience',
    description: 'Share your experience level and equipment needs'
  },
  'scheduling': {
    title: 'Scheduling & Services',
    description: 'When are you available for adventures?'
  }
};

// Adventure zones
const ADVENTURE_ZONES = [
  { value: 'bend-or', label: 'Bend, OR', available: true },
  { value: 'portland-or', label: 'Portland, OR', available: false },
  { value: 'hood-river-or', label: 'Hood River, OR', available: false },
  { value: 'leavenworth-wa', label: 'Leavenworth, WA', available: false },
  { value: 'truckee-ca', label: 'Truckee, CA', available: false },
  { value: 'park-city-ut', label: 'Park City, UT', available: false },
  { value: 'jackson-wy', label: 'Jackson, WY', available: false },
  { value: 'telluride-co', label: 'Telluride, CO', available: false },
  { value: 'bentonville-ar', label: 'Bentonville, AR', available: false }
];

// Activity categories and their subcategories
const ACTIVITY_CATEGORIES: Record<string, Array<{ name: string; available: boolean }>> = {
  'Bike': [
    { name: 'Mountain', available: true },
    { name: 'Road', available: true },
    { name: 'Gravel', available: true },
    { name: 'Enduro', available: true },
    { name: 'eBike', available: false },
    { name: 'Winter Fat Bike', available: false },
    { name: 'Dirtbike/Moto', available: false },
    { name: 'BMX', available: false }
  ],
  'Climb': [
    { name: 'Sport', available: true },
    { name: 'Trad', available: true },
    { name: 'Bouldering', available: true },
    { name: 'Ice', available: true },
    { name: 'Mixed', available: true },
    { name: 'Indoor', available: true },
    { name: 'Mountaineering', available: true },
    { name: 'Canyoneering', available: false }
  ],
  'Fish': [
    { name: 'Fly Fishing', available: false },
    { name: 'Spin Fishing', available: false },
    { name: 'Ice Fishing', available: false }
  ],
  'Hike': [
    { name: 'Day Hiking', available: true },
    { name: 'Backpacking', available: true },
    { name: 'Peak Bagging', available: true },
    { name: 'Snowshoeing', available: false }
  ],
  'Paddle': [
    { name: 'Kayaking', available: true },
    { name: 'Stand Up Paddleboarding', available: true },
    { name: 'Canoeing', available: true },
    { name: 'Rafting', available: true }
  ],
  'Run': [
    { name: 'Trail Running', available: true },
    { name: 'Road Running', available: true },
    { name: 'Ultra Running', available: true }
  ],
  'Skate': [
    { name: 'Street', available: false },
    { name: 'Park', available: false },
    { name: 'Longboard', available: false },
    { name: 'Ice', available: false }
  ],
  'Ski': [
    { name: 'Alpine', available: true },
    { name: 'Backcountry', available: true },
    { name: 'Cross Country', available: true },
    { name: 'Freestyle', available: false }
  ],
  'Snowboard': [
    { name: 'Resort', available: true },
    { name: 'Backcountry', available: true },
    { name: 'Freestyle', available: false }
  ],
  'Surf': [
    { name: 'River', available: false },
    { name: 'Shortboard', available: false },
    { name: 'Longboard', available: false },
    { name: 'SUP', available: false },
    { name: 'Foil', available: false }
  ],
  'Wind': [
    { name: 'Kiteboarding', available: false },
    { name: 'Windsurfing', available: false },
    { name: 'Wing Foiling', available: false },
    { name: 'Sailing', available: false }
  ]
};

// Add new helper functions before the BetaSignupForm component
const handleNestedChange = (
  formValues: FormSchema,
  setValue: UseFormSetValue<FormSchema>,
  parent: keyof FormSchema,
  child: string,
  value: any
) => {
  if (parent === 'socialPreferences') {
    setValue('socialPreferences', {
      ...formValues.socialPreferences,
      [child]: value
    });
  }
};

// Update the initial form data
const initialFormData: FormDataType = {
  firstName: '',
  lastName: '',
  email: '',
  phone: null,
  location: '',
  activities: [],
  activityExperience: {},
  adventureStyle: '',
  adventureStyleNotes: '',
  socialPreferences: {
    groupSize: 'no-preference',
    pace: 3,
    socialVibe: 'no-preference'
  },
  equipmentStatus: {},
  availability: [],
  weekdayPreference: [],
  timeOfDay: [],
  referralSource: '',
  additionalInfo: '',
  joinType: undefined
};

// Update the validateField function
const validateField = (field: keyof FormDataType, value: any): string | null => {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return null;
    case 'firstName':
      if (!value.trim()) return 'First name is required';
      return null;
    case 'lastName':
      if (!value.trim()) return 'Last name is required';
      return null;
    case 'phone':
      if (!value) return null; // Phone is optional
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length !== 10) return 'Phone number must be 10 digits';
      return null;
    case 'activities':
      if (!value.length) return 'Please select at least one activity';
      return null;
    case 'adventureStyle':
      if (!value) return 'Please select at least one adventure style';
      return null;
    default:
      return null;
  }
};

// Add zod for validation
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the validation schema
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().nullable(),
  location: z.string().min(1, 'Please select an adventure zone'),
  activities: z.array(z.object({
    category: z.string(),
    subcategory: z.string()
  })).min(1, 'Please select at least one activity'),
  activityExperience: z.record(z.string()),
  adventureStyle: z.string().min(1, 'Please select at least one adventure style'),
  adventureStyleNotes: z.string(),
  socialPreferences: z.object({
    groupSize: z.enum(['tiny', 'small', 'medium', 'large', 'no-preference']),
    pace: z.number(),
    socialVibe: z.enum(['quiet', 'casual', 'social', 'no-preference'])
  }),
  equipmentStatus: z.record(z.string()),
  availability: z.array(z.string()).min(1, 'Please select at least one availability option'),
  weekdayPreference: z.array(z.string()),
  timeOfDay: z.array(z.string()).min(1, 'Please select at least one preferred time'),
  referralSource: z.string(),
  additionalInfo: z.string(),
  joinType: z.enum(['beta-basic', 'beta-better', 'beta-bomber', 'waitlist']).optional()
});

type FormSchema = z.infer<typeof formSchema>;

export default function BetaSignupForm() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [joinType, setJoinType] = useState<'beta-basic' | 'beta-better' | 'beta-bomber' | 'waitlist' | null>(null);
  
  // Add new state for coupon handling
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentOff: number;
    amountOff: number;
  } | null>(null);

  const { 
    control, 
    handleSubmit: hookFormSubmit, 
    watch, 
    setValue, 
    formState: { errors }, 
    reset,
    setError: setFieldError,
    clearErrors,
    getValues
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: typeof window !== 'undefined' 
      ? (() => {
          const saved = localStorage.getItem('betaFormData');
          if (saved) {
            try {
              return JSON.parse(saved);
            } catch (e) {
              console.error('Error parsing saved form data:', e);
            }
          }
          return initialFormData;
        })()
      : initialFormData
  });

  // Watch form values for auto-save
  const formValues = watch();

  // Save form data whenever it changes
  useEffect(() => {
    if (JSON.stringify(formValues) !== JSON.stringify(initialFormData)) {
      localStorage.setItem('betaFormData', JSON.stringify(formValues));
    }
  }, [formValues]);

  // Save current step
  useEffect(() => {
    localStorage.setItem('betaFormStep', currentStep);
  }, [currentStep]);

  // Load saved step on mount
  useEffect(() => {
    const savedStep = localStorage.getItem('betaFormStep');
    if (savedStep && STEPS.includes(savedStep as Step)) {
      setCurrentStep(savedStep as Step);
    }
  }, []);

  // Clear form data on successful submission
  useEffect(() => {
    if (success) {
      localStorage.removeItem('betaFormData');
      localStorage.removeItem('betaFormStep');
      reset(initialFormData);
    }
  }, [success, reset]);

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

  // Update the adventure styles
  const adventureStyles = [
    { 
      value: 'solo', 
      label: 'Solo Adventures',
      description: 'Self-guided and self-supported'
    },
    { 
      value: 'self-guided-group', 
      label: 'Self-Guided Group Activities',
      description: 'Join others with similar interests for self-guided adventures'
    },
    { 
      value: 'guided', 
      label: 'Guided Experiences',
      description: 'Professional guided adventures with expert instruction'
    }
  ];

  // Add new state for multiple adventure style selections
  const [selectedAdventureStyles, setSelectedAdventureStyles] = useState<string[]>(() => {
    const initialValue = watch('adventureStyle');
    return initialValue ? initialValue.split(',') : [];
  });

  // Update the adventure style selection handler
  const handleAdventureStyleSelection = (value: string) => {
    const newStyles = selectedAdventureStyles.includes(value)
      ? selectedAdventureStyles.filter(style => style !== value)
      : [...selectedAdventureStyles, value];
    
    setSelectedAdventureStyles(newStyles);
    setValue('adventureStyle', newStyles.join(','), { shouldValidate: true });
  };

  // Helper function to check if group preferences should be shown
  const shouldShowGroupPreferences = () => {
    return selectedAdventureStyles.some(style => 
      style === 'self-guided-group' || style === 'guided'
    );
  };

  const socialVibes = [
    { value: 'quiet', label: 'Quiet & Focused' },
    { value: 'casual', label: 'Casual & Relaxed' },
    { value: 'social', label: 'Social & Interactive' },
    { value: 'no-preference', label: 'No Preference' }
  ];

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  const timeOfDayOptions = [
    { value: 'morning', label: 'Morning (6am-12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
    { value: 'evening', label: 'Evening (5pm-10pm)' }
  ];

  // Update the handleInputChange function with proper typing for nested fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'socialPreferences' && isValidSocialPreference(child)) {
        setValue('socialPreferences', {
          ...formValues.socialPreferences,
          [child]: value
        });
        clearErrors('socialPreferences');
      } else if (parent === 'activityExperience' || parent === 'equipmentStatus') {
        if (isFormField(parent)) {
          setValue(parent, {
            ...formValues[parent],
            [child]: value
          });
          clearErrors(parent);
        }
      }
    } else if (isFormField(name)) {
      setValue(name, value);
      clearErrors(name);
    }
  };

  // Type guard for social preference fields
  const isValidSocialPreference = (field: string): field is keyof FormSchema['socialPreferences'] => {
    return ['groupSize', 'pace', 'socialVibe'].includes(field);
  };

  // Type guard for form fields
  const isFormField = (field: string): field is keyof FormSchema => {
    const formFields: Array<keyof FormSchema> = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'location',
      'activities',
      'activityExperience',
      'adventureStyle',
      'adventureStyleNotes',
      'socialPreferences',
      'equipmentStatus',
      'availability',
      'weekdayPreference',
      'timeOfDay',
      'referralSource',
      'additionalInfo',
      'joinType'
    ];
    return formFields.includes(field as keyof FormSchema);
  };

  const handleActivitySelection = (category: string, subcategory: string, isSelected: boolean) => {
    const subcategoryObj = ACTIVITY_CATEGORIES[category].find(s => s.name === subcategory);
    if (!subcategoryObj?.available) return;

    const currentActivities = watch('activities') || [];
    const newActivities = isSelected
      ? [...currentActivities, { category, subcategory }]
      : currentActivities.filter(a => !(a.category === category && a.subcategory === subcategory));
    
    setValue('activities', newActivities);
  };

  const handleCategorySelection = (category: string, isSelected: boolean) => {
    const currentActivities = watch('activities') || [];
    let newActivities = currentActivities.filter(a => a.category !== category);
    
    if (isSelected) {
      const firstAvailableSubcategory = ACTIVITY_CATEGORIES[category].find(s => s.available)?.name;
      if (firstAvailableSubcategory) {
        newActivities = [...newActivities, { category, subcategory: firstAvailableSubcategory }];
      }
    }
    
    setValue('activities', newActivities);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'activities') {
      const [category, subcategory] = value.split('|');
      if (category && subcategory) {
        handleActivitySelection(category, subcategory, checked);
      }
    } else if (name === 'availability' || name === 'weekdayPreference' || name === 'timeOfDay') {
      const currentValues = watch(name as keyof FormSchema) as string[];
      setValue(
        name as keyof FormSchema,
        checked
          ? [...currentValues, value]
          : currentValues.filter((item: string) => item !== value)
      );
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  // Update the error handling with proper typing
  const setFormErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([field, message]) => {
      if (isFormField(field)) {
        setFieldError(field, {
          type: 'manual',
          message
        });
      }
    });
  };

  // Update the validateCurrentStep function
  const validateCurrentStep = (): boolean => {
    console.log('Validating current step:', currentStep);
    const formValues = getValues();
    console.log('Form values:', formValues);
    
    const errors: Record<string, { type: string; message: string }> = {};

    if (currentStep === 'personal') {
      if (!formValues.firstName) errors.firstName = { type: 'required', message: 'First name is required' };
      if (!formValues.lastName) errors.lastName = { type: 'required', message: 'Last name is required' };
      if (!formValues.email) errors.email = { type: 'required', message: 'Email is required' };
      else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = { type: 'pattern', message: 'Please enter a valid email address' };
      }
      if (!formValues.location) errors.location = { type: 'required', message: 'Please select an adventure zone' };
    }
    
    switch (currentStep) {
      case 'adventure-preferences':
        if (!formValues.activities.length) {
          errors.activities = { type: 'required', message: 'Please select at least one activity' };
        }
        if (selectedAdventureStyles.length === 0) {
          errors.adventureStyle = { type: 'required', message: 'Please select at least one adventure style' };
        }
        break;
        
      case 'equipment-experience':
        formValues.activities.forEach(activity => {
          const activityKey = `${activity.category}-${activity.subcategory}`;
          
          // Check experience level
          if (!formValues.activityExperience[activityKey]) {
            errors[`activityExperience.${activityKey}`] = { 
              type: 'required', 
              message: `Please select your experience level for ${activity.category} - ${activity.subcategory}` 
            };
          }
          
          // Check equipment status
          if (!formValues.equipmentStatus[activityKey]) {
            errors[`equipmentStatus.${activityKey}`] = { 
              type: 'required', 
              message: `Please select your equipment status for ${activity.category} - ${activity.subcategory}` 
            };
          }
        });
        break;
        
      case 'scheduling':
        if (!formValues.availability.length) {
          errors.availability = { type: 'required', message: 'Please select at least one availability option' };
        }
        if (!formValues.timeOfDay.length) {
          errors.timeOfDay = { type: 'required', message: 'Please select at least one preferred time of day' };
        }
        break;
    }
    
    // Set errors in form state
    Object.entries(errors).forEach(([field, error]) => {
      setFieldError(field as any, error);
    });

    // If there are any errors, scroll to the first error message
    if (Object.keys(errors).length > 0) {
      const firstErrorElement = document.querySelector('.text-red-600');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    return Object.keys(errors).length === 0;
  };

  // Add helper to display field error
  const getFieldError = (fieldName: keyof FormSchema) => {
    return typeof errors[fieldName]?.message === 'string' ? (
      <p className="mt-1 text-sm text-red-600">
        {errors[fieldName].message}
      </p>
    ) : null;
  };

  const onSubmit = async (data: FormSchema) => {
    setIsSubmitting(true);
    setError('');
    
    console.log('Form submission started with join type:', joinType);
    console.log('Form data:', data);
    
    try {
      if (!joinType) {
        throw new Error('Please select how you would like to join');
      }

      // Transform the data to match database column names (using snake_case)
      const submissionData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        location: data.location,
        activities: data.activities.map(a => ({
          category: a.category,
          subcategory: a.subcategory
        })),
        activity_experience: data.activityExperience,
        adventure_style: data.adventureStyle,
        social_preferences: data.socialPreferences,
        equipment_status: data.equipmentStatus,
        availability: data.availability,
        weekday_preference: data.weekdayPreference,
        time_of_day: data.timeOfDay,
        referral_source: data.referralSource?.trim() || null,
        additional_info: data.additionalInfo?.trim() || null,
        status: joinType === 'waitlist' ? 'waitlist' : 'pending',
        join_type: joinType
      };

      console.log('Submitting data to API...', submissionData);
      console.log('Stringified data:', JSON.stringify(submissionData));
      
      try {
        // Always use the beta-signup endpoint for both waitlist and paid memberships
        const response = await fetch('/api/beta-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        console.log('API response status:', response.status);
        
        let result;
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
          console.log('API response data:', result);
        } else {
          // If response is not JSON, get the text and throw an error
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Received an invalid response from the server. Please try again.');
        }

        if (!response.ok) {
          console.error('Response not OK:', response.status, result);
          if (response.status === 409) {
            throw new Error('You have already submitted an application with this email address.');
          }
          
          if (result.details) {
            const errorMessages = Array.isArray(result.details) 
              ? result.details.map((detail: { path: string; message: string }) => `${detail.path}: ${detail.message}`).join('\n')
              : result.details;
            console.error('Error details:', errorMessages);
            throw new Error(errorMessages);
          }
          
          throw new Error(result.error || 'Failed to submit application');
        }

        // For waitlist, set success immediately
        if (joinType === 'waitlist') {
          console.log('Waitlist signup successful');
          setSuccess(true);
          
          // Attempt to send confirmation email
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'waitlist',
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
              }),
            });
          } catch (emailError) {
            // Just log email errors, don't affect the user experience
            console.error('Error sending confirmation email:', emailError);
          }
        } else {
          // For paid memberships, show the payment form
          console.log('Paid membership signup successful, showing payment form');
          setShowPayment(true);
          
          // Scroll to top to ensure payment form is visible
          window.scrollTo(0, 0);
        }
      } catch (submitError) {
        console.error('Error during form submission:', submitError);
        throw new Error(submitError instanceof Error ? submitError.message : 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'There was a problem submitting your application. Please try again.');
      
      // Ensure the user sees the error
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = hookFormSubmit(onSubmit);

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  // Add helper function to calculate final amount
  const calculateFinalAmount = () => {
    let baseAmount = joinType === 'beta-basic' ? 9 : joinType === 'beta-better' ? 19 : 99;
    
    if (appliedDiscount) {
      if (appliedDiscount.percentOff > 0) {
        baseAmount = baseAmount * (1 - appliedDiscount.percentOff / 100);
      }
      if (appliedDiscount.amountOff > 0) {
        baseAmount = Math.max(0, baseAmount - appliedDiscount.amountOff);
      }
    }
    
    return Math.round(baseAmount * 100) / 100; // Round to 2 decimal places
  };

  // Add coupon validation function
  const validateCoupon = async (code: string) => {
    setIsValidatingCoupon(true);
    setCouponError('');
    
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          membershipType: joinType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid coupon code');
      }

      setAppliedDiscount({
        code: data.code,
        percentOff: data.percentOff || 0,
        amountOff: data.amountOff || 0
      });
      
      setCouponError('');
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : 'Failed to validate coupon');
      setAppliedDiscount(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Add handler for coupon input
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase();
    setCouponCode(value);
    if (appliedDiscount) {
      setAppliedDiscount(null);
    }
    setCouponError('');
  };

  // Add handler for coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    await validateCoupon(couponCode);
  };

  // If payment was successful
  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            {joinType === 'waitlist' 
              ? "Thanks for joining our waitlist! We'll keep you updated on our progress."
              : "Thanks for applying to be a beta tester for Sick Day Sports Club. We'll be in touch soon!"}
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

  // If showing payment form
  if (showPayment) {
    const finalAmount = calculateFinalAmount();
    
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Beta Access</h2>
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2">
            {joinType === 'waitlist' 
              ? 'Confirm your spot on the waitlist'
              : `Lock in your founding member rate of $${joinType === 'beta-basic' ? '9' : joinType === 'beta-better' ? '19' : '99'}/month`}
          </p>
          <p className="text-sm text-gray-500">
            {joinType === 'waitlist'
              ? "You'll be notified when we expand to your area or open up more spots."
              : "Your card will be securely stored but won't be charged until we launch in March. You'll receive an email confirmation before any charges."}
          </p>
        </div>
        
        {joinType !== 'waitlist' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Monthly Membership</span>
              <span className="font-medium">${joinType === 'beta-basic' ? '9' : joinType === 'beta-better' ? '19' : '99'}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="couponCode">
                Have a promo code?
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  value={couponCode}
                  onChange={handleCouponChange}
                  className={`flex-1 p-2 border ${couponError ? 'border-red-300' : 'border-gray-300'} rounded text-sm`}
                  placeholder="Enter code"
                  disabled={isValidatingCoupon}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode}
                  className={`px-4 py-2 bg-[#4a7729] text-white rounded text-sm ${
                    isValidatingCoupon || !couponCode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                  }`}
                >
                  {isValidatingCoupon ? 'Validating...' : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="mt-1 text-sm text-red-600">{couponError}</p>
              )}
              {appliedDiscount && (
                <p className="mt-1 text-sm text-[#4a7729]">
                  Coupon applied! {appliedDiscount.percentOff > 0 ? `${appliedDiscount.percentOff}% off` : `$${appliedDiscount.amountOff} off`}
                </p>
              )}
            </div>

            {appliedDiscount && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Final Amount</span>
                  <span className="font-medium">${finalAmount}/month</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        <PaymentForm 
          amount={finalAmount}
          couponCode={appliedDiscount?.code}
          onSuccess={() => {
            console.log('Payment successful, setting success state');
            setSuccess(true);
            // Scroll to top to ensure user sees the success message
            window.scrollTo(0, 0);
          }}
          onError={(error) => {
            console.error('Payment error:', error);
            setError(error);
            setShowPayment(false);
            // Scroll to top to ensure user sees the error message
            window.scrollTo(0, 0);
          }}
        />
        <button
          onClick={() => setShowPayment(false)}
          className="mt-4 w-full py-2 px-4 text-gray-600 hover:text-gray-800 text-center"
        >
          Go back to form
        </button>
      </div>
    );
  }

  // Update the ProgressBar component
  const ProgressBar = () => (
    <div className="px-4 pt-2 mb-6">
      <div className="flex justify-between mb-2 text-sm">
        {STEPS.map((step, index) => (
          <span 
            key={step}
            className={`${currentStep === step ? 'text-[#4a7729] font-medium' : 'text-gray-400'}`}
          >
            {index + 1}. {stepLabels[step]}
          </span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#4a7729] h-2 rounded-full transition-all duration-300" 
          style={{ width: `${stepProgress[currentStep]}%` }}
        ></div>
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-lg font-semibold">{stepInfo[currentStep].title}</h3>
        <p className="text-gray-600 text-sm">{stepInfo[currentStep].description}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <ProgressBar />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm mb-1" htmlFor="firstName">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                  placeholder="Carson"
                />
                {getFieldError('firstName')}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-1" htmlFor="lastName">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                  placeholder="Storch"
                />
                {getFieldError('lastName')}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
                placeholder="rideitlikeyou@stoleit.com"
              />
              {getFieldError('email')}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formValues.phone || ''}
                onChange={handleInputChange}
                onBlur={(e) => {
                  const error = validateField('phone', e.target.value);
                  if (error) {
                    setFieldError('phone', { type: 'manual', message: error });
                  }
                }}
                className={`w-full p-2 border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } rounded text-sm`}
                placeholder="541-541-5411"
              />
              {getFieldError('phone')}
              <p className="mt-1 text-xs text-gray-500">
                Optional - Format: XXX-XXX-XXXX
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1" htmlFor="location">
                Adventure Zone*
              </label>
              <select
                id="location"
                name="location"
                value={formValues.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
              >
                <option value="">Select the areas you often use as basecamp</option>
                {ADVENTURE_ZONES.map(zone => (
                  <option 
                    key={zone.value} 
                    value={zone.value}
                    disabled={!zone.available}
                  >
                    {zone.label}{!zone.available ? ' (Coming Soon)' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-600">
                We are launching in Bend with other adventure zones to follow soon after. Don't see your zone on the list? Let us know where we should go next: <a href="mailto:info@sickdaysportsclub.com" className="text-[#4a7729] hover:underline">info@sickdaysportsclub.com</a>
              </p>
              {getFieldError('location')}
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 'adventure-preferences' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Which activities are you interested in?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(ACTIVITY_CATEGORIES).map(([category, subcategories]) => {
                  const isComingSoon = ['Fish', 'Skate', 'Surf', 'Wind'].includes(category);
                  return (
                    <div key={category} className="border rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={category}
                          checked={formValues.activities.some(a => a.category === category)}
                          onChange={(e) => handleCategorySelection(category, e.target.checked)}
                          className="mr-2 h-4 w-4"
                          disabled={isComingSoon}
                        />
                        <label 
                          htmlFor={category} 
                          className={`font-medium text-sm ${isComingSoon ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {category}{isComingSoon ? ' (Coming Soon)' : ''}
                        </label>
                      </div>
                      
                      {formValues.activities.some(a => a.category === category) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subcategories.map(subcategory => (
                            <div key={`${category}-${subcategory.name}`} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`${category}-${subcategory.name}`}
                                checked={formValues.activities.some(a => a.category === category && a.subcategory === subcategory.name)}
                                onChange={(e) => handleActivitySelection(category, subcategory.name, e.target.checked)}
                                disabled={!subcategory.available}
                                className="mr-2 h-3.5 w-3.5"
                              />
                              <label 
                                htmlFor={`${category}-${subcategory.name}`} 
                                className={`text-xs ${subcategory.available ? 'text-gray-700' : 'text-gray-400'}`}
                              >
                                {subcategory.name}{!subcategory.available ? ' (Coming Soon)' : ''}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Our adventure guide network covers the activities listed and is growing fast! Don't see your favorite? Let us know what to add: <a href="mailto:info@sickdaysportsclub.com" className="text-[#4a7729] hover:underline">info@sickdaysportsclub.com</a>
              </p>
              {getFieldError('activities')}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">What's your preferred adventure style?</h3>
              <p className="text-sm text-gray-600 mb-3">Select one or more options that interest you. You can always adjust these later.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {adventureStyles.map(option => (
                  <div 
                    key={option.value}
                    className={`border p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAdventureStyles.includes(option.value)
                        ? 'border-[#4a7729] bg-green-50' 
                        : errors.adventureStyle ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAdventureStyleSelection(option.value)}
                  >
                    <div className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`adventure-style-${option.value}`}
                        checked={selectedAdventureStyles.includes(option.value)}
                        onChange={() => handleAdventureStyleSelection(option.value)}
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      <label 
                        htmlFor={`adventure-style-${option.value}`}
                        className="font-medium text-sm cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">{option.description}</p>
                  </div>
                ))}
              </div>
              {errors.adventureStyle && (
                <p className="mt-2 text-sm text-red-600">{errors.adventureStyle.message}</p>
              )}
            </div>

            {/* Group Preferences Section */}
            {shouldShowGroupPreferences() && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">What are your group preferences?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Preferred Group Size</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      name="socialPreferences.groupSize"
                      value={formValues.socialPreferences.groupSize}
                      onChange={handleInputChange}
                    >
                      <option value="no-preference">No preference</option>
                      <option value="tiny">Tiny (1 other person or guide)</option>
                      <option value="small">Small (2-3 people)</option>
                      <option value="medium">Medium (4-6 people)</option>
                      <option value="large">Large (7+ people)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">Social Vibes</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      name="socialPreferences.socialVibe"
                      value={formValues.socialPreferences.socialVibe}
                      onChange={handleInputChange}
                    >
                      <option value="no-preference">No preference</option>
                      <option value="quiet">Quiet & Focused</option>
                      <option value="casual">Casual Conversation</option>
                      <option value="social">Social & Energetic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Adventure Pace Slider - Moved below group preferences */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Adventure Pace</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Relaxed</span>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  className="w-full h-2"
                  name="socialPreferences.pace"
                  value={formValues.socialPreferences.pace}
                  onChange={(e) => handleNestedChange(
                    formValues,
                    setValue,
                    'socialPreferences',
                    'pace',
                    parseInt(e.target.value)
                  )}
                />
                <span className="text-sm text-gray-600">Intense</span>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mt-6 space-y-2">
              <label className="block text-gray-700 text-sm font-medium" htmlFor="adventureStyleNotes">
                Anything else we should know about your adventure style?
              </label>
              <textarea
                id="adventureStyleNotes"
                name="adventureStyleNotes"
                value={formValues.adventureStyleNotes}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                placeholder="Tell us about your preferred adventure style, experience goals, or any other preferences..."
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 'equipment-experience' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Experience Levels</h3>
              <div className="space-y-3">
                {formValues.activities.map(activity => {
                  const activityKey = `${activity.category}-${activity.subcategory}`;
                  return (
                    <div key={activityKey} className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-gray-700 mb-2 font-medium">
                        {activity.category} - {activity.subcategory}
                      </label>
                      <select
                        className={`w-full p-2 border rounded text-sm ${
                          errors.activityExperience && errors.activityExperience[activityKey]
                            ? 'border-red-300' 
                            : 'border-gray-300'
                        }`}
                        name={`activityExperience.${activityKey}`}
                        value={formValues.activityExperience[activityKey] || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select your level</option>
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.activityExperience && errors.activityExperience[activityKey] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.activityExperience[activityKey].message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Equipment Status</h3>
              <div className="space-y-3">
                {formValues.activities.map(activity => {
                  const activityKey = `${activity.category}-${activity.subcategory}`;
                  return (
                    <div key={activityKey} className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-gray-700 mb-2 font-medium">
                        {activity.category} - {activity.subcategory} Equipment
                      </label>
                      <select
                        className={`w-full p-2 border rounded text-sm ${
                          errors.equipmentStatus && errors.equipmentStatus[activityKey]
                            ? 'border-red-300' 
                            : 'border-gray-300'
                        }`}
                        name={`equipmentStatus.${activityKey}`}
                        value={formValues.equipmentStatus[activityKey] || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select equipment status</option>
                        <option value="own">I have all my own equipment</option>
                        <option value="partial">I have some equipment</option>
                        <option value="need-rental">I need to rent all equipment</option>
                      </select>
                      {errors.equipmentStatus && errors.equipmentStatus[activityKey] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.equipmentStatus[activityKey].message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="py-2 px-4 bg-[#4a7729] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 'scheduling' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">When are you available?</h3>
              <div className="space-y-3">
                {availabilityOptions.map(option => (
                  <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="availability"
                      value={option}
                      checked={formValues.availability.includes(option)}
                      onChange={handleCheckboxChange}
                      className="mr-3 h-5 w-5"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Preferred Time of Day</h3>
              <div className="space-y-3">
                {timeOfDayOptions.map(option => (
                  <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="timeOfDay"
                      value={option.value}
                      checked={formValues.timeOfDay.includes(option.value)}
                      onChange={handleCheckboxChange}
                      className="mr-3 h-5 w-5"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Join Type Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">How would you like to join?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a membership tier below to select the club services that matches your adventure needs.
              </p>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div 
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                    joinType === 'beta-basic' 
                      ? 'border-[#4a7729] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setJoinType('beta-basic')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-base">Basic</h4>
                    <p className="text-[#4a7729] font-medium">$9/month</p>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                    <li>3 personalized solo adventures weekly, optimized for conditions and your schedule</li>
                  </ul>
                </div>

                <div 
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                    joinType === 'beta-better' 
                      ? 'border-[#4a7729] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setJoinType('beta-better')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-base">Better</h4>
                    <p className="text-[#4a7729] font-medium">$19/month</p>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                    <li>5 personalized solo adventures weekly</li>
                    <li>3 guided or self-guided group adventures weekly</li>
                  </ul>
                </div>

                <div 
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                    joinType === 'beta-bomber' 
                      ? 'border-[#4a7729] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setJoinType('beta-bomber')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-base">Bomber</h4>
                    <p className="text-[#4a7729] font-medium">$99/month</p>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                    <li>7 personalized solo adventures weekly</li>
                    <li>5 guided or self-guided group adventures weekly</li>
                    <li>Weekly gear shuttle service</li>
                  </ul>
                </div>

                <div 
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                    joinType === 'waitlist' 
                      ? 'border-[#4a7729] bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setJoinType('waitlist')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-base">TBD</h4>
                    <p className="text-[#4a7729] font-medium">Free</p>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                    <li>Save your adventure preferences</li>
                    <li>Get updates as we grow the club</li>
                    <li>Join later at standard rates</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="referralSource">
                    How did you hear about us?
                  </label>
                  <input
                    type="text"
                    id="referralSource"
                    name="referralSource"
                    value={formValues.referralSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    placeholder="e.g., Friend, Social Media, Search"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="additionalInfo">
                    Any additional comments or questions?
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formValues.additionalInfo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    rows={3}
                    placeholder="Tell us anything else we should know about your adventure preferences or needs..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !joinType}
                className={`py-2 px-4 bg-[#4a7729] text-white font-medium rounded-lg transition-colors ${
                  isSubmitting || !joinType 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-opacity-90'
                }`}
                onClick={(e) => {
                  // Don't need to do anything special here as the form's onSubmit handler will be called
                  console.log('Complete Profile button clicked');
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Complete Profile'}
              </button>
            </div>
            
            {/* Debug button - only visible in development */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      console.log('Testing API connectivity...');
                      
                      // Test the debug API
                      const response = await fetch('/api/debug-form', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          test: true,
                          timestamp: new Date().toISOString(),
                          formState: {
                            currentStep,
                            joinType,
                            hasErrors: !!error
                          }
                        }),
                      });
                      
                      const data = await response.json();
                      console.log('Debug API response:', data);
                      
                      // Test Stripe API
                      const stripeResponse = await fetch('/api/create-payment-intent', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ amount: 99 }),
                      });
                      
                      const stripeData = await stripeResponse.json();
                      console.log('Stripe API response:', stripeData);
                      
                      alert('Debug tests completed. Check console for results.');
                    } catch (err) {
                      console.error('Debug test error:', err);
                      alert('Error during debug test. Check console.');
                    }
                  }}
                  className="w-full py-2 px-4 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Debug Form Submission
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}