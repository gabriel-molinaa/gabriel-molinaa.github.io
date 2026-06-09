import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle,
  ChevronDown,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShoppingCart,
  Package,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getRequestPlanningFlag } from '@/src/lib/procurement';
import { getPurchaseRequests } from '@/src/lib/requestStore';
import { PurchaseType, RequestStatus, UrgencyLevel } from '@/src/types/procurement';

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

export default function SolicitacoesList({ title = "Solicitações de Compra", onlyMyRequests = false }: { title?: string, onlyMyRequests?: boolean }) {
  const navigate = useNavigate();
  const requests = useMemo(() => getPurchaseRequests(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'Todos'>('Todos');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [unitFilter, setUnitFilter] = useState('Todos');
  const [requesterFilter, setRequesterFilter] = useState('Todos');
  const [urgencyFilter, setUrgencyFilter] = useState<'Todos' | 'Normal' | 'Urgente'>('Todos');
  const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<'Todos' | PurchaseType>('Todos');
  const [planningFilter, setPlanningFilter] = useState<'Todos' | 'Com estoque' | 'Precisa comprar' | 'Misto'>('Todos');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const unitOptions = useMemo(() => ['Todos', ...new Set(requests.map((request) => request.unit))], [requests]);
  const requesterOptions = useMemo(() => ['Todos', ...new Set(requests.map((request) => request.requester))], [requests]);
  const purchaseTypeOptions = useMemo(
    () => ['Todos', ...new Set(requests.flatMap((request) => request.items.map((item) => item.type)))],
    [requests]
  );

  const filteredRequests = requests.filter(req => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = req.id.toLowerCase().includes(searchLower) || 
                         req.requester.toLowerCase().includes(searchLower) ||
                         req.items.some(item => item.description.toLowerCase().includes(searchLower)) ||
                         req.project.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'Todos' || req.status === statusFilter;
    const matchesUnit = unitFilter === 'Todos' || req.unit === unitFilter;
    const matchesRequester = requesterFilter === 'Todos' || req.requester === requesterFilter;
    const matchesUrgency = urgencyFilter === 'Todos' || (req.urgency === urgencyFilter || (req.urgency === 'Emergencial' && urgencyFilter === 'Urgente'));
    const matchesPurchaseType = purchaseTypeFilter === 'Todos' || req.items.some((item) => item.type === purchaseTypeFilter);
    const planningFlag = getRequestPlanningFlag(req);
    const matchesPlanning = planningFilter === 'Todos' ||
      (planningFilter === 'Misto' && planningFlag === 'Misto') ||
      (planningFilter === 'Com estoque' && req.items.some((item) => (item.stockQuantity ?? 0) > 0)) ||
      (planningFilter === 'Precisa comprar' && req.items.some((item) => (item.purchaseQuantity ?? 0) > 0));
    const matchesMyRequests = !onlyMyRequests || req.requester === 'Ana Silva'; // Mocking current user as Ana Silva

    const [day, month, year] = req.date.split('/').map(Number);
    const requestDate = new Date(year, (month || 1) - 1, day || 1);
    const matchesStartDate = !startDateFilter || requestDate >= new Date(startDateFilter);
    const matchesEndDate = !endDateFilter || requestDate <= new Date(endDateFilter);
    
    return matchesSearch && matchesStatus && matchesUnit && matchesRequester && matchesUrgency && matchesPurchaseType && matchesPlanning && matchesStartDate && matchesEndDate && matchesMyRequests;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
    setUnitFilter('Todos');
    setRequesterFilter('Todos');
    setUrgencyFilter('Todos');
    setPurchaseTypeFilter('Todos');
    setPlanningFilter('Todos');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie e acompanhe todos os pedidos de suprimentos.</p>
        </div>
        <button 
          onClick={() => navigate('/solicitacoes/nova')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" /> Nova Solicitação
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, item, projeto ou solicitante..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Em análise">Em análise</option>
                <option value="Aguardando aprovação">Aguardando aprovação</option>
                <option value="Retornada para ajuste">Retornada para ajuste</option>
                <option value="Aprovada">Aprovada</option>
                <option value="Rejeitada">Rejeitada</option>
                <option value="Em cotação">Em cotação</option>
                <option value="Convertida em pedido">Convertida em pedido</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button type="button" onClick={() => setShowAdvancedFilters((current) => !current)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
              <Filter className="w-4 h-4" /> {showAdvancedFilters ? 'Ocultar Filtros' : 'Mais Filtros'}
            </button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <div className="relative">
              <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                {unitOptions.map((option) => <option key={option} value={option}>{option === 'Todos' ? 'Todas as Unidades' : option}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={requesterFilter} onChange={(e) => setRequesterFilter(e.target.value)} className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                {requesterOptions.map((option) => <option key={option} value={option}>{option === 'Todos' ? 'Todos os Solicitantes' : option}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value as 'Todos' | 'Normal' | 'Urgente')} className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                <option value="Todos">Todas as Urgências</option>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={purchaseTypeFilter} onChange={(e) => setPurchaseTypeFilter(e.target.value as 'Todos' | PurchaseType)} className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                {purchaseTypeOptions.map((option) => <option key={option} value={option}>{option === 'Todos' ? 'Todos os Tipos' : option}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={planningFilter} onChange={(e) => setPlanningFilter(e.target.value as 'Todos' | 'Com estoque' | 'Precisa comprar' | 'Misto')} className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                <option value="Todos">Todos os Planejamentos</option>
                <option value="Com estoque">Com itens atendidos por estoque</option>
                <option value="Precisa comprar">Com itens para compra</option>
                <option value="Misto">Somente mistos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <X className="w-4 h-4" /> Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID / Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Itens / Projeto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Unidade / Solicitante</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Urgência</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Planejamento</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  const StatusIcon = statusIcons[req.status];
                  const firstItemDesc = req.items[0]?.description || 'Sem descrição';
                  const itemsCount = req.items.length;
                  const planningFlag = getRequestPlanningFlag(req);

                  return (
                    <tr 
                      key={req.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/solicitacoes/${req.id}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{req.id}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <Calendar className="w-3 h-3" /> {req.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            urgencyColors[req.urgency]
                          )} />
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {firstItemDesc} {itemsCount > 1 ? `(+${itemsCount - 1})` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <Tag className="w-3 h-3" /> {req.project}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Package className="w-3 h-3 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{req.unit}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 ml-8">
                          <User className="w-3 h-3" /> {req.requester}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 ml-8">{req.sector}{req.roomNumber ? ` • ${req.roomNumber}` : ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            req.urgency === 'Urgente' || req.urgency === 'Emergencial' ? 'bg-amber-500' : urgencyColors[req.urgency]
                          )} />
                          <span className="text-xs font-medium text-gray-700">{req.urgency === 'Emergencial' ? 'Urgente' : req.urgency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                            planningFlag === 'Estoque' ? 'bg-emerald-50 text-emerald-700' : planningFlag === 'Compra' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                          )}>
                            {planningFlag === 'Compra' ? 'Pedido de compra' : planningFlag}
                          </span>
                          <p className="text-[10px] text-gray-400">
                            Estoque: {req.items.reduce((total, item) => total + (item.stockQuantity ?? 0), 0)} • Compra: {req.items.reduce((total, item) => total + (item.purchaseQuantity ?? 0), 0)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          statusColors[req.status]
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Actions menu
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
                      <p className="text-sm">Tente ajustar seus filtros ou busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Mostrando {filteredRequests.length} de {requests.length} solicitações</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
