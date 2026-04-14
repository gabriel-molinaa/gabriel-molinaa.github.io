import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Send,
  Info,
  Layers,
  Calendar,
  Printer,
  Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests, mockPurchaseOrders } from '@/src/types/mockData';

export default function GeracaoPedidoCompra() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  const order = mockPurchaseOrders[0]; // Mocking an order for the demo
  const request = mockRequests.find(r => r.id === order.requests[0]);

  const handleGenerate = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsGenerated(true);
    }, 1500);
  };

  if (!request) return null;

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Geração de Pedido de Compra</h1>
            <p className="text-sm text-gray-500 mt-1">Revise os dados finais antes de emitir o documento oficial.</p>
          </div>
        </div>
      </div>

      {!isGenerated ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">APAE Jaraguá do Sul</h2>
                    <p className="text-xs text-gray-500">CNPJ: 00.000.000/0001-00</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número do Pedido</p>
                  <p className="text-xl font-black text-blue-600 mt-1">{order.id}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Building2 className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Fornecedor</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">{order.supplier}</p>
                    <p className="text-xs text-gray-500">CNPJ: 11.111.111/0001-11</p>
                    <p className="text-xs text-gray-500">Contato: (11) 99999-9999</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CreditCard className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Condições</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Pagamento: <span className="font-bold text-gray-900">{order.paymentCondition}</span></p>
                    <p className="text-xs text-gray-500">Entrega Prevista: <span className="font-bold text-gray-900">{order.expectedDelivery}</span></p>
                    <p className="text-xs text-gray-500">Fonte: <span className="font-bold text-gray-900">{order.fundingSource}</span></p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Tag className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Itens do Pedido</h3>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100/50 border-b border-gray-200">
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Item</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-center">Qtd</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">Unitário</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {request.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-gray-900">{request.budgetCategory}</p>
                            <p className="text-[10px] text-gray-500">{item.description}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-bold text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estimatedValue)}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estimatedValue * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50/50">
                        <td colSpan={3} className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase">Total do Pedido:</td>
                        <td className="px-4 py-3 text-right text-xs font-black text-blue-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(request.items.reduce((acc, item) => acc + (item.estimatedValue * item.quantity), 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900">Ações</h3>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  Ao emitir o pedido, ele será enviado automaticamente para o e-mail do fornecedor e ficará disponível para o setor de recebimento.
                </p>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isSubmitting ? 'Emitindo...' : <><CheckCircle2 className="w-4 h-4" /> Emitir Pedido de Compra</>}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Rastreabilidade</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Layers className="w-3 h-3" /> Vinculado a: <span className="font-bold text-gray-900">{order.requests[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" /> Solicitado em: <span className="font-bold text-gray-900">{request.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pedido Emitido com Sucesso!</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              O pedido <strong>{order.id}</strong> foi enviado ao fornecedor e registrado no sistema para acompanhamento.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/compras/pedidos')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Ver Meus Pedidos
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
              <Printer className="w-4 h-4" /> Imprimir Pedido
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Baixar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
