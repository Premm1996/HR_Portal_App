import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    // Get current employee to preserve existing data
    const currentEmployee = await db.collection('employees').findOne({
      _id: new ObjectId(params.id)
    });

    if (!currentEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      ...body,
      updatedAt: new Date(),
      $inc: { updateCount: 1 }
    };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData._id;
    delete updateData.createdAt;

    // Update the employee profile
    const result = await db.collection('employees').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
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

    return NextResponse.json({
      message: 'Profile updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();

    const employee = await db.collection('employees').findOne({
      _id: new ObjectId(params.id)
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information before sending
    const { password, ...safeEmployeeData } = employee;

    return NextResponse.json(safeEmployeeData);
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
