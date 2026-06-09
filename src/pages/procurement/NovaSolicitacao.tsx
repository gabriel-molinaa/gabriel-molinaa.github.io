import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  DollarSign,
  ExternalLink,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PurchaseType, UrgencyLevel, PurchaseRequestItem } from '@/src/types/procurement';
import { generatePurchaseRequestId, getPurchaseRequestById, savePurchaseRequest } from '@/src/lib/requestStore';
import { getRequestFulfillmentSummary, isValidReferenceUrl, normalizeUrgency, planItemFulfillment } from '@/src/lib/procurement';
import { mockStockItems } from '@/src/types/mockData';

const purchaseTypes: PurchaseType[] = ['Material de Consumo', 'Estoque', 'Ativo Imobilizado', 'Serviço'];
const urgencyLevels: UrgencyLevel[] = ['Normal', 'Urgente'];
const unitsOfMeasure = ['Unidade', 'Pacote', 'Resma', 'Caixa', 'Kg', 'Litro', 'Serviço', 'Outro'];

const projectOptions = [
  { value: 'Projeto Inclusão Digital', label: 'Projeto Inclusão Digital', costCenter: 'CC-102 (Informática)' },
  { value: 'Administrativo Geral', label: 'Administrativo Geral', costCenter: 'CC-101 (Administrativo)' },
  { value: 'Manutenção Predial', label: 'Manutenção Predial', costCenter: 'CC-205 (Infraestrutura)' },
  { value: 'Nutrição e Alimentação', label: 'Nutrição e Alimentação', costCenter: 'CC-301 (Nutrição)' },
];

const agreementOptions = [
  { value: '', label: 'Recursos Próprios', fundingSource: 'Recursos Próprios' },
  { value: 'Convênio Municipal 452/2025', label: 'Convênio Municipal 452/2025', fundingSource: 'Prefeitura Municipal' },
  { value: 'Convênio Estadual 123/2024', label: 'Convênio Estadual 123/2024', fundingSource: 'Governo Estadual' },
  { value: 'Doação Específica - Empresa X', label: 'Doação Específica - Empresa X', fundingSource: 'Doação Privada' },
];

const budgetOptions = [
  '3.3.90.30 - Material de Consumo',
  '3.3.90.39 - Outros Serviços de Terceiros',
  '4.4.90.52 - Equipamentos e Material Permanente',
];

function createEmptyItem(): Partial<PurchaseRequestItem> {
  return {
    type: 'Material de Consumo',
    quantity: 1,
    unitOfMeasure: 'Unidade',
    expectedDate: new Date().toISOString().split('T')[0],
    referenceLink: '',
  };
}

