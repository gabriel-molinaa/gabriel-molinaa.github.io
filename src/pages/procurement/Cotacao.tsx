import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
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
  ShoppingCart,
  Building2,
  Clock,
  CreditCard,
  ShieldCheck,
  Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockRequests } from '@/src/types/mockData';

export default function Cotacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = mockRequests.find(r => r.id === id);
  
  const [suppliers, setSuppliers] = useState([
    { id: '1', name: '', unitPrice: 0, deliveryTime: '', paymentTerms: '', technicalCompliance: true }
  ]);

  const addSupplier = () => {
    setSuppliers([...suppliers, { id: Date.now().toString(), name: '', unitPrice: 0, deliveryTime: '', paymentTerms: '', technicalCompliance: true }]);
  };

  const removeSupplier = (id: string) => {
    if (suppliers.length === 1) return;
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const updateSupplier = (id: string, field: string, value: any) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, [field]: value } : s));
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Registro de Cotação</h1>
            <p className="text-sm text-gray-500 mt-1">Insira as propostas recebidas para comparação.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Supplier Forms */}
        <div className="lg:col-span-2 space-y-6">
          {suppliers.map((supplier, idx) => (
            <div key={supplier.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="w-5 h-5" />
                  <h3 className="font-bold">Fornecedor {idx + 1}</h3>
                </div>
                {suppliers.length > 1 && (
                  <button 
                    onClick={() => removeSupplier(supplier.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome do Fornecedor</label>
                    <input 
                      type="text" 
                      value={supplier.name}
                      onChange={(e) => updateSupplier(supplier.id, 'name', e.target.value)}
                      placeholder="Ex: Papelaria Central Ltda"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor Unitário (R$)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="number" 
                        value={supplier.unitPrice}
                        onChange={(e) => updateSupplier(supplier.id, 'unitPrice', parseFloat(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Prazo de Entrega
                    </label>
                    <input 
                      type="text" 
                      value={supplier.deliveryTime}
                      onChange={(e) => updateSupplier(supplier.id, 'deliveryTime', e.target.value)}
                      placeholder="Ex: 5 dias úteis"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Condição de Pagamento
                    </label>
                    <input 
                      type="text" 
                      value={supplier.paymentTerms}
                      onChange={(e) => updateSupplier(supplier.id, 'paymentTerms', e.target.value)}
                      placeholder="Ex: 30 dias"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Conformidade Técnica
                    </label>
                    <div className="flex items-center gap-4 h-[42px]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          checked={supplier.technicalCompliance === true}
                          onChange={() => updateSupplier(supplier.id, 'technicalCompliance', true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Sim</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          checked={supplier.technicalCompliance === false}
                          onChange={() => updateSupplier(supplier.id, 'technicalCompliance', false)}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-sm text-gray-700">Não</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={addSupplier}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Adicionar Outro Fornecedor
          </button>
        </div>

        {/* Sidebar - Request Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Dados da Demanda</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rubrica / Item</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{request.budgetCategory}</p>
                <p className="text-xs text-gray-500 mt-0.5">{request.items[0]?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Itens</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{request.items.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Urgência</p>
                  <p className="text-sm font-bold text-amber-600 mt-1">{request.urgency}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[10px] text-blue-700 leading-relaxed">
                Para compras acima de R$ 5.000,00, é obrigatório o registro de pelo menos <strong>3 cotações</strong> para conformidade com a auditoria.
              </p>
            </div>

            <button 
              onClick={() => navigate(`/compras/comparativo/${request.id}`)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <CheckCircle2 className="w-4 h-4" /> Finalizar e Comparar
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Anexos da Solicitação</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-[10px] text-gray-600">
                <FileText className="w-3 h-3" /> Especificacao_Tecnica.pdf
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
