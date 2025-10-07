import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const extension = path.extname(file.name);
    const filename = `${params.id}_${Date.now()}${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');

    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }

    // Save file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Update MongoDB with photo path
    const photoPath = `/uploads/profiles/${filename}`;
    const result = await db.collection('employees').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          photo: photoPath,
          updatedAt: new Date()
        },
        $inc: { updateCount: 1 }
      }
    );

    if (result.matchedCount === 0) {
      console.log('Employee not found in MongoDB, trying backend upload for ID:', params.id);

      // Try to upload to backend as fallback
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const backendFormData = new FormData();
        backendFormData.append('photo', file);

        const backendResponse = await fetch(`${backendUrl}/api/employees/${params.id}/profile/photo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: backendFormData,
        });

        if (backendResponse.ok) {
          const backendResult = await backendResponse.json();
          console.log('Successfully uploaded photo to backend for ID:', params.id);
          return NextResponse.json(backendResult);
        } else {
          console.log('Backend photo upload also failed for ID:', params.id, backendResponse.status);
        }
      } catch (backendError) {
        console.error('Error uploading photo to backend:', backendError);
      }

      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    console.log('Successfully uploaded photo to MongoDB for ID:', params.id);
    return NextResponse.json({
      message: 'Photo uploaded successfully',
      photoPath: photoPath
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();

    // Get current photo path
    const employee = await db.collection('employees').findOne({
      _id: new ObjectId(params.id)
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    if (!employee.photo) {
      return NextResponse.json(
        { error: 'No photo to delete' },
        { status: 400 }
      );
    }

    // Update database to remove photo
    const result = await db.collection('employees').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $unset: { photo: 1 },
        $set: { updatedAt: new Date() },
        $inc: { updateCount: 1 }
      }
    );

    return NextResponse.json({
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
