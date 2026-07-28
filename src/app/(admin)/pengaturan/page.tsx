"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, UserPlus, History, Loader2, User as UserIcon, X, Pencil, Trash2 } from "lucide-react";

export default function PengaturanPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"akun" | "logs">("akun");
  
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [resetAdminId, setResetAdminId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  
  const [newAdmin, setNewAdmin] = useState({
    nama_lengkap: "",
    username: "",
    password: "",
  });
  
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Admins
  const { data: adminData, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/pengaturan");
      if (!res.ok) throw new Error("Gagal mengambil data admin");
      return res.json();
    },
  });

  // Fetch Logs
  const { data: logsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/logs");
      if (!res.ok) throw new Error("Gagal mengambil data logs");
      return res.json();
    },
  });

  const admins = adminData?.data || [];
  const logs = logsData?.data || [];

  // Handle Add Admin
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      const result = await res.json();
      if (res.ok) {
        setIsAddingAdmin(false);
        setNewAdmin({ nama_lengkap: "", username: "", password: "" });
        queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      } else {
        alert(result.error || "Gagal menambahkan admin");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit Admin Mutation
  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengubah profil admin");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      setEditingAdmin(null);
    },
    onError: (err: any) => {
      alert(err.message || "Terjadi kesalahan sistem");
    },
  });

  // Delete Admin Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/pengaturan?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus admin");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
    },
    onError: (err: any) => {
      alert(err.message || "Terjadi kesalahan sistem");
    },
  });

  // Handle Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resetAdminId, newPassword }),
      });
      const result = await res.json();
      if (res.ok) {
        setResetAdminId(null);
        setNewPassword("");
        queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
        alert("Password berhasil direset!");
      } else {
        alert(result.error || "Gagal mereset password");
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
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Pengaturan Sistem</h1>
              <p className="text-slate-600 font-medium mt-1">
                Kelola akun administrator dan pantau riwayat aktivitas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("akun")}
          className={`flex items-center gap-2 py-4 px-6 border-b-2 font-semibold transition-colors ${
            activeTab === "akun" 
              ? "border-pipdikti-sky text-pipdikti-sky" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <UserIcon className="h-5 w-5" />
          Akun Admin
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 py-4 px-6 border-b-2 font-semibold transition-colors ${
            activeTab === "logs" 
              ? "border-pipdikti-sky text-pipdikti-sky" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <History className="h-5 w-5" />
          Log Aktivitas
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-lg border border-white/60 overflow-hidden relative min-h-[400px]">
        
        {/* Tab 1: Akun Admin */}
        {activeTab === "akun" && (
          <div>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">Daftar Administrator</h3>
              <button 
                onClick={() => setIsAddingAdmin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pipdikti-sky/10 text-pipdikti-navy hover:bg-pipdikti-sky hover:text-white font-semibold rounded-xl transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Tambah Admin
              </button>
            </div>
            
            {isLoadingAdmins ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-pipdikti-sky" /></div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-slate-900 text-sm">Nama Lengkap</th>
                    <th className="px-6 py-4 font-semibold text-slate-900 text-sm">Username</th>
                    <th className="px-6 py-4 font-semibold text-slate-900 text-sm">Role</th>
                    <th className="px-6 py-4 font-semibold text-slate-900 text-sm text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map((a: any) => (
                    <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{a.nama_lengkap}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">@{a.username || a.nim}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          {a.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingAdmin(a)}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Profil"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus admin ${a.nama_lengkap}?`)) {
                                deleteMutation.mutate(a._id);
                              }
                            }}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus Admin"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setResetAdminId(a._id)}
                            className="px-3 py-1.5 text-xs font-semibold text-pipdikti-sky hover:text-white bg-pipdikti-sky/10 hover:bg-pipdikti-sky rounded-lg transition-colors"
                          >
                            Reset Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Log Aktivitas */}
        {activeTab === "logs" && (
          <div>
            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">Riwayat Aktivitas</h3>
              <p className="text-sm text-slate-500">Menampilkan 100 aktivitas terakhir dari semua admin.</p>
            </div>
            
            {isLoadingLogs ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-pipdikti-sky" /></div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-slate-500">Belum ada aktivitas.</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {logs.map((log: any) => (
                  <div key={log._id} className="p-6 hover:bg-slate-50 transition-colors flex gap-4">
                    <div className="mt-1">
                      <div className="h-8 w-8 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center">
                        <History className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-800">
                        <span className="font-bold text-pipdikti-navy">{log.adminName}</span> ({log.adminUsername})
                      </p>
                      <p className="text-slate-600 mt-1">{log.description}</p>
                      <p className="text-xs text-slate-400 mt-2 font-medium">
                        {new Date(log.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "medium",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {isAddingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Tambah Administrator</h3>
              <button 
                onClick={() => setIsAddingAdmin(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={newAdmin.nama_lengkap}
                  onChange={(e) => setNewAdmin({...newAdmin, nama_lengkap: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username (NIM/ID)</label>
                <input 
                  type="text" 
                  required
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsAddingAdmin(false)}
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
                  Simpan Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Edit Administrator</h3>
              <button 
                onClick={() => setEditingAdmin(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              editMutation.mutate({
                id: editingAdmin._id,
                nama_lengkap: editingAdmin.nama_lengkap,
                username: editingAdmin.username
              });
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={editingAdmin.nama_lengkap}
                  onChange={(e) => setEditingAdmin({...editingAdmin, nama_lengkap: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username (NIM/ID)</label>
                <input 
                  type="text" 
                  required
                  value={editingAdmin.username}
                  onChange={(e) => setEditingAdmin({...editingAdmin, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={editMutation.isPending}
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

      {/* Reset Password Modal */}
      {resetAdminId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
              <button 
                onClick={() => { setResetAdminId(null); setNewPassword(""); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">Password Baru</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-colors text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => { setResetAdminId(null); setNewPassword(""); }}
                  className="px-5 py-2 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || !newPassword.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-pipdikti-sky hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
