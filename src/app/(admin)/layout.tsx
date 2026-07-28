import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  FileCheck, 
  LogOut, 
  GraduationCap,
  Users,
  Calendar,
  Settings
} from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import AdminSidebarNav from "./AdminSidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Wrapper for floating effect */}
      <div className="hidden md:flex p-4 h-full">
        <aside className="w-64 bg-[#1a5eb8] text-white flex flex-col rounded-3xl shadow-2xl overflow-hidden z-10 relative">
          
          {/* Logo Section */}
          <div className="pt-8 pb-6 px-6 flex flex-col items-center border-b border-white/10">
            <div className="flex justify-center items-center gap-4 mb-4 bg-white py-3 px-4 rounded-2xl shadow-md w-full">
              <Image 
                src="/logo_stimi.png" 
                alt="Logo STIMI" 
                width={64} 
                height={64}
                className="object-contain"
              />
              <Image 
                src="/mantaupip_logo_trns.png" 
                alt="Logo MANTAU PIP" 
                width={64} 
                height={64}
                className="object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="font-extrabold text-sm tracking-wider text-center">
              MANTAU PIP DIKTI STIMI
            </h1>
            <div className="w-10 h-0.5 bg-pipdikti-gold mt-2 rounded-full"></div>
          </div>
          
          {/* Navigation - Extracted to Client Component for active states */}
          <AdminSidebarNav />
          
          <div className="p-4 border-t border-white/10 bg-[#1550a1]">
            <form action={logoutAction}>
              <button 
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 transition-colors hover:bg-white/10 hover:text-white font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center px-8 md:hidden justify-between shadow-sm">
            <h1 className="font-bold text-base text-pipdikti-navy tracking-tight">MANTAU PIP DIKTI</h1>
            <form action={logoutAction}>
              <button type="submit" className="text-gray-500 hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
