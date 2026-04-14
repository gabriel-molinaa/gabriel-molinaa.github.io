import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Tag,
  DollarSign,
  Building2,
  Clock,
  CreditCard,
  ShieldCheck,
  Trophy,
  MessageSquare,
  Send,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests, mockQuotations } from '@/src/types/mockData';

export default function ComparativoFornecedores() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = mockRequests.find(r => r.id === id);
  const quotation = mockQuotations[0]; // Mocking a quotation for the demo
  
  const [winnerId, setWinnerId] = useState<string | null>(quotation.suppliers.find(s => s.isWinner)?.id || null);
  const [justification, setJustification] = useState(quotation.suppliers.find(s => s.isWinner)?.justification || '');

  if (!request || !quotation) return null;

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Comparativo de Fornecedores</h1>
            <p className="text-sm text-gray-500 mt-1">Analise as propostas e selecione a melhor opção para a APAE.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Comparison Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotation.suppliers.map((supplier) => (
              <div 
                key={supplier.id}
                onClick={() => setWinnerId(supplier.id)}
                className={cn(
                  "relative bg-white rounded-2xl border-2 p-6 transition-all cursor-pointer shadow-sm",
                  winnerId === supplier.id 
                    ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50" 
                    : "border-gray-100 hover:border-blue-200"
                )}
              >
                {winnerId === supplier.id && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Trophy className="w-5 h-5" />
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{supplier.name}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor Total</p>
                      <p className="text-xl font-black text-gray-900 mt-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(supplier.totalPrice)}
                      </p>
                      <p className="text-[10px] text-gray-500">Unitário: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(supplier.unitPrice)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Entrega
                        </p>
                        <p className="text-xs font-semibold text-gray-700 mt-1">{supplier.deliveryTime}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <CreditCard className="w-3 h-3" /> Pagamento
                        </p>
                        <p className="text-xs font-semibold text-gray-700 mt-1">{supplier.paymentTerms}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Conformidade
                      </p>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1",
                        supplier.technicalCompliance ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {supplier.technicalCompliance ? 'Conforme' : 'Não Conforme'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Justification */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Justificativa da Escolha</h3>
            </div>
            <textarea 
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Descreva o motivo da seleção deste fornecedor (ex: menor preço, melhor prazo, conformidade técnica exclusiva)..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
            />
          </div>
        </div>

        {/* Sidebar - Summary & Action */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Conclusão</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fornecedor Selecionado</p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {winnerId ? quotation.suppliers.find(s => s.id === winnerId)?.name : <span className="text-gray-400 italic">Nenhum selecionado</span>}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor Final</p>
                <p className="text-2xl font-black text-blue-700 mt-1">
                  {winnerId 
                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quotation.suppliers.find(s => s.id === winnerId)?.totalPrice || 0)
                    : 'R$ 0,00'
                  }
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Ao confirmar, o sistema gerará o Pedido de Compra e notificará o fornecedor vencedor.
              </p>
            </div>

            <button 
              onClick={() => navigate('/compras/pedido/novo')}
              disabled={!winnerId || !justification}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="w-4 h-4" /> Gerar Pedido de Compra
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Rastreabilidade</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Solicitação</span>
                <span className="font-bold text-gray-900">{request.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Projeto</span>
                <span className="font-bold text-gray-900">{request.project}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
