import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Tag,
  User,
  Calendar,
  Info,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests } from '@/src/types/mockData';

export default function ConsolidacaoDemandas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mainRequest = mockRequests.find(r => r.id === id);
  
  // Mocking similar requests for consolidation
  const [selectedRequests, setSelectedRequests] = useState([mainRequest].filter(Boolean));
  const [availableRequests, setAvailableRequests] = useState(
    mockRequests.filter(r => r.id !== id && r.status === 'Aprovada' && r.budgetCategory === mainRequest?.budgetCategory)
  );

  const handleAdd = (req: any) => {
    setSelectedRequests([...selectedRequests, req]);
    setAvailableRequests(availableRequests.filter(r => r.id !== req.id));
  };

  const handleRemove = (req: any) => {
    if (req.id === id) return; // Cannot remove the main request
    setSelectedRequests(selectedRequests.filter(r => r.id !== req.id));
    setAvailableRequests([...availableRequests, req]);
  };

  const totalQuantity = selectedRequests.reduce((sum, req) => 
    sum + (req?.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0) || 0), 0
  );

  if (!mainRequest) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Consolidação de Demandas</h1>
            <p className="text-sm text-gray-500 mt-1">Agrupe solicitações similares para otimizar a negociação.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Requests */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
              <div className="flex items-center gap-2 text-blue-700">
                <Layers className="w-5 h-5" />
                <h3 className="font-bold">Itens para Consolidação</h3>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {selectedRequests.length} Solicitações
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {selectedRequests.map((req) => (
                <div key={req?.id} className="p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{req?.id}</p>
                      <p className="text-xs text-gray-500">{req?.requester} • {req?.unit}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-blue-600">Qtd Itens: {req?.items.length}</span>
                        <span className="text-[10px] text-gray-400">• {req?.project}</span>
                      </div>
                    </div>
                  </div>
                  {req?.id !== id && (
                    <button 
                      onClick={() => handleRemove(req)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Available Similar Requests */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Sugestões para Agrupamento</h3>
              <p className="text-xs text-gray-500 mt-1">Solicitações aprovadas da mesma rubrica ({mainRequest.budgetCategory}).</p>
            </div>
            <div className="divide-y divide-gray-100">
              {availableRequests.length > 0 ? (
                availableRequests.map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{req.id}</p>
                        <p className="text-xs text-gray-500">{req.requester} • {req.items.length} item(ns)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{req.items[0]?.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAdd(req)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
                    >
                      <Plus className="w-3 h-3" /> Adicionar
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-sm italic">Nenhuma outra solicitação similar encontrada.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Consolidation Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Resumo da Demanda</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rubrica Consolidada</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{mainRequest.budgetCategory}</p>
                <p className="text-xs text-gray-500 mt-0.5">{mainRequest.items[0]?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Qtd Itens</p>
                  <p className="text-xl font-black text-blue-600 mt-1">{totalQuantity}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Solicitações</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{selectedRequests.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-[10px] text-amber-700 leading-relaxed">
                A consolidação gera uma única cotação para o mercado, mas o sistema manterá a rastreabilidade individual de cada projeto e centro de custo.
              </p>
            </div>

            <button 
              onClick={() => navigate(`/compras/cotacao/${mainRequest.id}`)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <ShoppingCart className="w-4 h-4" /> Iniciar Cotação Consolidada
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Fontes de Financiamento</h4>
            <div className="space-y-3">
              {selectedRequests.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{req?.project}</span>
                  <span className="font-bold text-gray-900">Qtd: {req?.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
