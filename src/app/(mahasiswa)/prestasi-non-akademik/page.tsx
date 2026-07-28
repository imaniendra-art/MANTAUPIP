"use client";

import { ArrowLeft, Link as LinkIcon, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PrestasiNonAkademikPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [prestasi, setPrestasi] = useState([{ kegiatan: "", tingkat: "", hasil: "", waktu: "", penyelenggara: "" }]);
  const [organisasi, setOrganisasi] = useState([{ nama: "", tingkat: "", jabatan: "", tahun: "" }]);
  const [kepanitiaan, setKepanitiaan] = useState([{ nama: "", tingkat: "", jabatan: "", waktu: "", penyelenggara: "" }]);
  const [publikasi, setPublikasi] = useState([{ judul: "", peran: "", penerbit: "", waktu: "" }]);
  const [linkDrive, setLinkDrive] = useState("");

  const activeTahunAkademik = "2025/2026 Genap";

  useEffect(() => {
    const saved = localStorage.getItem("draft_prestasi_non_akademik");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.prestasi) setPrestasi(parsed.prestasi);
        if (parsed.organisasi) setOrganisasi(parsed.organisasi);
        if (parsed.kepanitiaan) setKepanitiaan(parsed.kepanitiaan);
        if (parsed.publikasi) setPublikasi(parsed.publikasi);
        if (parsed.linkDrive) setLinkDrive(parsed.linkDrive);
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem("draft_prestasi_non_akademik", JSON.stringify({
        prestasi, organisasi, kepanitiaan, publikasi, linkDrive
      }));
      setIsSubmitting(false);
      alert("Data berhasil disimpan sementara (Draft).");
    }, 1000);
  };

  const addItem = (setter: any, defaultItem: any) => setter((prev: any) => [...prev, defaultItem]);
  const removeItem = (setter: any, index: number) => setter((prev: any) => prev.filter((_: any, i: number) => i !== index));
  const updateItem = (setter: any, index: number, field: string, value: string) => {
    setter((prev: any) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
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
          Progress LPJ: <span className="text-pipdikti-sky font-bold">2/6</span> Selesai
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold">2. Laporan Prestasi Non Akademik</h2>
          <p className="mt-2 text-indigo-100 font-medium text-sm md:text-base">
            Lengkapi rekaman prestasi, organisasi, kepanitiaan, dan publikasi Anda selama semester berjalan.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          
          {/* Section 1: Prestasi / Penghargaan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">A. Prestasi & Penghargaan</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => addItem(setPrestasi, { kegiatan: "", tingkat: "", hasil: "", waktu: "", penyelenggara: "" })} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah
                </button>
                <button type="button" onClick={() => addItem(setPrestasi, { kegiatan: "", tingkat: "", hasil: "", waktu: "", penyelenggara: "" })} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah Data Lampau
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {prestasi.map((item, index) => (
                <div key={index} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lomba / Penghargaan</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Juara 1 Lomba Debat Nasional" 
                        value={item.kegiatan}
                        onChange={(e) => updateItem(setPrestasi, index, "kegiatan", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Penyelenggara</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Universitas XYZ / Kemenpora" 
                        value={item.penyelenggara}
                        onChange={(e) => updateItem(setPrestasi, index, "penyelenggara", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat</label>
                      <select 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                        value={item.tingkat}
                        onChange={(e) => updateItem(setPrestasi, index, "tingkat", e.target.value)}
                      >
                        <option value="">Pilih Tingkat</option>
                        <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                        <option value="Kota/Provinsi">Kota / Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu / Tahun Pelaksanaan</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Agustus 2026" 
                        value={item.waktu}
                        onChange={(e) => updateItem(setPrestasi, index, "waktu", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hasil</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Juara 1 / Finalis" 
                        value={item.hasil}
                        onChange={(e) => updateItem(setPrestasi, index, "hasil", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end md:pb-1">
                      {prestasi.length > 1 && (
                        <button type="button" onClick={() => removeItem(setPrestasi, index)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Organisasi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">B. Organisasi Kemahasiswaan & Lainnya</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => addItem(setOrganisasi, { nama: "", tingkat: "", jabatan: "", tahun: "" })} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah
                </button>
                <button type="button" onClick={() => addItem(setOrganisasi, { nama: "", tingkat: "", jabatan: "", tahun: "" })} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah Data Lampau
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {organisasi.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Organisasi</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                      placeholder="Contoh: BEM Fakultas / HMI / UKM Seni" 
                      value={item.nama}
                      onChange={(e) => updateItem(setOrganisasi, index, "nama", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat</label>
                    <select 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                      value={item.tingkat}
                      onChange={(e) => updateItem(setOrganisasi, index, "tingkat", e.target.value)}
                    >
                      <option value="">Pilih Tingkat</option>
                      <option value="Jurusan">Jurusan / Prodi</option>
                      <option value="Fakultas">Fakultas</option>
                      <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                      <option value="Eksternal">Eksternal Kampus</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jabatan</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                      placeholder="Ketua / Anggota" 
                      value={item.jabatan}
                      onChange={(e) => updateItem(setOrganisasi, index, "jabatan", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tahun/Periode</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                      placeholder="2024 / 2024-2025" 
                      value={item.tahun || ''}
                      onChange={(e) => updateItem(setOrganisasi, index, "tahun", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end md:pb-1">
                    {organisasi.length > 1 && (
                      <button type="button" onClick={() => removeItem(setOrganisasi, index)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Kepanitiaan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">C. Kepanitiaan (Event / Kegiatan Mahasiswa)</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => addItem(setKepanitiaan, { nama: "", tingkat: "", jabatan: "", waktu: "", penyelenggara: "" })} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah
                </button>
                <button type="button" onClick={() => addItem(setKepanitiaan, { nama: "", tingkat: "", jabatan: "", waktu: "", penyelenggara: "" })} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah Data Lampau
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {kepanitiaan.map((item, index) => (
                <div key={index} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Kepanitiaan / Acara</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Panitia PKKMB / Seminar Nasional" 
                        value={item.nama}
                        onChange={(e) => updateItem(setKepanitiaan, index, "nama", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Penyelenggara</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: BEM Fakultas / Organisasi X" 
                        value={item.penyelenggara}
                        onChange={(e) => updateItem(setKepanitiaan, index, "penyelenggara", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat</label>
                      <select 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                        value={item.tingkat}
                        onChange={(e) => updateItem(setKepanitiaan, index, "tingkat", e.target.value)}
                      >
                        <option value="">Pilih Tingkat</option>
                        <option value="Jurusan">Jurusan / Prodi</option>
                        <option value="Fakultas">Fakultas</option>
                        <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                        <option value="Regional">Regional/Nasional</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu / Tahun Pelaksanaan</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: September 2026" 
                        value={item.waktu}
                        onChange={(e) => updateItem(setKepanitiaan, index, "waktu", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Peran / Posisi</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Ketua Panitia / Koordinator Acara" 
                        value={item.jabatan}
                        onChange={(e) => updateItem(setKepanitiaan, index, "jabatan", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end md:pb-1">
                      {kepanitiaan.length > 1 && (
                        <button type="button" onClick={() => removeItem(setKepanitiaan, index)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Publikasi Ilmiah */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">D. Karya Tulis & Publikasi Ilmiah</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => addItem(setPublikasi, { judul: "", peran: "", penerbit: "", waktu: "" })} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah
                </button>
                <button type="button" onClick={() => addItem(setPublikasi, { judul: "", peran: "", penerbit: "", waktu: "" })} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah Data Lampau
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {publikasi.map((item, index) => (
                <div key={index} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-8 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul Karya / Jurnal / Artikel</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Analisis Dampak Ekonomi pada..." 
                        value={item.judul}
                        onChange={(e) => updateItem(setPublikasi, index, "judul", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu / Tahun Publikasi</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Oktober 2026" 
                        value={item.waktu}
                        onChange={(e) => updateItem(setPublikasi, index, "waktu", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Peran Penulis</label>
                      <select 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900"
                        value={item.peran}
                        onChange={(e) => updateItem(setPublikasi, index, "peran", e.target.value)}
                      >
                        <option value="">Pilih Peran</option>
                        <option value="Penulis Pertama">Penulis Pertama (1)</option>
                        <option value="Penulis Kedua">Penulis Kedua (2)</option>
                        <option value="Penulis Anggota">Penulis Anggota</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div className="md:col-span-7 space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Penerbit / Jurnal / Media</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder="Contoh: Jurnal Ekonomi Sinta 3" 
                        value={item.penerbit}
                        onChange={(e) => updateItem(setPublikasi, index, "penerbit", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end md:pb-1">
                      {publikasi.length > 1 && (
                        <button type="button" onClick={() => removeItem(setPublikasi, index)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">E. Bukti Pendukung (Sertifikat/SK/Link Publikasi)</h3>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm text-indigo-800 space-y-2">
              <p className="font-semibold text-indigo-900 flex items-center gap-2">
                <span className="bg-indigo-200 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">i</span>
                Tutorial Singkat Pengumpulan Bukti:
              </p>
              <ol className="list-decimal list-outside space-y-1 ml-6 text-indigo-700">
                <li>Buka Google Drive Anda, masuk ke dalam folder utama <strong>LPJ PIP DIKTI STIMI YAPMI</strong>.</li>
                <li>Masuk ke dalam folder periode pelaporan: <strong>LPJ {activeTahunAkademik.toUpperCase()}</strong>.</li>
                <li>Buat folder baru di dalamnya dengan nama <strong>Bukti Prestasi Non Akademik - [Nama Anda]</strong>.</li>
                <li>Upload semua file (Sertifikat, SK, atau Screenshot Publikasi) ke dalam folder tersebut dan beri nama file yang jelas.</li>
                <li>Klik kanan pada folder <strong>Bukti Prestasi Non Akademik - [Nama Anda]</strong>, pilih Bagikan (Share).</li>
                <li>Ubah setelan akses menjadi <strong>"Siapa saja yang memiliki tautan" (Viewer)</strong>.</li>
                <li>Salin tautan (Copy link) dan tempel pada kolom di bawah ini.</li>
              </ol>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="url" 
                required
                value={linkDrive}
                onChange={(e) => setLinkDrive(e.target.value)}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="https://drive.google.com/drive/folders/..." 
              />
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500 italic flex-1">
              *Data akan tersimpan secara otomatis (Draft) saat tombol ditekan.
            </p>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2 disabled:opacity-70 shadow-md"
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
