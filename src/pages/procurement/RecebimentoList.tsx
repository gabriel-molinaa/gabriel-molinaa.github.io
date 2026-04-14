import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Building2, 
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Truck,
  Layers,
  History,
  ArrowRightLeft,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockPurchaseOrders } from '@/src/types/mockData';
import TransferenciasUnidades from '@/src/components/procurement/TransferenciasUnidades';
import EstoqueAtual from '@/src/components/procurement/EstoqueAtual';
import MovimentacoesEstoque from '@/src/components/procurement/MovimentacoesEstoque';
import InventarioAjustes from '@/src/components/procurement/InventarioAjustes';

const statusColors: Record<string, string> = {
  'Emitida': 'bg-blue-50 text-blue-700 border-blue-100',
  'Recebimento Parcial': 'bg-amber-50 text-amber-700 border-amber-100',
  'Recebida': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

type TabType = 'recebimento' | 'estoque' | 'movimentacoes' | 'transferencias' | 'inventario';

export default function RecebimentoList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('recebimento');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingOrders = mockPurchaseOrders.filter(order => 
    (order.status === 'Emitida' || order.status === 'Recebimento Parcial') &&
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     order.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    { id: 'recebimento', label: 'Recebimento', icon: Truck },
    { id: 'estoque', label: 'Estoque Atual', icon: Package },
    { id: 'movimentacoes', label: 'Movimentações', icon: History },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'inventario', label: 'Inventário / Ajustes', icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Estoque e Recebimento</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão centralizada de suprimentos, movimentações e controle de inventário.</p>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-2xl w-fit border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'recebimento' && (
        <>
          {/* KPI Cards for Recebimento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Aguardando recebimento</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold text-blue-600">{pendingOrders.length}</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recebimentos parciais</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold text-amber-600">{pendingOrders.filter(o => o.status === 'Recebimento Parcial').length}</h3>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recebidos hoje</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold text-emerald-600">3</h3>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Com divergência</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold text-red-600">1</h3>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por OC ou fornecedor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
              <Filter className="w-4 h-4" /> Filtros Avançados
            </button>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">OC / Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fornecedor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Progresso</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map((order) => {
                      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                      const receivedItems = order.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
                      const progress = (receivedItems / totalItems) * 100;

                      return (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-900">{order.id}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{order.date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-bold text-gray-700">{order.supplier}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{order.fundingSource}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full max-w-[120px]">
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="font-bold text-gray-500">{receivedItems}/{totalItems}</span>
                                <span className="text-gray-400">{Math.round(progress)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-500",
                                    progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                                  )}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                              statusColors[order.status] || "bg-gray-50 text-gray-500 border-gray-100"
                            )}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => navigate(`/recebimento/conferencia/${order.id}`)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                            >
                              <Truck className="w-3 h-3" /> Conferir
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Package className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium">Tudo em dia!</p>
                          <p className="text-sm">Não há pedidos aguardando recebimento no momento.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'estoque' && <EstoqueAtual />}
      {activeTab === 'movimentacoes' && <MovimentacoesEstoque />}
      {activeTab === 'transferencias' && <TransferenciasUnidades />}
      {activeTab === 'inventario' && <InventarioAjustes />}
    </div>
  );
}
