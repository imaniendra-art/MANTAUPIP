"use client";

import { useQuery } from "@tanstack/react-query";
import { UploadCloud, FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnggahBerkasPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center">
        <Link 
          href="/beranda" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1a365d] transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/60 hover:bg-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 overflow-hidden">
        <div className="bg-pipdikti-navy p-6 text-white">
          <h2 className="text-2xl font-bold">Unggah Berkas Evaluasi PIP</h2>
          <p className="mt-2 text-pipdikti-sky font-medium">Semester Genap 2025/2026</p>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Kartu Hasil Studi (KHS)</h3>
              <p className="text-sm text-gray-600">Unggah KHS semester sebelumnya yang telah disahkan (PDF, Max 2MB).</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                <UploadCloud className="h-10 w-10 text-pipdikti-sky mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Klik atau seret file ke sini</span>
                <span className="text-xs text-gray-500 mt-1">Format: .pdf</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Bukti Pembayaran UKT/SPP</h3>
              <p className="text-sm text-gray-600">Unggah bukti pembayaran UKT atau Surat Keterangan (PDF/JPG, Max 2MB).</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                <UploadCloud className="h-10 w-10 text-pipdikti-sky mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700">Klik atau seret file ke sini</span>
                <span className="text-xs text-gray-500 mt-1">Format: .pdf, .jpg, .png</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button className="bg-pipdikti-navy hover:bg-pipdikti-navy/90 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-pipdikti-sky flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Kirim Berkas
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-md border border-pipdikti-gold/40 shadow-sm rounded-xl p-6 flex gap-4 items-start relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-pipdikti-gold/10 before:-z-10">
        <FileText className="h-6 w-6 text-pipdikti-gold shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900">Riwayat Pengajuan</h3>
          <p className="text-sm text-gray-600 mt-1">Anda belum memiliki riwayat pengajuan berkas pada semester ini. Segera lengkapi persyaratan untuk menjaga status keaktifan PIP Anda.</p>
        </div>
      </div>
    </div>
  );
}
