import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Building2, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  MoreHorizontal,
  Eye,
  XCircle,
  Package,
  History,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockTransfers, mockItemMaster, mockUsers } from '@/src/types/mockData';
import { Transfer, TransferStatus, TransferItem } from '@/src/types/procurement';

const statusColors: Record<TransferStatus, string> = {
  'Solicitada': 'bg-blue-50 text-blue-700 border-blue-100',
  'Aguardando separação': 'bg-amber-50 text-amber-700 border-amber-100',
  'Em trânsito': 'bg-purple-50 text-purple-700 border-purple-100',
  'Recebida': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Cancelada': 'bg-red-50 text-red-700 border-red-100',
};

export default function TransferenciasUnidades() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransferStatus | 'Todos'>('Todos');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newTransfer, setNewTransfer] = useState({
    originUnit: 'Matriz',
    destinationUnit: '',
    requester: 'Gabriel Molina',
    justification: '',
    items: [] as TransferItem[]
  });

  const [newItem, setNewItem] = useState({
    code: '',
    description: '',
    type: '',
    requestedQuantity: 1,
    stock: 0
  });

  const filteredTransfers = mockTransfers.filter(trf => {
    const matchesSearch = trf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trf.originUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trf.destinationUnit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || trf.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const kpis = [
    { label: 'Em aberto', value: mockTransfers.filter(t => t.status === 'Solicitada' || t.status === 'Aguardando separação').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Em trânsito', value: mockTransfers.filter(t => t.status === 'Em trânsito').length, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Recebidas', value: mockTransfers.filter(t => t.status === 'Recebida').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Canceladas', value: mockTransfers.filter(t => t.status === 'Cancelada').length, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const handleViewDetail = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setIsDetailOpen(true);
  };

  const handleAddItem = () => {
    if (!newItem.code) return;
    const itemToAdd: TransferItem = {
      code: newItem.code,
      description: newItem.description,
      type: newItem.type,
      requestedQuantity: newItem.requestedQuantity,
      sentQuantity: 0,
      receivedQuantity: 0
    };
    setNewTransfer({ ...newTransfer, items: [...newTransfer.items, itemToAdd] });
    setNewItem({ code: '', description: '', type: '', requestedQuantity: 1, stock: 0 });
  };

  const handleConfirmReceipt = () => {
    // Mock action
    alert('Recebimento confirmado com sucesso!');
    setIsDetailOpen(false);
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

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 flex-1 w-full">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por Nº, origem ou destino..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Solicitada">Solicitada</option>
              <option value="Aguardando separação">Aguardando separação</option>
              <option value="Em trânsito">Em trânsito</option>
              <option value="Recebida">Recebida</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
              <Filter className="w-4 h-4" /> Filtros
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Nova Transferência
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nº / Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Origem / Destino</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitante</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Itens</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransfers.map((trf) => (
                <tr key={trf.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{trf.id}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{trf.requestDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700">{trf.originUnit}</span>
                        <ArrowRight className="w-3 h-3 text-gray-300 my-0.5" />
                        <span className="text-xs font-bold text-blue-600">{trf.destinationUnit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{trf.requester}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{trf.totalItems}</p>
                    <p className="text-[10px] text-gray-400">{trf.itemType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      statusColors[trf.status]
                    )}>
                      {trf.status}
                    </span>
                    {trf.status === 'Em trânsito' && (
                      <p className="text-[10px] text-amber-600 font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Prev: {trf.arrivalForecast}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetail(trf)}
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
      {isDetailOpen && selectedTransfer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">{selectedTransfer.id}</h2>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    statusColors[selectedTransfer.status]
                  )}>
                    {selectedTransfer.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Solicitado em {selectedTransfer.requestDate} por {selectedTransfer.requester}</p>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Units Info */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Unidade Origem</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-bold text-gray-900">{selectedTransfer.originUnit}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Unidade Destino</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-bold text-gray-900">{selectedTransfer.destinationUnit}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" /> Itens Transferidos
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3 text-center">Solic.</th>
                        <th className="px-4 py-3 text-center">Env.</th>
                        <th className="px-4 py-3 text-center">Rec.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedTransfer.items.map((item, idx) => (
                        <tr key={idx} className="text-xs">
                          <td className="px-4 py-3">
                            <p className="font-bold text-gray-900">{item.description}</p>
                            <p className="text-[10px] text-gray-400">{item.code}</p>
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-gray-600">{item.requestedQuantity}</td>
                          <td className="px-4 py-3 text-center font-medium text-gray-600">{item.sentQuantity}</td>
                          <td className="px-4 py-3 text-center font-bold text-blue-600">{item.receivedQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" /> Histórico
                  </h3>
                  <div className="space-y-4">
                    {selectedTransfer.history.map((event, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1.5",
                            idx === 0 ? "bg-blue-600 ring-4 ring-blue-100" : "bg-gray-300"
                          )} />
                          {idx !== selectedTransfer.history.length - 1 && (
                            <div className="w-px h-full bg-gray-200 my-1" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{event.action}</p>
                          <p className="text-[10px] text-gray-400">{event.date} • {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" /> Justificativa
                    </h3>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-600 leading-relaxed">{selectedTransfer.justification}</p>
                    </div>
                  </div>
                  {selectedTransfer.divergenceNotes && (
                    <div>
                      <h3 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Divergências
                      </h3>
                      <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-xs text-red-700 leading-relaxed">{selectedTransfer.divergenceNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Receiving Confirmation Section (if in transit) */}
              {selectedTransfer.status === 'Em trânsito' && (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Truck className="w-5 h-5" />
                    <h3 className="font-bold">Confirmar Recebimento</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Data Recebimento</label>
                      <input type="date" className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue="2026-04-01" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Responsável</label>
                      <input type="text" className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue="Ricardo Almoxarife" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Observações / Divergências</label>
                    <textarea 
                      className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 h-20"
                      placeholder="Descreva qualquer divergência ou observação sobre o material recebido..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleConfirmReceipt}
                      className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all shadow-sm"
                    >
                      Confirmar Recebimento
                    </button>
                    <button className="px-4 py-2.5 bg-white text-amber-700 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-50 transition-all">
                      Registrar Divergência
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
              >
                Fechar
              </button>
              {selectedTransfer.status === 'Solicitada' && (
                <>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
                    Confirmar Envio
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Nova Transferência entre Unidades</h2>
                <p className="text-xs text-gray-500 mt-1">Solicite o envio de materiais entre unidades da APAE.</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Unidade Origem</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTransfer.originUnit}
                    onChange={(e) => setNewTransfer({ ...newTransfer, originUnit: e.target.value })}
                  >
                    <option value="Matriz">Matriz</option>
                    <option value="Unidade 2">Unidade 2</option>
                    <option value="Unidade 3">Unidade 3</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Unidade Destino</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTransfer.destinationUnit}
                    onChange={(e) => setNewTransfer({ ...newTransfer, destinationUnit: e.target.value })}
                  >
                    <option value="">Selecione o destino...</option>
                    <option value="Matriz">Matriz</option>
                    <option value="Unidade 2">Unidade 2</option>
                    <option value="Unidade 3">Unidade 3</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Solicitante</label>
                  <div className="p-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 font-medium">
                    Gabriel Molina
                  </div>
                </div>
              </div>

              {/* Add Item Area */}
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar Item
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider ml-1">Item / Produto</label>
                    <select 
                      className="w-full p-3 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newItem.code}
                      onChange={(e) => {
                        const item = mockItemMaster.find(i => i.id === e.target.value);
                        if (item) {
                          setNewItem({
                            ...newItem,
                            code: item.id,
                            description: item.description,
                            type: item.type,
                            stock: Math.floor(Math.random() * 100) + 10 // Mock stock
                          });
                        }
                      }}
                    >
                      <option value="">Selecione um item...</option>
                      {mockItemMaster.map(item => (
                        <option key={item.id} value={item.id}>{item.description}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider ml-1">Quantidade</label>
                    <input 
                      type="number" 
                      className="w-full p-3 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newItem.requestedQuantity}
                      onChange={(e) => setNewItem({ ...newItem, requestedQuantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <button 
                      onClick={handleAddItem}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
                {newItem.code && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-100 w-fit">
                    <Info className="w-3 h-3 text-blue-500" />
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                      Estoque disponível na origem: <span className="text-blue-900">{newItem.stock} unidades</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Items List */}
              {newTransfer.items.length > 0 && (
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Item</th>
                        <th className="px-6 py-4 text-center">Quantidade</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {newTransfer.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900">{item.description}</p>
                            <p className="text-[10px] text-gray-400">{item.code}</p>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-700">{item.requestedQuantity}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => setNewTransfer({ ...newTransfer, items: newTransfer.items.filter((_, i) => i !== idx) })}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Justification */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Motivo / Justificativa</label>
                <textarea 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Explique o motivo desta transferência interna..."
                  value={newTransfer.justification}
                  onChange={(e) => setNewTransfer({ ...newTransfer, justification: e.target.value })}
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-4">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
              >
                Descartar
              </button>
              <button 
                onClick={() => {
                  alert('Transferência solicitada com sucesso!');
                  setIsCreateModalOpen(false);
                }}
                disabled={newTransfer.items.length === 0 || !newTransfer.destinationUnit}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Solicitar Transferência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
