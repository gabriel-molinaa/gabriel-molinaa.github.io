import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests } from '@/src/types/mockData';
import { RequestStatus } from '@/src/types/procurement';

const statusColors: Record<string, string> = {
  'Aguardando aprovação': 'bg-amber-50 text-amber-700 border-amber-100',
  'Aprovada': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Rejeitada': 'bg-red-50 text-red-700 border-red-100',
  'Retornada para ajuste': 'bg-blue-50 text-blue-700 border-blue-100',
};

export default function AprovacoesList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pendentes' | 'historico'>('pendentes');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingApprovals = mockRequests.filter(req => 
    req.status === 'Aguardando aprovação' &&
    (req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     req.items.some(item => item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
     req.requester.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const historyApprovals = mockRequests.filter(req => 
    ['Aprovada', 'Rejeitada', 'Retornada para ajuste', 'Em cotação', 'Convertida em pedido'].includes(req.status) &&
    (req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     req.items.some(item => item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
     req.requester.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentList = activeTab === 'pendentes' ? pendingApprovals : historyApprovals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Módulo de Aprovações</h1>
          <p className="text-sm text-gray-500 mt-1">Analise e decida sobre as solicitações de compra da sua alçada.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pendentes')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === 'pendentes' 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Pendentes ({pendingApprovals.length})
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === 'historico' 
              ? "border-blue-600 text-blue-600" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Meu Histórico
        </button>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitante / Unidade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Projeto / C. Custo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Urgência</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentList.length > 0 ? (
                currentList.map((req) => (
                  <tr 
                    key={req.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/aprovacoes/${req.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{req.id}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {req.items[0]?.description}
                        {req.items.length > 1 && ` (+${req.items.length - 1})`}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                        <Calendar className="w-3 h-3" /> {req.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{req.requester}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-8">{req.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-700">{req.project}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{req.costCenter}</p>
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
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        statusColors[req.status] || "bg-gray-50 text-gray-500 border-gray-100"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/aprovacoes/${req.id}`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
                      >
                        {activeTab === 'pendentes' ? 'Analisar' : 'Ver Detalhes'} <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">Tudo em dia!</p>
                      <p className="text-sm">Não há solicitações aguardando sua aprovação no momento.</p>
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
