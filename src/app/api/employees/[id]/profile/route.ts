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

    console.log('Fetching employee profile for ID:', params.id);

    // Try to fetch from backend first since employee data is in MySQL
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const backendResponse = await fetch(`${backendUrl}/api/employees/${params.id}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        console.log('Successfully fetched employee data from backend for ID:', params.id);
        return NextResponse.json(backendData);
      } else {
        console.log('Backend returned error for employee ID:', params.id, backendResponse.status);
      }
    } catch (backendError) {
      console.error('Error fetching from backend:', backendError);
    }

    // Fallback to MongoDB if backend fails
    console.log('Backend lookup failed, trying MongoDB fallback for ID:', params.id);
    const employee = await db.collection('employees').findOne({
      _id: employeeId
    });

    if (!employee) {
      console.log('Employee not found in both backend and MongoDB for ID:', params.id);
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information before sending
    const { password, ...safeEmployeeData } = employee;

    console.log('Successfully fetched employee profile from MongoDB fallback for ID:', params.id);
    return NextResponse.json(safeEmployeeData);

  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
