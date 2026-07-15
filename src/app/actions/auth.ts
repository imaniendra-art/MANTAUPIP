"use server";

import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { createSession, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const nim = formData.get("nim") as string;
  const password = formData.get("password") as string;

  if (!nim || !password) {
    return { error: "NIM dan Password wajib diisi." };
  }

  await connectDB();

  // Find user by NIM
  const user = await User.findOne({ nim });

  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  // In a real app, you MUST hash passwords. For this implementation demo:
  // We allow login if password matches 'password123' or if it matches the NIM.
  if (password !== "password123" && password !== nim) {
    return { error: "Password salah." };
  }

  // Create session
  await createSession({ id: user.id, role: user.role });

  // Redirect based on role
  if (user.role === "ADMIN") {
    redirect("/dashboard");
  } else {
    redirect("/beranda");
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
