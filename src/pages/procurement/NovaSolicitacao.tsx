import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Paperclip, 
  Info, 
  AlertTriangle,
  Plus,
  Trash2,
  ChevronDown,
  History,
  User,
  Calendar,
  Tag,
  Package,
  MapPin,
  DollarSign,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PurchaseType, UrgencyLevel, PurchaseRequestItem } from '@/src/types/procurement';

const purchaseTypes: PurchaseType[] = ['Material de Consumo', 'Estoque', 'Ativo Imobilizado', 'Serviço'];
const urgencyLevels: UrgencyLevel[] = ['Normal', 'Urgente', 'Emergencial'];
const unitsOfMeasure = ['Unidade', 'Pacote', 'Resma', 'Caixa', 'Kg', 'Litro', 'Serviço', 'Outro'];

export default function NovaSolicitacao() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [items, setItems] = useState<PurchaseRequestItem[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PurchaseRequestItem | null>(null);
  
  // New Item State
  const [newItem, setNewItem] = useState<Partial<PurchaseRequestItem>>({
    type: 'Material de Consumo',
    quantity: 1,
    unitOfMeasure: 'Unidade',
    estimatedValue: 0,
    expectedDate: new Date().toISOString().split('T')[0],
  });

  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity) return;
    
    const item: PurchaseRequestItem = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      type: newItem.type as PurchaseType,
      code: newItem.code,
      description: newItem.description,
      quantity: Number(newItem.quantity),
      unitOfMeasure: newItem.unitOfMeasure || 'Unidade',
      estimatedValue: Number(newItem.estimatedValue) || 0,
      expectedDate: newItem.expectedDate || '',
      deliveryLocation: newItem.deliveryLocation || '',
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? item : i));
    } else {
      setItems([...items, item]);
    }
    
    setShowItemForm(false);
    setEditingItem(null);
    setNewItem({
      type: 'Material de Consumo',
      quantity: 1,
      unitOfMeasure: 'Unidade',
      estimatedValue: 0,
      expectedDate: new Date().toISOString().split('T')[0],
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const editItem = (item: PurchaseRequestItem) => {
    setEditingItem(item);
    setNewItem(item);
    setShowItemForm(true);
  };

  const totalEstimated = items.reduce((acc, item) => acc + (item.estimatedValue * item.quantity), 0);

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/solicitacoes');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Adicione pelo menos um item à solicitação.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/solicitacoes');
    }, 1500);
  };

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Nova Solicitação de Compra</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para iniciar o processo de aquisição.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button 
            form="request-form"
            type="submit"
            disabled={isSaving || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {isSubmitting ? 'Enviando...' : 'Enviar para Aprovação'}
          </button>
        </div>
      </div>

      <form id="request-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Identificação da Solicitação */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">1. Identificação da Solicitação</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número da Solicitação</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500">
                  SOL-2026-XXX (Automático)
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data da Solicitação</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500">
                  01/04/2026 (Hoje)
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Solicitante</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500">
                  Ana Silva
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unidade da APAE</label>
                <div className="relative">
                  <select required className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option value="Matriz">Matriz</option>
                    <option value="Unidade 2">Unidade 2</option>
                    <option value="Unidade 3">Unidade 3</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Setor / Serviço</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Administrativo, Fisioterapia..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </section>

          {/* 2. Vínculo Orçamentário e Institucional */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">2. Vínculo Orçamentário e Institucional</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Projeto / Centro de Custo</label>
                <div className="relative">
                  <select required className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option value="">Selecione o projeto</option>
                    <option value="1">Projeto Inclusão Digital (CC-102)</option>
                    <option value="2">Administrativo Geral (CC-101)</option>
                    <option value="3">Manutenção Predial (CC-205)</option>
                    <option value="4">Nutrição e Alimentação (CC-301)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Convênio / Fonte Pagadora</label>
                <div className="relative">
                  <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option value="">Recursos Próprios</option>
                    <option value="1">Convênio Municipal 452/2025</option>
                    <option value="2">Convênio Estadual 123/2024</option>
                    <option value="3">Doação Específica - Empresa X</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plano de Trabalho / Meta / Etapa</label>
                <input 
                  type="text" 
                  placeholder="Ex: Meta 1, Etapa 2..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rubrica Orçamentária / Tipo de Despesa</label>
                <div className="relative">
                  <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option value="">Selecione a rubrica</option>
                    <option value="1">3.3.90.30 - Material de Consumo</option>
                    <option value="2">3.3.90.39 - Outros Serviços de Terceiros</option>
                    <option value="3">4.4.90.52 - Equipamentos e Material Permanente</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Itens da Solicitação */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900">3. Itens da Solicitação</h3>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setEditingItem(null);
                  setNewItem({
                    type: 'Material de Consumo',
                    quantity: 1,
                    unitOfMeasure: 'Unidade',
                    estimatedValue: 0,
                    expectedDate: new Date().toISOString().split('T')[0],
                  });
                  setShowItemForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all"
              >
                <Plus className="w-4 h-4" /> Adicionar Item
              </button>
            </div>

            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item / Descrição</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qtd / Unid</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vlr. Est. Unit</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total Est.</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
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
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button"
                              onClick={() => editItem(item)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">Nenhum item adicionado ainda.</p>
                <p className="text-xs text-gray-400 mt-1">Clique em "Adicionar Item" para começar.</p>
              </div>
            )}
          </section>

          {/* 4. Justificativa */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">4. Justificativa</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Justificativa Detalhada da Compra</label>
                <textarea 
                  required
                  placeholder="Explique detalhadamente a necessidade desta aquisição..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
                />
              </div>

              <div className="space-y-2 max-w-xs">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grau de Urgência</label>
                <div className="relative">
                  <select required className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    {urgencyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* 5. Anexos */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Paperclip className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900">5. Anexos e Documentos Complementares</h3>
              </div>
              <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Adicionar Arquivo
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                <Paperclip className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-600">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG ou Excel (máx. 10MB)</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Exemplos de documentos:</p>
                <ul className="space-y-1.5">
                  {['Especificação Técnica', 'Orçamento Prévio', 'Imagem do Produto', 'Parecer Técnico'].map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Form Content */}
        <div className="space-y-6">
          {/* 6. Acompanhamento e Rastreabilidade */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <History className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-gray-900">Acompanhamento</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Atual</label>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Save className="w-3 h-3" />
                    Rascunho
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Histórico / Timeline</label>
                <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
                    <p className="text-xs font-bold text-gray-900">Criação da Solicitação</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">01/04/2026 15:11 • Ana Silva</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500">Criado por: <span className="font-bold text-gray-700">Ana Silva</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500">Última alteração: <span className="font-bold text-gray-700">Hoje, 15:11</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <h4 className="font-bold text-lg mb-4">Resumo Financeiro</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Total de Itens:</span>
                <span className="font-bold">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Data Prevista:</span>
                <span className="font-bold">A definir</span>
              </div>
              <div className="h-px bg-white/20 my-2" />
              <div className="flex justify-between items-end">
                <span className="text-blue-100 text-xs uppercase font-bold">Total Estimado:</span>
                <div className="text-right">
                  <p className="text-2xl font-black leading-none">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEstimated)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-blue-100 mt-6 leading-relaxed opacity-80">
              Esta solicitação passará por análise de alçada e disponibilidade orçamentária antes de seguir para cotação.
            </p>
          </div>
        </div>
      </form>

      {/* Item Modal / Form Overlay */}
      {showItemForm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
              <button 
                onClick={() => setShowItemForm(false)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo de Compra</label>
                  <div className="relative">
                    <select 
                      value={newItem.type}
                      onChange={(e) => setNewItem({...newItem, type: e.target.value as PurchaseType})}
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      {purchaseTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código do Item (Opcional)</label>
                  <input 
                    type="text" 
                    value={newItem.code || ''}
                    onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                    placeholder="Ex: MAT-001"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição Detalhada</label>
                <textarea 
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Descreva o item com especificações técnicas..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantidade</label>
                  <input 
                    type="number" 
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidade</label>
                  <div className="relative">
                    <select 
                      value={newItem.unitOfMeasure}
                      onChange={(e) => setNewItem({...newItem, unitOfMeasure: e.target.value})}
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      {unitsOfMeasure.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor Est. Unitário</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                    <input 
                      type="number" 
                      value={newItem.estimatedValue || ''}
                      onChange={(e) => setNewItem({...newItem, estimatedValue: Number(e.target.value)})}
                      placeholder="0,00"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data Prevista de Uso</label>
                  <input 
                    type="date" 
                    value={newItem.expectedDate || ''}
                    onChange={(e) => setNewItem({...newItem, expectedDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Local de Entrega</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={newItem.deliveryLocation || ''}
                      onChange={(e) => setNewItem({...newItem, deliveryLocation: e.target.value})}
                      placeholder="Ex: Almoxarifado"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setShowItemForm(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleAddItem}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                {editingItem ? 'Salvar Alterações' : 'Adicionar Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
