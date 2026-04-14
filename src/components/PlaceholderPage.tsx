import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlaceholderPage({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-600">
        <Construction className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Este módulo está em desenvolvimento como parte do protótipo da Gestão de Compras APAE.
        </p>
      </div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
    </div>
  );
}
