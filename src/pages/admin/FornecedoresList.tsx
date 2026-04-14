import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Star, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockSuppliers } from '@/src/types/mockData';

import { NavLink } from 'react-router-dom';

export default function FornecedoresList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = mockSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Buscar por nome, CNPJ ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Filter className="w-4 h-4" /> Categorias
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fornecedor / CNPJ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria / Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{supplier.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{supplier.cnpj}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {supplier.category}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <Mail className="w-3 h-3" /> {supplier.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-gray-900">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      supplier.status === 'Ativo' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                      supplier.status === 'Bloqueado' ? "bg-red-50 text-red-700 border-red-100" : 
                      "bg-gray-50 text-gray-700 border-gray-100"
                    )}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Documentos">
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
