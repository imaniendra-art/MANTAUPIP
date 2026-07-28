"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Eye, FileCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fetchEvaluations = async () => {
  const res = await fetch("/api/admin/evaluasi");
  if (!res.ok) throw new Error("Gagal mengambil data evaluasi");
  const result = await res.json();
  return result.data || [];
};

export default function EvaluasiPage() {
  const { data: evaluations, isLoading } = useQuery({
    queryKey: ["evaluations"],
    queryFn: fetchEvaluations,
  });

  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handlePreview = async (lpjId: string) => {
    try {
      setPreviewingId(lpjId);
      const res = await fetch(`/api/admin/evaluasi/${lpjId.replace('lpj_', '')}`);
      if (!res.ok) throw new Error("Gagal mengambil detail LPJ");
      const result = await res.json();
      if (!result.success || !result.data) throw new Error("Format respons tidak valid");
      
      const lpjData = result.data;
      const profile = lpjData.mahasiswa_id;
      
      const { generatePDF } = await import("@/lib/pdfGenerator");
      await generatePDF(lpjData, profile, { isPreview: true });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membuat preview PDF");
    } finally {
      setPreviewingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pipdikti-sky/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pipdikti-navy/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#1a365d] to-[#2a528a] rounded-2xl shadow-md">
              <FileCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">LPJ Mahasiswa</h1>
              <p className="text-slate-600 font-medium mt-1">
                Review dan validasi Laporan Pertanggungjawaban (LPJ) Mahasiswa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-lg border border-white/60 overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau NIM..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky focus:border-transparent text-sm text-slate-900 bg-white placeholder-slate-400"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50/50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">No</th>
                <th scope="col" className="px-6 py-4 font-semibold">Mahasiswa</th>
                <th scope="col" className="px-6 py-4 font-semibold">NIM</th>
                <th scope="col" className="px-6 py-4 font-semibold">Angkatan</th>
                <th scope="col" className="px-6 py-4 font-semibold">Semester Pelaporan</th>
                <th scope="col" className="px-6 py-4 font-semibold">Periode Pencairan</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">Memuat data dokumen...</td>
                </tr>
              ) : evaluations?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">Belum ada dokumen LPJ.</td>
                </tr>
              ) : (
                evaluations?.map((item: any, index: number) => (
                  <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.nim}</td>
                    <td className="px-6 py-4 text-slate-600">{item.angkatan}</td>
                    <td className="px-6 py-4 text-slate-600 font-bold">{item.semesterPelaporan}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">{item.periode}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${item.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' : 
                          item.status === 'REVISI' ? 'bg-amber-100 text-amber-800' : 
                          'bg-pipdikti-sky/10 text-pipdikti-sky'}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handlePreview(item.id)}
                          disabled={previewingId === item.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {previewingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                          Lihat
                        </button>
                        <Link href={`/evaluasi/${item.id.replace('lpj_', '')}`} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-pipdikti-sky bg-pipdikti-sky/10 hover:bg-pipdikti-sky hover:text-white rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
