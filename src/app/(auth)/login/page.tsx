// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Check, Eye, EyeOff,} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Harap isi semua field');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login berhasil:', { email });
      router.push('/dashboard');
      
    } catch (err) {
      setError('Login gagal. Periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const userEmail = prompt('Masukkan email untuk reset password:');
    if (userEmail) {
      alert(`Instruksi reset password dikirim ke: ${userEmail}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="flex min-h-screen">
        {/* Left Section - Brand Info */}
        <div className="hidden lg:flex lg:w-1/2 p-12 xl:p-20 flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-16">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">GIBEI Platform</h1>
                <p className="text-slate-300 text-sm mt-1">Enterprise ML Monitoring & Analytics</p>
              </div>
            </div>

            {/* Tagline */}
            <div className="mb-16">
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                Satu Platform untuk<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Monitoring & Analisis
                </span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Kelola model machine learning Anda dan pantau performa secara real-time 
                dalam satu workspace terintegrasi.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Monitoring Real-time</h3>
                  <p className="text-slate-400">Pantau performa model ML dengan dashboard interaktif</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                      <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Manajemen Model</h3>
                  <p className="text-slate-400">Kelola semua model ML dari berbagai framework</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Workspace Terintegrasi</h3>
                  <p className="text-slate-400">Kolaborasi tim dengan workspace yang efisien</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Mobile Header */}
            <div className="lg:hidden mb-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">GIBEI Platform</h1>
                  <p className="text-gray-600 text-sm">ML Monitoring & Analytics</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Satu Platform untuk Monitoring & Analisis
              </h2>
              <p className="text-gray-600">
                Kelola model machine learning Anda dan pantau performa secara real-time.
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-200/50">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Selamat Datang Kembali</h1>
                <p className="text-gray-600 text-lg">Masuk dengan akun terdaftar Anda</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder:text-gray-400"
                      placeholder="nama@gmail.com"
                      disabled={loading}
                    />
                    {email && email.includes('@') && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50/70 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 placeholder:text-gray-400"
                      placeholder="Masukkan password Anda"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </button>
              </form>
               <p className="text-sm text-center text-gray-500 mt-8">
                Belum punya akun?{' '}
                <Link href="/regis" className="text-blue-600 font-semibold">
                  Daftar
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} GIBEI Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}