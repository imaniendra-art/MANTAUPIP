import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { connectDB } from "@/lib/mongoose";

// Edit User
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "UPDATE",
      description: `Mengubah data mahasiswa: ${updatedUser.nama_lengkap} (${updatedUser.nim})`,
    });

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui", data: updatedUser });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}

// Delete User
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await connectDB();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "DELETE",
      description: `Menghapus data mahasiswa: ${deletedUser.nama_lengkap} (${deletedUser.nim})`,
    });

    return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

// Reset Password Mahasiswa
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    if (body.action !== "RESET_PASSWORD") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(id);
    
    if (!user || user.role !== "MAHASISWA") {
      return NextResponse.json({ error: "Mahasiswa tidak ditemukan" }, { status: 404 });
    }

    user.password = user.nim;
    user.isPasswordChanged = false;
    await user.save();

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "UPDATE",
      description: `Mereset password mahasiswa: ${user.nama_lengkap} (${user.nim})`,
    });

    return NextResponse.json({ success: true, message: "Password berhasil direset ke NIM" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Gagal mereset password" }, { status: 500 });
  }
}
