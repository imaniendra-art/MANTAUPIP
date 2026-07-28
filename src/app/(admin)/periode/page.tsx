"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Loader2, CheckCircle2, Circle, Pencil } from "lucide-react";

export default function PeriodePage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingPeriod, setEditingPeriod] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch periods
  const { data: response, isLoading } = useQuery({
    queryKey: ["periodsData"],
    queryFn: async () => {
      const res = await fetch("/api/admin/periode");
      if (!res.ok) throw new Error("Gagal mengambil data");
      return res.json();
    },
  });

  const periods = response?.data || [];

  // Activate Period Mutation
  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/periode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Gagal mengaktifkan periode");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodsData"] });
      // Also invalidate dashboard stats and other queries if needed
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: () => {
      alert("Terjadi kesalahan saat mengaktifkan periode");
    },
  });

  // Delete Period Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/periode?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus periode");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodsData"] });
    },
    onError: (err: any) => {
      alert(err.message || "Terjadi kesalahan saat menghapus periode");
    },
  });

  // Edit Period Mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const res = await fetch("/api/admin/periode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, action: "RENAME" }),
      });
      if (!res.ok) throw new Error("Gagal mengubah periode");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodsData"] });
      setEditingPeriod(null);
    },
    onError: () => {
      alert("Terjadi kesalahan saat mengubah periode");
    },
  });

  // Handle Add Period
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPeriodName,
          isActive: periods.length === 0, // Auto active if it's the first one
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setIsAdding(false);
        setNewPeriodName("");
        queryClient.invalidateQueries({ queryKey: ["periodsData"] });
      } else {
        alert(result.error || "Gagal menambahkan periode");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pipdikti-sky/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pipdikti-navy/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#1a365d] to-[#2a528a] rounded-2xl shadow-md">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manajemen Periode</h1>
              <p className="text-slate-600 font-medium mt-1">
                Kelola siklus pelaporan dan penerimaan mahasiswa.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-3 bg-pipdikti-sky hover:bg-[#128bc0] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>Tambah Periode</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-lg border border-white/60 overflow-hidden relative">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-pipdikti-sky">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Memuat data periode...</p>
          </div>
        ) : periods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Calendar className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Belum Ada Periode</h3>
            <p className="text-slate-500 max-w-sm">Silakan buat periode baru untuk memulai siklus pelaporan di sistem.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Nama Periode</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white/30">
                {periods.map((p: any) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 text-lg">{p.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                          <Circle className="h-3.5 w-3.5" /> Non-aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.isActive ? (
                          <>
                            <span className="px-4 py-2 bg-slate-100 text-slate-500 font-semibold rounded-lg text-sm flex items-center gap-1.5 cursor-not-allowed">
                              <CheckCircle2 className="h-4 w-4" /> Sedang Aktif
                            </span>
                            <button 
                              onClick={() => { setEditingPeriod(p); setEditName(p.name); }}
                              className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg text-sm transition-colors"
                              title="Ubah Nama Periode"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => activateMutation.mutate(p._id)}
                              disabled={activateMutation.isPending || deleteMutation.isPending}
                              className="px-4 py-2 bg-pipdikti-sky/10 text-pipdikti-sky hover:bg-pipdikti-sky hover:text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                              {activateMutation.isPending ? "Proses..." : "Jadikan Aktif"}
                            </button>
                            <button 
                              onClick={() => { setEditingPeriod(p); setEditName(p.name); }}
                              className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg text-sm transition-colors"
                              title="Ubah Nama Periode"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Hapus periode ${p.name}?`)) {
                                  deleteMutation.mutate(p._id);
                                }
                              }}
                              disabled={deleteMutation.isPending || activateMutation.isPending}
                              className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
                              title="Hapus Periode"
                            >
                              {deleteMutation.isPending ? "..." : "Hapus"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Tambah Periode Baru</h3>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Periode</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: 2026/2027"
                  value={newPeriodName}
                  onChange={(e) => setNewPeriodName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || !newPeriodName.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pipdikti-navy hover:bg-blue-900 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPeriod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Ubah Nama Periode</h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              editMutation.mutate({ id: editingPeriod._id, name: editName });
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Periode</label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setEditingPeriod(null)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={editMutation.isPending || !editName.trim() || editName === editingPeriod.name}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {editMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
