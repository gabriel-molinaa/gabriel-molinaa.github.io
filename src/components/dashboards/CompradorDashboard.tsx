import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  FileCheck, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Plus,
  Layers,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const stats = [
  { name: 'Cotações Ativas', value: '08', icon: Search, color: 'bg-blue-500' },
  { name: 'Pedidos Pendentes', value: '15', icon: ShoppingCart, color: 'bg-amber-500' },
  { name: 'Contratos a Vencer', value: '03', icon: FileCheck, color: 'bg-emerald-500' },
  { name: 'Economia (Saving)', value: '12%', icon: TrendingUp, color: 'bg-purple-500' },
];

const processes = [
  { id: 'PROC-2026-012', title: 'Material de Limpeza - Semestre 1', status: 'Em Cotação', suppliers: '4/5', deadline: '05/04/2026', priority: 'Alta' },
  { id: 'PROC-2026-015', title: 'Equipamentos de Informática', status: 'Aguardando Emissão', suppliers: '3/3', deadline: '02/04/2026', priority: 'Alta' },
  { id: 'PROC-2026-018', title: 'Insumos Médicos - Unidade Sul', status: 'Consolidando Demandas', suppliers: '0/0', deadline: '10/04/2026', priority: 'Média' },
  { id: 'PROC-2026-020', title: 'Manutenção de Frota', status: 'Em Cotação', suppliers: '2/5', deadline: '08/04/2026', priority: 'Baixa' },
];

const recurringItems = [
  { name: 'Papel A4 75g', usage: 'Alto', lastPrice: 'R$ 24,50', suggestion: 'Compra em Lote' },
  { name: 'Detergente Industrial', usage: 'Médio', lastPrice: 'R$ 12,90', suggestion: 'Contrato Anual' },
];

export default function CompradorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Painel de Compras</h2>
          <p className="text-sm text-gray-500">Gestão de processos, cotações e contratos.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <Layers className="w-4 h-4" /> Consolidar Demandas
          </button>
          <button 
            onClick={() => navigate('/solicitacoes/nova')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus className="w-4 h-4" /> Novo Processo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Processos em Andamento</h3>
            <button className="text-xs font-bold text-blue-600">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">ID / Processo</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Cotações</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Prazo</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processes.map((proc) => (
                  <tr key={proc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{proc.id}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{proc.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        proc.status === 'Em Cotação' ? "bg-blue-100 text-blue-700" :
                        proc.status === 'Aguardando Emissão' ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {proc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">
                      {proc.suppliers}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {proc.deadline}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/solicitacoes/${proc.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recurring Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Sugestões de Compra
            </h4>
            <div className="space-y-4">
              {recurringItems.map((item) => (
                <div key={item.name} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-gray-900">{item.name}</p>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {item.usage}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">Último preço: {item.lastPrice}</p>
                  <p className="text-[10px] font-semibold text-emerald-600 mt-2">
                    Sugestão: {item.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <AlertCircle className="w-4 h-4" />
              <h4 className="font-bold text-sm">Contratos a Vencer</h4>
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">
              O contrato de <strong>Manutenção de Elevadores</strong> expira em 15 dias. Inicie o processo de renovação ou nova licitação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
