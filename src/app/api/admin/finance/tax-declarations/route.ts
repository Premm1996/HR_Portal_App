import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${backendUrl}/api/admin/finance/tax-declarations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching tax declarations:', error);
    return NextResponse.json({ error: 'Failed to fetch tax declarations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const response = await fetch(`${backendUrl}/api/admin/finance/tax-declarations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating tax declaration:', error);
    return NextResponse.json({ error: 'Failed to create tax declaration' }, { status: 500 });
  }
}
