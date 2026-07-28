"use client";

import { ArrowLeft, FileText, Download, Send, AlertTriangle, Eye, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

export default function LpjPage() {
  const router = useRouter();
  const [lpjs, setLpjs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftStatus, setDraftStatus] = useState({
    akademik: false,
    nonAkademik: false,
    biayaHidup: false,
    ekonomi: false,
    pakta: false,
  });

  const CURRENT_SEMESTER = "2025/2026 Genap";

  useEffect(() => {
    // Check localStorage drafts
    setDraftStatus({
      akademik: !!localStorage.getItem("draft_prestasi_akademik"),
      nonAkademik: !!localStorage.getItem("draft_prestasi_non_akademik"),
      biayaHidup: !!localStorage.getItem("draft_biaya_hidup"),
      ekonomi: !!localStorage.getItem("draft_kondisi_ekonomi"),
      pakta: !!localStorage.getItem("draft_pakta_integritas"),
    });

    // Check DB status
    fetch("/api/mahasiswa/lpj")
      .then(res => res.json())
      .then(res => {
        if (res.success) setLpjs(res.data);
      })
      .catch(err => console.error(err));

    // Fetch user profile for PDF Cover
    fetch("/api/mahasiswa/dashboard")
      .then(res => res.json())
      .then(res => {
        if (res.success) setProfile(res.data);
      });
  }, []);

  const allDraftsReady = Object.values(draftStatus).every(v => v === true);

  const displayLpjs = [...lpjs];
  if (!displayLpjs.find(l => l.semester_berjalan === CURRENT_SEMESTER)) {
    displayLpjs.unshift({
      _id: "draft",
      semester_berjalan: CURRENT_SEMESTER,
      status_laporan: "DRAFT"
    });
  }

  const handleKirimLpj = async () => {
    if (!allDraftsReady) {
      alert("Harap lengkapi semua draft laporan (Modul 1-5) terlebih dahulu sebelum mengirim!");
      return;
    }

    const confirm = window.confirm("Apakah Anda yakin ingin mengirim LPJ ini ke Admin? Pastikan semua data sudah benar.");
    if (confirm) {
      setIsSubmitting(true);
      try {
        const payload = {
          data_akademik: JSON.parse(localStorage.getItem("draft_prestasi_akademik") || "{}"),
          data_non_akademik: JSON.parse(localStorage.getItem("draft_prestasi_non_akademik") || "{}"),
          data_biaya_hidup: JSON.parse(localStorage.getItem("draft_biaya_hidup") || "{}"),
          data_kondisi_ekonomi: JSON.parse(localStorage.getItem("draft_kondisi_ekonomi") || "{}"),
          data_pakta_integritas: JSON.parse(localStorage.getItem("draft_pakta_integritas") || "{}"),
          semester_berjalan: CURRENT_SEMESTER
        };

        const res = await fetch("/api/mahasiswa/lpj", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
          alert("Laporan berhasil dikirim ke Admin!");
          const updated = await fetch("/api/mahasiswa/lpj").then(r => r.json());
          if (updated.success) setLpjs(updated.data);
        } else {
          alert("Gagal mengirim laporan: " + result.error);
        }
      } catch (error) {
        alert("Terjadi kesalahan jaringan.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGeneratePdf = async (lpjData: any, isPreview: boolean = false) => {
    if (lpjData.status_laporan === "DRAFT" && !allDraftsReady) {
      alert("Harap lengkapi semua draft terlebih dahulu untuk mencetak PDF.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const { generatePDF } = await import("@/lib/pdfGenerator");
      await generatePDF(lpjData, profile, { isPreview });
    } catch (error) {
      console.error(error);
      alert("Gagal membuat PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateSemester = (angkatanStr: string | undefined, periode: string) => {
    if (!angkatanStr || !periode) return "-";
    const startYear = parseInt(angkatanStr);
    if (isNaN(startYear)) return "-";
    
    // Asumsi format periode: "2024/2025 Ganjil" atau "2025/2026 Genap"
    const match = periode.match(/^(\d{4})\/\d{4}\s+(Ganjil|Genap)$/i);
    if (!match) return "-";
    
    const currentYear = parseInt(match[1]);
    const isGenap = match[2].toLowerCase() === "genap";
    
    if (currentYear < startYear) return "-";
    
    const diff = currentYear - startYear;
    return (diff * 2) + (isGenap ? 2 : 1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"><FileText className="h-3 w-3" /> Draft Belum Dikirim</span>;
      case "MENUNGGU":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="h-3 w-3" /> Sedang Direview Admin</span>;
      case "DISETUJUI":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 className="h-3 w-3" /> Disetujui</span>;
      case "REVISI":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200"><AlertTriangle className="h-3 w-3" /> Perlu Revisi</span>;
      default:
        return <span>{status}</span>;
    }
  };

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
        <div className="bg-gradient-to-r from-pipdikti-sky to-blue-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Daftar Laporan Pertanggungjawaban (LPJ)</h2>
          <p className="mt-2 text-blue-100 font-medium text-sm md:text-base">
            Pantau dan kelola seluruh pelaporan LPJ Anda dari setiap semester.
          </p>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          
          {!allDraftsReady && !lpjs.find(l => l.semester_berjalan === CURRENT_SEMESTER) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 text-sm">Ada Draft yang Belum Lengkap</h4>
                <p className="text-amber-700 text-xs mt-1">Anda belum melengkapi form: 
                  {!draftStatus.akademik && " Akademik,"}
                  {!draftStatus.nonAkademik && " Non Akademik,"}
                  {!draftStatus.biayaHidup && " Biaya Hidup,"}
                  {!draftStatus.ekonomi && " Kondisi Ekonomi,"}
                  {!draftStatus.pakta && " Pakta Integritas,"}
                  . Silakan lengkapi terlebih dahulu agar tombol Kirim aktif.
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-4 px-4 font-semibold text-gray-600 w-16">No</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Semester</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Periode</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Status</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayLpjs.map((lpj, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {lpj.data_akademik?.semester || calculateSemester(profile?.angkatan, lpj.semester_berjalan) || "-"}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {lpj.semester_berjalan}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(lpj.status_laporan)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {(lpj.status_laporan === "DRAFT" || lpj.status_laporan === "REVISI") ? (
                          <button 
                            onClick={() => handleGeneratePdf(lpj, true)}
                            disabled={isGenerating || (lpj.status_laporan === "DRAFT" && !allDraftsReady)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                          >
                            <Eye className="h-3.5 w-3.5" /> Preview
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleGeneratePdf(lpj, true)}
                              disabled={isGenerating}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                            >
                              <Eye className="h-3.5 w-3.5" /> Lihat
                            </button>
                            <button 
                              onClick={() => handleGeneratePdf(lpj, false)}
                              disabled={isGenerating}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50"
                            >
                              <Download className="h-3.5 w-3.5" /> Unduh
                            </button>
                          </>
                        )}

                        {(lpj.status_laporan === "DRAFT" || lpj.status_laporan === "REVISI") && (
                          <button 
                            onClick={handleKirimLpj}
                            disabled={isSubmitting || !allDraftsReady}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-pipdikti-navy text-white hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Send className="h-3.5 w-3.5" /> Kirim
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {displayLpjs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">
                      Belum ada riwayat LPJ.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
