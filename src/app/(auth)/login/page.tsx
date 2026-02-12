'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans text-slate-900">

      {/* 1. Subtle Background Texture (Dot Pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="w-full max-w-sm sm:max-w-[400px] relative z-10">

        {/* 2. Header: Clean Branding with Logo */}
        <div className=" text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl  p-4">
                <Image
                  src="/logo.png"
                  alt="GIBEI Logo"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
              GIBEI <span className="text-red-600 font-bold">Forecasting</span>
            </h1>
            <p className="text-slate-500 text-sm">Masuk untuk mengelola platform</p>
        </div>

        {/* 3. The Minimalist Form */}
        <form action={dispatch} className="space-y-4 sm:space-y-5">

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1" htmlFor="email">
              Email
            </label>
            <div className="relative group">
              <input
                id="email"
                type="email"
                name="email"
                className="block w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 shadow-sm text-sm sm:text-base"
                placeholder="admin@gibei.id"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="password">
                Password
                </label>
            </div>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="block w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 shadow-sm pr-12 text-sm sm:text-base"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error State */}
          {errorMessage && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            aria-disabled={isPending}
            className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              'Masuk Dashboard'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2025 GIBEI System. Secured & Encrypted.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}