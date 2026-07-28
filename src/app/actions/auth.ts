"use server";

import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { createSession, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const nim = formData.get("nim") as string;
  const password = formData.get("password") as string;

  if (!nim || !password) {
    return { error: "NIM dan Password wajib diisi." };
  }

  await connectDB();

  // Bootstrap default admin if logging in as admin/admin and doesn't exist
  if (nim === "admin" && password === "admin") {
    let admin = await User.findOne({ username: "admin", role: "ADMIN" });
    if (!admin) {
      admin = await User.create({
        role: "ADMIN",
        nama_lengkap: "Super Admin",
        username: "admin",
        password: "admin",
        status_pip: "AKTIF"
      });
    }
  }

  // Find user by NIM or username
  const user = await User.findOne({
    $or: [{ nim: nim }, { username: nim }]
  });

  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  if (user.role === "ADMIN") {
    // If it's an old admin account without a password field, fallback to checking if they typed the NIM or "password123" (the old default)
    const expectedPassword = user.password || user.nim || "password123";
    
    if (user.password) {
      if (user.password !== password) {
        return { error: "Password salah." };
      }
    } else {
      // Fallback for old accounts
      if (password !== expectedPassword && password !== "password123") {
        return { error: "Password salah." };
      }
    }
    // Log Activity
    await ActivityLog.create({
      adminName: user.nama_lengkap || "Admin",
      adminUsername: user.username || user.nim || "admin",
      action: "LOGIN",
      description: `Admin ${user.nama_lengkap} berhasil login.`,
    });
  } else {
    // MAHASISWA
    const expectedPassword = user.password || user.nim;
    if (password !== expectedPassword && password !== "password123") {
      return { error: "Password salah." };
    }
  }

  // Create session
  await createSession({ 
    id: user.id, 
    role: user.role,
    name: user.nama_lengkap,
    username: user.username || user.nim,
    isPasswordChanged: user.isPasswordChanged || false
  });

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/dashboard");
  } else {
    if (!user.isPasswordChanged) {
      redirect("/ubah-password");
    } else {
      redirect("/beranda");
    }
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
