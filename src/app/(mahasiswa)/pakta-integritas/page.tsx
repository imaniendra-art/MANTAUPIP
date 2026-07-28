"use client";

import { ArrowLeft, Link as LinkIcon, Save, Download, FileText, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

export default function PaktaIntegritasPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [linkDrive, setLinkDrive] = useState("");
  
  const [studentData, setStudentData] = useState({
    name: "",
    nim: "",
    program_studi: "",
    nik: "",
    no_hp: ""
  });

  const activeTahunAkademik = "2025/2026 Genap";

  useEffect(() => {
    const saved = localStorage.getItem("draft_pakta_integritas");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.linkDrive) setLinkDrive(parsed.linkDrive);
      } catch (e) {
        console.error(e);
      }
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/mahasiswa/profil");
        if (res.ok) {
          const result = await res.json();
          setStudentData({
            name: result.data.name || "-",
            nim: result.data.nim || "-",
            program_studi: result.data.program_studi || "-",
            nik: result.data.nik || "",
            no_hp: result.data.no_hp || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem("draft_pakta_integritas", JSON.stringify({ linkDrive }));
      setIsSubmitting(false);
      alert("Data berhasil disimpan sementara (Draft).");
    }, 1000);
  };

  const getFormattedDate = () => {
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const writeHeaderAndProfile = (doc: jsPDF, title: string) => {
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(title, 105, 20, { align: "center" });
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text("Saya yang bertanda tangan di bawah ini:", 20, 40);
    
    const startY = 50;
    const lh = 7; // line height
    
    // Label
    doc.text("Nama", 20, startY);
    doc.text("NIM", 20, startY + lh);
    doc.text("Program Studi", 20, startY + lh * 2);
    doc.text("NIK", 20, startY + lh * 3);
    doc.text("Nomor HP", 20, startY + lh * 4);
    
    // Titik Dua (Colon) -> posisi X = 55 agar semua sejajar sempurna
    doc.text(":", 55, startY);
    doc.text(":", 55, startY + lh);
    doc.text(":", 55, startY + lh * 2);
    doc.text(":", 55, startY + lh * 3);
    doc.text(":", 55, startY + lh * 4);
    
    // Values -> posisi X = 58
    doc.text(studentData.name, 58, startY);
    doc.text(studentData.nim, 58, startY + lh);
    doc.text(studentData.program_studi, 58, startY + lh * 2);
    doc.text(studentData.nik || "................................................", 58, startY + lh * 3);
    doc.text(studentData.no_hp || "................................................", 58, startY + lh * 4);
  };

  const generatePDF1 = () => {
    const doc = new jsPDF({ format: "a4" });
    writeHeaderAndProfile(doc, "SURAT PERNYATAAN KEBENARAN DATA DAN BEBAS PUNGLI");
    
    const text = "Menyatakan dengan sesungguhnya bahwa seluruh data dan dokumen yang saya laporkan pada Laporan Pertanggungjawaban PIP DIKTI adalah benar dan dapat dipertanggungjawabkan. Saya juga menyatakan bahwa saya menerima dana bantuan PIP DIKTI secara utuh ke rekening saya dan tidak ada pemotongan/pungli dari pihak manapun, baik internal kampus maupun eksternal. Jika di kemudian hari terbukti melanggar, saya bersedia menerima sanksi pencabutan beasiswa.";
    
    doc.text(text, 20, 95, { maxWidth: 170, align: "justify" });
    
    doc.text(`Makassar, ${getFormattedDate()}`, 130, 140);
    doc.text("Yang Membuat Pernyataan,", 130, 147);
    doc.text("Materai", 135, 160);
    doc.text("Rp. 10.000", 132, 165);
    
    doc.text(`(${studentData.name})`, 130, 185);
    doc.save("Surat_Kebenaran_Data.pdf");
  };

  const generatePDF2 = () => {
    const doc = new jsPDF({ format: "a4" });
    writeHeaderAndProfile(doc, "SURAT PERNYATAAN TIDAK MENERIMA BEASISWA LAIN");
    
    const text = "Menyatakan dengan sesungguhnya bahwa selama saya ditetapkan sebagai penerima PIP DIKTI di Sekolah Tinggi Ilmu Manajemen Indonesia (STIMI) YAPMI Makassar, saya TIDAK SEDANG dan TIDAK AKAN menerima beasiswa dari sumber lain yang dibiayai oleh APBN / APBD maupun instansi swasta lainnya yang bersifat double funding. Jika di kemudian hari ditemukan hal sebaliknya, saya bersedia mengembalikan seluruh dana PIP DIKTI yang telah saya terima ke Kas Negara.";
    
    doc.text(text, 20, 95, { maxWidth: 170, align: "justify" });
    
    doc.text(`Makassar, ${getFormattedDate()}`, 130, 140);
    doc.text("Yang Membuat Pernyataan,", 130, 147);
    doc.text("Materai", 135, 160);
    doc.text("Rp. 10.000", 132, 165);
    
    doc.text(`(${studentData.name})`, 130, 185);
    doc.save("Surat_Tidak_Menerima_Beasiswa_Lain.pdf");
  };

  const generatePDF3 = () => {
    const doc = new jsPDF({ format: "a4" });
    writeHeaderAndProfile(doc, "SURAT PERNYATAAN KELAYAKAN DAN KESEDIAAN");
    
    const text = "Menyatakan dengan sesungguhnya bahwa kondisi ekonomi keluarga saya saat ini masih tergolong kurang mampu, dan bantuan PIP DIKTI ini sangat krusial bagi kelancaran studi saya. Oleh karena itu, saya menyatakan masih layak dan bersedia untuk kembali ditetapkan sebagai penerima PIP DIKTI pada semester berikutnya.";
    
    doc.text(text, 20, 95, { maxWidth: 170, align: "justify" });
    
    doc.text(`Makassar, ${getFormattedDate()}`, 130, 140);
    doc.text("Yang Membuat Pernyataan,", 130, 147);
    doc.text("Materai", 135, 160);
    doc.text("Rp. 10.000", 132, 165);
    
    doc.text(`(${studentData.name})`, 130, 185);
    doc.save("Surat_Masih_Layak_dan_Bersedia.pdf");
  };

  const generatePDF4 = () => {
    const doc = new jsPDF({ format: "a4" });
    writeHeaderAndProfile(doc, "SURAT PERNYATAAN KOMITMEN BERPRESTASI");
    
    const text = "Menyatakan dengan sesungguhnya bahwa sebagai wujud tanggung jawab atas bantuan PIP DIKTI yang diberikan oleh Negara, saya berkomitmen kuat untuk:\n\n1. Mematuhi seluruh peraturan dan kode etik mahasiswa STIMI YAPMI Makassar.\n2. Belajar dengan sungguh-sungguh untuk mempertahankan dan meningkatkan IPK di setiap semesternya.\n3. Aktif berpartisipasi dalam organisasi kemahasiswaan dan kegiatan kampus.\n4. Menyelesaikan studi tepat waktu sesuai ketentuan program PIP DIKTI.";
    
    doc.text(text, 20, 95, { maxWidth: 170, align: "justify" });
    
    doc.text(`Makassar, ${getFormattedDate()}`, 130, 160);
    doc.text("Yang Membuat Pernyataan,", 130, 167);
    doc.text("Materai", 135, 180);
    doc.text("Rp. 10.000", 132, 185);
    
    doc.text(`(${studentData.name})`, 130, 205);
    doc.save("Surat_Komitmen_Berprestasi.pdf");
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
          Progress LPJ: <span className="text-pipdikti-sky font-bold">5/6</span> Selesai
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow border border-white/40 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
          <h2 className="text-2xl font-bold">5. Pakta Integritas</h2>
          <p className="mt-2 text-red-100 font-medium text-sm md:text-base">
            Unduh templat surat pernyataan, tandatangani, dan unggah kembali ke Google Drive Anda.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h3 className="text-lg font-bold text-red-900 mb-4">PENDAHULUAN</h3>
            <div className="text-sm text-red-800 space-y-3 text-justify leading-relaxed">
              <p>
                Pemberian dan penyaluran Program Indonesia Pintar (PIP) DIKTI Sekolah Tinggi Ilmu Manajemen Indonesia (STIMI) YAPMI Makassar bertujuan untuk:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Meningkatkan motivasi belajar dan prestasi mahasiswa khususnya mereka yang menghadapi kendala ekonomi.</li>
                <li>Meningkatkan akses dan kesempatan belajar di perguruan tinggi bagi yang berpotensi akademik dan kurang mampu secara ekonomi.</li>
                <li>Menjamin keberlangsungan studi mahasiswa sampai selesai.</li>
                <li>Meningkatkan prestasi mahasiswa baik pada bidang akademik maupun ekstrakurikuler.</li>
                <li>Melahirkan lulusan yang mandiri, produktif dan memiliki kepedulian sosial, sehingga mampu berperan dalam upaya pengentasan kemiskinan dan pemberdayaan masyarakat.</li>
                <li>Menimbulkan dampak iring bagi mahasiswa lain untuk selalu meningkatkan prestasi.</li>
              </ol>
              <p className="pt-2">
                Adapun manfaat PIP DIKTI adalah untuk memberikan bantuan beasiswa kepada mahasiswa STIMI YAPMI Makassar yang memiliki prestasi dan memiliki kondisi ekonomi kurang mampu. Guna menjamin pemanfaatan beasiswa PIP DIKTI tepat guna dan tepat sasaran, perlu dilakukan pelaporan pertanggungjawaban meliputi prestasi akademik dan non akademik serta pelaporan pemanfaatan keuangan.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Unduh Surat Pernyataan</h3>
            <p className="text-sm text-gray-600">
              Silakan unduh dokumen di bawah ini, isi dengan data diri Anda, cetak, tandatangani, lalu unggah hasil scannya (PDF) ke Google Drive.
            </p>

            {(!studentData.nik || !studentData.no_hp) && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Informasi:</strong> Data NIK atau Nomor HP Anda belum diisi. Anda dapat mengisinya terlebih dahulu di menu 
                  <Link href="/akun" className="font-bold underline ml-1 hover:text-blue-900">Akun</Link> agar data tersebut otomatis tercetak di dalam PDF surat pernyataan ini.
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <button type="button" onClick={generatePDF1} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group w-full text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Surat Kebenaran Data</h4>
                    <p className="text-xs text-gray-500">Tidak ada potongan / pungli</p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
              </button>

              <button type="button" onClick={generatePDF2} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group w-full text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Surat Tidak Menerima Beasiswa Lain</h4>
                    <p className="text-xs text-gray-500">Anti double funding</p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
              </button>

              <button type="button" onClick={generatePDF3} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group w-full text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Surat Masih Layak & Bersedia</h4>
                    <p className="text-xs text-gray-500">Menerima PIP semester depan</p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
              </button>

              <button type="button" onClick={generatePDF4} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group w-full text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Surat Komitmen Berprestasi</h4>
                    <p className="text-xs text-gray-500">Kewajiban moral penerima beasiswa</p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-900 leading-relaxed">
              <strong>Pesan Pengingat:</strong> Bantuan pendidikan ini adalah wujud nyata investasi negara pada masa depan Anda. Oleh karena itu, manfaatkanlah sebaik-baiknya. Hindari sikap bermalas-malasan, patuhi seluruh tata tertib kampus, dan teruslah memacu diri untuk mencetak prestasi. Ingat, Surat Komitmen Berprestasi yang Anda tandatangani bukan sekadar syarat administrasi, melainkan janji moral dan wujud tanggung jawab Anda kepada almamater dan negara.
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Tautan Upload Pakta Integritas</h3>
            <p className="text-sm text-gray-600">
              Jadikan 4 surat di atas ke dalam satu folder Google Drive, pastikan pengaturan aksesnya adalah <strong>"Siapa saja yang memiliki tautan" (Viewer)</strong>, lalu tempel tautannya di bawah ini. Admin hanya akan mengecek tautan ini.
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="url" 
                id="linkDrive"
                value={linkDrive}
                onChange={(e) => setLinkDrive(e.target.value)}
                required
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white text-slate-900 placeholder:text-slate-400" 
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
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2 disabled:opacity-70"
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
