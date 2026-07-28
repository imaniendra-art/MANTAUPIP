import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { Period } from "@/models/Period";
import { ActivityLog } from "@/models/ActivityLog";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectDB();
    const periods = await Period.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: periods });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch periods" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, isActive } = await req.json();
    await connectDB();

    if (isActive) {
      await Period.updateMany({}, { isActive: false });
    }

    const newPeriod = await Period.create({ name, isActive });

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "CREATE",
      description: `Membuat periode baru: ${name}`,
    });

    return NextResponse.json({ success: true, data: newPeriod });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Periode dengan nama tersebut sudah ada." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create period" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, action, name } = await req.json(); 
    await connectDB();

    if (action === "RENAME") {
      const renamedPeriod = await Period.findByIdAndUpdate(id, { name }, { new: true });
      if (renamedPeriod) {
        await ActivityLog.create({
          adminName: session.user.name || "Admin",
          adminUsername: session.user.username || "admin",
          action: "UPDATE",
          description: `Mengubah nama periode menjadi: ${renamedPeriod.name}`,
        });
      }
      return NextResponse.json({ success: true, data: renamedPeriod });
    }

    // Default is ACTIVATE
    await Period.updateMany({}, { isActive: false });
    const activatedPeriod = await Period.findByIdAndUpdate(id, { isActive: true }, { new: true });

    if (activatedPeriod) {
      await ActivityLog.create({
        adminName: session.user.name || "Admin",
        adminUsername: session.user.username || "admin",
        action: "UPDATE",
        description: `Mengaktifkan periode: ${activatedPeriod.name}`,
      });
    }

    return NextResponse.json({ success: true, data: activatedPeriod });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update period" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectDB();
    const period = await Period.findById(id);
    if (!period) return NextResponse.json({ error: "Periode tidak ditemukan" }, { status: 404 });
    if (period.isActive) return NextResponse.json({ error: "Tidak bisa menghapus periode yang sedang aktif" }, { status: 400 });

    await Period.findByIdAndDelete(id);

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "DELETE",
      description: `Menghapus periode: ${period.name}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete period" }, { status: 500 });
  }
}
