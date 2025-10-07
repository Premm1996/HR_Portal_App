import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Validate ObjectId format
    let employeeId;
    try {
      employeeId = new ObjectId(params.id);
    } catch (error) {
      console.error('Invalid ObjectId format:', params.id);
      return NextResponse.json(
        { error: 'Invalid employee ID format' },
        { status: 400 }
      );
    }

    console.log('Fetching profile stats for ID:', params.id);

    // Get employee profile data from MongoDB
    const employee = await db.collection('employees').findOne({
      _id: employeeId
    });

    if (!employee) {
      console.log('Employee not found in MongoDB for stats, trying backend for ID:', params.id);

      // Try to fetch from backend as fallback
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const backendResponse = await fetch(`${backendUrl}/api/employees/${params.id}/profile/stats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (backendResponse.ok) {
          const backendStats = await backendResponse.json();
          console.log('Successfully fetched profile stats from backend for ID:', params.id);
          return NextResponse.json(backendStats);
        } else {
          console.log('Backend also returned error for stats ID:', params.id, backendResponse.status);
        }
      } catch (backendError) {
        console.error('Error fetching stats from backend:', backendError);
      }

      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Calculate profile statistics
    const stats = {
      accountCreated: employee.createdAt || null,
      profileCompleted: calculateProfileCompletion(employee),
      documentsUploaded: employee.documents?.length || 0,
      lastUpdated: employee.updatedAt || null,
      totalUpdates: employee.updateCount || 0
    };

    console.log('Successfully fetched profile stats from MongoDB for ID:', params.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateProfileCompletion(employee: any): number {
  const fields = [
    'fullName',
    'email',
    'mobile',
    'dob',
    'gender',
    'nationality',
    'qualification',
    'specialization',
    'college',
    'graduationYear',
    'cgpa',
    'position',
    'experience',
    'location',
    'expectedSalary'
  ];

  let completedFields = 0;

  fields.forEach(field => {
    if (employee[field] && employee[field].toString().trim() !== '') {
      completedFields++;
    }
  });

  // Add photo completion
  if (employee.photo) {
    completedFields++;
  }

  // Add documents completion (if at least one document)
  if (employee.documents && employee.documents.length > 0) {
    completedFields++;
  }

  return Math.round((completedFields / (fields.length + 2)) * 100); // +2 for photo and documents
}
