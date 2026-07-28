"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, ShieldCheck, Home, Wallet, ChevronRight, AlertCircle, CheckCircle2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const fetchStudentData = async () => {
  const res = await fetch("/api/mahasiswa/dashboard");
  if (!res.ok) throw new Error("Gagal mengambil data");
  const result = await res.json();
  return result.data;
};

const fetchLpjData = async () => {
  const res = await fetch("/api/mahasiswa/lpj");
  if (!res.ok) return [];
  const result = await res.json();
  return result.data || [];
};

export default function BerandaClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["studentData"],
    queryFn: fetchStudentData,
  });

  const { data: lpjs } = useQuery({
    queryKey: ["lpjs"],
    queryFn: fetchLpjData,
  });

  const [draftStatus, setDraftStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDraftStatus({
      prestasiAkademik: !!localStorage.getItem("draft_prestasi_akademik"),
      prestasiNonAkademik: !!localStorage.getItem("draft_prestasi_non_akademik"),
      biayaHidup: !!localStorage.getItem("draft_biaya_hidup"),
      kondisiEkonomi: !!localStorage.getItem("draft_kondisi_ekonomi"),
      paktaIntegritas: !!localStorage.getItem("draft_pakta_integritas"),
    });
  }, []);

  // Jika sudah ada LPJ yang dikirim (MENUNGGU/DISETUJUI), tidak perlu tampilkan badge Draft
  const hasSubmittedLpj = lpjs?.some((l: any) => l.status_laporan === "MENUNGGU" || l.status_laporan === "DISETUJUI" || l.status_laporan === "REVISI");

  const showDraft = (key: string) => hasSubmittedLpj ? false : draftStatus[key];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
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
              Periode Pelaporan: Semester {isLoading ? "..." : data?.semester}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <ActionCard 
          title="Prestasi Akademik" 
          description="Lengkapi data SKS, IPS, IPK, dan tautan GDrive KHS/Transkrip Nilai."
          icon={<FileText className="h-7 w-7 text-white" />}
          href="/prestasi-akademik"
          iconBg="bg-gradient-to-br from-[#1a365d] to-[#2a528a]"
          hasDraft={showDraft('prestasiAkademik')}
        />

        <ActionCard 
          title="Prestasi Non Akademik" 
          description="Data organisasi, kepanitiaan, publikasi, lomba, beserta tautan bukti."
          icon={<FileText className="h-7 w-7 text-white" />}
          href="/prestasi-non-akademik"
          iconBg="bg-gradient-to-br from-indigo-500 to-indigo-700"
          hasDraft={showDraft('prestasiNonAkademik')}
        />

        <ActionCard 
          title="Biaya Hidup" 
          description="Laporan penggunaan dana (makan, kos, dll) beserta tautan bukti."
          icon={<Wallet className="h-7 w-7 text-white" />}
          href="/biaya-hidup"
          iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
          hasDraft={showDraft('biayaHidup')}
        />

        <ActionCard 
          title="Kondisi Ekonomi" 
          description="Pembaruan kondisi ekonomi keluarga, tanggungan, dan kelayakan."
          icon={<Home className="h-7 w-7 text-white" />}
          href="/kondisi-ekonomi"
          iconBg="bg-gradient-to-br from-amber-500 to-amber-700"
          hasDraft={showDraft('kondisiEkonomi')}
        />
        
        <ActionCard 
          title="Pakta Integritas" 
          description="Unduh & setujui surat pernyataan komitmen dan kebenaran data."
          icon={<ShieldCheck className="h-7 w-7 text-white" />}
          href="/pakta-integritas"
          iconBg="bg-gradient-to-br from-red-500 to-red-700"
          hasDraft={showDraft('paktaIntegritas')}
        />

        <ActionCard 
          title="LPJ" 
          description="Kirim laporan akhir dan unduh dokumen PDF LPJ Keseluruhan."
          icon={<Wallet className="h-7 w-7 text-white" />}
          href="/lpj"
          iconBg="bg-gradient-to-br from-pipdikti-sky to-blue-500"
        />
        
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, href, iconBg, hasDraft }: { title: string, description: string, icon: React.ReactNode, href: string, iconBg: string, hasDraft?: boolean }) {
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1a365d] transition-colors">{title}</h3>
              {hasDraft && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <Save className="h-3 w-3" /> Draft
                </span>
              )}
            </div>
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
