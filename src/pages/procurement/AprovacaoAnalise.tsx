import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Info, 
  AlertTriangle,
  Paperclip,
  History,
  User,
  Calendar,
  Tag,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Send,
  FileText,
  Package,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests } from '@/src/types/mockData';
import { useAuth } from '@/src/context/AuthContext';
import { UrgencyLevel } from '@/src/types/procurement';

const urgencyColors: Record<UrgencyLevel, string> = {
  'Normal': 'bg-blue-500',
  'Urgente': 'bg-amber-500',
  'Emergencial': 'bg-red-500'
};

export default function AprovacaoAnalise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const request = mockRequests.find(r => r.id === id);
  
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decision, setDecision] = useState<'aprovar' | 'rejeitar' | 'retornar' | null>(null);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Solicitação não encontrada</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            O ID da solicitação informado não existe ou você não tem permissão para acessá-lo.
          </p>
        </div>
        <button 
          onClick={() => navigate('/aprovacoes')}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Lista
        </button>
      </div>
    );
  }

  const handleDecision = (type: 'aprovar' | 'rejeitar' | 'retornar') => {
    setDecision(type);
  };

  const handleSubmitDecision = () => {
    if (!decision) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/aprovacoes');
    }, 1500);
  };

  const isApprover = user?.role === 'Gestor/Aprovador' || user?.role === 'Administrador';
  const totalEstimated = request.items.reduce((acc, item) => acc + (item.estimatedValue * item.quantity), 0);

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Análise de Solicitação: {request.id}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-100">
                <Clock className="w-3 h-3" />
                Aguardando sua decisão
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Revise os detalhes técnicos e financeiros antes de decidir.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <DollarSign className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Vínculo Orçamentário</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projeto / Centro de Custo</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{request.project}</p>
                    <p className="text-xs text-gray-500">{request.costCenter}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Convênio / Fonte Pagadora</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{request.agreement || 'Recursos Próprios'}</p>
                    <p className="text-xs text-gray-500">{request.fundingSource || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Tag className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Planejamento</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plano de Trabalho / Meta</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{request.workPlan || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rubrica / Tipo de Despesa</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{request.budgetCategory || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Items Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  <Package className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Itens Solicitados</h3>
                </div>
                <span className="text-xs font-bold text-gray-400">{request.items.length} item(ns)</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição / Código</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qtd / Unid</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vlr. Unit Est.</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {request.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 pr-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900">{item.description}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{item.type} {item.code ? `• Cód: ${item.code}` : ''}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium text-gray-700">{item.quantity} {item.unitOfMeasure}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estimatedValue)}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estimatedValue * item.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-100">
                      <td colSpan={3} className="py-4 text-right font-bold text-gray-400 text-xs uppercase">Total Estimado da Solicitação:</td>
                      <td className="py-4 text-right">
                        <span className="text-lg font-black text-blue-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEstimated)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Justification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Justificativa e Urgência</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Justificativa Detalhada</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {request.justification}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Grau de Urgência</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className={cn("w-3 h-3 rounded-full", urgencyColors[request.urgency])} />
                    <span className="text-sm font-bold text-gray-900">{request.urgency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Paperclip className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Documentos e Anexos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Especificacao_Tecnica.pdf</p>
                    <p className="text-[10px] text-gray-400">PDF • 1.2 MB</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 group-hover:text-blue-600">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Orcamento_Referencia.xlsx</p>
                    <p className="text-[10px] text-gray-400">XLSX • 450 KB</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 group-hover:text-blue-600">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Decision Panel */}
        <div className="space-y-6">
          {/* Decision Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Sua Decisão</h3>
            </div>

            {!isApprover ? (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Você está visualizando esta solicitação em modo de consulta. Apenas usuários com perfil de <strong>Gestor/Aprovador</strong> podem tomar decisões.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleDecision('aprovar')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      decision === 'aprovar' 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/50"
                    )}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Aprovar</span>
                  </button>
                  <button 
                    onClick={() => handleDecision('retornar')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      decision === 'retornar' 
                        ? "bg-blue-50 border-blue-500 text-blue-700" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/50"
                    )}
                  >
                    <RotateCcw className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ajustar</span>
                  </button>
                  <button 
                    onClick={() => handleDecision('rejeitar')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      decision === 'rejeitar' 
                        ? "bg-red-50 border-red-500 text-red-700" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-red-200 hover:bg-red-50/50"
                    )}
                  >
                    <XCircle className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Rejeitar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Parecer / Comentários
                  </label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      decision === 'rejeitar' ? "Informe o motivo da rejeição..." :
                      decision === 'retornar' ? "Descreva quais ajustes são necessários..." :
                      "Adicione um comentário opcional..."
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
                  />
                </div>

                <button 
                  onClick={handleSubmitDecision}
                  disabled={!decision || isSubmitting}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:shadow-none",
                    decision === 'aprovar' ? "bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700" :
                    decision === 'rejeitar' ? "bg-red-600 text-white shadow-red-100 hover:bg-red-700" :
                    decision === 'retornar' ? "bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700" :
                    "bg-gray-200 text-gray-400"
                  )}
                >
                  {isSubmitting ? (
                    <>Processando...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> 
                      {decision === 'aprovar' ? 'Confirmar Aprovação' : 
                       decision === 'rejeitar' ? 'Confirmar Rejeição' : 
                       decision === 'retornar' ? 'Enviar para Ajuste' : 'Selecione uma ação'}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Requester Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Solicitante</p>
                <p className="text-sm font-bold text-gray-900">{request.requester}</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidade</p>
                <p className="text-xs font-bold text-blue-600 mt-0.5">{request.unit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setor / Serviço</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{request.sector}</p>
              </div>
            </div>
          </div>

          {/* Traceability */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <History className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Rastreabilidade</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {request.history.map((item, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={cn(
                    "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center",
                    idx === 0 ? "bg-blue-600" : "bg-gray-200"
                  )}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{item.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.date} • {item.user}</p>
                    {item.comment && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                        <p className="text-[10px] text-amber-700 italic">"{item.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-blue-600">
                <MapPin className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Logística</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locais de Entrega</p>
                  <div className="mt-2 space-y-2">
                    {Array.from(new Set(request.items.map(i => i.deliveryLocation))).map((loc, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        {loc || 'A definir'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
