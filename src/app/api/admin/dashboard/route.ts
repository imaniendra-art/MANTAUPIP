import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { Period } from "@/models/Period";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const totalStudents = await User.countDocuments({ role: "MAHASISWA" });
    const activeStudents = await User.countDocuments({ role: "MAHASISWA", status_pip: "AKTIF" });
    const graduatedStudents = await User.countDocuments({ role: "MAHASISWA", status_pip: "LULUS" });
    const revokedStudents = await User.countDocuments({ role: "MAHASISWA", status_pip: "DICABUT" });

    const activePeriod = await Period.findOne({ isActive: true });

    const { Lpj } = await import("@/models/Lpj");
    
    // Count students who are approved for the active period but still active (not graduated)
    let continuedStudents = 0;
    if (activePeriod) {
      const approvedLpjs = await Lpj.find({
        semester_berjalan: activePeriod.name,
        status_laporan: "DISETUJUI"
      }).populate("mahasiswa_id", "status_pip").lean();
      
      continuedStudents = approvedLpjs.filter((lpj: any) => 
        lpj.mahasiswa_id && lpj.mahasiswa_id.status_pip === "AKTIF"
      ).length;
    }

    const recentActivities = await Lpj.find({ status_laporan: "MENUNGGU" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("mahasiswa_id", "nama_lengkap nim")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        graduatedStudents,
        revokedStudents,
        continuedStudents,
        activePeriodName: activePeriod ? activePeriod.name : "Belum diatur",
        recentActivities: recentActivities.map(activity => ({
          _id: activity._id,
          mahasiswa_name: (activity.mahasiswa_id as any)?.nama_lengkap || "Unknown",
          mahasiswa_nim: (activity.mahasiswa_id as any)?.nim || "-",
          semester_berjalan: activity.semester_berjalan,
          status_laporan: activity.status_laporan,
          updatedAt: activity.updatedAt,
        }))
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
