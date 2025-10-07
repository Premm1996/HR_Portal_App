import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${backendUrl}/api/attendance/break/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    let message = 'Server error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message: 'Server error', details: message }, { status: 500 });
  }
}
