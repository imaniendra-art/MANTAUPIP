import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import { ActivityLog } from '@/models/ActivityLog';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Check for hardcoded default admin to bootstrap
    if (body.nim === 'admin' && body.password === 'admin') {
      let admin = await User.findOne({ username: 'admin', role: 'ADMIN' });
      if (!admin) {
        admin = await User.create({
          role: 'ADMIN',
          nama_lengkap: 'Super Admin',
          username: 'admin',
          password: 'admin', 
          status_pip: 'AKTIF' // required field placeholder
        });
      }
    }

    // Check DB for admin
    const adminUser = await User.findOne({ username: body.nim, role: 'ADMIN' });
    if (adminUser) {
      if (adminUser.password === body.password) {
        // Log Activity
        await ActivityLog.create({
          adminName: adminUser.nama_lengkap,
          adminUsername: adminUser.username,
          action: "LOGIN",
          description: `Admin ${adminUser.nama_lengkap} berhasil login.`
        });

        return NextResponse.json({ 
          success: true, 
          role: 'ADMIN', 
          id: adminUser._id.toString(), 
          name: adminUser.nama_lengkap,
          username: adminUser.username
        });
      }
    }
    
    // Placeholder logic for Mahasiswa (not implemented fully)
    return NextResponse.json({ success: true, role: 'MAHASISWA' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
