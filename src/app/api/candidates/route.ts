import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with a fetch/axios call to your backend REST API
  // const [rows] = await pool.query('SELECT * FROM student_profiles');
  return NextResponse.json({ error: 'Not implemented. Use backend API.' });
}
