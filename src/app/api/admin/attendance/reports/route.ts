import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);

    // Build query parameters for backend
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    const response = await fetch(`${backendUrl}/api/admin/attendance/reports?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    });

    if (searchParams.get('format') === 'excel' || searchParams.get('format') === 'csv') {
      // Return the file as blob
      const blob = await response.blob();
      return new NextResponse(blob, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
          'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment; filename=report.xlsx'
        }
      });
    }

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
