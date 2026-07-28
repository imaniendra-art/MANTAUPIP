"use client";

import { useState, useEffect, useActionState } from "react";
import { ArrowLeft, User, Phone, KeyRound, Lock, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/app/actions/mahasiswa";

const initialPasswordState = {
  error: "",
  success: false
};

export default function AkunPage() {
  const router = useRouter();
  
  // Data Diri State
  const [profile, setProfile] = useState({
    name: "",
    nim: "",
    program_studi: "",
    nik: "",
    no_hp: ""
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Ganti Password State
  const [pwdState, formAction, isPendingPwd] = useActionState(changePasswordAction, initialPasswordState);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/mahasiswa/profil");
        if (res.ok) {
          const result = await res.json();
          setProfile({
            name: result.data.name || "-",
            nim: result.data.nim || "-",
            program_studi: result.data.program_studi || "-",
            nik: result.data.nik || "",
            no_hp: result.data.no_hp || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (pwdState.success) {
      alert("Password berhasil diubah!");
      // Reset form handled by the DOM automatically, but since it's a server action, success is returned.
    }
  }, [pwdState.success]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);

    try {
      const res = await fetch("/api/mahasiswa/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nik: profile.nik,
          no_hp: profile.no_hp
        })
      });

      if (res.ok) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        alert("Gagal menyimpan profil.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isLoadingProfile) return <div className="p-8 text-center text-slate-500">Memuat data...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <Link 
          href="/beranda" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1a365d] transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/60 hover:bg-white/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Kolom 1: Data Diri */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 overflow-hidden relative">
          <div className="bg-gradient-to-r from-blue-600 to-[#1a365d] p-6 text-white flex items-center gap-3">
            <User className="h-6 w-6" />
            <h2 className="text-xl font-bold">Data Identitas</h2>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            {profileSuccess && (
              <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                Data identitas berhasil disimpan!
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
              <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{profile.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NIM</label>
                <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{profile.nim}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Program Studi</label>
                <div className="font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{profile.program_studi}</div>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</label>
              <input
                type="text"
                value={profile.nik}
                onChange={(e) => setProfile({ ...profile, nik: e.target.value })}
                placeholder="16 digit NIK"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900"
              />
            </div>

            <div className="space-y-1 pb-4">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nomor HP (WhatsApp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={profile.no_hp}
                  onChange={(e) => setProfile({ ...profile, no_hp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              {isSavingProfile ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Simpan Identitas
                </>
              )}
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">
              *Data NIK dan Nomor HP akan digunakan untuk formulir Pakta Integritas.
            </p>
          </form>
        </div>

        {/* Kolom 2: Ganti Password */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 overflow-hidden relative h-fit">
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 text-white flex items-center gap-3">
            <KeyRound className="h-6 w-6" />
            <h2 className="text-xl font-bold">Keamanan & Password</h2>
          </div>
          
          <form action={formAction} className="p-6 space-y-5">
            {pwdState.error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                {pwdState.error}
              </div>
            )}
            
            {pwdState.success && (
              <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                Password berhasil diubah.
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password Baru</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1 pb-4">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Konfirmasi Password Baru</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Ketik ulang password baru"
                  className="w-full pl-10 px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPendingPwd}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
            >
              {isPendingPwd ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Ubah Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
