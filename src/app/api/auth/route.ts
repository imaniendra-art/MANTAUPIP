import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Placeholder authentication logic
    if (body.nim === 'admin' && body.password === 'admin') {
      return NextResponse.json({ success: true, role: 'ADMIN' });
    }
    
    return NextResponse.json({ success: true, role: 'MAHASISWA' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
