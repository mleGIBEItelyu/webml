'use client';

import { Search, X, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useToast } from '@/components/providers/ToastProvider';

interface DashboardNavbarProps {
  query: string;
  onSearchClick: () => void;
  onResetSearch: () => void;
  userName?: string;
}

export default function DashboardNavbar({ query, onSearchClick, onResetSearch, userName = 'Admin' }: DashboardNavbarProps) {
  const initial = (userName || 'Admin').charAt(0).toUpperCase();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { showToast, hideToast } = useToast();

  const handleLogout = async () => {
    const toastId = showToast('Logging out...', 'loading');
    await signOut({ callbackUrl: '/login' });
    hideToast(toastId);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 relative">
             <img src="/logo.png" alt="GIBEI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold hidden md:block text-lg tracking-tight">GIBEI <span className="text-red-600 font-bold">Forecasting</span></span>
        </div>

        {/* Mini Search Bar in Nav */}
        <div className="flex-1 max-w-md mx-auto w-full">
           <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
             <input 
                type="text" 
                value={query}
                readOnly 
                onClick={onSearchClick}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all cursor-pointer hover:bg-white hover:shadow-sm"
                placeholder="Search ticker..."
             />
             {query && (
               <button onClick={(e) => { e.stopPropagation(); onResetSearch(); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400">
                 <X className="w-3 h-3" />
               </button>
             )}
           </div>
        </div>

        {/* Profile Section */}
        <div className="relative shrink-0">
           <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-white/50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-100"
           >
             <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-red-200 ring-2 ring-white select-none">
                 {initial}
             </div>
             <span className="hidden sm:block text-sm font-bold text-slate-700 max-w-[100px] truncate">{userName}</span>
             <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
           </button>

           {/* Dropdown Menu */}
           {isDropdownOpen && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-slate-50 mb-1 sm:hidden">
                    <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
               </div>
             </>
           )}
        </div>

      </div>
    </nav>
  );
}
