"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, User, Activity, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LpjReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data: lpj, isLoading } = useQuery({
    queryKey: ["lpj_detail", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/evaluasi/${id}`);
      if (!res.ok) throw new Error("Gagal mengambil data LPJ");
      const result = await res.json();
      return result.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (payload: { status_laporan: string; catatan_revisi?: string }) => {
      const res = await fetch(`/api/admin/evaluasi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Gagal mengupdate LPJ");
      return res.json();
    },
    onSuccess: () => {
      window.alert("Status LPJ berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["lpj_detail", id] });
      router.push("/evaluasi");
    },
    onError: () => {
      window.alert("Terjadi kesalahan sistem");
    }
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Memuat data LPJ...</div>;
  if (!lpj) return <div className="p-8 text-center text-red-500">Data LPJ tidak ditemukan.</div>;

  const mhs = lpj.mahasiswa_id;

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const { generatePDF } = await import("@/lib/pdfGenerator");
      
      const profileData = {
        name: mhs.nama_lengkap,
        nim: mhs.nim,
        program_studi: mhs.program_studi
      };

      await generatePDF(lpj, profileData, { isPreview: true });
    } catch (error) {
      console.error(error);
      window.alert("Gagal membuka PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-32">
      <div className="flex items-center gap-4">
        <Link href="/evaluasi" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Review LPJ Mahasiswa</h1>
          <p className="text-sm text-slate-500">Periode {lpj.semester_berjalan}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Biodata Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="h-5 w-5 text-pipdikti-sky" /> Biodata Mahasiswa</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Nama Lengkap</p>
                <p className="font-semibold text-slate-900">{mhs.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-slate-500">NIM</p>
                <p className="font-semibold text-slate-900">{mhs.nim}</p>
              </div>
              <div>
                <p className="text-slate-500">Program Studi</p>
                <p className="font-semibold text-slate-900">{mhs.program_studi} ({mhs.jenjang})</p>
              </div>
              <div>
                <p className="text-slate-500">Angkatan</p>
                <p className="font-semibold text-slate-900">{mhs.angkatan}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-pipdikti-gold" /> Status Laporan</h3>
             <span className={`px-4 py-2 rounded-xl text-sm font-bold inline-block
                ${lpj.status_laporan === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' : 
                  lpj.status_laporan === 'REVISI' ? 'bg-amber-100 text-amber-800' : 
                  'bg-pipdikti-sky/10 text-pipdikti-sky'}`}
              >
                {lpj.status_laporan}
              </span>
              {lpj.catatan_revisi && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
                  <strong>Catatan Revisi:</strong><br/>
                  {lpj.catatan_revisi}
                </div>
              )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Data Akademik */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. Data Akademik</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">IPS Semester Ini</p>
                <p className="text-2xl font-bold text-slate-900">{lpj.data_akademik?.ips || "-"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">IPK Kumulatif</p>
                <p className="text-2xl font-bold text-slate-900">{lpj.data_akademik?.ipk || "-"}</p>
              </div>
            </div>
            {lpj.data_akademik?.linkDrive && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a href={lpj.data_akademik.linkDrive} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-pipdikti-sky hover:text-blue-700 bg-pipdikti-sky/10 hover:bg-pipdikti-sky/20 px-4 py-2 rounded-lg transition-colors">
                  <ArrowLeft className="h-4 w-4 rotate-[135deg]" /> Buka Lampiran Bukti Akademik
                </a>
              </div>
            )}
          </div>

          {/* Data Non Akademik */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Prestasi & Kegiatan (Non-Akademik)</h3>
            <div className="space-y-4 text-sm">
               <div>
                 <p className="font-bold text-slate-700 mb-2">Prestasi:</p>
                 {lpj.data_non_akademik?.prestasi?.length > 0 ? (
                   <ul className="list-disc pl-5 space-y-1 text-slate-600">
                     {lpj.data_non_akademik.prestasi.map((p: any, i: number) => (
                        <li key={i}>
                          <span className="font-semibold">{p.kegiatan || p.nama || "Kegiatan"}</span> 
                          {p.tingkat ? ` (${p.tingkat})` : ''} 
                          {p.hasil ? ` - ${p.hasil}` : ''} 
                          {p.waktu || p.tahun ? ` [${p.waktu || p.tahun}]` : ''}
                        </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-slate-400 italic">Tidak ada catatan prestasi</p>
                 )}
               </div>
               
               {/* Organisasi / Kegiatan */}
               <div>
                 <p className="font-bold text-slate-700 mb-2">Organisasi / Kegiatan Ekstrakurikuler:</p>
                 {lpj.data_non_akademik?.organisasi?.length > 0 || lpj.data_non_akademik?.kegiatan?.length > 0 ? (
                   <ul className="list-disc pl-5 space-y-1 text-slate-600">
                     {(lpj.data_non_akademik.organisasi || lpj.data_non_akademik.kegiatan || []).map((k: any, i: number) => (
                        <li key={i}>
                          <span className="font-semibold">{k.nama || k.kegiatan || "Kegiatan"}</span>
                          {k.jabatan ? ` - Jabatan: ${k.jabatan}` : ''}
                          {k.tingkat ? ` (${k.tingkat})` : ''}
                          {k.waktu || k.tahun ? ` [${k.waktu || k.tahun}]` : ''}
                        </li>
                     ))}
                   </ul>
                 ) : (
                   <p className="text-slate-400 italic">Tidak ada catatan organisasi/kegiatan</p>
                 )}
               </div>
               
               {/* Publikasi */}
               {lpj.data_non_akademik?.publikasi?.length > 0 && (
                 <div>
                   <p className="font-bold text-slate-700 mb-2">Publikasi / Karya Tulis:</p>
                   <ul className="list-disc pl-5 space-y-1 text-slate-600">
                     {lpj.data_non_akademik.publikasi.map((p: any, i: number) => (
                        <li key={i}>
                          <span className="font-semibold">{p.judul}</span>
                          {p.waktu || p.tahun ? ` [${p.waktu || p.tahun}]` : ''}
                        </li>
                     ))}
                   </ul>
                 </div>
               )}
            </div>
            {lpj.data_non_akademik?.linkDrive && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a href={lpj.data_non_akademik.linkDrive} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-pipdikti-sky hover:text-blue-700 bg-pipdikti-sky/10 hover:bg-pipdikti-sky/20 px-4 py-2 rounded-lg transition-colors">
                  <ArrowLeft className="h-4 w-4 rotate-[135deg]" /> Buka Lampiran Bukti Non-Akademik
                </a>
              </div>
            )}
          </div>

          {/* Biaya Hidup */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">3. Pemanfaatan Biaya Hidup</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">Pemasukan (Bantuan PIP)</p>
                <p className="text-xl font-bold text-slate-900">Rp {parseInt(lpj.data_biaya_hidup?.pemasukan || 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">Sisa Dana Sebelumnya</p>
                <p className="text-xl font-bold text-slate-900">Rp {parseInt(lpj.data_biaya_hidup?.sisaDanaSebelumnya || 0).toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mt-4">
               <p className="font-bold text-slate-700">Rincian Pengeluaran:</p>
               {lpj.data_biaya_hidup?.pengeluaran?.map((item: any, i: number) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <span className="font-medium text-slate-700">{item.keperluan}</span>
                   <span className="font-bold text-slate-900">Rp {parseInt(item.jumlah || 0).toLocaleString('id-ID')}</span>
                 </div>
               ))}
               <div className="flex justify-between items-center p-4 bg-slate-100 border border-slate-200 rounded-xl mt-4">
                   <span className="font-bold text-slate-800">Total Pengeluaran</span>
                   <span className="font-extrabold text-red-600">Rp {((lpj.data_biaya_hidup?.pengeluaran || []).reduce((acc: number, curr: any) => acc + (Number(curr.jumlah) || 0), 0)).toLocaleString('id-ID')}</span>
               </div>
            </div>
            {lpj.data_biaya_hidup?.linkDrive && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a href={lpj.data_biaya_hidup.linkDrive} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-pipdikti-sky hover:text-blue-700 bg-pipdikti-sky/10 hover:bg-pipdikti-sky/20 px-4 py-2 rounded-lg transition-colors">
                  <ArrowLeft className="h-4 w-4 rotate-[135deg]" /> Buka Lampiran Bukti Biaya Hidup
                </a>
              </div>
            )}
          </div>
          
          {/* Kondisi Ekonomi */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">4. Kondisi Ekonomi Keluarga</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div>
                 <p className="text-slate-500">Pekerjaan Ayah & Ibu</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.pekerjaanOrtu || "-"}</p>
               </div>
               <div>
                 <p className="text-slate-500">Penghasilan Gabungan / Bulan</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.penghasilanOrtu || "-"}</p>
               </div>
               <div>
                 <p className="text-slate-500">Jumlah Tanggungan Keluarga</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.tanggungan || "-"}</p>
               </div>
               <div>
                 <p className="text-slate-500">Pengeluaran Keluarga / Bulan</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.pengeluaranKeluarga || "-"}</p>
               </div>
               <div>
                 <p className="text-slate-500">Kepemilikan Kendaraan</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.kendaraan || "-"}</p>
               </div>
               <div>
                 <p className="text-slate-500">Kepemilikan HP</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.hp || "-"}</p>
               </div>
               <div className="md:col-span-2">
                 <p className="text-slate-500">Kepemilikan Laptop/Komputer</p>
                 <p className="font-medium text-slate-900">{lpj.data_kondisi_ekonomi?.laptop || "-"}</p>
               </div>
               <div className="md:col-span-2 mt-2">
                 <p className="text-slate-500">Alasan Layak Menerima PIP</p>
                 <p className="font-medium text-slate-900 bg-slate-50 border border-slate-100 p-3 rounded-lg italic mt-1">&quot;{lpj.data_kondisi_ekonomi?.alasanLayak || "-"}&quot;</p>
               </div>
            </div>
            {lpj.data_kondisi_ekonomi?.linkDrive && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a href={lpj.data_kondisi_ekonomi.linkDrive} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-pipdikti-sky hover:text-blue-700 bg-pipdikti-sky/10 hover:bg-pipdikti-sky/20 px-4 py-2 rounded-lg transition-colors">
                  <ArrowLeft className="h-4 w-4 rotate-[135deg]" /> Buka Lampiran Bukti Kondisi Ekonomi
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] flex justify-end gap-4 z-40">
        <button 
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
          className="px-6 py-2.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Printer className="h-5 w-5" /> {isGeneratingPdf ? "Membuka..." : "Cetak PDF"}
        </button>
        <button 
          onClick={() => setShowRevisiModal(true)}
          disabled={mutation.isPending}
          className="px-6 py-2.5 rounded-xl font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <XCircle className="h-5 w-5" /> Kembalikan (Revisi)
        </button>
        <button 
          onClick={() => {
            if(confirm("Anda yakin ingin menyetujui LPJ ini? Laporan yang disetujui tidak dapat direvisi lagi.")) {
              mutation.mutate({ status_laporan: "DISETUJUI" });
            }
          }}
          disabled={mutation.isPending}
          className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle className="h-5 w-5" /> Setujui Laporan
        </button>
      </div>

      {/* Revisi Modal */}
      {showRevisiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Kembalikan Laporan (Revisi)</h3>
            <p className="text-sm text-slate-500 mb-4">Berikan catatan apa saja yang harus diperbaiki oleh mahasiswa.</p>
            
            <textarea 
              rows={4}
              value={catatanRevisi}
              onChange={e => setCatatanRevisi(e.target.value)}
              placeholder="Contoh: Tolong perbaiki nominal biaya kos karena tidak masuk akal..."
              className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm mb-6"
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowRevisiModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if(!catatanRevisi.trim()) return window.alert("Catatan revisi tidak boleh kosong");
                  mutation.mutate({ status_laporan: "REVISI", catatan_revisi: catatanRevisi });
                  setShowRevisiModal(false);
                }}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md transition-colors"
              >
                Kirim Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
