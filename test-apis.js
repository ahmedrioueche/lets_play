// Simple test script to verify APIs are working
const BASE_URL = process.env.DOMAIN || 'http://localhost:3000';

const testSignup = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const data = await response.json();
    console.log('Signup response:', data);

    if (response.ok) {
      console.log('✅ Signup successful');
      return data._id;
    } else {
      console.log('❌ Signup failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Signup error:', error);
    return null;
  }
};

const testUserProfile = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`);
    const data = await response.json();
    console.log('User profile response:', data);

    if (response.ok) {
      console.log('✅ User profile fetch successful');
      return true;
    } else {
      console.log('❌ User profile fetch failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ User profile error:', error);
    return false;
  }
};

const testOnboarding = async (userId) => {
  try {
    // Test user update (age, location)
    const userResponse = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: '25',
        location: { lat: 40.7128, lng: -74.006 },
        hasCompletedOnboarding: true,
      }),
    });

    const userData = await userResponse.json();
    console.log('User update response:', userData);

    if (!userResponse.ok) {
      console.log('❌ User update failed:', userData.message);
      return false;
    }

    // Test user profile update (favoriteSports)
    const profileResponse = await fetch(`${BASE_URL}/api/users/${userId}/user-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        favoriteSports: ['football', 'basketball'],
      }),
    });

    const profileData = await profileResponse.json();
    console.log('Profile update response:', profileData);

    if (profileResponse.ok) {
      console.log('✅ Onboarding successful');
      return true;
    } else {
      console.log('❌ Profile update failed:', profileData.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Onboarding error:', error);
    return false;
  }
};

const runTests = async () => {
  console.log('🧪 Testing APIs...\n');

  // Test signup
  console.log('1. Testing signup...');
  const userId = await testSignup();

  if (userId) {
    console.log('\n2. Testing user profile fetch...');
    await testUserProfile(userId);

    console.log('\n3. Testing onboarding...');
    await testOnboarding(userId);
  }

  console.log('\n🏁 Tests completed');
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}
