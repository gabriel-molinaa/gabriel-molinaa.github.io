import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Eye, 
  History, 
  ArrowRightLeft, 
  Settings2, 
  ClipboardList 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockStockItems } from '@/src/types/mockData';
import { StockItem, StockBalance } from '@/src/types/procurement';

const statusColors = {
  'Normal': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Baixo': 'bg-amber-50 text-amber-700 border-amber-100',
  'Sem saldo': 'bg-red-50 text-red-700 border-red-100',
};

export default function EstoqueAtual() {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredItems = mockStockItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = unitFilter === 'Todas' || item.balances.some(b => b.unit === unitFilter);
    
    return matchesSearch && matchesUnit;
  });

  const kpis = [
    { label: 'Itens Cadastrados', value: mockStockItems.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Abaixo do Mínimo', value: mockStockItems.filter(i => i.balances.some(b => b.status === 'Baixo')).length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Sem Saldo', value: mockStockItems.filter(i => i.balances.some(b => b.status === 'Sem saldo')).length, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Unidades Ativas', value: 3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const handleViewDetail = (item: StockItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

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
                <Package className={cn("w-4 h-4", kpi.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por código ou descrição..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todas">Todas as Unidades</option>
            <option value="Matriz">Matriz</option>
            <option value="Unidade 2">Unidade 2</option>
            <option value="Unidade 3">Unidade 3</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo / Cat.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Saldos por Unidade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{item.description}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{item.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-gray-700">{item.type}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {item.balances.map((balance, bIdx) => (
                        <div 
                          key={bIdx}
                          className={cn(
                            "px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5",
                            statusColors[balance.status]
                          )}
                        >
                          <Building2 className="w-3 h-3 opacity-50" />
                          <span>{balance.unit}: {balance.balance} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetail(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {isDetailOpen && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedItem.description}</h2>
                <p className="text-xs text-gray-500 mt-1">Código: {selectedItem.id} • {selectedItem.category}</p>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* General Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Item</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedItem.type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidade de Medida</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedItem.unit}</p>
                </div>
              </div>

              {/* Balances */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> Saldos por Unidade
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedItem.balances.map((balance, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", statusColors[balance.status].split(' ')[0])}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{balance.unit}</p>
                          <p className="text-[10px] text-gray-400">Estoque Mínimo: {balance.minStock} {selectedItem.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{balance.balance} {selectedItem.unit}</p>
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border",
                          statusColors[balance.status]
                        )}>
                          {balance.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-blue-600" /> Ações Rápidas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-blue-50 hover:border-blue-100 transition-all group">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100">
                      <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Transferir</p>
                      <p className="text-[10px] text-gray-400">Mover para outra unidade</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-amber-50 hover:border-amber-100 transition-all group">
                    <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100">
                      <Settings2 className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Ajustar Saldo</p>
                      <p className="text-[10px] text-gray-400">Correção manual de estoque</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group">
                    <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100">
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Inventário</p>
                      <p className="text-[10px] text-gray-400">Iniciar contagem física</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-purple-50 hover:border-purple-100 transition-all group">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100">
                      <History className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Movimentações</p>
                      <p className="text-[10px] text-gray-400">Ver histórico completo</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
