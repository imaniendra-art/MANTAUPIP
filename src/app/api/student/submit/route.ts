import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Log placeholder received data
    console.log('Received submission:', {
      semester: formData.get('semester'),
      ipk: formData.get('ipk'),
      sks: formData.get('sks'),
      periode: formData.get('periode'),
    });

    // In a real implementation, you would:
    // 1. Upload files to cloud storage (e.g. AWS S3, Google Cloud Storage, or Vercel Blob)
    // 2. Save the EvaluasiAkademik record via Prisma
    // 3. Save the LpjKeuangan record via Prisma
    
    return NextResponse.json({ success: true, message: 'Data submitted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Submission failed' }, { status: 500 });
  }
}
