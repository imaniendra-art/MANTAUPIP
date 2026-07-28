"use client";

import { ArrowLeft, Link as LinkIcon, Save, Info, AlertTriangle, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PrestasiAkademikPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    semester: "",
    jumlahMatkul: "",
    sks: "",
    ips: "",
    ipk: "",
    linkDrive: ""
  });
  
  // Interface for data lampau
  interface DataLampau {
    semester: string;
    tahunAkademik: string;
    jumlahMatkul: string;
    sks: string;
    ips: string;
    ipk: string;
  }
  
  const [dataLampau, setDataLampau] = useState<DataLampau[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Asumsi data ini didapatkan dari backend/sesi
  const activeTahunAkademik = "2025/2026 Genap";

  useEffect(() => {
    const saved = localStorage.getItem("draft_prestasi_akademik");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        // Load dataLampau if exists
        const savedLampau = localStorage.getItem("draft_prestasi_akademik_lampau");
        if (savedLampau) {
          setDataLampau(JSON.parse(savedLampau));
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("draft_prestasi_akademik", JSON.stringify(formData));
      localStorage.setItem("draft_prestasi_akademik_lampau", JSON.stringify(dataLampau));
      setIsSubmitting(false);
      alert("Data berhasil disimpan sementara (Draft).");
    }, 1000);
  };

  const handleAddLampau = () => {
    setDataLampau([...dataLampau, { semester: "", tahunAkademik: "", jumlahMatkul: "", sks: "", ips: "", ipk: "" }]);
  };

  const handleLampauChange = (index: number, field: keyof DataLampau, value: string) => {
    const updated = [...dataLampau];
    updated[index][field] = value;
    setDataLampau(updated);
  };

  const handleRemoveLampau = (index: number) => {
    const updated = [...dataLampau];
    updated.splice(index, 1);
    setDataLampau(updated);
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <Link 
          href="/beranda" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1a365d] transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/60 hover:bg-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="text-sm font-medium text-slate-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/60">
          Progress LPJ: <span className="text-pipdikti-sky font-bold">1/6</span> Selesai
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a365d] to-[#2a528a] p-6 text-white">
          <h2 className="text-2xl font-bold">1. Laporan Prestasi Akademik</h2>
          <p className="mt-2 text-pipdikti-sky font-medium text-sm md:text-base">
            Lengkapi rekaman prestasi akademik Anda untuk periode pelaporan yang sedang berjalan.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
            <h3 className="text-blue-900 font-semibold mb-4 border-b border-blue-200 pb-2">Formulir Kartu Hasil Studi (KHS)</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="tahunAkademik" className="block text-sm font-medium text-gray-700">Tahun Akademik</label>
                <input 
                  type="text" 
                  id="tahunAkademik" 
                  disabled
                  value={activeTahunAkademik}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 font-medium cursor-not-allowed" 
                />
                <p className="text-xs text-gray-500">*Terisi otomatis dari sistem</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
                <select 
                  id="semester" 
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors bg-white text-gray-800"
                >
                  <option value="">-- Pilih Semester --</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>Semester {num}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="jumlahMatkul" className="block text-sm font-medium text-gray-700">Jumlah Mata Kuliah</label>
                <input 
                  type="number" 
                  id="jumlahMatkul" 
                  required
                  min="1"
                  value={formData.jumlahMatkul}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: 8" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sks" className="block text-sm font-medium text-gray-700">Total SKS Diambil</label>
                <input 
                  type="number" 
                  id="sks" 
                  required
                  min="1"
                  value={formData.sks}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: 24" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="ips" className="block text-sm font-medium text-gray-700">IPS (Indeks Prestasi Semester)</label>
                <input 
                  type="number" 
                  step="0.01"
                  id="ips" 
                  required
                  value={formData.ips}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: 3.75" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="ipk" className="block text-sm font-medium text-gray-700">IPK (Indeks Prestasi Kumulatif)</label>
                <input 
                  type="number" 
                  step="0.01"
                  id="ipk" 
                  required
                  value={formData.ipk}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: 3.80" 
                />
              </div>
            </div>
          </div>

          {/* SECTION DATA LAMPAU */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-slate-800 font-bold flex items-center gap-2">
                  Data Prestasi Akademik Semester Lampau 
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">Opsional</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Isi data periode lampau agar data lama masuk dalam laporan.</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddLampau}
                className="mt-3 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" /> Tambah Data Lampau
              </button>
            </div>

            {dataLampau.length > 0 && (
              <div className="space-y-6">
                {dataLampau.map((item, index) => (
                  <div key={index} className="relative p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleRemoveLampau(index)}
                      className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-full shadow-sm transition-colors"
                      title="Hapus data ini"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <label className="text-xs font-semibold text-slate-600">Semester</label>
                        <select 
                          required
                          value={item.semester}
                          onChange={(e) => handleLampauChange(index, "semester", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                        >
                          <option value="">Pilih</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-600">Thn Akademik (Mis: 2024/2025 Genap)</label>
                        <input 
                          type="text" 
                          required
                          value={item.tahunAkademik}
                          onChange={(e) => handleLampauChange(index, "tahunAkademik", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                          placeholder="2024/2025 Genap"
                        />
                      </div>
                      <div className="space-y-1 col-span-1 md:col-span-1">
                        <label className="text-xs font-semibold text-slate-600">Matkul</label>
                        <input 
                          type="number" 
                          required
                          value={item.jumlahMatkul}
                          onChange={(e) => handleLampauChange(index, "jumlahMatkul", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-1 col-span-1 md:col-span-1">
                        <label className="text-xs font-semibold text-slate-600">SKS</label>
                        <input 
                          type="number" 
                          required
                          value={item.sks}
                          onChange={(e) => handleLampauChange(index, "sks", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-1 col-span-1 md:col-span-1">
                        <label className="text-xs font-semibold text-slate-600">IPS</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={item.ips}
                          onChange={(e) => handleLampauChange(index, "ips", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-1 col-span-1 md:col-span-1 md:hidden">
                        {/* Mobile IPK field - not really needed in PDF for individual row except current, but good for completeness */}
                        <label className="text-xs font-semibold text-slate-600">IPK</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={item.ipk}
                          onChange={(e) => handleLampauChange(index, "ipk", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-1 hidden md:block md:col-span-1">
                         <label className="text-xs font-semibold text-slate-600">IPK</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={item.ipk}
                          onChange={(e) => handleLampauChange(index, "ipk", e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-1 focus:ring-pipdikti-sky bg-white text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Tautan Bukti KHS & Transkrip</h3>
            
            {/* Tutorial Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2 text-amber-900 text-justify">
                <p className="font-bold">Panduan Pengunggahan Bukti (Wajib Dibaca):</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Buka <strong>Google Drive</strong> Anda dan buat folder utama: <span className="font-mono bg-amber-100 px-1 rounded">LPJ PIP DIKTI STIMI YAPMI</span>.</li>
                  <li>Buka folder tersebut, lalu buat folder periode pelaporan: <span className="font-mono bg-amber-100 px-1 rounded">LPJ {activeTahunAkademik.toUpperCase()}</span>.</li>
                  <li>Buka folder periode tersebut, lalu buat folder khusus: <span className="font-mono bg-amber-100 px-1 rounded">Bukti Akademik - [Nama Anda]</span>.</li>
                  <li>Taruh dokumen <strong>pengisian KRS, KHS, serta Transkrip Nilai Sementara</strong> Anda ke dalam folder khusus tersebut.</li>
                  <li>Klik kanan pada folder <strong>Bukti Akademik - [Nama Anda]</strong>, pilih Bagikan (Share). Ubah hak akses menjadi <strong>"Siapa saja yang memiliki tautan" (Viewer)</strong>.</li>
                  <li>Salin tautan (Copy link) folder tersebut dan tempel ke kolom di bawah ini.</li>
                </ol>
              </div>
            </div>
            
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="url" 
                id="linkDrive"
                required
                value={formData.linkDrive}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
                placeholder="https://drive.google.com/drive/folders/..." 
              />
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500 italic flex-1 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Data akan tersimpan sebagai (Draft) sebelum LPJ disubmit final.
            </p>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-pipdikti-navy hover:bg-pipdikti-navy/90 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-pipdikti-sky flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Simpan Draft
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
