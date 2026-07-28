"use client";

import { ArrowLeft, Link as LinkIcon, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BiayaHidupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pemasukan, setPemasukan] = useState<number>(6600000); // Default PIP value
  const [sisaDanaSebelumnya, setSisaDanaSebelumnya] = useState<number>(0);
  const [pengeluaran, setPengeluaran] = useState([
    { keperluan: "Makan", jumlah: 0 },
    { keperluan: "Tempat Tinggal", jumlah: 0 },
    { keperluan: "Transportasi", jumlah: 0 },
  ]);
  const [linkDrive, setLinkDrive] = useState("");

  const activeTahunAkademik = "2025/2026 Genap";

  useEffect(() => {
    const saved = localStorage.getItem("draft_biaya_hidup");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.pemasukan) setPemasukan(parsed.pemasukan);
        if (parsed.sisaDanaSebelumnya !== undefined) setSisaDanaSebelumnya(parsed.sisaDanaSebelumnya);
        if (parsed.pengeluaran) setPengeluaran(parsed.pengeluaran);
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
      localStorage.setItem("draft_biaya_hidup", JSON.stringify({
        pemasukan, sisaDanaSebelumnya, pengeluaran, linkDrive
      }));
      setIsSubmitting(false);
      alert("Data berhasil disimpan sementara (Draft).");
    }, 1000);
  };

  const addPengeluaran = () => {
    setPengeluaran([...pengeluaran, { keperluan: "", jumlah: 0 }]);
  };

  const removePengeluaran = (index: number) => {
    const newP = [...pengeluaran];
    newP.splice(index, 1);
    setPengeluaran(newP);
  };

  const totalPengeluaran = pengeluaran.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const totalDanaTersedia = pemasukan + sisaDanaSebelumnya;
  const saldoAkhir = totalDanaTersedia - totalPengeluaran;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
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
          Progress LPJ: <span className="text-pipdikti-sky font-bold">3/6</span> Selesai
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold">3. Laporan Penggunaan Biaya Hidup</h2>
          <p className="mt-2 text-emerald-100 font-medium text-sm md:text-base">
            Penggunaan Biaya Hidup Penerima PIP DIKTI STIMI YAPMI Makassar ditujukan untuk keperluan penunjang pendidikan. Catat detail pemasukan dan pengeluaran biaya hidup Anda selama 1 semester terakhir.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Dana PIP Semester Berjalan</h3>
                  <p className="text-xs text-emerald-600">Alokasi dana bantuan yang telah ditetapkan oleh Kementerian untuk periode ini.</p>
                </div>
                <div className="w-1/3">
                  <input 
                    type="text" 
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-emerald-300 font-bold text-emerald-900 bg-emerald-100/50 text-right cursor-not-allowed" 
                    value={formatRupiah(pemasukan)}
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Sisa Dana Semester Lalu</h3>
                  <p className="text-xs text-emerald-600">Akumulasi sisa dana dari laporan pertanggungjawaban periode sebelumnya.</p>
                </div>
                <div className="w-1/3">
                  <input 
                    type="text" 
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-emerald-300 font-bold text-emerald-900 bg-emerald-100/50 text-right cursor-not-allowed" 
                    value={formatRupiah(sisaDanaSebelumnya)}
                  />
                </div>
              </div>

              <div className="bg-emerald-600 p-4 rounded-xl flex items-center justify-between shadow-inner">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Total Dana Tersedia</h3>
                  <p className="text-xs text-emerald-100">Total dana yang harus Anda kelola dan pertanggungjawabkan.</p>
                </div>
                <div className="w-1/3 text-right flex justify-end">
                  <span className="text-xl font-black text-white px-2">{formatRupiah(totalDanaTersedia)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Pengeluaran</h3>
                <button type="button" onClick={addPengeluaran} className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Tambah Kategori
                </button>
              </div>
              
              <div className="space-y-3">
                {pengeluaran.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border-none focus:ring-0 text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400" 
                        placeholder="Nama Keperluan (Misal: Makan)" 
                        value={item.keperluan}
                        onChange={(e) => {
                          const newP = [...pengeluaran];
                          newP[index].keperluan = e.target.value;
                          setPengeluaran(newP);
                        }}
                      />
                    </div>
                    <div className="w-1/3 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">Rp</span>
                      </div>
                      <input 
                        type="number" 
                        required
                        className="w-full pl-10 px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-gray-50 text-right font-medium text-slate-900"
                        value={item.jumlah || ""}
                        onChange={(e) => {
                          const newP = [...pengeluaran];
                          newP[index].jumlah = Number(e.target.value);
                          setPengeluaran(newP);
                        }}
                      />
                    </div>
                    <div>
                      <button 
                        type="button" 
                        onClick={() => removePengeluaran(index)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30"
                        disabled={pengeluaran.length <= 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Total Pengeluaran</span>
                <span className="font-bold text-gray-900">{formatRupiah(totalPengeluaran)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="font-bold text-gray-800">Sisa Saldo Tersedia</span>
                <span className={`font-extrabold text-lg ${saldoAkhir < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatRupiah(saldoAkhir)}
                </span>
              </div>
              <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="text-amber-900 font-bold mb-2 text-sm uppercase tracking-wider">Pesan Moral & Pengingat Akademik</h4>
                <p className="text-sm text-amber-800 text-justify mb-3 leading-relaxed">
                  Setiap rupiah yang Anda terima merupakan amanah dari negara yang <strong>wajib dipertanggungjawabkan</strong> secara transparan. Jika terdapat sisa saldo, dana tersebut secara otomatis akan diakumulasikan ke periode berikutnya. Pada akhir masa studi Anda, seluruh rekam jejak penggunaan dana ini akan menjadi bukti integritas Anda sebagai mahasiswa unggulan penerima PIP.
                </p>
                <p className="text-sm text-amber-800 text-justify leading-relaxed">
                  <strong>Bijaklah dalam mengelola keuangan Anda.</strong> Hindari menghabiskan seluruh dana hanya untuk kesenangan sesaat. Persiapkan tabungan Anda sejak dini untuk menghadapi pembiayaan besar di masa depan seperti program KKLP (Kuliah Kerja Lapangan Plus), Sertifikasi Kompetensi (BNSP), penyusunan Skripsi, hingga persiapan Wisuda. Perencanaan keuangan yang baik hari ini adalah investasi kelancaran karir Anda esok hari.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Bukti Nota / Kwitansi Pengeluaran</h3>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm text-emerald-800 space-y-2">
              <p className="font-semibold text-emerald-900 flex items-center gap-2">
                <span className="bg-emerald-200 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">i</span>
                Panduan Pengunggahan Bukti:
              </p>
              <ol className="list-decimal list-outside space-y-1 ml-6 text-emerald-700">
                <li>Buka Google Drive Anda, masuk ke dalam folder utama <strong>LPJ PIP DIKTI STIMI YAPMI</strong>.</li>
                <li>Masuk ke dalam folder periode pelaporan: <strong>LPJ {activeTahunAkademik.toUpperCase()}</strong>.</li>
                <li>Buat folder baru di dalamnya dengan nama <strong>Bukti Penggunaan Biaya Hidup - [Nama Anda]</strong>.</li>
                <li>Upload semua foto nota atau kwitansi ke dalam folder tersebut.</li>
                <li>Klik kanan pada folder <strong>Bukti Penggunaan Biaya Hidup - [Nama Anda]</strong>, pilih Bagikan (Share).</li>
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
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
                placeholder="https://drive.google.com/drive/folders/..." 
              />
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500 italic flex-1">
              *Data akan tersimpan secara otomatis (Draft) sebelum LPJ disubmit final.
            </p>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center gap-2 disabled:opacity-70"
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
