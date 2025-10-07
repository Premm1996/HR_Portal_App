import { NextRequest, NextResponse } from 'next/server';

interface ProfileData {
  [key: string]: any; // Index signature
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience?: string;
  skills?: string;
  education?: string;
  agree?: boolean;
}

// Always use process.env.BACKEND_URL or fallback to http://localhost:5000 for backend API calls
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const profileData: ProfileData = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Trim all string fields with proper typing
    const trimmedData: ProfileData = {};
    for (const key in profileData) {
      if (typeof profileData[key] === 'string') {
        trimmedData[key] = (profileData[key] as string).trim();
      } else {
        trimmedData[key] = profileData[key];
      }
    }

    // Validate required fields before sending to backend
    const requiredFields = ['fullName', 'email', 'phone', 'position', 'experience', 'skills', 'education'];
    const missingFields = requiredFields.filter(field => !trimmedData[field] || trimmedData[field] === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      );
    }

    // Validate phone format (simple regex)
    const phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(trimmedData.phone as string)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Map frontend data structure to backend expected format
    let firstName = '';
    let lastName = '';
    if (trimmedData.fullName) {
      const nameParts = (trimmedData.fullName as string).split(' ').filter(part => part.length > 0);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || firstName;
    }

    const backendData = {
      firstName,
      lastName,
      email: trimmedData.email,
      phone: trimmedData.phone,
      position: trimmedData.position,
      experience: trimmedData.experience,
      skills: trimmedData.skills,
      education: trimmedData.education,
      agree: trimmedData.agree !== undefined ? trimmedData.agree : true
    };

    const response = await fetch(`${backendUrl}/api/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(backendData)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || 'Failed to create profile' }, 
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Forward the request to the actual backend server
    const response = await fetch(`${backendUrl}/api/candidates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch profile' }, 
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}