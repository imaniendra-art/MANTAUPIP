import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { Period } from "@/models/Period";
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

    const activePeriod = await Period.findOne({ isActive: true });
    
    return NextResponse.json({
      success: true,
      data: {
        name: user.nama_lengkap,
        nim: user.nim || "-",
        program_studi: user.program_studi || "Belum diatur",
        status: user.status_pip,
        ipk: (user as any).ipk || "-",
        semester: activePeriod ? activePeriod.name : "Belum diatur",
        angkatan: user.angkatan || "-",
      }
    });
  } catch (error) {
    console.error("Mahasiswa Dashboard Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
