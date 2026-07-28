"use server";

import { getSession, createSession } from "@/lib/session";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { redirect } from "next/navigation";

export async function changePasswordAction(prevState: any, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MAHASISWA") {
      return { error: "Akses ditolak." };
    }

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || newPassword.length < 6) {
      return { error: "Password harus minimal 6 karakter." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Konfirmasi password tidak cocok." };
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "Pengguna tidak ditemukan." };
    }

    user.password = newPassword;
    user.isPasswordChanged = true;
    await user.save();

    // Update session
    await createSession({
      id: user.id,
      role: user.role,
      name: user.nama_lengkap,
      username: user.nim,
      isPasswordChanged: true
    });

    return { success: true };
  } catch (error) {
    return { error: "Gagal menyimpan password baru." };
  }
}
