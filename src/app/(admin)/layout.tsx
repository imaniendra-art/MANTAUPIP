import Link from "next/link";
import { 
  LayoutDashboard, 
  FileCheck, 
  LogOut, 
  GraduationCap
} from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

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
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 bg-pipdikti-navy/95 backdrop-blur-md text-white flex flex-col hidden md:flex shadow-2xl border-r border-white/10 z-10">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <GraduationCap className="h-8 w-8 text-pipdikti-gold" />
          <div>
            <h1 className="font-bold text-lg tracking-tight">MANTAU PIP DIKTI</h1>
            <p className="text-xs text-pipdikti-sky font-semibold">Admin Dashboard</p>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <LayoutDashboard className="h-5 w-5 text-pipdikti-sky" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link 
            href="/evaluasi" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <FileCheck className="h-5 w-5" />
            <span className="font-medium">Evaluasi Dokumen</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button 
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 transition-colors hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-white/85 backdrop-blur-sm">
        <header className="bg-white/50 backdrop-blur-md border-b border-white/30 h-16 flex items-center px-8 md:hidden justify-between shadow-sm">
            <h1 className="font-bold text-base text-pipdikti-navy tracking-tight">MANTAU PIP DIKTI</h1>
            <form action={logoutAction}>
              <button type="submit" className="text-gray-500 hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
