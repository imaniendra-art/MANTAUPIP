import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { connectDB } from "@/lib/mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const users = await User.find({ role: "MAHASISWA" }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    await connectDB();

    // Cek apakah NIM sudah terdaftar
    if (body.nim) {
      const existing = await User.findOne({ nim: body.nim });
      if (existing) {
        return NextResponse.json({ error: "Mahasiswa dengan NIM tersebut sudah terdaftar." }, { status: 400 });
      }
    }

    const newUser = new User({
      nim: body.nim,
      nama_lengkap: body.nama_lengkap,
      program_studi: body.program_studi,
      angkatan: body.angkatan,
      jenjang: body.jenjang || "S1",
      status_pip: body.status_pip || "AKTIF",
      bp: Number(body.bp) || 0,
      bh: Number(body.bh) || 0,
      role: "MAHASISWA",
      password: body.nim // default password
    });

    await newUser.save();

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "CREATE",
      description: `Menambahkan mahasiswa penerima manual: ${newUser.nama_lengkap} (${newUser.nim})`,
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Gagal menambahkan data" }, { status: 500 });
  }
}
