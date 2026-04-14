import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ClipboardList, 
  Settings2, 
  Plus, 
  Eye, 
  Building2, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ArrowRight 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockInventories, mockAdjustments } from '@/src/types/mockData';
import { Inventory, StockAdjustment } from '@/src/types/procurement';

const inventoryStatusColors = {
  'Em aberto': 'bg-blue-50 text-blue-700 border-blue-100',
  'Em conferência': 'bg-amber-50 text-amber-700 border-amber-100',
  'Concluído': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Cancelado': 'bg-red-50 text-red-700 border-red-100',
};

export default function InventarioAjustes() {
  const [activeSubTab, setActiveSubTab] = useState<'inventarios' | 'ajustes'>('inventarios');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventories = mockInventories.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdjustments = mockAdjustments.filter(adj => 
    adj.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
    adj.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adj.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kpis = [
    { label: 'Inventários em Aberto', value: mockInventories.filter(i => i.status !== 'Concluído').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ajustes no Período', value: mockAdjustments.length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Divergências Encontradas', value: 12, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Itens Conferidos', value: mockInventories.reduce((sum, i) => sum + i.itemsChecked, 0), color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className={cn("text-2xl font-bold", kpi.color)}>{kpi.value}</h3>
              <div className={cn("p-2 rounded-lg", kpi.bg)}>
                <ClipboardList className={cn("w-4 h-4", kpi.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-2xl w-fit border border-gray-200">
          <button
            onClick={() => setActiveSubTab('inventarios')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2",
              activeSubTab === 'inventarios' 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <ClipboardList className="w-3.5 h-3.5" /> Inventários
          </button>
          <button
            onClick={() => setActiveSubTab('ajustes')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2",
              activeSubTab === 'ajustes' 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Settings2 className="w-3.5 h-3.5" /> Ajustes de Saldo
          </button>
        </div>

        <button className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm",
          activeSubTab === 'inventarios' ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-amber-600 text-white hover:bg-amber-700"
        )}>
          <Plus className="w-4 h-4" /> {activeSubTab === 'inventarios' ? 'Novo Inventário' : 'Novo Ajuste'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={activeSubTab === 'inventarios' ? "Buscar por ID, unidade ou responsável..." : "Buscar por item ou unidade..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeSubTab === 'inventarios' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nº Inventário / Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Itens Conferidos</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventories.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{inv.id}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{inv.startDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{inv.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{inv.responsible}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        inventoryStatusColors[inv.status]
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900">{inv.itemsChecked}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data / Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Saldos</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Motivo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{adj.itemDescription}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{adj.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{adj.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Anterior</p>
                          <p className="text-sm font-bold text-gray-600">{adj.previousBalance}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-300" />
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-blue-400 uppercase">Ajustado</p>
                          <p className="text-sm font-bold text-blue-600">{adj.adjustedBalance}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600">{adj.reason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{adj.responsible}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
