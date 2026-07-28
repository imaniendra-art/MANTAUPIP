"use server";

import { getSession, createSession } from "@/lib/session";
import { User } from "@/models/User";
import { connectDB } from "@/lib/mongoose";
import { redirect } from "next/navigation";

export type PasswordActionState = {
  error: string;
  success: boolean;
};

export async function changePasswordAction(prevState: PasswordActionState, formData: FormData): Promise<PasswordActionState> {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "MAHASISWA") {
      return { error: "Akses ditolak.", success: false };
    }

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || newPassword.length < 6) {
      return { error: "Password harus minimal 6 karakter.", success: false };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Konfirmasi password tidak cocok.", success: false };
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "Pengguna tidak ditemukan.", success: false };
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

    return { success: true, error: "" };
  } catch (error) {
    return { error: "Gagal menyimpan password baru.", success: false };
  }
}
