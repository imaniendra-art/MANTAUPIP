import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { LpjKeuangan } from "@/models/LpjKeuangan";
import { EvaluasiAkademik } from "@/models/EvaluasiAkademik";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { Lpj } = await import("@/models/Lpj");
    
    // Fetch LPJ
    const lpjs = await Lpj.find().populate({
      path: "mahasiswa_id",
      model: User,
      select: "nama_lengkap nim jenjang program_studi angkatan"
    }).sort({ createdAt: -1 });

    const evaluations: any[] = [];

    const getSemester = (angkatanStr: string, periodeStr: string) => {
      if (!angkatanStr || !periodeStr) return "-";
      const angkatan = parseInt(angkatanStr);
      const match = periodeStr.match(/^(\d{4})\/(\d{4})\s+(Ganjil|Genap)$/i);
      if (!match) return "-";
      const startYear = parseInt(match[1]);
      const isGenap = match[3].toLowerCase() === "genap";
      const yearDiff = startYear - angkatan;
      if (yearDiff < 0) return "-";
      return (yearDiff * 2) + (isGenap ? 2 : 1);
    };

    lpjs.forEach((lpj: any) => {
      if (lpj.mahasiswa_id) {
        evaluations.push({
          id: `lpj_${lpj._id}`,
          name: lpj.mahasiswa_id.nama_lengkap,
          nim: lpj.mahasiswa_id.nim || "-",
          angkatan: lpj.mahasiswa_id.angkatan || "-",
          semesterPelaporan: getSemester(lpj.mahasiswa_id.angkatan, lpj.semester_berjalan),
          periode: lpj.semester_berjalan || "-",
          status: lpj.status_laporan || "MENUNGGU",
          type: "LPJ",
          createdAt: lpj.createdAt
        });
      }
    });

    // Sort by date
    evaluations.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ success: true, data: evaluations });
  } catch (error) {
    console.error("Fetch evaluations error:", error);
    return NextResponse.json({ error: "Failed to fetch evaluations" }, { status: 500 });
  }
}
