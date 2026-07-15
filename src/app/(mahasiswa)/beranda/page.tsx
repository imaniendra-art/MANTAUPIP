"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, ShieldCheck, Home, Wallet, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Mock data for UI development
const fetchStudentData = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    name: "Budi Santoso",
    status: "Aktif",
    ipk: "3.75",
    semester: "Ganjil 2026/2027",
    lastUpdate: "14 Juli 2026",
  };
};

export default function StudentDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["studentData"],
    queryFn: fetchStudentData,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Welcome Hero Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pipdikti-sky/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pipdikti-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Selamat Datang, {isLoading ? "..." : <span className="text-[#1a365d]">{data?.name}</span>}
            </h1>
            <p className="text-slate-600 font-medium text-lg">
              Semester {isLoading ? "..." : data?.semester}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium">Status PIP</p>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-bold text-emerald-600 text-lg">{isLoading ? "..." : data?.status}</span>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-2"></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">IPK Terakhir</p>
              <p className="font-bold text-slate-800 text-lg mt-0.5">{isLoading ? "..." : data?.ipk}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 px-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Menu Utama</h2>
        <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" />
          Lengkapi sebelum tenggat waktu
        </span>
      </div>

      {/* Main Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <ActionCard 
          title="Evaluasi Akademik" 
          description="Unggah Kartu Hasil Studi (KHS) semester terakhir untuk validasi prestasi."
          icon={<FileText className="h-7 w-7 text-white" />}
          href="/unggah-berkas"
          iconBg="bg-gradient-to-br from-[#1a365d] to-[#2a528a]"
        />
        
        <ActionCard 
          title="Pakta Integritas" 
          description="Konfirmasi kebenaran data dan bebas potongan biaya hidup (pungutan liar)."
          icon={<ShieldCheck className="h-7 w-7 text-white" />}
          href="#"
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />

        <ActionCard 
          title="Pembaruan Kondisi" 
          description="Lapor status cuti, pindah, atau pembaruan kondisi ekonomi keluarga."
          icon={<Home className="h-7 w-7 text-white" />}
          href="#"
          iconBg="bg-gradient-to-br from-pipdikti-gold to-amber-600"
        />

        <ActionCard 
          title="Histori Pencairan" 
          description="Pantau riwayat pencairan dan status penyaluran dana KIP Kuliah Anda."
          icon={<Wallet className="h-7 w-7 text-white" />}
          href="#"
          iconBg="bg-gradient-to-br from-pipdikti-sky to-blue-500"
        />
        
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, href, iconBg }: { title: string, description: string, icon: React.ReactNode, href: string, iconBg: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl border border-white/60 transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col justify-between relative overflow-hidden">
        
        {/* Hover decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="flex items-start gap-5 relative z-10">
          <div className={`p-4 rounded-2xl shadow-md ${iconBg} transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#1a365d] transition-colors">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-end text-[#1a365d] font-semibold text-sm relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <span>Akses Menu</span>
          <ChevronRight className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
