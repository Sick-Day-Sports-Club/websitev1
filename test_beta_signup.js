// Test script for beta signup API
// Run with: node test_beta_signup.js

// Using CommonJS syntax for node-fetch v2
// If you're using node-fetch v3, you'll need to use ESM syntax with import statements
// and add "type": "module" to your package.json
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBetaSignup() {
  const testData = {
    first_name: "Test",
    last_name: "User",
    email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
    phone: "1234567890",
    location: "Test Location",
    activities: [
      { category: "hiking", subcategory: "day-hiking" }
    ],
    activity_experience: { "hiking": "intermediate" },
    adventure_style: "solo",
    social_preferences: {
      groupSize: "small",
      pace: 3,
      socialVibe: "casual"
    },
    equipment_status: { "hiking": "own" },
    availability: ["weekends"],
    weekday_preference: ["monday"],
    time_of_day: ["morning"],
    referral_source: "test",
    additional_info: "test",
    join_type: "waitlist",
    status: "waitlist"
  };

  console.log('Submitting test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/beta-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseData = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', responseData);

    if (response.ok) {
      console.log('Test successful! Data was inserted correctly.');
    } else {
      console.error('Test failed. API returned an error.');
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testBetaSignup(); 