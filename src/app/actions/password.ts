"use server";

import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { getSession, createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function changePasswordAction(prevState: any, formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  if (newPassword.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const session = await getSession();
  if (!session || session.user.role !== "MAHASISWA") {
    return { error: "Akses ditolak." };
  }

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) {
    return { error: "Pengguna tidak ditemukan." };
  }

  // Cek apakah password baru sama dengan default (NIM atau password123)
  if (newPassword === user.nim || newPassword === "password123") {
    return { error: "Password baru tidak boleh sama dengan password default/NIM." };
  }

  user.password = newPassword;
  user.isPasswordChanged = true;
  await user.save();

  // Update session
  await createSession({
    id: user.id,
    role: user.role,
    name: user.nama_lengkap,
    username: user.username || user.nim,
    isPasswordChanged: true
  });

  redirect("/beranda");
}
