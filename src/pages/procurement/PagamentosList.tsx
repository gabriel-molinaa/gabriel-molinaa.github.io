import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Building2, 
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  CreditCard,
  Download,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockPayments } from '@/src/types/mockData';

const statusColors: Record<string, string> = {
  'Pendente': 'bg-amber-50 text-amber-700 border-amber-100',
  'Pago Parcialmente': 'bg-blue-50 text-blue-700 border-blue-100',
  'Pago': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Atrasado': 'bg-red-50 text-red-700 border-red-100',
};

export default function PagamentosList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = mockPayments.filter(payment => 
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payment.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pagamentos Pendentes</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as obrigações financeiras originadas das compras.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Pendente</p>
          <p className="text-2xl font-black text-gray-900 mt-1">R$ 15.750,00</p>
          <p className="text-[10px] text-amber-600 mt-1 font-bold">● 5 pagamentos aguardando</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vencendo Hoje</p>
          <p className="text-2xl font-black text-blue-600 mt-1">R$ 2.500,00</p>
          <p className="text-[10px] text-blue-600 mt-1 font-bold">● 1 pagamento prioritário</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pago este Mês</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">R$ 42.300,00</p>
          <p className="text-[10px] text-emerald-600 mt-1 font-bold">● 12 pagamentos concluídos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, fornecedor ou nota fiscal..." 
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID / Fornecedor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nota Fiscal</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Valor Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{payment.id}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                        <Building2 className="w-3 h-3" /> {payment.supplier}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">{payment.invoiceId}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">OC: {payment.orderId}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-gray-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.totalValue)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">{payment.installments.length} parcela(s)</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        statusColors[payment.status] || "bg-gray-50 text-gray-500 border-gray-100"
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/financeiro/pagamentos/${payment.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver Detalhes"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <DollarSign className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">Nenhum pagamento pendente!</p>
                      <p className="text-sm">Tudo em dia com os fornecedores.</p>
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
