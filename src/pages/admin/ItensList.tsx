import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Tag, 
  CheckCircle2, 
  XCircle,
  Edit2,
  Trash2,
  DollarSign,
  Layers,
  Box,
  Wrench,
  Monitor
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockItemMaster } from '@/src/types/mockData';

const typeIcons: Record<string, any> = {
  'Material de Consumo': Box,
  'Estoque': Layers,
  'Ativo Imobilizado': Monitor,
  'Serviço': Wrench,
};

const typeColors: Record<string, string> = {
  'Material de Consumo': 'bg-blue-50 text-blue-700 border-blue-100',
  'Estoque': 'bg-purple-50 text-purple-700 border-purple-100',
  'Ativo Imobilizado': 'bg-amber-50 text-amber-700 border-amber-100',
  'Serviço': 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

import { NavLink } from 'react-router-dom';

export default function ItensList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = mockItemMaster.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
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

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por descrição ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Filter className="w-4 h-4" /> Tipos
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição / Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo / Unidade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Último Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
                const Icon = typeIcons[item.type] || Box;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{item.description}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                        {item.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        typeColors[item.type]
                      )}>
                        <Icon className="w-3 h-3" /> {item.type}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">Unidade: {item.unit}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-gray-900">
                        {item.lastPrice ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.lastPrice) : '---'}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">Ref: Março/2026</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        item.status === 'Ativo' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                      )}>
                        {item.status}
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
