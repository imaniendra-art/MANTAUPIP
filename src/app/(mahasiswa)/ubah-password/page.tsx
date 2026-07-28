"use client";

import { useActionState, useEffect } from "react";
import { changePasswordAction } from "@/app/actions/mahasiswa";
import { Lock, Loader2, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

const initialState = {
  error: "",
  success: false
};

export default function UbahPasswordPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      alert("Password berhasil diubah!");
      router.push("/beranda");
    }
  }, [state.success, router]);

  return (
    <div className="max-w-xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pipdikti-sky/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-pipdikti-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <KeyRound className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Wajib Ubah Password</h1>
              <p className="text-slate-600">Demi keamanan, Anda wajib mengubah password default sebelum melanjutkan.</p>
            </div>
          </div>

          <form action={formAction} className="space-y-5 mt-8">
            {state.error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Password Baru</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-pipdikti-sky transition-colors" />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="Minimal 6 karakter"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Konfirmasi Password Baru</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-pipdikti-sky transition-colors" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Ketik ulang password baru"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pipdikti-sky focus:border-pipdikti-sky transition-all duration-200 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-6 border border-transparent rounded-2xl shadow-lg text-white font-bold bg-gradient-to-r from-pipdikti-sky to-[#2a528a] hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Menyimpan...
                </>
              ) : (
                "Simpan & Lanjutkan"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
