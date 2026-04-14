import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Tag, 
  CheckCircle2, 
  XCircle,
  Edit2,
  Trash2,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockProjects } from '@/src/types/mockData';

import { NavLink } from 'react-router-dom';

export default function ProjetosList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.costCenter.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projetos Ativos</p>
          <p className="text-2xl font-black text-gray-900 mt-1">12</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-1 font-bold">
            <TrendingUp className="w-3 h-3" /> +2 este mês
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Centros de Custo</p>
          <p className="text-2xl font-black text-blue-600 mt-1">45</p>
          <p className="text-[10px] text-gray-400 mt-1 font-bold">Estrutura hierárquica</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orçamento Comprometido</p>
          <p className="text-2xl font-black text-purple-600 mt-1">R$ 425k</p>
          <p className="text-[10px] text-purple-600 mt-1 font-bold">● 65% do total anual</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou centro de custo..." 
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Projeto / Centro de Custo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Gestor Responsável</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{project.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <Tag className="w-3 h-3" /> {project.costCenter}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                        {project.manager.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700">{project.manager}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      project.status === 'Ativo' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                    )}>
                      {project.status === 'Ativo' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {project.status}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
