import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  CheckCircle2,
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests } from '@/src/types/mockData';

export default function FilaSolicitacoesAprovadas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const approvedRequests = mockRequests.filter(req => 
    req.status === 'Aprovada' &&
    (req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     req.items.some(item => item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
     req.requester.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fila de Solicitações Aprovadas</h1>
          <p className="text-sm text-gray-500 mt-1">Solicitações prontas para cotação e aquisição.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/compras/pedidos')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" /> Ver Pedidos de Compra
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, item ou solicitante..." 
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitação</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item / Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Projeto / Fonte</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Urgência</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approvedRequests.length > 0 ? (
                approvedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{req.id}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{req.date} • {req.requester}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{req.budgetCategory}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[250px]">
                        {req.items[0]?.description}
                        {req.items.length > 1 && ` (+${req.items.length - 1})`}
                      </p>
                      <p className="text-[10px] font-bold text-blue-600 mt-1">Qtd Itens: {req.items.length}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-700">{req.project}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{req.fundingSource || 'Recursos Próprios'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          req.urgency === 'Emergencial' ? "bg-red-500" :
                          req.urgency === 'Urgente' ? "bg-amber-500" :
                          req.urgency === 'Normal' ? "bg-blue-500" : "bg-gray-300"
                        )} />
                        <span className="text-xs font-medium text-gray-700">{req.urgency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigate(`/compras/cotacao/${req.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <ShoppingCart className="w-3 h-3" /> Cotar
                        </button>
                        <button 
                          onClick={() => navigate(`/compras/consolidacao/${req.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Consolidar Demanda"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">Fila Vazia!</p>
                      <p className="text-sm">Não há solicitações aprovadas aguardando cotação.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
