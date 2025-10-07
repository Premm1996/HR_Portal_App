import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Get current employee to check lock status
    const employee = await db.collection('employees').findOne({
      _id: new ObjectId(params.id)
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const lockState = {
      isLocked: employee.isLocked || false,
      lockedBy: employee.lockedBy || null,
      lockedAt: employee.lockedAt || null,
      canEdit: !employee.isLocked || employee.lockedBy === 'self'
    };

    return NextResponse.json({ lockState });
  } catch (error) {
    console.error('Error checking profile lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Get current employee
    const currentEmployee = await db.collection('employees').findOne({
      _id: new ObjectId(params.id)
    });

    if (!currentEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const { isLocked, lockedBy, lockedAt } = body;

    // Update the employee profile lock status
    const result = await db.collection('employees').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          isLocked: isLocked || false,
          lockedBy: lockedBy || null,
          lockedAt: lockedAt || null,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Fetch updated employee data
    const updatedEmployee = await db.collection('employees').findOne({
      _id: new ObjectId(params.id)
    });

    const lockState = {
      isLocked: updatedEmployee?.isLocked || false,
      lockedBy: updatedEmployee?.lockedBy || null,
      lockedAt: updatedEmployee?.lockedAt || null,
      canEdit: !updatedEmployee?.isLocked || updatedEmployee?.lockedBy === 'self'
    };

    return NextResponse.json({
      message: `Profile ${isLocked ? 'locked' : 'unlocked'} successfully`,
      lockState
    });
  } catch (error) {
    console.error('Error updating profile lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
