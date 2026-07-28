import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/mongoose";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    const { Lpj } = await import("@/models/Lpj");
    const { User } = await import("@/models/User");
    
    const lpj = await Lpj.findById(id).populate({
      path: "mahasiswa_id",
      model: User,
      select: "nama_lengkap nim jenjang program_studi angkatan fakultas"
    }).lean();

    if (!lpj) {
      return NextResponse.json({ error: "LPJ tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lpj });
  } catch (error) {
    console.error("GET LPJ Detail error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { status_laporan, catatan_revisi } = body;
    
    if (!["DISETUJUI", "REVISI", "MENUNGGU"].includes(status_laporan)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }
    
    await connectDB();
    const { Lpj } = await import("@/models/Lpj");
    const { User } = await import("@/models/User");
    
    const updateData: any = { status_laporan };
    if (status_laporan === "REVISI" && catatan_revisi) {
      updateData.catatan_revisi = catatan_revisi;
    } else {
      updateData.catatan_revisi = ""; // Clear notes if approved
    }
    
    const updated = await Lpj.findByIdAndUpdate(id, updateData, { new: true }).populate({
      path: "mahasiswa_id",
      model: User,
      select: "angkatan"
    });
    
    if (!updated) {
      return NextResponse.json({ error: "LPJ tidak ditemukan" }, { status: 404 });
    }

    // Auto-lulus logic
    if (status_laporan === "DISETUJUI" && updated.mahasiswa_id && updated.semester_berjalan) {
      const mhs = updated.mahasiswa_id as any;
      const angkatanStr = mhs.angkatan;
      const periodeStr = updated.semester_berjalan;
      if (angkatanStr && periodeStr) {
        const angkatan = parseInt(angkatanStr);
        const match = periodeStr.match(/^(\d{4})\/(\d{4})\s+(Ganjil|Genap)$/i);
        if (match) {
          const startYear = parseInt(match[1]);
          const isGenap = match[3].toLowerCase() === "genap";
          const yearDiff = startYear - angkatan;
          if (yearDiff >= 0) {
            const semester = (yearDiff * 2) + (isGenap ? 2 : 1);
            if (semester >= 8) {
              await User.findByIdAndUpdate(updated.mahasiswa_id._id, { status_pip: "LULUS" });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT LPJ Detail error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