export default function NovaSolicitacao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemFormError, setItemFormError] = useState<string | null>(null);
  const editRequestId = searchParams.get('edit') || undefined;
  const editingRequest = getPurchaseRequestById(editRequestId);
  const today = new Date();
  const todayFieldValue = today.toISOString().split('T')[0];
  const todayLabel = new Intl.DateTimeFormat('pt-BR').format(today);
  
  const [requestForm, setRequestForm] = useState(() => ({
    requester: editingRequest?.requester || 'Ana Silva',
    unit: editingRequest?.unit || 'Matriz',
    sector: editingRequest?.sector || '',
    roomNumber: editingRequest?.roomNumber || '',
    project: editingRequest?.project || projectOptions[0].value,
    agreement: editingRequest?.agreement || '',
    workPlan: editingRequest?.workPlan || '',
    budgetCategory: editingRequest?.budgetCategory || budgetOptions[0],
    justification: editingRequest?.justification || '',
    urgency: normalizeUrgency(editingRequest?.urgency),
  }));

  const [items, setItems] = useState<PurchaseRequestItem[]>(editingRequest?.items || []);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PurchaseRequestItem | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<PurchaseRequestItem>>(createEmptyItem());

  const currentProject = projectOptions.find((option) => option.value === requestForm.project) || projectOptions[0];
  const currentAgreement = agreementOptions.find((option) => option.value === requestForm.agreement) || agreementOptions[0];

  const stockFulfilledItems = useMemo(
    () => items.filter((item) => (item.stockQuantity || 0) > 0),
    [items]
  );

  const purchaseNeededItems = useMemo(
    () => items.filter((item) => (item.purchaseQuantity || 0) > 0),
    [items]
  );

  const requestSummary = useMemo(
    () => getRequestFulfillmentSummary({
      id: editingRequest?.id || 'draft',
      date: editingRequest?.date || todayLabel,
      requester: requestForm.requester,
      unit: requestForm.unit,
      sector: requestForm.sector,
      roomNumber: requestForm.roomNumber,
      project: requestForm.project,
      costCenter: currentProject.costCenter,
      agreement: requestForm.agreement,
      fundingSource: currentAgreement.fundingSource,
      workPlan: requestForm.workPlan,
      budgetCategory: requestForm.budgetCategory,
      items,
      justification: requestForm.justification,
      urgency: requestForm.urgency,
      status: editingRequest?.status || 'Rascunho',
      history: editingRequest?.history || [],
    }),
    [currentAgreement.fundingSource, currentProject.costCenter, editingRequest, items, requestForm, todayLabel]
  );

  const newItemPlanning =
    newItem.description && newItem.quantity
      ? planItemFulfillment(
          {
            code: newItem.code,
            description: newItem.description,
            quantity: Number(newItem.quantity),
          },
          requestForm.unit,
          mockStockItems
        )
      : null;

  const updateUnit = (unit: string) => {
    setRequestForm((currentForm) => ({ ...currentForm, unit }));
    setItems((currentItems) =>
      currentItems.map((item) => {
        const fulfillment = planItemFulfillment(item, unit, mockStockItems);
        return { ...item, stockQuantity: fulfillment.stockQuantity, purchaseQuantity: fulfillment.purchaseQuantity };
      })
    );
  };

  const closeItemForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
    setItemFormError(null);
    setNewItem(createEmptyItem());
  };

  const handleAddItem = () => {
    if (!newItem.description?.trim() || !newItem.quantity || Number(newItem.quantity) <= 0) {
      setItemFormError('Informe a descrição e uma quantidade maior que zero.');
      return;
    }

    if (newItem.referenceLink && !isValidReferenceUrl(newItem.referenceLink)) {
      setItemFormError('Informe um link de referência válido iniciando com http:// ou https://.');
      return;
    }

    const fulfillment = planItemFulfillment(
      {
        code: newItem.code,
        description: newItem.description.trim(),
        quantity: Number(newItem.quantity),
      },
      requestForm.unit,
      mockStockItems
    );
    
    const item: PurchaseRequestItem = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      type: newItem.type as PurchaseType,
      code: newItem.code?.trim() || undefined,
      description: newItem.description.trim(),
      quantity: Number(newItem.quantity),
      unitOfMeasure: newItem.unitOfMeasure || 'Unidade',
      expectedDate: newItem.expectedDate || '',
      referenceLink: newItem.referenceLink?.trim() || undefined,
      stockQuantity: fulfillment.stockQuantity,
      purchaseQuantity: fulfillment.purchaseQuantity,
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? item : i));
    } else {
      setItems([...items, item]);
    }
    
    closeItemForm();
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const editItem = (item: PurchaseRequestItem) => {
    setEditingItem(item);
    setNewItem(item);
    setItemFormError(null);
    setShowItemForm(true);
  };

  const buildRequestPayload = (status: 'Rascunho' | 'Aguardando aprovação') => ({
    id: editingRequest?.id || generatePurchaseRequestId(),
    date: editingRequest?.date || todayLabel,
    requester: requestForm.requester,
    unit: requestForm.unit,
    sector: requestForm.sector,
    roomNumber: requestForm.roomNumber || undefined,
    project: requestForm.project,
    costCenter: currentProject.costCenter,
    agreement: requestForm.agreement || undefined,
    fundingSource: currentAgreement.fundingSource,
    workPlan: requestForm.workPlan || undefined,
    budgetCategory: requestForm.budgetCategory || undefined,
    items,
    justification: requestForm.justification,
    urgency: normalizeUrgency(requestForm.urgency),
    status,
    history: [
      ...(editingRequest?.history || []),
      {
        date: `${todayLabel} ${today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        user: requestForm.requester,
        action:
          status === 'Rascunho'
            ? editingRequest
              ? 'Rascunho atualizado'
              : 'Criação do Rascunho'
            : editingRequest
              ? 'Solicitação atualizada e reenviada'
              : 'Solicitação Enviada',
      },
    ],
  });

  const handleSaveDraft = () => {
    if (!requestForm.sector.trim()) {
      alert('Informe o setor ou serviço da solicitação.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const savedRequest = savePurchaseRequest(buildRequestPayload('Rascunho'));
      setIsSaving(false);
      navigate(`/solicitacoes/${savedRequest.id}`);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.sector.trim() || !requestForm.justification.trim()) {
      alert('Preencha a identificação da solicitação e a justificativa antes de enviar.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um item à solicitação.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const savedRequest = savePurchaseRequest(buildRequestPayload('Aguardando aprovação'));
      setIsSubmitting(false);
      navigate(`/solicitacoes/${savedRequest.id}`);
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {editingRequest ? 'Editar Solicitação de Compra' : 'Nova Solicitação de Compra'}
            </h1>
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
                  {editingRequest?.id || `${generatePurchaseRequestId()} (Automático)`}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data da Solicitação</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500">
                  {editingRequest?.date || `${todayLabel} (Hoje)`}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Solicitante</label>
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-gray-500">
                  {requestForm.requester}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unidade da APAE</label>
                <div className="relative">
                  <select
                    required
                    value={requestForm.unit}
                    onChange={(e) => updateUnit(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
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
                  value={requestForm.sector}
                  onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, sector: e.target.value }))}
                  placeholder="Ex: Administrativo, Fisioterapia..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Número da sala</label>
                <input
                  type="text"
                  value={requestForm.roomNumber}
                  onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, roomNumber: e.target.value }))}
                  placeholder="Ex: Sala 05"
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
                  <select
                    required
                    value={requestForm.project}
                    onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, project: e.target.value }))}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {projectOptions.map((project) => (
                      <option key={project.value} value={project.value}>{project.label} ({project.costCenter})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Convênio / Fonte Pagadora</label>
                <div className="relative">
                  <select
                    value={requestForm.agreement}
                    onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, agreement: e.target.value }))}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {agreementOptions.map((agreement) => (
                      <option key={agreement.label} value={agreement.value}>{agreement.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plano de Trabalho / Meta / Etapa</label>
                <input 
                  type="text" 
                  value={requestForm.workPlan}
                  onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, workPlan: e.target.value }))}
                  placeholder="Ex: Meta 1, Etapa 2..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rubrica Orçamentária / Tipo de Despesa</label>
                <div className="relative">
                  <select
                    value={requestForm.budgetCategory}
                    onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, budgetCategory: e.target.value }))}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {budgetOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
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
                  setNewItem(createEmptyItem());
                  setItemFormError(null);
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
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atendimento</th>
                      <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referência</th>
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
                          <div className="flex flex-col gap-1">
                            {(item.stockQuantity || 0) > 0 && (
                              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                Estoque: {item.stockQuantity} {item.unitOfMeasure}
                              </span>
                            )}
                            {(item.purchaseQuantity || 0) > 0 && (
                              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                Compra: {item.purchaseQuantity} {item.unitOfMeasure}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          {item.referenceLink ? (
                            <a
                              href={item.referenceLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                              onClick={(event) => event.stopPropagation()}
                            >
                              Acessar <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-gray-400">Não informado</span>
                          )}
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
                  value={requestForm.justification}
                  onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, justification: e.target.value }))}
                  placeholder="Explique detalhadamente a necessidade desta aquisição..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
                />
              </div>

              <div className="space-y-2 max-w-xs">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grau de Urgência</label>
                <div className="relative">
                  <select
                    required
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm((currentForm) => ({ ...currentForm, urgency: e.target.value as UrgencyLevel }))}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
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
            <h4 className="font-bold text-lg mb-4">Planejamento de Atendimento</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Total de Itens:</span>
                <span className="font-bold">{items.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Atendidos por estoque:</span>
                <span className="font-bold">{requestSummary.stockItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Precisam de compra:</span>
                <span className="font-bold">{requestSummary.purchaseItems + requestSummary.mixedItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Atendimento misto:</span>
                <span className="font-bold">{requestSummary.mixedItems}</span>
              </div>
            </div>
            <p className="text-[10px] text-blue-100 mt-6 leading-relaxed opacity-80">
              O sistema separa automaticamente o que será atendido pelo estoque local e o que seguirá para pedido de compra.
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
                onClick={closeItemForm}
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Link de referência do produto</label>
                  <input 
                    type="url"
                    value={newItem.referenceLink || ''}
                    onChange={(e) => setNewItem({...newItem, referenceLink: e.target.value})}
                    placeholder="https://fornecedor.com/produto"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {newItemPlanning && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Planejamento automático</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                    {newItemPlanning.stockQuantity > 0 && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                        Estoque: {newItemPlanning.stockQuantity} {newItem.unitOfMeasure || 'unid.'}
                      </span>
                    )}
                    {newItemPlanning.purchaseQuantity > 0 && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                        Pedido de compra: {newItemPlanning.purchaseQuantity} {newItem.unitOfMeasure || 'unid.'}
                      </span>
                    )}
                    {newItemPlanning.availableStock === 0 && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">Sem saldo em estoque na unidade</span>
                    )}
                  </div>
                </div>
              )}

              {itemFormError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {itemFormError}
                </div>
              )}

              {(stockFulfilledItems.length > 0 || purchaseNeededItems.length > 0) && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Itens atendidos por estoque</p>
                    <div className="mt-3 space-y-2">
                      {stockFulfilledItems.length > 0 ? stockFulfilledItems.map((item) => (
                        <div key={`stock-${item.id}`} className="rounded-xl bg-white/80 px-3 py-2 text-xs text-emerald-900">
                          <p className="font-bold">{item.description}</p>
                          <p>{item.stockQuantity} {item.unitOfMeasure}</p>
                        </div>
                      )) : <p className="text-xs text-emerald-800">Nenhum item será atendido por estoque.</p>}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Itens que seguirão para compra</p>
                    <div className="mt-3 space-y-2">
                      {purchaseNeededItems.length > 0 ? purchaseNeededItems.map((item) => (
                        <div key={`purchase-${item.id}`} className="rounded-xl bg-white/80 px-3 py-2 text-xs text-amber-900">
                          <p className="font-bold">{item.description}</p>
                          <p>{item.purchaseQuantity} {item.unitOfMeasure}</p>
                        </div>
                      )) : <p className="text-xs text-amber-800">Nenhum item precisa de pedido de compra.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={closeItemForm}
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
