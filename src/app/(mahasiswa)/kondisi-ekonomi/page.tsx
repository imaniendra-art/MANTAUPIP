"use client";

import { ArrowLeft, Link as LinkIcon, Save } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function KondisiEkonomiPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    pekerjaanOrtu: "",
    penghasilanOrtu: "",
    tanggungan: "",
    pengeluaranKeluarga: "",
    kendaraan: "",
    hp: "",
    laptop: "",
    alasanLayak: "",
    linkDrive: ""
  });

  const activeTahunAkademik = "2025/2026 Genap";

  useEffect(() => {
    const saved = localStorage.getItem("draft_kondisi_ekonomi");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    alert("Dilarang melakukan Copy-Paste! Harap ketik laporan Anda secara langsung secara orisinil.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi narasi minimal 10 kata
    const minWords = 10;
    const fieldsToValidate = [
      { key: "pekerjaanOrtu", label: "1. Pekerjaan ayah dan ibu" },
      { key: "penghasilanOrtu", label: "2. Penghasilan ayah dan ibu" },
      { key: "tanggungan", label: "3. Jumlah tanggungan keluarga" },
      { key: "pengeluaranKeluarga", label: "4. Pengeluaran secara umum" },
      { key: "kendaraan", label: "5. Kepemilikan Kendaraan" },
      { key: "alasanLayak", label: "8. Alasan masih layak menerima PIP" }
    ];

    for (let field of fieldsToValidate) {
      const words = countWords(formData[field.key as keyof typeof formData]);
      if (words < minWords) {
        alert(`Isian Anda terlalu singkat! Harap ceritakan lebih detail secara naratif pada bagian "${field.label}". Minimal ${minWords} kata (Saat ini baru: ${words} kata).`);
        return; // Hentikan form submission
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem("draft_kondisi_ekonomi", JSON.stringify(formData));
      setIsSubmitting(false);
      alert("Data berhasil disimpan sementara (Draft).");
    }, 1000);
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
          Progress LPJ: <span className="text-pipdikti-sky font-bold">4/6</span> Selesai
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-6 text-white">
          <h2 className="text-2xl font-bold">4. Laporan Kondisi Ekonomi</h2>
          <p className="mt-2 text-amber-100 font-medium text-sm md:text-base">
            Ceritakan kondisi ekonomi keluarga Anda secara detail dan jujur sebagai bahan evaluasi kelayakan penerima PIP DIKTI.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="pekerjaanOrtu" className="block text-sm font-semibold text-gray-800">
                1. Ceritakan pekerjaan ayah dan pekerjaan ibu
              </label>
              <textarea 
                onPaste={handlePaste} 
                id="pekerjaanOrtu" 
                required
                value={formData.pekerjaanOrtu}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                placeholder="Ayah saya bekerja sebagai... sedangkan Ibu saya bekerja sebagai..." 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="penghasilanOrtu" className="block text-sm font-semibold text-gray-800">
                2. Sampaikan informasi jumlah penghasilan ayah dan penghasilan ibu per bulan
              </label>
              <textarea 
                onPaste={handlePaste} 
                id="penghasilanOrtu" 
                required
                value={formData.penghasilanOrtu}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                placeholder="Penghasilan rata-rata Ayah sekitar Rp... dan Ibu sekitar Rp..." 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tanggungan" className="block text-sm font-semibold text-gray-800">
                3. Sampaikan informasi jumlah tanggungan keluarga
              </label>
              <textarea 
                onPaste={handlePaste} 
                id="tanggungan" 
                required
                value={formData.tanggungan}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                placeholder="Terdapat ... orang tanggungan keluarga, terdiri dari..." 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pengeluaranKeluarga" className="block text-sm font-semibold text-gray-800">
                4. Sampaikan pengeluaran secara umum tanggungan keluarga
              </label>
              <p className="text-xs text-gray-500">(Misal: sewa rumah, pembayaran piutang/hutang, biaya listrik, pendidikan saudara, dll)</p>
              <textarea 
                onPaste={handlePaste} 
                id="pengeluaranKeluarga" 
                required
                value={formData.pengeluaranKeluarga}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                placeholder="Pengeluaran rutin bulanan meliputi..." 
              />
            </div>

            <div className="p-5 bg-amber-50 border border-amber-100 rounded-xl space-y-5">
              <h3 className="font-bold text-amber-900 border-b border-amber-200 pb-2">Informasi Kepemilikan Barang Elektronik & Kendaraan</h3>
              
              <div className="space-y-2">
                <label htmlFor="kendaraan" className="block text-sm font-semibold text-gray-800">
                  5. Kepemilikan Kendaraan
                </label>
                <p className="text-xs text-gray-600">Jelaskan jenis motor/mobil yang dimiliki keluarga atau Anda (contoh: NMAX, Aerox, Vario). Apakah dibelikan orang tua (baru/bekas) atau beli sendiri?</p>
                <textarea 
                onPaste={handlePaste} 
                  id="kendaraan" 
                  required
                  value={formData.kendaraan}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: Saya pakai motor Aerox 2023, dibelikan baru oleh orang tua..." 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="hp" className="block text-sm font-semibold text-gray-800">
                  6. Kepemilikan Gadget / HP (Milik Pribadi)
                </label>
                <p className="text-xs text-gray-600">Sebutkan merk & tipe HP pribadi Anda (contoh: iPhone 13, Samsung A54). Jelaskan sejak kapan Anda memilikinya dan dari mana sumber dananya (hadiah ortu, hasil kerja sampingan, dari dana PIP, dll).</p>
                <textarea 
                onPaste={handlePaste} 
                  id="hp" 
                  required
                  value={formData.hp}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: iPhone 11, beli tahun 2024 dari hasil nabung uang PIP dan kerja paruh waktu..." 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="laptop" className="block text-sm font-semibold text-gray-800">
                  7. Kepemilikan Laptop
                </label>
                <p className="text-xs text-gray-600">Sebutkan merk/tipe laptop Anda dan sumber dananya (Sangat diperbolehkan menggunakan dana PIP untuk membeli laptop penunjang kuliah).</p>
                <textarea 
                onPaste={handlePaste} 
                  id="laptop" 
                  required
                  value={formData.laptop}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                  placeholder="Contoh: Laptop Asus Vivobook, dibeli menggunakan akumulasi dana PIP semester 1 & 2..." 
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label htmlFor="alasanLayak" className="block text-sm font-semibold text-gray-800">
                8. Sampaikan alasan mengapa Saudara masih layak ditetapkan sebagai penerima PIP DIKTI pada semester selanjutnya
              </label>
              <p className="text-xs text-amber-800 bg-amber-100/50 p-3 rounded-lg border border-amber-200 leading-relaxed">
                <strong>Catatan Penting:</strong> Sebagai bentuk penguatan argumen dan bukti kelayakan, Anda <strong>diwajibkan</strong> untuk melampirkan <strong>Surat Keterangan Tidak Mampu (SKTM)</strong> terbaru dari kantor Kelurahan/Desa setempat. Pastikan dokumen SKTM tersebut diunggah ke dalam folder Google Drive yang sama dengan foto kondisi rumah Anda.
              </p>
              <textarea 
                onPaste={handlePaste} 
                id="alasanLayak" 
                required
                value={formData.alasanLayak}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-sm leading-relaxed text-slate-900 placeholder:text-slate-400" 
                placeholder="Contoh: Bantuan ini sangat krusial bagi saya. Sebagai timbal balik, saya berkomitmen untuk menyumbangkan prestasi akademik/non-akademik, aktif membantu kegiatan perguruan tinggi, mempertahankan IPK tinggi, dan lulus tepat waktu..." 
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Bukti Kondisi Ekonomi (Foto Rumah/SKTM)</h3>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm text-amber-800 space-y-2">
              <p className="font-semibold text-amber-900 flex items-center gap-2">
                <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">i</span>
                Panduan Pengunggahan Bukti:
              </p>
              <ol className="list-decimal list-outside space-y-1 ml-6 text-amber-700">
                <li>Buka Google Drive Anda, masuk ke dalam folder utama <strong>LPJ PIP DIKTI STIMI YAPMI</strong>.</li>
                <li>Masuk ke dalam folder periode pelaporan: <strong>LPJ {activeTahunAkademik.toUpperCase()}</strong>.</li>
                <li>Buat folder baru di dalamnya dengan nama <strong>Bukti Kondisi Ekonomi - [Nama Anda]</strong>.</li>
                <li>Upload foto kondisi rumah terbaru (Tampak Depan, Ruang Tamu, Dapur) atau foto SKTM ke dalam folder tersebut.</li>
                <li>Klik kanan pada folder <strong>Bukti Kondisi Ekonomi - [Nama Anda]</strong>, pilih Bagikan (Share).</li>
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
                id="linkDrive"
                required
                value={formData.linkDrive}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
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
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-2 disabled:opacity-70"
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
