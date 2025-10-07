import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Build query string for backend
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('limit', limit);

    // Forward request to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/admin/employees?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();

    // Enhance employee data with profile information including photos
    if (data.employees && Array.isArray(data.employees)) {
      const enhancedEmployees = await Promise.all(
        data.employees.map(async (employee: any) => {
          try {
            // Fetch profile data for each employee
            const profileResponse = await fetch(`${backendUrl}/api/employees/${employee.id}/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              return {
                ...employee,
                photo: profileData.photo || null,
                position: profileData.position || employee.position || 'Employee',
                department: profileData.department || employee.department || 'Engineering'
              };
            }
          } catch (error) {
            console.error(`Error fetching profile for employee ${employee.id}:`, error);
          }

          return {
            ...employee,
            photo: null,
            position: employee.position || 'Employee',
            department: employee.department || 'Engineering'
          };
        })
      );

      data.employees = enhancedEmployees;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
