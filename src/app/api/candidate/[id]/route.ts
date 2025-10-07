import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Replace with a fetch/axios call to your backend REST API
  // const [rows] = await pool.query('SELECT * FROM student_profiles WHERE id = ?', [id]);
  // return NextResponse.json(rows[0] || {});
  return NextResponse.json({ error: 'Not implemented. Use backend API.' });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO: Replace with a fetch/axios call to your backend REST API
  // const data = await req.json();
  // await pool.query('UPDATE student_profiles SET ? WHERE id = ?', [data, id]);
  // return NextResponse.json({ success: true });
  return NextResponse.json({ error: 'Not implemented. Use backend API.' });
}
