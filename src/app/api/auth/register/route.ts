import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      role,
      termsAgreed = true,
      profileData,
      photo
    } = await request.json();

    // Only allow valid roles
    const validRoles = ['employee', 'recruiter', 'employer'];
    const safeRole = validRoles.includes(role) ? role : 'employee';

    // Use NEXT_PUBLIC_BACKEND_URL for Next.js API routes
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

    let response;
    try {
      // Prepare the request body with comprehensive profile data
      const requestBody: any = {
        fullName,
        email,
        password,
        mobile,
        role: safeRole,
        termsAgreed
      };

      // Add comprehensive profile data if provided
      if (profileData) {
        requestBody.profileData = profileData;
      }

      // Handle photo upload if provided
      if (photo) {
        // Convert base64 photo to buffer if needed
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          // This is a base64 data URL, we'll pass it as is
          requestBody.photo = photo;
        } else {
          // This is a File object, we'll need to handle it differently
          requestBody.photo = photo;
        }
      }

      response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError) {
      console.error('Error connecting to backend:', fetchError);
      return NextResponse.json({ error: 'Could not connect to backend server' }, { status: 502 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
