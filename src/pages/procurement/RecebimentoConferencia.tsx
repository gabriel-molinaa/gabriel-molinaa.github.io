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
  Truck,
  Package,
  Upload,
  Save,
  Info,
  Calendar,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockPurchaseOrders } from '@/src/types/mockData';

export default function RecebimentoConferencia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockPurchaseOrders.find(o => o.id === id);
  
  const [receivedItems, setReceivedItems] = useState(
    order?.items.map(item => ({ ...item, currentReceived: 0 })) || []
  );

  const [invoice, setInvoice] = useState({
    number: '',
    series: '',
    issueDate: '',
    totalValue: 0,
    xmlUploaded: false,
    pdfUploaded: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleItemChange = (idx: number, value: number) => {
    const newItems = [...receivedItems];
    newItems[idx].currentReceived = value;
    setReceivedItems(newItems);
  };

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!order) return null;

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Conferência de Pedido</h1>
            <p className="text-sm text-gray-500 mt-1">Registre o recebimento físico e fiscal da ordem <strong>{order.id}</strong>.</p>
          </div>
        </div>
      </div>

      {!isSuccess ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Conference */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-700">
                  <Package className="w-5 h-5" />
                  <h3 className="font-bold">Conferência de Itens</h3>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                  {order.supplier}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/30 border-b border-gray-100">
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Pedido</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Já Recebido</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-32">Receber Agora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {receivedItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{item.description}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Unitário: R$ {item.unitPrice.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">{item.quantity}</td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-amber-600">{item.receivedQuantity}</td>
                        <td className="px-6 py-4">
                          <input 
                            type="number" 
                            max={item.quantity - item.receivedQuantity}
                            min={0}
                            value={item.currentReceived}
                            onChange={(e) => handleItemChange(idx, parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Registration */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <FileText className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-gray-700">Registro de Nota Fiscal</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número da NF</label>
                    <input 
                      type="text" 
                      value={invoice.number}
                      onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
                      placeholder="000.000.000"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Série</label>
                    <input 
                      type="text" 
                      value={invoice.series}
                      onChange={(e) => setInvoice({ ...invoice, series: e.target.value })}
                      placeholder="1"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data de Emissão</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="date" 
                        value={invoice.issueDate}
                        onChange={(e) => setInvoice({ ...invoice, issueDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload XML</label>
                    <button 
                      onClick={() => setInvoice({ ...invoice, xmlUploaded: true })}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-bold transition-all",
                        invoice.xmlUploaded 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600"
                      )}
                    >
                      {invoice.xmlUploaded ? <><CheckCircle2 className="w-4 h-4" /> XML Carregado</> : <><Upload className="w-4 h-4" /> Selecionar XML</>}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload PDF (DANFE)</label>
                    <button 
                      onClick={() => setInvoice({ ...invoice, pdfUploaded: true })}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl text-sm font-bold transition-all",
                        invoice.pdfUploaded 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600"
                      )}
                    >
                      {invoice.pdfUploaded ? <><CheckCircle2 className="w-4 h-4" /> PDF Carregado</> : <><Upload className="w-4 h-4" /> Selecionar PDF</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900">Resumo do Recebimento</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Itens a Receber</span>
                  <span className="font-bold text-gray-900">
                    {receivedItems.reduce((sum, item) => sum + item.currentReceived, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Valor Total NF</span>
                  <span className="font-bold text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      receivedItems.reduce((sum, item) => sum + (item.currentReceived * item.unitPrice), 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  Ao salvar, o sistema atualizará o estoque e enviará os dados da nota fiscal para o setor financeiro realizar o agendamento do pagamento.
                </p>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSubmitting || !invoice.number || receivedItems.reduce((sum, item) => sum + item.currentReceived, 0) === 0}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
              >
                {isSubmitting ? 'Processando...' : <><Save className="w-4 h-4" /> Finalizar Recebimento</>}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Dados da OC</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Projeto</span>
                  <span className="font-bold text-gray-900">{order.fundingSource}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Condição Pgto</span>
                  <span className="font-bold text-gray-900">{order.paymentCondition}</span>
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recebimento Registrado!</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              A nota fiscal <strong>{invoice.number}</strong> foi lançada com sucesso. O setor financeiro já pode visualizar os pagamentos pendentes.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/recebimento')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Voltar para a Fila
            </button>
            <button 
              onClick={() => navigate('/financeiro/pagamentos')}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
            >
              Ir para o Financeiro <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
