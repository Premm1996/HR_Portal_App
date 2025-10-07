export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${backendUrl}/api/finance/salary-structure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching salary structure:', error);
    return NextResponse.json({ error: 'Failed to fetch salary structure' }, { status: 500 });
  }
}
