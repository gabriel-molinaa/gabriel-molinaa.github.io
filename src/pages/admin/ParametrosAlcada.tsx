import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  XCircle,
  Edit2,
  Trash2,
  Info,
  AlertCircle,
  ArrowRight,
  Settings2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockApprovalThresholds } from '@/src/types/mockData';

import { NavLink } from 'react-router-dom';

export default function ParametrosAlcada() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configurações do Sistema</h1>
          <p className="text-sm text-gray-500 mt-1">Parâmetros globais e regras de negócio do fluxo de compras.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus className="w-4 h-4" /> Nova Alçada
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <NavLink 
          to="/configuracoes/gerais" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Gerais
        </NavLink>
        <NavLink 
          to="/configuracoes/alcadas" 
          className={({ isActive }) => cn(
            "px-4 py-2 text-sm font-bold border-b-2 transition-all",
            isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Alçadas de Aprovação
        </NavLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Regras de Aprovação Ativas</h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                Módulo: Solicitação
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Perfil</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Faixa de Valor</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockApprovalThresholds.map((threshold) => (
                    <tr key={threshold.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <Shield className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{threshold.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(threshold.minValue)}
                          <ArrowRight className="w-3 h-3 text-gray-300" />
                          {threshold.maxValue > 1000000 ? 'Ilimitado' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(threshold.maxValue)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          threshold.status === 'Ativo' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {threshold.status}
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

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Settings2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Configurações de Fluxo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Aprovação</label>
                <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium">
                  <option>Sequencial (Hierárquico)</option>
                  <option>Paralelo (Qualquer um)</option>
                  <option>Unânime (Todos)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alerta de SLA (Horas)</label>
                <input type="number" defaultValue={48} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <h3 className="font-bold">Como funciona?</h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              As alçadas definem quem tem autoridade para aprovar uma solicitação baseada no valor total estimado.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[10px]">
                <div className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0" />
                <span>Valores abaixo do limite do Gestor são aprovados automaticamente após análise técnica.</span>
              </li>
              <li className="flex items-start gap-2 text-[10px]">
                <div className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0" />
                <span>Valores que excedem o limite do Diretor exigem aprovação do Conselho Fiscal.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-amber-500" /> Impacto na Operação
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Tempo Médio Aprovação</span>
                <span className="font-bold text-gray-900">2.4 dias</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Solicitações Retornadas</span>
                <span className="font-bold text-gray-900">12%</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 italic">
                  * Alterações nas alçadas afetam apenas novas solicitações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
