import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShoppingCart, 
  Package, 
  FileText, 
  Search, 
  User, 
  Calendar, 
  Tag, 
  DollarSign, 
  Info, 
  AlertTriangle,
  Paperclip,
  History,
  Printer,
  Download,
  Layers,
  Link as LinkIcon,
  Share2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getRequestPlanningFlag } from '@/src/lib/procurement';
import { getPurchaseRequestById } from '@/src/lib/requestStore';
import { RequestStatus, UrgencyLevel } from '@/src/types/procurement';

const statusColors: Record<RequestStatus, string> = {
  'Rascunho': 'bg-gray-100 text-gray-700 border-gray-200',
  'Em análise': 'bg-blue-50 text-blue-700 border-blue-100',
  'Aguardando aprovação': 'bg-amber-50 text-amber-700 border-amber-100',
  'Retornada para ajuste': 'bg-red-50 text-red-700 border-red-100',
  'Aprovada': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Rejeitada': 'bg-red-100 text-red-800 border-red-200',
  'Em cotação': 'bg-purple-50 text-purple-700 border-purple-100',
  'Convertida em pedido': 'bg-indigo-50 text-indigo-700 border-indigo-100'
};

const statusIcons: Record<RequestStatus, any> = {
  'Rascunho': FileText,
  'Em análise': Search,
  'Aguardando aprovação': Clock,
  'Retornada para ajuste': RotateCcw,
  'Aprovada': CheckCircle2,
  'Rejeitada': XCircle,
  'Em cotação': ShoppingCart,
  'Convertida em pedido': Package
};

const urgencyColors: Record<UrgencyLevel, string> = {
  'Normal': 'bg-blue-500',
  'Urgente': 'bg-amber-500',
  'Emergencial': 'bg-red-500'
};

export default function SolicitacaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = getPurchaseRequestById(id);

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
          onClick={() => navigate('/solicitacoes')}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Lista
        </button>
      </div>
    );
  }

  const StatusIcon = statusIcons[request.status];
  const planningFlag = getRequestPlanningFlag(request);

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
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{request.id}</h1>
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                statusColors[request.status]
              )}>
                <StatusIcon className="w-3 h-3" />
                {request.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Solicitação de compra para {request.unit} - {request.sector}{request.roomNumber ? ` - ${request.roomNumber}` : ''}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
          </button>
          <div className="w-px h-10 bg-gray-200 mx-1" />
          {request.status === 'Rascunho' || request.status === 'Retornada para ajuste' ? (
            <button onClick={() => navigate(`/solicitacoes/nova?edit=${request.id}`)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Editar Solicitação
            </button>
          ) : (
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
              Visualizar PDF
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
            {/* Classification */}
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
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atendimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {request.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 pr-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900">{item.description}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{item.type} {item.code ? `• Cód: ${item.code}` : ''}</span>
                            {item.referenceLink && (
                              <a href={item.referenceLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700">
                                <LinkIcon className="w-3 h-3" /> Referência do produto
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-medium text-gray-700">{item.quantity} {item.unitOfMeasure}</span>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1 text-xs">
                            <div className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 font-bold uppercase tracking-wider text-emerald-700">Estoque: {item.stockQuantity ?? 0}</div>
                            <div className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-bold uppercase tracking-wider text-amber-700">Pedido: {item.purchaseQuantity ?? 0}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Layers className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Atendimento da Solicitação</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 md:col-span-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Classificação</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
                      planningFlag === 'Estoque' ? 'bg-emerald-100 text-emerald-700' : planningFlag === 'Compra' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {planningFlag === 'Compra' ? 'Pedido de compra' : planningFlag}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Estoque: {request.items.reduce((total, item) => total + (item.stockQuantity ?? 0), 0)}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Compra: {request.items.reduce((total, item) => total + (item.purchaseQuantity ?? 0), 0)}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Atendidos por estoque</p>
                  <div className="mt-3 space-y-2 text-xs text-gray-700">
                    {request.items.some((item) => (item.stockQuantity ?? 0) > 0)
                      ? request.items.filter((item) => (item.stockQuantity ?? 0) > 0).map((item) => (
                          <div key={`stock-${item.id}`}><span className="font-bold text-gray-900">{item.description}</span> • {item.stockQuantity} {item.unitOfMeasure}</div>
                        ))
                      : <p className="text-gray-400">Nenhum item atendido pelo estoque.</p>}
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 md:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Itens para pedido de compra</p>
                  <div className="mt-3 space-y-2 text-xs text-gray-700">
                    {request.items.some((item) => (item.purchaseQuantity ?? 0) > 0)
                      ? request.items.filter((item) => (item.purchaseQuantity ?? 0) > 0).map((item) => (
                          <div key={`purchase-${item.id}`}><span className="font-bold text-gray-900">{item.description}</span> • {item.purchaseQuantity} {item.unitOfMeasure}</div>
                        ))
                      : <p className="text-gray-400">Todos os itens podem ser atendidos pelo estoque.</p>}
                  </div>
                </div>
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
                    <span className="text-sm font-bold text-gray-900">{request.urgency === 'Emergencial' ? 'Urgente' : request.urgency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Paperclip className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900">Anexos e Documentos (0)</h3>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Nenhum anexo enviado para esta solicitação.</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Timeline & Info */}
        <div className="space-y-6">
          {/* Timeline Card */}
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
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidade</p>
                <p className="text-xs font-bold text-blue-600 mt-0.5">{request.unit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setor / Serviço</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{request.sector}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número da Sala</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">{request.roomNumber || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Planning Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-blue-600">
                <Layers className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Planejamento</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resumo</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <ChevronRight className="w-3 h-3 text-gray-300" />
                      {planningFlag === 'Compra' ? 'Pedido de compra' : planningFlag}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <ChevronRight className="w-3 h-3 text-gray-300" />
                      Estoque: {request.items.reduce((total, item) => total + (item.stockQuantity ?? 0), 0)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <ChevronRight className="w-3 h-3 text-gray-300" />
                      Pedido de compra: {request.items.reduce((total, item) => total + (item.purchaseQuantity ?? 0), 0)}
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
