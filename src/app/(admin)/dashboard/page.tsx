"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, FileText, CheckCircle2, AlertCircle, Activity, ChevronRight, LayoutDashboard, ArrowRightCircle } from "lucide-react";
import Link from "next/link";

// Fetch real stats from API
const fetchStats = async () => {
  const res = await fetch("/api/admin/dashboard");
  if (!res.ok) throw new Error("Failed to fetch stats");
  const result = await res.json();
  return result.data;
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchStats,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Welcome Hero Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pipdikti-sky/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pipdikti-navy/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#1a365d] to-[#2a528a] rounded-2xl shadow-md">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-slate-600 font-medium mt-1">
                Sistem Manajemen <span className="text-[#1a365d] font-semibold">PIP DIKTI</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-right">
              <p className="text-sm text-slate-500 font-medium">Status Sistem</p>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-600">Online</span>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 mx-2"></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Periode Pelaporan</p>
              <p className="font-bold text-slate-800 mt-0.5">{isLoading ? "..." : data?.activePeriodName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 px-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ringkasan Data Mahasiswa</h2>
        <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
          <LayoutDashboard className="h-4 w-4" />
          Statistik Keseluruhan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Terdaftar"
          value={isLoading ? "..." : data?.totalStudents?.toString()}
          icon={<Users className="h-7 w-7 text-white" />}
          iconBg="bg-gradient-to-br from-[#1a365d] to-[#2a528a]"
        />
        <StatCard
          title="Penerima Aktif"
          value={isLoading ? "..." : data?.activeStudents?.toString()}
          icon={<FileText className="h-7 w-7 text-white" />}
          iconBg="bg-gradient-to-br from-pipdikti-sky to-blue-500"
        />
        <StatCard
          title="Lanjut Semester Depan"
          value={isLoading ? "..." : data?.continuedStudents?.toString()}
          icon={<ArrowRightCircle className="h-7 w-7 text-white" />}
          iconBg="bg-gradient-to-br from-indigo-500 to-indigo-700"
        />
        <StatCard
          title="Telah Lulus"
          value={isLoading ? "..." : data?.graduatedStudents?.toString()}
          icon={<CheckCircle2 className="h-7 w-7 text-white" />}
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />
        <StatCard
          title="PIP Dicabut"
          value={isLoading ? "..." : data?.revokedStudents?.toString()}
          icon={<AlertCircle className="h-7 w-7 text-white" />}
          iconBg="bg-gradient-to-br from-pipdikti-gold to-amber-600"
        />
      </div>

      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-xl border border-white/60 p-8 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-pipdikti-sky" />
            Aktivitas Terbaru
          </h3>
          <Link href="#" className="text-sm font-semibold text-pipdikti-sky hover:text-blue-600 flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        {!data?.recentActivities || data?.recentActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Activity className="h-8 w-8 text-slate-300" />
            </div>
            <h4 className="text-slate-700 font-semibold mb-1">Belum Ada Aktivitas Baru</h4>
            <p className="text-sm text-slate-500 max-w-sm">
              Saat ini belum ada dokumen baru yang perlu ditinjau atau status yang diperbarui di sistem.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.recentActivities.map((activity: any) => (
              <Link href="/evaluasi" key={activity._id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{activity.mahasiswa_name} <span className="text-sm font-normal text-slate-500">({activity.mahasiswa_nim})</span></h4>
                    <p className="text-sm text-slate-600">Mengirimkan LPJ Periode <span className="font-medium">{activity.semester_berjalan}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full mb-1">
                    PERLU REVIEW
                  </span>
                  <p className="text-xs text-slate-500">
                    {new Date(activity.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, iconBg }: { title: string; value?: string; icon: React.ReactNode; iconBg: string }) {
  return (
    <div className="group bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-white/60 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Hover decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex items-center gap-5">
        <div className={`p-4 rounded-2xl shadow-md ${iconBg} transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-slate-800 group-hover:text-[#1a365d] transition-colors">{value || "0"}</p>
        </div>
      </div>
    </div>
  );
}
