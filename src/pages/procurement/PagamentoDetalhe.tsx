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
  Calendar,
  Info,
  Download,
  Printer,
  History,
  ExternalLink,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockPayments, mockInvoices, mockPurchaseOrders } from '@/src/types/mockData';

export default function PagamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const payment = mockPayments.find(p => p.id === id);
  const invoice = mockInvoices.find(i => i.id === payment?.invoiceId);
  const order = mockPurchaseOrders.find(o => o.id === payment?.orderId);
  
  const [installments, setInstallments] = useState(payment?.installments || []);

  const handlePay = (idx: number) => {
    const newInstallments = [...installments];
    newInstallments[idx].status = 'Pago';
    newInstallments[idx].paymentDate = new Date().toLocaleDateString('pt-BR');
    setInstallments(newInstallments);
  };

  if (!payment) return null;

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Detalhes do Pagamento</h1>
            <p className="text-sm text-gray-500 mt-1">Gestão de parcelas e liquidação financeira para <strong>{payment.supplier}</strong>.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Comprovante
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Installments Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold">Cronograma de Pagamento</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                {installments.length} Parcela(s)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parcela</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vencimento</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Valor</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {installments.map((inst, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{inst.number}ª Parcela</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{inst.dueDate}</td>
                      <td className="px-6 py-4 text-right text-sm font-black text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inst.value)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          inst.status === 'Pago' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {inst.status}
                        </span>
                        {inst.paymentDate && (
                          <p className="text-[10px] text-gray-400 mt-1">Pago em: {inst.paymentDate}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {inst.status === 'Pendente' ? (
                          <button 
                            onClick={() => handlePay(idx)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                          >
                            Liquidar
                          </button>
                        ) : (
                          <button className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg" disabled>
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Linkage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Nota Fiscal</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Número: <span className="font-bold text-gray-900">{invoice?.number}</span></p>
                <p className="text-xs text-gray-500">Emissão: <span className="font-bold text-gray-900">{invoice?.issueDate}</span></p>
                <p className="text-xs text-gray-500">Valor NF: <span className="font-bold text-gray-900">R$ {invoice?.totalValue.toFixed(2)}</span></p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Pedido de Compra</h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Número: <span className="font-bold text-gray-900">{order?.id}</span></p>
                <p className="text-xs text-gray-500">Fonte: <span className="font-bold text-gray-900">{order?.fundingSource}</span></p>
                <p className="text-xs text-gray-500">Condição: <span className="font-bold text-gray-900">{order?.paymentCondition}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Financial Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Resumo Financeiro</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saldo Devedor</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    installments.filter(i => i.status === 'Pendente').reduce((sum, i) => sum + i.value, 0)
                  )}
                </p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(installments.filter(i => i.status === 'Pago').length / installments.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-emerald-600">Pago: {installments.filter(i => i.status === 'Pago').length}</span>
                <span className="text-amber-600">Pendente: {installments.filter(i => i.status === 'Pendente').length}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[10px] text-blue-700 leading-relaxed">
                Este pagamento está vinculado ao <strong>Convênio Municipal 452/2025</strong>. Certifique-se de anexar o comprovante de transferência para prestação de contas.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <History className="w-3 h-3" /> Histórico de Eventos
            </h4>
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
                <p className="text-[10px] font-bold text-gray-900">Recebimento Registrado</p>
                <p className="text-[10px] text-gray-400">31/03/2026 15:30 • Ricardo A.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-4 h-4 bg-blue-500 border-4 border-white rounded-full shadow-sm" />
                <p className="text-[10px] font-bold text-gray-900">Nota Fiscal Lançada</p>
                <p className="text-[10px] text-gray-400">31/03/2026 16:00 • Sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
