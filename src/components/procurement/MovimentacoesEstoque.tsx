import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  Settings2, 
  ClipboardList, 
  XCircle, 
  Eye, 
  Calendar, 
  Building2, 
  User, 
  FileText,
  Package
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockMovements } from '@/src/types/mockData';
import { StockMovement, MovementType } from '@/src/types/procurement';

const movementIcons: Record<MovementType, any> = {
  'Entrada por compra': ArrowDownLeft,
  'Entrada por doação': ArrowDownLeft,
  'Saída para consumo': ArrowUpRight,
  'Transferência entre unidades': ArrowRightLeft,
  'Ajuste de inventário': Settings2,
  'Baixa': ArrowUpRight,
  'Devolução': ArrowRightLeft,
};

const movementColors: Record<MovementType, string> = {
  'Entrada por compra': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'Entrada por doação': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'Saída para consumo': 'text-blue-600 bg-blue-50 border-blue-100',
  'Transferência entre unidades': 'text-purple-600 bg-purple-50 border-purple-100',
  'Ajuste de inventário': 'text-amber-600 bg-amber-50 border-amber-100',
  'Baixa': 'text-red-600 bg-red-50 border-red-100',
  'Devolução': 'text-gray-600 bg-gray-50 border-gray-100',
};

export default function MovimentacoesEstoque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredMovements = mockMovements.filter(mov => {
    const matchesSearch = mov.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         mov.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.relatedDocument?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'Todos' || mov.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const kpis = [
    { label: 'Entradas (Período)', value: mockMovements.filter(m => m.type.startsWith('Entrada')).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Saídas (Período)', value: mockMovements.filter(m => m.type === 'Saída para consumo' || m.type === 'Baixa').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Transferências', value: mockMovements.filter(m => m.type === 'Transferência entre unidades').length, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Ajustes Realizados', value: mockMovements.filter(m => m.type === 'Ajuste de inventário').length, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleViewDetail = (mov: StockMovement) => {
    setSelectedMovement(mov);
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
                <ClipboardList className={cn("w-4 h-4", kpi.color)} />
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
            placeholder="Buscar por item ou documento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos os Tipos</option>
            <option value="Entrada por compra">Entrada por compra</option>
            <option value="Saída para consumo">Saída para consumo</option>
            <option value="Transferência entre unidades">Transferência</option>
            <option value="Ajuste de inventário">Ajuste</option>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data / Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Origem / Destino</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Qtd.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMovements.map((mov) => {
                const Icon = movementIcons[mov.type];
                return (
                  <tr key={mov.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{mov.date.split(' ')[0]}</p>
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1",
                        movementColors[mov.type]
                      )}>
                        <Icon className="w-3 h-3" />
                        <span>{mov.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{mov.itemDescription}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{mov.itemCode}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {mov.originUnit && (
                          <span className="text-xs font-medium text-gray-600">{mov.originUnit}</span>
                        )}
                        {mov.originUnit && mov.destinationUnit && (
                          <ArrowRightLeft className="w-3 h-3 text-gray-300" />
                        )}
                        {mov.destinationUnit && (
                          <span className="text-xs font-bold text-blue-600">{mov.destinationUnit}</span>
                        )}
                        {!mov.originUnit && !mov.destinationUnit && (
                          <span className="text-xs text-gray-400 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "text-sm font-bold",
                        mov.quantity > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewDetail(mov)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {isDetailOpen && selectedMovement && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Detalhes da Movimentação</h2>
                <p className="text-xs text-gray-500 mt-1">ID: {selectedMovement.id} • {selectedMovement.date}</p>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Summary Card */}
              <div className={cn(
                "p-6 rounded-2xl border flex items-center justify-between",
                movementColors[selectedMovement.type]
              )}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-xl">
                    {React.createElement(movementIcons[selectedMovement.type], { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider opacity-70">{selectedMovement.type}</p>
                    <p className="text-2xl font-bold">{selectedMovement.quantity > 0 ? `+${selectedMovement.quantity}` : selectedMovement.quantity} Unidades</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase opacity-70">Status</p>
                  <p className="text-sm font-bold">{selectedMovement.status}</p>
                </div>
              </div>

              {/* Item Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" /> Item Movimentado
                </h3>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedMovement.itemDescription}</p>
                    <p className="text-xs text-gray-500 mt-1">Código: {selectedMovement.itemCode}</p>
                  </div>
                  <button className="text-blue-600 hover:underline text-xs font-bold">Ver Estoque</button>
                </div>
              </div>

              {/* Context Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" /> Localização
                  </h3>
                  <div className="space-y-3">
                    {selectedMovement.originUnit && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Origem</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedMovement.originUnit}</p>
                      </div>
                    )}
                    {selectedMovement.destinationUnit && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destino</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedMovement.destinationUnit}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Documentação
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Documento Relacionado</p>
                      <p className="text-sm font-bold text-blue-600 mt-1">{selectedMovement.relatedDocument || 'Nenhum'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responsável</p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <p className="text-sm font-bold text-gray-900">{selectedMovement.responsible}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observations */}
              {selectedMovement.observations && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Observações
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedMovement.observations}</p>
                  </div>
                </div>
              )}
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
