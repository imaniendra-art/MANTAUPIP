"use client";

import { useActionState } from "react";
import { AlertCircle, Lock, User } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import Image from "next/image";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen flex-col justify-center p-4 sm:p-8 md:pl-20 lg:pl-32 xl:pl-48">
      {/* Glassmorphic Container positioned to the left */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(15,59,119,0.15)] rounded-[2rem] p-10 border border-white/50 relative overflow-hidden">
        
        {/* Subtle decorative glow inside the card */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 rounded-[2rem]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/60 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pipdikti-sky/10 rounded-full blur-2xl"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-6 mb-2">
            <Image 
              src="/logo_stimi.png" 
              alt="Logo STIMI" 
              width={65} 
              height={65}
              className="object-contain"
            />
            <div className="w-px h-12 bg-gray-300 hidden sm:block"></div>
            <Image 
              src="/mantaupip_logo_trns.png" 
              alt="Logo MANTAU PIP" 
              width={75} 
              height={75}
              className="object-contain"
            />
          </div>
          <h2 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-gray-900">
            Masuk ke MANTAU PIP DIKTI
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-600">
            Manajemen, Administrasi, Nilai, Transparansi Anggaran, & Usulan PIP DIKTI STIMI YAPMI Makassar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" action={formAction}>
          {state?.error && (
            <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-red-800">{state.error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="nim" className="sr-only">NIM / Username</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nim"
                name="nim"
                type="text"
                required
                className="block w-full rounded-2xl border-0 py-3.5 pl-11 pr-4 text-gray-900 bg-white/70 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pipdikti-sky focus:bg-white transition-all sm:text-sm sm:leading-6 backdrop-blur-sm"
                placeholder="NIM / Username"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-2xl border-0 py-3.5 pl-11 pr-4 text-gray-900 bg-white/70 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pipdikti-sky focus:bg-white transition-all sm:text-sm sm:leading-6 backdrop-blur-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-pipdikti-sky focus:ring-pipdikti-sky"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                Ingat saya
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-2xl bg-pipdikti-navy px-4 py-3.5 text-sm font-bold text-white hover:bg-pipdikti-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pipdikti-navy transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isPending ? "Sedang memproses..." : "Masuk ke Dashboard"}
            </button>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500 bg-white/40 p-3 rounded-xl border border-white/50 backdrop-blur-sm">
            Gunakan NIM: <strong className="text-gray-800">admin</strong> atau <strong className="text-gray-800">12345678</strong> untuk demo.<br/>Password sama dengan NIM.
          </div>
        </form>
      </div>
    </div>
  );
}
