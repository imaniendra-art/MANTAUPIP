import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import BerandaClient from "./BerandaClient";

export default async function StudentDashboardPage() {
  const session = await getSession();

  // Protect against access without changed password
  if (session && session.user.role === "MAHASISWA" && !session.user.isPasswordChanged) {
    redirect("/ubah-password");
  }

  return <BerandaClient />;
}
