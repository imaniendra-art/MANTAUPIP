import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MAHASISWA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.nama_lengkap,
        nim: user.nim || "-",
        program_studi: user.program_studi || "-",
        nik: user.nik || "",
        no_hp: user.no_hp || "",
      }
    });
  } catch (error) {
    console.error("Mahasiswa Profil GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MAHASISWA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nik, no_hp } = await req.json();

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        nik,
        no_hp
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    console.error("Mahasiswa Profil PUT Error:", error);
    return NextResponse.json({ error: "Failed to update profil" }, { status: 500 });
  }
}
