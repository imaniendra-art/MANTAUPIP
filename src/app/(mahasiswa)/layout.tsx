import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogOut, GraduationCap } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";

export default async function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "MAHASISWA") {
    redirect("/login");
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg_app.png')" }}
    >
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] -z-10 pointer-events-none" />
      
      <nav className="sticky top-0 bg-white/70 backdrop-blur-md text-slate-800 shadow-sm border-b border-white/40 z-20 transition-all">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex h-16 justify-between items-center">
            <Link href="/beranda" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src="/mantaupip_logo_trns.png" alt="MANTAU PIP Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1a365d]">
                MANTAU PIP DIKTI
              </span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/akun"
                className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white/50 hover:bg-blue-50 px-4 py-2 rounded-xl shadow-sm border border-white/50"
              >
                <div className="p-1 bg-slate-200 rounded-full text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span className="hidden sm:inline">Akun</span>
              </Link>
              
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors bg-white/50 hover:bg-red-50 px-4 py-2 rounded-xl shadow-sm border border-white/50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full relative z-0 py-8 px-4 sm:px-8 lg:px-12">
        {children}
      </div>
    </div>
  );
}
