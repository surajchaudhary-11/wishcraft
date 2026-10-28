import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useWish } from '../../context/WishContext';

export const Toast: React.FC = () => {
  const { toast } = useWish();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-rosewood-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-soft-lg',
    info: 'bg-white border-plum-200 text-slate-800 shadow-soft-lg',
    error: 'bg-white border-red-200 text-slate-800 shadow-soft-lg',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all animate-bounce-gentle">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${bgStyles[toast.type]}`}>
        {icons[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
