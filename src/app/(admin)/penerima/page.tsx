"use client";

import { Users, Upload, Search, Download, Plus, AlertCircle, Loader2, Pencil, Trash2, X, ArrowUpDown, Filter, ChevronLeft, ChevronRight, KeyRound } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useMemo, useEffect } from "react";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
};

export default function DataPenerimaPage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  
  // Filter States
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");
  const [filterProdi, setFilterProdi] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset pagination when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterAngkatan, filterProdi, sortConfig]);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // Add Modal State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    nim: "",
    nama_lengkap: "",
    program_studi: "",
    angkatan: "",
    status_pip: "AKTIF",
    bp: "",
    bh: ""
  });

  // Fetch recipients data
  const { data: response, isLoading } = useQuery({
    queryKey: ["penerimaData"],
    queryFn: async () => {
      const res = await fetch("/api/admin/penerima");
      return res.json();
    }
  });

  const allStudents = response?.data || [];
  
  // Generate unique filter options dynamically from data
  const uniqueAngkatan = useMemo(() => {
    const list = allStudents.map((s: any) => s.angkatan).filter(Boolean);
    return Array.from(new Set(list)).sort() as string[];
  }, [allStudents]);

  const uniqueProdi = useMemo(() => {
    const list = allStudents.map((s: any) => s.program_studi).filter(Boolean);
    return Array.from(new Set(list)).sort() as string[];
  }, [allStudents]);

  // Filter and Sort students
  const processedStudents = useMemo(() => {
    const filtered = allStudents.filter((student: any) => {
      // 1. Text Search Filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchNama = student.nama_lengkap?.toLowerCase().includes(searchLower);
        const matchNim = student.nim?.toLowerCase().includes(searchLower);
        if (!matchNama && !matchNim) return false;
      }

      // 2. Dropdown Filters
      if (filterStatus && student.status_pip !== filterStatus) return false;
      if (filterAngkatan && student.angkatan !== filterAngkatan) return false;
      if (filterProdi && student.program_studi !== filterProdi) return false;

      return true;
    });

    if (sortConfig !== null) {
      filtered.sort((a: any, b: any) => {
        let valA = a[sortConfig.key] || "";
        let valB = b[sortConfig.key] || "";
        
        // If sorting numbers
        if (sortConfig.key === 'bp' || sortConfig.key === 'bh') {
          valA = Number(valA);
          valB = Number(valB);
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [allStudents, searchTerm, sortConfig, filterStatus, filterAngkatan, filterProdi]);

  const totalPages = Math.ceil(processedStudents.length / itemsPerPage) || 1;
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [processedStudents, currentPage, itemsPerPage]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortableHeader = (label: string, sortKey: string) => (
    <th 
      key={sortKey}
      scope="col" 
      className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-200/50 transition-colors group whitespace-nowrap"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortConfig?.key === sortKey ? 'text-pipdikti-sky' : 'text-gray-400 group-hover:text-gray-600'}`} />
      </div>
    </th>
  );

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-penerima", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      
      if (res.ok) {
        alert(result.message);
        queryClient.invalidateQueries({ queryKey: ["penerimaData"] });
      } else {
        alert(result.error || "Gagal mengunggah data");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah");
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset input to allow selecting the same file again
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/penerima/${id}`, { method: "DELETE" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["penerimaData"] });
      } else {
        const result = await res.json();
        alert(result.error || "Gagal menghapus data");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (id: string) => {
    if (!confirm("Reset password mahasiswa ini kembali menjadi NIM? Mahasiswa akan diminta mengganti password saat login berikutnya.")) return;
    
    setResettingId(id);
    try {
      const res = await fetch(`/api/admin/penerima/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_PASSWORD" })
      });
      if (res.ok) {
        alert("Password berhasil direset!");
      } else {
        alert("Gagal mereset password");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setResettingId(null);
    }
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/penerima/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: editingUser.nama_lengkap,
          nim: editingUser.nim,
          program_studi: editingUser.program_studi,
          angkatan: editingUser.angkatan,
          jenjang: editingUser.jenjang,
          status_pip: editingUser.status_pip,
          bp: Number(editingUser.bp),
          bh: Number(editingUser.bh),
        }),
      });

      if (res.ok) {
        setEditingUser(null);
        queryClient.invalidateQueries({ queryKey: ["penerimaData"] });
      } else {
        const result = await res.json();
        alert(result.error || "Gagal menyimpan perubahan");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add New User
  const handleAddNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/penerima`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: newUser.nama_lengkap,
          nim: newUser.nim,
          program_studi: newUser.program_studi,
          angkatan: newUser.angkatan,
          status_pip: newUser.status_pip,
          bp: Number(newUser.bp),
          bh: Number(newUser.bh),
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setIsAddingUser(false);
        setNewUser({ nim: "", nama_lengkap: "", program_studi: "", angkatan: "", status_pip: "AKTIF", bp: "", bh: "" });
        queryClient.invalidateQueries({ queryKey: ["penerimaData"] });
      } else {
        alert(result.error || "Gagal menambahkan data");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pipdikti-sky/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#1a365d] to-[#2a528a] rounded-2xl shadow-md">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Data Penerima PIP
              </h1>
              <p className="text-slate-600 font-medium mt-1">
                Kelola basis data mahasiswa penerima PIP DIKTI STIMI YAPMI.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="/Template_Data_Penerima.xlsx"
              download
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-slate-700 font-semibold shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Unduh Template</span>
            </a>
            
            <label className={`flex items-center gap-2 px-5 py-2.5 bg-[#1a365d] hover:bg-[#2a528a] text-white rounded-xl font-semibold shadow-md transition-colors cursor-pointer ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>{isUploading ? "Mengunggah..." : "Unggah Data"}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-lg border border-white/60 overflow-hidden relative">
        {/* Toolbar & Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
            {/* Search */}
            <div className="relative w-full lg:w-80 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors sm:text-sm"
                placeholder="Cari berdasarkan NIM atau Nama..."
                disabled={allStudents.length === 0}
              />
            </div>
            
            {/* Filters */}
            {allStudents.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 w-full">
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Filter className="h-4 w-4" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky transition-colors cursor-pointer hover:bg-slate-50 flex-1 sm:flex-none"
                >
                  <option value="">Semua Status</option>
                  <option value="AKTIF">Hanya AKTIF</option>
                  <option value="DICABUT">Hanya DICABUT</option>
                  <option value="LULUS">Hanya LULUS</option>
                </select>

                <select
                  value={filterAngkatan}
                  onChange={(e) => setFilterAngkatan(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky transition-colors cursor-pointer hover:bg-slate-50 flex-1 sm:flex-none"
                >
                  <option value="">Semua Angkatan</option>
                  {uniqueAngkatan.map(a => <option key={a} value={a}>Angkatan {a}</option>)}
                </select>

                <select
                  value={filterProdi}
                  onChange={(e) => setFilterProdi(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky transition-colors cursor-pointer hover:bg-slate-50 flex-1 sm:flex-none"
                >
                  <option value="">Semua Prodi</option>
                  {uniqueProdi.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 w-full xl:w-auto">
            <button 
              onClick={() => setIsAddingUser(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-pipdikti-sky/10 text-pipdikti-navy font-semibold rounded-xl hover:bg-pipdikti-sky/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Manual
            </button>
          </div>
        </div>

        {/* Dynamic State: Loading, Empty, or Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
             <Loader2 className="h-10 w-10 text-pipdikti-sky animate-spin mb-4" />
             <p className="text-slate-500 font-medium">Memuat data penerima...</p>
          </div>
        ) : allStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-slate-50 p-6 rounded-full shadow-inner mb-6 relative">
              <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-600 p-1.5 rounded-full">
                <AlertCircle className="h-5 w-5" />
              </div>
              <Users className="h-16 w-16 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tabel Data Masih Kosong</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Belum ada data penerima PIP yang ditambahkan ke dalam sistem. Silakan unggah dokumen CSV/Excel untuk mengimpor data.
            </p>
            <label className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pipdikti-sky to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 cursor-pointer">
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <Upload className="h-5 w-5" />
              <span>Unggah Data Sekarang</span>
            </label>
          </div>
        ) : processedStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Pencarian Tidak Ditemukan</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Tidak ada data yang cocok dengan kriteria filter atau pencarian Anda.
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("");
                setFilterAngkatan("");
                setFilterProdi("");
              }}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-xl transition-colors"
            >
              Hapus Filter & Pencarian
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50/80 border-b border-gray-100 select-none">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold w-16 text-center">No.</th>
                  {renderSortableHeader("NIM", "nim")}
                  {renderSortableHeader("Nama Lengkap", "nama_lengkap")}
                  {renderSortableHeader("Prodi", "program_studi")}
                  {renderSortableHeader("Angkatan", "angkatan")}
                  {renderSortableHeader("BP", "bp")}
                  {renderSortableHeader("BH", "bh")}
                  {renderSortableHeader("Status", "status_pip")}
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student: any, index: number) => (
                  <tr key={student._id} className="bg-white border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{student.nim || "-"}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{student.nama_lengkap}</td>
                    <td className="px-6 py-4">{student.program_studi || "-"}</td>
                    <td className="px-6 py-4 font-medium">{student.angkatan || "-"}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{student.bp ? formatRupiah(student.bp) : "-"}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{student.bh ? formatRupiah(student.bh) : "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.status_pip === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' :
                        student.status_pip === 'LULUS' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {student.status_pip || "AKTIF"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingUser(student)}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit Data"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id, student.nama_lengkap)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleResetPassword(student._id)}
                          disabled={resettingId === student._id}
                          className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                          title="Reset Password"
                        >
                          {resettingId === student._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {processedStudents.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, processedStudents.length)}</span> dari <span className="font-semibold text-slate-700">{processedStudents.length}</span> entri
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pipdikti-sky"
              >
                <option value="10">10 / halaman</option>
                <option value="25">25 / halaman</option>
                <option value="50">50 / halaman</option>
                <option value="100">100 / halaman</option>
              </select>
              
              <div className="flex items-center gap-1 ml-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-slate-700 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Edit Data Penerima</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">NIM</label>
                  <input 
                    type="text" 
                    value={editingUser.nim || ""}
                    onChange={(e) => setEditingUser({...editingUser, nim: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.nama_lengkap || ""}
                    onChange={(e) => setEditingUser({...editingUser, nama_lengkap: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Program Studi</label>
                  <input 
                    type="text" 
                    value={editingUser.program_studi || ""}
                    onChange={(e) => setEditingUser({...editingUser, program_studi: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Angkatan</label>
                  <input 
                    type="text" 
                    value={editingUser.angkatan || ""}
                    onChange={(e) => setEditingUser({...editingUser, angkatan: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status PIP</label>
                  <select 
                    value={editingUser.status_pip || "AKTIF"}
                    onChange={(e) => setEditingUser({...editingUser, status_pip: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="DICABUT">DICABUT</option>
                    <option value="LULUS">LULUS</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Biaya Pendidikan (BP)</label>
                  <input 
                    type="number" 
                    value={editingUser.bp || ""}
                    onChange={(e) => setEditingUser({...editingUser, bp: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Biaya Hidup (BH)</label>
                  <input 
                    type="number" 
                    value={editingUser.bh || ""}
                    onChange={(e) => setEditingUser({...editingUser, bh: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pipdikti-navy hover:bg-blue-900 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Tambah Penerima Manual</h3>
              <button 
                onClick={() => setIsAddingUser(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddNewUser} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">NIM</label>
                  <input 
                    type="text" 
                    required
                    value={newUser.nim}
                    onChange={(e) => setNewUser({...newUser, nim: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={newUser.nama_lengkap}
                    onChange={(e) => setNewUser({...newUser, nama_lengkap: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Program Studi</label>
                  <input 
                    type="text" 
                    value={newUser.program_studi}
                    onChange={(e) => setNewUser({...newUser, program_studi: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Angkatan</label>
                  <input 
                    type="text" 
                    value={newUser.angkatan}
                    onChange={(e) => setNewUser({...newUser, angkatan: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status PIP</label>
                  <select 
                    value={newUser.status_pip}
                    onChange={(e) => setNewUser({...newUser, status_pip: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="DICABUT">DICABUT</option>
                    <option value="LULUS">LULUS</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Biaya Pendidikan (BP)</label>
                  <input 
                    type="number" 
                    value={newUser.bp}
                    onChange={(e) => setNewUser({...newUser, bp: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Biaya Hidup (BH)</label>
                  <input 
                    type="number" 
                    value={newUser.bh}
                    onChange={(e) => setNewUser({...newUser, bh: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pipdikti-navy hover:bg-blue-900 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

