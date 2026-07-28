import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectDB();
    const admins = await User.find({ role: "ADMIN" }).select("-password");
    return NextResponse.json({ success: true, data: admins });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nama_lengkap, username, password } = await req.json();
    await connectDB();

    const existingAdmin = await User.findOne({ username, role: "ADMIN" });
    if (existingAdmin) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
    }

    const newAdmin = await User.create({
      role: "ADMIN",
      nama_lengkap,
      username,
      password,
      status_pip: "AKTIF" // Placeholder for required schema field
    });

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "CREATE",
      description: `Menambahkan Admin baru: ${nama_lengkap} (${username})`,
    });

    const safeAdmin = {
      _id: newAdmin._id,
      nama_lengkap: newAdmin.nama_lengkap,
      username: newAdmin.username,
      role: newAdmin.role
    };

    return NextResponse.json({ success: true, data: safeAdmin });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, newPassword } = await req.json();
    await connectDB();

    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    admin.password = newPassword;
    await admin.save();

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "UPDATE",
      description: `Mereset password admin: ${admin.nama_lengkap} (${admin.username || admin.nim})`,
    });

    return NextResponse.json({ success: true, message: "Password berhasil direset" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mereset password" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, nama_lengkap, username } = await req.json();
    await connectDB();

    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });
    }

    // Cek username bentrok
    if (username !== admin.username) {
      const existing = await User.findOne({ username, role: "ADMIN" });
      if (existing) {
        return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
      }
    }

    admin.nama_lengkap = nama_lengkap;
    admin.username = username;
    await admin.save();

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "UPDATE",
      description: `Mengubah profil admin: ${nama_lengkap} (${username})`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengubah admin" }, { status: 500 });
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
    const admin = await User.findById(id);
    if (!admin) return NextResponse.json({ error: "Admin tidak ditemukan" }, { status: 404 });

    // Jangan hapus diri sendiri (opsional) atau setidaknya jangan hapus super admin
    if (admin.username === "admin" && admin.nama_lengkap === "Administrator MANTAU PIP") {
      return NextResponse.json({ error: "Tidak bisa menghapus Super Admin bawaan" }, { status: 400 });
    }
    if (admin._id.toString() === session.user.id) {
      return NextResponse.json({ error: "Tidak bisa menghapus akun yang sedang digunakan" }, { status: 400 });
    }

    await User.findByIdAndDelete(id);

    await ActivityLog.create({
      adminName: session.user.name || "Admin",
      adminUsername: session.user.username || "admin",
      action: "DELETE",
      description: `Menghapus admin: ${admin.nama_lengkap} (${admin.username || admin.nim})`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus admin" }, { status: 500 });
  }
}
