import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  TrendingUp,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockAgreements } from '@/src/types/mockData';

import { NavLink } from 'react-router-dom';

export default function ConveniosList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgreements = mockAgreements.filter(agreement => 
    agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    agreement.fundingSource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cadastros Base</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão de entidades fundamentais para a operação do sistema.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        <NavLink 
          to="/cadastros/projetos" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Projetos
        </NavLink>
        <NavLink 
          to="/cadastros/convenios" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Convênios
        </NavLink>
        <NavLink 
          to="/cadastros/fornecedores" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Fornecedores
        </NavLink>
        <NavLink 
          to="/cadastros/itens" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Itens e Serviços
        </NavLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saldo Total Disponível</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">R$ 380.800,00</p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 font-bold">
            <Info className="w-3 h-3" /> Consolidado de 3 convênios
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Próximo Vencimento</p>
          <p className="text-2xl font-black text-amber-600 mt-1">30/06/2026</p>
          <p className="text-[10px] text-amber-600 mt-1 font-bold">● Doação Empresa Parceira X</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Utilização Média</p>
          <p className="text-2xl font-black text-blue-600 mt-1">22% / mês</p>
          <p className="text-[10px] text-blue-600 mt-1 font-bold">● Dentro do cronograma</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou fonte pagadora..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Convênio / Fonte</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vigência</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Saldo / Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAgreements.map((agreement) => {
                const usagePercent = ((agreement.totalValue - agreement.balance) / agreement.totalValue) * 100;
                return (
                  <tr key={agreement.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{agreement.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                        {agreement.fundingSource}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> {agreement.startDate} - {agreement.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(agreement.balance)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">Total: R$ {agreement.totalValue.toLocaleString()}</p>
                      <div className="h-1 w-24 bg-gray-100 rounded-full mt-2 ml-auto overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            usagePercent > 80 ? "bg-red-500" : usagePercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        agreement.status === 'Vigente' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-700 border-gray-100"
                      )}>
                        {agreement.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
