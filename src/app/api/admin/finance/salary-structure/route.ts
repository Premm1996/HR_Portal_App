import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${backendUrl}/api/admin/finance/salary-structure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching salary structures:', error);
    return NextResponse.json({ error: 'Failed to fetch salary structures' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const response = await fetch(`${backendUrl}/api/admin/finance/salary-structure`, {
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
    console.error('Error creating salary structure:', error);
    return NextResponse.json({ error: 'Failed to create salary structure' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();

    const response = await fetch(`${backendUrl}/api/admin/finance/salary-structure/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error updating salary structure:', error);
    return NextResponse.json({ error: 'Failed to update salary structure' }, { status: 500 });
  }
}
