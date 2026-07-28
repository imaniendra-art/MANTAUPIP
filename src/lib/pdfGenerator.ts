import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as QRCode from "qrcode";

export const generatePDF = async (
  lpjData: any,
  profile: any,
  options: { isPreview?: boolean, isAdmin?: boolean, adminName?: string } = {}
) => {
  const { isPreview = false, isAdmin = false, adminName = "Admin PIP" } = options;
  
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25.4;
  const contentWidth = pageWidth - (margin * 2);
  
  const centerText = (text: string, y: number, fontStyle: "normal"|"bold" = "normal", size: number = 12) => {
    doc.setFont("times", fontStyle);
    doc.setFontSize(size);
    doc.text(text, pageWidth / 2, y, { align: "center" });
  };

  // Data Prep
  // For admin, data is already populated. For mahasiswa, it might be from local storage if draft.
  const akademik = lpjData._id !== "draft" && lpjData.data_akademik ? lpjData.data_akademik : JSON.parse(localStorage.getItem("draft_prestasi_akademik") || "{}");
  const akademikLampau = lpjData._id !== "draft" && lpjData.data_akademik_lampau ? lpjData.data_akademik_lampau : JSON.parse(localStorage.getItem("draft_prestasi_akademik_lampau") || "[]");
  const nonAkademik = lpjData._id !== "draft" && lpjData.data_non_akademik ? lpjData.data_non_akademik : JSON.parse(localStorage.getItem("draft_prestasi_non_akademik") || "{}");
  const biayaHidup = lpjData._id !== "draft" && lpjData.data_biaya_hidup ? lpjData.data_biaya_hidup : JSON.parse(localStorage.getItem("draft_biaya_hidup") || "{}");
  const ekonomi = lpjData._id !== "draft" && lpjData.data_kondisi_ekonomi ? lpjData.data_kondisi_ekonomi : JSON.parse(localStorage.getItem("draft_kondisi_ekonomi") || "{}");
  
  const semStr = lpjData.semester_berjalan || "2025/2026 Genap";
  const usrName = profile?.name || profile?.nama_lengkap || "NAMA MAHASISWA";
  const usrNim = profile?.nim || "NIM MAHASISWA";
  const usrProdi = profile?.program_studi || "PROGRAM STUDI";

  const drawLink = (url: string, x: number, y: number) => {
    if(url && url.startsWith("http")) {
      doc.setTextColor(0, 0, 255);
      doc.textWithLink("Buka Lampiran (Klik Disini)", x, y, { url });
      doc.setTextColor(0, 0, 0);
    } else {
      doc.text("-", x, y);
    }
  }

  const loadImage = (url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };

  const drawFooter = (pageNum: number) => {
    doc.setLineWidth(0.5);
    doc.line(margin, 280, pageWidth - margin, 280);
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.text("LPJ Penerima PIP STIMI YAPMI Makassar", margin, 285);
    doc.text(pageNum.toString(), pageWidth - margin, 285, { align: "right" });
  };

  doc.setLineHeightFactor(1.5);

  // HALAMAN 1
  centerText("LAPORAN PERTANGGUNG JAWABAN PENERIMA MANFAAT", 40, "bold", 14);
  centerText("PROGRAM INDONESIA PINTAR PENDIDIKAN TINGGI (PIP DIKTI)", 47, "bold", 14);
  const semText = `PERIODE ${semStr.toUpperCase()}`;
  centerText(semText, 54, "bold", 14);

  try {
    const logoImg = await loadImage('/logo_stimi.png');
    doc.addImage(logoImg, 'PNG', (pageWidth/2) - 20, 90, 40, 40);
  } catch(e) {}

  doc.setFontSize(12);
  doc.setFont("times", "bold");
  const startY = 170;
  doc.text("NAMA", 50, startY); doc.text(`: ${usrName}`, 85, startY);
  doc.text("NIM", 50, startY + 10); doc.text(`: ${usrNim}`, 85, startY + 10);
  doc.text("PRODI", 50, startY + 20); doc.text(`: ${usrProdi}`, 85, startY + 20);

  const reportYearMatch = semStr.match(/\d{4}\/(\d{4})/);
  const reportYear = reportYearMatch ? reportYearMatch[1] : new Date().getFullYear().toString();
  centerText("Sekolah Tinggi Ilmu Manajemen Indonesia YAPMI Makassar", 240, "bold", 14);
  centerText(`TAHUN ${reportYear}`, 248, "bold", 14);

  // HALAMAN 2
  doc.addPage();
  centerText("PENDAHULUAN", margin, "bold", 12);
  doc.setFont("times", "normal");
  const textPendahuluan = `Penyaluran beasiswa Program Indonesia Pintar (PIP) Pendidikan Tinggi (DIKTI) di STIMI YAPMI Makassar merupakan salah satu wujud nyata komitmen institusi dalam mendukung pemerataan akses pendidikan. Program ini secara khusus ditujukan kepada mahasiswa yang memiliki potensi akademik unggul namun menghadapi keterbatasan ekonomi. Tujuan utama dari pemberian bantuan ini meliputi:\n\n1. Meningkatkan motivasi belajar serta capaian prestasi mahasiswa, terutama bagi mereka yang berasal dari keluarga kurang mampu.\n2. Membuka akses dan memberikan kesempatan belajar seluas-luasnya di perguruan tinggi.\n3. Menjamin keberlangsungan studi mahasiswa agar dapat menyelesaikannya tepat waktu tanpa kendala finansial.\n4. Mendorong peningkatan kualitas mahasiswa, baik pada bidang akademik maupun kegiatan ekstrakurikuler.\n5. Menghasilkan lulusan yang mandiri, produktif, kompeten, dan memiliki kepekaan sosial tinggi.\n6. Menciptakan dampak positif dan iklim kompetitif bagi mahasiswa lainnya untuk terus berprestasi.\n\nProgram bantuan PIP DIKTI ini memberikan manfaat yang sangat besar bagi mahasiswa STIMI YAPMI Makassar. Untuk menjamin transparansi, akuntabilitas, serta memastikan bahwa pemanfaatan dana beasiswa ini tepat guna dan tepat sasaran, maka setiap mahasiswa penerima bantuan diwajibkan untuk menyusun Laporan Pertanggungjawaban (LPJ). Laporan ini mencakup perkembangan prestasi akademik, kegiatan non-akademik, serta rincian pemanfaatan dana bantuan biaya hidup selama semester berjalan.`;
  
  let pY_pendahuluan = 35;
  textPendahuluan.split('\n').forEach((p) => {
    if (p.trim() === '') {
      pY_pendahuluan += 6.35;
    } else {
      doc.text(p, margin, pY_pendahuluan, { maxWidth: contentWidth, align: "justify" });
      const lines = doc.splitTextToSize(p, contentWidth);
      pY_pendahuluan += (lines.length * 6.35);
    }
  });
  drawFooter(1);

  // HALAMAN 3
  doc.addPage();
  centerText("LAPORAN AKADEMIK DAN NON AKADEMIK", 20, "bold", 12);
  doc.setFont("times", "bold");
  doc.text("I. LAPORAN PRESTASI AKADEMIK", margin, 30);
  doc.setFont("times", "normal");
  doc.text("a) Tabel Kartu Rencana Studi", margin + 5, 38);
  
  const targetSemAkademik = parseInt(akademik.semester) || 1;
  const arrKRS = [];
  for(let i=1; i<=8; i++) {
    const lampauItem = akademikLampau.find((l:any) => parseInt(l.semester) === i);
    if(i === targetSemAkademik) {
       arrKRS.push([i.toString(), semStr, i.toString(), akademik.jumlahMatkul || '-', akademik.sks || '-']);
    } else if(lampauItem) {
       arrKRS.push([i.toString(), lampauItem.tahunAkademik || '-', i.toString(), lampauItem.jumlahMatkul || '-', lampauItem.sks || '-']);
    } else {
       arrKRS.push([i.toString(), '.....', i.toString(), '.....', '.....']);
    }
  }

  autoTable(doc, {
    startY: 42,
    head: [['No.', 'Tahun Akademik', 'Semester', 'Jumlah mata kuliah', 'Jumlah SKS']],
    body: arrKRS,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', font: 'times' },
    margin: { left: margin, right: margin }
  });

  doc.setFontSize(10);
  doc.text("*) Beri Tanda \"-\" untuk semester yang belum ditempuh", margin + 5, (doc as any).lastAutoTable.finalY + 5);
  doc.setFontSize(12);
  doc.text("b) Tabel perkembangan Prestasi Akademik", margin + 5, (doc as any).lastAutoTable.finalY + 15);
  
  const arrPrestasi = [];
  for(let i=1; i<=8; i++) {
    const lampauItem = akademikLampau.find((l:any) => parseInt(l.semester) === i);
    if(i === targetSemAkademik) {
       arrPrestasi.push([i.toString(), semStr, i.toString(), akademik.ips || '-', akademik.ipk || '-']);
    } else if(lampauItem) {
       arrPrestasi.push([i.toString(), lampauItem.tahunAkademik || '-', i.toString(), lampauItem.ips || '-', lampauItem.ipk || '-']);
    } else {
       arrPrestasi.push([i.toString(), '.....', i.toString(), '.....', '.....']);
    }
  }

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [['No.', 'Tahun Akademik', 'Semester', 'IPS', 'IPK']],
    body: arrPrestasi,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', font: 'times' },
    margin: { left: margin, right: margin }
  });
  doc.setFontSize(10);
  doc.text("*) IPK (melampirkan Transkrip Nilai )", margin + 5, (doc as any).lastAutoTable.finalY + 5);
  drawFooter(2);

  // HALAMAN 4
  doc.addPage();
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("II. LAPORAN PRESTASI NON AKADEMIK", margin, 20);
  doc.setFont("times", "normal");
  doc.text("a. Prestasi yang diraih selama menjadi mahasiswa :", margin + 5, 28);
  
  const arrNonA = (nonAkademik.prestasi && nonAkademik.prestasi.length > 0) ? nonAkademik.prestasi.map((p:any, idx:number) => [
    (idx+1).toString(), p.kegiatan || p.nama || '-', p.tingkat || '-', p.waktu || p.tahun || '-', p.hasil || '-'
  ]) : [['1', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: 32,
    head: [['No.', 'Kegiatan', 'Tingkat', 'Waktu / Tahun Pelaksanaan', 'Hasil']],
    body: arrNonA,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', font: 'times' },
    margin: { left: margin, right: margin }
  });

  doc.text("b) Keikutsertaan pada kegiatan organisasi kemahasiswaan :", margin + 5, (doc as any).lastAutoTable.finalY + 15);
  
  const arrOrg = (nonAkademik.organisasi && nonAkademik.organisasi.length > 0) ? nonAkademik.organisasi.map((p:any, idx:number) => [
    (idx+1).toString(), p.nama || p.kegiatan || '-', p.tingkat || '-', p.jabatan || '-', p.waktu || p.tahun || '-'
  ]) : [['1', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [['No.', 'Nama Organisasi', 'Tingkat', 'Jabatan', 'Tahun/Periode']],
    body: arrOrg,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', font: 'times' },
    margin: { left: margin, right: margin }
  });

  doc.text("c) Publikasi Ilmiah/Karya Tulis :", margin + 5, (doc as any).lastAutoTable.finalY + 15);
  
  const arrPub = (nonAkademik.publikasi && nonAkademik.publikasi.length > 0) ? nonAkademik.publikasi.map((p:any, idx:number) => [
    (idx+1).toString(), p.judul || '-', p.waktu || p.tahun || '-'
  ]) : [['1', '-', '-']];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [['No.', 'Judul karya tulis/karya ilmiah', 'Waktu / Tahun Publikasi']],
    body: arrPub,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', font: 'times' },
    margin: { left: margin, right: margin }
  });
  
  doc.text("d) Kepanitiaan (Event / Kegiatan Mahasiswa) :", margin + 5, (doc as any).lastAutoTable.finalY + 15);
  
  const arrPan = (nonAkademik.kepanitiaan && nonAkademik.kepanitiaan.length > 0) ? nonAkademik.kepanitiaan.map((p:any, idx:number) => [
    (idx+1).toString(), p.nama || p.kegiatan || '-', p.tingkat || '-', p.jabatan || '-', p.waktu || p.tahun || '-'
  ]) : [['1', '-', '-', '-', '-']];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 18,
    head: [['No.', 'Nama Kepanitiaan', 'Tingkat', 'Jabatan', 'Waktu / Tahun Pelaksanaan']],
    body: arrPan,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', font: 'times' },
    margin: { left: margin, right: margin }
  });

  drawFooter(3);

  // HALAMAN 5
  doc.addPage();
  centerText("LAPORAN KEUANGAN", 20, "bold", 12);
  doc.setFont("times", "normal");
  doc.text(`Laporan penggunaan bantuan biaya hidup PIP DIKTI STIMI YAPMI Makassar`, margin, 30);
  doc.text(`semester berjalan:`, margin, 36);

  const pemasukan = parseInt(biayaHidup.pemasukan) || 6600000;
  const sisaDanaSebelumnya = parseInt(biayaHidup.sisaDanaSebelumnya) || 0;
  const pengeluaranArr = Array.isArray(biayaHidup.pengeluaran) ? biayaHidup.pengeluaran : [];
  
  const arrKeuangan: any[] = [];
  let totalKeluar = 0;
  const totalMasuk = pemasukan + sisaDanaSebelumnya;
  
  arrKeuangan.push([
    '1', 
    'Terima Biaya Hidup' + (sisaDanaSebelumnya > 0 ? ' & Sisa Dana Sebelumnya' : ''), 
    `Rp. ${totalMasuk.toLocaleString('id-ID')},-`, 
    'Rp. 0,-', 
    `Rp. ${totalMasuk.toLocaleString('id-ID')},-`
  ]);

  pengeluaranArr.forEach((p:any, idx:number) => {
    const jml = parseInt(p.jumlah) || 0;
    totalKeluar += jml;
    arrKeuangan.push([
      (idx + 2).toString(),
      p.keperluan || '-',
      '-',
      `Rp. ${jml.toLocaleString('id-ID')},-`,
      '-'
    ]);
  });

  arrKeuangan.push([
    '', 
    'Jumlah', 
    `Rp. ${totalMasuk.toLocaleString('id-ID')},-`, 
    `Rp. ${totalKeluar.toLocaleString('id-ID')},-`, 
    `Rp. ${(totalMasuk - totalKeluar).toLocaleString('id-ID')},-`
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['No', 'Keperluan', 'Masuk', 'Keluar', 'Saldo Akhir']],
    body: arrKeuangan,
    theme: 'grid',
    headStyles: { fillColor: [150, 150, 150], halign: 'center', textColor: 0 as any, font: 'times', fontStyle: 'bold' },
    bodyStyles: { font: 'times' },
    margin: { left: margin, right: margin }
  });

  drawFooter(4);

  // HALAMAN 6
  doc.addPage();
  centerText("LAPORAN KONDISI EKONOMI", margin, "bold", 12);
  doc.setFont("times", "normal");
  
  let ecoY = 38;
  
  const printEcoSection = (title: string, text: string) => {
     if (ecoY > 260) {
        doc.addPage();
        ecoY = 20;
     }
     doc.setFont("times", "bold");
     doc.text(title, margin, ecoY);
     ecoY += 6.35;
     
     doc.setFont("times", "normal");
     const textContent = text || "-";
     
     textContent.split('\n').forEach((p) => {
        if (p.trim() === '') {
           ecoY += 6.35;
        } else {
           if (ecoY > 270) {
              doc.addPage();
              ecoY = 20;
           }
           doc.text(p, margin, ecoY, { maxWidth: contentWidth, align: "justify" });
           const lines = doc.splitTextToSize(p, contentWidth);
           ecoY += (lines.length * 6.35);
        }
     });
     
     ecoY += 6.35;
  };

  printEcoSection("1. Pekerjaan Ayah dan Ibu", ekonomi.pekerjaanOrtu);
  printEcoSection("2. Penghasilan Ayah dan Ibu per bulan", ekonomi.penghasilanOrtu);
  printEcoSection("3. Jumlah Tanggungan Keluarga", ekonomi.tanggungan);
  printEcoSection("4. Pengeluaran Rutin Keluarga", ekonomi.pengeluaranKeluarga);
  printEcoSection("5. Kepemilikan Kendaraan", ekonomi.kendaraan);
  printEcoSection("6. Kepemilikan Handphone (HP)", ekonomi.hp);
  printEcoSection("7. Kepemilikan Laptop", ekonomi.laptop);
  printEcoSection("8. Alasan Layak Menerima PIP DIKTI", ekonomi.alasanLayak);
  
  drawFooter(5);

  // HALAMAN 7
  doc.addPage();
  centerText("PENUTUP", margin, "bold", 12);
  doc.setFont("times", "normal");
  
  const pPenutup = `Demikian Laporan Pertanggungjawaban (LPJ) ini disusun sebagai bentuk transparansi dan akuntabilitas saya selaku penerima beasiswa Program Indonesia Pintar (PIP) DIKTI di STIMI YAPMI Makassar. Laporan ini memuat rekam jejak prestasi akademik dan non-akademik, kondisi ekonomi keluarga terkini, serta rincian penggunaan bantuan biaya hidup yang telah disalurkan. Segala data dan informasi yang tercantum di dalam dokumen ini saya buat dengan sebenar-benarnya dan dapat dipertanggungjawabkan.\n\nSaya mengucapkan terima kasih yang sebesar-besarnya kepada pihak STIMI YAPMI Makassar dan penyelenggara program PIP DIKTI atas dukungan yang diberikan. Semoga bantuan ini menjadi motivasi bagi saya untuk terus berprestasi, menyelesaikan studi dengan baik, dan kelak mampu memberikan kontribusi nyata bagi nusa dan bangsa.`;
  
  let endY = 35;
  pPenutup.split('\n').forEach((p) => {
    if (p.trim() === '') {
      endY += 6.35;
    } else {
      doc.text(p, margin, endY, { maxWidth: contentWidth, align: "justify" });
      const lines = doc.splitTextToSize(p, contentWidth);
      endY += (lines.length * 6.35);
    }
  });

  const getFormattedDate = (dateString?: string) => {
    const d = dateString ? new Date(dateString) : new Date();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  const sigDate = getFormattedDate(lpjData.status_laporan !== "DRAFT" ? (lpjData.updatedAt || lpjData.createdAt) : undefined);
  
  const sigY = Math.max(endY + 15, 90);
  doc.text(`Makassar, ${sigDate}`, 120, sigY);
  doc.text(`Pembuat Laporan`, 120, sigY + 7);

  // QR Code generation for approved LPJs
  if (lpjData.status_laporan === "DISETUJUI") {
    try {
       const qrData = `Telah diverifikasi dan disetujui secara elektronik oleh ${adminName}. Dokumen ini sah.`;
       const qrBase64 = await QRCode.toDataURL(qrData, { width: 100, margin: 1, color: { dark: "#000000", light: "#ffffff" } });
       doc.addImage(qrBase64, 'PNG', 120, sigY + 10, 25, 25);
       doc.setFontSize(8);
       doc.text("Disetujui secara elektronik", 120, sigY + 38);
       doc.setFontSize(12);
    } catch (e) {
       console.error("Gagal generate QR Code", e);
    }
  }

  doc.text(usrName, 120, sigY + (lpjData.status_laporan === "DISETUJUI" ? 43 : 37));
  doc.text(`NIM. ${usrNim}`, 120, sigY + (lpjData.status_laporan === "DISETUJUI" ? 48 : 44));

  drawFooter(6);

  // HALAMAN 8
  doc.addPage();
  centerText("DAFTAR LAMPIRAN", 20, "bold", 12);
  doc.setFont("times", "normal");
  
  const lampiranY = 40;
  doc.text("1. Prestasi Akademik (Transkrip/KHS):", margin, lampiranY);
  drawLink(akademik.linkDrive, 95, lampiranY);

  doc.text("2. Bukti Prestasi Non Akademik:", margin, lampiranY + 15);
  drawLink(nonAkademik.linkDrive, 95, lampiranY + 15);

  doc.text("3. Bukti Pengeluaran Biaya Hidup:", margin, lampiranY + 30);
  drawLink(biayaHidup.linkDrive, 95, lampiranY + 30);

  doc.text("4. Surat Keterangan Ekonomi:", margin, lampiranY + 45);
  drawLink(ekonomi.linkDrive, 95, lampiranY + 45);

  drawFooter(7);

  if (isPreview) {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } else {
    const safeSem = semStr.replace(/\//g, "-");
    const semParts = safeSem.split(" ");
    const fileName = `LPJ ${semParts[1] || ''} ${semParts[0] || ''} ${usrName}`.trim().replace(/\s+/g, ' ') + ".pdf";
    doc.save(fileName);
  }
};
