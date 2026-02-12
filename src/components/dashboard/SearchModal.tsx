'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(inputValue);
      onClose();
    }
  };

  const handleQuickSearch = (code: string) => {
    onSearch(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 w-full max-w-lg border border-slate-100 transform scale-100 animate-in zoom-in duration-200 relative">
         <div className="text-center mb-6 sm:mb-8">
           <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 rotate-3 hover:rotate-6 transition-transform">
             <Search className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
           </div>
           <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight">Start Analysis</h2>
           <p className="text-slate-500 text-base sm:text-lg">Enter stock ticker code (max 4 letters)</p>
         </div>

         <div className="relative group">
            <input 
              type="text" 
              placeholder="BBCA" 
              className="w-full py-3.5 sm:py-5 px-4 sm:px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl sm:text-3xl font-bold tracking-[0.2em] uppercase focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-slate-200" 
              maxLength={4}
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase().slice(0, 4))}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:group-focus-within:block animate-in fade-in">
               <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">ENTER</span>
            </div>
         </div>
         
         <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3">
           {['BBCA', 'TLKM', 'BMRI'].map((code) => (
             <button 
              key={code}
              onClick={() => handleQuickSearch(code)}
              className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-white border border-slate-100 text-slate-600 font-bold hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all text-xs sm:text-sm"
             >
               {code}
             </button>
           ))}
         </div>
         
         <div className="mt-8 text-center">
           <button onClick={onClose} className="text-slate-400 font-medium hover:text-slate-600 transition-colors text-sm mb-4">
             Close search access
           </button>
           <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">
             &copy; {new Date().getFullYear()} GIBEI Research Lab
           </p>
         </div>
      </div>
    </div>
  );
}
