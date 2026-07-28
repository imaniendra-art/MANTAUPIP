import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { Lpj } from "@/models/Lpj";
import { connectDB } from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MAHASISWA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      semester_berjalan,
      data_akademik,
      data_non_akademik,
      data_biaya_hidup,
      data_kondisi_ekonomi,
      data_pakta_integritas 
    } = await req.json();

    await connectDB();

    // Cek apakah sudah ada LPJ di semester ini
    const existingLpj = await Lpj.findOne({
      mahasiswa_id: session.user.id,
      semester_berjalan: semester_berjalan || "2025/2026 Genap"
    });

    if (existingLpj && existingLpj.status_laporan === "DISETUJUI") {
      return NextResponse.json({ error: "Laporan untuk semester ini sudah disetujui, tidak dapat diubah" }, { status: 400 });
    }

    if (existingLpj) {
      // Update
      existingLpj.data_akademik = data_akademik;
      existingLpj.data_non_akademik = data_non_akademik;
      existingLpj.data_biaya_hidup = data_biaya_hidup;
      existingLpj.data_kondisi_ekonomi = data_kondisi_ekonomi;
      existingLpj.data_pakta_integritas = data_pakta_integritas;
      existingLpj.status_laporan = "MENUNGGU"; // Reset status to waiting review
      await existingLpj.save();
    } else {
      // Create new
      const newLpj = new Lpj({
        mahasiswa_id: session.user.id,
        semester_berjalan: semester_berjalan || "2025/2026 Genap",
        data_akademik,
        data_non_akademik,
        data_biaya_hidup,
        data_kondisi_ekonomi,
        data_pakta_integritas,
        status_laporan: "MENUNGGU"
      });
      await newLpj.save();
    }

    return NextResponse.json({
      success: true,
      message: "Laporan LPJ berhasil dikirim",
    });
  } catch (error) {
    console.error("Mahasiswa LPJ POST Error:", error);
    return NextResponse.json({ error: "Failed to submit LPJ" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MAHASISWA") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all submissions sorted by latest
    const lpjs = await Lpj.find({ mahasiswa_id: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: lpjs,
    });
  } catch (error) {
    console.error("Mahasiswa LPJ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch LPJ data" }, { status: 500 });
  }
}
